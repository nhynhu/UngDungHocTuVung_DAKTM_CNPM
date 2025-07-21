const express = require('express');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { submitTest, getUserResults } = require('../controllers/resultController');
const router = express.Router();

router.post('/submit', authenticateToken, submitTest);
router.get('/my-results', authenticateToken, getUserResults);

module.exports = router;