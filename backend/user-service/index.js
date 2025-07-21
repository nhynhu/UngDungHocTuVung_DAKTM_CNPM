require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const userRoutes = require('./routes/userRoutes'); // ⬅️ SỬA: userRoutes không phải userRoute

const app = express();
const PORT = process.env.PORT || 5004;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());

// Routes
app.use('/users', userRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({
        service: 'user-service',
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

// Database connection
const connectDB = async () => {
    for (let i = 0; i < 10; i++) {
        try {
            await sequelize.authenticate();
            console.log('👤 User Service DB connected');

            await sequelize.sync({ alter: true });
            console.log('👤 User Service DB synced');

            app.listen(PORT, () => {
                console.log(`👤 User Service running on port ${PORT}`);
            });
            return;
        } catch (error) {
            console.log(`❌ User Service DB connection attempt ${i + 1} failed:`, error.message);
            if (i < 9) {
                console.log('⏳ Retrying in 5 seconds...');
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }
    }
    console.error('❌ User Service failed to connect to database after 10 attempts');
    process.exit(1);
};

connectDB();
