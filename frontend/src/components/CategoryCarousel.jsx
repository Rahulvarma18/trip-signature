import { useRef, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
    ChevronLeft,
    ChevronRight,
    Smartphone,
    Palmtree,
    Landmark,
    Car,
    Users,
    Gem,
    Building2,
    HeartHandshake,
    Mountain,
    MessageSquareText
} from 'lucide-react'

const CIRCLES = [
    // { key: 'easybook', label: 'Easy Book', icon: Smartphone, badge: 'New' },
    { key: 'beach', label: 'Beach', icon: Palmtree, categoryKey: 'beach' },
    { key: 'pilgrimage', label: 'Pilgrimage', icon: Landmark, categoryKey: 'pilgrimage' },
    { key: 'safari', label: 'Safari Trails', icon: Car, categoryKey: 'safari' },
    { key: 'family', label: 'Family Retreat', icon: Users, categoryKey: 'family' },
    { key: 'luxury', label: 'Luxury', icon: Gem, categoryKey: 'luxury' },
    { key: 'weekend', label: 'Weekend', icon: Building2, categoryKey: 'weekend' },
    { key: 'honeymoon', label: 'Honeymoon', icon: HeartHandshake, categoryKey: 'honeymoon' },
    { key: 'adventure', label: 'Adventure', icon: Mountain, categoryKey: 'trek' }
]

export default function CategoryCarousel() {
    const scrollerRef = useRef(null)
    const navigate = useNavigate()
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(true)

    const updateArrows = () => {
        const el = scrollerRef.current
        if (!el) return
        setCanScrollLeft(el.scrollLeft > 8)
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8)
    }

    useEffect(() => {
        updateArrows()
        const el = scrollerRef.current
        if (!el) return
        el.addEventListener('scroll', updateArrows, { passive: true })
        window.addEventListener('resize', updateArrows)
        return () => {
            el.removeEventListener('scroll', updateArrows)
            window.removeEventListener('resize', updateArrows)
        }
    }, [])

    const scrollBy = (dir) => {
        const el = scrollerRef.current
        if (!el) return
        el.scrollBy({ left: dir * 320, behavior: 'smooth' })
    }

    return (
        <section className="relative py-10 border-b border-line">
            <div className="section-container relative">
                {canScrollLeft && (
                    <button
                        onClick={() => scrollBy(-1)}
                        aria-label="Scroll left"
                        className="absolute -left-1 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white border border-[#84A095] shadow-signature flex items-center justify-center hover:border-[#4E3924] transition-colors"
                    >
                        <ChevronLeft size={18} className="stroke-[#040809]" />
                    </button>
                )}
                {canScrollRight && (
                    <button
                        onClick={() => scrollBy(1)}
                        aria-label="Scroll right"
                        className="absolute -right-1 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white border border-[#84A095] shadow-signature flex items-center justify-center hover:border-[#4E3924] transition-colors"
                    >
                        <ChevronRight size={18} className="stroke-[#040809]" />
                    </button>
                )}

                <div
                    ref={scrollerRef}
                    className="flex gap-6 overflow-x-auto scroll-smooth px-10 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                >
                    {CIRCLES.map((item) => {
                        const Icon = item.icon
                        const circleInner = (
                            <>
                                {item.badge && (
                                    <span className="absolute top-3 bg-[#040809] text-[#FFFFFF] border border-[#040809]/50 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full">
                                        {item.badge}
                                    </span>
                                )}
                                <Icon size={34} className="stroke-[#040809]" strokeWidth={1.6} />
                                <span className="font-display text-lg font-semibold text-[#040809]">{item.label}</span>
                                <span className="text-[11px] font-semibold uppercase tracking-wide text-[#040809]">
                                    Explore Now
                                </span>
                            </>
                        )
                        const circleClass =
                            'relative flex-none w-[190px] h-[190px] rounded-full bg-[#84A095]/60 border border-[#84A095] flex flex-col items-center justify-center gap-2 hover:bg-white hover:border-[#4E3924] transition-all duration-200 hover:shadow-signature'

                        return item.categoryKey ? (
                            <Link key={item.key} to={`/category/${item.categoryKey}`} className={circleClass}>
                                {circleInner}
                            </Link>
                        ) : (
                            <button
                                key={item.key}
                                onClick={() => navigate('/#inquire')}
                                className={circleClass}
                            >
                                {circleInner}
                            </button>
                        )
                    })}
                </div>
            </div>

            <a
                href="#inquire"
                className="hidden sm:flex items-center gap-2 fixed sm:absolute right-6 bottom-6 sm:bottom-4 z-30 bg-[#040809] text-[#FFFFFF] border border-[#040809]/50 shadow-deep rounded-full pl-4 pr-5 py-3 text-sm font-semibold hover:bg-[#4E3924] hover:text-[#040809] transition-all duration-300"
            >
                <MessageSquareText size={16} className="stroke-current" />
                Plan Your Trip
            </a>
        </section>
    )
}