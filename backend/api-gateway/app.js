const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
    if (process.env.NODE_ENV !== 'test') {
        console.log(`${req.method} ${req.url}`);
    }
    next();
});

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'API Gateway is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Service configurations
const services = [
    { path: '/auth', target: 'http://auth-service:5001' },
    { path: '/users', target: 'http://user-service:5002' },
    { path: '/topics', target: 'http://topic-service:5005' },
    { path: '/words', target: 'http://topic-service:5005' },
    { path: '/tests', target: 'http://test-service:5004' },
    { path: '/questions', target: 'http://test-service:5004' },
    { path: '/results', target: 'http://test-service:5004' },
    { path: '/mail', target: 'http://mail-service:5006' },
    { path: '/uploads', target: 'http://topic-service:5005' }
];

// Setup proxy routes
services.forEach(service => {
    app.use(service.path, createProxyMiddleware({
        target: service.target,
        changeOrigin: true,
        pathRewrite: {
            [`^${service.path}`]: '',
        },
        onError: (err, req, res) => {
            console.error(`Proxy error for ${service.path}:`, err.message);
            res.status(503).json({
                error: 'Service unavailable',
                service: service.path.replace('/', ''),
                message: err.message
            });
        },
        onProxyReq: (proxyReq, req, res) => {
            if (process.env.NODE_ENV !== 'test') {
                console.log(`Proxying ${req.method} ${req.url} to ${service.target}`);
            }
        }
    }));
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        path: req.originalUrl,
        method: req.method
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Gateway error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: err.message
    });
});

module.exports = app;