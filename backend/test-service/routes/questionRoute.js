const express = require('express');
const { getQuestionsByTopic } = require('../controllers/questionController');
const router = express.Router();

router.get('/:topicId', authenticateToken, getQuestionsByTopic);

module.exports = router;