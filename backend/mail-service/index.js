require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mailRoutes = require('./routes/mailRoutes');

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());

app.use('/mail', mailRoutes);

app.get('/health', (req, res) => {
    res.json({
        service: 'mail-service',
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

app.use((error, req, res, next) => {
    console.error('Mail service error:', error);
    res.status(500).json({
        error: 'Internal server error',
        message: error.message
    });
});

app.listen(PORT, () => {
    console.log(`✉️  Mail Service running on port ${PORT}`);
});