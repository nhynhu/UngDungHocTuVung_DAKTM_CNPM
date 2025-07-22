require('dotenv').config({ debug: process.env.NODE_ENV === 'development' });
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

console.log('🔐 Auth Service starting...');
console.log('📍 Environment:', process.env.NODE_ENV);
console.log('📍 USER_SERVICE_URL:', process.env.USER_SERVICE_URL);

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
    console.log(`🔐 Auth Service: ${req.method} ${req.originalUrl} - ${new Date().toISOString()}`);
    if (req.body && Object.keys(req.body).length > 0) {
        const logBody = { ...req.body };
        if (logBody.password) logBody.password = '***hidden***';
        console.log('📦 Request body:', logBody);
    }
    next();
});

// Routes
app.use('/auth', authRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({
        service: 'auth-service',
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        env: {
            NODE_ENV: process.env.NODE_ENV,
            PORT: process.env.PORT,
            USER_SERVICE_URL: process.env.USER_SERVICE_URL ? 'configured' : 'not configured'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('❌ Auth Service Error:', {
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method
    });

    res.status(err.status || 500).json({
        success: false,
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// 404 handler
app.use('*', (req, res) => {
    console.log(`❌ Auth Service - Route not found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({
        success: false,
        error: 'Route not found',
        availableRoutes: [
            'POST /auth/register',
            'POST /auth/login',
            'GET /auth/health',
            'GET /health'
        ]
    });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🔐 Auth Service: SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('🔐 Auth Service: SIGINT received, shutting down gracefully');
    process.exit(0);
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🔐 Auth Service running on port ${PORT}`);
    console.log(`📍 Available routes:`);
    console.log(`   • POST /auth/register`);
    console.log(`   • POST /auth/login`);
    console.log(`   • GET /auth/health`);
    console.log(`   • GET /health`);
    console.log(`🚀 Auth Service ready to handle requests`);
});

server.on('error', (err) => {
    console.error('❌ Auth Service failed to start:', err.message);
    process.exit(1);
});