import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import FormInput from '../components/FormInput.jsx'
import Message from '../components/Message.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { homeForRole } from '../components/RoleRoute.jsx'

const ROLES = [
  { name: 'Admin', detail: 'Create and manage faculty and student accounts' },
  { name: 'Faculty', detail: 'View your own profile and details' },
  { name: 'Student', detail: 'View your profile and unique QR code' },
]

export default function LoginPage() {
  const { user, loading, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  // Already signed in? Go straight to the dashboard for your verified role.
  if (!loading && user) {
    return <Navigate to={homeForRole(user.role)} replace />
  }

  function validate() {
    const errors = {}
    if (!email.trim()) errors.email = 'Enter your email address'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Enter a valid email address'
    }
    if (!password) errors.password = 'Enter your password'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setFormError('')
    if (!validate()) return

    setSubmitting(true)
    try {
      const loggedInUser = await login(email.trim(), password)
      const from = location.state?.from?.pathname
      navigate(from || homeForRole(loggedInUser.role), { replace: true })
    } catch (error) {
      setFormError(error.message || 'Unable to sign in. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="grid min-h-[100dvh] lg:grid-cols-[1.05fr_1fr]">
      <BrandPanel />

      <main className="flex items-center justify-center px-5 py-10 sm:px-8">
        <div className="animate-rise w-full max-w-[420px]">
          <MobileBrand />

          <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_18px_40px_-24px_rgba(0,80,148,0.35)]">
            <div className="h-1 w-full bg-gradient-to-r from-navy via-navy-hover to-gold" />

            <div className="p-7 sm:p-9">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-navy">
                Secure sign in
              </p>
              <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink">
                Welcome back
              </h1>
              <p className="mt-2 text-sm text-muted">
                Sign in with the credentials issued to you by the administrator.
              </p>

              {formError && (
                <Message variant="error" className="mt-6">
                  {formError}
                </Message>
              )}

              <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5" noValidate>
                <FormInput
                  label="Email address"
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="you@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={fieldErrors.email}
                  disabled={submitting}
                  autoFocus
                />
                <FormInput
                  label="Password"
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={fieldErrors.password}
                  disabled={submitting}
                />

                <button
                  type="submit"
                  disabled={submitting}
                  className={[
                    'mt-1 inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-xl',
                    'bg-navy px-5 text-sm font-semibold tracking-wide text-white',
                    'shadow-[0_10px_22px_-12px_rgba(0,80,148,0.85)]',
                    'transition-[background-color,box-shadow,transform] duration-150',
                    'hover:bg-navy-hover hover:shadow-[0_14px_26px_-12px_rgba(0,80,148,0.9)]',
                    'active:translate-y-px',
                    'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-navy-hover/30',
                    'disabled:cursor-not-allowed disabled:opacity-70',
                  ].join(' ')}
                >
                  {submitting ? (
                    <>
                      <span
                        aria-hidden="true"
                        className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                      />
                      Signing in…
                    </>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </form>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-muted">
            Accounts are created by an administrator.{' '}
            <Link to="/login" className="font-medium text-navy hover:text-navy-hover">
              Contact the CDC office
            </Link>{' '}
            if you need access.
          </p>
        </div>
      </main>
    </div>
  )
}

function BrandPanel() {
  return (
    <section className="relative hidden overflow-hidden bg-[linear-gradient(135deg,#013a6b_0%,#005094_48%,#0f62ac_100%)] lg:flex lg:flex-col lg:justify-between lg:p-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-teal/20 blur-3xl"
      />

      <header className="relative flex items-center gap-3 text-white">
        <span className="grid size-11 place-items-center rounded-xl border border-white/25 bg-white/10 font-display text-lg font-semibold tracking-tight">
          CD
        </span>
        <div className="leading-tight">
          <p className="font-display text-base font-semibold tracking-tight">CDC Access Portal</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold">
            Role-based dashboard
          </p>
        </div>
      </header>

      <div className="relative max-w-md text-white">
        <p className="animate-rise font-mono text-[11px] uppercase tracking-[0.22em] text-gold">
          CDC · Developer selection
        </p>
        <h2
          className="animate-rise mt-4 font-display text-[2rem] font-semibold leading-[1.15] tracking-tight"
          style={{ animationDelay: '80ms' }}
        >
          One portal for administrators, faculty and students.
        </h2>
        <p
          className="animate-rise mt-4 text-sm leading-relaxed text-white/75"
          style={{ animationDelay: '160ms' }}
        >
          Sign in to manage accounts or view your own profile. Access is decided by your role and
          enforced on the server.
        </p>

        <ul className="animate-rise mt-9 space-y-px" style={{ animationDelay: '240ms' }}>
          {ROLES.map((role) => (
            <li
              key={role.name}
              className="flex items-baseline gap-4 border-t border-white/12 py-3.5 first:border-t-0"
            >
              <span className="w-16 shrink-0 font-display text-sm font-semibold text-white">
                {role.name}
              </span>
              <span className="text-xs leading-relaxed text-white/65">{role.detail}</span>
            </li>
          ))}
        </ul>
      </div>

      <footer className="relative font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">
        CDC Developer Selection Assignment
      </footer>
    </section>
  )
}

function MobileBrand() {
  return (
    <div className="mb-8 flex items-center gap-3 lg:hidden">
      <span className="grid size-11 place-items-center rounded-xl bg-navy font-display text-lg font-semibold text-white">
        CD
      </span>
      <div className="leading-tight">
        <p className="font-display text-base font-semibold tracking-tight text-ink">
          CDC Access Portal
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
          Role-based dashboard
        </p>
      </div>
    </div>
  )
}
