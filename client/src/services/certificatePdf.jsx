// client/src/services/certificatePdf.jsx

import { pdf } from '@react-pdf/renderer'
import { Nred } from '../certificateTemplates/Nred'
import { getCertificate } from './certificates'

export async function renderCertificatePdf(publicId) {
  const data = await getCertificate(publicId)
  return pdf(<Nred course={data.course} attendee={data.attendee} />).toBlob()
}
