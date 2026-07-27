import { useEffect, useState, useCallback } from 'react'
import {
  User,
  Phone,
  MapPin,
  Users,
  Calendar,
  Mail,
  ShieldCheck,
  ChevronDown,
  CheckCircle2
} from 'lucide-react'
import { CATEGORY_LIST, TRAVELLER_OPTIONS } from '../data/destinations'

const initialForm = {
  name: '',
  phone: '',
  destination: '',
  travellers: '2',
  date: '',
  email: ''
}

function makeCaptcha() {
  const a = Math.floor(Math.random() * 10) + 2
  const b = Math.floor(Math.random() * 8) + 1
  return { a, b, answer: a + b }
}

export default function InquiryForm({ presetDestination }) {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [captcha, setCaptcha] = useState(makeCaptcha)
  const [captchaInput, setCaptchaInput] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (presetDestination) {
      setForm((f) => ({ ...f, destination: presetDestination }))
    }
  }, [presetDestination])

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  const resetForm = useCallback(() => {
    setForm(initialForm)
    setCaptcha(makeCaptcha())
    setCaptchaInput('')
    setErrors({})
    setSubmitted(false)
  }, [])

  const validate = () => {
    const next = {}
    const digits = form.phone.replace(/\D/g, '')

    if (!form.name.trim()) next.name = 'Please enter your name.'
    if (digits.length < 10) next.phone = 'Please enter a valid 10-digit phone number.'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = 'Please enter a valid email, or leave it blank.'
    }
    if (parseInt(captchaInput, 10) !== captcha.answer) {
      next.captcha = "That answer doesn't look right — please try again."
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)

    // Frontend-only for now: no API call yet. Swap this block out for a real
    // request (e.g. axios.post('/api/inquiries', {...})) once the backend is wired up.
    const payload = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      destination: form.destination || 'Not specified',
      travellers: form.travellers,
      travelDate: form.date || null,
      email: form.email.trim() || null
    }
    console.log('Enquiry submitted (frontend-only):', payload)

    setTimeout(() => {
      setSubmitting(false)
      setSubmitted(true)
    }, 500)
  }

  if (submitted) {
    return (
      <div className="bg-paper rounded-[10px] p-10 shadow-deep text-center relative">
        <CheckCircle2 size={52} className="stroke-[#040809] mx-auto mb-4" />
        <h3 className="font-display text-2xl font-semibold mb-2">Enquiry received!</h3>
        <p className="text-ink-soft text-sm">
          Thank you — your dedicated curator will call you shortly to plan the journey.
        </p>
        <button onClick={resetForm} className="btn btn-ghost mt-5">
          Submit Another Enquiry
        </button>
      </div>
    )
  }

  return (
    <div className="bg-paper rounded-[10px] p-9 sm:p-10 shadow-deep relative">
      <div className="absolute inset-2 border border-gold-light rounded-md pointer-events-none" />

      <h3 className="font-display text-2xl font-semibold mb-1">Plan My Trip</h3>
      <p className="text-ink-soft text-[13px] mb-6">
        We make sure you get your desired travel services with minimal effort.
      </p>

      <form onSubmit={handleSubmit} noValidate className="relative">
        <Field label="Name" required error={errors.name}>
          <IconInput icon={User}>
            <input
              type="text"
              placeholder="Your full name"
              value={form.name}
              onChange={handleChange('name')}
              className="form-input text-black placeholder:text-gray-600"
            />
          </IconInput>
        </Field>

        <Field label="Phone" required error={errors.phone}>
          <IconInput icon={Phone}>
            <input
              type="tel"
              placeholder="10-digit mobile number"
              value={form.phone}
              onChange={handleChange('phone')}
              className="form-input text-black placeholder:text-gray-600"
            />
          </IconInput>
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Destination">
            <IconInput icon={MapPin} withCaret>
              <select
                value={form.destination}
                onChange={handleChange('destination')}
                className="form-input text-black cursor-pointer"
              >
                <option value="">Select a destination</option>
                {CATEGORY_LIST.map((cat) => (
                  <optgroup key={cat.key} label={cat.label}>
                    {cat.items.map((item) => (
                      <option key={item.name} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
                <option value="Other">Other / Not Listed</option>
              </select>
            </IconInput>
          </Field>

          <Field label="No. of Travellers">
            <IconInput icon={Users} withCaret>
              <select
                value={form.travellers}
                onChange={handleChange('travellers')}
                className="form-input text-black cursor-pointer"
              >
                {TRAVELLER_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </IconInput>
          </Field>
        </div>

        <Field label="Date of Travel">
          <IconInput icon={Calendar}>
            <input
              type="date"
              value={form.date}
              onChange={handleChange('date')}
              className="form-input text-black"
            />
          </IconInput>
        </Field>

        <Field label="Email" optional error={errors.email}>
          <IconInput icon={Mail}>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange('email')}
              className="form-input text-black placeholder:text-gray-600"
            />
          </IconInput>
        </Field>

        <div className="bg-ivory border border-line rounded-md px-3 sm:px-4.5 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3.5 mb-1">
          <span className="flex items-center gap-1.5 text-[10px] sm:text-[11.5px] font-semibold uppercase tracking-wide text-[#040809] flex-none">
            <ShieldCheck size={15} />
            Verified Human
          </span>
          <div className="bg-[#040809] text-white rounded-md px-3 sm:px-4 py-2.5 font-semibold text-xs sm:text-sm whitespace-nowrap">
            {captcha.a} + {captcha.b} = ?
          </div>
          <input
            type="text"
            inputMode="numeric"
            placeholder="Answer"
            value={captchaInput}
            onChange={(e) => setCaptchaInput(e.target.value)}
            className="w-full sm:flex-1 min-w-0 border border-line rounded-md px-3 py-2.5 text-sm text-black placeholder:text-gray-600 focus:border-[#040809] outline-none"
          />
        </div>
        {errors.captcha && <p className="text-red-600 text-xs mb-3">{errors.captcha}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary w-full py-3.5 mt-2 disabled:opacity-60"
        >
          {submitting ? 'Sending…' : 'Submit Enquiry'}
        </button>

      </form>
    </div>
  )
}

function Field({ label, required, optional, error, children }) {
  return (
    <div className="mb-4.5">
      <label className="block text-[11px] font-semibold tracking-wide uppercase text-[#040809] mb-1.5">
        {label} {required && <span className="text-red-600">*</span>}
        {optional && (
          <span className="text-ink-soft font-normal normal-case tracking-normal text-[11px]">
            {' '}
            (optional)
          </span>
        )}
      </label>
      {children}
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
  )
}

function IconInput({ icon: Icon, withCaret, children }) {
  return (
    <div className="flex items-center gap-2.5 border border-line rounded-md px-3.5 bg-[#84A095]/50 focus-within:border-[#040809] focus-within:ring-2 focus-within:ring-[#84A095] transition-all">
      <Icon size={17} className="stroke-ink-soft flex-none" />
      {children}
      {withCaret && <ChevronDown size={13} className="stroke-ink-soft flex-none" />}
    </div>
  )
}