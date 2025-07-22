const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController_optimized');

const healthCheck = (req, res) => {
    res.json({
        service: 'test-service',
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
};

router.get('/tests', testController.getAllTests);
router.get('/tests/:testId', testController.getTest);
router.post('/tests/submit', testController.submitTest);
router.get('/health', healthCheck);

module.exports = router;