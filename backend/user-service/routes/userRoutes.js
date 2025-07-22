const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// POST /users - Create user
router.post('/', userController.createUser);

// GET /users/email/:email -> Route để auth-service gọi
router.get('/email/:email', userController.getUserByEmail);

// GET /users/check-email/:email - Check if email exists
router.get('/check-email/:email', userController.checkEmailExists);

// GET /users/:id/profile - Lấy profile user
router.get('/:id/profile', async (req, res) => {
    // Truyền id qua params, không cần xác thực cho demo
    const userController = require('../controllers/userController');
    req.user = { userId: req.params.id };
    await userController.getUserProfile(req, res);
});


// GET /users/:id/tests/count - Trả về số lượng bài test đã làm
router.get('/:id/tests/count', async (req, res) => {
    const userId = req.params.id;
    try {
        // Gọi test-service để lấy số lượng kết quả
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