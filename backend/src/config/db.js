// src/config/db.js
// MongoDB connection setup

const mongoose = require('mongoose')
const dns = require('dns')
const env = require('./env')

// Set DNS servers to fix connection issues
dns.setServers(['8.8.8.8', '8.8.4.4'])

const connectDB = async () => {
    try {
        console.log('🔄 Connecting to MongoDB...')

        await mongoose.connect(env.MONGODB_URI)

        console.log('✅ MongoDB connected successfully')
        return true
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message)
        process.exit(1)
    }
}

const disconnectDB = async () => {
    try {
        await mongoose.disconnect()
        console.log('✅ MongoDB disconnected')
    } catch (error) {
        console.error('❌ MongoDB disconnection failed:', error.message)
    }
}

module.exports = { connectDB, disconnectDB }