const express = require('express');
const { authenticateToken, isAdmin } = require('../../middleware/authMiddleware');
const { addWord, deleteWord, getWordsByTopic } = require('../controllers/wordController');
const router = express.Router();

router.get('/:topicId', authenticateToken, getWordsByTopic);
router.post('/', authenticateToken, isAdmin, addWord);
router.delete('/:id', authenticateToken, isAdmin, deleteWord);

module.exports = router;
