import Project from '../Models/Project.js';
import HealthHistory from '../Models/HealthHistory.js';
import ProjectInsight from '../Models/ProjectInsight.js';
import MaintenanceAction from '../Models/MaintenanceAction.js';
import Simulation from '../Models/Simulation.js';
import SuitabilityReport from '../Models/SuitabilityReport.js';
import { getEnvironmentalContext } from '../utils/environmentalDataService.js';
import { generateProjectInsight } from '../aiAgents/projectInsightAgent.js';
import { calculateMaintenanceImpact } from '../utils/lifecycleUtils.js';
import { generateSimulationScenario, simulateHealthTrajectory, identifyProjectedRisks, generateMitigationStrategies } from '../utils/simulationUtils.js';

export const getUserProjects = async (req, res) => {
    try {
        const { userId } = req.params;
        const { status, riskLevel } = req.query;

        const filter = { manager: userId };
        if (status) filter.status = status;
        if (riskLevel) filter.riskLevel = riskLevel;

        const projects = await Project.find(filter)
            .populate('region', 'name')
            .populate('initialContext.aiRecommendation')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: projects.length,
            data: projects
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch projects',
            error: error.message
        });
    }
};

export const getProjectLifecycle = async (req, res) => {
    try {
        const { projectId } = req.params;

        const project = await Project.findById(projectId)
            .populate('region', 'name coordinates')
            .populate('manager', 'name email')
            .populate('initialContext.aiRecommendation')
            .populate({
                path: 'healthHistory',
                options: { sort: { recordedAt: -1 }, limit: 50 }
            })
            .populate({
                path: 'insights',
                match: { isActive: true },
                options: { sort: { createdAt: -1 }, limit: 10 }
            })
            .populate({
                path: 'maintenanceActions',
                populate: { path: 'performedBy', select: 'name' },
                options: { sort: { createdAt: -1 }, limit: 20 }
            })
            .populate({
                path: 'simulations',
                options: { sort: { createdAt: -1 }, limit: 5 }
            });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        const [lon, lat] = project.location.coordinates;
        const currentEnv = await getEnvironmentalContext(lon, lat);

        const lifecycle = {
            overview: {
                id: project._id,
                name: project.name,
                treeType: project.treeType,
                plantationSize: project.plantationSize,
                region: project.region,
                manager: project.manager,
                status: project.status,
                creationSource: project.creationSource,
                createdAt: project.createdAt,
                plantedDate: project.metadata.plantedDate
            },
            currentState: {
                healthScore: project.healthScore,
                riskLevel: project.riskLevel,
                activeRisks: project.activeRisks,
                lastMaintenanceDate: project.lastMaintenanceDate,
                lastInsightUpdate: project.lastInsightUpdate
            },
            healthTimeline: project.healthHistory,
            activeInsights: project.insights,
            maintenanceHistory: project.maintenanceActions,
            simulations: project.simulations,
            initialContext: project.initialContext,
            currentEnvironment: currentEnv
        };

        res.status(200).json({
            success: true,
            data: lifecycle
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch project lifecycle',
            error: error.message
        });
    }
};

export const createProjectFromMap = async (req, res) => {
    try {
        const { suitabilityReportId, projectName, userId } = req.body;

        const suitabilityReport = await SuitabilityReport.findById(suitabilityReportId);
        if (!suitabilityReport) {
            return res.status(404).json({
                success: false,
                message: 'Suitability report not found'
            });
        }

        const [lon, lat] = suitabilityReport.location.coordinates;
        const envContext = await getEnvironmentalContext(lon, lat);

        const project = await Project.create({
            name: projectName,
            location: suitabilityReport.location,
            region: req.body.regionId,
            manager: userId,
            healthScore: 75,
            plantationSize: suitabilityReport.projectDetails.plantationSize,
            treeType: suitabilityReport.projectDetails.treeType,
            creationSource: 'map_ai_assisted',
            initialContext: {
                aiRecommendation: suitabilityReportId,
                environmentalSnapshot: {
                    soilType: envContext.soil.type,
                    pH: envContext.soil.pH,
                    rainfall: envContext.climate.averageRainfall,
                    temperature: envContext.climate.temperatureRange
                }
            },
            metadata: {
                plantedDate: new Date(),
                soilType: envContext.soil.type,
                irrigationSystem: suitabilityReport.recommendations.irrigationNeeds || 'drip'
            }
        });

        const healthRecord = await HealthHistory.create({
            score: 75,
            riskLevel: 'stable',
            recordedAt: new Date(),
            factors: {
                rainfall: envContext.climate.averageRainfall,
                temperature: envContext.climate.temperatureRange.max,
                maintenanceCount: 0,
                activeRisksCount: 0
            }
        });

        project.healthHistory.push(healthRecord._id);
        await project.save();

        res.status(201).json({
            success: true,
            message: 'Project created from AI recommendation',
            data: project
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create project',
            error: error.message
        });
    }
};

export const createProjectManually = async (req, res) => {
    try {
        const { name, location, regionId, userId, plantationSize, treeType, metadata } = req.body;

        const [lon, lat] = location.coordinates;
        const envContext = await getEnvironmentalContext(lon, lat);

        const project = await Project.create({
            name,
            location,
            region: regionId,
            manager: userId,
            healthScore: 75,
            plantationSize,
            treeType,
            creationSource: 'manual_entry',
            initialContext: {
                environmentalSnapshot: {
                    soilType: envContext.soil.type,
                    pH: envContext.soil.pH,
                    rainfall: envContext.climate.averageRainfall,
                    temperature: envContext.climate.temperatureRange
                }
            },
            metadata: {
                plantedDate: metadata?.plantedDate || new Date(),
                soilType: metadata?.soilType || envContext.soil.type,
                irrigationSystem: metadata?.irrigationSystem || 'drip'
            }
        });

        const healthRecord = await HealthHistory.create({
            score: 75,
            riskLevel: 'stable',
            recordedAt: new Date(),
            factors: {
                rainfall: envContext.climate.averageRainfall,
                temperature: envContext.climate.temperatureRange.max,
                maintenanceCount: 0,
                activeRisksCount: 0
            }
        });

        project.healthHistory.push(healthRecord._id);
        await project.save();

        const insightContext = {
            project,
            currentEnv: envContext,
            previousEnv: null,
            previousHealth: null,
            recentMaintenance: 'Project just created'
        };

        try {
            const insight = await generateProjectInsight(insightContext, 'health_change');
            const projectInsight = await ProjectInsight.create({
                project: project._id,
                insightType: 'recommendation',
                title: insight.title,
                description: insight.description,
                reasoning: insight.reasoning,
                actionNeeded: insight.actionNeeded,
                urgency: insight.urgency,
                consequences: insight.consequences,
                aiMetadata: insight.aiMetadata
            });

            project.insights.push(projectInsight._id);
            project.lastInsightUpdate = new Date();
            await project.save();
        } catch (aiError) {
            console.error('AI insight generation failed:', aiError.message);
        }

        res.status(201).json({
            success: true,
            message: 'Project created successfully',
            data: project
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create project',
            error: error.message
        });
    }
};

export const logMaintenanceAction = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { actionType, description, userId, wasRecommended, recommendationId } = req.body;

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        const healthBefore = project.healthScore;

        const action = await MaintenanceAction.create({
            project: projectId,
            actionType,
            description,
            performedBy: userId,
            wasRecommended: wasRecommended || false,
            recommendationId: recommendationId || null,
            timingStatus: wasRecommended ? 'on_time' : 'proactive',
            impact: {
                healthScoreBefore: healthBefore
            }
        });

        const { healthBoost } = calculateMaintenanceImpact(actionType);

        project.healthScore = Math.min(100, project.healthScore + healthBoost);
        project.lastMaintenanceDate = new Date();
        project.maintenanceActions.push(action._id);

        const healthRecord = await HealthHistory.create({
            score: project.healthScore,
            riskLevel: project.riskLevel,
            recordedAt: new Date(),
            factors: {
                maintenanceCount: project.maintenanceActions.length,
                activeRisksCount: project.activeRisks.length
            }
        });

        project.healthHistory.push(healthRecord._id);
        await project.save();

        action.impact.healthScoreAfter = project.healthScore;
        await action.save();

        const [lon, lat] = project.location.coordinates;
        const currentEnv = await getEnvironmentalContext(lon, lat);

        const feedbackContext = {
            project,
            currentEnv,
            action,
            recommendation: recommendationId ? 'Action was recommended by AI' : null
        };

        try {
            const feedback = await generateProjectInsight(feedbackContext, 'maintenance_feedback');
            action.aiFeedback = {
                effectiveness: feedback.effectiveness,
                feedback: feedback.feedback,
                suggestions: feedback.suggestions
            };
            await action.save();
        } catch (aiError) {
            console.error('AI feedback generation failed:', aiError.message);
        }

        res.status(201).json({
            success: true,
            message: 'Maintenance action logged successfully',
            data: {
                action,
                newHealthScore: project.healthScore,
                healthIncrease: healthBoost
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to log maintenance action',
            error: error.message
        });
    }
};

export const updateProjectInsights = async (req, res) => {
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
        const currentEnv = await getEnvironmentalContext(lon, lat);

        const previousHealth = project.healthHistory.length > 1
            ? project.healthHistory[project.healthHistory.length - 2].score
            : project.healthScore;

        const recentMaintenance = project.maintenanceActions.slice(-3)
            .map(m => `${m.actionType} on ${m.createdAt.toDateString()}`)
            .join(', ') || 'No recent maintenance';

        const insightContext = {
            project,
            currentEnv,
            previousEnv: null,
            previousHealth,
            recentMaintenance
        };

        const insight = await generateProjectInsight(insightContext, 'health_change');

        const projectInsight = await ProjectInsight.create({
            project: projectId,
            insightType: 'health_change',
            title: insight.title,
            description: insight.description,
            reasoning: insight.reasoning,
            actionNeeded: insight.actionNeeded,
            urgency: insight.urgency,
            consequences: insight.consequences,
            aiMetadata: insight.aiMetadata
        });

        project.insights.push(projectInsight._id);
        project.lastInsightUpdate = new Date();
        await project.save();

        res.status(200).json({
            success: true,
            message: 'Insights updated successfully',
            data: projectInsight
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update insights',
            error: error.message
        });
    }
};

export const runSimulation = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { scenarioType, duration, userId } = req.body;

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        const scenario = generateSimulationScenario(scenarioType, duration);
        const healthTrajectory = simulateHealthTrajectory(project.healthScore, scenario, duration);
        const projectedRisks = identifyProjectedRisks(scenario, project.activeRisks);
        const mitigationStrategies = generateMitigationStrategies(scenario, projectedRisks);

        const finalHealth = healthTrajectory[healthTrajectory.length - 1].score;
        const outcome = finalHealth > 75
            ? 'Project remains healthy under this scenario'
            : finalHealth > 50
                ? 'Project experiences moderate stress but survives'
                : finalHealth > 25
                    ? 'Project faces significant challenges and may fail without intervention'
                    : 'Critical condition - project likely to fail under this scenario';

        const simulation = await Simulation.create({
            project: projectId,
            user: userId,
            scenarioType,
            duration,
            parameters: scenario,
            results: {
                projectedHealthScore: finalHealth,
                healthTrajectory,
                risksProjected: projectedRisks,
                recommendations: mitigationStrategies,
                outcome
            },
            aiAnalysis: {
                reasoning: `Under ${scenarioType} conditions with ${scenario.description.toLowerCase()}, the project health trajectory shows ${finalHealth > project.healthScore ? 'improvement' : 'decline'}.`,
                criticalPoints: healthTrajectory
                    .filter((_, idx) => idx > 0 && Math.abs(healthTrajectory[idx].score - healthTrajectory[idx - 1].score) > 5)
                    .map(point => `Day ${point.day}: Significant change to ${point.score}% health`),
                mitigationStrategies
            }
        });

        project.simulations.push(simulation._id);
        await project.save();

        res.status(201).json({
            success: true,
            message: 'Simulation completed',
            data: simulation
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to run simulation',
            error: error.message
        });
    }
};

export default {
    getUserProjects,
    getProjectLifecycle,
    createProjectFromMap,
    createProjectManually,
    logMaintenanceAction,
    updateProjectInsights,
    runSimulation
};
