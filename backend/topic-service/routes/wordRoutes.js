const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/authMiddleware');
const { getWordsByTopic, searchWords, addWord, deleteWord } = require('../controllers/wordController');

// ==================== CLEAN ROUTES ====================

// Search words
router.get('/search', searchWords);

// Words by topic
router.get('/topic/:topicId', getWordsByTopic);

// Protected routes
router.post('/', authenticateToken, addWord);
router.delete('/:id', authenticateToken, deleteWord);

module.exports = router;
