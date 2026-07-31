// client/src/pages/CourseDetailPage.jsx

import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AttendeeForm } from '../components/attendees/AttendeeForm'
import { AttendeeSearch } from '../components/attendees/AttendeeSearch'
import { ConfirmDialog } from '../components/layout/ConfirmDialog'
import { useAttendeeSearch } from '../hooks/useAttendeeSearch'
import { deleteAttendee, updateAttendee } from '../services/attendees'
import { deleteCourse, getCourse } from '../services/courses'
import { formatDisplayDate } from '../utils/formatDate'

export function CourseDetailPage() {
  const { courseId } = useParams()
  const navigate = useNavigate()

  // course state
  const [course, setCourse] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // attendee search + pagination
  const {
    query,
    setQuery,
    page,
    setPage,
    pageItems,
    totalPages,
    attendeeCount,
    isLoading: isAttendeesLoading,
    error: attendeesError,
    refresh: refreshAttendees,
  } = useAttendeeSearch(courseId)
  const [editingAttendeeId, setEditingAttendeeId] = useState(null)
  const [deleteError, setDeleteError] = useState(null)

  // pending delete confirmation: { type: 'course' } or { type: 'attendee', id, name }
  const [confirmDelete, setConfirmDelete] = useState(null)

  // course fetch
  useEffect(() => {
    async function load() {
      setIsLoading(true)
      setError(null)
      try {
        setCourse(await getCourse(courseId))
      } catch (err) {
        setError(err.message || 'failed to load course')
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [courseId])

  // attendee update handler
  async function handleUpdateAttendee(attendeeId, values) {
    await updateAttendee(courseId, attendeeId, values)
    setEditingAttendeeId(null)
    await refreshAttendees()
  }

  // delete confirmation handlers
  async function handleConfirmDelete() {
    if (confirmDelete.type === 'course') {
      try {
        await deleteCourse(courseId)
        navigate('/dashboard')
      } catch (err) {
        setError(err.message || 'failed to delete course')
      }
    } else {
      try {
        await deleteAttendee(courseId, confirmDelete.id)
        await refreshAttendees()
      } catch (err) {
        setDeleteError(err.message || 'failed to delete attendee')
      }
    }
    setConfirmDelete(null)
  }

  function handleCancelDelete() {
    setConfirmDelete(null)
  }

  if (isLoading) {
    return <p role="status">Loading…</p>
  }

  if (error) {
    return <p role="alert">{error}</p>
  }

  return (
    <section>
      <h1>{course.course_name}</h1>
      <dl>
        <dt>Course Number</dt>
        <dd>{course.course_number}</dd>
        <dt>Type</dt>
        <dd>{course.course_type}</dd>
        <dt>Sponsored By</dt>
        <dd>{course.sponsored_by}</dd>
        <dt>State</dt>
        <dd>{course.state}</dd>
        <dt>Hours</dt>
        <dd>{course.hours}</dd>
        <dt>Category</dt>
        <dd>{course.course_category}</dd>
        <dt>Signer Name</dt>
        <dd>{course.signer_name}</dd>
        <dt>Certificate Template</dt>
        <dd>{course.certificate_template_key || 'None'}</dd>
      </dl>
      <div className="course-actions">
        <Link to={`/courses/${course.id}/edit`} className="button-link">
          Edit
        </Link>
        <button
          type="button"
          className="button-danger"
          onClick={() => setConfirmDelete({ type: 'course' })}
        >
          Delete
        </button>
        <Link to="/dashboard">Back to dashboard</Link>
      </div>

      <h2>Attendees</h2>

      <AttendeeSearch value={query} onChange={setQuery} />

      {attendeesError && <p role="alert">{attendeesError}</p>}
      {deleteError && <p role="alert">{deleteError}</p>}

      {isAttendeesLoading ? (
        <p role="status">Loading…</p>
      ) : (
        <>
          {pageItems.length === 0 ? (
            <p>{query ? 'No matching attendees.' : 'No attendees yet.'}</p>
          ) : (
            <table className="attendee-table data-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>License Number</th>
                  <th>Completion Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {/* inline edit row */}
                {pageItems.map((attendee) =>
                  editingAttendeeId === attendee.id ? (
                    <tr key={attendee.id}>
                      <td colSpan={4}>
                        <AttendeeForm
                          initialValues={attendee}
                          onSubmit={(values) => handleUpdateAttendee(attendee.id, values)}
                          onCancel={() => setEditingAttendeeId(null)}
                          submitLabel="Save"
                        />
                      </td>
                    </tr>
                  ) : (
                    <tr key={attendee.id}>
                      <td>{attendee.student_name}</td>
                      <td>{attendee.student_license_number}</td>
                      <td>{formatDisplayDate(attendee.completion_date)}</td>
                      <td>
                        <button type="button" onClick={() => setEditingAttendeeId(attendee.id)}>
                          Edit
                        </button>
                        <button
                          type="button"
                          className="button-danger"
                          onClick={() =>
                            setConfirmDelete({
                              type: 'attendee',
                              id: attendee.id,
                              name: attendee.student_name,
                            })
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          )}

          {/* pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button type="button" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                Previous
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        open={confirmDelete !== null}
        title={confirmDelete?.type === 'course' ? 'Delete this course?' : 'Delete this attendee?'}
        message={
          confirmDelete?.type === 'course'
            ? `This will permanently delete "${course.course_name}" and its ${attendeeCount} attendee${attendeeCount === 1 ? '' : 's'}. This cannot be undone.`
            : `This will permanently delete ${confirmDelete?.name}. This cannot be undone.`
        }
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </section>
  )
}
