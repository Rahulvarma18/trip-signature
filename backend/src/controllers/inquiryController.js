// src/controllers/inquiryController.js
// Inquiry/Enquiry form handling

const Inquiry = require('../models/Inquiry')
const validators = require('../utils/validators')
const { asyncHandler } = require('../middleware/errorHandler')
const User = require('../models/User')

/**
 * Create new inquiry
 * POST /api/inquiry/create
 * Works for both authenticated and guest users
 */
const createInquiry = asyncHandler(async (req, res) => {
    const { name, email, phone, destination, travellers, travelDate, budget, specialRequests } = req.body

    // Validate input
    const validation = validators.validate(req.body, validators.schemas.createInquiry)
    if (!validation.valid) {
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: validation.errors
        })
    }

    // Create inquiry
    const inquiry = await Inquiry.create({
        user: req.user?._id || null, // Attach user if authenticated
        name: validation.data.name,
        email: validation.data.email || (req.user?.email || null),
        phone: validation.data.phone,
        destination: validation.data.destination,
        travellers: validation.data.travellers,
        travelDate: validation.data.travelDate || null,
        budget: validation.data.budget || 'Not decided',
        specialRequests: validation.data.specialRequests || null,
        source: 'website',
        status: 'new',
        isRead: false
    })

    // Populate user if inquiry is linked to user
    if (inquiry.user) {
        await inquiry.populate('user', 'name email phone')
    }

    res.status(201).json({
        success: true,
        message: 'Inquiry submitted successfully. Our travel curator will contact you soon!',
        data: {
            inquiry: inquiry.toJSON(),
            inquiryId: inquiry._id
        }
    })
})

/**
 * Get user's inquiries
 * GET /api/inquiry/my-inquiries
 * Requires: Authentication
 */
const getMyInquiries = asyncHandler(async (req, res) => {
    const inquiries = await Inquiry.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .lean()

    res.status(200).json({
        success: true,
        data: {
            inquiries,
            total: inquiries.length
        }
    })
})

/**
 * Get single inquiry details
 * GET /api/inquiry/:inquiryId
 * Requires: Authentication
 */
const getInquiryDetails = asyncHandler(async (req, res) => {
    const { inquiryId } = req.params

    const inquiry = await Inquiry.findById(inquiryId).populate('user', 'name email phone')

    if (!inquiry) {
        return res.status(404).json({
            success: false,
            message: 'Inquiry not found'
        })
    }

    // Check if user owns this inquiry
    if (inquiry.user?._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({
            success: false,
            message: 'Unauthorized to view this inquiry'
        })
    }

    // Mark as read
    if (!inquiry.isRead) {
        inquiry.isRead = true
        inquiry.readAt = new Date()
        await inquiry.save()
    }

    res.status(200).json({
        success: true,
        data: {
            inquiry
        }
    })
})

/**
 * Update inquiry status (Admin/Curator only)
 * PATCH /api/inquiry/:inquiryId/status
 * Requires: Authentication + Admin/Curator role
 * Body: { status: 'contacted|in-progress|converted|closed' }
 */
const updateInquiryStatus = asyncHandler(async (req, res) => {
    const { inquiryId } = req.params
    const { status } = req.body

    if (!['contacted', 'in-progress', 'converted', 'closed'].includes(status)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid status. Must be: contacted, in-progress, converted, or closed'
        })
    }

    const inquiry = await Inquiry.findByIdAndUpdate(
        inquiryId,
        { status, respondedAt: new Date() },
        { new: true, runValidators: true }
    )

    if (!inquiry) {
        return res.status(404).json({
            success: false,
            message: 'Inquiry not found'
        })
    }

    res.status(200).json({
        success: true,
        message: 'Inquiry status updated successfully',
        data: {
            inquiry
        }
    })
})

/**
 * Add note to inquiry (Admin/Curator only)
 * POST /api/inquiry/:inquiryId/note
 * Body: { text: 'note text' }
 */
const addNote = asyncHandler(async (req, res) => {
    const { inquiryId } = req.params
    const { text } = req.body

    if (!text || text.trim().length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Note text is required'
        })
    }

    const inquiry = await Inquiry.findById(inquiryId)

    if (!inquiry) {
        return res.status(404).json({
            success: false,
            message: 'Inquiry not found'
        })
    }

    await inquiry.addNote(text.trim(), req.user.name)

    res.status(200).json({
        success: true,
        message: 'Note added successfully',
        data: {
            inquiry
        }
    })
})

/**
 * Get all inquiries (Admin only)
 * GET /api/inquiry/admin/all
 * Query params: ?status=new&destination=Varanasi&limit=20&offset=0
 */
const getAllInquiries = asyncHandler(async (req, res) => {
    const { status, destination, limit = 20, offset = 0 } = req.query

    // Build filter
    const filter = {}
    if (status) filter.status = status
    if (destination) filter.destination = destination

    const inquiries = await Inquiry.find(filter)
        .populate('user', 'name email phone')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(parseInt(offset))

    const total = await Inquiry.countDocuments(filter)

    res.status(200).json({
        success: true,
        data: {
            inquiries,
            total,
            limit: parseInt(limit),
            offset: parseInt(offset)
        }
    })
})

/**
 * Get inquiry statistics (Admin only)
 * GET /api/inquiry/admin/stats
 */
const getInquiryStats = asyncHandler(async (req, res) => {
    const stats = await Inquiry.aggregate([
        {
            $facet: {
                byStatus: [
                    {
                        $group: {
                            _id: '$status',
                            count: { $sum: 1 }
                        }
                    }
                ],
                byDestination: [
                    {
                        $group: {
                            _id: '$destination',
                            count: { $sum: 1 }
                        }
                    },
                    { $sort: { count: -1 } },
                    { $limit: 10 }
                ],
                total: [
                    { $count: 'count' }
                ],
                thisMonth: [
                    {
                        $match: {
                            createdAt: {
                                $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                            }
                        }
                    },
                    { $count: 'count' }
                ]
            }
        }
    ])

    res.status(200).json({
        success: true,
        data: {
            stats: stats[0]
        }
    })
})

module.exports = {
    createInquiry,
    getMyInquiries,
    getInquiryDetails,
    updateInquiryStatus,
    addNote,
    getAllInquiries,
    getInquiryStats
}