// src/controllers/reviewController.js
// Real user reviews for a destination — list, create, update, delete.

const Review = require('../models/Review')
const Destination = require('../models/Destination')
const Inquiry = require('../models/Inquiry')
const validators = require('../utils/validators')

async function findDestinationOr404(slug, res) {
    const destination = await Destination.findOne({ slug })
    if (!destination) {
        res.status(404).json({ success: false, message: 'Destination not found' })
        return null
    }
    return destination
}

async function computeStats(destinationSlug) {
    const [stats] = await Review.aggregate([
        { $match: { destinationSlug } },
        { $group: { _id: null, average: { $avg: '$rating' }, count: { $sum: 1 } } }
    ])
    return {
        average: stats ? Math.round(stats.average * 10) / 10 : null,
        count: stats ? stats.count : 0
    }
}

// GET /api/destinations/:slug/reviews (public)
exports.getReviews = async (req, res) => {
    const destination = await findDestinationOr404(req.params.slug, res)
    if (!destination) return

    const reviews = await Review.find({ destinationSlug: destination.slug }).sort({ createdAt: -1 })
    const stats = await computeStats(destination.slug)

    res.status(200).json({
        success: true,
        data: { reviews, stats }
    })
}

// POST /api/destinations/:slug/reviews (Authenticated)
exports.createReview = async (req, res) => {
    const destination = await findDestinationOr404(req.params.slug, res)
    if (!destination) return

    const validation = validators.validate(req.body, validators.schemas.createReview)
    if (!validation.valid) {
        return res.status(400).json({ success: false, message: 'Validation error', errors: validation.errors })
    }

    const existing = await Review.findOne({ destinationSlug: destination.slug, user: req.user._id })
    if (existing) {
        return res.status(400).json({
            success: false,
            message: 'You\u2019ve already reviewed this destination \u2014 edit your existing review instead.'
        })
    }

    // Best-effort proxy for "actually booked a trip here": a converted
    // enquiry from this user naming this destination.
    const convertedInquiry = await Inquiry.findOne({
        user: req.user._id,
        status: 'converted',
        destination: { $regex: `^${destination.name}$`, $options: 'i' }
    })

    const review = await Review.create({
        destination: destination._id,
        destinationSlug: destination.slug,
        user: req.user._id,
        name: req.user.name,
        rating: validation.data.rating,
        comment: validation.data.comment,
        verifiedTraveller: !!convertedInquiry
    })

    const stats = await computeStats(destination.slug)

    res.status(201).json({
        success: true,
        message: 'Review submitted \u2014 thank you!',
        data: { review, stats }
    })
}

// PUT /api/destinations/:slug/reviews/:reviewId (owner only)
exports.updateReview = async (req, res) => {
    const validation = validators.validate(req.body, validators.schemas.createReview)
    if (!validation.valid) {
        return res.status(400).json({ success: false, message: 'Validation error', errors: validation.errors })
    }

    const review = await Review.findById(req.params.reviewId)
    if (!review || review.destinationSlug !== req.params.slug) {
        return res.status(404).json({ success: false, message: 'Review not found' })
    }
    if (String(review.user) !== String(req.user._id)) {
        return res.status(403).json({ success: false, message: 'You can only edit your own review' })
    }

    review.rating = validation.data.rating
    review.comment = validation.data.comment
    await review.save()

    const stats = await computeStats(review.destinationSlug)

    res.status(200).json({
        success: true,
        message: 'Review updated',
        data: { review, stats }
    })
}

// DELETE /api/destinations/:slug/reviews/:reviewId (owner or admin)
exports.deleteReview = async (req, res) => {
    const review = await Review.findById(req.params.reviewId)
    if (!review || review.destinationSlug !== req.params.slug) {
        return res.status(404).json({ success: false, message: 'Review not found' })
    }
    if (String(review.user) !== String(req.user._id) && !req.user.isAdmin) {
        return res.status(403).json({ success: false, message: 'You can only delete your own review' })
    }

    await review.deleteOne()
    const stats = await computeStats(review.destinationSlug)

    res.status(200).json({
        success: true,
        message: 'Review deleted',
        data: { stats }
    })
}