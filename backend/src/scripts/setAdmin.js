// src/scripts/setAdmin.js
// One-off script to grant/revoke admin access for a user by email.
//
// Usage (from backend/):
//   npm run make-admin -- someone@example.com
//   npm run make-admin -- someone@example.com --revoke

require('dotenv').config()
const { connectDB, disconnectDB } = require('../config/db')
const User = require('../models/User')

async function run() {
    const email = process.argv[2]
    const revoke = process.argv.includes('--revoke')

    if (!email) {
        console.error('Usage: npm run make-admin -- <email> [--revoke]')
        process.exit(1)
    }

    await connectDB()

    const user = await User.findOne({ email: email.toLowerCase().trim() })
    if (!user) {
        console.error(`❌ No user found with email: ${email}`)
        await disconnectDB()
        process.exit(1)
    }

    user.isAdmin = !revoke
    await user.save()

    console.log(`✅ ${user.email} is now ${user.isAdmin ? 'an admin' : 'a regular user'}.`)
    await disconnectDB()
    process.exit(0)
}

run().catch((err) => {
    console.error('❌ Failed:', err.message)
    process.exit(1)
})