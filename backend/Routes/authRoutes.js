import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { googleLogin } from '../Controllers/authController.js';

const router = express.Router();

router.post('/google', googleLogin);

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        const token = jwt.sign(
            { id: req.user._id, role: req.user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        // Redirect to frontend dashboard with token
        res.redirect(`http://localhost:3000/dashboard?token=${token}`);
    }
);

export default router;