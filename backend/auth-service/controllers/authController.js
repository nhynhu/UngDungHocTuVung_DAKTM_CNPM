const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://user-service:5004';

exports.register = async (req, res) => {
    const { email, password, fullname } = req.body;
    console.log('📝 Registration attempt:', { email });

    try {
        if (!email || !password || !fullname) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        // Tạo user qua user-service
        const response = await axios.post(
            `${USER_SERVICE_URL}/users`,
            { email: email.toLowerCase().trim(), password: hashedPassword, fullname: fullname.trim(), isVerified: false },
            { timeout: 10000 }
        );

        const userData = response.data;

        if (!userData || !userData.id || !userData.email) {
            console.error('❌ Invalid user data from user-service:', response.data);
            return res.status(500).json({ message: 'User service returned invalid data.' });
        }

        // Tạo token xác thực
        const token = jwt.sign({ email: userData.email }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '15m' });
        const verificationLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify?token=${token}`;

        // Gọi mail-service gửi mail xác thực
        await axios.post(
            `${process.env.MAIL_SERVICE_URL}/mail/send-verification`,
            { to: userData.email, username: fullname, verificationLink },
            { timeout: 10000 }
        );

        console.log('✅ User created via user-service:', userData.email);
        return res.status(201).json({
            message: 'Registration successful. Please check your email to verify your account.',
            user: {
                id: userData.id,
                email: userData.email,
                fullname: userData.fullname
            }
        });

    } catch (error) {
        console.error('❌ Registration Error:', error.message);

        if (error.response) {
            return res
                .status(error.response.status)
                .json({ message: error.response.data.message || 'Registration failed.' });
        }

        if (error.code === 'ECONNABORTED' || error.code === 'ECONNREFUSED') {
            return res.status(503).json({ message: 'User service unavailable. Please try again later.' });
        }

        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log('🔐 Login attempt:', { email });

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }

        const userResponse = await axios.get(`${USER_SERVICE_URL}/users/email/${email.toLowerCase().trim()}`, {
            timeout: 15000,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const user = userResponse.data;

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('❌ Password mismatch for:', email);
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

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

        delete user.password;

        let testsTaken = 0;
        try {
            const testsRes = await axios.get(`${USER_SERVICE_URL}/users/${user.id}/tests/count`, { timeout: 10000 });
            testsTaken = testsRes.data?.count ?? 0;
        } catch (err) {
            console.error('❌ Không lấy được số bài test đã làm:', err.message);
        }

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

exports.verifyEmail = async (req, res) => {
    const { token } = req.body;
    console.log('🔑 Token nhận được:', token);
    console.log('🔑 JWT_SECRET đang dùng:', process.env.JWT_SECRET);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const email = decoded.email;
        await axios.put(process.env.USER_SERVICE_URL + `/users/email/${encodeURIComponent(email)}/verify`, {
            isVerified: true
        });
        res.json({ message: 'Email verified successfully!' });
    } catch (error) {
        console.error('❌ Lỗi verify:', error.message);
        res.status(400).json({ message: 'Invalid or expired token.' });
    }
};

exports.healthCheck = (req, res) => {
    res.json({
        service: 'auth-service',
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const userRes = await axios.get(`${process.env.USER_SERVICE_URL}/users/email/${encodeURIComponent(email)}`);
    const user = userRes.data;
    if (!user) return res.status(404).json({ message: 'User not found' });

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;

    await axios.post(`${process.env.MAIL_SERVICE_URL}/mail/send-password-reset`, {
        to: email,
        username: user.fullname,
        resetLink
    });

    res.json({ message: 'Password reset email sent. Please check your inbox.' });
};

exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ message: 'Missing token or new password' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const email = decoded.email;
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        await axios.put(`${process.env.USER_SERVICE_URL}/users/email/${encodeURIComponent(email)}/reset-password`, {
            password: hashedPassword
        });

        res.json({ message: 'Password reset successful!' });
    } catch (err) {
        res.status(400).json({ message: 'Invalid or expired token.' });
    }
};
