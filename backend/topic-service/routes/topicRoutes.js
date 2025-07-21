const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/authMiddleware');
const {
    getAllTopics,
    getTopicById,
    createTopic,
    deleteTopic
} = require('../controllers/topicController');
const { searchWords } = require('../controllers/wordController');

// Search route - PHẢI ĐẶT TRƯỚC ROUTE DYNAMIC
router.get('/search', searchWords);

// Routes for words by topic - Thêm route này
router.get('/:topicId/words', require('../controllers/wordController').getWordsByTopic);

// Public routes
router.get('/', getAllTopics);
router.get('/:id', getTopicById);

// Protected routes
router.post('/', authenticateToken, createTopic);
router.delete('/:id', authenticateToken, deleteTopic);

module.exports = router;