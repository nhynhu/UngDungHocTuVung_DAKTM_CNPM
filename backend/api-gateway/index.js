require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 8000;

// Service URLs
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://auth-service:5001';
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://user-service:5004';
const TOPIC_SERVICE_URL = process.env.TOPIC_SERVICE_URL || 'http://topic-service:5005';
const TEST_SERVICE_URL = process.env.TEST_SERVICE_URL || 'http://test-service:5006';

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

// CHỈ dùng express.json() cho các route KHÔNG proxy
app.use('/health', express.json());

// KHÔNG dùng app.use(express.json()) cho toàn bộ app!

// Request logging
app.use((req, res, next) => {
    console.log(`🌐 API Gateway: ${req.method} ${req.originalUrl}`);
    next();
});

// Proxy options
const proxyOptions = {
    changeOrigin: true,
    timeout: 30000,
    logLevel: 'debug',
    onError: (err, req, res) => {
        console.error(`❌ Proxy Error for ${req.url}:`, err.message);
        res.status(503).json({
            error: 'Service unavailable',
            message: err.message,
            service: req.url.split('/')[2]
        });
    },
    onProxyReq: (proxyReq, req, res) => {
        console.log(`🔄 Proxying: ${req.method} ${req.url} -> ${proxyReq.path}`);
    }
};

// Auth service proxy
app.use('/api/auth', createProxyMiddleware({
    target: AUTH_SERVICE_URL,
    pathRewrite: { '^/api/auth': '/auth' },
    onProxyReq: (proxyReq, req, res) => {
        if (req.body) {
            const bodyData = JSON.stringify(req.body);
            proxyReq.setHeader('Content-Type', 'application/json');
            proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
            proxyReq.write(bodyData);
        }
    },
    ...proxyOptions
}));

// User service proxy
app.use('/api/users', createProxyMiddleware({
    target: USER_SERVICE_URL,
    pathRewrite: { '^/api/users': '/users' },
    ...proxyOptions
}));

// Topic service proxy
app.use('/api/topics', createProxyMiddleware({
    target: TOPIC_SERVICE_URL,
    pathRewrite: { '^/api/topics': '/topics' },
    ...proxyOptions
}));

// Test service proxy
app.use('/api/tests', createProxyMiddleware({
    target: TEST_SERVICE_URL,
    pathRewrite: (path, req) => {
        // Giữ nguyên /api/tests, /api/tests/ và /api/tests/abc -> /tests, /tests/, /tests/abc
        return path.replace(/^\/api\/tests(\/|$)/, '/tests$1');
    },
    ...proxyOptions
}));

// Static files proxy
app.use('/uploads', createProxyMiddleware({
    target: TOPIC_SERVICE_URL,
    pathRewrite: { '^/uploads': '/uploads' },
    ...proxyOptions
}));

// Words service proxy
app.use('/api/words', createProxyMiddleware({
    target: TOPIC_SERVICE_URL,
    pathRewrite: { '^/api/words': '/words' },
    ...proxyOptions
}));

// Health check
app.get('/health', (req, res) => {
    res.json({
        service: 'api-gateway',
        status: 'healthy',
        timestamp: new Date().toISOString(),
        proxies: {
            auth: AUTH_SERVICE_URL,
            users: USER_SERVICE_URL,
            topics: TOPIC_SERVICE_URL,
            tests: TEST_SERVICE_URL
        }
    });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌐 API Gateway running on port ${PORT}`);
    console.log(`📍 Proxy routes:`);
    console.log(`   • /api/auth/* -> ${AUTH_SERVICE_URL}/auth/*`);
    console.log(`   • /api/users/* -> ${USER_SERVICE_URL}/users/*`);
    console.log(`   • /api/topics/* -> ${TOPIC_SERVICE_URL}/topics/*`);
    console.log(`   • /api/tests/* -> ${TEST_SERVICE_URL}/*`);
});