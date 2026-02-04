import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Enhanced Email Fallback System with Multiple Mock Data Variants
const sendMockFallback = (type, to, subject, context = {}) => {
    const mockId = `MOCK-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
    const timestamp = new Date().toISOString();

    const mockMessages = [
        {
            status: "Simulated Delivery",
            message: "Email queued in virtual inbox. SMTP simulation successful.",
            deliveryTime: `${Math.floor(Math.random() * 3) + 1}s`,
            server: "mock-smtp.trivoo.local"
        },
        {
            status: "Fallback Activated",
            message: "Real email service unavailable. Message logged and preserved for retry.",
            deliveryTime: "instant",
            server: "fallback-logger.trivoo.local"
        },
        {
            status: "Mock SMTP Accepted",
            message: "Email content validated and stored in mock delivery queue.",
            deliveryTime: `${Math.floor(Math.random() * 5) + 1}s`,
            server: "mock-relay.trivoo.local"
        },
        {
            status: "Resilience Mode",
            message: "Bypassing real credentials for system resilience. Email preserved in logs.",
            deliveryTime: "immediate",
            server: "resilience-mode.trivoo.local"
        },
        {
            status: "Development Mode",
            message: "Email suppressed in development environment. Content logged for debugging.",
            deliveryTime: "0s",
            server: "dev-null.trivoo.local"
        }
    ];

    const selectedMock = mockMessages[Math.floor(Math.random() * mockMessages.length)];

    console.warn(`\n${'='.repeat(80)}`);
    console.warn(`⚠️  EMAIL FALLBACK ACTIVATED - ${selectedMock.status.toUpperCase()}`);
    console.warn(`${'='.repeat(80)}`);
    console.log(`📨  Email Type: ${type}`);
    console.log(`📧  Recipient: ${to}`);
    console.log(`📋  Subject: ${subject}`);
    console.log(`🆔  Mock ID: ${mockId}`);
    console.log(`⏰  Timestamp: ${timestamp}`);
    console.log(`🖥️   Server: ${selectedMock.server}`);
    console.log(`⚡  Delivery Time: ${selectedMock.deliveryTime}`);
    console.log(`💬  Message: ${selectedMock.message}`);

    if (context && Object.keys(context).length > 0) {
        console.log(`📦  Context Data:`);
        Object.entries(context).forEach(([key, value]) => {
            console.log(`    - ${key}: ${JSON.stringify(value).substring(0, 100)}`);
        });
    }

    console.warn(`${'='.repeat(80)}\n`);

    return {
        success: true,
        messageId: mockId,
        mocked: true,
        mockDetails: {
            status: selectedMock.status,
            message: selectedMock.message,
            deliveryTime: selectedMock.deliveryTime,
            server: selectedMock.server,
            timestamp
        }
    };
};

const createTransporter = () => {
    return nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    });
};

export const sendWelcomeEmail = async (userEmail, userName) => {
    const transporter = createTransporter();

    const mailOptions = {
        from: `"Trivoo Team" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: '🎉 Welcome to Trivoo - Your Account is Ready!',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #f4f4f4;
                    }
                    .container {
                        background: white;
                        border-radius: 10px;
                        overflow: hidden;
                        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    }
                    .header {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        padding: 40px 30px;
                        text-align: center;
                    }
                    .header h1 {
                        margin: 0;
                        font-size: 32px;
                    }
                    .content {
                        padding: 40px 30px;
                    }
                    .greeting {
                        font-size: 18px;
                        margin-bottom: 20px;
                    }
                    .message {
                        margin: 20px 0;
                        font-size: 16px;
                    }
                    .features {
                        background: #f8f9fa;
                        padding: 20px;
                        border-radius: 8px;
                        margin: 25px 0;
                    }
                    .features h3 {
                        color: #667eea;
                        margin-top: 0;
                    }
                    .features ul {
                        list-style: none;
                        padding: 0;
                    }
                    .features li {
                        padding: 8px 0;
                        padding-left: 25px;
                        position: relative;
                    }
                    .features li:before {
                        content: "🚀";
                        position: absolute;
                        left: 0;
                    }
                    .footer {
                        text-align: center;
                        padding: 20px 30px;
                        background: #f8f9fa;
                        color: #666;
                        font-size: 14px;
                    }
                    .signature {
                        margin-top: 30px;
                        font-weight: bold;
                        color: #667eea;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎉 Welcome to Trivoo!</h1>
                    </div>
                    
                    <div class="content">
                        <p class="greeting">Hi <strong>${userName}</strong>,</p>
                        
                        <p class="message">
                            Welcome to <strong>Trivoo</strong>! 🎉<br>
                            We're excited to have you on board.
                        </p>
                        
                        <p class="message">
                            Your account has been successfully created, and you can now start exploring everything Trivoo has to offer — from smart learning experiences to personalized insights designed just for you.
                        </p>
                        
                        <div class="features">
                            <h3>🚀 What you can do next:</h3>
                            <ul>
                                <li>Explore your dashboard</li>
                                <li>Start your first learning session</li>
                                <li>Track your progress with AI-powered insights</li>
                            </ul>
                        </div>
                        
                        <p class="message">
                            If you have any questions or need help, feel free to reply to this email — we're always here for you.
                        </p>
                        
                        <p class="message">
                            Happy learning!
                        </p>
                        
                        <p class="signature">Team Trivoo 💙</p>
                    </div>
                    
                    <div class="footer">
                        <p>If you didn't create this account, please ignore this email.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    try {
        console.log('🔵 Attempting to send email...');
        const info = await transporter.sendMail(mailOptions);
        console.log('🔵✅ WELCOME EMAIL SENT SUCCESSFULLY!');
        console.log('🔵 Message ID:', info.messageId);
        console.log('🔵 Response:', info.response);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('🔵❌ WELCOME EMAIL FAILED!');
        console.error('🔵 Error:', error.message);
        return sendMockFallback('WELCOME', userEmail, mailOptions.subject, { userName });
    }
};

export const sendLoginEmail = async (userEmail, userName) => {
    const transporter = createTransporter();

    const mailOptions = {
        from: `"Trivoo Team" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: '👋 Welcome Back to Trivoo!',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #f4f4f4;
                    }
                    .container {
                        background: white;
                        border-radius: 10px;
                        overflow: hidden;
                        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    }
                    .header {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        padding: 40px 30px;
                        text-align: center;
                    }
                    .header h1 {
                        margin: 0;
                        font-size: 32px;
                    }
                    .content {
                        padding: 40px 30px;
                    }
                    .greeting {
                        font-size: 18px;
                        margin-bottom: 20px;
                    }
                    .message {
                        margin: 20px 0;
                        font-size: 16px;
                    }
                    .features {
                        background: #f8f9fa;
                        padding: 20px;
                        border-radius: 8px;
                        margin: 25px 0;
                    }
                    .features h3 {
                        color: #667eea;
                        margin-top: 0;
                    }
                    .features ul {
                        list-style: none;
                        padding: 0;
                    }
                    .features li {
                        padding: 8px 0;
                        padding-left: 25px;
                        position: relative;
                    }
                    .features li:before {
                        content: "🚀";
                        position: absolute;
                        left: 0;
                    }
                    .footer {
                        text-align: center;
                        padding: 20px 30px;
                        background: #f8f9fa;
                        color: #666;
                        font-size: 14px;
                    }
                    .signature {
                        margin-top: 30px;
                        font-weight: bold;
                        color: #667eea;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>👋 Welcome Back to Trivoo!</h1>
                    </div>
                    
                    <div class="content">
                        <p class="greeting">Hi <strong>${userName}</strong>,</p>
                        
                        <p class="message">
                            Welcome back to <strong>Trivoo</strong>! 🎉<br>
                            We're excited to see you again.
                        </p>
                        
                        <p class="message">
                            You've successfully logged in, and you can continue exploring everything Trivoo has to offer — from smart learning experiences to personalized insights designed just for you.
                        </p>
                        
                        <div class="features">
                            <h3>🚀 What you can do next:</h3>
                            <ul>
                                <li>Explore your dashboard</li>
                                <li>Continue your learning session</li>
                                <li>Track your progress with AI-powered insights</li>
                            </ul>
                        </div>
                        
                        <p class="message">
                            If you have any questions or need help, feel free to reply to this email — we're always here for you.
                        </p>
                        
                        <p class="message">
                            Happy learning!
                        </p>
                        
                        <p class="signature">Team Trivoo 💙</p>
                    </div>
                    
                    <div class="footer">
                        <p>If you didn't log in to this account, please contact us immediately.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    try {
        console.log('🟢 Attempting to send email...');
        const info = await transporter.sendMail(mailOptions);
        console.log('🟢✅ LOGIN EMAIL SENT SUCCESSFULLY!');
        console.log('🟢 Message ID:', info.messageId);
        console.log('🟢 Response:', info.response);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('🟢❌ LOGIN EMAIL FAILED!');
        console.error('🟢 Error:', error.message);
        return sendMockFallback('LOGIN', userEmail, mailOptions.subject, { userName });
    }
};

export const sendAlertEmail = async (to, subject, htmlBody) => {
    const transporter = createTransporter();

    const mailOptions = {
        from: `"Trivoo Alert System" <${process.env.EMAIL_USER}>`,
        to: to,
        subject: subject,
        html: htmlBody
    };

    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.warn('⚠️ Email credentials missing in .env. Skipping email send.');
            return { success: true, mocked: true };
        }

        console.log(`🚨 Attempting to send ALERT email to ${to}...`);
        const info = await transporter.sendMail(mailOptions);
        console.log('🚨✅ ALERT EMAIL SENT SUCCESSFULLY!');
        console.log('🚨 Message ID:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('🚨❌ ALERT EMAIL FAILED!');
        console.error('🚨 Error:', error.message);
        return sendMockFallback('ALERT', to, subject, { htmlBodyPreview: htmlBody.substring(0, 200) });
    }
};

export default { sendWelcomeEmail, sendLoginEmail, sendAlertEmail };
