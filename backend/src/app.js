// src/app.js
// Express app configuration

const express = require('express')
const cors = require('cors')
const env = require('./config/env')
const { errorHandler } = require('./middleware/errorHandler')

// Import routes
const authRoutes = require('./routes/auth')
const inquiryRoutes = require('./routes/inquiry')

// Create Express app
const app = express()

// ==========================================
// MIDDLEWARE
// ==========================================

// Body parser
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

// CORS configuration
const corsOptions = {
    origin: env.FRONTEND_URL,
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}
app.use(cors(corsOptions))

// Security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('X-Frame-Options', 'DENY')
    res.setHeader('X-XSS-Protection', '1; mode=block')
    next()
})

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
    next()
})

// ==========================================
// ROUTES
// ==========================================

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Backend is running',
        timestamp: new Date().toISOString()
    })
})

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/inquiry', inquiryRoutes)

// ==========================================
// 404 & ERROR HANDLING
// ==========================================

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.path
    })
})

// Global error handler (MUST be last)
app.use(errorHandler)

module.exports = app