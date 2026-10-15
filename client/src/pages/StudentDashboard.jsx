import Navbar from '../components/Navbar.jsx'
import { useAuth } from '../context/AuthContext.jsx'

// Placeholder shell — the full Student profile + QR code view is built in Phase 6.
export default function StudentDashboard() {
  const { user } = useAuth()

  return (
    <div className="min-h-[100dvh] bg-canvas">
      <Navbar subtitle="Student" />
      <main className="mx-auto max-w-3xl px-5 py-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-navy">My profile</p>
        <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink">
          {user?.name}
        </h1>
        <p className="mt-2 text-sm text-muted">
          {user?.email} · {user?.rollNumber}
        </p>
      </main>
    </div>
  )
}
