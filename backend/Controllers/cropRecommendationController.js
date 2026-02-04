import CropRecommendationEngine from '../utils/cropRecommendationEngine.js';
import Crop from '../Models/Crop.js';

export const getRecommendations = async (req, res) => {
    try {
        const { rainfall, temperature, soilType, limit, minScore, useCases } = req.query;

        if (!rainfall || !temperature) {
            return res.status(400).json({
                success: false,
                message: 'Rainfall and temperature are required parameters'
            });
        }

        const environmentalData = {
            rainfall: parseFloat(rainfall),
            temperature: parseFloat(temperature),
            soilType: soilType || null
        };

        const options = {
            limit: limit ? parseInt(limit) : 10,
            minScore: minScore ? parseFloat(minScore) : 0,
            useCases: useCases ? useCases.split(',') : []
        };

        const result = await CropRecommendationEngine.getRecommendations(environmentalData, options);

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getAllCrops = async (req, res) => {
    try {
        const crops = await CropRecommendationEngine.getAllCrops();

        res.status(200).json({
            success: true,
            count: crops.length,
            data: crops
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getCropById = async (req, res) => {
    try {
        const { id } = req.params;
        const crop = await CropRecommendationEngine.getCropById(id);

        res.status(200).json({
            success: true,
            data: crop
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

export const getRegionRecommendations = async (req, res) => {
    try {
        const { regionName, lat, lon } = req.query;

        if (!regionName && (!lat || !lon)) {
            return res.status(400).json({
                success: false,
                message: 'Either regionName or coordinates (lat, lon) are required'
            });
        }

        const regionData = {
            'Pune': { rainfall: 722, temperature: 25, soilType: 'Black' },
            'Nashik': { rainfall: 565, temperature: 27, soilType: 'Black' },
            'Mumbai': { rainfall: 2167, temperature: 27, soilType: 'Laterite' },
            'Nagpur': { rainfall: 1067, temperature: 28, soilType: 'Black' },
            'Aurangabad': { rainfall: 726, temperature: 26, soilType: 'Black' },
            'Kolhapur': { rainfall: 1200, temperature: 24, soilType: 'Laterite' },
            'Satara': { rainfall: 1200, temperature: 23, soilType: 'Red' },
            'Ratnagiri': { rainfall: 3000, temperature: 26, soilType: 'Laterite' },
            'Thane': { rainfall: 2500, temperature: 27, soilType: 'Laterite' },
            'Solapur': { rainfall: 545, temperature: 28, soilType: 'Black' }
        };

        let environmentalData;

        if (regionName && regionData[regionName]) {
            environmentalData = regionData[regionName];
        } else if (lat && lon) {
            environmentalData = {
                rainfall: 1000,
                temperature: 26,
                soilType: 'Loamy'
            };
        } else {
            return res.status(404).json({
                success: false,
                message: 'Region not found in database'
            });
        }

        const result = await CropRecommendationEngine.getRecommendations(environmentalData, {
            limit: 5,
            minScore: 40
        });

        res.status(200).json({
            success: true,
            region: regionName || `Lat: ${lat}, Lon: ${lon}`,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const compareCrops = async (req, res) => {
    try {
        const { cropIds, rainfall, temperature, soilType } = req.body;

        if (!cropIds || !Array.isArray(cropIds) || cropIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'cropIds array is required'
            });
        }

        if (!rainfall || !temperature) {
            return res.status(400).json({
                success: false,
                message: 'Rainfall and temperature are required'
            });
        }

        const environmentalData = {
            rainfall: parseFloat(rainfall),
            temperature: parseFloat(temperature),
            soilType: soilType || null
        };

        const comparisons = await Promise.all(
            cropIds.map(async (id) => {
                const crop = await Crop.findById(id);
                if (!crop) return null;

                const suitability = CropRecommendationEngine.calculateSuitabilityScore(crop, environmentalData);

                return {
                    crop: {
                        id: crop._id,
                        name: crop.name,
                        priority: crop.priority,
                        characteristics: crop.characteristics
                    },
                    suitability,
                    riskAssessment: {
                        overall: CropRecommendationEngine.calculateOverallRisk(crop, environmentalData),
                        factors: crop.riskFactors
                    }
                };
            })
        );

        const validComparisons = comparisons.filter(c => c !== null);

        res.status(200).json({
            success: true,
            count: validComparisons.length,
            data: validComparisons.sort((a, b) => b.suitability.score - a.suitability.score)
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
