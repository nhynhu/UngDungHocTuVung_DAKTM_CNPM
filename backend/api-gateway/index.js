require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8000;

// CORS middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
    console.log(`🌐 Gateway: ${req.method} ${req.originalUrl}`);
    next();
});

// Health check cho API Gateway
app.get('/health', (req, res) => {
    res.json({
        service: 'api-gateway',
        status: 'healthy',
        timestamp: new Date().toISOString(),
        routes: {
            auth: 'http://auth-service:5001',
            users: 'http://user-service:5004',
            topics: 'http://topic-service:5005',
            words: 'http://topic-service:5005',
            tests: 'http://test-service:5006',
            mail: 'http://mail-service:5002'
        }
    });
});

// Proxy configuration with error handling
const proxyOptions = {
    changeOrigin: true,
    timeout: 30000,
    onError: (err, req, res) => {
        console.error(`❌ Proxy error for ${req.path}:`, err.message);
        if (!res.headersSent) {
            res.status(503).json({
                error: 'Service unavailable',
                message: err.message,
                path: req.path
            });
        }
    },
    onProxyReq: (proxyReq, req, res) => {
        console.log(`🔄 Proxying: ${req.method} ${req.path} -> ${proxyReq.host}${proxyReq.path}`);
    }
};

// Proxy routes với proper error handling
app.use('/auth', createProxyMiddleware({
    target: 'http://auth-service:5001',
    ...proxyOptions
}));

app.use('/users', createProxyMiddleware({
    target: 'http://user-service:5004',
    ...proxyOptions
}));

app.use('/topics', createProxyMiddleware({
    target: 'http://topic-service:5005',
    ...proxyOptions
}));

app.use('/words', createProxyMiddleware({
    target: 'http://topic-service:5005',
    ...proxyOptions
}));

app.use('/tests', createProxyMiddleware({
    target: 'http://test-service:5006',
    ...proxyOptions
}));

app.use('/mail', createProxyMiddleware({
    target: 'http://mail-service:5002',
    ...proxyOptions
}));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('❌ Gateway error:', err);
    if (!res.headersSent) {
        res.status(500).json({
            error: 'Internal server error',
            message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
        });
    }
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Route not found',
        path: req.originalUrl,
        availableRoutes: ['/health', '/auth/*', '/users/*', '/topics/*', '/words/*', '/tests/*', '/mail/*']
    });
});

app.listen(PORT, () => {
    console.log(`🌐 API Gateway running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
});