// src/components/admin/DestinationsManager.jsx
// Admin table for viewing, adding, editing, and removing destinations.

import { useEffect, useState, useCallback } from 'react'
import { Plus, Pencil, Trash2, Star, Loader2 } from 'lucide-react'
import { destinationsApi } from '../../lib/api'
import { invalidateDestinationsCache } from '../../lib/useDestinations'
import DestinationFormModal from './DestinationFormModal'

export default function DestinationsManager({ token }) {
    const [destinations, setDestinations] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [editing, setEditing] = useState(null) // null = closed, {} = new, {...} = edit
    const [deletingSlug, setDeletingSlug] = useState(null)

    const load = useCallback(async () => {
        setLoading(true)
        setError('')
        try {
            const res = await destinationsApi.list({ all: true, token })
            setDestinations(res.data.destinations)
        } catch (err) {
            setError(err.message || 'Failed to load destinations.')
        } finally {
            setLoading(false)
        }
    }, [token])

    useEffect(() => {
        load()
    }, [load])

    const handleSave = async (payload) => {
        if (editing?.slug) {
            const res = await destinationsApi.update(editing.slug, payload, token)
            setDestinations((prev) =>
                prev.map((d) => (d.slug === editing.slug ? res.data.destination : d))
            )
        } else {
            const res = await destinationsApi.create(payload, token)
            setDestinations((prev) => [...prev, res.data.destination])
        }
        invalidateDestinationsCache()
        setEditing(null)
    }

    const handleDelete = async (slug) => {
        if (!window.confirm('Delete this destination? This cannot be undone.')) return
        setDeletingSlug(slug)
        try {
            await destinationsApi.remove(slug, token)
            setDestinations((prev) => prev.filter((d) => d.slug !== slug))
            invalidateDestinationsCache()
        } catch (err) {
            alert(err.message || 'Failed to delete destination.')
        } finally {
            setDeletingSlug(null)
        }
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h2 className="font-display text-xl font-semibold">Destinations</h2>
                    <p className="text-ink-soft text-sm">{destinations.length} total</p>
                </div>
                <button onClick={() => setEditing({})} className="btn btn-primary flex items-center gap-2">
                    <Plus size={15} /> Add Destination
                </button>
            </div>

            {error && (
                <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3.5 py-2.5 text-[13px] text-red-700">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="flex items-center gap-2 text-ink-soft text-sm py-10 justify-center">
                    <Loader2 size={16} className="animate-spin" /> Loading destinations…
                </div>
            ) : destinations.length === 0 ? (
                <div className="text-center py-14 text-ink-soft text-sm border border-dashed border-line rounded-md">
                    No destinations yet. Add your first one.
                </div>
            ) : (
                <div className="overflow-x-auto border border-line rounded-md">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-ivory text-left text-[11px] uppercase tracking-wide text-ink-soft">
                                <th className="px-4 py-3 font-semibold">Name</th>
                                <th className="px-4 py-3 font-semibold">Category</th>
                                <th className="px-4 py-3 font-semibold">Price</th>
                                <th className="px-4 py-3 font-semibold">Duration</th>
                                <th className="px-4 py-3 font-semibold">Rating</th>
                                <th className="px-4 py-3 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {destinations.map((d) => (
                                <tr key={d.slug} className="border-t border-line hover:bg-ivory/60 transition-colors">
                                    <td className="px-4 py-3 font-medium text-[#040809]">{d.name}</td>
                                    <td className="px-4 py-3 text-ink-soft">{d.categoryLabel || d.category}</td>
                                    <td className="px-4 py-3 text-ink-soft">{d.price}</td>
                                    <td className="px-4 py-3 text-ink-soft">{d.duration}</td>
                                    <td className="px-4 py-3 text-ink-soft flex items-center gap-1">
                                        <Star size={13} className="fill-[#D4AF37] stroke-[#D4AF37]" /> {d.rating}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-3">
                                            <button
                                                onClick={() => setEditing(d)}
                                                aria-label={`Edit ${d.name}`}
                                                className="text-ink-soft hover:text-[#040809] transition-colors"
                                            >
                                                <Pencil size={15} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(d.slug)}
                                                aria-label={`Delete ${d.name}`}
                                                disabled={deletingSlug === d.slug}
                                                className="text-ink-soft hover:text-red-600 transition-colors disabled:opacity-50"
                                            >
                                                {deletingSlug === d.slug ? (
                                                    <Loader2 size={15} className="animate-spin" />
                                                ) : (
                                                    <Trash2 size={15} />
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {editing !== null && (
                <DestinationFormModal
                    destination={editing.slug ? editing : null}
                    onClose={() => setEditing(null)}
                    onSave={handleSave}
                />
            )}
        </div>
    )
}