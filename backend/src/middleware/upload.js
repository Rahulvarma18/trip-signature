// src/middleware/upload.js
// Multer config for image uploads — keeps files in memory (never touches
// disk) so the buffer can be streamed straight to Cloudinary.

const multer = require('multer')

const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true)
    } else {
        cb(new Error('Only image files are allowed'), false)
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 8 * 1024 * 1024 // 8MB per image
    }
})

module.exports = upload