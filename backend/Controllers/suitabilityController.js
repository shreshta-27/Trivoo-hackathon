import SuitabilityReport from '../Models/SuitabilityReport.js';
import { getEnvironmentalContext } from '../utils/environmentalDataService.js';
import { analyzeSuitability } from '../aiAgents/suitabilityAgent.js';

export const evaluateSuitability = async (req, res) => {
    try {
        const {
            projectName,
            location,
            plantationSize,
            treeType,
            userId
        } = req.body;

        // Validate required fields
        if (!projectName || !location || !plantationSize || !treeType) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: projectName, location, plantationSize, treeType'
            });
        }

        // Validate location format
        if (!location.coordinates || location.coordinates.length !== 2) {
            return res.status(400).json({
                success: false,
                message: 'Invalid location format. Expected: { coordinates: [longitude, latitude] }'
            });
        }

        const [longitude, latitude] = location.coordinates;

        // Validate coordinates
        if (longitude < -180 || longitude > 180 || latitude < -90 || latitude > 90) {
            return res.status(400).json({
                success: false,
                message: 'Invalid coordinates. Longitude: -180 to 180, Latitude: -90 to 90'
            });
        }

        // Validate plantation size
        if (plantationSize < 1) {
            return res.status(400).json({
                success: false,
                message: 'Plantation size must be at least 1'
            });
        }

        console.log(`\n📍 Suitability evaluation requested for: ${projectName}`);
        console.log(`Location: ${latitude}, ${longitude}`);

        const CACHE_RADIUS_METERS = 500;
        const CACHE_VALIDITY_DAYS = 30;

        const cachedReport = await SuitabilityReport.findOne({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [longitude, latitude]
                    },
                    $maxDistance: CACHE_RADIUS_METERS
                }
            },
            'projectDetails.treeType': treeType,
            'projectDetails.plantationSize': {
                $gte: plantationSize * 0.8,
                $lte: plantationSize * 1.2
            },
            createdAt: {
                $gt: new Date(Date.now() - CACHE_VALIDITY_DAYS * 24 * 60 * 60 * 1000)
            }
        }).sort({ createdAt: -1 });

        if (cachedReport) {
            console.log(`⚡ CACHE HIT: Using existing report from ${cachedReport.createdAt.toISOString()}`);
            console.log(`   Original Project: ${cachedReport.projectDetails.name}`);

            const newReport = await SuitabilityReport.create({
                user: userId || req.user?._id,
                location: {
                    type: 'Point',
                    coordinates: [longitude, latitude]
                },
                projectDetails: {
                    name: projectName,
                    plantationSize,
                    treeType
                },
                environmentalContext: cachedReport.environmentalContext,
                suitabilityStatus: cachedReport.suitabilityStatus,
                reasoning: cachedReport.reasoning,
                recommendations: {
                    ...cachedReport.recommendations,
                    estimatedLabor: Math.ceil(plantationSize / 100),
                    estimatedCost: plantationSize * 50
                },
                riskWarnings: cachedReport.riskWarnings,
                aiMetadata: {
                    ...cachedReport.aiMetadata,
                    model: cachedReport.aiMetadata?.model + ' (cached)',
                    processingTime: 0
                }
            });

            return res.status(200).json({
                success: true,
                message: 'Suitability analysis completed (from cache)',
                data: {
                    reportId: newReport._id,
                    suitabilityStatus: newReport.suitabilityStatus,
                    reasoning: newReport.reasoning,
                    recommendations: newReport.recommendations,
                    riskWarnings: newReport.riskWarnings,
                    environmentalContext: newReport.environmentalContext,
                    aiMetadata: newReport.aiMetadata
                }
            });
        }

        console.log('💨 CACHE MISS: Proceeding with fresh analysis...');

        const environmentalContext = await getEnvironmentalContext(longitude, latitude);

        console.log(`✓ Environmental data fetched (${environmentalContext.dataSource})`);

        const projectDetails = {
            name: projectName,
            plantationSize,
            treeType
        };

        const recommendation = await analyzeSuitability(projectDetails, environmentalContext);

        const report = await SuitabilityReport.create({
            user: userId || req.user?._id,
            location: {
                type: 'Point',
                coordinates: [longitude, latitude]
            },
            projectDetails: {
                name: projectName,
                plantationSize,
                treeType
            },
            environmentalContext: {
                soilType: environmentalContext.soil.type,
                pH: environmentalContext.soil.pH,
                rainfall: environmentalContext.climate.averageRainfall,
                temperature: environmentalContext.climate.temperatureRange,
                climateZone: environmentalContext.climate.climateZone
            },
            suitabilityStatus: recommendation.suitabilityStatus,
            reasoning: recommendation.reasoning,
            recommendations: recommendation.recommendations,
            riskWarnings: recommendation.riskWarnings,
            aiMetadata: recommendation.aiMetadata
        });

        console.log(`✅ Report saved with ID: ${report._id}\n`);

        // Step 5: Return response
        res.status(200).json({
            success: true,
            message: 'Suitability analysis completed',
            data: {
                reportId: report._id,
                suitabilityStatus: recommendation.suitabilityStatus,
                reasoning: recommendation.reasoning,
                recommendations: recommendation.recommendations,
                riskWarnings: recommendation.riskWarnings,
                environmentalContext: {
                    soil: environmentalContext.soil,
                    climate: environmentalContext.climate,
                    risks: environmentalContext.risks
                },
                aiMetadata: recommendation.aiMetadata
            }
        });
    } catch (error) {
        console.error('❌ Error in suitability evaluation:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to evaluate suitability',
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

/**
 * Get suitability report history for a user
 * @route GET /api/suitability/history
 */
export const getSuitabilityHistory = async (req, res) => {
    try {
        const { userId, limit = 10, status } = req.query;

        const user = userId || req.user?._id;

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        // Build filter
        const filter = { user };
        if (status) {
            filter.suitabilityStatus = status;
        }

        const reports = await SuitabilityReport.find(filter)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .select('-aiMetadata'); // Exclude AI metadata for cleaner response

        res.status(200).json({
            success: true,
            count: reports.length,
            data: reports
        });
    } catch (error) {
        console.error('Error fetching suitability history:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch suitability history',
            error: error.message
        });
    }
};

/**
 * Get a specific suitability report by ID
 * @route GET /api/suitability/reports/:id
 */
export const getSuitabilityReport = async (req, res) => {
    try {
        const { id } = req.params;

        const report = await SuitabilityReport.findById(id)
            .populate('user', 'name email');

        if (!report) {
            return res.status(404).json({
                success: false,
                message: 'Report not found'
            });
        }

        res.status(200).json({
            success: true,
            data: report
        });
    } catch (error) {
        console.error('Error fetching suitability report:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch suitability report',
            error: error.message
        });
    }
};

/**
 * Get statistics about suitability evaluations
 * @route GET /api/suitability/stats
 */
export const getSuitabilityStats = async (req, res) => {
    try {
        const totalReports = await SuitabilityReport.countDocuments();

        const statusCounts = await SuitabilityReport.aggregate([
            {
                $group: {
                    _id: '$suitabilityStatus',
                    count: { $sum: 1 }
                }
            }
        ]);

        const avgConfidence = await SuitabilityReport.aggregate([
            {
                $group: {
                    _id: null,
                    avgConfidence: { $avg: '$aiMetadata.confidence' },
                    avgProcessingTime: { $avg: '$aiMetadata.processingTime' }
                }
            }
        ]);

        const recentReports = await SuitabilityReport.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('projectDetails.name suitabilityStatus createdAt')
            .populate('user', 'name');

        res.status(200).json({
            success: true,
            data: {
                totalReports,
                statusBreakdown: statusCounts.reduce((acc, item) => {
                    acc[item._id] = item.count;
                    return acc;
                }, {}),
                averageConfidence: avgConfidence[0]?.avgConfidence || 0,
                averageProcessingTime: avgConfidence[0]?.avgProcessingTime || 0,
                recentReports
            }
        });
    } catch (error) {
        console.error('Error fetching suitability stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch suitability statistics',
            error: error.message
        });
    }
};

export default {
    evaluateSuitability,
    getSuitabilityHistory,
    getSuitabilityReport,
    getSuitabilityStats
};
