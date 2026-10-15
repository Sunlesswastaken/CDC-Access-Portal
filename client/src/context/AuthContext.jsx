import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import * as authApi from '../api/auth.api.js'
import { getToken, setToken } from '../api/apiClient.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  // `loading` is true until we know whether the stored token is still valid.
  const [loading, setLoading] = useState(Boolean(getToken()))

  useEffect(() => {
    let active = true
    async function restoreSession() {
      if (!getToken()) {
        setLoading(false)
        return
      }
      try {
        const { user: currentUser } = await authApi.getCurrentUser()
        if (active) setUser(currentUser)
      } catch {
        // Token missing, expired, or invalid: drop it and stay logged out.
        setToken(null)
        if (active) setUser(null)
      } finally {
        if (active) setLoading(false)
      }
    }
    restoreSession()
    return () => {
      active = false
    }
  }, [])

  async function login(email, password) {
    const { token, user: loggedInUser } = await authApi.login(email, password)
    setToken(token)
    setUser(loggedInUser)
    return loggedInUser
  }

  async function logout() {
    try {
      await authApi.logout()
    } catch {
      // Logging out locally must succeed even if the server call fails.
    }
    setToken(null)
    setUser(null)
  }

  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
