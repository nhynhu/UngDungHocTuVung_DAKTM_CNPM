const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Chỉ cho phép user đã đăng nhập xem profile của mình
router.get('/:id', authenticateToken, userController.getUserById);

module.exports = router;