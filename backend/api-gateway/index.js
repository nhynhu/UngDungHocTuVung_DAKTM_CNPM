const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

app.use('/auth', createProxyMiddleware({ target: 'http://auth-service:5001', changeOrigin: true }));
app.use('/users', createProxyMiddleware({ target: 'http://user-service:5004', changeOrigin: true }));
app.use('/topics', createProxyMiddleware({ target: 'http://topic-service:5005', changeOrigin: true }));
app.use('/words', createProxyMiddleware({ target: 'http://topic-service:5005', changeOrigin: true }));
app.use('/questions', createProxyMiddleware({ target: 'http://test-service:5006', changeOrigin: true }));
app.use('/results', createProxyMiddleware({ target: 'http://test-service:5006', changeOrigin: true }));

app.listen(8000, () => console.log('API Gateway on port 8000'));