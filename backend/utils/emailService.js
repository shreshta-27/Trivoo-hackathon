import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendWelcomeEmail = async (userEmail, userName) => {
    const mailOptions = {
        from: `"Trivo Team" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: '🌱 Welcome to Trivo - Your Forest Guardian Journey Begins!',
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
                    }
                    .header {
                        background: linear-gradient(135deg, #2d5016 0%, #4a7c2c 100%);
                        color: white;
                        padding: 30px;
                        text-align: center;
                        border-radius: 10px 10px 0 0;
                    }
                    .header h1 {
                        margin: 0;
                        font-size: 28px;
                    }
                    .content {
                        background: #f9f9f9;
                        padding: 30px;
                        border-radius: 0 0 10px 10px;
                    }
                    .welcome-box {
                        background: white;
                        padding: 20px;
                        border-left: 4px solid #4a7c2c;
                        margin: 20px 0;
                        border-radius: 5px;
                    }
                    .feature {
                        background: white;
                        padding: 15px;
                        margin: 10px 0;
                        border-radius: 5px;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                    }
                    .feature h3 {
                        color: #4a7c2c;
                        margin-top: 0;
                    }
                    .cta-button {
                        display: inline-block;
                        background: #4a7c2c;
                        color: white;
                        padding: 12px 30px;
                        text-decoration: none;
                        border-radius: 5px;
                        margin: 20px 0;
                        font-weight: bold;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 30px;
                        padding-top: 20px;
                        border-top: 1px solid #ddd;
                        color: #666;
                        font-size: 14px;
                    }
                    .icon {
                        font-size: 24px;
                        margin-right: 10px;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>🌱 Welcome to Trivo!</h1>
                    <p>Adaptive Forest Risk & Decision Platform</p>
                </div>
                
                <div class="content">
                    <div class="welcome-box">
                        <h2>Hello ${userName}! 👋</h2>
                        <p>We're thrilled to have you join the Trivo community! You've just taken the first step towards smarter, data-driven reforestation management.</p>
                    </div>

                    <h2>What You Can Do With Trivo:</h2>

                    <div class="feature">
                        <h3><span class="icon">🗺️</span>Strategic Planning</h3>
                        <p>Use AI-backed ecological matching to plan projects before planting. Get species recommendations based on soil, climate, and location data.</p>
                    </div>

                    <div class="feature">
                        <h3><span class="icon">📊</span>Continuous Monitoring</h3>
                        <p>Track forest health over time using environmental signals and detect risks early with our intelligent alert system.</p>
                    </div>

                    <div class="feature">
                        <h3><span class="icon">⚠️</span>Risk Detection</h3>
                        <p>Get early warnings for drought, heat stress, fire risk, and human activity incidents affecting your projects.</p>
                    </div>

                    <div class="feature">
                        <h3><span class="icon">🎯</span>Smart Prioritization</h3>
                        <p>Optimize resource allocation with AI-driven recommendations on where to act for maximum impact.</p>
                    </div>

                    <div style="text-align: center; margin: 30px 0;">
                        <a href="http://localhost:3000" class="cta-button">Get Started →</a>
                    </div>

                    <div class="welcome-box">
                        <h3>Need Help?</h3>
                        <p>Our team is here to support you. If you have any questions or need assistance, don't hesitate to reach out.</p>
                        <p><strong>Email:</strong> ${process.env.EMAIL_USER}</p>
                    </div>
                </div>

                <div class="footer">
                    <p>This email was sent to ${userEmail} because you created a Trivo account.</p>
                    <p>© 2026 Trivo. All rights reserved.</p>
                    <p style="color: #4a7c2c; font-weight: bold;">🌳 Together, we grow stronger forests 🌳</p>
                </div>
            </body>
            </html>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Welcome email sent to ${userEmail}`);
        return { success: true };
    } catch (error) {
        console.error('❌ Email sending failed:', error.message);
        return { success: false, error: error.message };
    }
};

export default { sendWelcomeEmail };
