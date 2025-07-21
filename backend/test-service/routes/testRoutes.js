const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/authMiddleware');

// Import ALL functions properly
const {
    getAllTests,
    getTest,
    submitTest,
    getUserResults
} = require('../controllers/testController');

// Health check function - define directly or import
const healthCheck = (req, res) => {
    res.json({
        service: 'test-service-routes',
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
};

// ==================== STATIC ROUTES FIRST ====================

// Health check route - use defined function
router.get('/health', healthCheck);

// Submit test results
router.post('/submit', authenticateToken, submitTest);

// Get all tests
router.get('/all', getAllTests);

// User history
router.get('/user/history', authenticateToken, getUserResults);

// ==================== DYNAMIC ROUTES LAST ====================

// Get test questions for a specific topic (MUST BE LAST)
router.get('/:topicId', authenticateToken, getTest);

module.exports = router;