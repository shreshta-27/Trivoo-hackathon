/**
 * Map Data Seeder
 * Populates database with demo regions, projects, and environmental data
 * Run with: node seeders/mapSeeder.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Region from '../Models/Region.js';
import Project from '../Models/Project.js';
import EnvironmentalData from '../Models/EnvironmentalData.js';
import User from '../Models/userSchema.js';

dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✓ MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

// Sample regions data
const regionsData = [
    {
        name: 'Nashik Zone',
        coordinates: {
            type: 'Polygon',
            coordinates: [[
                [73.7, 19.9],
                [74.0, 19.9],
                [74.0, 20.2],
                [73.7, 20.2],
                [73.7, 19.9]
            ]]
        },
        metadata: {
            totalArea: 5000,
            averageRainfall: 1200,
            climateZone: 'subtropical'
        }
    },
    {
        name: 'Western Ghats',
        coordinates: {
            type: 'Polygon',
            coordinates: [[
                [73.5, 15.0],
                [74.5, 15.0],
                [74.5, 16.0],
                [73.5, 16.0],
                [73.5, 15.0]
            ]]
        },
        metadata: {
            totalArea: 12000,
            averageRainfall: 2500,
            climateZone: 'tropical'
        }
    },
    {
        name: 'Coastal Belt',
        coordinates: {
            type: 'Polygon',
            coordinates: [[
                [72.8, 18.8],
                [73.2, 18.8],
                [73.2, 19.3],
                [72.8, 19.3],
                [72.8, 18.8]
            ]]
        },
        metadata: {
            totalArea: 3000,
            averageRainfall: 1800,
            climateZone: 'tropical'
        }
    },
    {
        name: 'Central Plateau',
        coordinates: {
            type: 'Polygon',
            coordinates: [[
                [75.0, 18.0],
                [76.0, 18.0],
                [76.0, 19.0],
                [75.0, 19.0],
                [75.0, 18.0]
            ]]
        },
        metadata: {
            totalArea: 8000,
            averageRainfall: 800,
            climateZone: 'semi-arid'
        }
    }
];

// Sample projects data (will be created after regions and users)
const projectsData = [
    {
        name: 'Teak Plantation Alpha',
        location: { type: 'Point', coordinates: [73.85, 20.0] },
        regionName: 'Nashik Zone',
        healthScore: 85,
        plantationSize: 1500,
        treeType: 'Teak',
        activeRisks: [],
        metadata: {
            plantedDate: new Date('2023-06-15'),
            soilType: 'loamy',
            irrigationSystem: 'drip'
        }
    },
    {
        name: 'Neem Forest Project',
        location: { type: 'Point', coordinates: [73.88, 20.1] },
        regionName: 'Nashik Zone',
        healthScore: 45,
        plantationSize: 2000,
        treeType: 'Neem',
        activeRisks: [
            {
                type: 'drought',
                severity: 'high',
                description: 'Prolonged dry spell affecting young saplings'
            },
            {
                type: 'water_stress',
                severity: 'medium',
                description: 'Irrigation system malfunction'
            }
        ],
        metadata: {
            plantedDate: new Date('2024-01-10'),
            soilType: 'clay',
            irrigationSystem: 'sprinkler'
        }
    },
    {
        name: 'Bamboo Grove Initiative',
        location: { type: 'Point', coordinates: [74.0, 15.5] },
        regionName: 'Western Ghats',
        healthScore: 92,
        plantationSize: 3000,
        treeType: 'Bamboo',
        activeRisks: [],
        metadata: {
            plantedDate: new Date('2022-08-20'),
            soilType: 'loamy',
            irrigationSystem: 'natural rainfall'
        }
    },
    {
        name: 'Mango Orchard Beta',
        location: { type: 'Point', coordinates: [74.2, 15.7] },
        regionName: 'Western Ghats',
        healthScore: 78,
        plantationSize: 800,
        treeType: 'Mango',
        activeRisks: [
            {
                type: 'pest',
                severity: 'low',
                description: 'Minor fruit fly activity detected'
            }
        ],
        metadata: {
            plantedDate: new Date('2023-03-01'),
            soilType: 'sandy',
            irrigationSystem: 'drip'
        }
    },
    {
        name: 'Coastal Mangrove Restoration',
        location: { type: 'Point', coordinates: [73.0, 19.0] },
        regionName: 'Coastal Belt',
        healthScore: 68,
        plantationSize: 5000,
        treeType: 'Mangrove',
        activeRisks: [
            {
                type: 'water_stress',
                severity: 'medium',
                description: 'Salinity levels fluctuating'
            }
        ],
        metadata: {
            plantedDate: new Date('2023-11-05'),
            soilType: 'silty',
            irrigationSystem: 'tidal'
        }
    },
    {
        name: 'Eucalyptus Plantation Gamma',
        location: { type: 'Point', coordinates: [75.5, 18.5] },
        regionName: 'Central Plateau',
        healthScore: 32,
        plantationSize: 1200,
        treeType: 'Eucalyptus',
        activeRisks: [
            {
                type: 'drought',
                severity: 'critical',
                description: 'Severe water shortage in semi-arid region'
            },
            {
                type: 'soil_degradation',
                severity: 'high',
                description: 'Soil nutrient depletion detected'
            }
        ],
        metadata: {
            plantedDate: new Date('2024-02-14'),
            soilType: 'sandy',
            irrigationSystem: 'none'
        }
    }
];

// Environmental data for key locations
const environmentalDataSamples = [
    {
        location: { type: 'Point', coordinates: [73.85, 20.0] },
        soilData: {
            type: 'loamy',
            pH: 6.8,
            organicMatter: 3.5,
            drainage: 'good'
        },
        climateData: {
            averageRainfall: 1200,
            temperatureRange: { min: 15, max: 35 },
            humidity: 65,
            climateZone: 'subtropical'
        },
        riskFactors: [
            { type: 'drought', probability: 'medium', season: 'summer' }
        ],
        dataSource: 'mock'
    },
    {
        location: { type: 'Point', coordinates: [74.0, 15.5] },
        soilData: {
            type: 'loamy',
            pH: 6.2,
            organicMatter: 5.0,
            drainage: 'excellent'
        },
        climateData: {
            averageRainfall: 2500,
            temperatureRange: { min: 18, max: 32 },
            humidity: 80,
            climateZone: 'tropical'
        },
        riskFactors: [
            { type: 'flood', probability: 'medium', season: 'monsoon' }
        ],
        dataSource: 'mock'
    },
    {
        location: { type: 'Point', coordinates: [75.5, 18.5] },
        soilData: {
            type: 'sandy',
            pH: 7.5,
            organicMatter: 1.5,
            drainage: 'excellent'
        },
        climateData: {
            averageRainfall: 600,
            temperatureRange: { min: 12, max: 42 },
            humidity: 45,
            climateZone: 'semi-arid'
        },
        riskFactors: [
            { type: 'drought', probability: 'high', season: 'all year' },
            { type: 'fire', probability: 'medium', season: 'summer' }
        ],
        dataSource: 'mock'
    }
];

// Main seeder function
const seedDatabase = async () => {
    try {
        console.log('\n🌱 Starting database seeding...\n');

        // Clear existing data
        console.log('Clearing existing data...');
        await Region.deleteMany({});
        await Project.deleteMany({});
        await EnvironmentalData.deleteMany({});
        console.log('✓ Existing data cleared\n');

        // Create regions
        console.log('Creating regions...');
        const regions = await Region.insertMany(regionsData);
        console.log(`✓ Created ${regions.length} regions\n`);

        // Get or create a demo user (manager)
        console.log('Setting up demo user...');
        let demoUser = await User.findOne({ email: 'demo@trivo.com' });
        if (!demoUser) {
            demoUser = await User.create({
                name: 'Demo Manager',
                email: 'demo@trivo.com',
                password: 'demo123',
                profession: 'manager',
                role: 'manager'
            });
            console.log('✓ Created demo user');
        } else {
            console.log('✓ Using existing demo user');
        }
        console.log(`  Email: demo@trivo.com`);
        console.log(`  Password: demo123\n`);

        // Create projects
        console.log('Creating projects...');
        const projects = [];
        for (const projectData of projectsData) {
            const region = regions.find(r => r.name === projectData.regionName);
            if (!region) {
                console.log(`⚠ Region not found for project: ${projectData.name}`);
                continue;
            }

            const project = await Project.create({
                name: projectData.name,
                location: projectData.location,
                region: region._id,
                manager: demoUser._id,
                healthScore: projectData.healthScore,
                plantationSize: projectData.plantationSize,
                treeType: projectData.treeType,
                activeRisks: projectData.activeRisks,
                metadata: projectData.metadata,
                status: 'active'
            });

            projects.push(project);

            // Add project to region
            region.projects.push(project._id);
            await region.save();

            console.log(`  ✓ ${project.name} (Health: ${project.healthScore}, Risk: ${project.riskLevel})`);
        }
        console.log(`✓ Created ${projects.length} projects\n`);

        // Calculate region risks
        console.log('Calculating region risks...');
        for (const region of regions) {
            await region.populate('projects');
            await region.calculateRegionRisk();
            await region.save();
            console.log(`  ✓ ${region.name}: ${region.riskLevel}`);
        }
        console.log();

        // Create environmental data
        console.log('Creating environmental data...');
        const envData = await EnvironmentalData.insertMany(environmentalDataSamples);
        console.log(`✓ Created ${envData.length} environmental data points\n`);

        // Summary
        console.log('═══════════════════════════════════════');
        console.log('✅ Database seeding completed!');
        console.log('═══════════════════════════════════════');
        console.log(`Regions: ${regions.length}`);
        console.log(`Projects: ${projects.length}`);
        console.log(`Environmental Data: ${envData.length}`);
        console.log('═══════════════════════════════════════\n');

        console.log('📊 Region Risk Summary:');
        for (const region of regions) {
            const projectCount = region.projects.length;
            console.log(`  ${region.name}: ${region.riskLevel} (${projectCount} projects)`);
        }
        console.log();

        console.log('🔑 Demo Credentials:');
        console.log('  Email: demo@trivo.com');
        console.log('  Password: demo123\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
};

// Run seeder
connectDB().then(seedDatabase);
