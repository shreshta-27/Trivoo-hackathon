import TreeSpecies from '../Models/TreeSpecies.js';
import { simulateScenarios } from '../services/futurescapeLogic.js';
import { compareScenarios } from '../aiAgents/futurescapeAgent.js';

export const runSimulation = async (req, res) => {
    try {
        const { location, timeHorizon, scenarios } = req.body;

        if (!scenarios || scenarios.length === 0) {
            return res.status(400).json({ message: 'No scenarios provided' });
        }

        const speciesNames = [...new Set(scenarios.map(s => s.speciesName))];
        const speciesData = await TreeSpecies.find({ name: { $in: speciesNames } });

        const results = simulateScenarios(scenarios, timeHorizon, speciesData);

        const maxDensity = Math.max(...results.map(r => r.metrics.visual_density));
        const normalizedResults = results.map(r => ({
            ...r,
            mapOverlay: {
                center: location, // [lat, lon]
                intensity: maxDensity > 0 ? (r.metrics.visual_density / maxDensity) : 0,
                radius: Math.sqrt(r.metrics.visual_density) * 10 // Arbitrary scaling for radius
            }
        }));

        const insights = await compareScenarios(normalizedResults, timeHorizon, location, speciesData);

        res.json({
            success: true,
            timeHorizon,
            scenarios: normalizedResults,
            analysis: insights
        });

    } catch (error) {
        console.error('Futurescape Error:', error);
        res.status(500).json({ message: error.message });
    }
};
