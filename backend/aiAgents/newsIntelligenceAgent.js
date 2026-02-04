import { StateGraph } from "@langchain/langgraph";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import {
    NEWS_INTELLIGENCE_SYSTEM_PROMPT,
    INCIDENT_CLASSIFICATION_PROMPT,
    LOCATION_EXTRACTION_PROMPT,
    IMPACT_ASSESSMENT_PROMPT,
    INSIGHT_GENERATION_PROMPT
} from "./prompts/newsIntelligencePrompts.js";
import { fetchEnvironmentalNews } from "../utils/newsService.js";
import { geocodeLocation } from "../utils/geocodingService.js";
import Project from "../Models/Project.js";
import Incident from "../Models/Incident.js";
import ProjectIncidentMatch from "../Models/ProjectIncidentMatch.js";

const initializeLLM = () => {
    return new ChatGoogleGenerativeAI({
        model: process.env.AI_MODEL || "gemini-pro",
        temperature: 0.3,
        apiKey: process.env.GEMINI_API_KEY
    });
};

class NewsAnalysisState {
    constructor() {
        this.rawArticles = [];
        this.filteredArticles = []; // { article, classification }
        this.locatedIncidents = []; // { article, classification, location, dbIncidentId }
        this.projectMatches = [];   // { incidentId, projectId, distance, impact... }
        this.finalInsights = [];
        this.errors = [];
    }
}

const newsIngestionNode = async (state) => {
    try {
        console.log("📡 Fetching news...");
        const articles = await fetchEnvironmentalNews();
        state.rawArticles = articles;
        return state;
    } catch (error) {
        state.errors.push(`Ingestion error: ${error.message}`);
        return state;
    }
};

const relevanceFilterNode = async (state) => {
    try {
        const keywords = ['forest', 'tree', 'fire', 'drought', 'rain', 'temperature', 'climate', 'logging', 'encroachment', 'farm', 'agriculture', 'plantation'];

        const relevant = state.rawArticles.filter(article => {
            const text = (article.title + " " + article.description).toLowerCase();
            return keywords.some(k => text.includes(k));
        });

        console.log(`🔍 Filtered ${state.rawArticles.length} -> ${relevant.length} relevant articles.`);
        state.filteredArticles = relevant.map(a => ({ article: a })); // Wrap for next steps
        return state;
    } catch (error) {
        state.errors.push(`Filter error: ${error.message}`);
        return state;
    }
};

const incidentClassificationNode = async (state) => {
    try {
        const llm = initializeLLM();
        const classified = [];

        for (const item of state.filteredArticles) {
            const prompt = INCIDENT_CLASSIFICATION_PROMPT
                .replace('{title}', item.article.title)
                .replace('{description}', item.article.description);

            const response = await llm.invoke([
                new SystemMessage(NEWS_INTELLIGENCE_SYSTEM_PROMPT),
                new HumanMessage(prompt)
            ]);

            let content = response.content.replace(/```json/g, '').replace(/```/g, '').trim();
            const analysis = JSON.parse(content);

            if (analysis.isIncident) {
                classified.push({ ...item, classification: analysis });
            }
        }

        console.log(`🧠 Classified ${classified.length} actual incidents.`);
        state.filteredArticles = classified; // Update with only true incidents
        return state;
    } catch (error) {
        state.errors.push(`Classification error: ${error.message}`);
        return state;
    }
};

const locationExtractionNode = async (state) => {
    try {
        const llm = initializeLLM();
        const located = [];

        for (const item of state.filteredArticles) {
            const prompt = LOCATION_EXTRACTION_PROMPT
                .replace('{title}', item.article.title)
                .replace('{description}', item.article.description);

            const response = await llm.invoke([
                new SystemMessage(NEWS_INTELLIGENCE_SYSTEM_PROMPT),
                new HumanMessage(prompt)
            ]);

            let content = response.content.replace(/```json/g, '').replace(/```/g, '').trim();
            const locData = JSON.parse(content);

            const geoResult = await geocodeLocation(locData.locationText);

            if (geoResult.found) {
                located.push({
                    ...item,
                    location: {
                        text: locData.locationText,
                        coordinates: geoResult.coordinates, // [lon, lat]
                        formatted: geoResult.formattedAddress
                    }
                });
            } else {
                console.log(`⚠️ Could not geocode location: ${locData.locationText}`);
            }
        }

        state.locatedIncidents = located;
        return state;
    } catch (error) {
        state.errors.push(`Location error: ${error.message}`);
        return state;
    }
};

const proximityMatcherNode = async (state) => {
    try {
        const matches = [];

        for (const incident of state.locatedIncidents) {
            const allProjects = await Project.find({}, 'name location treeType plantationSize healthScore manager');

            for (const project of allProjects) {
                const dist = calculateDistance(
                    incident.location.coordinates[1], incident.location.coordinates[0],
                    project.location.coordinates[1], project.location.coordinates[0]
                );

                if (dist <= 100) { // 100km radius
                    matches.push({
                        incident: incident,
                        project: project,
                        distance: Math.round(dist)
                    });
                }
            }
        }

        console.log(`🔗 Found ${matches.length} project-incident matches.`);
        state.projectMatches = matches;
        return state;
    } catch (error) {
        state.errors.push(`Matching error: ${error.message}`);
        return state;
    }
};

const impactAssessmentNode = async (state) => {
    try {
        const llm = initializeLLM();
        const assessedMatches = [];

        for (const match of state.projectMatches) {
            const prompt = IMPACT_ASSESSMENT_PROMPT
                .replace('{incidentType}', match.incident.classification.type)
                .replace('{incidentSummary}', match.incident.classification.summary)
                .replace('{incidentLocation}', match.incident.location.text)
                .replace('{distanceKm}', match.distance)
                .replace('{projectName}', match.project.name)
                .replace('{treeType}', match.project.treeType)
                .replace('{projectSize}', match.project.plantationSize)
                .replace('{healthStatus}', match.project.healthScore > 70 ? 'Good' : 'At Risk');

            const response = await llm.invoke([
                new SystemMessage(NEWS_INTELLIGENCE_SYSTEM_PROMPT),
                new HumanMessage(prompt)
            ]);

            let content = response.content.replace(/```json/g, '').replace(/```/g, '').trim();
            const impact = JSON.parse(content);

            if (impact.impactLevel !== 'none') {
                assessedMatches.push({ ...match, impact });
            }
        }

        state.projectMatches = assessedMatches; // Filter down to impactful ones
        return state;
    } catch (error) {
        state.errors.push(`Impact error: ${error.message}`);
        return state;
    }
};

const insightGeneratorNode = async (state) => {
    try {
        const llm = initializeLLM();
        const insights = [];

        for (const match of state.projectMatches) {
            const prompt = INSIGHT_GENERATION_PROMPT
                .replace('{incidentType}', match.incident.classification.type)
                .replace('{incidentLocation}', match.incident.location.text)
                .replace('{impactLevel}', match.impact.impactLevel)
                .replace('{reasoning}', match.impact.reasoning);

            const response = await llm.invoke([
                new SystemMessage(NEWS_INTELLIGENCE_SYSTEM_PROMPT),
                new HumanMessage(prompt)
            ]);

            let content = response.content.replace(/```json/g, '').replace(/```/g, '').trim();
            const insightData = JSON.parse(content);

            insights.push({ ...match, generatedInsight: insightData });
        }

        state.finalInsights = insights;
        return state;
    } catch (error) {
        state.errors.push(`Insight error: ${error.message}`);
        return state;
    }
};

const storeOutputNode = async (state) => {
    try {
        for (const item of state.locatedIncidents) {
            const existing = await Incident.findOne({ title: item.article.title });
            if (!existing) {
                const newIncident = await Incident.create({
                    type: item.classification.type,
                    title: item.article.title,
                    description: item.article.description,
                    location: {
                        type: 'Point',
                        coordinates: item.location.coordinates,
                        formattedAddress: item.location.formatted,
                    },
                    severity: item.classification.severity,
                    source: {
                        name: item.article.source.name,
                        url: item.article.source.url,
                        publishedAt: item.article.publishedAt
                    },
                    aiAnalysis: {
                        modelUsed: "gemini-pro",
                        reasoning: item.classification.summary,
                        keywords: item.classification.keywords
                    }
                });
                item.dbId = newIncident._id; // Save ID for linking
            } else {
                item.dbId = existing._id;
            }
        }

        for (const match of state.finalInsights) {
            const inc = await Incident.findOne({ title: match.incident.article.title });

            if (inc) {
                await ProjectIncidentMatch.updateOne(
                    { incident: inc._id, project: match.project._id },
                    {
                        proximityKm: match.distance,
                        impactLevel: match.impact.impactLevel,
                        insight: {
                            message: match.generatedInsight.message,
                            actionableAdvice: match.generatedInsight.actionableAdvice,
                            riskIncreased: match.impact.riskIncreased
                        },
                        status: 'new',
                        aiReasoning: match.impact.reasoning
                    },
                    { upsert: true }
                );
            }
        }

        console.log("💾 Data stored successfully.");
        return state;

    } catch (error) {
        state.errors.push(`Storage error: ${error.message}`);
        return state;
    }
};

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

export const runNewsIntelligencePipeline = async () => {
    const workflow = new StateGraph({
        channels: {
            rawArticles: null,
            filteredArticles: null,
            locatedIncidents: null,
            projectMatches: null,
            finalInsights: null,
            errors: {
                value: (x, y) => x.concat(y),
                default: () => []
            }
        }
    });

    workflow.addNode("ingest", newsIngestionNode);
    workflow.addNode("filter", relevanceFilterNode);
    workflow.addNode("classify", incidentClassificationNode);
    workflow.addNode("extractLocation", locationExtractionNode);
    workflow.addNode("matchProximity", proximityMatcherNode);
    workflow.addNode("assessImpact", impactAssessmentNode);
    workflow.addNode("generateInsight", insightGeneratorNode);
    workflow.addNode("store", storeOutputNode);

    workflow.addEdge("__start__", "ingest");
    workflow.addEdge("ingest", "filter");
    workflow.addEdge("filter", "classify");
    workflow.addEdge("classify", "extractLocation");
    workflow.addEdge("extractLocation", "matchProximity");
    workflow.addEdge("matchProximity", "assessImpact");
    workflow.addEdge("assessImpact", "generateInsight");
    workflow.addEdge("generateInsight", "store");
    workflow.addEdge("store", "__end__");

    const app = workflow.compile();
    const result = await app.invoke(new NewsAnalysisState());

    return {
        success: result.errors.length === 0,
        errors: result.errors,
        insightsCount: result.finalInsights.length,
        matches: result.finalInsights
    };
};

export default { runNewsIntelligencePipeline };
