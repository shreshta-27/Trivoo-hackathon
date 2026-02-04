import TreeSpecies from '../Models/TreeSpecies.js';
import { getEnvironmentalContext } from '../aiAgents/environmentalAgent.js';
import { filterSuitableTrees } from '../services/suitabilityLogic.js';
import { explainSuitability } from '../aiAgents/suitabilityExplainerAgent.js';
import { geocodeLocation } from '../utils/geocodingService.js'; // Assuming this exists or I use coordinates directly

export const assessSuitability = async (req, res) => {
    try {
        const { lat, lon, plantationSize, preferredSpecies } = req.body;

        console.log(`🌍 Assessing suitability for [${lat}, ${lon}]...`);

        // 1. Get Environmental Context (AI Estimate)
        // We can optionally reverse geocode to get a place name for the explainer
        // Using a comprehensive prompt or just coords.
        const envData = await getEnvironmentalContext(lat, lon);
        console.log('Environment:', envData);

        // 2. Fetch All Species
        const allTrees = await TreeSpecies.find();

        // 3. Deterministic Filtering
        const suitableTrees = filterSuitableTrees(allTrees, envData);
        console.log(`Found ${suitableTrees.length} suitable species.`);

        // 4. Generate Explanations (AI)
        const explanations = await explainSuitability(suitableTrees, envData, plantationSize, `Coordinate ${lat},${lon}`);

        // 5. Merge Data
        const finalResult = suitableTrees.map(tree => {
            const explanation = explanations.find(e => e.tree_name === tree.name);
            return {
                ...tree,
                match_reason: explanation ? explanation.match_reason : 'Matches environmental criteria.',
                risk_warning: explanation ? explanation.risk_warning : null
            };
        });

        res.json({
            success: true,
            location: { lat, lon },
            environmentalProfile: envData,
            recommendations: finalResult
        });

    } catch (error) {
        console.error('Suitability Assessment Failed:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
