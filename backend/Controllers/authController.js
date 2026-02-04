import User from "../Models/userSchema.js";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { sendWelcomeEmail } from '../utils/emailService.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
    try {
        const { token } = req.body;

        // Verify Google Token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { name, email, picture, sub: googleId } = ticket.getPayload();

        // Check if user exists
        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name,
                email,
                googleId,
                avatar: picture,
                profession: 'manager',
                role: 'manager'
            });
            await sendWelcomeEmail(user.email, user.name);
        } else if (!user.googleId) {
            // Link Google account to existing user
            user.googleId = googleId;
            user.avatar = user.avatar || picture;
            await user.save();
        }

        // Generate JWT
        const jwtToken = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            success: true,
            user,
            token: jwtToken,
        });
    } catch (error) {
        console.error("Google Login Error:", error);
        res.status(500).json({ success: false, message: "Google Login Failed" });
    }
};
