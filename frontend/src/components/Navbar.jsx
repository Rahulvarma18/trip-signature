import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Menu, X, User, LogOut, Phone } from 'lucide-react'
import { useLenis } from '../lib/LenisProvider'

export default function Navbar({ onSearchClick, onGoToPackages, user, onOpenAuth, onLogout, overlayHero }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const lenis = useLenis()
  const navigate = useNavigate()

  const handleLogoClick = (e) => {
    e.preventDefault()
    navigate('/')
    // Scroll to top immediately
    setTimeout(() => {
      lenis?.current?.scrollTo(0, { immediate: true })
    }, 0)
  }

  useEffect(() => {
    if (!overlayHero) return
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [overlayHero])

  useEffect(() => {
    if (overlayHero) {
      setScrolled(false)
    }
  }, [overlayHero])

  const transparent = overlayHero && !scrolled

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Destinations', to: "#popular-destinations" },
    { label: 'Spiritual', to: '/category/pilgrimage' },
    { label: 'Honeymoon', to: '/category/honeymoon' },
    { label: 'Trek', to: '/category/trek' },
  ]

  return (
    <header
      className={`${transparent
        ? 'absolute top-0 left-0 right-0 bg-transparent border-transparent'
        : 'sticky top-0 bg-[#040809]/95 backdrop-blur-md border-b border-white/10 shadow-sm'
        } z-50 transition-all duration-300`}
    >
      <div className="section-container flex items-center justify-between py-4">
        {/* Logo */}
        <Link
          to="/"
          onClick={handleLogoClick}
          className="font-display text-2xl tracking-tight text-white"
        >
          Trip<span className="font-signature mt-1 text-[#D4AF37]">Signature</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:block">
          <ul className="flex gap-7">
            {navLinks.map((link) => (
              <li key={link.label}>
                {link.action ? (
                  <button
                    onClick={link.action}
                    className="text-[13px] font-medium relative group transition-colors text-white/90 hover:text-[#F8F0CA]"
                  >
                    {link.label}
                    <span className="absolute left-0 -bottom-1 h-px w-0 transition-all duration-200 group-hover:w-full bg-[#F8F0CA]" />
                  </button>
                ) : (
                  <Link
                    to={link.to}
                    className="text-[13px] font-medium relative group transition-colors text-white/90 hover:text-[#F8F0CA]"
                  >
                    {link.label}
                    <span className="absolute left-0 -bottom-1 h-px w-0 transition-all duration-200 group-hover:w-full bg-[#F8F0CA]" />
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {/* Phone (desktop) */}
          {/* <a
            href="tel:+6980002468"
            className={`hidden lg:flex items-center gap-1.5 text-[12px] font-medium ${transparent ? 'text-white/85 hover:text-white' : 'text-ink-soft hover:text-black'
              } transition-colors`}
          >
            <Phone size={13} />
            +69 800 0246 88
          </a> */}

          {/* <button
            onClick={onSearchClick}
            aria-label="Search"
            className={`hidden sm:flex transition-colors ${transparent ? 'text-white/85 hover:text-white' : 'text-ink hover:text-black'
              }`}
          >
            <Search size={18} />
          </button> */}

          {user ? (
            <UserMenu user={user} onLogout={onLogout} />
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="text-sm font-medium px-3 py-2 transition-colors text-white/85 hover:text-white"
              >
                Log In
              </button>
              <button
                onClick={() => onOpenAuth('signup')}
                className="bg-[#4E3924] text-[#F8F0CA] hover:bg-[#3A2A1A] transition-colors px-5 py-2.5 rounded-sm text-xs font-semibold tracking-wider uppercase"
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden transition-colors text-white"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/10 bg-[#040809]">
          <ul className="section-container py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <li key={link.label}>
                {link.action ? (
                  <button
                    onClick={() => { link.action(); setOpen(false) }}
                    className="text-sm font-medium text-white/90 hover:text-[#F8F0CA] transition-colors"
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className="text-sm font-medium text-white/90 hover:text-[#F8F0CA] transition-colors"
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
            <li className="flex items-center gap-3 pt-2 border-t border-white/10">
              {user ? (
                <button
                  onClick={onLogout}
                  className="text-sm font-medium text-white flex items-center gap-1.5"
                >
                  <LogOut size={15} /> Log out ({user.name})
                </button>
              ) : (
                <>
                  <button
                    onClick={() => { onOpenAuth('login'); setOpen(false) }}
                    className="text-sm font-medium text-white flex items-center gap-1.5"
                  >
                    <User size={15} /> Log In
                  </button>
                  <button
                    onClick={() => { onOpenAuth('signup'); setOpen(false) }}
                    className="text-sm font-medium text-white"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}

function UserMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative hidden sm:block">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 text-sm font-medium text-white"
      >
        <span className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-black font-semibold font-display">
          {user.name?.[0]?.toUpperCase() || 'U'}
        </span>
        {user.name}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white border border-line rounded-md shadow-signature py-2">
          <button
            onClick={() => { onLogout(); setOpen(false) }}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-ink hover:bg-neutral-100 hover:text-black transition-colors"
          >
            <LogOut size={15} /> Log out
          </button>
        </div>
      )}
    </div>
  )
}