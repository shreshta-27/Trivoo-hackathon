import mongoose from 'mongoose';

const simulationSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    scenarioType: {
        type: String,
        enum: ['drought', 'heatwave', 'flood', 'pest_outbreak', 'neglect', 'optimal_care'],
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    parameters: {
        rainfallChange: Number,
        temperatureChange: Number,
        maintenanceFrequency: String,
        pestPressure: String
    },
    results: {
        projectedHealthScore: Number,
        healthTrajectory: [{
            day: Number,
            score: Number,
            riskLevel: String
        }],
        risksProjected: [String],
        recommendations: [String],
        outcome: String
    },
    aiAnalysis: {
        reasoning: String,
        criticalPoints: [String],
        mitigationStrategies: [String]
    }
}, {
    timestamps: true
});

simulationSchema.index({ project: 1, createdAt: -1 });

const Simulation = mongoose.model('Simulation', simulationSchema);

export default Simulation;
