// client/src/hooks/useAttendeeSearch.js

import { useMemo, useState, useEffect } from 'react'
import { listAttendees } from '../services/attendees'

const PER_PAGE = 10
const ROSTER_PAGE_SIZE = 100

// treats the typed text as a literal substring, not a regex pattern
function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// loops until every page of the roster is in, not just the first
async function fetchRoster(courseId) {
  let items = []
  let currentPage = 1
  let totalPages
  do {
    const result = await listAttendees(courseId, { page: currentPage, perPage: ROSTER_PAGE_SIZE })
    items = items.concat(result.items)
    totalPages = result.pages
    currentPage += 1
  } while (currentPage <= totalPages)
  return items
}

export function useAttendeeSearch(courseId) {
  // full roster + load state
  const [attendees, setAttendees] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // search + pagination state
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)

  // roster load, called on mount/courseId change and on demand
  async function loadRoster() {
    setIsLoading(true)
    setError(null)
    try {
      setAttendees(await fetchRoster(courseId))
    } catch (err) {
      setError(err.message || 'failed to load attendees')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    async function load() {
      setIsLoading(true)
      setError(null)
      try {
        setAttendees(await fetchRoster(courseId))
      } catch (err) {
        setError(err.message || 'failed to load attendees')
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [courseId])

  // search change handler, resets to page 1 on every new search
  function updateQuery(value) {
    setQuery(value)
    setPage(1)
  }

  // filtered results
  const results = useMemo(() => {
    const trimmed = query.trim()
    if (!trimmed) {
      return attendees
    }
    const pattern = new RegExp(escapeRegExp(trimmed), 'i')
    return attendees.filter(
      (attendee) =>
        pattern.test(attendee.student_name) ||
        pattern.test(attendee.student_license_number) ||
        pattern.test(attendee.completion_date),
    )
  }, [attendees, query])

  // current page slice
  const totalPages = Math.max(1, Math.ceil(results.length / PER_PAGE))
  const pageItems = results.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return {
    query,
    setQuery: updateQuery,
    page,
    setPage,
    pageItems,
    totalPages,
    isLoading,
    error,
    refresh: loadRoster,
  }
}
