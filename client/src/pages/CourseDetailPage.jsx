// client/src/pages/CourseDetailPage.jsx

import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { deleteCourse, getCourse } from '../services/courses'

export function CourseDetailPage() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

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

  async function handleDelete() {
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
        <dt>Course number</dt>
        <dd>{course.course_number}</dd>
        <dt>Type</dt>
        <dd>{course.course_type}</dd>
        <dt>Sponsored by</dt>
        <dd>{course.sponsored_by}</dd>
        <dt>State</dt>
        <dd>{course.state}</dd>
        <dt>Hours</dt>
        <dd>{course.hours}</dd>
        <dt>Category</dt>
        <dd>{course.course_category}</dd>
        <dt>Signer name</dt>
        <dd>{course.signer_name}</dd>
        <dt>Certificate template</dt>
        <dd>{course.certificate_template_key || 'None'}</dd>
      </dl>
      <Link to={`/courses/${course.id}/edit`}>Edit</Link>
      <button type="button" onClick={handleDelete}>
        Delete
      </button>
      <Link to="/dashboard">Back to dashboard</Link>
    </section>
  )
}
