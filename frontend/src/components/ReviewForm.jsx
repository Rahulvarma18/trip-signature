// src/components/ReviewForm.jsx
// Inline form for writing or editing a review, plus the star-rating input.

import { useState } from 'react'
import { Star, Loader2 } from 'lucide-react'
import { ApiError } from '../lib/api'

export function StarRatingInput({ value, onChange, disabled }) {
    const [hover, setHover] = useState(0)
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
                <button
                    key={n}
                    type="button"
                    disabled={disabled}
                    onMouseEnter={() => setHover(n)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => onChange(n)}
                    aria-label={`${n} star${n === 1 ? '' : 's'}`}
                    className="disabled:cursor-not-allowed"
                >
                    <Star
                        size={22}
                        className={
                            (hover || value) >= n
                                ? 'fill-[#4E3924] stroke-[#4E3924]'
                                : 'fill-transparent stroke-ink-soft'
                        }
                    />
                </button>
            ))}
        </div>
    )
}

export default function ReviewForm({ initialRating = 0, initialComment = '', onSubmit, onCancel, submitLabel }) {
    const [rating, setRating] = useState(initialRating)
    const [comment, setComment] = useState(initialComment)
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (rating < 1) {
            setError('Please select a star rating.')
            return
        }
        if (comment.trim().length < 10) {
            setError('Your review should be at least 10 characters.')
            return
        }

        setSubmitting(true)
        try {
            await onSubmit({ rating, comment: comment.trim() })
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="bg-paper border border-line rounded-card p-5">
            <label className="block text-[11px] font-semibold tracking-wide uppercase text-[#040809] mb-2">
                Your rating
            </label>
            <StarRatingInput value={rating} onChange={setRating} disabled={submitting} />

            <label className="block text-[11px] font-semibold tracking-wide uppercase text-[#040809] mt-4 mb-2">
                Your review
            </label>
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={submitting}
                placeholder="Tell other travellers about your trip — what stood out, what to expect…"
                className="form-field-input min-h-[100px] resize-y"
            />

            {error && <p className="text-red-600 text-xs mt-2">{error}</p>}

            <div className="flex gap-3 mt-4">
                {onCancel && (
                    <button type="button" onClick={onCancel} disabled={submitting} className="btn btn-ghost">
                        Cancel
                    </button>
                )}
                <button type="submit" disabled={submitting} className="btn btn-primary flex items-center gap-2">
                    {submitting && <Loader2 size={15} className="animate-spin" />}
                    {submitting ? 'Submitting…' : submitLabel || 'Submit Review'}
                </button>
            </div>
        </form>
    )
}