import mongoose from 'mongoose';

const suitabilityReportSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        }
    },
    projectDetails: {
        name: {
            type: String,
            required: true
        },
        plantationSize: {
            type: Number,
            required: true,
            min: 1
        },
        treeType: {
            type: String,
            required: true
        }
    },
    environmentalContext: {
        soilType: String,
        pH: Number,
        rainfall: Number,
        temperature: {
            min: Number,
            max: Number
        },
        climateZone: String
    },
    suitabilityStatus: {
        type: String,
        enum: ['suitable', 'suitable_with_caution', 'not_recommended'],
        required: true
    },
    reasoning: {
        type: String,
        required: true
    },
    recommendations: {
        fertilizers: [{
            name: String,
            type: {
                type: String,
                enum: ['organic', 'chemical', 'bio-fertilizer']
            },
            applicationRate: String,
            frequency: String
        }],
        careDuration: {
            type: Number, // days
            required: true
        },
        careInstructions: [String],
        irrigationNeeds: {
            type: String,
            enum: ['low', 'moderate', 'high']
        }
    },
    riskWarnings: [{
        type: {
            type: String,
            enum: ['drought', 'flood', 'fire', 'pest', 'disease', 'soil_incompatibility']
        },
        severity: {
            type: String,
            enum: ['low', 'medium', 'high']
        },
        description: String,
        mitigation: String
    }],
    aiMetadata: {
        model: String,
        temperature: Number,
        processingTime: Number, // milliseconds
        confidence: {
            type: Number,
            min: 0,
            max: 1
        }
    }
}, {
    timestamps: true
});

// Indexes
suitabilityReportSchema.index({ user: 1, createdAt: -1 });
suitabilityReportSchema.index({ location: '2dsphere' });
suitabilityReportSchema.index({ suitabilityStatus: 1 });

// Static method to get user's report history
suitabilityReportSchema.statics.getUserHistory = async function (userId, limit = 10) {
    return await this.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .select('-aiMetadata'); // Exclude AI metadata for cleaner response
};

// Static method to get reports by suitability status
suitabilityReportSchema.statics.getByStatus = async function (status) {
    return await this.find({ suitabilityStatus: status })
        .populate('user', 'name email')
        .sort({ createdAt: -1 });
};

const SuitabilityReport = mongoose.model('SuitabilityReport', suitabilityReportSchema);

export default SuitabilityReport;
