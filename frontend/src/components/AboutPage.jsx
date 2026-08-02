// src/pages/AboutPage.jsx

import LegalPageLayout from './LegalPageLayout'
import { CONTACT } from '../data/destinations'

export default function AboutPage() {
    return (
        <LegalPageLayout eyebrow="Our Story" title="About TripSignature">
            <p>
                TripSignature is a curated travel discovery platform built around one idea: a trip worth
                taking is worth planning properly. We put together pilgrimage journeys, honeymoons, treks,
                safaris, family holidays, luxury escapes, and quick weekend getaways — each one researched,
                itinerary-planned, and ready to book.
            </p>
            <p>
                Every destination on this site comes with a day-by-day plan, clear inclusions and
                exclusions, and honest traveller reviews, so you know exactly what you're signing up for
                before you enquire.
            </p>
            <h2 className="font-display text-xl font-semibold text-[#040809] pt-2">What we do</h2>
            <p>
                We handle the planning — routes, stays, local logistics — so you can focus on the actual
                travelling. Whether it's a sunrise darshan at a Himalayan shrine, a quiet honeymoon on the
                coast, or a weekend trek with friends, our team puts together the details in advance and
                stays reachable throughout your trip.
            </p>
            <h2 className="font-display text-xl font-semibold text-[#040809] pt-2">Get in touch</h2>
            <p>
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
        </LegalPageLayout>
    )
}