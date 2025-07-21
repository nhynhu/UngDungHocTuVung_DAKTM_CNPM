require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const Test = require('./models/Test');
const Question = require('./models/Question');
const Result = require('./models/Result');
const testRoutes = require('./routes/testRoutes');
const app = express();
const PORT = process.env.PORT || 5006;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
    console.log(`📊 Test Service: ${req.method} ${req.path}`);
    next();
});

// Health check for service itself
app.get('/health', (req, res) => {
    res.json({
        service: 'test-service',
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: 'connected'
    });
});

// Mount routes with proper path
app.use('/tests', testRoutes);

Test.hasMany(Question, { foreignKey: 'TestId', as: 'questions' });
Question.belongsTo(Test, { foreignKey: 'TestId', as: 'test' });
Test.hasMany(Result, { foreignKey: 'TestId', as: 'results' });
Result.belongsTo(Test, { foreignKey: 'TestId', as: 'test' });
// Error handling middleware
app.use((err, req, res, next) => {
    console.error('❌ Test Service Error:', err.message);
    console.error('Stack:', err.stack);

    if (!res.headersSent) {
        res.status(500).json({
            error: 'Internal server error',
            message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
        });
    }
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        path: req.originalUrl,
        service: 'test-service',
        availableRoutes: [
            'GET /health',
            'GET /tests/health',
            'GET /tests/user/history',
            'GET /tests/:topicId',
            'POST /tests/submit'
        ]
    });
});

// Database connection với retry logic
const connectDB = async () => {
    for (let i = 0; i < 10; i++) {
        try {
            await sequelize.authenticate();
            console.log('📊 Test Service DB connected');

            await sequelize.sync({ alter: true });
            console.log('📊 Test Service DB synced');

            app.listen(PORT, () => {
                console.log(`📊 Test Service running on port ${PORT}`);
                console.log(`📍 Routes: /tests/health, /tests/user/history, /tests/:topicId, /tests/submit`);
            });
            return;

        } catch (error) {
            console.log(`❌ Test Service DB connection attempt ${i + 1} failed:`, error.message);
            if (i < 9) {
                console.log('⏳ Retrying in 5 seconds...');
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }
    }
    console.error('❌ Test Service failed to connect to database after 10 attempts');
    process.exit(1);
};

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 Test Service shutting down...');
    sequelize.close();
    process.exit(0);
});

connectDB();