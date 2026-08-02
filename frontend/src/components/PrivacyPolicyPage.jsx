// src/pages/PrivacyPolicyPage.jsx

import LegalPageLayout from './LegalPageLayout'
import { CONTACT } from '../data/destinations'

export default function PrivacyPolicyPage() {
    return (
        <LegalPageLayout eyebrow="Legal" title="Privacy Policy" updated="August 2026">
            <p>
                This policy explains what information TripSignature collects when you use this site, and
                how it's used. It's written in plain language on purpose — if anything here is unclear,
                email us and we'll clarify it.
            </p>

            <h2 className="font-display text-xl font-semibold text-[#040809] pt-2">What we collect</h2>
            <ul className="list-disc pl-5 space-y-1.5">
                <li>Account details: name and email address, when you sign up or log in (including via Google).</li>
                <li>Enquiry details: name, phone number, destination interest, and travel preferences, when you submit an enquiry form.</li>
                <li>Reviews: the text and rating you submit for a destination, along with your account name.</li>
                <li>Newsletter: your email address, if you subscribe.</li>
                <li>Basic technical data such as browser type and pages visited, for keeping the site working correctly.</li>
            </ul>

            <h2 className="font-display text-xl font-semibold text-[#040809] pt-2">How we use it</h2>
            <p>
                We use your information to respond to enquiries, manage your account, display your reviews
                on destination pages, and send occasional newsletter updates if you've opted in. We do not
                sell your personal data to third parties.
            </p>

            <h2 className="font-display text-xl font-semibold text-[#040809] pt-2">Your choices</h2>
            <p>
                You can edit or delete your own reviews at any time from the destination page. You can
                unsubscribe from the newsletter at any point by contacting us. To request deletion of your
                account or data, email{' '}
                <a href={`mailto:${CONTACT.email}`} className="text-[#040809] font-medium underline">
                    {CONTACT.email}
                </a>
                .
            </p>

            <h2 className="font-display text-xl font-semibold text-[#040809] pt-2">Security</h2>
            <p>
                Passwords are hashed and never stored in plain text. Account sessions use signed tokens.
                We take reasonable steps to protect your data, though no online system can guarantee
                absolute security.
            </p>
        </LegalPageLayout>
    )
}