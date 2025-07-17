const express = require('express');
const { authenticateToken, isAdmin } = require('../../middleware/authMiddleware');
const { createTopic, deleteTopic, getAllTopics } = require('../controllers/topicController');
const router = express.Router();

router.get('/', authenticateToken, getAllTopics);
router.post('/', authenticateToken, isAdmin, createTopic);
router.delete('/:id', authenticateToken, isAdmin, deleteTopic);

module.exports = router;