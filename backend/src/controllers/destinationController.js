// src/controllers/destinationController.js
// Read-only endpoints serving the seeded destinations/packages data,
// plus admin-only create/update/delete.

const Destination = require('../models/Destination')
const validators = require('../utils/validators')

function slugify(name) {
    return String(name)
        .toLowerCase()
        .replace(/&/g, 'and')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
}

function parsePriceValue(price) {
    const digits = String(price).replace(/[^\d]/g, '')
    return digits ? Number(digits) : null
}

// GET /api/destinations
// Optional query: ?category=pilgrimage
// Admins can pass ?all=true to include inactive items in the admin table.
exports.getAllDestinations = async (req, res) => {
    const filter = {}
    if (!(req.query.all === 'true' && req.user?.isAdmin)) filter.isActive = true
    if (req.query.category) filter.category = req.query.category

    const destinations = await Destination.find(filter).sort({ category: 1, name: 1 })

    res.status(200).json({
        success: true,
        count: destinations.length,
        data: { destinations }
    })
}

// GET /api/destinations/categories
// Returns distinct categories with item counts, for building category nav.
exports.getCategories = async (req, res) => {
    const categories = await Destination.aggregate([
        { $match: { isActive: true } },
        {
            $group: {
                _id: '$category',
                label: { $first: '$categoryLabel' },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ])

    res.status(200).json({
        success: true,
        data: {
            categories: categories.map((c) => ({ key: c._id, label: c.label, count: c.count }))
        }
    })
}

// GET /api/destinations/:slug
exports.getDestinationBySlug = async (req, res) => {
    const destination = await Destination.findOne({ slug: req.params.slug, isActive: true })

    if (!destination) {
        return res.status(404).json({
            success: false,
            message: 'Destination not found'
        })
    }

    res.status(200).json({
        success: true,
        data: { destination }
    })
}

// POST /api/destinations (Admin only)
exports.createDestination = async (req, res) => {
    const validation = validators.validate(req.body, validators.schemas.createDestination)
    if (!validation.valid) {
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: validation.errors
        })
    }

    const data = validation.data
    const slug = slugify(data.name)

    const existing = await Destination.findOne({ slug })
    if (existing) {
        return res.status(400).json({
            success: false,
            message: 'A destination with this name already exists'
        })
    }

    const destination = await Destination.create({
        ...data,
        slug,
        priceValue: parsePriceValue(data.price),
        image: data.image || `/images/destinations/${slug}/1.png`
    })

    res.status(201).json({
        success: true,
        message: 'Destination created successfully',
        data: { destination }
    })
}

// PUT /api/destinations/:slug (Admin only)
exports.updateDestination = async (req, res) => {
    const validation = validators.validate(req.body, validators.schemas.updateDestination)
    if (!validation.valid) {
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: validation.errors
        })
    }

    const destination = await Destination.findOne({ slug: req.params.slug })
    if (!destination) {
        return res.status(404).json({
            success: false,
            message: 'Destination not found'
        })
    }

    const data = validation.data

    // Renaming re-slugs the destination — check the new slug won't collide.
    if (data.name && slugify(data.name) !== destination.slug) {
        const newSlug = slugify(data.name)
        const collision = await Destination.findOne({ slug: newSlug, _id: { $ne: destination._id } })
        if (collision) {
            return res.status(400).json({
                success: false,
                message: 'A destination with this name already exists'
            })
        }
        destination.slug = newSlug
    }

    Object.assign(destination, data)
    if (data.price) destination.priceValue = parsePriceValue(data.price)

    await destination.save()

    res.status(200).json({
        success: true,
        message: 'Destination updated successfully',
        data: { destination }
    })
}

// DELETE /api/destinations/:slug (Admin only)
exports.deleteDestination = async (req, res) => {
    const destination = await Destination.findOneAndDelete({ slug: req.params.slug })

    if (!destination) {
        return res.status(404).json({
            success: false,
            message: 'Destination not found'
        })
    }

    res.status(200).json({
        success: true,
        message: 'Destination deleted successfully'
    })
}