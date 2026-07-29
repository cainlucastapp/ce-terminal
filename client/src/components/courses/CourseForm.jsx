// client/src/components/courses/CourseForm.jsx

import { useState } from 'react'

const EMPTY_VALUES = {
  course_name: '',
  course_number: '',
  course_type: '',
  sponsored_by: '',
  state: '',
  hours: '',
  course_category: '',
  signer_name: '',
  certificate_template_key: '',
}

// shared by CourseFormPage in both create and edit mode
export function CourseForm({ initialValues, options, onSubmit, submitLabel }) {
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
      await onSubmit({
        ...values,
        hours: values.hours ? Number(values.hours) : null,
        certificate_template_key: values.certificate_template_key || null,
      })
    } catch (err) {
      setError(err.message || 'something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="course-form app-form" onSubmit={handleSubmit}>
      <label htmlFor="course_name">Course name</label>
      <input
        id="course_name"
        type="text"
        value={values.course_name}
        onChange={handleChange('course_name')}
        required
      />

      <label htmlFor="course_number">Course number</label>
      <input
        id="course_number"
        type="text"
        value={values.course_number}
        onChange={handleChange('course_number')}
        required
      />

      <label htmlFor="course_type">Course type</label>
      <select id="course_type" value={values.course_type} onChange={handleChange('course_type')} required>
        <option value="" disabled>
          Select a course type
        </option>
        {options.course_types.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      <label htmlFor="sponsored_by">Sponsored by</label>
      <input
        id="sponsored_by"
        type="text"
        value={values.sponsored_by}
        onChange={handleChange('sponsored_by')}
        required
      />

      <label htmlFor="state">State</label>
      <select id="state" value={values.state} onChange={handleChange('state')} required>
        <option value="" disabled>
          Select a state
        </option>
        {options.states.map((state) => (
          <option key={state} value={state}>
            {state}
          </option>
        ))}
      </select>

      <label htmlFor="hours">Hours</label>
      <select id="hours" value={values.hours} onChange={handleChange('hours')} required>
        <option value="" disabled>
          Select hours
        </option>
        {options.course_hours.map((hours) => (
          <option key={hours} value={hours}>
            {hours}
          </option>
        ))}
      </select>

      <label htmlFor="course_category">Category</label>
      <select
        id="course_category"
        value={values.course_category}
        onChange={handleChange('course_category')}
        required
      >
        <option value="" disabled>
          Select a category
        </option>
        {options.course_categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      <label htmlFor="signer_name">Signer name</label>
      <input
        id="signer_name"
        type="text"
        value={values.signer_name}
        onChange={handleChange('signer_name')}
        required
      />

      <label htmlFor="certificate_template_key">Certificate template</label>
      <select
        id="certificate_template_key"
        value={values.certificate_template_key}
        onChange={handleChange('certificate_template_key')}
      >
        <option value="">None</option>
        {options.certificate_template_keys.map((key) => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </select>

      {error && <p role="alert">{error}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving…' : submitLabel}
      </button>
    </form>
  )
}
