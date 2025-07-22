require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./models');
const topicRoutes = require('./routes/topicRoutes');
const wordRoutes = require('./routes/wordRoutes');
const { Topic, Word } = require('./models');

const app = express();
// SỬA LỖI: Đảm bảo cổng luôn là 5005 nếu không có biến môi trường
const PORT = process.env.PORT || 5005;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());

// Serve static files from uploads
// SỬA LỖI: Đường dẫn đúng tới thư mục uploads trong container là 'uploads' (tương đối với /app)
app.use('/uploads', (req, res, next) => {
    console.log(`📁 Static file request: ${req.originalUrl}`);

    // Set MIME type cho SVG files
    if (req.path.endsWith('.svg') || req.path.endsWith('.jpg') || req.path.endsWith('.png')) {
        if (req.path.includes('.svg') || req.get('Accept')?.includes('image/svg')) {
            res.setHeader('Content-Type', 'image/svg+xml');
        } else {
            res.setHeader('Content-Type', 'image/jpeg');
        }
    }

    next();
}, express.static(path.join(__dirname, 'uploads')));

// Request logging
app.use((req, res, next) => {
    console.log(`📚 Topic Service: ${req.method} ${req.originalUrl}`);
    next();
});

// Routes
app.use('/', topicRoutes);  // SỬA LỖI: Đảm bảo có dòng này
app.use('/words', wordRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({
        service: 'topic-service',
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

// // Define associations - SỬA LỖI: Không tạo thêm TopicId vì đã có sẵn
// Topic.hasMany(Word, { foreignKey: 'TopicId', as: 'words' });
// Word.belongsTo(Topic, { foreignKey: 'TopicId', as: 'topic' });

// Database connection với retry logic
const connectDB = async () => {
    for (let i = 0; i < 10; i++) {
        try {
            await sequelize.authenticate();
            console.log('📚 Topic Service DB connected');

            // SỬA LỖI: Sử dụng { force: true } để reset database hoàn toàn
            await sequelize.sync({ force: true });
            console.log('📚 Topic Service DB synced');

            app.listen(PORT, () => {
                console.log(`📚 Topic Service running on port ${PORT}`);
            });
            return;
        } catch (error) {
            console.log(`❌ Topic Service DB connection attempt ${i + 1} failed:`, error.message);
            if (i < 9) {
                console.log('⏳ Retrying in 5 seconds...');
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }
    }
    console.error('❌ Topic Service failed to connect to database after 10 attempts');
    process.exit(1);
};

connectDB();

