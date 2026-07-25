// client/src/services/certificates.js

import { api } from './client'

// state and licenseNumber are both required by the backend — it 400s
// otherwise so this route can't be used to enumerate every attendee
export function searchCertificates({ state, licenseNumber, page, perPage }) {
  const params = new URLSearchParams({ state, license_number: licenseNumber })
  if (page) params.set('page', page)
  if (perPage) params.set('per_page', perPage)
  return api.get(`/certificates/search?${params.toString()}`)
}

export function getCertificate(publicId) {
  return api.get(`/certificates/${publicId}`)
}
