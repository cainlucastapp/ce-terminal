// client/src/services/attendees.js

import { api } from './client'

export function listAttendees(courseId, { page, perPage } = {}) {
  const params = new URLSearchParams()
  if (page) params.set('page', page)
  if (perPage) params.set('per_page', perPage)
  const query = params.toString()
  return api.get(`/courses/${courseId}/attendees${query ? `?${query}` : ''}`)
}

export function getAttendee(courseId, attendeeId) {
  return api.get(`/courses/${courseId}/attendees/${attendeeId}`)
}

export function createAttendee(courseId, attendee) {
  return api.post(`/courses/${courseId}/attendees`, attendee)
}

export function updateAttendee(courseId, attendeeId, updates) {
  return api.patch(`/courses/${courseId}/attendees/${attendeeId}`, updates)
}

export function deleteAttendee(courseId, attendeeId) {
  return api.delete(`/courses/${courseId}/attendees/${attendeeId}`)
}
