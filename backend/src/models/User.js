// src/models/User.js
// User schema with authentication fields

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const env = require('../config/env')

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters']
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email'
            ]
        },
        phone: {
            type: String,
            trim: true,
            match: [/^\d{10}$/, 'Phone must be 10 digits']
        },
        password: {
            type: String,
            minlength: [6, 'Password must be at least 6 characters'],
            select: false // Don't return password by default
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true // Allows null for non-Google users
        },
        authMethod: {
            type: String,
            enum: ['email', 'google'],
            required: true
        },
        profileImage: {
            type: String,
            default: null
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        verificationToken: {
            type: String,
            select: false
        },
        lastLogin: {
            type: Date,
            default: null
        },
        isActive: {
            type: Boolean,
            default: true
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

// Hash password before saving (only for email/password auth)
userSchema.pre('save', async function (next) {
    // Only hash if password is modified and authMethod is email
    if (!this.isModified('password') || this.authMethod !== 'email') {
        return next()
    }

    try {
        const hashedPassword = await bcrypt.hash(this.password, env.HASH_ROUNDS)
        this.password = hashedPassword
        next()
    } catch (error) {
        next(error)
    }
})

// Method to compare password
userSchema.methods.comparePassword = async function (plainPassword) {
    return await bcrypt.compare(plainPassword, this.password)
}

// Method to get safe user data (without sensitive fields)
userSchema.methods.toSafeJSON = function () {
    const userObject = this.toObject()
    delete userObject.password
    delete userObject.verificationToken
    delete userObject.__v
    return userObject
}

// Virtual for initials (for avatar)
userSchema.virtual('initials').get(function () {
    return this.name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
})

module.exports = mongoose.model('User', userSchema)