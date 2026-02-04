import mongoose from 'mongoose';

const riskSignalSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    signalType: {
        type: String,
        enum: ['temperature_anomaly', 'rainfall_deficit', 'fire_probability', 'soil_moisture_mismatch', 'pest_activity', 'disease_indicator'],
        required: true
    },
    severity: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        required: true
    },
    value: mongoose.Schema.Types.Mixed,
    threshold: mongoose.Schema.Types.Mixed,
    detectedAt: {
        type: Date,
        default: Date.now
    },
    resolvedAt: Date,
    isActive: {
        type: Boolean,
        default: true
    },
    metadata: {
        source: String,
        confidence: Number,
        rawData: mongoose.Schema.Types.Mixed
    }
}, {
    timestamps: true
});

riskSignalSchema.index({ project: 1, isActive: 1 });
riskSignalSchema.index({ signalType: 1 });
riskSignalSchema.index({ detectedAt: -1 });

const RiskSignal = mongoose.model('RiskSignal', riskSignalSchema);

export default RiskSignal;
