// src/components/admin/DestinationFormModal.jsx
// Add/edit form for a single destination, used by DestinationsManager.
// Images are uploaded straight to Cloudinary via the backend upload route.

import { useState, useRef } from 'react'
import { X, Loader2, Upload, Trash2, ImageOff } from 'lucide-react'
import { CATEGORY_LIST } from '../../data/destinations'
import { ApiError, uploadApi } from '../../lib/api'

function slugifyPreview(name) {
    return String(name)
        .toLowerCase()
        .replace(/&/g, 'and')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || 'general'
}

function toFormState(destination) {
    const images = destination?.images?.length
        ? destination.images
        : destination?.image
            ? [destination.image]
            : []
    return {
        name: destination?.name || '',
        category: destination?.category || CATEGORY_LIST[0]?.key || '',
        price: destination?.price || '',
        duration: destination?.duration || '',
        rating: destination?.rating != null ? String(destination.rating) : '4.5',
        description: destination?.description || '',
        highlights: destination?.highlights?.join(', ') || '',
        images
    }
}

export default function DestinationFormModal({ destination, token, onClose, onSave }) {
    const isEdit = !!destination
    const [form, setForm] = useState(() => toFormState(destination))
    const [errors, setErrors] = useState({})
    const [formError, setFormError] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState('')
    const fileInputRef = useRef(null)

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

    const handleFilesSelected = async (e) => {
        const files = Array.from(e.target.files || [])
        e.target.value = '' // allow re-selecting the same file later
        if (files.length === 0) return

        setFormError('')
        setUploading(true)
        const slug = destination?.slug || slugifyPreview(form.name)

        for (let i = 0; i < files.length; i++) {
            setUploadProgress(`Uploading image ${i + 1} of ${files.length}…`)
            try {
                const res = await uploadApi.image(files[i], { slug, token })
                setForm((f) => ({ ...f, images: [...f.images, res.data.url] }))
            } catch (err) {
                setFormError(err.message || `Failed to upload "${files[i].name}".`)
            }
        }

        setUploadProgress('')
        setUploading(false)
    }

    const removeImage = (index) => {
        setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== index) }))
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
            images: form.images,
            image: form.images[0] || undefined
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

    const busy = submitting || uploading

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white rounded-md shadow-deep w-full max-w-lg max-h-[90vh] overflow-y-auto p-7 sm:p-8" data-lenis-prevent>
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
                            disabled={busy}
                        />
                    </FormField>

                    <FormField label="Category" error={errors.category}>
                        <select
                            value={form.category}
                            onChange={handleChange('category')}
                            className="form-field-input"
                            disabled={busy}
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
                                disabled={busy}
                            />
                        </FormField>
                        <FormField label="Duration" error={errors.duration}>
                            <input
                                type="text"
                                value={form.duration}
                                onChange={handleChange('duration')}
                                className="form-field-input"
                                placeholder="4 Days"
                                disabled={busy}
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
                            disabled={busy}
                        />
                    </FormField>

                    <FormField label="Description" error={errors.description}>
                        <textarea
                            value={form.description}
                            onChange={handleChange('description')}
                            className="form-field-input min-h-[90px] resize-y"
                            placeholder="A short, appealing description of the trip…"
                            disabled={busy}
                        />
                    </FormField>

                    <FormField label="Highlights (comma-separated)" error={errors.highlights}>
                        <input
                            type="text"
                            value={form.highlights}
                            onChange={handleChange('highlights')}
                            className="form-field-input"
                            placeholder="Jyotirlinga darshan, Helicopter transfer, Guided trek support"
                            disabled={busy}
                        />
                    </FormField>

                    <FormField label="Images" error={errors.images}>
                        {form.images.length > 0 ? (
                            <div className="grid grid-cols-4 gap-2 mb-3">
                                {form.images.map((url, i) => (
                                    <div key={url + i} className="relative aspect-square rounded-md overflow-hidden border border-line group">
                                        <img src={url} alt="" className="w-full h-full object-cover" />
                                        {i === 0 && (
                                            <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] text-center py-0.5">
                                                Cover
                                            </span>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => removeImage(i)}
                                            disabled={busy}
                                            aria-label="Remove image"
                                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-100"
                                        >
                                            <Trash2 size={11} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-ink-soft text-xs mb-3 border border-dashed border-line rounded-md px-3 py-3">
                                <ImageOff size={14} /> No images yet — the site will use a placeholder until you add some.
                            </div>
                        )}

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFilesSelected}
                            className="hidden"
                            disabled={busy}
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={busy}
                            className="btn btn-ghost w-full flex items-center justify-center gap-2 py-2.5 text-sm"
                        >
                            {uploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
                            {uploading ? uploadProgress || 'Uploading…' : 'Upload Images'}
                        </button>
                    </FormField>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-ghost flex-1"
                            disabled={busy}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary flex-1 flex items-center justify-center gap-2"
                            disabled={busy}
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