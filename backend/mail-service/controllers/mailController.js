const nodemailer = require('nodemailer');
const { getEmailTemplate } = require('../utils/emailTemplates');

// Cấu hình transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    }
});

/**
 * Send verification email with template
 */
exports.sendVerificationEmail = async (req, res) => {
    const { to, username, verificationLink } = req.body;

    try {
        if (!to || !username || !verificationLink) {
            return res.status(400).json({
                error: 'Missing required fields: to, username, verificationLink'
            });
        }

        const subject = `Verify Your Email Address - ${process.env.APP_NAME || 'English Learning App'}`;
        const html = getEmailTemplate('verification', {
            username,
            verificationLink,
            appName: process.env.APP_NAME || 'English Learning App'
        });

        const mailOptions = {
            from: {
                name: process.env.APP_NAME || 'English Learning App',
                address: process.env.EMAIL
            },
            to,
            subject,
            html
        };

        const result = await transporter.sendMail(mailOptions);

        res.json({
            message: 'Verification email sent successfully',
            messageId: result.messageId
        });
    } catch (error) {
        console.error('Send verification email error:', error);
        res.status(500).json({
            error: 'Failed to send verification email',
            details: error.message
        });
    }
};

/**
 * Send password reset email with template
 */
exports.sendPasswordResetEmail = async (req, res) => {
    const { to, username, resetLink, expireTime } = req.body;

    try {
        if (!to || !username || !resetLink) {
            return res.status(400).json({
                error: 'Missing required fields: to, username, resetLink'
            });
        }

        const subject = `Reset Your Password - ${process.env.APP_NAME || 'English Learning App'}`;
        const html = getEmailTemplate('passwordReset', {
            username,
            resetLink,
            expireTime: expireTime || '1 hour',
            appName: process.env.APP_NAME || 'English Learning App'
        });

        const mailOptions = {
            from: {
                name: process.env.APP_NAME || 'English Learning App',
                address: process.env.EMAIL
            },
            to,
            subject,
            html
        };

        const result = await transporter.sendMail(mailOptions);

        res.json({
            message: 'Password reset email sent successfully',
            messageId: result.messageId
        });
    } catch (error) {
        console.error('Send password reset email error:', error);
        res.status(500).json({
            error: 'Failed to send password reset email',
            details: error.message
        });
    }
};

/**
 * Test email connection
 */
exports.testConnection = async (req, res) => {
    try {
        await transporter.verify();
        res.json({
            message: 'Email connection successful',
            configured: !!process.env.EMAIL,
            service: 'gmail'
        });
    } catch (error) {
        res.status(500).json({
            error: 'Email connection failed',
            details: error.message
        });
    }
};

/**
 * Health check
 */
exports.healthCheck = (req, res) => {
    res.json({
        service: 'mail-service',
        status: 'healthy',
        timestamp: new Date().toISOString(),
        configured: !!process.env.EMAIL
    });
};