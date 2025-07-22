const express = require('express');
const router = express.Router();
const wordController = require('../controllers/wordController');

// SỬA LỖI: Route để lấy words theo topic
router.get('/topic/:topicId', wordController.getWordsByTopic);

// Route để tạo word mới (Admin only)
router.post('/', wordController.addWord);

// Route để tìm kiếm từ theo nhiều tiêu chí
router.get('/searchWords', wordController.searchWords);

module.exports = router;
