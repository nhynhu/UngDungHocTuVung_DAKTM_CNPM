const express = require('express');
const { authenticateToken, isAdmin } = require('../../middleware/authMiddleware');
const { createTest, generateQuestions } = require('../controllers/testController');
const router = express.Router();

router.post('/', authenticateToken, isAdmin, createTest);
router.get('/:id/questions', authenticateToken, generateQuestions);

module.exports = router;