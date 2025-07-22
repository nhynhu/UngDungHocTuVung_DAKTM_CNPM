const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { User } = require('../models');

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

router.put('/email/:email/verify', async (req, res) => {
    const email = req.params.email;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ message: 'User not found' });
        user.isVerified = true;
        await user.save();
        res.json({ message: 'User verified!' });
    } catch (err) {
        res.status(500).json({ message: 'Verification failed.' });
    }
});

module.exports = router;