const User = require('../models/User');

/**
 * Create a new user
 */
exports.createUser = async (req, res) => {
    try {
        const { email, password, fullname } = req.body;
        console.log('👤 Create user request received:', { email, fullname });

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email: email.toLowerCase().trim() } });
        if (existingUser) {
            console.warn(`⚠️ Attempt to create existing user: ${email}`);
            return res.status(409).json({ message: 'An account with this email already exists.' });
        }

        // Create new user
        const user = await User.create({
            email: email.toLowerCase().trim(),
            password, // Password đã được hash từ auth-service
            fullname
        });

        // SỬA LỖI: Trả về thông tin user vừa tạo
        res.status(201).json({
            id: user.id,
            email: user.email,
            fullname: user.fullname
        });

    } catch (error) {
        console.error('❌ Error creating user in DB:', error);
        res.status(500).json({ message: 'Failed to create user due to a server error.' });
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