import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../Models/userSchema.js';
import { sendWelcomeEmail, sendLoginEmail } from '../utils/emailService.js';

export const configurePassport = () => {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/api/auth/google/callback"
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails[0].value;
                const name = profile.displayName;
                const googleId = profile.id;
                const avatar = profile.photos[0]?.value || '';

                let user = await User.findOne({ email });

                if (!user) {
                    user = await User.create({
                        name,
                        email,
                        googleId,
                        avatar,
                        profession: 'manager',
                        role: 'manager'
                    });
                    try {
                        await sendWelcomeEmail(user.email, user.name);
                    } catch (emailError) {
                        console.error(`❌ Failed to send welcome email to ${user.email}:`, emailError.message);
                    }
                } else if (!user.googleId) {
                    user.googleId = googleId;
                    user.avatar = user.avatar || avatar;
                    await user.save();
                } else {
                    try {
                        await sendLoginEmail(user.email, user.name);
                    } catch (emailError) {
                        console.error(`Failed to send login email:`, emailError.message);
                    }
                }

                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    });
};

export default passport;
