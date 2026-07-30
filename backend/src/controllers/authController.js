// src/controllers/authController.js
// Authentication logic for email/password and Google OAuth

const User = require('../models/User')
const jwtUtils = require('../utils/jwt')
const validators = require('../utils/validators')
const { AppError, asyncHandler } = require('../middleware/errorHandler')
const { OAuth2Client } = require('google-auth-library')
const env = require('../config/env')

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID)

// ==========================================
// EMAIL/PASSWORD AUTHENTICATION
// ==========================================

/**
 * User signup with email and password
 * POST /api/auth/signup
 */
const emailSignup = asyncHandler(async (req, res) => {
    const { name, email, password, phone } = req.body

    // Validate input
    const validation = validators.validate(req.body, validators.schemas.emailSignup)
    if (!validation.valid) {
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: validation.errors
        })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: validation.data.email })
    if (existingUser) {
        return res.status(400).json({
            success: false,
            message: 'Email already registered. Please login or use a different email.'
        })
    }

    // Create user
    const user = await User.create({
        name: validation.data.name,
        email: validation.data.email,
        password: validation.data.password,
        phone: validation.data.phone || null,
        authMethod: 'email',
        isVerified: false
    })

    // Generate token
    const token = jwtUtils.generateToken(user._id)

    // Return response
    res.status(201).json({
        success: true,
        message: 'Account created successfully',
        data: {
            user: user.toSafeJSON(),
            token,
            expiresIn: env.JWT_EXPIRY
        }
    })
})

/**
 * User login with email and password
 * POST /api/auth/login
 */
const emailLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    // Validate input
    const validation = validators.validate(req.body, validators.schemas.emailLogin)
    if (!validation.valid) {
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: validation.errors
        })
    }

    // Find user and select password field (it's normally excluded)
    const user = await User.findOne({ email: validation.data.email }).select('+password')

    if (!user || user.authMethod !== 'email') {
        return res.status(401).json({
            success: false,
            message: 'Invalid email or password'
        })
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(validation.data.password)
    if (!isPasswordValid) {
        return res.status(401).json({
            success: false,
            message: 'Invalid email or password'
        })
    }

    // Update last login
    user.lastLogin = new Date()
    await user.save()

    // Generate token
    const token = jwtUtils.generateToken(user._id)

    // Return response
    res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
            user: user.toSafeJSON(),
            token,
            expiresIn: env.JWT_EXPIRY
        }
    })
})

// ==========================================
// GOOGLE OAUTH AUTHENTICATION
// ==========================================

/**
 * Google OAuth login/signup
 * POST /api/auth/google
 * Frontend sends Google ID token
 */
const googleAuth = asyncHandler(async (req, res) => {
    const { token } = req.body

    // Validate input
    const validation = validators.validate(req.body, validators.schemas.googleAuth)
    if (!validation.valid) {
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: validation.errors
        })
    }

    try {
        // Verify Google token
        const ticket = await googleClient.verifyIdToken({
            idToken: validation.data.token,
            audience: env.GOOGLE_CLIENT_ID
        })

        const payload = ticket.getPayload()

        // Extract Google user info
        const { sub: googleId, email, name, picture } = payload

        if (!email || !googleId) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Google token'
            })
        }

        // Check if user exists by Google ID
        let user = await User.findOne({ googleId })

        if (user) {
            // User exists, just login
            user.lastLogin = new Date()
            await user.save()
        } else {
            // Check if email already exists with different auth method
            const existingEmailUser = await User.findOne({ email })

            if (existingEmailUser) {
                // Email exists but with different auth method
                // Option 1: Link Google account to existing user (recommended)
                // Option 2: Create separate account with different email
                // For now, we'll return error asking user to login with email
                return res.status(400).json({
                    success: false,
                    message: 'Email already exists. Please login with your password or use a different email.',
                    code: 'EMAIL_EXISTS'
                })
            }

            // Create new user with Google OAuth
            user = await User.create({
                name: name || email.split('@')[0],
                email,
                googleId,
                authMethod: 'google',
                profileImage: picture || null,
                isVerified: true, // Google-authenticated emails are verified
                lastLogin: new Date()
            })
        }

        // Generate token
        const jwtToken = jwtUtils.generateToken(user._id)

        // Return response
        res.status(200).json({
            success: true,
            message: user.createdAt ? 'Account created successfully' : 'Login successful',
            data: {
                user: user.toSafeJSON(),
                token: jwtToken,
                expiresIn: env.JWT_EXPIRY,
                isNewUser: !user.lastLogin || user.createdAt
            }
        })
    } catch (error) {
        console.error('Google auth error:', error)
        res.status(400).json({
            success: false,
            message: 'Invalid Google token',
            error: error.message
        })
    }
})

// ==========================================
// LOGOUT & USER INFO
// ==========================================

/**
 * Get current user profile
 * GET /api/auth/me
 * Requires: Authentication
 */
const getCurrentUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)

    res.status(200).json({
        success: true,
        data: {
            user: user.toSafeJSON()
        }
    })
})

/**
 * Logout (frontend should delete token)
 * POST /api/auth/logout
 */
const logout = asyncHandler(async (req, res) => {
    // JWT logout is stateless - just delete token on frontend
    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    })
})

module.exports = {
    emailSignup,
    emailLogin,
    googleAuth,
    getCurrentUser,
    logout
}