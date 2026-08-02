// src/controllers/newsletterController.js

const Subscriber = require('../models/Subscriber')
const validators = require('../utils/validators')

// POST /api/newsletter/subscribe (public)
exports.subscribe = async (req, res) => {
    const validation = validators.validate(req.body, validators.schemas.subscribe)
    if (!validation.valid) {
        return res.status(400).json({ success: false, message: 'Validation error', errors: validation.errors })
    }

    const { email } = validation.data

    const existing = await Subscriber.findOne({ email })
    if (existing) {
        if (!existing.isActive) {
            existing.isActive = true
            await existing.save()
        }
        return res.status(200).json({
            success: true,
            message: "You're already subscribed \u2014 welcome back!"
        })
    }

    await Subscriber.create({ email })

    res.status(201).json({
        success: true,
        message: "You're subscribed \u2014 welcome aboard."
    })
}

// GET /api/newsletter/admin/subscribers (Admin only)
exports.getAllSubscribers = async (req, res) => {
    const subscribers = await Subscriber.find({ isActive: true }).sort({ createdAt: -1 })
    res.status(200).json({
        success: true,
        count: subscribers.length,
        data: { subscribers }
    })
}