// client/src/services/courses.js

import { api } from './client'

export function listCourses({ page, perPage } = {}) {
  const params = new URLSearchParams()
  if (page) params.set('page', page)
  if (perPage) params.set('per_page', perPage)
  const query = params.toString()
  return api.get(`/courses${query ? `?${query}` : ''}`)
}

export function getCourse(courseId) {
  return api.get(`/courses/${courseId}`)
}

export function createCourse(course) {
  return api.post('/courses', course)
}

export function updateCourse(courseId, updates) {
  return api.patch(`/courses/${courseId}`, updates)
}

export function deleteCourse(courseId) {
  return api.delete(`/courses/${courseId}`)
}
