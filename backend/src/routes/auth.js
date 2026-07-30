// src/routes/auth.js
// Authentication routes

const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const { protect } = require('../middleware/authMiddleware')
const { asyncHandler } = require('../middleware/errorHandler')

/**
 * Public Routes
 */

// Email/Password authentication
router.post('/signup', asyncHandler(authController.emailSignup))
router.post('/login', asyncHandler(authController.emailLogin))

// Google OAuth
router.post('/google', asyncHandler(authController.googleAuth))

/**
 * Protected Routes (Requires authentication)
 */

// Get current user profile
router.get('/me', protect, asyncHandler(authController.getCurrentUser))

// Logout
router.post('/logout', protect, asyncHandler(authController.logout))

module.exports = router