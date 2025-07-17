const express = require('express');
const { authenticateToken } = require('../../middleware/authMiddleware');
const { submitTest } = require('../controllers/resultController');
const router = express.Router();

router.post('/', authenticateToken, submitTest);

module.exports = router;