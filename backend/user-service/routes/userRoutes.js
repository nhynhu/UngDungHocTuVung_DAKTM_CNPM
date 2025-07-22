const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/', userController.createUser);
router.get('/email/:email', userController.getUserByEmail);

router.get('/:id/tests/count', async (req, res) => {
    const userId = req.params.id;
    try {
        const axios = require('axios');
        const TEST_SERVICE_URL = process.env.TEST_SERVICE_URL || 'http://test-service:5003';
        const response = await axios.get(`${TEST_SERVICE_URL}/results/count?userId=${userId}`, { timeout: 10000 });
        const count = response.data?.count ?? 0;
        res.json({ count });
    } catch (err) {
        console.error('❌ Không lấy được số bài test đã làm:', err.message);
        res.json({ count: 0 });
    }
});

module.exports = router;