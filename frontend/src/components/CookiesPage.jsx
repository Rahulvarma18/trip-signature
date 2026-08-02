// src/pages/CookiesPage.jsx

import LegalPageLayout from './LegalPageLayout'
import { CONTACT } from '../data/destinations'

export default function CookiesPage() {
    return (
        <LegalPageLayout eyebrow="Legal" title="Cookie Policy" updated="August 2026">
            <p>
                TripSignature uses a small amount of browser storage to keep the site working smoothly —
                nothing more than what's needed for the core experience.
            </p>

            <h2 className="font-display text-xl font-semibold text-[#040809] pt-2">What we store</h2>
            <ul className="list-disc pl-5 space-y-1.5">
                <li>A session token, so you stay logged in between visits.</li>
                <li>Basic preferences, like whether you've dismissed a banner.</li>
            </ul>

            <h2 className="font-display text-xl font-semibold text-[#040809] pt-2">What we don't do</h2>
            <p>
                We don't use third-party advertising trackers or sell browsing data. Any analytics we use
                are aggregate and aimed at understanding which destinations are popular — not at tracking
                you individually.
            </p>

            <h2 className="font-display text-xl font-semibold text-[#040809] pt-2">Your control</h2>
            <p>
                You can clear your browser's local storage at any time, which will log you out. Most
                browsers also let you block storage entirely, though parts of the site (like staying
                logged in) won't work correctly without it.
            </p>

            <p>
                Questions? Email us at{' '}
                <a href={`mailto:${CONTACT.email}`} className="text-[#040809] font-medium underline">
                    {CONTACT.email}
                </a>
                .
            </p>
        </LegalPageLayout>
    )
}