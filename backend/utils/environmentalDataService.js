

import EnvironmentalData from '../Models/EnvironmentalData.js';
import axios from 'axios';

export const getSoilData = async (longitude, latitude) => {
    const envData = await EnvironmentalData.findNearLocation(longitude, latitude);

    if (envData) {
        return envData.soilData;
    }

    return {
        type: 'loamy',
        pH: 6.5,
        organicMatter: 3.5,
        drainage: 'good'
    };
};

export const getClimateData = async (longitude, latitude) => {
    const envData = await EnvironmentalData.findNearLocation(longitude, latitude);

    if (envData) {
        return envData.climateData;
    }

    if (process.env.OPENWEATHER_API_KEY) {
        try {
            console.log(`🌍 Fetching weather for [${latitude}, ${longitude}] from OpenWeatherMap...`);
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`;
            const response = await axios.get(url, { timeout: 5000 });
            const data = response.data;

            let zone = 'subtropical';
            if (data.main.temp > 28) zone = 'tropical';
            else if (data.main.temp < 15) zone = 'temperate';
            else if (data.main.humidity < 40) zone = 'arid';

            return {
                averageRainfall: 1200, // API doesn't give annual average, keeping default
                temperatureRange: {
                    min: data.main.temp_min,
                    max: data.main.temp_max
                },
                humidity: data.main.humidity,
                climateZone: zone,
                isRealData: true,
                description: data.weather[0].description
            };
        } catch (error) {
            console.warn(`⚠️ OpenWeatherMap API error: ${error.message}. Using mock data.`);
        }
    }

    const mockClimate = {
        averageRainfall: 1200,
        temperatureRange: {
            min: 15,
            max: 35
        },
        humidity: 65,
        climateZone: 'subtropical'
    };

    if (latitude > 28) {
        mockClimate.climateZone = 'temperate';
        mockClimate.temperatureRange = { min: 5, max: 40 };
        mockClimate.averageRainfall = 800;
    } else if (latitude < 15) {
        mockClimate.climateZone = 'tropical';
        mockClimate.temperatureRange = { min: 20, max: 35 };
        mockClimate.averageRainfall = 2000;
    }

    if (longitude < 75) {
        mockClimate.averageRainfall *= 0.6;
        if (mockClimate.averageRainfall < 500) {
            mockClimate.climateZone = 'arid';
        }
    }

    return mockClimate;
};

export const getRiskFactors = async (longitude, latitude) => {
    const envData = await EnvironmentalData.findNearLocation(longitude, latitude);

    if (envData && envData.riskFactors) {
        return envData.riskFactors;
    }

    const risks = [];

    const climate = await getClimateData(longitude, latitude);

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

    if (climate.temperatureRange.max > 38 && climate.averageRainfall < 800) {
        risks.push({
            type: 'fire',
            probability: 'medium',
            season: 'summer'
        });
    }

    if (climate.averageRainfall > 1800) {
        risks.push({
            type: 'flood',
            probability: 'medium',
            season: 'monsoon'
        });
    }

    if (climate.climateZone === 'tropical') {
        risks.push({
            type: 'pest',
            probability: 'medium',
            season: 'all year'
        });
    }

    return risks;
};

export const getEnvironmentalContext = async (longitude, latitude) => {
    let envData = await EnvironmentalData.findNearLocation(longitude, latitude);

    if (!envData) {
        console.log(`🌍 Creating new environmental data for [${latitude}, ${longitude}]`);

        const climate = await getClimateData(longitude, latitude);
        const soil = await getSoilData(longitude, latitude);
        const risks = await getRiskFactors(longitude, latitude);

        const source = (climate.isRealData) ? 'api' : 'mock';

        envData = await EnvironmentalData.create({
            location: {
                type: 'Point',
                coordinates: [longitude, latitude]
            },
            soilData: soil,
            climateData: {
                averageRainfall: climate.averageRainfall,
                temperatureRange: climate.temperatureRange,
                humidity: climate.humidity,
                climateZone: climate.climateZone
            },
            riskFactors: risks,
            dataSource: source
        });

        if (climate.isRealData) {
            envData.climateData.isRealData = true;
        }
    } else {
        if (envData.dataSource === 'api') {
        }
    }

    return {
        location: {
            longitude,
            latitude
        },
        soil: envData.soilData,
        climate: {
            ...envData.climateData,
            isRealData: envData.dataSource === 'api' // Explicitly set flag
        },
        risks: envData.riskFactors,
        dataSource: envData.dataSource,
        lastUpdated: envData.lastUpdated
    };
};

export const checkSoilCompatibility = (soilData, treeType) => {
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
