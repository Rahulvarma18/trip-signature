import { useState, useEffect, useRef } from 'react'
import { X, Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react'
import { ApiError } from '../lib/api'
import { renderGoogleButton } from '../lib/googleIdentity'

const emptyForm = { name: '', email: '', password: '' }
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

export default function AuthModal({ mode, onClose, onLogin, onSignup, onGoogleAuth, onSwitchMode }) {
  const [form, setForm] = useState(emptyForm)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const googleBtnRef = useRef(null)
  const isSignup = mode === 'signup'

  // Render the Google button once, if a client ID is configured.
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || !googleBtnRef.current) return
    renderGoogleButton({
      container: googleBtnRef.current,
      clientId: GOOGLE_CLIENT_ID,
      onCredential: async (idToken) => {
        setFormError('')
        setSubmitting(true)
        try {
          await onGoogleAuth(idToken)
        } catch (err) {
          applyServerErrors(err)
        } finally {
          setSubmitting(false)
        }
      },
      onError: () => setFormError('Google Sign-In is unavailable right now.')
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    // Clear the field-level error as the person retypes it.
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev))
  }

  const validate = () => {
    const next = {}
    if (isSignup && !form.name.trim()) next.name = 'Please enter your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email address.'
    if (form.password.length < 6) next.password = 'Password must be at least 6 characters.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const applyServerErrors = (err) => {
    if (err instanceof ApiError && err.fieldErrors) {
      const fieldMap = {}
      // errors is an array of Joi-style messages, sometimes { field, message }
      // and sometimes a plain string — handle both.
      if (Array.isArray(err.fieldErrors)) {
        err.fieldErrors.forEach((e) => {
          if (e?.field) fieldMap[e.field] = e.message
        })
      }
      if (Object.keys(fieldMap).length > 0) {
        setErrors(fieldMap)
        return
      }
    }
    setFormError(err.message || 'Something went wrong. Please try again.')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    if (!validate()) return

    setSubmitting(true)
    try {
      if (isSignup) {
        await onSignup({ name: form.name.trim(), email: form.email.trim(), password: form.password })
      } else {
        await onLogin({ email: form.email.trim(), password: form.password })
      }
      // Success: parent closes the modal via onLogin/onSignup side effects.
    } catch (err) {
      applyServerErrors(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-md shadow-deep w-full max-w-md p-8 sm:p-9">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 text-ink-soft hover:text-[#040809] transition-colors"
        >
          <X size={20} />
        </button>

        <h3 className="font-display text-2xl font-semibold mb-1">
          {isSignup ? 'Create your account' : 'Welcome back'}
        </h3>
        <p className="text-ink-soft text-[13px] mb-6">
          {isSignup
            ? 'Sign up to save destinations and track your enquiries.'
            : 'Log in to pick up where you left off.'}
        </p>

        {formError && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3.5 py-2.5 text-[13px] text-red-700">
            {formError}
          </div>
        )}

        {GOOGLE_CLIENT_ID && (
          <>
            <div ref={googleBtnRef} className="mb-5 flex justify-center [&>div]:w-full" />
            <div className="flex items-center gap-3 mb-5">
              <span className="h-px flex-1 bg-line" />
              <span className="text-[11px] uppercase tracking-wide text-ink-soft">or continue with email</span>
              <span className="h-px flex-1 bg-line" />
            </div>
          </>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {isSignup && (
            <div className="mb-4">
              <label className="block text-[11px] font-semibold tracking-wide uppercase text-[#040809] mb-1.5">
                Name
              </label>
              <div className="flex items-center gap-2.5 border border-line rounded-md px-3.5 bg-[#84A095]/50 focus-within:border-[#040809]">
                <User size={17} className="stroke-ink-soft flex-none" />
                <input
                  type="text"
                  value={form.name}
                  onChange={handleChange('name')}
                  placeholder="Your full name"
                  className="form-input"
                  disabled={submitting}
                  autoComplete="name"
                />
              </div>
              {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-[11px] font-semibold tracking-wide uppercase text-[#040809] mb-1.5">
              Email
            </label>
            <div className="flex items-center gap-2.5 border border-line rounded-md px-3.5 bg-[#84A095]/50 focus-within:border-[#040809]">
              <Mail size={17} className="stroke-ink-soft flex-none" />
              <input
                type="email"
                value={form.email}
                onChange={handleChange('email')}
                placeholder="you@example.com"
                className="form-input"
                disabled={submitting}
                autoComplete="email"
              />
            </div>
            {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
          </div>

          <div className="mb-5">
            <label className="block text-[11px] font-semibold tracking-wide uppercase text-[#040809] mb-1.5">
              Password
            </label>
            <div className="flex items-center gap-2.5 border border-line rounded-md px-3.5 bg-[#84A095]/50 focus-within:border-[#040809]">
              <Lock size={17} className="stroke-ink-soft flex-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange('password')}
                placeholder="At least 6 characters"
                className="form-input"
                disabled={submitting}
                autoComplete={isSignup ? 'new-password' : 'current-password'}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="flex-none text-ink-soft"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
          </div>

          <button type="submit" className="btn btn-primary w-full py-3.5 flex items-center justify-center gap-2" disabled={submitting}>
            {submitting && <Loader2 size={16} className="animate-spin" />}
            {submitting ? (isSignup ? 'Creating account…' : 'Logging in…') : isSignup ? 'Create Account' : 'Log In'}
          </button>
        </form>

        <p className="text-center text-[13px] text-ink-soft mt-5">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => {
              setErrors({})
              setFormError('')
              onSwitchMode(isSignup ? 'login' : 'signup')
            }}
            className="text-[#040809] font-semibold hover:underline"
          >
            {isSignup ? 'Log in' : 'Sign up'}
          </button>
        </p>
      </div>
    </div>
  )
}