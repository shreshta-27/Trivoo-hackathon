import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/userSchema.js';

dotenv.config();

const fixGoogleIds = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Find users with null or empty googleId
        const users = await User.find({
            $or: [
                { googleId: null },
                { googleId: '' }
            ]
        });

        console.log(`Found ${users.length} users with invalid googleId`);

        for (const user of users) {
            // Unset googleId
            user.googleId = undefined;
            await user.save();
            console.log(`Fixed user: ${user.email}`);
        }

        console.log('Database cleanup complete');
        process.exit(0);
    } catch (error) {
        console.error('Error fixing DB:', error);
        process.exit(1);
    }
};

fixGoogleIds();
