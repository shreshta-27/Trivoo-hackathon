/**
 * Map Controller
 * Handles map visualization data and region information
 */

import Region from '../Models/Region.js';
import Project from '../Models/Project.js';
import { getRiskColor, getRiskDescription } from '../utils/riskCalculator.js';

/**
 * Get all map data (regions with risk levels and projects)
 * @route GET /api/map/data
 */
export const getMapData = async (req, res) => {
    try {
        // Fetch all regions with populated projects
        const regions = await Region.find()
            .populate({
                path: 'projects',
                match: { status: 'active' },
                select: 'name location healthScore riskLevel treeType plantationSize activeRisks'
            });

        // Calculate risk for each region and format response
        const mapData = await Promise.all(
            regions.map(async (region) => {
                // Calculate region risk based on projects
                await region.calculateRegionRisk();
                await region.save();

                // Format project data
                const projectsData = region.projects.map(project => ({
                    id: project._id,
                    name: project.name,
                    location: project.location,
                    healthScore: project.healthScore,
                    riskLevel: project.riskLevel,
                    treeType: project.treeType,
                    plantationSize: project.plantationSize,
                    activeRisks: project.activeRisks.map(risk => ({
                        type: risk.type,
                        severity: risk.severity
                    }))
                }));

                // Aggregate risk types across all projects
                const riskTypes = new Set();
                region.projects.forEach(project => {
                    project.activeRisks.forEach(risk => {
                        riskTypes.add(risk.type);
                    });
                });

                return {
                    id: region._id,
                    name: region.name,
                    coordinates: region.coordinates,
                    riskLevel: region.riskLevel,
                    riskColor: getRiskColor(region.riskLevel),
                    riskDescription: getRiskDescription(region.riskLevel),
                    activeRiskTypes: Array.from(riskTypes),
                    projectCount: region.projects.length,
                    projects: projectsData,
                    metadata: region.metadata
                };
            })
        );

        res.status(200).json({
            success: true,
            count: mapData.length,
            data: mapData
        });
    } catch (error) {
        console.error('Error fetching map data:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch map data',
            error: error.message
        });
    }
};

/**
 * Get detailed information for a specific region
 * @route GET /api/map/regions/:id
 */
export const getRegionDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const region = await Region.findById(id)
            .populate({
                path: 'projects',
                match: { status: 'active' },
                populate: {
                    path: 'manager',
                    select: 'name email'
                }
            });

        if (!region) {
            return res.status(404).json({
                success: false,
                message: 'Region not found'
            });
        }

        // Calculate current risk
        await region.calculateRegionRisk();

        // Get critical projects (health score < 50)
        const criticalProjects = region.projects.filter(p => p.healthScore < 50);

        // Calculate average health score
        const avgHealthScore = region.projects.length > 0
            ? region.projects.reduce((sum, p) => sum + p.healthScore, 0) / region.projects.length
            : 0;

        // Aggregate all risks
        const allRisks = [];
        const riskCounts = {};

        region.projects.forEach(project => {
            project.activeRisks.forEach(risk => {
                allRisks.push({
                    projectName: project.name,
                    projectId: project._id,
                    type: risk.type,
                    severity: risk.severity,
                    description: risk.description,
                    detectedAt: risk.detectedAt
                });

                riskCounts[risk.type] = (riskCounts[risk.type] || 0) + 1;
            });
        });

        res.status(200).json({
            success: true,
            data: {
                id: region._id,
                name: region.name,
                coordinates: region.coordinates,
                riskLevel: region.riskLevel,
                riskColor: getRiskColor(region.riskLevel),
                riskDescription: getRiskDescription(region.riskLevel),
                statistics: {
                    totalProjects: region.projects.length,
                    criticalProjects: criticalProjects.length,
                    averageHealthScore: Math.round(avgHealthScore),
                    totalRisks: allRisks.length,
                    riskBreakdown: riskCounts
                },
                projects: region.projects.map(p => ({
                    id: p._id,
                    name: p.name,
                    location: p.location,
                    healthScore: p.healthScore,
                    riskLevel: p.riskLevel,
                    treeType: p.treeType,
                    plantationSize: p.plantationSize,
                    manager: p.manager,
                    activeRisks: p.activeRisks
                })),
                allRisks: allRisks.sort((a, b) =>
                    new Date(b.detectedAt) - new Date(a.detectedAt)
                ),
                metadata: region.metadata
            }
        });
    } catch (error) {
        console.error('Error fetching region details:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch region details',
            error: error.message
        });
    }
};

export default {
    getMapData,
    getRegionDetails
};
