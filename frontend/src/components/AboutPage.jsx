// src/components/AboutPage.jsx

import { useState } from 'react'
import { Users, CalendarDays, Compass, Quote } from 'lucide-react'
import { CONTACT } from '../data/destinations'

// ---- Edit these to update the page ----
const OWNER = {
    name: '', // e.g. 'Your Name' — leave empty to hide the name line
    title: 'Founder & Owner',
    // Put the owner's photo at frontend/public/images/owner.jpg
    photo: '/images/owner.jpg'
}

const HIGHLIGHTS = [
    {
        icon: Users,
        label: 'Our Team',
        text: 'Every member of our team is experienced in the travel industry, from planning your itinerary to supporting you on the ground.'
    },
    {
        icon: CalendarDays,
        label: 'Founded',
        value: '2025',
        text: 'Started with a simple goal: make travel easy, honest and truly satisfying.'
    },
    {
        icon: Compass,
        label: 'Batches',
        text: 'We have successfully departed many group batches and private batches, each one planned with care.'
    }
]

export default function AboutPage() {
    const [photoFailed, setPhotoFailed] = useState(false)

    return (
        <div className="section-container py-14 md:py-20">
            {/* Intro */}
            <div className="max-w-3xl">
                <span className="eyebrow">Our Story</span>
                <h1 className="font-display text-3xl md:text-5xl font-semibold mt-2 mb-5">
                    About Trip Signature
                </h1>
                <p className="text-[15px] md:text-base leading-relaxed text-ink-soft">
                    Trip Signature is a curated travel company built around one idea: a trip worth taking is
                    worth planning properly. We put together pilgrimage journeys, honeymoons, treks, safaris,
                    family holidays, luxury escapes and quick weekend getaways, each one researched,
                    itinerary-planned and ready to book.
                </p>
            </div>

            {/* Motto */}
            <div className="relative mt-10 md:mt-14 rounded-[10px] bg-[#040809] text-[#F8F0CA] px-6 py-10 md:px-14 md:py-14 overflow-hidden">
                <Quote size={44} className="absolute top-6 left-6 md:top-8 md:left-10 opacity-20" />
                <p className="relative text-[11px] font-semibold tracking-[0.2em] uppercase text-[#F8F0CA]/70 mb-3 text-center">
                    Our Motto
                </p>
                <p className="relative font-display text-2xl md:text-4xl font-semibold text-center leading-snug max-w-3xl mx-auto">
                    Complete your travel with full satisfaction
                </p>
            </div>

            {/* Team / Founded / Batches */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
                {HIGHLIGHTS.map(({ icon: Icon, label, value, text }) => (
                    <div
                        key={label}
                        className="bg-paper border border-line rounded-[10px] p-7 shadow-sm"
                    >
                        <span className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#84A095]/50 mb-4">
                            <Icon size={20} className="stroke-[#040809]" />
                        </span>
                        <h2 className="font-display text-xl font-semibold text-[#040809]">{label}</h2>
                        {value && (
                            <p className="font-display text-3xl font-semibold text-[#4E3924] mt-1">{value}</p>
                        )}
                        <p className="text-sm leading-relaxed text-ink-soft mt-2">{text}</p>
                    </div>
                ))}
            </div>

            {/* Owner */}
            <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-8 md:gap-12 items-center mt-14 md:mt-20">
                <div className="mx-auto w-full max-w-[320px]">
                    <div className="aspect-[4/5] rounded-[10px] overflow-hidden border border-line bg-[#84A095]/40 shadow-deep flex items-center justify-center">
                        {photoFailed ? (
                            <Compass size={64} className="stroke-[#040809]/40" />
                        ) : (
                            <img
                                src={OWNER.photo}
                                alt={OWNER.name ? `${OWNER.name}, ${OWNER.title}` : OWNER.title}
                                onError={() => setPhotoFailed(true)}
                                className="w-full h-full object-cover"
                            />
                        )}
                    </div>
                </div>

                <div>
                    <span className="eyebrow">Meet the Owner</span>
                    {OWNER.name && (
                        <h2 className="font-display text-2xl md:text-3xl font-semibold mt-2">{OWNER.name}</h2>
                    )}
                    <p className="text-[13px] font-semibold tracking-wide uppercase text-[#4E3924] mt-1 mb-5">
                        {OWNER.title}
                    </p>
                    <div className="space-y-4 text-[15px] leading-relaxed text-ink-soft">
                        <p>
                            I am a travel-holic. Travelling is not just my work, it is what I love most. After
                            spending 2 years in the travel industry, learning how journeys are really planned and
                            what travellers truly need, I started Trip Signature in 2025.
                        </p>
                        <p>
                            My goal is simple: every traveller should return home happy and satisfied. That is
                            why we plan every trip with care, keep our promises clear, and stay reachable
                            throughout your journey.
                        </p>
                        <p>
                            Whether it is a temple darshan with family, a honeymoon, or a trek with friends, I
                            would love to be part of your story.
                        </p>
                    </div>
                </div>
            </div>

            {/* Contact */}
            <div className="max-w-3xl mt-14 md:mt-20">
                <h2 className="font-display text-xl font-semibold text-[#040809] mb-2">Get in touch</h2>
                <p className="text-[15px] leading-relaxed text-ink-soft">
                    Have a question before you book, or a trip in mind that isn't listed yet? Reach us at{' '}
                    <a href={`mailto:${CONTACT.email}`} className="text-[#040809] font-medium underline">
                        {CONTACT.email}
                    </a>{' '}
                    or call{' '}
                    <a href={CONTACT.phoneHref} className="text-[#040809] font-medium underline">
                        {CONTACT.phone}
                    </a>
                    . We're based out of {CONTACT.address}.
                </p>
            </div>
        </div>
    )
}