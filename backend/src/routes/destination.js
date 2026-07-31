// src/routes/destination.js
// Public read routes for destinations/packages data, plus admin CRUD.

const express = require('express')
const router = express.Router()
const destinationController = require('../controllers/destinationController')
const { protect, optionalAuth, isAdmin } = require('../middleware/authMiddleware')
const { asyncHandler } = require('../middleware/errorHandler')

/**
 * Public routes
 */
router.get('/categories', asyncHandler(destinationController.getCategories))
router.get('/:slug', asyncHandler(destinationController.getDestinationBySlug))
// optionalAuth: lets an admin token unlock ?all=true to see inactive items too.
router.get('/', optionalAuth, asyncHandler(destinationController.getAllDestinations))

/**
 * Admin-only routes
 */
router.post('/', protect, isAdmin, asyncHandler(destinationController.createDestination))
router.put('/:slug', protect, isAdmin, asyncHandler(destinationController.updateDestination))
router.delete('/:slug', protect, isAdmin, asyncHandler(destinationController.deleteDestination))

module.exports = router