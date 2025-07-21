const User = require('../models/User');

/**
 * Tạo user mới (từ auth-service sau verify)
 */
exports.createUser = async (req, res) => {
    try {
        const { email, password, fullname, isVerified = false } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ error: 'Email already exists' });
        }

        const user = await User.create({
            email,
            password,
            fullname,
            isVerified
        });

        console.log('✅ User created:', user.email);

        res.status(201).json({
            id: user.id,
            email: user.email,
            fullname: user.fullname,
            isVerified: user.isVerified
        });
    } catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
};

/**
 * Lấy user theo email (cho login)
 */
exports.getUserByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Failed to get user' });
    }
};

/**
 * Check email exists
 */
exports.checkEmailExists = async (req, res) => {
    try {
        const { email } = req.params;
        const user = await User.findOne({ where: { email } });

        res.json({ exists: !!user });
    } catch (error) {
        console.error('Check email error:', error);
        res.status(500).json({ error: 'Failed to check email' });
    }
};

/**
 * Lấy profile user
 */
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.userId, {
            attributes: ['id', 'email', 'fullname', 'isVerified', 'createdAt']
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error('Get user profile error:', err);
        res.status(500).json({ error: err.message });
    }
};