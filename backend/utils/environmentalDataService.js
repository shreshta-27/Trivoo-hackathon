/**
 * Environmental Data Service
 * Provides environmental context for locations
 * Currently uses mock data for demo - can be replaced with real API calls
 */

import EnvironmentalData from '../Models/EnvironmentalData.js';

/**
 * Get soil data for a location
 * @param {number} longitude - Longitude
 * @param {number} latitude - Latitude
 * @returns {Object} Soil data
 */
export const getSoilData = async (longitude, latitude) => {
    // Try to find existing data
    const envData = await EnvironmentalData.findNearLocation(longitude, latitude);

    if (envData) {
        return envData.soilData;
    }

    // Return mock data based on general patterns
    // In production, this would call SoilGrids API or similar
    return {
        type: 'loamy',
        pH: 6.5,
        organicMatter: 3.5,
        drainage: 'good'
    };
};

/**
 * Get climate data for a location
 * @param {number} longitude - Longitude
 * @param {number} latitude - Latitude
 * @returns {Object} Climate data
 */
export const getClimateData = async (longitude, latitude) => {
    const envData = await EnvironmentalData.findNearLocation(longitude, latitude);

    if (envData) {
        return envData.climateData;
    }

    // Mock data - in production, use OpenWeatherMap or similar
    // This is simplified based on Indian climate zones
    const mockClimate = {
        averageRainfall: 1200,
        temperatureRange: {
            min: 15,
            max: 35
        },
        humidity: 65,
        climateZone: 'subtropical'
    };

    // Adjust based on latitude (rough approximation)
    if (latitude > 28) {
        // Northern regions - more temperate
        mockClimate.climateZone = 'temperate';
        mockClimate.temperatureRange = { min: 5, max: 40 };
        mockClimate.averageRainfall = 800;
    } else if (latitude < 15) {
        // Southern regions - more tropical
        mockClimate.climateZone = 'tropical';
        mockClimate.temperatureRange = { min: 20, max: 35 };
        mockClimate.averageRainfall = 2000;
    }

    // Western regions (longitude < 75) - more arid
    if (longitude < 75) {
        mockClimate.averageRainfall *= 0.6;
        if (mockClimate.averageRainfall < 500) {
            mockClimate.climateZone = 'arid';
        }
    }

    return mockClimate;
};

/**
 * Get risk factors for a location
 * @param {number} longitude - Longitude
 * @param {number} latitude - Latitude
 * @returns {Array} Risk factors
 */
export const getRiskFactors = async (longitude, latitude) => {
    const envData = await EnvironmentalData.findNearLocation(longitude, latitude);

    if (envData && envData.riskFactors) {
        return envData.riskFactors;
    }

    // Mock risk factors based on location
    const risks = [];

    const climate = await getClimateData(longitude, latitude);

    // Drought risk in arid/semi-arid zones
    if (climate.climateZone === 'arid' || climate.climateZone === 'semi-arid') {
        risks.push({
            type: 'drought',
            probability: 'high',
            season: 'summer'
        });
    } else if (climate.averageRainfall < 1000) {
        risks.push({
            type: 'drought',
            probability: 'medium',
            season: 'summer'
        });
    }

    // Fire risk in hot, dry regions
    if (climate.temperatureRange.max > 38 && climate.averageRainfall < 800) {
        risks.push({
            type: 'fire',
            probability: 'medium',
            season: 'summer'
        });
    }

    // Flood risk in high rainfall areas
    if (climate.averageRainfall > 1800) {
        risks.push({
            type: 'flood',
            probability: 'medium',
            season: 'monsoon'
        });
    }

    // Pest risk in tropical zones
    if (climate.climateZone === 'tropical') {
        risks.push({
            type: 'pest',
            probability: 'medium',
            season: 'all year'
        });
    }

    return risks;
};

/**
 * Get complete environmental context for a location
 * This is the main function used by the suitability agent
 * @param {number} longitude - Longitude
 * @param {number} latitude - Latitude
 * @returns {Object} Complete environmental context
 */
export const getEnvironmentalContext = async (longitude, latitude) => {
    // Try to get existing data first
    let envData = await EnvironmentalData.findNearLocation(longitude, latitude);

    // If not found, create it
    if (!envData) {
        envData = await EnvironmentalData.getOrCreateForLocation(longitude, latitude);
    }

    return {
        location: {
            longitude,
            latitude
        },
        soil: envData.soilData,
        climate: envData.climateData,
        risks: envData.riskFactors,
        dataSource: envData.dataSource,
        lastUpdated: envData.lastUpdated
    };
};

/**
 * Check if soil is compatible with tree type
 * @param {Object} soilData - Soil data
 * @param {string} treeType - Tree type
 * @returns {Object} Compatibility result
 */
export const checkSoilCompatibility = (soilData, treeType) => {
    // Simplified compatibility matrix
    const compatibility = {
        'teak': {
            soilTypes: ['loamy', 'clay'],
            pHRange: [6.5, 7.5],
            drainageNeeds: ['good', 'moderate']
        },
        'neem': {
            soilTypes: ['loamy', 'sandy', 'clay'],
            pHRange: [6.0, 8.0],
            drainageNeeds: ['good', 'excellent']
        },
        'mango': {
            soilTypes: ['loamy', 'sandy'],
            pHRange: [5.5, 7.5],
            drainageNeeds: ['good', 'excellent']
        },
        'bamboo': {
            soilTypes: ['loamy', 'clay', 'sandy'],
            pHRange: [4.5, 7.0],
            drainageNeeds: ['moderate', 'good']
        },
        'eucalyptus': {
            soilTypes: ['loamy', 'sandy', 'clay'],
            pHRange: [5.5, 7.5],
            drainageNeeds: ['good', 'excellent']
        }
    };

    const treeKey = treeType.toLowerCase();
    const treeReqs = compatibility[treeKey];

    if (!treeReqs) {
        // Unknown tree type - assume moderate compatibility
        return {
            compatible: true,
            confidence: 'low',
            notes: 'Tree type not in database - general assessment provided'
        };
    }

    const soilTypeMatch = treeReqs.soilTypes.includes(soilData.type);
    const pHMatch = soilData.pH >= treeReqs.pHRange[0] && soilData.pH <= treeReqs.pHRange[1];
    const drainageMatch = treeReqs.drainageNeeds.includes(soilData.drainage);

    const compatible = soilTypeMatch && pHMatch && drainageMatch;

    return {
        compatible,
        confidence: compatible ? 'high' : 'medium',
        soilTypeMatch,
        pHMatch,
        drainageMatch,
        notes: compatible
            ? 'Soil conditions are favorable for this tree type'
            : 'Some soil conditions may require amendment'
    };
};

export default {
    getSoilData,
    getClimateData,
    getRiskFactors,
    getEnvironmentalContext,
    checkSoilCompatibility
};
