import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import LoadingState from './LoadingState.jsx'

export const HOME_BY_ROLE = {
  admin: '/admin',
  faculty: '/faculty',
  student: '/student',
}

export function homeForRole(role) {
  return HOME_BY_ROLE[role] || '/login'
}

// Sends a logged-in user to the dashboard for their verified role, or to
// /login if they are not allowed here.
export default function RoleRoute({ allow, children }) {
  const { user, loading } = useAuth()

  if (loading) return <LoadingState />
  if (!user) return <Navigate to="/login" replace />
  if (!allow.includes(user.role)) return <Navigate to={homeForRole(user.role)} replace />

  return children
}
