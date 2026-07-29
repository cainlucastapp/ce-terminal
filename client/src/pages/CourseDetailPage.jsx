// client/src/pages/CourseDetailPage.jsx

import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AttendeeForm } from '../components/attendees/AttendeeForm'
import { deleteAttendee, listAttendees, updateAttendee } from '../services/attendees'
import { deleteCourse, getCourse } from '../services/courses'

export function CourseDetailPage() {
  const { courseId } = useParams()
  const navigate = useNavigate()

  // course state
  const [course, setCourse] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // attendee list state
  const [attendeesPage, setAttendeesPage] = useState(1)
  const [attendeesResult, setAttendeesResult] = useState(null)
  const [attendeesError, setAttendeesError] = useState(null)
  const [editingAttendeeId, setEditingAttendeeId] = useState(null)

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

  // attendee list fetch
  useEffect(() => {
    async function loadAttendees() {
      try {
        setAttendeesResult(await listAttendees(courseId, { page: attendeesPage }))
      } catch (err) {
        setAttendeesError(err.message || 'failed to load attendees')
      }
    }
    loadAttendees()
  }, [courseId, attendeesPage])

  // attendee list refetch
  async function refreshAttendees() {
    setAttendeesResult(await listAttendees(courseId, { page: attendeesPage }))
  }

  // course delete handler
  async function handleDeleteCourse() {
    if (!window.confirm('Delete this course? This also deletes its attendees.')) {
      return
    }
    try {
      await deleteCourse(courseId)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'failed to delete course')
    }
  }

  // attendee update handler
  async function handleUpdateAttendee(attendeeId, values) {
    await updateAttendee(courseId, attendeeId, values)
    setEditingAttendeeId(null)
    await refreshAttendees()
  }

  // attendee delete handler
  async function handleDeleteAttendee(attendeeId) {
    if (!window.confirm('Delete this attendee record?')) {
      return
    }
    try {
      await deleteAttendee(courseId, attendeeId)
      await refreshAttendees()
    } catch (err) {
      setAttendeesError(err.message || 'failed to delete attendee')
    }
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
        <button type="button" className="button-danger" onClick={handleDeleteCourse}>
          Delete
        </button>
        <Link to="/dashboard">Back to dashboard</Link>
      </div>

      <h2>Attendees</h2>

      {attendeesError && <p role="alert">{attendeesError}</p>}

      {!attendeesResult ? (
        <p role="status">Loading…</p>
      ) : (
        <>
          {attendeesResult.items.length === 0 ? (
            <p>No attendees yet.</p>
          ) : (
            <ul className="attendee-list item-list">
              {/* inline edit row */}
              {attendeesResult.items.map((attendee) =>
                editingAttendeeId === attendee.id ? (
                  <li key={attendee.id}>
                    <AttendeeForm
                      initialValues={attendee}
                      onSubmit={(values) => handleUpdateAttendee(attendee.id, values)}
                      onCancel={() => setEditingAttendeeId(null)}
                      submitLabel="Save changes"
                    />
                  </li>
                ) : (
                  <li key={attendee.id}>
                    {attendee.student_name} — {attendee.student_license_number} —{' '}
                    {attendee.completion_date}
                    <button type="button" onClick={() => setEditingAttendeeId(attendee.id)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="button-danger"
                      onClick={() => handleDeleteAttendee(attendee.id)}
                    >
                      Delete
                    </button>
                  </li>
                ),
              )}
            </ul>
          )}

          {/* pagination */}
          {attendeesResult.pages > 1 && (
            <div className="pagination">
              <button
                type="button"
                disabled={attendeesPage <= 1}
                onClick={() => setAttendeesPage(attendeesPage - 1)}
              >
                Previous
              </button>
              <span>
                Page {attendeesResult.page} of {attendeesResult.pages}
              </span>
              <button
                type="button"
                disabled={attendeesPage >= attendeesResult.pages}
                onClick={() => setAttendeesPage(attendeesPage + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )
}
