const express = require('express');
const router = express.Router();
const mailController = require('../controllers/mailController');


router.post('/send-verification', mailController.sendVerificationEmail);
module.exports = router;