const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/authMiddleware');
const { getWordsByTopic, searchWords, addWord, deleteWord } = require('../controllers/wordController');

// GET /words/:topicId
router.get('/:topicId', authenticateToken, getWordsByTopic);
// POST /words/
router.post('/', authenticateToken, addWord);
// DELETE /words/:id
router.delete('/:id', authenticateToken, deleteWord);
router.get('/topic/:topicId', getWordsByTopic);
router.get('/search', searchWords);

module.exports = router;
