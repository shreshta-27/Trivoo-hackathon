import mongoose from 'mongoose';

const plantingSessionSchema = new mongoose.Schema({
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], required: true }
    },
    targetTrees: { type: Number, required: true },
    plantedTrees: { type: Number, default: 0 },
    species: { type: String, required: true },
    status: { type: String, enum: ['planned', 'active', 'completed'], default: 'planned' },
    participants: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        joinedAt: { type: Date, default: Date.now },
        contribution: { type: Number, default: 0 }
    }],
    communityInsights: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        message: String,
        createdAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

plantingSessionSchema.index({ location: '2dsphere' });

const PlantingSession = mongoose.model('PlantingSession', plantingSessionSchema);
export default PlantingSession;
