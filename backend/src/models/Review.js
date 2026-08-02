// src/models/Review.js
// User-submitted reviews for a destination, shown on its detail page.
// One review per user per destination (they can edit it later, not
// stack duplicates).

const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema(
    {
        destination: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Destination',
            required: true,
            index: true
        },
        destinationSlug: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            index: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        name: {
            // Snapshot of the reviewer's display name at time of posting,
            // so it doesn't silently change if they later edit their account.
            type: String,
            required: true,
            trim: true
        },
        rating: {
            type: Number,
            required: [true, 'Rating is required'],
            min: 1,
            max: 5
        },
        comment: {
            type: String,
            required: [true, 'Review text is required'],
            trim: true,
            minlength: [10, 'Review should be at least 10 characters'],
            maxlength: [1000, 'Review is too long']
        },
        verifiedTraveller: {
            // True if the user had a "converted" enquiry for this destination
            // at the time they posted — the closest proxy we have to "actually
            // booked a trip" without a full booking/payment system.
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
)

reviewSchema.index({ destinationSlug: 1, user: 1 }, { unique: true })

module.exports = mongoose.model('Review', reviewSchema)