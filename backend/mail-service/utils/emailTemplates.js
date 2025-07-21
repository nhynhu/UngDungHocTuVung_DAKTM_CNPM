const templates = {
    verification: ({ username, verificationLink, appName }) => `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Verify Your Email</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; }
                .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
                .header { text-align: center; color: #333; }
                .button { display: inline-block; padding: 12px 30px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Welcome to ${appName}!</h1>
                </div>
                
                <p>Hi ${username},</p>
                
                <p>Thank you for signing up for ${appName}. To complete your registration, please verify your email address by clicking the button below:</p>
                
                <div style="text-align: center;">
                    <a href="${verificationLink}" class="button">Verify Email Address</a>
                </div>
                
                <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #007bff;">${verificationLink}</p>
                
                <p><strong>This verification link will expire in 15 minutes.</strong></p>
                
                <div class="footer">
                    <p>If you didn't create an account with ${appName}, please ignore this email.</p>
                    <p>Best regards,<br>The ${appName} Team</p>
                </div>
            </div>
        </body>
        </html>
    `,

    passwordReset: ({ username, resetLink, expireTime, appName }) => `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Reset Your Password</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; }
                .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
                .header { text-align: center; color: #333; }
                .button { display: inline-block; padding: 12px 30px; background: #dc3545; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
                .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Password Reset Request</h1>
                </div>
                
                <p>Hi ${username},</p>
                
                <p>We received a request to reset your password for your ${appName} account. If you made this request, click the button below to reset your password:</p>
                
                <div style="text-align: center;">
                    <a href="${resetLink}" class="button">Reset Password</a>
                </div>
                
                <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #dc3545;">${resetLink}</p>
                
                <div class="warning">
                    <p><strong>⚠️ Security Notice:</strong></p>
                    <ul>
                        <li>This reset link will expire in ${expireTime}</li>
                        <li>For security reasons, you can only use this link once</li>
                        <li>If you didn't request this reset, please ignore this email</li>
                    </ul>
                </div>
                
                <div class="footer">
                    <p>If you didn't request a password reset, your account is still secure and no action is needed.</p>
                    <p>Best regards,<br>The ${appName} Team</p>
                </div>
            </div>
        </body>
        </html>
    `,

    welcome: ({ username }) => `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Welcome to English Learning App</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #2196F3; color: white; text-align: center; padding: 20px; }
                .content { padding: 20px; background: #f9f9f9; }
                .feature { background: white; margin: 10px 0; padding: 15px; border-radius: 5px; }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎉 Welcome ${username}!</h1>
                </div>
                <div class="content">
                    <h2>Your English Learning Journey Starts Now!</h2>
                    <p>Welcome to our English Learning App! We're excited to help you improve your English skills.</p>
                    
                    <div class="feature">
                        <h3>📚 Learn Vocabulary</h3>
                        <p>Explore thousands of words organized by topics</p>
                    </div>
                    
                    <div class="feature">
                        <h3>🃏 Practice with Flashcards</h3>
                        <p>Interactive flashcards to help you memorize words</p>
                    </div>
                    
                    <div class="feature">
                        <h3>🧪 Take Tests</h3>
                        <p>Test your knowledge and track your progress</p>
                    </div>
                    
                    <p>Ready to start learning? Log in to your account and begin your journey!</p>
                </div>
                <div class="footer">
                    <p>© 2025 English Learning App. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `
};

exports.getEmailTemplate = (type, data) => {
    switch (type) {
        case 'verification':
            return getVerificationEmailTemplate(data);
        case 'passwordReset':
            return getPasswordResetEmailTemplate(data);
        default:
            throw new Error(`Unknown email template type: ${type}`);
    }
};

function getVerificationEmailTemplate({ username, verificationLink, appName }) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Verify Your Email</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
            .header { text-align: center; color: #333; }
            .button { display: inline-block; padding: 12px 30px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Welcome to ${appName}!</h1>
            </div>
            
            <p>Hi ${username},</p>
            
            <p>Thank you for signing up for ${appName}. To complete your registration, please verify your email address by clicking the button below:</p>
            
            <div style="text-align: center;">
                <a href="${verificationLink}" class="button">Verify Email Address</a>
            </div>
            
            <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #007bff;">${verificationLink}</p>
            
            <p><strong>This verification link will expire in 15 minutes.</strong></p>
            
            <div class="footer">
                <p>If you didn't create an account with ${appName}, please ignore this email.</p>
                <p>Best regards,<br>The ${appName} Team</p>
            </div>
        </div>
    </body>
    </html>
    `;
}

function getPasswordResetEmailTemplate({ username, resetLink, expireTime, appName }) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Reset Your Password</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
            .header { text-align: center; color: #333; }
            .button { display: inline-block; padding: 12px 30px; background: #dc3545; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Password Reset Request</h1>
            </div>
            
            <p>Hi ${username},</p>
            
            <p>We received a request to reset your password for your ${appName} account. If you made this request, click the button below to reset your password:</p>
            
            <div style="text-align: center;">
                <a href="${resetLink}" class="button">Reset Password</a>
            </div>
            
            <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #dc3545;">${resetLink}</p>
            
            <div class="warning">
                <p><strong>⚠️ Security Notice:</strong></p>
                <ul>
                    <li>This reset link will expire in ${expireTime}</li>
                    <li>For security reasons, you can only use this link once</li>
                    <li>If you didn't request this reset, please ignore this email</li>
                </ul>
            </div>
            
            <div class="footer">
                <p>If you didn't request a password reset, your account is still secure and no action is needed.</p>
                <p>Best regards,<br>The ${appName} Team</p>
            </div>
        </div>
    </body>
    </html>
    `;
}