import mongoose from 'mongoose';

const maintenanceActionSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    actionType: {
        type: String,
        enum: ['watering', 'fertilization', 'pruning', 'pest_control', 'health_check', 'observation'],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    performedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    wasRecommended: {
        type: Boolean,
        default: false
    },
    recommendationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProjectInsight'
    },
    timingStatus: {
        type: String,
        enum: ['on_time', 'delayed', 'proactive'],
        default: 'proactive'
    },
    impact: {
        healthScoreBefore: Number,
        healthScoreAfter: Number,
        risksResolved: [String]
    },
    aiFeedback: {
        effectiveness: {
            type: String,
            enum: ['effective', 'partially_effective', 'ineffective', 'pending']
        },
        feedback: String,
        suggestions: [String]
    }
}, {
    timestamps: true
});

maintenanceActionSchema.index({ project: 1, createdAt: -1 });
maintenanceActionSchema.index({ performedBy: 1 });

const MaintenanceAction = mongoose.model('MaintenanceAction', maintenanceActionSchema);

export default MaintenanceAction;
