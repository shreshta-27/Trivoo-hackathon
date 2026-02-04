import User from "../Models/userSchema.js";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { sendWelcomeEmail, sendLoginEmail } from '../utils/emailService.js';

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
                profession: 'System Admin'
            });
            try {
                await sendWelcomeEmail(user.email, user.name);
            } catch (emailError) {
                console.error(`Failed to send welcome email:`, emailError.message);
            }
        } else if (!user.googleId) {
            user.googleId = googleId;
            user.avatar = user.avatar || picture;
            await user.save();
        } else {
            try {
                await sendLoginEmail(user.email, user.name);
            } catch (emailError) {
                console.error(`Failed to send login email:`, emailError.message);
            }
        }

        const jwtToken = jwt.sign(
            { id: user._id, profession: user.profession },
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
