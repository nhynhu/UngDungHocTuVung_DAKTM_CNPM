require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./models');
const Topic = require('./models/Topic');
const Word = require('./models/Word');
const topicRoutes = require('./routes/topicRoutes');
const wordRoutes = require('./routes/wordRoutes');

const app = express();
const PORT = process.env.PORT || 5005; // SỬA: 5505 -> 5005

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());

// Serve static files from uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/topics', topicRoutes);
app.use('/words', wordRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({
        service: 'topic-service',
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

// Define associations
Topic.hasMany(Word, {
    foreignKey: 'TopicId',
    as: 'words'
});

Word.belongsTo(Topic, {
    foreignKey: 'TopicId',
    as: 'topic'
});

// Database connection với retry logic
const connectDB = async () => {
    for (let i = 0; i < 10; i++) {
        try {
            await sequelize.authenticate();
            console.log('📚 Topic Service DB connected');

            await sequelize.sync({ alter: true });
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