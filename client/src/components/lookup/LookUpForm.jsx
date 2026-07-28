// client/src/components/lookup/LookUpForm.jsx

import { useEffect, useState } from 'react'
import { useCertificatePdf } from '../../hooks/useCertificatePdf'
import { getConfig } from '../../services/config'
import { searchCertificates } from '../../services/certificates'
import { formatDisplayDate } from '../../utils/formatDate'

export function LookUpForm() {
  const [options, setOptions] = useState(null)
  const [optionsError, setOptionsError] = useState(null)

  const [values, setValues] = useState({ state: '', prefix: '', number: '', suffix: '' })

  const [query, setQuery] = useState(null)
  const [page, setPage] = useState(1)
  const [result, setResult] = useState(null)
  const [searchError, setSearchError] = useState(null)
  const [isSearching, setIsSearching] = useState(false)

  const { openCertificate, openingId, error: openError } = useCertificatePdf()

  // search option fetch
  useEffect(() => {
    async function load() {
      try {
        setOptions(await getConfig())
      } catch (err) {
        setOptionsError(err.message || 'failed to load search options')
      }
    }
    load()
  }, [])

  // certificate search fetch
  useEffect(() => {
    if (!query) {
      return
    }
    async function search() {
      setIsSearching(true)
      setSearchError(null)
      try {
        setResult(await searchCertificates({ ...query, page }))
      } catch (err) {
        setSearchError(err.message || 'search failed')
      } finally {
        setIsSearching(false)
      }
    }
    search()
  }, [query, page])

  function handleChange(field) {
    return (event) => setValues((current) => ({ ...current, [field]: event.target.value }))
  }

  // search submit handler
  function handleSubmit(event) {
    event.preventDefault()
    const licenseNumber = values.suffix
      ? `${values.prefix}.${values.number}.${values.suffix}`
      : `${values.prefix}.${values.number}`
    setPage(1)
    setQuery({ state: values.state, licenseNumber })
  }

  if (optionsError) {
    return <p role="alert">{optionsError}</p>
  }

  if (!options) {
    return <p role="status">Loading…</p>
  }

  return (
    <div className="lookup-form">
      <form onSubmit={handleSubmit}>
        <label htmlFor="lookup-state">State</label>
        <select id="lookup-state" value={values.state} onChange={handleChange('state')} required>
          <option value="" disabled>
            Select a state
          </option>
          {options.states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>

        <label htmlFor="lookup-prefix">License prefix</label>
        <select id="lookup-prefix" value={values.prefix} onChange={handleChange('prefix')} required>
          <option value="" disabled>
            Select a prefix
          </option>
          {options.license_prefixes.map((prefix) => (
            <option key={prefix} value={prefix}>
              {prefix}
            </option>
          ))}
        </select>

        <label htmlFor="lookup-number">License number</label>
        <input
          id="lookup-number"
          type="text"
          value={values.number}
          onChange={handleChange('number')}
          required
        />

        <label htmlFor="lookup-suffix">License suffix</label>
        <select id="lookup-suffix" value={values.suffix} onChange={handleChange('suffix')}>
          <option value="">None</option>
          {options.license_suffixes.map((suffix) => (
            <option key={suffix} value={suffix}>
              {suffix}
            </option>
          ))}
        </select>

        <button type="submit" disabled={isSearching}>
          {isSearching ? 'Searching…' : 'Search'}
        </button>
      </form>

      {searchError && <p role="alert">{searchError}</p>}
      {openError && <p role="alert">{openError}</p>}

      {/* results */}
      {result && (
        <>
          {result.items.length === 0 ? (
            <p>No certificates found.</p>
          ) : (
            <ul className="lookup-results">
              {result.items.map((item) => (
                <li key={item.public_id}>
                  <a
                    href="#"
                    onClick={(event) => {
                      event.preventDefault()
                      if (openingId !== item.public_id) {
                        openCertificate(item.public_id)
                      }
                    }}
                    aria-disabled={openingId === item.public_id}
                  >
                    {item.course_name} ({item.course_number}) — completed{' '}
                    {formatDisplayDate(item.completion_date)}
                    {openingId === item.public_id ? ' (opening…)' : ''}
                  </a>
                </li>
              ))}
            </ul>
          )}

          {/* pagination */}
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
    </div>
  )
}
