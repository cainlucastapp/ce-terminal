// client/src/components/attendees/AttendeeForm.jsx

import { useState } from 'react'

const EMPTY_VALUES = {
  student_name: '',
  student_license_number: '',
  completion_date: '',
}

// create/edit attendee form
export function AttendeeForm({ initialValues, onSubmit, onCancel, submitLabel }) {
  const [values, setValues] = useState({ ...EMPTY_VALUES, ...initialValues })
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(field) {
    return (event) => setValues((current) => ({ ...current, [field]: event.target.value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      await onSubmit(values)
    } catch (err) {
      setError(err.message || 'something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="attendee-form" onSubmit={handleSubmit}>
      <label htmlFor="student_name">Student name</label>
      <input
        id="student_name"
        type="text"
        value={values.student_name}
        onChange={handleChange('student_name')}
        required
      />

      <label htmlFor="student_license_number">License number</label>
      <input
        id="student_license_number"
        type="text"
        value={values.student_license_number}
        onChange={handleChange('student_license_number')}
        required
      />

      <label htmlFor="completion_date">Completion date</label>
      <input
        id="completion_date"
        type="date"
        value={values.completion_date}
        onChange={handleChange('completion_date')}
        required
      />

      {error && <p role="alert">{error}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving…' : submitLabel}
      </button>
      {onCancel && (
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      )}
    </form>
  )
}
