import Project from '../Models/Project.js';
import ProjectInsight from '../Models/ProjectInsight.js';
import MaintenanceAction from '../Models/MaintenanceAction.js';
import HealthHistory from '../Models/HealthHistory.js';
import Simulation from '../Models/Simulation.js';
import { generateHealthSummary } from '../utils/lifecycleUtils.js';
import {
    formatHealthChartData,
    formatRiskChartData,
    formatMaintenanceChartData,
    formatProjectStatsChartData
} from '../utils/chartDataFormatter.js';

export const getProjectStatistics = async (req, res) => {
    try {
        const { projectId } = req.params;

        const project = await Project.findById(projectId)
            .populate('healthHistory')
            .populate('insights')
            .populate('maintenanceActions');

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        const healthSummary = generateHealthSummary(project.healthHistory);

        const activeInsights = project.insights.filter(i => i.isActive).length;
        const totalMaintenance = project.maintenanceActions.length;
        const maintenanceByType = project.maintenanceActions.reduce((acc, action) => {
            acc[action.actionType] = (acc[action.actionType] || 0) + 1;
            return acc;
        }, {});

        const statistics = {
            projectId: project._id,
            projectName: project.name,
            health: {
                current: project.healthScore,
                average: healthSummary.average,
                trend: healthSummary.trend,
                volatility: healthSummary.volatility,
                lowest: healthSummary.lowestScore,
                highest: healthSummary.highestScore,
                recordCount: healthSummary.recordCount
            },
            risks: {
                current: project.activeRisks.length,
                types: project.activeRisks.map(r => r.type),
                riskLevel: project.riskLevel
            },
            insights: {
                active: activeInsights,
                total: project.insights.length,
                lastUpdate: project.lastInsightUpdate
            },
            maintenance: {
                total: totalMaintenance,
                byType: maintenanceByType,
                lastAction: project.lastMaintenanceDate
            }
        };

        const chartData = {
            healthChart: formatHealthChartData(project.healthHistory),
            maintenanceChart: formatMaintenanceChartData(project.maintenanceActions)
        };

        res.status(200).json({
            success: true,
            data: statistics,
            charts: chartData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch project statistics',
            error: error.message
        });
    }
};

export const getUserDashboard = async (req, res) => {
    try {
        const { userId } = req.params;

        const projects = await Project.find({ manager: userId, status: 'active' })
            .populate('healthHistory')
            .populate('insights');

        const totalProjects = projects.length;
        const criticalProjects = projects.filter(p => p.riskLevel === 'critical_stress').length;
        const highRiskProjects = projects.filter(p => p.riskLevel === 'high_stress').length;
        const stableProjects = projects.filter(p => p.riskLevel === 'stable').length;

        const averageHealth = projects.reduce((sum, p) => sum + p.healthScore, 0) / (totalProjects || 1);

        const activeInsights = await ProjectInsight.countDocuments({
            project: { $in: projects.map(p => p._id) },
            isActive: true
        });

        const recentMaintenance = await MaintenanceAction.find({
            project: { $in: projects.map(p => p._id) }
        })
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('project', 'name')
            .populate('performedBy', 'name');

        const dashboard = {
            overview: {
                totalProjects,
                criticalProjects,
                highRiskProjects,
                stableProjects,
                averageHealth: Math.round(averageHealth)
            },
            insights: {
                activeCount: activeInsights,
                requiresAttention: criticalProjects + highRiskProjects
            },
            recentActivity: recentMaintenance,
            projectBreakdown: projects.map(p => ({
                id: p._id,
                name: p.name,
                health: p.healthScore,
                riskLevel: p.riskLevel,
                activeRisks: p.activeRisks.length,
                lastMaintenance: p.lastMaintenanceDate
            }))
        };

        const chartData = {
            projectsOverview: formatProjectStatsChartData(projects),
            healthTrend: formatHealthChartData(
                projects.flatMap(p => p.healthHistory).sort((a, b) => a.recordedAt - b.recordedAt)
            )
        };

        res.status(200).json({
            success: true,
            data: dashboard,
            charts: chartData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard',
            error: error.message
        });
    }
};

export const getInsightAnalytics = async (req, res) => {
    try {
        const { userId } = req.params;

        const projects = await Project.find({ manager: userId });
        const projectIds = projects.map(p => p._id);

        const insights = await ProjectInsight.find({
            project: { $in: projectIds }
        });

        const byType = insights.reduce((acc, insight) => {
            acc[insight.insightType] = (acc[insight.insightType] || 0) + 1;
            return acc;
        }, {});

        const byUrgency = insights.reduce((acc, insight) => {
            acc[insight.urgency] = (acc[insight.urgency] || 0) + 1;
            return acc;
        }, {});

        const activeInsights = insights.filter(i => i.isActive);
        const resolvedInsights = insights.filter(i => !i.isActive);

        const analytics = {
            total: insights.length,
            active: activeInsights.length,
            resolved: resolvedInsights.length,
            byType,
            byUrgency,
            recentInsights: insights
                .sort((a, b) => b.createdAt - a.createdAt)
                .slice(0, 5)
                .map(i => ({
                    id: i._id,
                    type: i.insightType,
                    title: i.title,
                    urgency: i.urgency,
                    createdAt: i.createdAt
                }))
        };

        res.status(200).json({
            success: true,
            data: analytics
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch insight analytics',
            error: error.message
        });
    }
};

export const getMaintenanceAnalytics = async (req, res) => {
    try {
        const { userId } = req.params;

        const projects = await Project.find({ manager: userId });
        const projectIds = projects.map(p => p._id);

        const actions = await MaintenanceAction.find({
            project: { $in: projectIds }
        });

        const byType = actions.reduce((acc, action) => {
            acc[action.actionType] = (acc[action.actionType] || 0) + 1;
            return acc;
        }, {});

        const effectivenessStats = actions
            .filter(a => a.aiFeedback?.effectiveness)
            .reduce((acc, action) => {
                acc[action.aiFeedback.effectiveness] = (acc[action.aiFeedback.effectiveness] || 0) + 1;
                return acc;
            }, {});

        const recommendedActions = actions.filter(a => a.wasRecommended).length;
        const proactiveActions = actions.filter(a => !a.wasRecommended).length;

        const analytics = {
            total: actions.length,
            byType,
            effectiveness: effectivenessStats,
            recommended: recommendedActions,
            proactive: proactiveActions,
            recentActions: actions
                .sort((a, b) => b.createdAt - a.createdAt)
                .slice(0, 10)
                .map(a => ({
                    id: a._id,
                    type: a.actionType,
                    description: a.description,
                    effectiveness: a.aiFeedback?.effectiveness,
                    createdAt: a.createdAt
                }))
        };

        const chartData = formatMaintenanceChartData(actions);

        res.status(200).json({
            success: true,
            data: analytics,
            charts: { maintenanceTimeline: chartData }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch maintenance analytics',
            error: error.message
        });
    }
};

export const getSimulationHistory = async (req, res) => {
    try {
        const { projectId } = req.params;

        const simulations = await Simulation.find({ project: projectId })
            .sort({ createdAt: -1 })
            .populate('user', 'name');

        const byScenario = simulations.reduce((acc, sim) => {
            acc[sim.scenarioType] = (acc[sim.scenarioType] || 0) + 1;
            return acc;
        }, {});

        const history = {
            total: simulations.length,
            byScenario,
            simulations: simulations.map(s => ({
                id: s._id,
                scenarioType: s.scenarioType,
                duration: s.duration,
                projectedHealth: s.results.projectedHealthScore,
                outcome: s.results.outcome,
                createdAt: s.createdAt,
                user: s.user
            }))
        };

        res.status(200).json({
            success: true,
            data: history
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch simulation history',
            error: error.message
        });
    }
};

export default {
    getProjectStatistics,
    getUserDashboard,
    getInsightAnalytics,
    getMaintenanceAnalytics,
    getSimulationHistory
};
