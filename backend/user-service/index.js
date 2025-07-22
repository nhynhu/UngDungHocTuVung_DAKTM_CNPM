require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const userRoutes = require('./routes/userRoutes');

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

// SỬA LỖI: Tách logic kết nối và khởi động server
const startServer = () => {
    app.listen(PORT, () => {
        console.log(`✅ User Service is ready and listening on port ${PORT}`);
    });
};

const connectWithRetry = async (retries = 5, delay = 5000) => {
    while (retries > 0) {
        try {
            console.log('👤 Attempting to connect to User Service DB...');
            await sequelize.authenticate();
            console.log('✅ DB Authenticated successfully.');

            console.log('🔄 Syncing database models...');
            await sequelize.sync({ alter: true }); // Dùng alter để không mất dữ liệu
            console.log('✅ Database synced successfully.');

            startServer(); // Chỉ khởi động server sau khi mọi thứ sẵn sàng
            return;
        } catch (err) {
            retries--;
            console.error(`❌ DB connection failed. ${retries} retries left.`, err.message);
            if (retries === 0) {
                console.error('❌ Could not connect to the database after multiple retries. Exiting.');
                process.exit(1);
            }
            await new Promise(res => setTimeout(res, delay));
        }
    }
};

// Bắt đầu quá trình kết nối
connectWithRetry();
