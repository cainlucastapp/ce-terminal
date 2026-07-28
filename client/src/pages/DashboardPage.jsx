// client/src/pages/DashboardPage.jsx

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AttendeeCsvImporter } from '../components/attendees/AttendeeCsvImporter'
import { useAuth } from '../hooks/useAuth'
import { listCourses } from '../services/courses'

export function DashboardPage() {
  const { user } = useAuth()

  // course list + pagination state
  const [page, setPage] = useState(1)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // CSV import state
  const [importingCourseId, setImportingCourseId] = useState(null)
  const [importSummary, setImportSummary] = useState(null)

  // course list fetch
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

  // import-start handler
  function handleStartImport(course) {
    setImportSummary(null)
    setImportingCourseId(course.id)
  }

  // import-complete handler
  function handleImportComplete(course, errors) {
    setImportingCourseId(null)
    setImportSummary({ courseName: course.course_name, errors })
  }

  return (
    <section>
      <h1>Welcome, {user.first_name}</h1>

      <p>
        <Link to="/courses/new">New course</Link>
      </p>

      {error && <p role="alert">{error}</p>}

      {/* import summary */}
      {importSummary && (
        <div role="status">
          <p>
            Imported attendees for {importSummary.courseName}: {importSummary.errors.length}{' '}
            row(s) failed.
          </p>
          {importSummary.errors.length > 0 && (
            <ul>
              {importSummary.errors.map((failure, index) => (
                <li key={index}>
                  {failure.row.student_name || '(unknown)'}: {failure.message}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

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
                  <button type="button" onClick={() => handleStartImport(course)}>
                    Import attendees
                  </button>

                  {/* inline importer */}
                  {importingCourseId === course.id && (
                    <div className="csv-import">
                      <button type="button" onClick={() => setImportingCourseId(null)}>
                        Cancel
                      </button>
                      <AttendeeCsvImporter
                        courseId={course.id}
                        onComplete={(errors) => handleImportComplete(course, errors)}
                      />
                    </div>
                  )}
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
    </section>
  )
}
