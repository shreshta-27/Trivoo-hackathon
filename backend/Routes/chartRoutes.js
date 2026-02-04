import express from 'express';
import Project from '../Models/Project.js';
import {
    formatHealthChartData,
    formatRiskChartData,
    formatMaintenanceChartData,
    formatSuitabilityChartData,
    formatProjectStatsChartData,
    formatEnvironmentalChartData
} from '../utils/chartDataFormatter.js';

const router = express.Router();

/**
 * Get health history chart data for a project
 * GET /api/charts/health/:projectId
 */
router.get('/health/:projectId', async (req, res) => {
    try {
        const { projectId } = req.params;

        const project = await Project.findById(projectId).populate('healthHistory');

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        const chartData = formatHealthChartData(project.healthHistory);

        res.status(200).json({
            success: true,
            message: 'Health chart data retrieved',
            data: chartData,
            chartType: 'line'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get health chart data',
            error: error.message
        });
    }
});

/**
 * Get risk distribution chart data for a project
 * GET /api/charts/risks/:projectId
 */
router.get('/risks/:projectId', async (req, res) => {
    try {
        const { projectId } = req.params;

        const project = await Project.findById(projectId).populate('riskSignals');

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        const chartData = formatRiskChartData(project.riskSignals);

        res.status(200).json({
            success: true,
            message: 'Risk chart data retrieved',
            data: chartData,
            chartType: 'doughnut'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get risk chart data',
            error: error.message
        });
    }
});

/**
 * Get maintenance timeline chart data for a project
 * GET /api/charts/maintenance/:projectId
 */
router.get('/maintenance/:projectId', async (req, res) => {
    try {
        const { projectId } = req.params;

        const project = await Project.findById(projectId).populate('maintenanceActions');

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        const chartData = formatMaintenanceChartData(project.maintenanceActions);

        res.status(200).json({
            success: true,
            message: 'Maintenance chart data retrieved',
            data: chartData,
            chartType: 'bar'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get maintenance chart data',
            error: error.message
        });
    }
});

/**
 * Get project statistics chart data for all user projects
 * GET /api/charts/projects/:userId
 */
router.get('/projects/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const projects = await Project.find({ manager: userId })
            .select('name healthScore plantationSize')
            .limit(10);

        const chartData = formatProjectStatsChartData(projects);

        res.status(200).json({
            success: true,
            message: 'Project stats chart data retrieved',
            data: chartData,
            chartType: 'bar'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get project stats chart data',
            error: error.message
        });
    }
});

export default router;
