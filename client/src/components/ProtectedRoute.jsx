import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import LoadingState from './LoadingState.jsx'

// Frontend route guards improve navigation but are NOT the security boundary:
// Express enforces every permission again on the server.
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <LoadingState />
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />

  return children
}
