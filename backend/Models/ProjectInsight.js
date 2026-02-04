import mongoose from 'mongoose';

const projectInsightSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    insightType: {
        type: String,
        enum: ['health_change', 'risk_alert', 'maintenance_feedback', 'recommendation', 'simulation'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    reasoning: {
        type: String,
        required: true
    },
    actionNeeded: {
        type: String
    },
    urgency: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
    },
    consequences: {
        type: String
    },
    aiMetadata: {
        model: String,
        processingTime: Number,
        confidence: Number
    },
    isActive: {
        type: Boolean,
        default: true
    },
    resolvedAt: Date
}, {
    timestamps: true
});

projectInsightSchema.index({ project: 1, createdAt: -1 });
projectInsightSchema.index({ isActive: 1 });

const ProjectInsight = mongoose.model('ProjectInsight', projectInsightSchema);

export default ProjectInsight;
