import Crop from '../Models/Crop.js';

class CropRecommendationEngine {
    static calculateSuitabilityScore(crop, environmentalData) {
        let score = 100;
        const reasons = [];
        const warnings = [];

        const { rainfall, temperature, soilType } = environmentalData;

        if (rainfall < crop.environmentalRequirements.rainfall.min) {
            const deficit = crop.environmentalRequirements.rainfall.min - rainfall;
            const penalty = Math.min(40, (deficit / crop.environmentalRequirements.rainfall.min) * 50);
            score -= penalty;
            reasons.push(`Rainfall ${rainfall}mm is below minimum requirement of ${crop.environmentalRequirements.rainfall.min}mm`);
            warnings.push('drought_risk');
        } else if (rainfall > crop.environmentalRequirements.rainfall.max) {
            const excess = rainfall - crop.environmentalRequirements.rainfall.max;
            const penalty = Math.min(30, (excess / crop.environmentalRequirements.rainfall.max) * 40);
            score -= penalty;
            reasons.push(`Rainfall ${rainfall}mm exceeds maximum tolerance of ${crop.environmentalRequirements.rainfall.max}mm`);
            warnings.push('waterlogging_risk');
        } else {
            reasons.push(`Rainfall ${rainfall}mm is within optimal range (${crop.environmentalRequirements.rainfall.min}-${crop.environmentalRequirements.rainfall.max}mm)`);
        }

        if (temperature < crop.environmentalRequirements.temperature.min) {
            const deficit = crop.environmentalRequirements.temperature.min - temperature;
            const penalty = Math.min(35, (deficit / crop.environmentalRequirements.temperature.min) * 45);
            score -= penalty;
            reasons.push(`Temperature ${temperature}°C is below minimum requirement of ${crop.environmentalRequirements.temperature.min}°C`);
            warnings.push('cold_stress');
        } else if (temperature > crop.environmentalRequirements.temperature.max) {
            const excess = temperature - crop.environmentalRequirements.temperature.max;
            const penalty = Math.min(35, (excess / crop.environmentalRequirements.temperature.max) * 45);
            score -= penalty;
            reasons.push(`Temperature ${temperature}°C exceeds maximum tolerance of ${crop.environmentalRequirements.temperature.max}°C`);
            warnings.push('heat_stress');
        } else {
            reasons.push(`Temperature ${temperature}°C is within optimal range (${crop.environmentalRequirements.temperature.min}-${crop.environmentalRequirements.temperature.max}°C)`);
        }

        if (soilType && !crop.environmentalRequirements.soilTypes.includes(soilType)) {
            score -= 25;
            reasons.push(`Soil type '${soilType}' is not ideal. Recommended: ${crop.environmentalRequirements.soilTypes.join(', ')}`);
            warnings.push('soil_incompatibility');
        } else if (soilType) {
            reasons.push(`Soil type '${soilType}' is compatible`);
        }

        const riskPenalties = {
            'Very High': 15,
            'High': 10,
            'Medium': 5,
            'Low': 2,
            'Very Low': 0
        };

        if (rainfall < crop.environmentalRequirements.rainfall.min * 0.8) {
            score -= riskPenalties[crop.riskFactors.drought] || 0;
            if (crop.riskFactors.drought === 'High' || crop.riskFactors.drought === 'Very High') {
                reasons.push(`High drought risk due to low rainfall and crop sensitivity`);
            }
        }

        score = Math.max(0, Math.min(100, score));

        return {
            score: Math.round(score),
            reasons,
            warnings,
            category: this.getScoreCategory(score)
        };
    }

    static getScoreCategory(score) {
        if (score >= 80) return 'Excellent';
        if (score >= 65) return 'Good';
        if (score >= 50) return 'Moderate';
        if (score >= 35) return 'Poor';
        return 'Not Recommended';
    }

    static async getRecommendations(environmentalData, options = {}) {
        try {
            const { limit = 10, minScore = 0, useCases = [] } = options;

            let query = { isActive: true };
            if (useCases.length > 0) {
                query.useCases = { $in: useCases };
            }

            const crops = await Crop.find(query).sort({ priority: 1 });

            const recommendations = crops.map(crop => {
                const suitability = this.calculateSuitabilityScore(crop, environmentalData);

                return {
                    crop: {
                        id: crop._id,
                        name: crop.name,
                        scientificName: crop.scientificName,
                        priority: crop.priority,
                        description: crop.description,
                        characteristics: crop.characteristics,
                        plantationDetails: crop.plantationDetails,
                        benefits: crop.benefits,
                        useCases: crop.useCases
                    },
                    suitability,
                    environmentalMatch: {
                        rainfall: this.getMatchStatus(
                            environmentalData.rainfall,
                            crop.environmentalRequirements.rainfall.min,
                            crop.environmentalRequirements.rainfall.max
                        ),
                        temperature: this.getMatchStatus(
                            environmentalData.temperature,
                            crop.environmentalRequirements.temperature.min,
                            crop.environmentalRequirements.temperature.max
                        ),
                        soil: environmentalData.soilType ?
                            crop.environmentalRequirements.soilTypes.includes(environmentalData.soilType) : null
                    },
                    riskAssessment: {
                        overall: this.calculateOverallRisk(crop, environmentalData),
                        factors: crop.riskFactors
                    }
                };
            });

            const filtered = recommendations
                .filter(r => r.suitability.score >= minScore)
                .sort((a, b) => {
                    if (b.suitability.score !== a.suitability.score) {
                        return b.suitability.score - a.suitability.score;
                    }
                    return a.crop.priority - b.crop.priority;
                })
                .slice(0, limit);

            return {
                recommendations: filtered,
                environmentalData,
                totalCropsAnalyzed: crops.length,
                suitableCrops: filtered.length,
                summary: this.generateSummary(filtered, environmentalData)
            };
        } catch (error) {
            throw new Error(`Recommendation engine error: ${error.message}`);
        }
    }

    static getMatchStatus(value, min, max) {
        if (value >= min && value <= max) return 'optimal';
        if (value < min && value >= min * 0.8) return 'acceptable_low';
        if (value > max && value <= max * 1.2) return 'acceptable_high';
        if (value < min) return 'too_low';
        return 'too_high';
    }

    static calculateOverallRisk(crop, environmentalData) {
        const riskScores = {
            'Very Low': 1,
            'Low': 2,
            'Medium': 3,
            'High': 4,
            'Very High': 5
        };

        let totalRisk = 0;
        let factorCount = 0;

        if (environmentalData.rainfall < crop.environmentalRequirements.rainfall.min * 0.8) {
            totalRisk += riskScores[crop.riskFactors.drought] || 0;
            factorCount++;
        }

        totalRisk += riskScores[crop.riskFactors.pest] || 0;
        totalRisk += riskScores[crop.riskFactors.disease] || 0;
        factorCount += 2;

        const avgRisk = totalRisk / factorCount;

        if (avgRisk <= 1.5) return 'Very Low';
        if (avgRisk <= 2.5) return 'Low';
        if (avgRisk <= 3.5) return 'Medium';
        if (avgRisk <= 4.5) return 'High';
        return 'Very High';
    }

    static generateSummary(recommendations, environmentalData) {
        if (recommendations.length === 0) {
            return {
                message: 'No suitable crops found for the given environmental conditions',
                suggestion: 'Consider soil improvement or water management strategies'
            };
        }

        const topCrop = recommendations[0];
        const excellentCrops = recommendations.filter(r => r.suitability.category === 'Excellent').length;
        const goodCrops = recommendations.filter(r => r.suitability.category === 'Good').length;

        return {
            message: `Found ${recommendations.length} suitable crops for this region`,
            topRecommendation: topCrop.crop.name,
            topScore: topCrop.suitability.score,
            distribution: {
                excellent: excellentCrops,
                good: goodCrops,
                moderate: recommendations.length - excellentCrops - goodCrops
            },
            environmentalSummary: {
                rainfall: `${environmentalData.rainfall}mm/year`,
                temperature: `${environmentalData.temperature}°C average`,
                soilType: environmentalData.soilType || 'Not specified'
            }
        };
    }

    static async getCropById(cropId) {
        try {
            const crop = await Crop.findById(cropId);
            if (!crop) {
                throw new Error('Crop not found');
            }
            return crop;
        } catch (error) {
            throw new Error(`Error fetching crop: ${error.message}`);
        }
    }

    static async getAllCrops(filters = {}) {
        try {
            const query = { isActive: true, ...filters };
            const crops = await Crop.find(query).sort({ priority: 1 });
            return crops;
        } catch (error) {
            throw new Error(`Error fetching crops: ${error.message}`);
        }
    }
}

export default CropRecommendationEngine;
