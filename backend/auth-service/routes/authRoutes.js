const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /auth/register (được gọi từ API Gateway: /api/auth/register)
router.post('/register', authController.register);

// POST /auth/login
router.post('/login', authController.login);

// POST /auth/verify - route verify email
router.post('/verify', authController.verify);

// Health check
router.get('/health', (req, res) => {
    res.json({
        service: 'auth-routes',
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;