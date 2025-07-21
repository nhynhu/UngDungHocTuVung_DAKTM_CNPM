const express = require('express');
const router = express.Router();
const { createUser, getUserByEmail, getUserProfile, checkEmailExists } = require('../controllers/userController');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Auth routes (không cần token)
router.post('/', createUser); // Tạo user khi verify
router.get('/email/:email', getUserByEmail); // SỬA: /email/:email thay vì /by-email/:email
router.get('/check-email/:email', checkEmailExists); // Register cần

// Protected routes (cần token)
router.get('/profile', authenticateToken, getUserProfile);

module.exports = router;