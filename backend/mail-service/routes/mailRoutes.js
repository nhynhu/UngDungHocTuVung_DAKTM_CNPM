const express = require('express');
const router = express.Router();
const {
    sendVerificationEmail,
    sendPasswordResetEmail,
    testConnection,
    healthCheck
} = require('../controllers/mailController');

// Core authentication routes
router.post('/send-verification', sendVerificationEmail);
router.post('/send-password-reset', sendPasswordResetEmail);

// Testing & monitoring routes
router.get('/test-connection', testConnection);
router.get('/health', healthCheck);

module.exports = router;