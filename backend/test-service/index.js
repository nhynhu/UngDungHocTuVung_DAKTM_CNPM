require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const Test = require('./models/Test');
const Question = require('./models/Question');
const Result = require('./models/Result');

const testRoutes = require('./routes/testRoutes');
const questionRoutes = require('./routes/questionRoutes');
const resultRoutes = require('./routes/resultRoutes');

const app = express();
const PORT = process.env.PORT || 5006;

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());

app.use((req, res, next) => {
    console.log(`📝 Test Service: ${req.method} ${req.originalUrl}`);
    next();
});

app.use('/', testRoutes);
app.use('/questions', questionRoutes);
app.use('/results', resultRoutes);

// Định nghĩa relationships
Test.hasMany(Question, {
    foreignKey: {
        name: 'TestId',
        allowNull: false
    },
    onDelete: 'CASCADE',
    as: 'questions'
});
Question.belongsTo(Test, {
    foreignKey: 'TestId',
    as: 'test'
});

Test.hasMany(Result, {
    foreignKey: {
        name: 'TestId',
        allowNull: false
    },
    onDelete: 'CASCADE',
    as: 'results'
});
Result.belongsTo(Test, {
    foreignKey: 'TestId',
    as: 'test'
});

// Health check
app.get('/health', (req, res) => {
    res.json({
        service: 'test-service',
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

// Database connection với retry logic
const connectDB = async () => {
    for (let i = 0; i < 10; i++) {
        try {
            await sequelize.authenticate();
            console.log('🧪 Test Service DB connected');

            await sequelize.sync({ force: true });
            console.log('🧪 Test Service DB synced');

            app.listen(PORT, () => {
                console.log(`🧪 Test Service running on port ${PORT}`);
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

connectDB();