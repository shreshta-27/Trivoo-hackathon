

import Project from '../Models/Project.js';
import Region from '../Models/Region.js';
import User from '../Models/userSchema.js';

export const getAllProjects = async (req, res) => {
    try {
        const { region, manager, riskLevel, status, minHealth, maxHealth } = req.query;

        const filter = {};

        if (region) filter.region = region;
        if (manager) filter.manager = manager;
        if (riskLevel) filter.riskLevel = riskLevel;
        if (status) filter.status = status;

        if (minHealth || maxHealth) {
            filter.healthScore = {};
            if (minHealth) filter.healthScore.$gte = parseInt(minHealth);
            if (maxHealth) filter.healthScore.$lte = parseInt(maxHealth);
        }

        const projects = await Project.find(filter)
            .populate('region', 'name')
            .populate('manager', 'name email')
            .sort({ healthScore: 1 }); // Lowest health first

        res.status(200).json({
            success: true,
            count: projects.length,
            data: projects
        });
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch projects',
            error: error.message
        });
    }
};

export const getProjectById = async (req, res) => {
    try {
        const { id } = req.params;

        const project = await Project.findById(id)
            .populate('region', 'name coordinates')
            .populate('manager', 'name email profession')
            .populate('careHistory.performedBy', 'name');

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        res.status(200).json({
            success: true,
            data: project
        });
    } catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch project',
            error: error.message
        });
    }
};

export const createProject = async (req, res) => {
    try {
        const {
            name,
            location,
            region,
            manager,
            healthScore,
            plantationSize,
            treeType,
            metadata
        } = req.body;

        if (!name || !location || !region || !manager || !plantationSize || !treeType) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        const regionExists = await Region.findById(region);
        if (!regionExists) {
            return res.status(404).json({
                success: false,
                message: 'Region not found'
            });
        }

        const managerExists = await User.findById(manager);
        if (!managerExists) {
            return res.status(404).json({
                success: false,
                message: 'Manager not found'
            });
        }

        const project = await Project.create({
            name,
            location,
            region,
            manager,
            healthScore: healthScore || 75,
            plantationSize,
            treeType,
            metadata,
            status: 'active'
        });

        regionExists.projects.push(project._id);
        await regionExists.save();

        await regionExists.calculateRegionRisk();
        await regionExists.save();

        const populatedProject = await Project.findById(project._id)
            .populate('region', 'name')
            .populate('manager', 'name email');

        res.status(201).json({
            success: true,
            message: 'Project created successfully',
            data: populatedProject
        });
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create project',
            error: error.message
        });
    }
};

export const updateProjectHealth = async (req, res) => {
    try {
        const { id } = req.params;
        const { healthScore, risks, careAction } = req.body;

        if (healthScore === undefined || healthScore < 0 || healthScore > 100) {
            return res.status(400).json({
                success: false,
                message: 'Invalid health score (must be 0-100)'
            });
        }

        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        project.healthScore = healthScore;

        if (risks && Array.isArray(risks)) {
            risks.forEach(risk => {
                project.activeRisks.push({
                    type: risk.type,
                    severity: risk.severity,
                    description: risk.description
                });
            });
        }

        if (careAction) {
            project.careHistory.push({
                action: careAction.action,
                description: careAction.description,
                performedBy: careAction.performedBy || req.user?._id
            });
        }

        await project.save();

        const region = await Region.findById(project.region);
        if (region) {
            await region.calculateRegionRisk();
            await region.save();
        }

        const updatedProject = await Project.findById(id)
            .populate('region', 'name')
            .populate('manager', 'name email');

        res.status(200).json({
            success: true,
            message: 'Project health updated successfully',
            data: updatedProject
        });
    } catch (error) {
        console.error('Error updating project health:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update project health',
            error: error.message
        });
    }
};

export const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;

        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        project.status = 'abandoned';
        await project.save();

        const region = await Region.findById(project.region);
        if (region) {
            region.projects = region.projects.filter(p => p.toString() !== id);
            await region.calculateRegionRisk();
            await region.save();
        }

        res.status(200).json({
            success: true,
            message: 'Project deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete project',
            error: error.message
        });
    }
};

export const getCriticalProjects = async (req, res) => {
    try {
        const criticalProjects = await Project.getCriticalProjects();

        res.status(200).json({
            success: true,
            count: criticalProjects.length,
            data: criticalProjects
        });
    } catch (error) {
        console.error('Error fetching critical projects:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch critical projects',
            error: error.message
        });
    }
};

export default {
    getAllProjects,
    getProjectById,
    createProject,
    updateProjectHealth,
    deleteProject,
    getCriticalProjects
};
