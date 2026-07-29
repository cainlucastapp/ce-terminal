// client/src/pages/StudentPage.jsx

import { LookUpForm } from '../components/lookup/LookUpForm'

export function StudentPage() {
  return (
    <section className="student-page">
      <h1>Find Your Certificate</h1>
      <p className="student-note">
        Only certificates from providers who use CE Terminal will appear here.
        If a certificate is missing or incorrect, please contact the course
        provider directly.
      </p>
      <LookUpForm />
    </section>
  )
}
