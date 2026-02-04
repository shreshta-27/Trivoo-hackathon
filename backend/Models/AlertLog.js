import mongoose from 'mongoose';

const alertLogSchema = new mongoose.Schema({
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // The recipient
    riskType: {
        type: String,
        required: true,
        enum: ['health_critical', 'action_urgent', 'incident_high_risk', 'future_forecast_risk']
    },
    severity: {
        type: String,
        required: true,
        enum: ['low', 'medium', 'high', 'critical']
    },
    emailContent: {
        subject: String,
        body: String // Store part of body or full if needed for audit
    },
    status: {
        type: String,
        enum: ['sent', 'failed'],
        default: 'sent'
    },
    metadata: {
        healthScore: Number,
        incidentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Incident' },
        recommendationId: { type: mongoose.Schema.Types.ObjectId, ref: 'ActionRecommendation' },
        aiReasoning: String
    },
    sentAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Index for idempotency checks (query by project + type + date)
alertLogSchema.index({ project: 1, riskType: 1, sentAt: -1 });

const AlertLog = mongoose.model('AlertLog', alertLogSchema);

export default AlertLog;
