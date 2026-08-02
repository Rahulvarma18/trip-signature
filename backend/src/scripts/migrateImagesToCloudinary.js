// src/scripts/migrateImagesToCloudinary.js
// One-time migration: uploads every local destination image
// (frontend/public/images/destinations/<slug>/*.png) to Cloudinary and
// writes the resulting URLs into that destination's `images` array
// (and `image` cover field) in MongoDB.
//
// Run with: npm run migrate-images   (from backend/)
// Safe to re-run — skips destinations that already have Cloudinary
// images, unless you pass --force to re-upload everything.

require('dotenv').config()
const fs = require('fs')
const path = require('path')
const { connectDB, disconnectDB } = require('../config/db')
const Destination = require('../models/Destination')
const { cloudinary, isConfigured } = require('../config/cloudinary')

const IMAGES_ROOT = path.resolve(__dirname, '../../../frontend/public/images/destinations')
const FORCE = process.argv.includes('--force')

function uploadFileToCloudinary(filePath, folder) {
    return cloudinary.uploader.upload(filePath, {
        folder,
        resource_type: 'image',
        transformation: [{ width: 1600, height: 1600, crop: 'limit', quality: 'auto', fetch_format: 'auto' }]
    })
}

async function migrate() {
    if (!isConfigured()) {
        console.error(
            '❌ Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in backend/.env first.'
        )
        process.exit(1)
    }

    if (!fs.existsSync(IMAGES_ROOT)) {
        console.error(`❌ Local images folder not found at: ${IMAGES_ROOT}`)
        process.exit(1)
    }

    await connectDB()

    const destinations = await Destination.find({})
    console.log(`📦 Found ${destinations.length} destinations in MongoDB.`)

    let migrated = 0
    let skipped = 0
    let noLocalImages = 0

    for (const dest of destinations) {
        if (!FORCE && dest.images && dest.images.length > 0) {
            skipped++
            continue
        }

        const folder = path.join(IMAGES_ROOT, dest.slug)
        if (!fs.existsSync(folder)) {
            console.warn(`⚠️  No local image folder for "${dest.slug}" — skipping.`)
            noLocalImages++
            continue
        }

        const files = fs
            .readdirSync(folder)
            .filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
            .sort()

        if (files.length === 0) {
            console.warn(`⚠️  Folder for "${dest.slug}" has no image files — skipping.`)
            noLocalImages++
            continue
        }

        console.log(`⬆️  Uploading ${files.length} image(s) for "${dest.slug}"...`)
        const urls = []
        for (const file of files) {
            const result = await uploadFileToCloudinary(
                path.join(folder, file),
                `trip-signature/destinations/${dest.slug}`
            )
            urls.push(result.secure_url)
        }

        dest.images = urls
        dest.image = urls[0]
        await dest.save()
        migrated++
        console.log(`   ✅ ${dest.slug}: ${urls.length} image(s) migrated.`)
    }

    console.log('\n──────────────────────────────')
    console.log(`✅ Migrated: ${migrated}`)
    console.log(`⏭️  Skipped (already had Cloudinary images): ${skipped}`)
    console.log(`⚠️  No local images found: ${noLocalImages}`)
    console.log('──────────────────────────────')

    await disconnectDB()
    process.exit(0)
}

migrate().catch((err) => {
    console.error('❌ Migration failed:', err)
    process.exit(1)
})