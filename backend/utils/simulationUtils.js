export const generateSimulationScenario = (scenarioType, duration) => {
    const scenarios = {
        drought: {
            rainfallChange: -60,
            temperatureChange: 5,
            maintenanceFrequency: 'normal',
            pestPressure: 'low',
            description: 'Severe drought conditions with minimal rainfall'
        },
        heatwave: {
            rainfallChange: -30,
            temperatureChange: 8,
            maintenanceFrequency: 'normal',
            pestPressure: 'medium',
            description: 'Extreme heat with elevated temperatures'
        },
        flood: {
            rainfallChange: 150,
            temperatureChange: -2,
            maintenanceFrequency: 'normal',
            pestPressure: 'high',
            description: 'Excessive rainfall and waterlogging'
        },
        pest_outbreak: {
            rainfallChange: 0,
            temperatureChange: 0,
            maintenanceFrequency: 'normal',
            pestPressure: 'critical',
            description: 'Major pest infestation'
        },
        neglect: {
            rainfallChange: 0,
            temperatureChange: 0,
            maintenanceFrequency: 'none',
            pestPressure: 'medium',
            description: 'No maintenance or care provided'
        },
        optimal_care: {
            rainfallChange: 0,
            temperatureChange: 0,
            maintenanceFrequency: 'high',
            pestPressure: 'low',
            description: 'Ideal conditions with regular care'
        }
    };

    return scenarios[scenarioType] || scenarios.drought;
};

export const simulateHealthTrajectory = (currentHealth, scenario, duration) => {
    const trajectory = [];
    let health = currentHealth;

    const dailyImpact = calculateDailyImpact(scenario);

    for (let day = 0; day <= duration; day++) {
        if (day > 0) {
            health += dailyImpact;
            health = Math.max(0, Math.min(100, health));
        }

        trajectory.push({
            day,
            score: Math.round(health),
            riskLevel: calculateRiskLevel(health)
        });
    }

    return trajectory;
};

const calculateDailyImpact = (scenario) => {
    let impact = 0;

    if (scenario.rainfallChange < -40) impact -= 0.5;
    else if (scenario.rainfallChange < -20) impact -= 0.3;
    else if (scenario.rainfallChange > 100) impact -= 0.4;

    if (scenario.temperatureChange > 5) impact -= 0.4;
    else if (scenario.temperatureChange > 3) impact -= 0.2;

    if (scenario.maintenanceFrequency === 'none') impact -= 0.3;
    else if (scenario.maintenanceFrequency === 'low') impact -= 0.1;
    else if (scenario.maintenanceFrequency === 'high') impact += 0.2;

    if (scenario.pestPressure === 'critical') impact -= 0.6;
    else if (scenario.pestPressure === 'high') impact -= 0.4;
    else if (scenario.pestPressure === 'medium') impact -= 0.2;

    return impact;
};

const calculateRiskLevel = (health) => {
    if (health > 75) return 'stable';
    if (health >= 50) return 'medium_stress';
    if (health >= 25) return 'high_stress';
    return 'critical_stress';
};

export const identifyProjectedRisks = (scenario, currentRisks) => {
    const risks = [...currentRisks.map(r => r.type)];

    if (scenario.rainfallChange < -40 && !risks.includes('drought')) {
        risks.push('drought');
    }
    if (scenario.rainfallChange > 100 && !risks.includes('water_stress')) {
        risks.push('water_stress');
    }
    if (scenario.temperatureChange > 5 && !risks.includes('fire')) {
        risks.push('fire');
    }
    if (scenario.pestPressure === 'critical' && !risks.includes('pest')) {
        risks.push('pest');
    }
    if (scenario.maintenanceFrequency === 'none' && !risks.includes('soil_degradation')) {
        risks.push('soil_degradation');
    }

    return risks;
};

export const generateMitigationStrategies = (scenario, projectedRisks) => {
    const strategies = [];

    if (scenario.rainfallChange < -40) {
        strategies.push('Install drip irrigation system');
        strategies.push('Apply mulch to retain soil moisture');
        strategies.push('Increase watering frequency to twice daily');
    }

    if (scenario.temperatureChange > 5) {
        strategies.push('Provide shade cloth during peak heat hours');
        strategies.push('Increase watering during hot periods');
    }

    if (scenario.rainfallChange > 100) {
        strategies.push('Improve drainage systems');
        strategies.push('Create raised beds to prevent waterlogging');
    }

    if (scenario.pestPressure === 'critical' || scenario.pestPressure === 'high') {
        strategies.push('Apply organic pest control immediately');
        strategies.push('Introduce beneficial insects');
        strategies.push('Remove infected plants to prevent spread');
    }

    if (scenario.maintenanceFrequency === 'none' || scenario.maintenanceFrequency === 'low') {
        strategies.push('Establish regular maintenance schedule');
        strategies.push('Hire dedicated caretaker');
        strategies.push('Set up automated irrigation');
    }

    return strategies;
};

export default {
    generateSimulationScenario,
    simulateHealthTrajectory,
    identifyProjectedRisks,
    generateMitigationStrategies
};
