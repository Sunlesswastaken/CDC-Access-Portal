// Vite proxies /api to the Express server in development (see vite.config.js).
const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

const TOKEN_KEY = 'mini_mern_auth_token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function apiFetch(path, { method = 'GET', body, token } = {}) {
  const headers = {}
  const authToken = token ?? getToken()
  if (authToken) headers.Authorization = `Bearer ${authToken}`
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  let response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError('Could not reach the server. Please try again.', 0)
  }

  let data = null
  try {
    data = await response.json()
  } catch {
    /* empty body */
  }

  // The token we sent was rejected: it has expired or is no longer valid.
  // Drop it and tell the auth context so the app logs the user out instead of
  // leaving a stale "signed in" screen that only fails on every API call.
  if (response.status === 401 && authToken) {
    setToken(null)
    window.dispatchEvent(new Event('auth:session-expired'))
  }

  if (!response.ok) {
    throw new ApiError(data?.message || 'Something went wrong', response.status)
  }
  return data
}
