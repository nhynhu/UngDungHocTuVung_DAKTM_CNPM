const express = require('express');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { submitTest } = require('../controllers/resultController');
const router = express.Router();

router.post('/submit', authenticateToken, submitTest);



// GET /results/count?userId=xxx - Trả về số lượng bài test đã làm của user
router.get('/count', async (req, res) => {
    const userId = req.query.userId;
    if (!userId) return res.json({ count: 0 });
    try {
        const Result = require('../models/Result');
        const count = await Result.count({ where: { userId } });
        res.json({ count });
    } catch (err) {
        console.error('❌ Không lấy được số bài test:', err.message);
        res.json({ count: 0 });
    }
});

module.exports = router;