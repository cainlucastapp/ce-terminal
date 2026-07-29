// client/src/pages/HomePage.jsx

import { Link } from 'react-router-dom'
import logo from '../assets/images/ce-terminal-logo.png'

export function HomePage() {
  return (
    <section className="home-page">
      <img src={logo} alt="CE Terminal" className="home-logo" />

      <p className="home-tagline">
        Your CE certificates all in one place.
      </p>

      <div className="home-actions">
        <Link to="/student" className="button-link">
          Find My Certificate
        </Link>
        <Link to="/login" className="button-link button-link-secondary">
          Provider Login
        </Link>
      </div>

      <div className="home-features">
        <div>
          <h2>For Students</h2>
          <p>Look up a completed course and view and download your certificate any time.</p>
        </div>
        <div>
          <h2>For Providers</h2>
          <p>Create courses, track attendees, and issue certificates.</p>
        </div>
      </div>
    </section>
  )
}
