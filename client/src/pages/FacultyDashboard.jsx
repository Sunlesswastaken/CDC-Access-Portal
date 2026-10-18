import { UserRound } from 'lucide-react'
import AnalyticsDashboard from '../components/block/analytics-dashboard.tsx'
import { AccountPage } from '../components/portal/AccountPage'
import { useAuth } from '../context/AuthContext.jsx'

// The block's own demo content (pull requests, repositories, a PR details
// panel) is not part of this assignment. Passing an empty dataset means the
// block renders our real portal pages only and never shows the demo PR panel.
const EMPTY_DASHBOARD_DATA = {
  people: [],
  ranges: [],
  kpis: {},
  activity: {},
  repositories: [],
  pullRequests: [],
}

// A faculty member only ever sees their own profile (assignment §3C), so the
// sidebar offers a single destination. Logout lives in the sidebar itself.
const FACULTY_NAV = [{ page: 'overview', label: 'My profile', Icon: UserRound }]

export default function FacultyDashboard() {
  const { user, logout } = useAuth()

  const dashboardUser = {
    name: user?.name || 'Faculty member',
    email: user?.email || '',
    avatar: '',
    role: user?.role || 'faculty',
  }

  return (
    <AnalyticsDashboard
      variant="fill"
      data={EMPTY_DASHBOARD_DATA}
      defaultPage="overview"
      nav={FACULTY_NAV}
      pages={{ overview: AccountPage }}
      user={dashboardUser}
      onSignOut={logout}
      brand={{ name: 'CDC Access Portal' }}
    />
  )
}
