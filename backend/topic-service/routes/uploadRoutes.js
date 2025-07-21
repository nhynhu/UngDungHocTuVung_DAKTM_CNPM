const express = require('express');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { uploadTopicImage, getAvailableImages } = require('../controllers/uploadController');
const router = express.Router();

router.post('/topic-image', authenticateToken, uploadTopicImage);
router.get('/images', getAvailableImages);

module.exports = router;