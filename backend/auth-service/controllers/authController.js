const axios = require('axios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://user-service:5004';

/**
 * Register user
 */
exports.register = async (req, res) => {
    const { email, password, fullname } = req.body;
    console.log('📝 Registration attempt:', { email });

    try {
        // Validation
        if (!email || !password || !fullname) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Gọi user-service để tạo user
        const response = await axios.post(
            `${USER_SERVICE_URL}/users`,
            { email: email.toLowerCase().trim(), password: hashedPassword, fullname: fullname.trim() },
            { timeout: 10000 }
        );

        // Lấy dữ liệu đúng từ response.data (không cần .user)
        const userData = response.data;

        if (!userData || !userData.id || !userData.email) {
            // Nếu user-service trả về dữ liệu không hợp lệ
            console.error('❌ Invalid user data from user-service:', response.data);
            return res.status(500).json({ message: 'User service returned invalid data.' });
        }

        console.log('✅ User created via user-service:', userData.email);
        return res.status(201).json({
            message: 'Registration successful',
            user: {
                id: userData.id,
                email: userData.email,
                fullname: userData.fullname
            }
        });

    } catch (error) {
        console.error('❌ Registration Error:', error.message);

        // Nếu user-service trả lỗi (ví dụ 409)
        if (error.response) {
            return res
                .status(error.response.status)
                .json({ message: error.response.data.message || 'Registration failed.' });
        }

        // Nếu không kết nối được hoặc timeout
        if (error.code === 'ECONNABORTED' || error.code === 'ECONNREFUSED') {
            return res.status(503).json({ message: 'User service unavailable. Please try again later.' });
        }

        // Lỗi khác
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Login user
 */
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log('🔐 Login attempt:', { email });

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }

        // Get user from user-service
        const userResponse = await axios.get(`${USER_SERVICE_URL}/users/email/${email.toLowerCase().trim()}`, {
            timeout: 15000,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const user = userResponse.data;

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('❌ Password mismatch for:', email);
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate JWT token
        const payload = {
            id: user.id,
            email: user.email,
            fullname: user.fullname
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET || 'fallback-secret',
            { expiresIn: process.env.JWT_EXPIRE || '1d' }
        );

        // Remove password from response
        delete user.password;


        // Lấy số bài test đã làm từ user-service
        let testsTaken = 0;
        try {
            const testsRes = await axios.get(`${USER_SERVICE_URL}/users/${user.id}/tests/count`, { timeout: 10000 });
            testsTaken = testsRes.data?.count ?? 0;
        } catch (err) {
            console.error('❌ Không lấy được số bài test đã làm:', err.message);
        }

        // Trả về đầy đủ thông tin user cho FE
        const userInfo = {
            id: user.id,
            email: user.email,
            fullname: user.fullname,
            isVerified: user.isVerified ?? false,
            createdAt: user.createdAt ?? null,
            testsTaken
        };

        console.log('✅ Login successful:', { email });
        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: userInfo
        });

    } catch (error) {
        console.error('❌ Login error:', error.message);

        // Handle different error types
        if (error.code === 'ECONNREFUSED') {
            return res.status(503).json({
                success: false,
                message: 'User service unavailable'
            });
        }

        if (error.response?.status === 404) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Login failed. Please try again.'
        });
    }
};

/**
 * Health check
 */
exports.healthCheck = (req, res) => {
    res.json({
        service: 'auth-service',
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
};
