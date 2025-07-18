const jwt = require('jsonwebtoken');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const axiosInstance = axios.create();

exports.register = async (req, res) => {
    const { username, password, fullname, email } = req.body;
    const token = jwt.sign({ username, password, fullname, email }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const verifyLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    try {
        await axiosInstance.post('http://mail-service:5002/send', {
            to: email,
            subject: 'Email Verification',
            text: `Click here to verify your email: ${verifyLink}`
        });
        res.json({ message: 'Verification email sent' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to send verification email' });
    }
};

exports.verify = async (req, res) => {
    const { token } = req.body;
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const hashedPassword = await bcrypt.hash(payload.password, 10);
        await axiosInstance.post('http://user-service:5004/users', {
            username: payload.username,
            password: hashedPassword,
            fullname: payload.fullname,
            email: payload.email,
            isVerified: true
        });
        res.json({ message: 'Account verified and created' });
    } catch (err) {
        res.status(400).json({ error: 'Invalid or expired token' });
    }
};
exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const response = await axiosInstance.get(`http://user-service:5004/users/by-username/${username}`);
        const user = response.data;
        if (!user) return res.status(404).json({ error: 'User not found' });
        if (!user.isVerified) return res.status(403).json({ error: 'Account not verified' });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid password' });
        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};