// client/src/pages/CourseFormPage.jsx

import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CourseForm } from '../components/courses/CourseForm'
import { getConfig } from '../services/config'
import { createCourse, getCourse, updateCourse } from '../services/courses'

export function CourseFormPage() {
  const { courseId } = useParams()
  const isEditMode = Boolean(courseId)
  const navigate = useNavigate()

  const [options, setOptions] = useState(null)
  const [course, setCourse] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setIsLoading(true)
      setError(null)
      try {
        const [config, existingCourse] = await Promise.all([
          getConfig(),
          isEditMode ? getCourse(courseId) : Promise.resolve(null),
        ])
        setOptions(config)
        setCourse(existingCourse)
      } catch (err) {
        setError(err.message || 'failed to load')
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [courseId, isEditMode])

  async function handleSubmit(values) {
    const saved = isEditMode ? await updateCourse(courseId, values) : await createCourse(values)
    navigate(`/courses/${saved.id}`)
  }

  if (isLoading) {
    return <p role="status">Loading…</p>
  }

  if (error) {
    return <p role="alert">{error}</p>
  }

  return (
    <section>
      <h1>{isEditMode ? 'Edit course' : 'New course'}</h1>
      <CourseForm
        initialValues={course ?? undefined}
        options={options}
        onSubmit={handleSubmit}
        submitLabel={isEditMode ? 'Save changes' : 'Create course'}
      />
    </section>
  )
}
