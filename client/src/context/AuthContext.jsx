// client/src/context/AuthContext.jsx

import { useEffect, useState } from 'react'
import {
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
  signup as signupRequest,
} from '../services/auth'
import { AuthContext } from './auth-context'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  // true until the initial GET /auth/me resolves, so routes don't redirect
  // to /login before we know whether a session cookie is already valid
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false))
  }, [])

  async function login(credentials) {
    const loggedInUser = await loginRequest(credentials)
    setUser(loggedInUser)
    return loggedInUser
  }

  async function signup(details) {
    const newUser = await signupRequest(details)
    setUser(newUser)
    return newUser
  }

  async function logout() {
    await logoutRequest()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
