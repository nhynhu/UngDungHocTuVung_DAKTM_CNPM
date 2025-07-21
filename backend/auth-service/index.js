require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes'); // SỬA: authRoutes thay vì userRoutes

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());

// Routes
app.use('/auth', authRoutes); // SỬA: /auth thay vì /users

// Health check
app.get('/health', (req, res) => {
    res.json({
        service: 'auth-service',
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log(`🔐 Auth Service running on port ${PORT}`);
});