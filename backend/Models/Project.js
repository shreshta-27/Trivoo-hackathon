import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Project name is required'],
        trim: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true,
            validate: {
                validator: function (coords) {
                    return coords.length === 2 &&
                        coords[0] >= -180 && coords[0] <= 180 &&
                        coords[1] >= -90 && coords[1] <= 90;
                },
                message: 'Invalid coordinates. Format: [longitude, latitude]'
            }
        }
    },
    region: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Region',
        required: true
    },
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    healthScore: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
        default: 75
    },
    riskLevel: {
        type: String,
        enum: ['stable', 'medium_stress', 'high_stress', 'critical_stress'],
        default: 'stable'
    },
    plantationSize: {
        type: Number,
        required: [true, 'Plantation size is required'],
        min: 1
    },
    treeType: {
        type: String,
        required: [true, 'Tree type is required'],
        trim: true
    },
    activeRisks: [{
        type: {
            type: String,
            enum: ['drought', 'fire', 'water_stress', 'pest', 'disease', 'soil_degradation']
        },
        severity: {
            type: String,
            enum: ['low', 'medium', 'high', 'critical']
        },
        description: String,
        detectedAt: {
            type: Date,
            default: Date.now
        }
    }],
    careHistory: [{
        action: {
            type: String,
            enum: ['watering', 'fertilization', 'pruning', 'pest_control', 'health_check']
        },
        description: String,
        performedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        performedAt: {
            type: Date,
            default: Date.now
        }
    }],
    metadata: {
        plantedDate: Date,
        expectedMaturityDate: Date,
        soilType: String,
        irrigationSystem: String
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'abandoned'],
        default: 'active'
    }
}, {
    timestamps: true
});

// GeoJSON index for spatial queries
projectSchema.index({ location: '2dsphere' });
projectSchema.index({ region: 1 });
projectSchema.index({ manager: 1 });
projectSchema.index({ healthScore: -1 });

// Method to calculate project risk based on health score
projectSchema.methods.calculateProjectRisk = function () {
    if (this.healthScore > 75) {
        this.riskLevel = 'stable';
    } else if (this.healthScore >= 50 && this.healthScore <= 75) {
        this.riskLevel = 'medium_stress';
    } else if (this.healthScore >= 25 && this.healthScore < 50) {
        this.riskLevel = 'high_stress';
    } else {
        this.riskLevel = 'critical_stress';
    }
    return this.riskLevel;
};

// Pre-save hook to auto-calculate risk level
projectSchema.pre('save', function (next) {
    if (this.isModified('healthScore')) {
        this.calculateProjectRisk();
    }
    next();
});

// Static method to get projects by region
projectSchema.statics.getByRegion = async function (regionId) {
    return await this.find({ region: regionId, status: 'active' })
        .populate('manager', 'name email')
        .sort({ healthScore: 1 }); // Lowest health first
};

// Static method to get critical projects
projectSchema.statics.getCriticalProjects = async function () {
    return await this.find({
        riskLevel: { $in: ['high_stress', 'critical_stress'] },
        status: 'active'
    })
        .populate('region', 'name')
        .populate('manager', 'name email')
        .sort({ healthScore: 1 });
};

const Project = mongoose.model('Project', projectSchema);

export default Project;
