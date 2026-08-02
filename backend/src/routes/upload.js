// src/routes/upload.js
// Admin-only image upload — streams to Cloudinary.

const express = require('express')
const router = express.Router()
const uploadController = require('../controllers/uploadController')
const upload = require('../middleware/upload')
const { protect, isAdmin } = require('../middleware/authMiddleware')
const { asyncHandler } = require('../middleware/errorHandler')

router.post('/image', protect, isAdmin, upload.single('image'), asyncHandler(uploadController.uploadImage))

module.exports = router