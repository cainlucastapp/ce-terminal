// client/src/hooks/useCertificatePdf.js

import { useState } from 'react'
import { renderCertificatePdf } from '../services/certificatePdf'

export function useCertificatePdf() {
  const [openingId, setOpeningId] = useState(null)
  const [error, setError] = useState(null)

  // certificate PDF open handler
  async function openCertificate(publicId) {
    // opened synchronously, in direct response to the click
    const newTab = window.open('', '_blank')
    if (newTab) {
      newTab.opener = null
    }

    setError(null)
    setOpeningId(publicId)
    try {
      const blob = await renderCertificatePdf(publicId)
      const url = URL.createObjectURL(blob)
      if (newTab) {
        newTab.location.href = url
      }
    } catch (err) {
      if (newTab) {
        newTab.close()
      }
      setError(err.message || 'failed to open certificate')
    } finally {
      setOpeningId(null)
    }
  }

  return { openCertificate, openingId, error }
}
