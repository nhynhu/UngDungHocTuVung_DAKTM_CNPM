const express = require('express');
const router = express.Router();
const { getWordsByTopic, addWord } = require('../controllers/wordController');

// SỬA LỖI: Route để lấy words theo topic
router.get('/topic/:topicId', getWordsByTopic);

// Route để tạo word mới (Admin only)
router.post('/', addWord);

module.exports = router;
