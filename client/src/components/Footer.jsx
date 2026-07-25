import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react'
import { CATEGORY_LIST, CONTACT } from '../data/destinations'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setSubscribed(true)
    setEmail('')
  }

  return (
    <footer className="bg-black text-white/80 pt-16 pb-6">
      <div className="section-container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.3fr] gap-11 mb-12">
          <div>
            <div className="font-display text-2xl text-white mb-3.5">
              Trip<span className="font-signature text-[#C5A059]">Signature</span>
            </div>
            <p className="text-[13.5px] leading-relaxed text-white/60 max-w-xs">
              A curated travel discovery platform for pilgrimage, honeymoon and trekking
              journeys. Pack a bag. The world is vast.
            </p>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.12em] uppercase text-white mb-4">Explore</h4>
            <ul className="flex flex-col gap-2.5">
              <li><Link to="/#packages" className="footer-link">All Packages</Link></li>
              {CATEGORY_LIST.map((cat) => (
                <li key={cat.key}>
                  <Link to={`/category/${cat.key}`} className="footer-link">
                    {cat.shortLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.12em] uppercase text-white mb-4">Company</h4>
            <ul className="flex flex-col gap-2.5">
              <li><a href="#" className="footer-link">About Us</a></li>
              <li><Link to="/#inquire" className="footer-link">Plan a Trip</Link></li>
              <li><a href="#" className="footer-link">Privacy Policy</a></li>
              <li><a href="#" className="footer-link">Terms of Service</a></li>
            </ul>
            <div className="mt-6 flex flex-col gap-2.5">
              <div className="flex gap-2.5 text-[13.5px] items-start">
                <Phone size={15} className="stroke-[#C5A059] flex-none mt-0.5" />
                <span>{CONTACT.phone}</span>
              </div>
              <div className="flex gap-2.5 text-[13.5px] items-start">
                <Mail size={15} className="stroke-[#C5A059] flex-none mt-0.5" />
                <span>{CONTACT.email}</span>
              </div>
              <div className="flex gap-2.5 text-[13.5px] items-start">
                <MapPin size={15} className="stroke-[#C5A059] flex-none mt-0.5" />
                <span>{CONTACT.address}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.12em] uppercase text-white mb-4">Newsletter</h4>
            <p className="text-[13.5px] text-white/60 mb-4">
              Join our mailing list for weekly inspiration.
            </p>
            {subscribed ? (
              <p className="text-sm text-white">You're subscribed — welcome aboard.</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="flex-1 min-w-0 bg-white/10 border border-white/20 rounded-l-sm px-3.5 py-2.5 text-sm text-white placeholder:text-white/40 outline-none focus:border-[#C5A059]"
                />
                <button
                  type="submit"
                  className="bg-[#C5A059] text-[#082119] hover:bg-[#d4b069] transition-colors px-4 rounded-r-sm flex items-center justify-center font-medium"
                  aria-label="Subscribe"
                >
                  <ArrowRight size={16} className="stroke-[#082119]" />
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="border-t border-white/10 pt-5 flex flex-wrap justify-between gap-2.5 text-[12.5px] text-white/40">
          <span>&copy; {new Date().getFullYear()} TripSignature Exploration. All rights reserved.</span>
          <div className="flex gap-5">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  )
}