// src/components/admin/DestinationFormModal.jsx
// Add/edit form for a single destination, used by DestinationsManager.

import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { CATEGORY_LIST } from '../../data/destinations'
import { ApiError } from '../../lib/api'

function toFormState(destination) {
    return {
        name: destination?.name || '',
        category: destination?.category || CATEGORY_LIST[0]?.key || '',
        price: destination?.price || '',
        duration: destination?.duration || '',
        rating: destination?.rating != null ? String(destination.rating) : '4.5',
        description: destination?.description || '',
        highlights: destination?.highlights?.join(', ') || '',
        image: destination?.image || ''
    }
}

export default function DestinationFormModal({ destination, onClose, onSave }) {
    const isEdit = !!destination
    const [form, setForm] = useState(() => toFormState(destination))
    const [errors, setErrors] = useState({})
    const [formError, setFormError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const handleChange = (field) => (e) => {
        setForm((f) => ({ ...f, [field]: e.target.value }))
        setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev))
    }

    const validate = () => {
        const next = {}
        if (!form.name.trim()) next.name = 'Name is required.'
        if (!form.category.trim()) next.category = 'Category is required.'
        if (!form.price.trim()) next.price = 'Price is required.'
        if (!form.duration.trim()) next.duration = 'Duration is required.'
        if (!form.description.trim() || form.description.trim().length < 10) {
            next.description = 'Description should be at least 10 characters.'
        }
        const ratingNum = Number(form.rating)
        if (Number.isNaN(ratingNum) || ratingNum < 0 || ratingNum > 5) {
            next.rating = 'Rating must be between 0 and 5.'
        }
        setErrors(next)
        return Object.keys(next).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setFormError('')
        if (!validate()) return

        const categoryMeta = CATEGORY_LIST.find((c) => c.key === form.category)

        const payload = {
            name: form.name.trim(),
            category: form.category.trim(),
            categoryLabel: categoryMeta?.label || form.category.trim(),
            price: form.price.trim(),
            duration: form.duration.trim(),
            rating: Number(form.rating),
            description: form.description.trim(),
            highlights: form.highlights
                .split(',')
                .map((h) => h.trim())
                .filter(Boolean),
            image: form.image.trim() || undefined
        }

        setSubmitting(true)
        try {
            await onSave(payload)
        } catch (err) {
            if (err instanceof ApiError && err.fieldErrors?.length) {
                const fieldMap = {}
                err.fieldErrors.forEach((fe) => {
                    if (fe?.field) fieldMap[fe.field] = fe.message
                })
                setErrors((prev) => ({ ...prev, ...fieldMap }))
            }
            setFormError(err.message || 'Something went wrong. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white rounded-md shadow-deep w-full max-w-lg max-h-[90vh] overflow-y-auto p-7 sm:p-8">
                <button
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute top-5 right-5 text-ink-soft hover:text-[#040809] transition-colors"
                >
                    <X size={20} />
                </button>

                <h3 className="font-display text-2xl font-semibold mb-5">
                    {isEdit ? `Edit "${destination.name}"` : 'Add a new destination'}
                </h3>

                {formError && (
                    <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3.5 py-2.5 text-[13px] text-red-700">
                        {formError}
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                    <FormField label="Name" error={errors.name}>
                        <input
                            type="text"
                            value={form.name}
                            onChange={handleChange('name')}
                            className="form-field-input"
                            placeholder="e.g. Kedarnath"
                            disabled={submitting}
                        />
                    </FormField>

                    <FormField label="Category" error={errors.category}>
                        <select
                            value={form.category}
                            onChange={handleChange('category')}
                            className="form-field-input"
                            disabled={submitting}
                        >
                            {CATEGORY_LIST.map((cat) => (
                                <option key={cat.key} value={cat.key}>
                                    {cat.label}
                                </option>
                            ))}
                        </select>
                    </FormField>

                    <div className="grid grid-cols-2 gap-3">
                        <FormField label="Price" error={errors.price}>
                            <input
                                type="text"
                                value={form.price}
                                onChange={handleChange('price')}
                                className="form-field-input"
                                placeholder="₹15,999"
                                disabled={submitting}
                            />
                        </FormField>
                        <FormField label="Duration" error={errors.duration}>
                            <input
                                type="text"
                                value={form.duration}
                                onChange={handleChange('duration')}
                                className="form-field-input"
                                placeholder="4 Days"
                                disabled={submitting}
                            />
                        </FormField>
                    </div>

                    <FormField label="Rating (0–5)" error={errors.rating}>
                        <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="5"
                            value={form.rating}
                            onChange={handleChange('rating')}
                            className="form-field-input"
                            disabled={submitting}
                        />
                    </FormField>

                    <FormField label="Description" error={errors.description}>
                        <textarea
                            value={form.description}
                            onChange={handleChange('description')}
                            className="form-field-input min-h-[90px] resize-y"
                            placeholder="A short, appealing description of the trip…"
                            disabled={submitting}
                        />
                    </FormField>

                    <FormField label="Highlights (comma-separated)" error={errors.highlights}>
                        <input
                            type="text"
                            value={form.highlights}
                            onChange={handleChange('highlights')}
                            className="form-field-input"
                            placeholder="Jyotirlinga darshan, Helicopter transfer, Guided trek support"
                            disabled={submitting}
                        />
                    </FormField>

                    <FormField label="Image path (optional)" error={errors.image}>
                        <input
                            type="text"
                            value={form.image}
                            onChange={handleChange('image')}
                            className="form-field-input"
                            placeholder="/images/destinations/kedarnath/1.png"
                            disabled={submitting}
                        />
                    </FormField>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-ghost flex-1"
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary flex-1 flex items-center justify-center gap-2"
                            disabled={submitting}
                        >
                            {submitting && <Loader2 size={16} className="animate-spin" />}
                            {submitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Destination'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

function FormField({ label, error, children }) {
    return (
        <div>
            <label className="block text-[11px] font-semibold tracking-wide uppercase text-[#040809] mb-1.5">
                {label}
            </label>
            {children}
            {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
        </div>
    )
}