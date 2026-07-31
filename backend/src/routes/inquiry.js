// src/routes/inquiry.js
// Inquiry form routes

const express = require('express')
const router = express.Router()
const inquiryController = require('../controllers/inquiryController')
const { protect, optionalAuth, isAdmin } = require('../middleware/authMiddleware')
const { asyncHandler } = require('../middleware/errorHandler')

/**
 * Public Routes (no authentication required)
 */

// Submit inquiry (works for guests and authenticated users)
router.post('/create', optionalAuth, asyncHandler(inquiryController.createInquiry))

/**
 * Protected Routes (requires authentication)
 */

// Get user's own inquiries
router.get('/my-inquiries', protect, asyncHandler(inquiryController.getMyInquiries))

/**
 * Admin Routes (requires authentication + admin role)
 * Declared before /:inquiryId so 'admin' isn't parsed as an inquiry id.
 */

// Get all inquiries (admin only)
router.get('/admin/all', protect, isAdmin, asyncHandler(inquiryController.getAllInquiries))

// Get inquiry statistics (admin only)
router.get('/admin/stats', protect, isAdmin, asyncHandler(inquiryController.getInquiryStats))

// Update inquiry status (admin only)
router.patch('/:inquiryId/status', protect, isAdmin, asyncHandler(inquiryController.updateInquiryStatus))

// Add note to inquiry (admin only)
router.post('/:inquiryId/note', protect, isAdmin, asyncHandler(inquiryController.addNote))

// Get single inquiry details (owner only — checked in controller)
router.get('/:inquiryId', protect, asyncHandler(inquiryController.getInquiryDetails))

module.exports = router