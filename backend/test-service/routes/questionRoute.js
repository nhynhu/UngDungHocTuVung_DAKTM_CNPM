const express = require('express');
const { authenticateToken, isAdmin } = require('../../middleware/authMiddleware');
const { createQuestion, deleteQuestion, getQuestionsByTopic } = require('../controllers/questionController');
const router = express.Router();

router.post('/', authenticateToken, isAdmin, createQuestion);
router.delete('/:id', authenticateToken, isAdmin, deleteQuestion);
router.get('/:topicId', authenticateToken, getQuestionsByTopic);

module.exports = router;