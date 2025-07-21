const express = require('express');
const { getQuestionsByTopic, createQuestion, seedQuestions } = require('../controllers/questionController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/:topicId', getQuestionsByTopic);
router.post('/', authenticateToken, createQuestion);
router.post('/seed', seedQuestions);

module.exports = router;