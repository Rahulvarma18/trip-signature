// src/scripts/seedDestinations.js
// One-off script: reads frontend/src/data/destinations.js (the single
// source of truth used by the site) and upserts every item into MongoDB.
//
// Run with: npm run seed   (from the backend/ folder)
// Safe to re-run — it upserts by slug, so it won't create duplicates.

require('dotenv').config()
const path = require('path')
const { pathToFileURL } = require('url')
const { connectDB, disconnectDB } = require('../config/db')
const Destination = require('../models/Destination')

function parsePriceValue(price) {
    const digits = String(price).replace(/[^\d]/g, '')
    return digits ? Number(digits) : null
}

async function loadFrontendData() {
    // frontend/src/data/destinations.js is an ES module, and this script
    // runs under CommonJS — dynamic import() bridges the two.
    const dataPath = path.resolve(__dirname, '../../../frontend/src/data/destinations.js')
    const fileUrl = pathToFileURL(dataPath).href
    const mod = await import(fileUrl)
    return mod.CATEGORIES
}

async function seed() {
    console.log('📦 Loading destinations from frontend/src/data/destinations.js ...')
    const CATEGORIES = await loadFrontendData()

    await connectDB()

    let count = 0
    for (const category of Object.values(CATEGORIES)) {
        for (const item of category.items) {
            await Destination.findOneAndUpdate(
                { slug: item.slug },
                {
                    name: item.name,
                    slug: item.slug,
                    category: category.key,
                    categoryLabel: category.label,
                    price: item.price,
                    priceValue: parsePriceValue(item.price),
                    duration: item.duration,
                    rating: item.rating,
                    description: item.description,
                    highlights: item.highlights || [],
                    image: item.image,
                    isActive: true
                },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            )
            count++
        }
    }

    console.log(`✅ Seeded ${count} destinations across ${Object.keys(CATEGORIES).length} categories.`)
    await disconnectDB()
    process.exit(0)
}

seed().catch((err) => {
    console.error('❌ Seed failed:', err)
    process.exit(1)
})