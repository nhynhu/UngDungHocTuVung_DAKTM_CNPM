const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validateRegister = require('../middlewares/validateRegister');

router.post('/google-login', authController.googleLogin);
router.post('/register', validateRegister, authController.register);
router.post('/verify', authController.verify);

module.exports = router;