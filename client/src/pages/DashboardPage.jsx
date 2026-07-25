// client/src/pages/DashboardPage.jsx

import { useAuth } from '../hooks/useAuth'

export function DashboardPage() {
  const { user } = useAuth()

  return (
    <section>
      <h1>Welcome, {user.first_name}</h1>
      <p>Course and attendee management is coming next.</p>
    </section>
  )
}
