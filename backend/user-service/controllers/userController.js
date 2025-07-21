const User = require('../models/User');

/**
 * Tạo user mới (từ auth-service sau verify)
 */
exports.createUser = async (req, res) => {
    try {
        const { email, password, fullname, isVerified } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' });
        }

        const user = await User.create({
            email,
            password,
            fullname,
            isVerified: isVerified || true
        });

        res.status(201).json({
            id: user.id,
            email: user.email,
            fullname: user.fullname,
            message: 'User created successfully'
        });
    } catch (err) {
        console.error('Create user error:', err);
        res.status(500).json({ error: err.message });
    }
};

/**
 * Check email exists
 */
exports.checkEmailExists = async (req, res) => {
    try {
        const user = await User.findOne({
            where: { email: req.params.email }
        });
        res.json({ exists: !!user });
    } catch (err) {
        console.error('Check email error:', err);
        res.status(500).json({ error: err.message });
    }
};

/**
 * Lấy user theo email (cho login)
 */
exports.getUserByEmail = async (req, res) => {
    try {
        const user = await User.findOne({
            where: { email: req.params.email },
            attributes: ['id', 'email', 'fullname', 'password', 'isVerified']
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error('Get user by email error:', err);
        res.status(500).json({ error: err.message });
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