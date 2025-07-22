const express = require('express');
const router = express.Router();

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