// src/models/Destination.js
// Travel packages/destinations shown across category and detail pages.
// Seeded from frontend/src/data/destinations.js — see scripts/seedDestinations.js

const mongoose = require('mongoose')

const destinationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true
        },
        slug: {
            type: String,
            required: [true, 'Slug is required'],
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            trim: true,
            index: true
        },
        categoryLabel: {
            type: String,
            trim: true
        },
        price: {
            type: String,
            required: [true, 'Price is required'],
            trim: true
        },
        priceValue: {
            // Numeric rupee amount parsed from `price`, for sorting/filtering.
            type: Number,
            default: null
        },
        duration: {
            type: String,
            required: [true, 'Duration is required'],
            trim: true
        },
        rating: {
            type: Number,
            min: 0,
            max: 5,
            default: 4.5
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            trim: true
        },
        highlights: {
            type: [String],
            default: []
        },
        image: {
            // Cover image — shown on cards. Cloudinary URL once migrated;
            // may be empty for older items that still use the local
            // /images/destinations/<slug>/1.png convention as a fallback.
            type: String,
            trim: true
        },
        images: {
            // Full gallery — Cloudinary URLs, admin-managed. If empty, the
            // frontend falls back to the local file-convention gallery.
            type: [String],
            default: []
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
)

destinationSchema.index({ category: 1, name: 1 })

module.exports = mongoose.model('Destination', destinationSchema)