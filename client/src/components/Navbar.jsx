import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar({ subtitle }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [signingOut, setSigningOut] = useState(false)

  async function handleLogout() {
    setSigningOut(true)
    try {
      await logout()
      navigate('/login', { replace: true })
    } finally {
      setSigningOut(false)
    }
  }

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[linear-gradient(135deg,#005094_0%,#0f62ac_55%,#005094_100%)] text-white">
      <div className="mx-auto flex min-h-[68px] max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-lg bg-white/10 font-display text-sm font-semibold tracking-tight">
            CD
          </span>
          <div className="leading-tight">
            <p className="font-display text-sm font-semibold tracking-tight">CDC Access Portal</p>
            {subtitle && (
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-gold">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <div className="hidden text-right leading-tight sm:block">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/60">
                {user.role}
              </p>
            </div>
          )}
          <button
            type="button"
            onClick={handleLogout}
            disabled={signingOut}
            className="rounded-lg border border-white/25 bg-white/10 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-white/20 active:translate-y-px disabled:opacity-60"
          >
            {signingOut ? 'Signing out…' : 'Sign out'}
          </button>
        </div>
      </div>
    </header>
  )
}
