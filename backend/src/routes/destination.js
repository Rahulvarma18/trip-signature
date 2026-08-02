// src/routes/destination.js
// Public read routes for destinations/packages data, admin CRUD, and
// user-submitted reviews.

const express = require('express')
const router = express.Router()
const destinationController = require('../controllers/destinationController')
const reviewController = require('../controllers/reviewController')
const { protect, optionalAuth, isAdmin } = require('../middleware/authMiddleware')
const { asyncHandler } = require('../middleware/errorHandler')

/**
 * Public routes
 */
router.get('/categories', asyncHandler(destinationController.getCategories))
// optionalAuth: lets an admin token unlock ?all=true to see inactive items too.
router.get('/', optionalAuth, asyncHandler(destinationController.getAllDestinations))

/**
 * Reviews (nested under a destination's slug)
 */
router.get('/:slug/reviews', asyncHandler(reviewController.getReviews))
router.post('/:slug/reviews', protect, asyncHandler(reviewController.createReview))
router.put('/:slug/reviews/:reviewId', protect, asyncHandler(reviewController.updateReview))
router.delete('/:slug/reviews/:reviewId', protect, asyncHandler(reviewController.deleteReview))

/**
 * Single destination (kept below /:slug/reviews so that path isn't
 * accidentally swallowed by this single-segment route)
 */
router.get('/:slug', asyncHandler(destinationController.getDestinationBySlug))

/**
 * Admin-only routes
 */
router.post('/', protect, isAdmin, asyncHandler(destinationController.createDestination))
router.put('/:slug', protect, isAdmin, asyncHandler(destinationController.updateDestination))
router.delete('/:slug', protect, isAdmin, asyncHandler(destinationController.deleteDestination))

module.exports = router