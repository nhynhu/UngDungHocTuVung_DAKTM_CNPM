const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/authMiddleware');
const {
    getAllTopics,
    getTopicById,
    createTopic,
    deleteTopic
} = require('../controllers/topicController');

// Public routes
router.get('/', getAllTopics);
router.get('/:id', getTopicById);

// Protected routes
router.post('/', authenticateToken, createTopic);
router.delete('/:id', authenticateToken, deleteTopic);

module.exports = router;