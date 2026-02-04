import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Project from '../Models/Project.js';
import HealthHistory from '../Models/HealthHistory.js';
import ProjectInsight from '../Models/ProjectInsight.js';
import MaintenanceAction from '../Models/MaintenanceAction.js';
import User from '../Models/userSchema.js';
import Region from '../Models/Region.js';

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✓ MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

const seedLifecycleData = async () => {
    try {
        console.log('\n🌱 Starting lifecycle data seeding...\n');

        const demoUser = await User.findOne({ email: 'demo@trivo.com' });
        if (!demoUser) {
            console.log('❌ Demo user not found. Run mapSeeder.js first.');
            process.exit(1);
        }

        const region = await Region.findOne({ name: 'Nashik Zone' });
        if (!region) {
            console.log('❌ Region not found. Run mapSeeder.js first.');
            process.exit(1);
        }

        console.log('Creating lifecycle-enabled project...');

        const project = await Project.create({
            name: 'Lifecycle Demo Project',
            location: {
                type: 'Point',
                coordinates: [73.87, 20.05]
            },
            region: region._id,
            manager: demoUser._id,
            healthScore: 70,
            plantationSize: 1500,
            treeType: 'Mango',
            creationSource: 'manual_entry',
            initialContext: {
                environmentalSnapshot: {
                    soilType: 'loamy',
                    pH: 6.5,
                    rainfall: 1100,
                    temperature: { min: 18, max: 34 }
                }
            },
            metadata: {
                plantedDate: new Date('2024-01-15'),
                soilType: 'loamy',
                irrigationSystem: 'drip'
            },
            activeRisks: [{
                type: 'water_stress',
                severity: 'medium',
                description: 'Irrigation system needs maintenance',
                detectedAt: new Date()
            }],
            status: 'active'
        });

        console.log('✓ Project created');

        console.log('Creating health history...');
        const healthRecords = [];
        const dates = [
            { date: new Date('2024-01-15'), score: 75, risks: 0 },
            { date: new Date('2024-01-22'), score: 72, risks: 0 },
            { date: new Date('2024-01-29'), score: 68, risks: 1 },
            { date: new Date('2024-02-04'), score: 70, risks: 1 }
        ];

        for (const record of dates) {
            const healthRecord = await HealthHistory.create({
                score: record.score,
                riskLevel: record.score > 75 ? 'stable' : 'medium_stress',
                recordedAt: record.date,
                factors: {
                    rainfall: 1100,
                    temperature: 32,
                    maintenanceCount: 0,
                    activeRisksCount: record.risks
                }
            });
            healthRecords.push(healthRecord._id);
        }

        project.healthHistory = healthRecords;
        await project.save();
        console.log(`✓ Created ${healthRecords.length} health records`);

        console.log('Creating maintenance actions...');
        const actions = [];

        const action1 = await MaintenanceAction.create({
            project: project._id,
            actionType: 'watering',
            description: 'Deep watering session - 500L per tree',
            performedBy: demoUser._id,
            wasRecommended: false,
            timingStatus: 'proactive',
            impact: {
                healthScoreBefore: 68,
                healthScoreAfter: 70,
                risksResolved: []
            },
            aiFeedback: {
                effectiveness: 'effective',
                feedback: 'Watering was timely and helped stabilize moisture levels',
                suggestions: ['Continue regular watering schedule', 'Monitor soil moisture']
            }
        });
        actions.push(action1._id);

        const action2 = await MaintenanceAction.create({
            project: project._id,
            actionType: 'health_check',
            description: 'Monthly health inspection completed',
            performedBy: demoUser._id,
            wasRecommended: true,
            timingStatus: 'on_time',
            impact: {
                healthScoreBefore: 70,
                healthScoreAfter: 70
            },
            aiFeedback: {
                effectiveness: 'effective',
                feedback: 'Regular monitoring helps catch issues early',
                suggestions: ['Check for pest activity', 'Inspect irrigation system']
            }
        });
        actions.push(action2._id);

        project.maintenanceActions = actions;
        project.lastMaintenanceDate = new Date();
        await project.save();
        console.log(`✓ Created ${actions.length} maintenance actions`);

        console.log('Creating AI insights...');
        const insights = [];

        const insight1 = await ProjectInsight.create({
            project: project._id,
            insightType: 'health_change',
            title: 'Health Score Decline Detected',
            description: 'Project health decreased from 75 to 68 over the past week',
            reasoning: 'Water stress detected due to irrigation system malfunction combined with below-average rainfall',
            actionNeeded: 'Repair irrigation system and increase manual watering frequency',
            urgency: 'high',
            consequences: 'Continued water stress may lead to leaf drop and reduced fruit production',
            aiMetadata: {
                model: 'gemini-pro',
                processingTime: 2100,
                confidence: 0.87
            },
            isActive: true
        });
        insights.push(insight1._id);

        const insight2 = await ProjectInsight.create({
            project: project._id,
            insightType: 'recommendation',
            title: 'Fertilization Recommended',
            description: 'Soil nutrient levels may be depleting as trees mature',
            reasoning: 'Mango trees at this growth stage require additional nutrients for optimal fruit development',
            actionNeeded: 'Apply organic fertilizer (NPK 10-10-10) at 2kg per tree',
            urgency: 'medium',
            consequences: 'Nutrient deficiency may result in smaller fruit size and reduced yield',
            aiMetadata: {
                model: 'gemini-pro',
                processingTime: 1800,
                confidence: 0.82
            },
            isActive: true
        });
        insights.push(insight2._id);

        project.insights = insights;
        project.lastInsightUpdate = new Date();
        await project.save();
        console.log(`✓ Created ${insights.length} AI insights`);

        region.projects.push(project._id);
        await region.save();

        console.log('\n═══════════════════════════════════════');
        console.log('✅ Lifecycle data seeding completed!');
        console.log('═══════════════════════════════════════');
        console.log(`Project: ${project.name}`);
        console.log(`Health Score: ${project.healthScore}`);
        console.log(`Health Records: ${healthRecords.length}`);
        console.log(`Maintenance Actions: ${actions.length}`);
        console.log(`AI Insights: ${insights.length}`);
        console.log('═══════════════════════════════════════\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
};

connectDB().then(seedLifecycleData);
