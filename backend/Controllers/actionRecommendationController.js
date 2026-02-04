import Project from '../Models/Project.js';
import ActionRecommendation from '../Models/ActionRecommendation.js';
import RiskSignal from '../Models/RiskSignal.js';
import MaintenanceAction from '../Models/MaintenanceAction.js';
import { getEnvironmentalContext } from '../utils/environmentalDataService.js';
import { generateActionRecommendations } from '../aiAgents/actionRecommendationAgent.js';

export const triggerActionRecommendation = async (req, res) => {
    try {
        const { projectId } = req.params;

        const project = await Project.findById(projectId)
            .populate('healthHistory')
            .populate('maintenanceActions');

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

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

        const savedRecommendations = [];
        for (const rec of recommendations) {
            const expiresAt = new Date();
            if (rec.timeWindow) {
                const multiplier = rec.timeWindow.unit === 'hours' ? 1 : rec.timeWindow.unit === 'days' ? 24 : 168;
                expiresAt.setHours(expiresAt.getHours() + (rec.timeWindow.value * multiplier));
            } else {
                expiresAt.setDate(expiresAt.getDate() + 7);
            }

            const recommendation = await ActionRecommendation.create({
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

            savedRecommendations.push(recommendation);

            // Trigger Alert if Critical
            if (rec.urgency === 'critical' || rec.urgency === 'immediate') {
                import('./alertController.js').then(({ triggerAlert }) => {
                    triggerAlert({
                        userId: project.userId || project.manager, // Flexibly handle owner field
                        projectId: projectId,
                        riskType: 'action_urgent',
                        severity: 'critical',
                        projectName: project.name,
                        location: 'Plantation Site', // ideally real location name
                        issueDescription: rec.reasoning,
                        actionRecommendation: rec.action
                    });
                }).catch(err => console.error('Alert trigger failed:', err));
            }
        }

        res.status(200).json({
            success: true,
            message: 'Action recommendations generated',
            count: savedRecommendations.length,
            data: savedRecommendations
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to generate recommendations',
            error: error.message
        });
    }
};

export const getActiveRecommendations = async (req, res) => {
    try {
        const { projectId } = req.params;

        const recommendations = await ActionRecommendation.find({
            project: projectId,
            status: 'pending',
            expiresAt: { $gt: new Date() }
        }).sort({ priority: -1, createdAt: -1 });

        res.status(200).json({
            success: true,
            count: recommendations.length,
            data: recommendations
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch recommendations',
            error: error.message
        });
    }
};

export const getUserRecommendations = async (req, res) => {
    try {
        const { userId } = req.params;

        const projects = await Project.find({ manager: userId });
        const projectIds = projects.map(p => p._id);

        const recommendations = await ActionRecommendation.find({
            project: { $in: projectIds },
            status: 'pending',
            expiresAt: { $gt: new Date() }
        })
            .populate('project', 'name treeType healthScore')
            .sort({ priority: -1, urgency: -1 });

        const grouped = {
            critical: recommendations.filter(r => r.urgency === 'critical'),
            high: recommendations.filter(r => r.urgency === 'high'),
            medium: recommendations.filter(r => r.urgency === 'medium'),
            low: recommendations.filter(r => r.urgency === 'low')
        };

        res.status(200).json({
            success: true,
            total: recommendations.length,
            byUrgency: {
                critical: grouped.critical.length,
                high: grouped.high.length,
                medium: grouped.medium.length,
                low: grouped.low.length
            },
            data: grouped
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user recommendations',
            error: error.message
        });
    }
};

export const markRecommendationComplete = async (req, res) => {
    try {
        const { recommendationId } = req.params;
        const { maintenanceActionId } = req.body;

        const recommendation = await ActionRecommendation.findById(recommendationId);
        if (!recommendation) {
            return res.status(404).json({
                success: false,
                message: 'Recommendation not found'
            });
        }

        recommendation.status = 'completed';
        recommendation.completedAt = new Date();
        await recommendation.save();

        if (maintenanceActionId) {
            await MaintenanceAction.findByIdAndUpdate(maintenanceActionId, {
                wasRecommended: true,
                recommendationId: recommendationId
            });
        }

        res.status(200).json({
            success: true,
            message: 'Recommendation marked as completed',
            data: recommendation
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update recommendation',
            error: error.message
        });
    }
};

export const getRiskSignals = async (req, res) => {
    try {
        const { projectId } = req.params;

        const signals = await RiskSignal.find({
            project: projectId,
            isActive: true
        }).sort({ detectedAt: -1 });

        res.status(200).json({
            success: true,
            count: signals.length,
            data: signals
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch risk signals',
            error: error.message
        });
    }
};

export default {
    triggerActionRecommendation,
    getActiveRecommendations,
    getUserRecommendations,
    markRecommendationComplete,
    getRiskSignals
};
