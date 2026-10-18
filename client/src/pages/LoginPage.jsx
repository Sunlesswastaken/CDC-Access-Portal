import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import FormInput from '../components/FormInput.jsx'
import { Component as MorphButton } from '../components/ui/3d-button'
import { useAuth } from '../context/AuthContext.jsx'
import { homeForRole } from '../components/RoleRoute.jsx'

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
    <div className="flex min-h-[100dvh] flex-col bg-[#f6f7fb] text-[rgb(16_38_74_/_0.92)]">
      <main className="flex flex-1 items-center justify-center px-5 py-10">
        <div className="animate-rise w-full max-w-[420px]">
          <div className="ui-card">
            <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-[rgb(16_38_74_/_0.5)]">
              Use the credentials issued to you by the administrator.
            </p>

            {formError && (
              <p role="alert" className="ui-alert animate-descend mt-5">
                {formError}
              </p>
            )}

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4" noValidate>
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

              <MorphButton
                type="submit"
                disabled={submitting}
                label={submitting ? 'Signing in' : 'Sign in'}
                className="mt-1 w-full"
              />
            </form>
          </div>

          <p className="mt-6 text-center text-[12.5px] text-[rgb(16_38_74_/_0.5)]">
            Accounts are created by an administrator. Contact the CDC office if you need access.
          </p>
        </div>
      </main>

      <footer className="px-6 pb-7">
        <p className="text-center text-[12.5px] tracking-[0.01em] text-[rgb(16_38_74_/_0.45)]">
          CDC Developer Selection Assignment
        </p>
      </footer>
    </div>
  )
}
