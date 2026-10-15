import Navbar from '../components/Navbar.jsx'
import { useAuth } from '../context/AuthContext.jsx'

// Placeholder shell — the full Admin dashboard (create/list faculty and students)
// is built in Phase 6.
export default function AdminDashboard() {
  const { user } = useAuth()

  return (
    <div className="min-h-[100dvh] bg-canvas">
      <Navbar subtitle="Administrator" />
      <main className="mx-auto max-w-6xl px-5 py-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-navy">Dashboard</p>
        <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink">
          Welcome, {user?.name}
        </h1>
        <p className="mt-2 text-sm text-muted">
          Account management (create and list faculty and students) arrives in the next phase.
        </p>
      </main>
    </div>
  )
}
