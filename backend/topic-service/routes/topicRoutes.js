const express = require('express');
const router = express.Router();
const topicController = require('../controllers/topicController');

// Route để lấy topic theo ID
router.get('/topics/:id', topicController.getTopicById);

// SỬA LỖI: Route root "/" để lấy tất cả topics
router.get('/topics', topicController.getAllTopics);

// Route để tạo topic mới (Admin only)
router.post('/', topicController.createTopic);

module.exports = router;