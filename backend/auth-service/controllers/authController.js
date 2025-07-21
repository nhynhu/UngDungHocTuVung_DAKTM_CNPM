const jwt = require('jsonwebtoken');
const axios = require('axios');
const bcrypt = require('bcryptjs');

/**
 * Register - gửi email verification
 */
exports.register = async (req, res) => {
    const { email, password, fullname } = req.body;

    try {
        // Check if user exists
        try {
            const userServiceUrl = process.env.USER_SERVICE_URL || 'http://user-service:5004';
            const existingUser = await axios.get(`${userServiceUrl}/users/check-email/${email}`);
            if (existingUser.data.exists) {
                return res.status(409).json({ error: 'Email already registered' });
            }
        } catch (error) {
            // Email doesn't exist, continue
        }

        const token = jwt.sign(
            { email, password, fullname },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: process.env.JWT_EXPIRE || '15m' }
        );

        const verifyLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${token}`;

        // Send verification email
        const mailServiceUrl = process.env.MAIL_SERVICE_URL || 'http://mail-service:5002';
        await axios.post(`${mailServiceUrl}/send-verification`, {
            to: email,
            username: fullname,
            verificationLink: verifyLink
        });

        res.json({
            message: 'Verification email sent to ' + email,
            email: email
        });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ error: 'Registration failed' });
    }
};

/**
 * Verify email và tạo user
 */
exports.verify = async (req, res) => {
    const { token } = req.body;

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        const hashedPassword = await bcrypt.hash(payload.password, parseInt(process.env.BCRYPT_ROUNDS) || 10);

        // Create user
        const userServiceUrl = process.env.USER_SERVICE_URL || 'http://user-service:5004';
        await axios.post(`${userServiceUrl}/users`, {
            email: payload.email,
            password: hashedPassword,
            fullname: payload.fullname,
            isVerified: true
        });

        res.json({ message: 'Account verified and created successfully' });
    } catch (err) {
        console.error('Verify error:', err);
        res.status(400).json({ error: 'Invalid or expired verification token' });
    }
};

/**
 * Login
 */
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const userServiceUrl = process.env.USER_SERVICE_URL || 'http://user-service:5004';
        const response = await axios.get(`${userServiceUrl}/users/by-email/${email}`);
        const user = response.data;

        if (!user) return res.status(404).json({ error: 'User not found' });
        if (!user.isVerified) return res.status(403).json({ error: 'Please verify your email first' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid password' });

        const token = jwt.sign(
            { id: user.id, email: user.email, fullname: user.fullname },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: process.env.JWT_EXPIRE || '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                fullname: user.fullname
            },
            message: 'Login successful'
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Login failed' });
    }
};

exports.healthCheck = (req, res) => {
    res.json({
        service: 'auth-service',
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
};
