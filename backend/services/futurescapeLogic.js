
// Deterministic Logic for Futurescape

// Growth Curve (Logistic-ish simplification)
// 0.0 at year 0, approaching 1.0 at maturity (e.g. 20 years)
const getGrowthFactor = (years, speed) => {
    let maturityYears = 20;
    if (speed === 'Very Fast') maturityYears = 10;
    if (speed === 'Slow') maturityYears = 30;

    // A simple ratio for relative estimation
    let factor = years / maturityYears;
    if (factor > 1) factor = 1 + (factor - 1) * 0.1; // Slow growth after maturity
    return Math.max(0, Math.min(1.2, factor));
};

export const simulateScenarios = (scenarios, timeHorizon, speciesData) => {
    return scenarios.map(scenario => {
        // match species
        const species = speciesData.find(s => s.name === scenario.speciesName) || {
            growth_speed: 'Medium', reforestation_score: 3
        };

        const growth = getGrowthFactor(timeHorizon, species.growth_speed);

        // Relative Impacts
        // 1. Canopy Density (for Map Heatmap Intensity)
        // Assume 1 mature tree covers ~50 sq m? 
        // We just want a relative score 0-1 (normalized later or raw)
        const densityRaw = scenario.treeCount * growth * 1.5;

        // 2. Carbon/Enviro Impact Score
        const impactScore = scenario.treeCount * growth * species.reforestation_score;

        return {
            scenarioId: scenario.id,
            treeCount: scenario.treeCount,
            species: scenario.speciesName,
            timeHorizon,
            metrics: {
                growthFactor: parseFloat(growth.toFixed(2)),
                visual_density: parseFloat(densityRaw.toFixed(1)),
                environmental_score: parseFloat(impactScore.toFixed(1))
            }
        };
    });
};
