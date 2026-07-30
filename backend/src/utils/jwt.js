// src/utils/jwt.js
// JWT token utilities

const jwt = require('jsonwebtoken')
const env = require('../config/env')

/**
 * Generate JWT token
 * @param {string} userId - User ID
 * @returns {string} JWT token
 */
const generateToken = (userId) => {
    return jwt.sign(
        { userId },
        env.JWT_SECRET,
        { expiresIn: env.JWT_EXPIRY }
    )
}

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @returns {object} Decoded token or null if invalid
 */
const verifyToken = (token) => {
    try {
        return jwt.verify(token, env.JWT_SECRET)
    } catch (error) {
        return null
    }
}

/**
 * Decode JWT token without verification
 * @param {string} token - JWT token
 * @returns {object} Decoded token
 */
const decodeToken = (token) => {
    try {
        return jwt.decode(token)
    } catch (error) {
        return null
    }
}

/**
 * Extract token from headers
 * @param {object} headers - Request headers
 * @returns {string} Token or null
 */
const extractTokenFromHeaders = (headers) => {
    const authHeader = headers.authorization
    if (!authHeader) return null

    // Bearer token format: "Bearer <token>"
    const parts = authHeader.split(' ')
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return null
    }

    return parts[1]
}

/**
 * Generate token pair (access + refresh)
 * Useful if you want to implement refresh tokens later
 */
const generateTokenPair = (userId) => {
    return {
        accessToken: generateToken(userId),
        expiresIn: env.JWT_EXPIRY
    }
}

module.exports = {
    generateToken,
    verifyToken,
    decodeToken,
    extractTokenFromHeaders,
    generateTokenPair
}