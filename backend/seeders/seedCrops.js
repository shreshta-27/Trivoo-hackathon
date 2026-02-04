import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Crop from '../Models/Crop.js';
import { cropsData } from './cropSeedData.js';
import connectDB from '../Config/db.js';

dotenv.config();

const seedCrops = async () => {
    try {
        await connectDB();

        console.log('Clearing existing crops...');
        await Crop.deleteMany({});

        console.log('Seeding crops data...');
        const crops = await Crop.insertMany(cropsData);

        console.log(`✅ Successfully seeded ${crops.length} crops`);
        console.log('Crops seeded:', crops.map(c => c.name).join(', '));

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding crops:', error);
        process.exit(1);
    }
};

seedCrops();
