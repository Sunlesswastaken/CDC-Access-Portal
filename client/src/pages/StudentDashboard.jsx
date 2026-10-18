import { GraduationCap } from 'lucide-react'
import AnalyticsDashboard from '../components/block/analytics-dashboard.tsx'
import { StudentProfilePage } from '../components/portal/StudentProfilePage'
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

// A student only ever sees their own profile and QR code, so the sidebar
// offers a single destination. Sign-out lives only in the sidebar.
const STUDENT_NAV = [{ page: 'overview', label: 'My profile', Icon: GraduationCap }]

export default function StudentDashboard() {
  const { user, logout } = useAuth()

  const dashboardUser = {
    name: user?.name || 'Student',
    email: user?.email || '',
    avatar: '',
    role: user?.role || 'student',
  }

  return (
    <AnalyticsDashboard
      variant="fill"
      data={EMPTY_DASHBOARD_DATA}
      defaultPage="overview"
      nav={STUDENT_NAV}
      pages={{ overview: StudentProfilePage }}
      user={dashboardUser}
      onSignOut={logout}
      brand={{ name: 'CDC Access Portal' }}
    />
  )
}
