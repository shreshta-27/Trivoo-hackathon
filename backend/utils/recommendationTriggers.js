import Project from '../Models/Project.js';
import ActionRecommendation from '../Models/ActionRecommendation.js';
import { getEnvironmentalContext } from '../utils/environmentalDataService.js';
import { generateActionRecommendations } from '../aiAgents/actionRecommendationAgent.js';

export const triggerRecommendationOnHealthChange = async (projectId) => {
    try {
        const project = await Project.findById(projectId)
            .populate('healthHistory')
            .populate('maintenanceActions');

        if (!project) return;

        const [lon, lat] = project.location.coordinates;
        const environmentalData = await getEnvironmentalContext(lon, lat);

        const lastAction = project.maintenanceActions.length > 0
            ? project.maintenanceActions[project.maintenanceActions.length - 1]
            : null;

        const projectContext = {
            project: {
                _id: project._id,
                name: project.name,
                treeType: project.treeType,
                plantationSize: project.plantationSize,
                healthScore: project.healthScore,
                riskLevel: project.riskLevel,
                activeRisks: project.activeRisks,
                metadata: project.metadata
            },
            environmentalData: {
                temperature: environmentalData.climate.temperatureRange,
                rainfall: environmentalData.climate.averageRainfall,
                soil: {
                    type: environmentalData.soil.type,
                    pH: environmentalData.soil.pH,
                    moisture: environmentalData.soil.moisture || 50
                }
            },
            maintenanceHistory: {
                lastAction: lastAction?.createdAt,
                totalActions: project.maintenanceActions.length
            }
        };

        const recommendations = await generateActionRecommendations(projectContext);

        for (const rec of recommendations) {
            const expiresAt = new Date();
            if (rec.timeWindow) {
                const multiplier = rec.timeWindow.unit === 'hours' ? 1 : rec.timeWindow.unit === 'days' ? 24 : 168;
                expiresAt.setHours(expiresAt.getHours() + (rec.timeWindow.value * multiplier));
            } else {
                expiresAt.setDate(expiresAt.getDate() + 7);
            }

            await ActionRecommendation.create({
                project: projectId,
                action: rec.action,
                timeWindow: rec.timeWindow,
                riskAddressed: rec.riskAddressed || [],
                priority: rec.priority,
                urgency: rec.urgency,
                impact: rec.impact,
                effort: rec.effort,
                explanation: rec.explanation,
                reasoning: rec.reasoning || rec.explanation,
                consequences: rec.consequences,
                expiresAt,
                aiMetadata: rec.aiMetadata,
                riskContext: rec.riskContext
            });
        }

        console.log(`✓ Generated ${recommendations.length} recommendations for project ${project.name}`);
    } catch (error) {
        console.error('Failed to trigger recommendation:', error.message);
    }
};

export const triggerRecommendationOnProjectCreation = async (projectId) => {
    setTimeout(async () => {
        await triggerRecommendationOnHealthChange(projectId);
    }, 2000);
};

export default {
    triggerRecommendationOnHealthChange,
    triggerRecommendationOnProjectCreation
};
