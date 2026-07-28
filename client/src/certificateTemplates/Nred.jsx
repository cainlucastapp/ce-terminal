// client/src/certificateTemplates/Nred.jsx

import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import { formatDisplayDate } from '../utils/formatDate'

const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontFamily: 'Times-Roman',
  },
  outerFrame: {
    flex: 1,
    borderWidth: 3,
    borderColor: '#000000',
    padding: 4,
  },
  innerFrame: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#000000',
    padding: 32,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Times-BoldItalic',
    fontSize: 34,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Times-Bold',
    fontSize: 18,
    letterSpacing: 1,
    marginBottom: 28,
  },
  fieldsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  fieldBlock: {
    alignItems: 'center',
  },
  fieldValue: {
    fontFamily: 'Times-Italic',
    fontSize: 16,
  },
  fieldLine: {
    borderTopWidth: 1,
    borderTopColor: '#000000',
    width: 200,
    marginTop: 4,
  },
  fieldLabel: {
    fontFamily: 'Times-Roman',
    fontSize: 11,
    marginTop: 2,
  },
  body: {
    fontFamily: 'Times-Roman',
    fontSize: 13,
    marginBottom: 8,
    textAlign: 'center',
  },
  category: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 16,
    marginBottom: 4,
  },
  courseName: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 18,
    marginBottom: 24,
    textAlign: 'center',
  },
  hours: {
    fontFamily: 'Times-Bold',
    fontSize: 15,
    marginBottom: 4,
  },
  on: {
    fontFamily: 'Times-Roman',
    fontSize: 13,
    marginBottom: 4,
  },
  dateBlock: {
    alignItems: 'center',
    marginBottom: 24,
  },
  sponsor: {
    fontFamily: 'Times-Bold',
    fontSize: 16,
    letterSpacing: 1,
    marginTop: 4,
    marginBottom: 32,
  },
  bottomSection: {
    width: '100%',
    marginTop: 'auto',
  },
  signatureBlock: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  signature: {
    fontFamily: 'Times-BoldItalic',
    fontSize: 26,
  },
  signatureLine: {
    borderTopWidth: 1,
    borderTopColor: '#000000',
    width: 260,
    marginTop: 4,
  },
  footer: {
    fontFamily: 'Times-Roman',
    fontSize: 9,
    textAlign: 'center',
    marginTop: 32,
  },
})

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export function Nred({ course, attendee }) {
  const hoursLabel = `${course.hours} Hour${course.hours === 1 ? '' : 's'}`
  const instructionLabel = course.course_type === 'classroom' ? 'Live Instruction' : 'Internet Instruction'

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.outerFrame}>
          <View style={styles.innerFrame}>
            <Text style={styles.title}>Certificate of Attendance</Text>
            <Text style={styles.subtitle}>REAL ESTATE CONTINUING EDUCATION</Text>

            <View style={styles.fieldsRow}>
              <View style={styles.fieldBlock}>
                <Text style={styles.fieldValue}>{attendee.student_name}</Text>
                <View style={styles.fieldLine} />
                <Text style={styles.fieldLabel}>Name</Text>
              </View>
              <View style={styles.fieldBlock}>
                <Text style={styles.fieldValue}>{attendee.student_license_number}</Text>
                <View style={styles.fieldLine} />
                <Text style={styles.fieldLabel}>License Number</Text>
              </View>
            </View>

            <Text style={styles.body}>
              Attended and successfully completed a {capitalize(course.course_type)} offering of
            </Text>
            <Text style={styles.category}>{course.course_category.toUpperCase()}</Text>
            <Text style={styles.courseName}>{course.course_name}</Text>

            <Text style={styles.hours}>{hoursLabel} {instructionLabel}</Text>
            <Text style={styles.on}>ON</Text>
            <View style={styles.dateBlock}>
              <Text style={styles.fieldValue}>{formatDisplayDate(attendee.completion_date)}</Text>
              <View style={styles.fieldLine} />
              <Text style={styles.fieldLabel}>DATE</Text>
            </View>

            <Text style={styles.body}>This course is sponsored by:</Text>
            <Text style={styles.sponsor}>{course.sponsored_by.toUpperCase()}</Text>

            <View style={styles.bottomSection}>
              <View style={styles.signatureBlock}>
                <Text style={styles.signature}>{course.signer_name}</Text>
                <View style={styles.signatureLine} />
                <Text style={styles.fieldLabel}>Authorized Signature (Original)</Text>
              </View>

              <Text style={styles.footer}>
                THIS COURSE IS APPROVED BY THE NEVADA REAL ESTATE DIVISION ON BEHALF OF THE
                NEVADA REAL ESTATE COMMISSION
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}
