// server.js
// Application entry point

require('dotenv').config()
const app = require('./src/app')
const { connectDB } = require('./src/config/db')
const env = require('./src/config/env')

const PORT = env.PORT
const NODE_ENV = env.NODE_ENV

/**
 * Start server
 */
const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDB()

        // Start Express server
        const server = app.listen(PORT, () => {
            console.log(`
╔════════════════════════════════════════╗
║   🚀 TripSignature Backend Running     ║
╚════════════════════════════════════════╝

  🌐 Environment: ${NODE_ENV.toUpperCase()}
  📍 Server: http://localhost:${PORT}
  🔗 API: http://localhost:${PORT}/api
  
  ✅ Database: Connected
  ✅ Routes: Ready
  ✅ Middleware: Configured
  
  Press Ctrl+C to stop the server
      `)
        })

        // Graceful shutdown
        process.on('SIGTERM', () => {
            console.log('📴 SIGTERM received, shutting down gracefully...')
            server.close(() => {
                console.log('✅ Server closed')
                process.exit(0)
            })
        })

        process.on('SIGINT', () => {
            console.log('\n📴 SIGINT received, shutting down gracefully...')
            server.close(() => {
                console.log('✅ Server closed')
                process.exit(0)
            })
        })
    } catch (error) {
        console.error('❌ Failed to start server:', error.message)
        process.exit(1)
    }
}

// Start the server
startServer()