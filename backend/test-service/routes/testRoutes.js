const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/authMiddleware');
const testController = require('../controllers/testController');

// Import ALL functions properly
const {
    getAllTests,
    getTest,
    submitTest,
} = require('../controllers/testController');

// Health check function
const healthCheck = (req, res) => {
    res.json({
        service: 'test-service-routes',
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
};

// ==================== ROUTES ====================

// SỬA LỖI: Route ROOT "/" để lấy tất cả tests (match với proxy path rewrite)
router.get('/tests', testController.getAllTests);
router.get('/tests/:testId', testController.getTest); // Đặt lên trước
router.post('/tests/submit', testController.submitTest); // Thêm dòng này
router.post('/submit', testController.submitTest); // Giữ lại để không ảnh hưởng chức năng cũ
router.get('/:topicId', authenticateToken, testController.getTest);

// Health check route
router.get('/health', healthCheck);

module.exports = router;