// src/config/cloudinary.js
// Cloudinary SDK setup for destination image uploads.

const cloudinary = require('cloudinary').v2
const env = require('./env')

function isConfigured() {
    return !!(env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET)
}

if (isConfigured()) {
    cloudinary.config({
        cloud_name: env.CLOUDINARY_CLOUD_NAME,
        api_key: env.CLOUDINARY_API_KEY,
        api_secret: env.CLOUDINARY_API_SECRET,
        secure: true
    })
}

module.exports = { cloudinary, isConfigured }       