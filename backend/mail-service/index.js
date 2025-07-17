require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
app.use(express.json());

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL, pass: process.env.EMAIL_PASS }
});

app.post('/send', async (req, res) => {
    const { to, subject, text } = req.body;
    try {
        await transporter.sendMail({ from: process.env.EMAIL, to, subject, text });
        res.json({ message: 'Email sent' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to send email' });
    }
});

app.listen(5002, () => console.log('Mail service on port 5002'));