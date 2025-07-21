const jwt = require('jsonwebtoken');
const axios = require('axios');
const bcrypt = require('bcryptjs');

/**
 * Register - BYPASS EMAIL VERIFICATION
 */
exports.register = async (req, res) => {
    const { email, password, fullname } = req.body;

    try {
        console.log('📝 Registration request:', { email, fullname });

        // Validation
        if (!email || !password || !fullname) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user directly (bypass email verification)
        const userServiceUrl = process.env.USER_SERVICE_URL || 'http://user-service:5004';

        const response = await axios.post(`${userServiceUrl}/users`, {
            email,
            password: hashedPassword,
            fullname,
            isVerified: true  // Skip email verification
        }, {
            timeout: 10000
        });

        console.log('✅ User created successfully:', response.data);

        res.json({
            message: 'Account created successfully! You can now login.',
            email: email,
            user: {
                id: response.data.id,
                email: response.data.email,
                fullname: response.data.fullname
            }
        });

    } catch (err) {
        console.error('❌ Register error:', err.message);

        if (err.response?.status === 409) {
            return res.status(409).json({ error: 'Email already exists' });
        }

        res.status(500).json({
            error: 'Registration failed: ' + err.message
        });
    }
};

/**
 * Login
 */
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const userServiceUrl = process.env.USER_SERVICE_URL || 'http://user-service:5004';
        const response = await axios.get(`${userServiceUrl}/users/email/${email}`);
        const user = response.data;

        if (!user) return res.status(404).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid password' });

        const token = jwt.sign(
            { id: user.id, email: user.email, fullname: user.fullname },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '24h' }
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

/**
 * Verify - placeholder
 */
exports.verify = async (req, res) => {
    res.json({ message: 'Verification not implemented' });
};

/**
 * Health check
 */
exports.healthCheck = (req, res) => {
    res.json({
        service: 'auth-service',
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
};
