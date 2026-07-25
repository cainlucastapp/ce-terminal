// client/src/services/auth.js

import { api } from './client'

export function signup({ firstName, lastName, email, password }) {
  return api.post('/auth/signup', {
    first_name: firstName,
    last_name: lastName,
    email,
    password,
  })
}

export function login({ email, password }) {
  return api.post('/auth/login', { email, password })
}

export function logout() {
  return api.post('/auth/logout')
}

export function getCurrentUser() {
  return api.get('/auth/me')
}
