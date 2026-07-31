// src/pages/AdminPage.jsx
// Admin dashboard: manage destinations and view/manage enquiries.

import { useState } from 'react'
import { MapPinned, Inbox } from 'lucide-react'
import DestinationsManager from '../components/admin/DestinationsManager'
import InquiriesManager from '../components/admin/InquiriesManager'

const TABS = [
    { key: 'destinations', label: 'Destinations', icon: MapPinned },
    { key: 'inquiries', label: 'Enquiries', icon: Inbox }
]

export default function AdminPage({ token, adminName }) {
    const [tab, setTab] = useState('destinations')

    return (
        <div className="section-container py-10 md:py-14 min-h-[70vh]">
            <div className="mb-8">
                <span className="eyebrow">Admin</span>
                <h1 className="font-display text-3xl font-semibold mt-2">
                    {adminName ? `Welcome, ${adminName}` : 'Dashboard'}
                </h1>
            </div>

            <div className="flex gap-2 border-b border-line mb-7">
                {TABS.map(({ key, label, icon: Icon }) => (
                    <button
                        key={key}
                        onClick={() => setTab(key)}
                        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${tab === key
                                ? 'border-[#040809] text-[#040809]'
                                : 'border-transparent text-ink-soft hover:text-[#040809]'
                            }`}
                    >
                        <Icon size={15} /> {label}
                    </button>
                ))}
            </div>

            {tab === 'destinations' ? (
                <DestinationsManager token={token} />
            ) : (
                <InquiriesManager token={token} />
            )}
        </div>
    )
}