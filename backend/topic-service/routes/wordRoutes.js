const express = require('express');
const router = express.Router();
const wordController = require('../controllers/wordController');

router.get('/topic/:topicId', wordController.getWordsByTopic);
router.get('/searchWords', wordController.searchWords);

module.exports = router;
