const User = require('../models/User');

exports.createUser = async (req, res) => {
    try {
        const { email, password, fullname } = req.body;
        console.log('👤 Create user request received:', { email, fullname });

        const existingUser = await User.findOne({ where: { email: email.toLowerCase().trim() } });
        if (existingUser) {
            console.warn(`⚠️ Attempt to create existing user: ${email}`);
            return res.status(409).json({ message: 'An account with this email already exists.' });
        }

        const user = await User.create({
            email: email.toLowerCase().trim(),
            password,
            fullname
        });

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
exports.verifyEmail = async (req, res) => {
    const email = req.params.email;
    console.log('🔎 Xác thực email:', email);
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            console.warn('❌ Không tìm thấy user:', email);
            return res.status(404).json({ message: 'User not found' });
        }
        user.isVerified = true;
        await user.save();
        res.json({ message: 'User verified!' });
    } catch (err) {
        console.error('❌ Lỗi xác thực:', err);
        res.status(500).json({ message: 'Verification failed.' });
    }
};

exports.resetPassword = async (req, res) => {
    const email = req.params.email;
    const { password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ message: 'User not found' });
        user.password = password;
        await user.save();
        res.json({ message: 'Password updated!' });
    } catch (err) {
        res.status(500).json({ message: 'Password update failed.' });
    }
};
