const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// POST /users - Create user
router.post('/', userController.createUser);

// GET /users/email/:email - Get user by email
router.get('/email/:email', userController.getUserByEmail);

// GET /users/check-email/:email - Check if email exists
router.get('/check-email/:email', userController.checkEmailExists);

module.exports = router;