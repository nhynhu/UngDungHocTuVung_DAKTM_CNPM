const jwt = require('jsonwebtoken');
const axios = require('axios');
const axiosInstance = axios.create();

exports.googleLogin = async (req, res) => {
    const { token } = req.body;
    try {
        const response = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
        const user = { email: response.data.email, name: response.data.name };
        const jwtToken = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token: jwtToken });
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

exports.register = async (req, res) => {
    const { username, fullname, email, password } = req.body;
    const token = jwt.sign({ username, fullname, email, password }, process.env.JWT_SECRET, { expiresIn: '15m' });
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
        await axiosInstance.post('http://user-service:5004/users', {
            username: payload.username,
            fullname: payload.fullname,
            email: payload.email,
            password: payload.password,
            isVerified: true
        });
        res.json({ message: 'Account verified and created' });
    } catch (err) {
        res.status(400).json({ error: 'Invalid or expired token' });
    }
};
