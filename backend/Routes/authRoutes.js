import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { googleLogin } from '../Controllers/authController.js';

const router = express.Router();

// Client-side Google OAuth (existing)
router.post('/google', googleLogin);

// Server-side Google OAuth - Initiates login
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// Google OAuth callback
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        const token = jwt.sign(
            { id: req.user._id, role: req.user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Login Successful</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    }
                    .container {
                        background: white;
                        padding: 40px;
                        border-radius: 12px;
                        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                        text-align: center;
                        max-width: 500px;
                    }
                    h1 { color: #28a745; margin-bottom: 20px; }
                    .user-info {
                        background: #f8f9fa;
                        padding: 20px;
                        border-radius: 8px;
                        margin: 20px 0;
                        text-align: left;
                    }
                    .user-info p { margin: 10px 0; }
                    .token {
                        background: #e7f3ff;
                        padding: 15px;
                        border-radius: 8px;
                        word-break: break-all;
                        font-family: monospace;
                        font-size: 12px;
                        margin: 20px 0;
                    }
                    .success { color: #28a745; font-size: 48px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="success">✅</div>
                    <h1>Google Login Successful!</h1>
                    <div class="user-info">
                        <p><strong>Name:</strong> ${req.user.name}</p>
                        <p><strong>Email:</strong> ${req.user.email}</p>
                        <p><strong>Role:</strong> ${req.user.role}</p>
                        <p><strong>Profession:</strong> ${req.user.profession}</p>
                        <p><strong>Google ID:</strong> ${req.user.googleId}</p>
                    </div>
                    <p><strong>JWT Token:</strong></p>
                    <div class="token">${token}</div>
                    <p style="color: #28a745; font-weight: bold;">✅ User saved to MongoDB database!</p>
                </div>
            </body>
            </html>
        `);
    }
);

export default router;
