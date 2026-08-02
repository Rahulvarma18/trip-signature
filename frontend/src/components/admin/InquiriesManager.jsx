// src/components/admin/InquiriesManager.jsx
// Admin table for viewing enquiry-form submissions and updating their status.

import { useEffect, useState, useCallback, useMemo } from 'react'
import { Loader2, Phone, Mail, ChevronDown, ChevronUp, Search, X } from 'lucide-react'
import { inquiryApi } from '../../lib/api'

const STATUS_OPTIONS = ['new', 'contacted', 'in-progress', 'converted', 'closed']

const STATUS_STYLES = {
    new: 'bg-amber-100 text-amber-800',
    contacted: 'bg-blue-100 text-blue-800',
    'in-progress': 'bg-purple-100 text-purple-800',
    converted: 'bg-green-100 text-green-800',
    closed: 'bg-neutral-200 text-neutral-700'
}

export default function InquiriesManager({ token }) {
    const [inquiries, setInquiries] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [expandedId, setExpandedId] = useState(null)
    const [updatingId, setUpdatingId] = useState(null)
    const [query, setQuery] = useState('')

    const load = useCallback(async () => {
        setLoading(true)
        setError('')
        try {
            const res = await inquiryApi.adminList({ status: statusFilter || undefined, token })
            setInquiries(res.data.inquiries)
        } catch (err) {
            setError(err.message || 'Failed to load enquiries.')
        } finally {
            setLoading(false)
        }
    }, [statusFilter, token])

    useEffect(() => {
        load()
    }, [load])

    // Light polling so new enquiries show up without a manual refresh.
    useEffect(() => {
        const interval = setInterval(load, 30000)
        return () => clearInterval(interval)
    }, [load])

    const handleStatusChange = async (inquiryId, status) => {
        setUpdatingId(inquiryId)
        try {
            const res = await inquiryApi.updateStatus(inquiryId, status, token)
            setInquiries((prev) =>
                prev.map((i) => (i._id === inquiryId ? { ...i, status: res.data.inquiry.status } : i))
            )
        } catch (err) {
            alert(err.message || 'Failed to update status.')
        } finally {
            setUpdatingId(null)
        }
    }

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase()
        if (!q) return inquiries
        return inquiries.filter((inq) =>
            [inq.name, inq.phone, inq.email, inq.destination, inq.user?.email]
                .filter(Boolean)
                .some((field) => field.toLowerCase().includes(q))
        )
    }, [inquiries, query])

    return (
        <div>
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                <div>
                    <h2 className="font-display text-xl font-semibold">Enquiries</h2>
                    <p className="text-ink-soft text-sm">
                        {query ? `${filtered.length} of ${inquiries.length}` : `${inquiries.length} total`}
                    </p>
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="form-field-input w-auto"
                >
                    <option value="">All statuses</option>
                    {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                            {s}
                        </option>
                    ))}
                </select>
            </div>

            <div className="relative mb-5 max-w-sm">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by name, phone, email, destination…"
                    className="form-field-input pl-9 pr-9"
                />
                {query && (
                    <button
                        onClick={() => setQuery('')}
                        aria-label="Clear search"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft hover:text-[#040809]"
                    >
                        <X size={14} />
                    </button>
                )}
            </div>

            {error && (
                <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3.5 py-2.5 text-[13px] text-red-700">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="flex items-center gap-2 text-ink-soft text-sm py-10 justify-center">
                    <Loader2 size={16} className="animate-spin" /> Loading enquiries…
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-14 text-ink-soft text-sm border border-dashed border-line rounded-md">
                    {query ? `No enquiries match "${query}".` : 'No enquiries yet.'}
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map((inq) => {
                        const expanded = expandedId === inq._id
                        return (
                            <div key={inq._id} className="border border-line rounded-md overflow-hidden bg-white">
                                <button
                                    onClick={() => setExpandedId(expanded ? null : inq._id)}
                                    className="w-full flex items-center justify-between gap-4 px-4 py-3.5 text-left"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <span
                                            className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded-sm flex-none ${STATUS_STYLES[inq.status] || 'bg-neutral-100 text-neutral-700'}`}
                                        >
                                            {inq.status}
                                        </span>
                                        <div className="min-w-0">
                                            <p className="font-medium text-[#040809] truncate">{inq.name}</p>
                                            <p className="text-ink-soft text-xs truncate">
                                                {inq.destination} · {inq.travellers} traveller{inq.travellers === '1' || inq.travellers === 'Solo' ? '' : 's'}
                                                {' · '}
                                                {new Date(inq.createdAt).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    {expanded ? (
                                        <ChevronUp size={16} className="flex-none text-ink-soft" />
                                    ) : (
                                        <ChevronDown size={16} className="flex-none text-ink-soft" />
                                    )}
                                </button>

                                {expanded && (
                                    <div className="border-t border-line px-4 py-4 bg-ivory/50">
                                        <div className="grid sm:grid-cols-2 gap-3 text-sm mb-4">
                                            <DetailRow icon={Phone} label="Phone" value={inq.phone} />
                                            {inq.email && <DetailRow icon={Mail} label="Email" value={inq.email} />}
                                            <DetailRow label="Destination" value={inq.destination} />
                                            <DetailRow label="Travellers" value={inq.travellers} />
                                            {inq.travelDate && (
                                                <DetailRow
                                                    label="Travel date"
                                                    value={new Date(inq.travelDate).toLocaleDateString('en-IN')}
                                                />
                                            )}
                                            {inq.budget && <DetailRow label="Budget" value={inq.budget} />}
                                            {inq.user && <DetailRow label="Account" value={`Registered user (${inq.user.email})`} />}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <label className="text-[11px] font-semibold uppercase tracking-wide text-ink-soft">
                                                Status:
                                            </label>
                                            <select
                                                value={inq.status}
                                                onChange={(e) => handleStatusChange(inq._id, e.target.value)}
                                                disabled={updatingId === inq._id}
                                                className="form-field-input w-auto py-1.5"
                                            >
                                                {STATUS_OPTIONS.map((s) => (
                                                    <option key={s} value={s}>
                                                        {s}
                                                    </option>
                                                ))}
                                            </select>
                                            {updatingId === inq._id && <Loader2 size={14} className="animate-spin text-ink-soft" />}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

function DetailRow({ icon: Icon, label, value }) {
    return (
        <div className="flex items-center gap-2">
            {Icon && <Icon size={14} className="text-ink-soft flex-none" />}
            <span className="text-ink-soft">{label}:</span>
            <span className="font-medium text-[#040809]">{value}</span>
        </div>
    )
}