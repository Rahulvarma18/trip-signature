// src/middleware/errorHandler.js
// Global error handling middleware

class AppError extends Error {
    constructor(message, statusCode) {
        super(message)
        this.statusCode = statusCode
        Error.captureStackTrace(this, this.constructor)
    }
}

/**
 * Global error handler middleware
 * Place this AFTER all routes in app.js
 * Usage: app.use(errorHandler)
 */
const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.message = err.message || 'Internal Server Error'

    // Log error in development
    if (process.env.NODE_ENV === 'development') {
        console.error('❌ Error:', {
            message: err.message,
            statusCode: err.statusCode,
            stack: err.stack
        })
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors)
            .map(e => e.message)
            .join(', ')
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: message
        })
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0]
        const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
        return res.status(400).json({
            success: false,
            message
        })
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            message: 'Invalid token'
        })
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            message: 'Token expired'
        })
    }

    // Cast error (invalid MongoDB ID)
    if (err.name === 'CastError') {
        return res.status(400).json({
            success: false,
            message: 'Invalid ID format'
        })
    }

    // Custom AppError
    res.status(err.statusCode).json({
        success: false,
        message: err.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    })
}

/**
 * Async handler wrapper
 * Wrap async route handlers to catch errors automatically
 * Usage: router.post('/route', asyncHandler(controllerFunction))
 */
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next)
    }
}

module.exports = {
    AppError,
    errorHandler,
    asyncHandler
}