// src/models/Inquiry.js
// Inquiry/Enquiry form submissions

const mongoose = require('mongoose')

const inquirySchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null // Allow guest inquiries
        },
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters']
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email'
            ],
            default: null // Optional for authenticated users
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            match: [/^\d{10}$/, 'Phone must be 10 digits']
        },
        destination: {
            type: String,
            required: [true, 'Destination is required'],
            trim: true,
            maxlength: [100, 'Destination name is too long'],
            default: 'Other'
        },
        travellers: {
            type: String,
            required: [true, 'Number of travellers is required'],
            enum: ['Solo', '2', '3', '4+'],
            default: '2'
        },
        travelDate: {
            type: Date,
            default: null
        },
        budget: {
            type: String,
            enum: ['Budget', 'Mid-range', 'Luxury', 'Ultra-luxury', 'Not decided'],
            default: 'Not decided'
        },
        specialRequests: {
            type: String,
            trim: true,
            maxlength: [1000, 'Special requests cannot exceed 1000 characters'],
            default: null
        },
        status: {
            type: String,
            enum: ['new', 'contacted', 'in-progress', 'converted', 'closed'],
            default: 'new'
        },
        assignedTo: {
            type: String,
            default: null // Admin/curator assigned to this inquiry
        },
        notes: [
            {
                text: String,
                addedBy: String,
                addedAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ],
        isRead: {
            type: Boolean,
            default: false
        },
        readAt: {
            type: Date,
            default: null
        },
        respondedAt: {
            type: Date,
            default: null
        },
        source: {
            type: String,
            enum: ['website', 'mobile-app', 'direct', 'referral'],
            default: 'website'
        }
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: (doc, ret) => {
                delete ret.__v
                return ret
            }
        }
    }
)

// Indexes for efficient queries
inquirySchema.index({ user: 1 })
inquirySchema.index({ status: 1 })
inquirySchema.index({ destination: 1 })
inquirySchema.index({ createdAt: -1 })
inquirySchema.index({ phone: 1 })
inquirySchema.index({ email: 1 })

// Virtual for days until travel
inquirySchema.virtual('daysUntilTravel').get(function () {
    if (!this.travelDate) return null
    const today = new Date()
    const timeDiff = this.travelDate - today
    return Math.ceil(timeDiff / (1000 * 3600 * 24))
})

// Method to mark as read
inquirySchema.methods.markAsRead = async function () {
    this.isRead = true
    this.readAt = new Date()
    return await this.save()
}

// Method to add note
inquirySchema.methods.addNote = async function (text, addedBy) {
    this.notes.push({
        text,
        addedBy,
        addedAt: new Date()
    })
    this.respondedAt = new Date()
    return await this.save()
}

// Method to update status
inquirySchema.methods.updateStatus = async function (newStatus) {
    if (!['new', 'contacted', 'in-progress', 'converted', 'closed'].includes(newStatus)) {
        throw new Error('Invalid status')
    }
    this.status = newStatus
    return await this.save()
}

module.exports = mongoose.model('Inquiry', inquirySchema)