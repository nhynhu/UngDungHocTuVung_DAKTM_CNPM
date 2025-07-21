const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/authMiddleware');
const { getTest, submitTest, getUserResults } = require('../controllers/testController');

// Get test questions for a topic
router.get('/:topicId', authenticateToken, getTest);

// Submit test results
router.post('/', authenticateToken, submitTest);

// Get user test history
router.get('/user/history', authenticateToken, getUserResults);

module.exports = router;