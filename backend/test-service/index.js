require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

// Import routes
const testRoutes = require('./routes/testRoutes');

const app = express();
const PORT = process.env.PORT || 5006;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());

// Routes
app.use('/tests', testRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({
        service: 'test-service',
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

// Database connection
sequelize.authenticate()
    .then(() => {
        console.log('📊 Test Service DB connected');
        return sequelize.sync({ alter: true });
    })
    .then(() => {
        console.log('📊 Test Service DB synced');
        app.listen(PORT, () => {
            console.log(`📊 Test Service running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('❌ Test Service DB error:', err);
    });