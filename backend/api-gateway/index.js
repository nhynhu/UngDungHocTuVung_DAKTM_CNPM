const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

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

// Proxy routes
app.use('/auth', createProxyMiddleware({ target: 'http://auth-service:5001', changeOrigin: true }));
app.use('/users', createProxyMiddleware({ target: 'http://user-service:5004', changeOrigin: true }));
app.use('/topics', createProxyMiddleware({ target: 'http://topic-service:5005', changeOrigin: true }));
app.use('/words', createProxyMiddleware({ target: 'http://topic-service:5005', changeOrigin: true }));
app.use('/tests', createProxyMiddleware({ target: 'http://test-service:5006', changeOrigin: true }));
app.use('/mail', createProxyMiddleware({ target: 'http://mail-service:5002', changeOrigin: true }));

app.listen(8000, () => console.log('🚪 API Gateway on port 8000'));