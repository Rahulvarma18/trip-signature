// src/controllers/uploadController.js
// Handles admin image uploads: streams the file straight to Cloudinary
// and returns the resulting secure URL.

const { cloudinary, isConfigured } = require('../config/cloudinary')

function uploadBufferToCloudinary(buffer, folder) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: 'image',
                // Cap dimensions and auto-optimize so a 12MB phone photo
                // doesn't ship to the browser at full size.
                transformation: [{ width: 1600, height: 1600, crop: 'limit', quality: 'auto', fetch_format: 'auto' }]
            },
            (error, result) => {
                if (error) reject(error)
                else resolve(result)
            }
        )
        stream.end(buffer)
    })
}

// POST /api/uploads/image (Admin only)
// multipart/form-data with a single `image` file field.
// Optional `slug` field groups the image under that destination's folder.
exports.uploadImage = async (req, res) => {
    if (!isConfigured()) {
        return res.status(500).json({
            success: false,
            message:
                'Image uploads are not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in the backend .env.'
        })
    }

    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: 'No image file was provided'
        })
    }

    const slug = (req.body.slug || 'general').replace(/[^a-z0-9-]/gi, '') || 'general'
    const folder = `trip-signature/destinations/${slug}`

    const result = await uploadBufferToCloudinary(req.file.buffer, folder)

    res.status(201).json({
        success: true,
        message: 'Image uploaded successfully',
        data: {
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height
        }
    })
}