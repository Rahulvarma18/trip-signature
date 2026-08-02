// src/pages/TermsOfServicePage.jsx

import LegalPageLayout from './LegalPageLayout'
import { CONTACT } from '../data/destinations'

export default function TermsOfServicePage() {
    return (
        <LegalPageLayout eyebrow="Legal" title="Terms of Service" updated="August 2026">
            <p>
                By using TripSignature, you agree to the terms below. If you don't agree with any part of
                them, please don't use the site.
            </p>

            <h2 className="font-display text-xl font-semibold text-[#040809] pt-2">Using this site</h2>
            <p>
                Destination pages, pricing, and itineraries are provided for planning purposes and are
                subject to change. Submitting an enquiry does not confirm a booking — a member of our team
                will follow up to finalise details, availability, and final pricing.
            </p>

            <h2 className="font-display text-xl font-semibold text-[#040809] pt-2">Accounts</h2>
            <p>
                You're responsible for keeping your account credentials secure. Please provide accurate
                information when signing up and submitting enquiries, so we can actually help you plan
                your trip.
            </p>

            <h2 className="font-display text-xl font-semibold text-[#040809] pt-2">Reviews</h2>
            <p>
                Reviews should reflect a genuine experience and stay respectful. We reserve the right to
                remove reviews that are abusive, spam, or clearly not based on an actual trip. You can edit
                or delete your own reviews at any time.
            </p>

            <h2 className="font-display text-xl font-semibold text-[#040809] pt-2">Liability</h2>
            <p>
                Travel involves inherent risk. TripSignature helps plan and coordinate trips, but is not
                liable for circumstances outside our control — weather, third-party service providers,
                government restrictions, and similar events.
            </p>

            <h2 className="font-display text-xl font-semibold text-[#040809] pt-2">Questions</h2>
            <p>
                Reach out at{' '}
                <a href={`mailto:${CONTACT.email}`} className="text-[#040809] font-medium underline">
                    {CONTACT.email}
                </a>{' '}
                if anything here needs clarifying.
            </p>
        </LegalPageLayout>
    )
}