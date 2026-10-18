import AnalyticsDashboard from '../components/block/analytics-dashboard.tsx'
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

export default function AdminDashboard() {
  const { user, logout } = useAuth()

  const dashboardUser = {
    name: user?.name || 'Administrator',
    email: user?.email || '',
    avatar: '',
    role: user?.role || 'admin',
  }

  return (
    <AnalyticsDashboard
      variant="fill"
      data={EMPTY_DASHBOARD_DATA}
      defaultPage="overview"
      user={dashboardUser}
      onSignOut={logout}
      brand={{ name: 'CDC Access Portal' }}
    />
  )
}
