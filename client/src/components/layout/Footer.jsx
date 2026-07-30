// client/src/components/layout/Footer.jsx

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <p>&copy; {year} CE Terminal. All rights reserved.</p>
    </footer>
  )
}
