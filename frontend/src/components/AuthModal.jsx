import { useState } from 'react'
import { X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react'

const emptyForm = { name: '', email: '', password: '' }

export default function AuthModal({ mode, onClose, onAuthenticated, onSwitchMode }) {
  const [form, setForm] = useState(emptyForm)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const isSignup = mode === 'signup'

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const validate = () => {
    const next = {}
    if (isSignup && !form.name.trim()) next.name = 'Please enter your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email address.'
    if (form.password.length < 6) next.password = 'Password must be at least 6 characters.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    // Frontend-only for now: no API call yet — swap this for a real auth request later.
    onAuthenticated({ name: form.name || form.email.split('@')[0], email: form.email })
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-md shadow-deep w-full max-w-md p-8 sm:p-9">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 text-ink-soft hover:text-[#2B2B2B] transition-colors"
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

        <form onSubmit={handleSubmit} noValidate>
          {isSignup && (
            <div className="mb-4">
              <label className="block text-[11px] font-semibold tracking-wide uppercase text-[#2B2B2B] mb-1.5">
                Name
              </label>
              <div className="flex items-center gap-2.5 border border-line rounded-md px-3.5 bg-[#D4D4D4]/50 focus-within:border-[#2B2B2B]">
                <User size={17} className="stroke-ink-soft flex-none" />
                <input
                  type="text"
                  value={form.name}
                  onChange={handleChange('name')}
                  placeholder="Your full name"
                  className="form-input"
                />
              </div>
              {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-[11px] font-semibold tracking-wide uppercase text-[#2B2B2B] mb-1.5">
              Email
            </label>
            <div className="flex items-center gap-2.5 border border-line rounded-md px-3.5 bg-[#D4D4D4]/50 focus-within:border-[#2B2B2B]">
              <Mail size={17} className="stroke-ink-soft flex-none" />
              <input
                type="email"
                value={form.email}
                onChange={handleChange('email')}
                placeholder="you@example.com"
                className="form-input"
              />
            </div>
            {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
          </div>

          <div className="mb-5">
            <label className="block text-[11px] font-semibold tracking-wide uppercase text-[#2B2B2B] mb-1.5">
              Password
            </label>
            <div className="flex items-center gap-2.5 border border-line rounded-md px-3.5 bg-[#D4D4D4]/50 focus-within:border-[#2B2B2B]">
              <Lock size={17} className="stroke-ink-soft flex-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange('password')}
                placeholder="At least 6 characters"
                className="form-input"
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

          <button type="submit" className="btn btn-primary w-full py-3.5">
            {isSignup ? 'Create Account' : 'Log In'}
          </button>
        </form>

        <p className="text-center text-[13px] text-ink-soft mt-5">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => onSwitchMode(isSignup ? 'login' : 'signup')}
            className="text-[#2B2B2B] font-semibold hover:underline"
          >
            {isSignup ? 'Log in' : 'Sign up'}
          </button>
        </p>
      </div>
    </div>
  )
}