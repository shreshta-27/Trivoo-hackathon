import mongoose from 'mongoose';

const incidentSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['fire', 'drought', 'deforestation', 'encroachment', 'policy_change', 'extreme_weather', 'pest_outbreak', 'pollution', 'other']
    },
    title: { type: String, required: true },
    description: { type: String },
    location: {
        type: { type: String, enum: ['Point'], required: true, default: 'Point' },
        coordinates: { type: [Number], required: true }, // [longitude, latitude]
        formattedAddress: { type: String },
        city: String,
        district: String,
        region: String,
        country: { type: String, default: 'India' }
    },
    severity: {
        type: String,
        required: true,
        enum: ['low', 'medium', 'high', 'critical']
    },
    source: {
        name: { type: String },
        url: { type: String },
        publishedAt: { type: Date }
    },
    status: {
        type: String,
        enum: ['active', 'monitoring', 'resolved', 'archived'],
        default: 'active'
    },
    detectionConfidence: { type: Number }, // 0-1
    aiAnalysis: {
        originalText: String,
        keywords: [String],
        reasoning: String,
        modelUsed: String
    }
}, { timestamps: true });

// Index for geospatial queries
incidentSchema.index({ location: '2dsphere' });

const Incident = mongoose.model('Incident', incidentSchema);

export default Incident;
