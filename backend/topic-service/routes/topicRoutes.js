const express = require('express');
const router = express.Router();
const topicController = require('../controllers/topicController_optimized');

router.get('/topics/:id', topicController.getTopicById);
router.get('/topics', topicController.getAllTopics);

module.exports = router;