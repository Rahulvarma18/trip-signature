import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Menu, X, User, LogOut, Phone } from 'lucide-react'

export default function Navbar({ onSearchClick, user, onOpenAuth, onLogout, overlayHero }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    if (!overlayHero) return
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [overlayHero])

  const transparent = overlayHero && !scrolled

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Destinations', to: '/#packages' },
    { label: 'Spiritual', to: '/category/pilgrimage' },
    { label: 'Honeymoon', to: '/category/honeymoon' },
    { label: 'Trek', to: '/category/trek' },
  ]

  return (
    <header
      className={`${transparent
        ? 'absolute top-0 left-0 right-0 bg-transparent border-transparent'
        : 'sticky top-0 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8E2D7] shadow-sm'
        } z-50 transition-all duration-300`}
    >
      <div className="section-container flex items-center justify-between py-4">
        {/* Logo */}
        <Link
          to="/"
          className={`font-display text-2xl font-bold tracking-tight ${transparent ? 'text-white' : 'text-[#111111]'
            }`}
        >
          Trip<span className="font-signature mt-1 text-[#C9A86A]">Signature</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:block">
          <ul className="flex gap-7">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.to}
                  className={`text-[13px] font-medium relative group transition-colors ${transparent
                    ? 'text-white/90 hover:text-[#C9A86A]'
                    : 'text-[#1E1E1E] hover:text-[#C9A86A]'
                    }`}
                >
                  {link.label}
                  <span
                    className={`absolute left-0 -bottom-1 h-px w-0 transition-all duration-200 group-hover:w-full ${transparent ? 'bg-[#C9A86A]' : 'bg-[#C9A86A]'
                      }`}
                  />
                </Link>
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
            <UserMenu
              user={user}
              onLogout={onLogout}
              transparent={transparent}
            />
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className={`text-sm font-medium px-3 py-2 transition-colors ${transparent ? 'text-white/85 hover:text-white' : 'hover:text-black'
                  }`}
              >
                Log In
              </button>
              <button
                onClick={() => onOpenAuth('signup')}
                className="btn btn-primary text-xs"
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            className={`md:hidden transition-colors ${transparent ? 'text-white' : 'text-black'
              }`}
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-line bg-white">
          <ul className="section-container py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium hover:text-black transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="flex items-center gap-3 pt-2 border-t border-line">
              {user ? (
                <button
                  onClick={onLogout}
                  className="text-sm font-medium text-black flex items-center gap-1.5"
                >
                  <LogOut size={15} /> Log out ({user.name})
                </button>
              ) : (
                <>
                  <button
                    onClick={() => { onOpenAuth('login'); setOpen(false) }}
                    className="text-sm font-medium flex items-center gap-1.5"
                  >
                    <User size={15} /> Log In
                  </button>
                  <button
                    onClick={() => { onOpenAuth('signup'); setOpen(false) }}
                    className="text-sm font-medium text-black"
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

function UserMenu({ user, onLogout, transparent }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative hidden sm:block">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-2 text-sm font-medium ${transparent ? 'text-white' : ''
          }`}
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
