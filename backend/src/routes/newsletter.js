// src/routes/newsletter.js

const express = require('express')
const router = express.Router()
const newsletterController = require('../controllers/newsletterController')
const { protect, isAdmin } = require('../middleware/authMiddleware')
const { asyncHandler } = require('../middleware/errorHandler')

router.post('/subscribe', asyncHandler(newsletterController.subscribe))
router.get('/admin/subscribers', protect, isAdmin, asyncHandler(newsletterController.getAllSubscribers))

module.exports = router