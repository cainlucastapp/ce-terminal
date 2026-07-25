// client/src/services/client.js

const BASE_URL = import.meta.env.VITE_API_URL

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

// every request sends the session cookie and expects/sends JSON; the backend
// always returns {"error": "..."} on failure, so that's what callers see
export async function apiFetch(path, { headers, ...options } = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...headers },
    ...options,
  })

  if (response.status === 204) {
    return null
  }

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(data?.error || 'request failed', response.status)
  }

  return data
}

export const api = {
  get: (path) => apiFetch(path),
  post: (path, body) => apiFetch(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: (path, body) => apiFetch(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (path) => apiFetch(path, { method: 'DELETE' }),
}
