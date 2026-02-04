import { runNewsIntelligencePipeline } from '../aiAgents/newsIntelligenceAgent.js';
import Incident from '../Models/Incident.js';
import ProjectIncidentMatch from '../Models/ProjectIncidentMatch.js';
import { fetchEnvironmentalNews } from '../utils/newsService.js';

export const triggerNewsAnalysis = async (req, res) => {
    try {
        console.log('📰 Triggering news intelligence pipeline...');

        const result = await runNewsIntelligencePipeline();

        if (result.success) {
            if (result.matches && result.matches.length > 0) {
                import('./alertController.js').then(async ({ triggerAlert }) => {
                    for (const match of result.matches) {
                        if (['high', 'critical'].includes(match.impact.impactLevel)) {
                            if (match.project.manager) {
                                await triggerAlert({
                                    userId: match.project.manager,
                                    projectId: match.project._id,
                                    riskType: 'incident_high_risk',
                                    severity: match.impact.impactLevel,
                                    projectName: match.project.name,
                                    location: match.incident.location.text,
                                    issueDescription: `${match.incident.classification.type}: ${match.incident.classification.summary}`,
                                    actionRecommendation: match.generatedInsight.actionableAdvice
                                });
                            }
                        }
                    }
                }).catch(err => console.error('Alert trigger failed:', err));
            }

            res.status(200).json({
                success: true,
                message: 'News analysis complete',
                data: {
                    insightsGenerated: result.insightsCount,
                    errors: result.errors
                }
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'News analysis pipeline encountered errors',
                errors: result.errors
            });
        }
    } catch (error) {
        console.error('Error triggering news analysis:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during news analysis',
            error: error.message
        });
    }
};

export const getProjectIncidents = async (req, res) => {
    try {
        const { projectId } = req.params;

        const matches = await ProjectIncidentMatch.find({ project: projectId })
            .populate('incident')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: matches.length,
            data: matches.map(m => ({
                matchId: m._id,
                incident: m.incident,
                impact: m.impactLevel,
                proximity: m.proximityKm,
                insight: m.insight,
                aiReasoning: m.aiReasoning,
                dateMatched: m.createdAt
            }))
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch project incidents',
            error: error.message
        });
    }
};

export const getUserIncidents = async (req, res) => {
    try {
        const matches = await ProjectIncidentMatch.find()
            .populate('incident')
            .populate('project', 'name location')
            .sort({ 'incident.createdAt': -1 })
            .limit(20);

        res.status(200).json({
            success: true,
            count: matches.length,
            data: matches
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user incidents',
            error: error.message
        });
    }
};

export const getDailyNewsFeed = async (req, res) => {
    try {
        const news = await fetchEnvironmentalNews();

        const keywords = ['forest', 'tree', 'fire', 'drought', 'rain', 'climate', 'plantation'];
        const filtered = news.filter(article => {
            const text = (article.title + " " + article.description).toLowerCase();
            return keywords.some(k => text.includes(k));
        });

        res.status(200).json({
            success: true,
            count: filtered.length,
            data: filtered
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch news feed',
            error: error.message
        });
    }
};

export default {
    triggerNewsAnalysis,
    getProjectIncidents,
    getUserIncidents,
    getDailyNewsFeed
};
