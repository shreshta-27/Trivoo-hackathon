import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const fixGoogleIdIndex = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const db = mongoose.connection.db;
        const usersCollection = db.collection('users');

        // Drop the existing googleId index
        try {
            await usersCollection.dropIndex('googleId_1');
            console.log('Dropped existing googleId_1 index');
        } catch (error) {
            console.log('Index googleId_1 does not exist or already dropped');
        }

        // Create a new sparse unique index
        await usersCollection.createIndex(
            { googleId: 1 },
            { unique: true, sparse: true }
        );
        console.log('Created new sparse unique index on googleId');

        // Clean up any users with null or empty googleId
        const result = await usersCollection.updateMany(
            { $or: [{ googleId: null }, { googleId: '' }] },
            { $unset: { googleId: '' } }
        );
        console.log(`Cleaned up ${result.modifiedCount} users with invalid googleId`);

        console.log('Database fix complete!');
        process.exit(0);
    } catch (error) {
        console.error('Error fixing database:', error);
        process.exit(1);
    }
};

fixGoogleIdIndex();
