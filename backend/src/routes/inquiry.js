// src/routes/inquiry.js
// Inquiry form routes

const express = require('express')
const router = express.Router()
const inquiryController = require('../controllers/inquiryController')
const { protect, optionalAuth } = require('../middleware/authMiddleware')
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

// Get single inquiry details
router.get('/:inquiryId', protect, asyncHandler(inquiryController.getInquiryDetails))

/**
 * Admin Routes (requires authentication + admin role)
 * You can add isAdmin middleware here once you implement admin roles
 */

// Get all inquiries (admin only)
// TODO: Add isAdmin middleware
router.get('/admin/all', protect, asyncHandler(inquiryController.getAllInquiries))

// Get inquiry statistics (admin only)
// TODO: Add isAdmin middleware
router.get('/admin/stats', protect, asyncHandler(inquiryController.getInquiryStats))

// Update inquiry status (admin/curator only)
// TODO: Add isAdmin middleware
router.patch('/:inquiryId/status', protect, asyncHandler(inquiryController.updateInquiryStatus))

// Add note to inquiry (admin/curator only)
// TODO: Add isAdmin middleware
router.post('/:inquiryId/note', protect, asyncHandler(inquiryController.addNote))

module.exports = router