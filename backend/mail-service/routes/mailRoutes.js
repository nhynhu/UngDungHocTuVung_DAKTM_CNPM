const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => {
    res.json({
        service: 'mail-service',
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;