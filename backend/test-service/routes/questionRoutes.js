const express = require('express');
const { getQuestionsByTopic, createQuestion } = require('../controllers/questionController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/:topicId', getQuestionsByTopic);
router.post('/', authenticateToken, createQuestion);

module.exports = router;