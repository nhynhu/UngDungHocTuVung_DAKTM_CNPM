const express = require('express');
const { getQuestionsByTopic } = require('../controllers/questionController_optimized');
const router = express.Router();

router.get('/:topicId', getQuestionsByTopic);

module.exports = router;