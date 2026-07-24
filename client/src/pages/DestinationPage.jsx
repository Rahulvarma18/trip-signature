import { useState, useMemo } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import {
    ChevronLeft,
    Star,
    Clock,
    MapPin,
    CheckCircle2,
    XCircle,
    ChevronRight,
    Phone,
    ShieldCheck,
    Users
} from 'lucide-react'
import { CATEGORIES } from '../data/destinations'
import {
    getGallery,
    getItinerary,
    getInclusions,
    getExclusions,
    getReviews,
    averageRating
} from '../data/detailContent'
import DestinationCard from '../components/DestinationCard'
import { CONTACT } from '../data/destinations'

export default function DestinationPage({ onEnquire }) {
    const { categoryKey, slug } = useParams()
    const category = CATEGORIES[categoryKey]
    const item = category?.items.find((i) => i.slug === slug)

    const gallery = useMemo(() => (item ? getGallery(item, category) : []), [item, category])
    const itinerary = useMemo(() => (item ? getItinerary(item) : []), [item])
    const inclusions = useMemo(() => (category ? getInclusions(category.key) : []), [category])
    const exclusions = useMemo(() => (category ? getExclusions(category.key) : []), [category])
    const reviews = useMemo(() => (item ? getReviews(item) : []), [item])
    const reviewAvg = useMemo(() => (item ? averageRating(reviews, item.rating) : 0), [reviews, item])

    const [activeImage, setActiveImage] = useState(0)

    if (!category || !item) return <Navigate to="/" replace />

    const similar = category.items.filter((i) => i.slug !== item.slug).slice(0, 3)

    return (
        <div>
            {/* Breadcrumb */}
            <div className="bg-[#082119] text-white py-6">
                <div className="section-container flex items-center gap-2 text-sm flex-wrap">
                    <Link to="/" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white">
                        <ChevronLeft size={16} /> Home
                    </Link>
                    <span className="text-white/40">/</span>
                    <Link to={`/category/${category.key}`} className="text-white/70 hover:text-white">
                        {category.label}
                    </Link>
                    <span className="text-white/40">/</span>
                    <span className="text-[#C5A059]">{item.name}</span>
                </div>
            </div>

            <div className="section-container py-10 md:py-14">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
                    {/* ---------- Main column ---------- */}
                    <div>
                        {/* Gallery */}
                        <div>
                            <div className="rounded-card overflow-hidden bg-[#F3ECE1]/50 h-[280px] sm:h-[380px] md:h-[440px] mb-3">
                                <img
                                    src={gallery[activeImage]}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {gallery.length > 1 && (
                                <div className="grid grid-cols-5 gap-3">
                                    {gallery.map((src, i) => (
                                        <button
                                            key={src + i}
                                            onClick={() => setActiveImage(i)}
                                            className={`h-[64px] sm:h-[80px] rounded-md overflow-hidden border-2 transition-all ${i === activeImage ? 'border-[#C9A86A]' : 'border-transparent opacity-80 hover:opacity-100'
                                                }`}
                                        >
                                            <img src={src} alt={`${item.name} ${i + 1}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Title block */}
                        <div className="mt-8 flex flex-wrap items-start justify-between gap-4">
                            <div>
                                <span className="eyebrow">{category.label}</span>
                                <h1 className="font-display font-semibold text-3xl md:text-[2.6rem] mt-2 leading-tight">
                                    {item.name}
                                </h1>
                                <div className="flex items-center flex-wrap gap-4 mt-3 text-sm text-ink-soft">
                                    <span className="flex items-center gap-1.5">
                                        <Star size={14} className="fill-[#C9A86A] stroke-[#C9A86A]" />
                                        <b className="text-[#111111]">{reviewAvg}</b> ({reviews.length} reviews)
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Clock size={14} /> {item.duration}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <MapPin size={14} /> India
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-xs uppercase tracking-wide text-ink-soft">Starting from</span>
                                <div className="font-display text-3xl font-bold text-[#111111]">{item.price}</div>
                                <span className="text-xs text-ink-soft">per person</span>
                            </div>
                        </div>

                        {/* Overview */}
                        <section className="mt-10">
                            <h2 className="font-display text-2xl font-semibold mb-3">Overview</h2>
                            <p className="text-[15px] text-ink-soft leading-relaxed">{item.description}</p>
                        </section>

                        {/* Highlights */}
                        {item.highlights?.length > 0 && (
                            <section className="mt-9">
                                <h2 className="font-display text-2xl font-semibold mb-4">Trip Highlights</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {item.highlights.map((h) => (
                                        <div
                                            key={h}
                                            className="flex items-start gap-2.5 bg-paper border border-line rounded-md px-4 py-3 text-[13.5px]"
                                        >
                                            <CheckCircle2 size={16} className="stroke-[#3D7A4F] flex-none mt-0.5" />
                                            {h}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Itinerary */}
                        <section className="mt-10">
                            <h2 className="font-display text-2xl font-semibold mb-4">Itinerary</h2>
                            <div className="space-y-4">
                                {itinerary.map((day) => (
                                    <div key={day.day} className="flex gap-4 bg-paper border border-line rounded-card p-5">
                                        <div className="flex-none w-11 h-11 rounded-full bg-[#0F382C] text-white flex items-center justify-center font-display font-bold">
                                            {day.day}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-[15px] mb-1">
                                                Day {day.day}: {day.title}
                                            </h3>
                                            <p className="text-[13.5px] text-ink-soft leading-relaxed">{day.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Inclusions / Exclusions */}
                        <section className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div>
                                <h2 className="font-display text-xl font-semibold mb-3">Inclusions</h2>
                                <ul className="space-y-2.5">
                                    {inclusions.map((inc) => (
                                        <li key={inc} className="flex items-start gap-2.5 text-[13.5px] text-ink-soft">
                                            <CheckCircle2 size={15} className="stroke-[#3D7A4F] flex-none mt-0.5" />
                                            {inc}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h2 className="font-display text-xl font-semibold mb-3">Exclusions</h2>
                                <ul className="space-y-2.5">
                                    {exclusions.map((exc) => (
                                        <li key={exc} className="flex items-start gap-2.5 text-[13.5px] text-ink-soft">
                                            <XCircle size={15} className="stroke-[#B65B4A] flex-none mt-0.5" />
                                            {exc}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>

                        {/* Reviews */}
                        <section className="mt-10">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-display text-2xl font-semibold">Traveller Reviews</h2>
                                <span className="flex items-center gap-1.5 text-sm">
                                    <Star size={16} className="fill-[#C9A86A] stroke-[#C9A86A]" />
                                    <b>{reviewAvg}</b>
                                    <span className="text-ink-soft">/ 5</span>
                                </span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                {reviews.map((r) => (
                                    <div key={r.id} className="bg-paper border border-line rounded-card p-6 relative">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-[38px] h-[38px] rounded-full bg-[#F3ECE1] flex items-center justify-center font-display font-bold text-[#111111] border border-[#E8E2D7]">
                                                {r.name.charAt(0)}
                                            </div>
                                            <div>
                                                <b className="block text-[13.5px]">{r.name}</b>
                                                <span className="text-xs text-ink-soft">{r.date}</span>
                                            </div>
                                            <span className="ml-auto flex items-center gap-1 text-xs font-semibold">
                                                <Star size={12} className="fill-[#C9A86A] stroke-[#C9A86A]" />
                                                {r.rating}
                                            </span>
                                        </div>
                                        <p className="text-[13.5px] text-ink-soft leading-relaxed italic">{r.quote}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* ---------- Sidebar ---------- */}
                    <aside className="lg:sticky lg:top-6 h-fit space-y-5">
                        <div className="bg-paper border border-line rounded-card p-6 shadow-signature">
                            <span className="text-xs uppercase tracking-wide text-ink-soft">Starting from</span>
                            <div className="font-display text-3xl font-bold text-[#111111] mb-1">{item.price}</div>
                            <span className="text-xs text-ink-soft">per person, taxes included</span>

                            <div className="mt-5 space-y-2.5 text-[13.5px] text-ink-soft">
                                <div className="flex items-center gap-2.5">
                                    <Clock size={15} /> {item.duration}
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <Users size={15} /> Solo, couples & groups
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <ShieldCheck size={15} className="stroke-[#3D7A4F]" /> Verified, trusted planning
                                </div>
                            </div>

                            <button
                                onClick={() => onEnquire?.(item.name)}
                                className="btn btn-primary w-full mt-6"
                            >
                                Enquire Now
                            </button>
                            <a href={CONTACT.phoneHref} className="btn btn-ghost w-full mt-3">
                                <Phone size={14} /> {CONTACT.phone}
                            </a>
                        </div>

                        <div className="bg-[#082119] text-white rounded-card p-6">
                            <h3 className="font-display text-lg font-semibold mb-2">Need help deciding?</h3>
                            <p className="text-white/75 text-[13px] leading-relaxed mb-4">
                                Talk to a travel curator about {item.name} — no obligation, just honest advice.
                            </p>
                            <button
                                onClick={() => onEnquire?.(item.name)}
                                className="btn bg-[#C9A86A] text-[#111111] hover:bg-white w-full border-none"
                            >
                                Request a Callback
                            </button>
                        </div>
                    </aside>
                </div>

                {/* ---------- Similar trips ---------- */}
                {similar.length > 0 && (
                    <section className="mt-16">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-display text-2xl font-semibold">More in {category.label}</h2>
                            <Link
                                to={`/category/${category.key}`}
                                className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-[#111111] hover:text-[#C9A86A]"
                            >
                                View All <ChevronRight size={14} />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {similar.map((s) => (
                                <DestinationCard key={s.slug} item={s} categoryKey={category.key} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    )
}