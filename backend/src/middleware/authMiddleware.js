// src/middleware/authMiddleware.js
// JWT authentication middleware

const jwtUtils = require('../utils/jwt')
const User = require('../models/User')

/**
 * Verify JWT token and attach user to request
 * Usage: app.use(protect) or app.post('/route', protect, controllerFunction)
 */
const protect = async (req, res, next) => {
    try {
        // Extract token from headers
        const token = jwtUtils.extractTokenFromHeaders(req.headers)

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided. Please login to continue.'
            })
        }

        // Verify token
        const decoded = jwtUtils.verifyToken(token)

        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token. Please login again.'
            })
        }

        // Get user from database
        const user = await User.findById(decoded.userId)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found. Please login again.'
            })
        }

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Your account has been deactivated.'
            })
        }

        // Attach user to request object
        req.user = user
        req.token = token

        next()
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Authentication error',
            error: error.message
        })
    }
}

/**
 * Optional authentication
 * Similar to protect but doesn't fail if no token
 * Useful for routes that work for both authenticated and guest users
 */
const optionalAuth = async (req, res, next) => {
    try {
        const token = jwtUtils.extractTokenFromHeaders(req.headers)

        if (token) {
            const decoded = jwtUtils.verifyToken(token)
            if (decoded) {
                const user = await User.findById(decoded.userId)
                if (user && user.isActive) {
                    req.user = user
                    req.token = token
                }
            }
        }

        next()
    } catch (error) {
        // Continue without authentication if error occurs
        next()
    }
}

/**
 * Check if user is admin
 * Usage: app.post('/admin-route', protect, isAdmin, controllerFunction)
 */
const isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required'
        })
    }

    if (!req.user.isAdmin) {
        return res.status(403).json({
            success: false,
            message: 'Admin access required'
        })
    }

    next()
}

module.exports = {
    protect,
    optionalAuth,
    isAdmin
}