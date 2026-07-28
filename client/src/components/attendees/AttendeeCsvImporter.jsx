// client/src/components/attendees/AttendeeCsvImporter.jsx

import { useRef } from 'react'
import { Importer, ImporterField } from 'react-csv-importer'
import 'react-csv-importer/dist/index.css'
import { createAttendee } from '../../services/attendees'

export function AttendeeCsvImporter({ courseId, onComplete }) {
  // failed-row accumulator
  const rowErrorsRef = useRef([])

  // per-chunk row handler
  async function handleData(rows) {
    for (const row of rows) {
      try {
        await createAttendee(courseId, {
          student_name: row.student_name,
          student_license_number: row.student_license_number,
          completion_date: row.completion_date,
        })
      } catch (err) {
        rowErrorsRef.current.push({ row, message: err.message || 'failed to import row' })
      }
    }
  }

  // import-finished handler
  function handleComplete() {
    const errors = rowErrorsRef.current
    rowErrorsRef.current = []
    onComplete(errors)
  }

  // column definitions
  return (
    <Importer dataHandler={handleData} restartable onComplete={handleComplete}>
      <ImporterField name="student_name" label="Student Name" />
      <ImporterField name="student_license_number" label="License Number" />
      <ImporterField name="completion_date" label="Completion Date (YYYY-MM-DD)" />
    </Importer>
  )
}
