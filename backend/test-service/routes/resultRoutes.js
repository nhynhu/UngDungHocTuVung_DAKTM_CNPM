const express = require('express');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { submitTest } = require('../controllers/resultController');
const router = express.Router();

router.post('/submit', authenticateToken, submitTest);


module.exports = router;