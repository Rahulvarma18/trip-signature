import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, ChevronRight, Star } from 'lucide-react'

const DESTINATIONS = [
    {
        name: 'Kedarnath',
        country: 'Uttarakhand, India',
        rating: 4.9,
        description: 'One of the twelve Jyotirlingas, set against the snow-capped Kedarnath range.',
        image: '/kedar.png',
        link: '/category/pilgrimage/kedarnath',
    },
    {
        name: 'Maldives',
        country: 'South Asia',
        rating: 4.8,
        description: 'Crystal-clear lagoons and overwater bungalows in the heart of the Indian Ocean.',
        image: '/maldives.png',
        link: '/category/beach',
    },
    {
        name: 'Bali',
        country: 'Indonesia',
        rating: 4.8,
        description: 'Lush terraced rice fields, sacred temples, and a rich spiritual culture.',
        image: '/bali.png',
        link: '/category/honeymoon',
    },
    {
        name: 'Kashi Varanasi',
        country: 'Uttar Pradesh, India',
        rating: 4.9,
        description: 'Sunrise boat rides on the Ganga and the grand evening Ganga Aarti.',
        image: '/images/destinations/kashi-varanasi/1.png',
        link: '/category/pilgrimage/kashi-varanasi',
    },
    {
        name: 'Char Dham',
        country: 'Uttarakhand, India',
        rating: 4.9,
        description: 'The complete pilgrimage covering all four sacred Himalayan shrines.',
        image: '/images/destinations/char-dham-yatra/1.png',
        link: '/category/pilgrimage/char-dham-yatra',
    },
    {
        name: 'Himachal',
        country: 'India',
        rating: 4.9,
        description: 'Himalayan valleys, serene lakes, and adventure activities.',
        image: '/images/destinations/himachal/1.png',
        link: '/category/honeymoon/himachal',
    },
]

export default function PopularDestinations() {
    const sectionRef = useRef(null)
    const scrollerRef = useRef(null)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(true)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    observer.disconnect()
                }
            },
            { threshold: 0.15 }
        )
        if (sectionRef.current) {
            observer.observe(sectionRef.current)
        }
        return () => observer.disconnect()
    }, [])

    const updateArrows = () => {
        const el = scrollerRef.current
        if (!el) return
        setCanScrollLeft(el.scrollLeft > 8)
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8)
    }

    const scrollBy = (dir) => {
        const el = scrollerRef.current
        if (!el) return
        // Scroll by exact 3-card width plus gap offset
        el.scrollBy({ left: dir * (el.clientWidth + 20), behavior: 'smooth' })
    }

    return (
        <section ref={sectionRef} id="popular-destinations" className="py-16 overflow-hidden">
            <div className={`section-container mb-8 flex items-end justify-between transition-opacity duration-700 ${isVisible ? 'animate-hero-title' : 'opacity-0'}`}>
                <div>
                    <p className="eyebrow mb-3">Handpicked for you</p>
                    <h2 className="font-display text-4xl sm:text-5xl font-semibold text-ink leading-tight">
                        Popular Destinations
                    </h2>
                </div>
                <Link
                    to="/category/pilgrimage"
                    className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-[#2B2B2B] hover:text-[#B3B3B3] transition-colors group"
                >
                    View all <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#2B2B2B]" />
                </Link>
            </div>

            <div className="section-container relative">
                {/* Scrollable cards */}
                <div
                    ref={scrollerRef}
                    onScroll={updateArrows}
                    className="flex gap-5 overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-1"
                >
                    {DESTINATIONS.map((dest, idx) => (
                        <Link
                            key={dest.name}
                            to={dest.link}
                            style={{ animationDelay: `${idx * 120}ms` }}
                            className={`relative flex-none w-[85vw] sm:w-[calc((100%-2.5rem)/3)] h-[420px] rounded-2xl overflow-hidden group block transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl ${isVisible ? 'animate-card-appear' : 'opacity-0'}`}
                        >
                            {/* Background image */}
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                                style={{ backgroundImage: `url('${dest.image}')` }}
                            />
                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10 transition-opacity duration-300 group-hover:opacity-95" />

                            {/* Arrow button top-right */}
                            <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#FFFFFF]/90 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-md border border-[#2B2B2B]/40">
                                <ArrowUpRight size={18} className="text-[#2B2B2B] transition-transform group-hover:scale-110" />
                            </div>

                            {/* Bottom content */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 transition-transform duration-300 group-hover:-translate-y-1">
                                {/* Country tag + rating */}
                                <div className="flex items-center gap-2 mb-2.5">
                                    <span className="bg-black/40 backdrop-blur-md text-[#FFFFFF] text-[11px] font-medium px-3 py-1 rounded-full border border-white/20 shadow-sm">
                                        {dest.country}
                                    </span>
                                    <span className="flex items-center gap-1 text-white text-[12px] font-medium bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15">
                                        <Star size={11} className="fill-[#D4AF37] stroke-[#D4AF37]" />
                                        {dest.rating}
                                    </span>
                                </div>

                                {/* Name */}
                                <h3 className="font-display text-3xl font-semibold text-[#FFFFFF] leading-tight mb-1.5 drop-shadow-sm">
                                    {dest.name}
                                </h3>

                                {/* Description */}
                                <p className="text-white/80 text-[13px] leading-relaxed line-clamp-2">
                                    {dest.description}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Left scroll button */}
                {canScrollLeft && (
                    <button
                        onClick={() => scrollBy(-1)}
                        aria-label="Scroll left"
                        className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#2B2B2B] text-[#FFFFFF] flex items-center justify-center shadow-deep hover:bg-[#B3B3B3] hover:text-[#2B2B2B] transition-all duration-200 hover:scale-110 active:scale-95 z-10 border border-[#2B2B2B]/40"
                    >
                        <ChevronRight size={22} className="rotate-180" />
                    </button>
                )}

                {/* Right scroll button */}
                {canScrollRight && (
                    <button
                        onClick={() => scrollBy(1)}
                        aria-label="Scroll right"
                        className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#2B2B2B] text-[#FFFFFF] flex items-center justify-center shadow-deep hover:bg-[#B3B3B3] hover:text-[#2B2B2B] transition-all duration-200 hover:scale-110 active:scale-95 z-10 border border-[#2B2B2B]/40"
                    >
                        <ChevronRight size={22} />
                    </button>
                )}
            </div>
        </section>
    )
}