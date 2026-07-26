// client/src/pages/DashboardPage.jsx

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { listCourses } from '../services/courses'

export function DashboardPage() {
  const { user } = useAuth()
  const [page, setPage] = useState(1)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setIsLoading(true)
      try {
        setResult(await listCourses({ page }))
      } catch (err) {
        setError(err.message || 'failed to load courses')
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [page])

  return (
    <section>
      <h1>Welcome, {user.first_name}</h1>

      <p>
        <Link to="/courses/new">New course</Link>
      </p>

      {error && <p role="alert">{error}</p>}

      {isLoading || !result ? (
        <p role="status">Loading…</p>
      ) : (
        <>
          {result.items.length === 0 ? (
            <p>No courses yet.</p>
          ) : (
            <ul className="course-list">
              {result.items.map((course) => (
                <li key={course.id}>
                  <Link to={`/courses/${course.id}`}>{course.course_name}</Link>
                  {' — '}
                  {course.course_number} — {course.state}
                </li>
              ))}
            </ul>
          )}

          {result.pages > 1 && (
            <div className="pagination">
              <button type="button" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                Previous
              </button>
              <span>
                Page {result.page} of {result.pages}
              </span>
              <button type="button" disabled={page >= result.pages} onClick={() => setPage(page + 1)}>
                Next
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )
}
