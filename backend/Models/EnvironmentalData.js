import mongoose from 'mongoose';

const environmentalDataSchema = new mongoose.Schema({
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
    soilData: {
        type: {
            type: String,
            enum: ['clay', 'sandy', 'loamy', 'silty', 'peaty', 'chalky'],
            required: true
        },
        pH: {
            type: Number,
            required: true,
            min: 0,
            max: 14
        },
        organicMatter: {
            type: Number, // percentage
            min: 0,
            max: 100
        },
        drainage: {
            type: String,
            enum: ['poor', 'moderate', 'good', 'excellent']
        }
    },
    climateData: {
        averageRainfall: {
            type: Number, // mm per year
            required: true
        },
        temperatureRange: {
            min: Number, // Celsius
            max: Number  // Celsius
        },
        humidity: {
            type: Number, // percentage
            min: 0,
            max: 100
        },
        climateZone: {
            type: String,
            enum: ['tropical', 'subtropical', 'temperate', 'arid', 'semi-arid']
        }
    },
    riskFactors: [{
        type: {
            type: String,
            enum: ['drought', 'flood', 'fire', 'frost', 'pest', 'disease']
        },
        probability: {
            type: String,
            enum: ['low', 'medium', 'high']
        },
        season: String // e.g., "summer", "monsoon"
    }],
    dataSource: {
        type: String,
        enum: ['api', 'manual', 'mock'],
        default: 'mock'
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

environmentalDataSchema.index({ location: '2dsphere' });

environmentalDataSchema.statics.findNearLocation = async function (longitude, latitude, maxDistance = 50000) {
    return await this.findOne({
        location: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: [longitude, latitude]
                },
                $maxDistance: maxDistance // meters (50km default)
            }
        }
    });
};

environmentalDataSchema.statics.getOrCreateForLocation = async function (longitude, latitude) {
    let envData = await this.findNearLocation(longitude, latitude);

    if (envData) {
        return envData;
    }

    const mockData = {
        location: {
            type: 'Point',
            coordinates: [longitude, latitude]
        },
        soilData: {
            type: 'loamy', // Default to loamy soil (good for most trees)
            pH: 6.5,
            organicMatter: 3.5,
            drainage: 'good'
        },
        climateData: {
            averageRainfall: 1200, // mm per year (moderate)
            temperatureRange: {
                min: 15,
                max: 35
            },
            humidity: 65,
            climateZone: 'subtropical'
        },
        riskFactors: [
            {
                type: 'drought',
                probability: 'medium',
                season: 'summer'
            }
        ],
        dataSource: 'mock'
    };

    envData = await this.create(mockData);
    return envData;
};

const EnvironmentalData = mongoose.model('EnvironmentalData', environmentalDataSchema);

export default EnvironmentalData;
