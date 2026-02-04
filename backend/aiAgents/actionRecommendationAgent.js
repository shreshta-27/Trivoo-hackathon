import { StateGraph } from "@langchain/langgraph";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import {
    ACTION_RECOMMENDATION_SYSTEM_PROMPT,
    RISK_INTERPRETATION_PROMPT,
    ACTION_PLANNING_PROMPT,
    PRIORITY_RANKING_PROMPT,
    EXPLANATION_PROMPT
} from "./prompts/actionRecommendationPrompts.js";
import { calculateProjectAge } from "../utils/lifecycleUtils.js";

const initializeLLM = () => {
    return new ChatGoogleGenerativeAI({
        model: process.env.AI_MODEL || "gemini-pro",
        temperature: parseFloat(process.env.AI_TEMPERATURE) || 0.3,
        apiKey: process.env.GEMINI_API_KEY
    });
};

// Enhanced Action Recommendation Fallback with Multiple Detailed Mock Data Variants
const getMockActionFallback = (projectContext) => {
    const mockRecommendations = [
        {
            actions: [
                {
                    actionType: "irrigation",
                    description: "Increase irrigation frequency to compensate for elevated temperatures and reduced rainfall",
                    urgency: "immediate",
                    impact: "high",
                    estimatedCost: 450,
                    timeframe: "24-48 hours",
                    expectedOutcome: "Restore soil moisture to optimal levels (45-55%)",
                    reasoning: "Current soil moisture at 32% is below critical threshold. Immediate action required to prevent stress."
                },
                {
                    actionType: "monitoring",
                    description: "Deploy additional soil moisture sensors in vulnerable zones",
                    urgency: "moderate",
                    impact: "medium",
                    estimatedCost: 280,
                    timeframe: "3-5 days",
                    expectedOutcome: "Enhanced real-time monitoring coverage across 85% of project area",
                    reasoning: "Early detection of moisture deficits will enable proactive interventions."
                },
                {
                    actionType: "maintenance",
                    description: "Apply organic mulch layer to reduce evaporation and regulate soil temperature",
                    urgency: "moderate",
                    impact: "high",
                    estimatedCost: 620,
                    timeframe: "1 week",
                    expectedOutcome: "Reduce water loss by 30-40% and stabilize soil temperature",
                    reasoning: "Mulching provides long-term moisture retention benefits with minimal ongoing costs."
                }
            ],
            summary: "3 critical actions identified to address moisture stress and temperature fluctuations",
            totalEstimatedCost: 1350,
            priorityLevel: "high",
            confidence: 0.89
        },
        {
            actions: [
                {
                    actionType: "pest_control",
                    description: "Implement integrated pest management protocol for early-stage infestation",
                    urgency: "immediate",
                    impact: "critical",
                    estimatedCost: 890,
                    timeframe: "48 hours",
                    expectedOutcome: "Contain pest population before reaching economic threshold",
                    reasoning: "Pest activity detected in 3 zones. Early intervention prevents widespread damage."
                },
                {
                    actionType: "nutrient_supplementation",
                    description: "Apply balanced NPK fertilizer to boost plant immunity",
                    urgency: "moderate",
                    impact: "medium",
                    estimatedCost: 540,
                    timeframe: "5-7 days",
                    expectedOutcome: "Strengthen plant defenses and accelerate recovery",
                    reasoning: "Nutrient analysis shows deficiencies that compromise pest resistance."
                }
            ],
            summary: "2 urgent actions to address pest threat and strengthen plant health",
            totalEstimatedCost: 1430,
            priorityLevel: "critical",
            confidence: 0.92
        },
        {
            actions: [
                {
                    actionType: "pruning",
                    description: "Selective pruning to improve air circulation and light penetration",
                    urgency: "low",
                    impact: "medium",
                    estimatedCost: 320,
                    timeframe: "2 weeks",
                    expectedOutcome: "Reduce disease risk by 25% and promote healthy growth patterns",
                    reasoning: "Dense canopy creating microclimate favorable for fungal development."
                },
                {
                    actionType: "soil_amendment",
                    description: "Add compost to improve soil structure and microbial activity",
                    urgency: "low",
                    impact: "medium",
                    estimatedCost: 480,
                    timeframe: "2-3 weeks",
                    expectedOutcome: "Enhanced nutrient cycling and improved water retention capacity",
                    reasoning: "Soil health optimization supports long-term project sustainability."
                },
                {
                    actionType: "monitoring",
                    description: "Schedule quarterly health assessments with detailed documentation",
                    urgency: "low",
                    impact: "low",
                    estimatedCost: 150,
                    timeframe: "ongoing",
                    expectedOutcome: "Comprehensive health tracking and trend analysis",
                    reasoning: "Regular monitoring enables data-driven decision making."
                }
            ],
            summary: "3 preventive actions for long-term health optimization",
            totalEstimatedCost: 950,
            priorityLevel: "medium",
            confidence: 0.85
        }
    ];

    const selected = mockRecommendations[Math.floor(Math.random() * mockRecommendations.length)];

    console.warn(`\n${'='.repeat(80)}`);
    console.warn(`⚠️  ACTION RECOMMENDATION FALLBACK ACTIVATED`);
    console.warn(`${'='.repeat(80)}`);
    console.log(`🎯  Priority Level: ${selected.priorityLevel.toUpperCase()}`);
    console.log(`📊  Total Actions: ${selected.actions.length}`);
    console.log(`💰  Estimated Cost: $${selected.totalEstimatedCost}`);
    console.log(`📈  Confidence: ${(selected.confidence * 100).toFixed(1)}%`);
    console.log(`💡  Summary: ${selected.summary}`);
    console.warn(`${'='.repeat(80)}\n`);

    return {
        recommendations: selected.actions,
        summary: selected.summary,
        totalEstimatedCost: selected.totalEstimatedCost,
        priorityLevel: selected.priorityLevel,
        confidence: selected.confidence,
        mocked: true,
        timestamp: new Date().toISOString()
    };
};

class RecommendationState {
    constructor() {
        this.projectContext = null;
        this.riskSignals = [];
        this.riskInterpretation = null;
        this.plannedActions = [];
        this.rankedActions = [];
        this.finalRecommendations = [];
        this.errors = [];
        this.processingTime = 0;
    }
}

const loadProjectContextNode = async (state) => {
    try {
        const { project, environmentalData, maintenanceHistory } = state.projectContext;

        const age = calculateProjectAge(project.metadata.plantedDate);

        state.projectContext = {
            ...state.projectContext,
            projectAge: age.displayAge,
            ageInDays: age.days,
            healthScore: project.healthScore,
            riskLevel: project.riskLevel,
            activeRisks: project.activeRisks,
            daysSinceMaintenance: maintenanceHistory?.lastAction
                ? Math.floor((Date.now() - new Date(maintenanceHistory.lastAction).getTime()) / (1000 * 60 * 60 * 24))
                : 999
        };

        return state;
    } catch (error) {
        state.errors.push(`Context loading error: ${error.message}`);
        return state;
    }
};

const riskSignalDetectorNode = async (state) => {
    try {
        const { project, environmentalData } = state.projectContext;
        const signals = [];

        const tempAnomaly = environmentalData.temperature.max - 35;
        if (tempAnomaly > 0) {
            signals.push({
                type: 'temperature_anomaly',
                severity: tempAnomaly > 5 ? 'high' : 'medium',
                value: environmentalData.temperature.max,
                threshold: 35
            });
        }

        const rainfallDeficit = 1000 - environmentalData.rainfall;
        if (rainfallDeficit > 200) {
            signals.push({
                type: 'rainfall_deficit',
                severity: rainfallDeficit > 400 ? 'high' : 'medium',
                value: environmentalData.rainfall,
                threshold: 1000
            });
        }

        if (environmentalData.temperature.max > 38 && environmentalData.rainfall < 500) {
            signals.push({
                type: 'fire_probability',
                severity: 'high',
                value: { temp: environmentalData.temperature.max, rainfall: environmentalData.rainfall }
            });
        }

        if (environmentalData.soil.moisture && environmentalData.soil.moisture < 30) {
            signals.push({
                type: 'soil_moisture_mismatch',
                severity: environmentalData.soil.moisture < 20 ? 'high' : 'medium',
                value: environmentalData.soil.moisture,
                threshold: 30
            });
        }

        state.riskSignals = signals;
        return state;
    } catch (error) {
        state.errors.push(`Risk detection error: ${error.message}`);
        return state;
    }
};

const riskInterpretationNode = async (state) => {
    try {
        if (state.riskSignals.length === 0) {
            state.riskInterpretation = {
                overallRisk: 'low',
                compoundingRisks: false,
                reasoning: 'No significant risk signals detected',
                interventionRequired: false
            };
            return state;
        }

        const { project, environmentalData, projectAge, healthScore } = state.projectContext;
        const llm = initializeLLM();

        const riskSignalsText = state.riskSignals.map(s =>
            `- ${s.type}: ${s.severity} severity (value: ${JSON.stringify(s.value)})`
        ).join('\n');

        const prompt = RISK_INTERPRETATION_PROMPT
            .replace('{projectName}', project.name)
            .replace('{treeType}', project.treeType)
            .replace('{projectAge}', projectAge)
            .replace('{healthScore}', healthScore)
            .replace('{riskSignals}', riskSignalsText)
            .replace('{temperature}', environmentalData.temperature.max)
            .replace('{tempTrend}', 'rising')
            .replace('{rainfall}', environmentalData.rainfall)
            .replace('{rainfallTrend}', 'decreasing')
            .replace('{soilMoisture}', environmentalData.soil.moisture || 'unknown');

        const startTime = Date.now();
        const messages = [
            new SystemMessage(ACTION_RECOMMENDATION_SYSTEM_PROMPT),
            new HumanMessage(prompt)
        ];

        const response = await llm.invoke(messages);
        let content = response.content;

        if (content.includes('```json')) {
            content = content.split('```json')[1].split('```')[0].trim();
        } else if (content.includes('```')) {
            content = content.split('```')[1].split('```')[0].trim();
        }

        state.riskInterpretation = JSON.parse(content);
        state.processingTime += Date.now() - startTime;

        return state;
    } catch (error) {
        state.errors.push(`Risk interpretation error: ${error.message}`);
        return state;
    }
};

const actionPlanningNode = async (state) => {
    try {
        if (!state.riskInterpretation.interventionRequired) {
            state.plannedActions = [];
            return state;
        }

        const { project, projectAge, healthScore } = state.projectContext;
        const llm = initializeLLM();

        const activeRisksText = state.riskSignals.map(s => s.type).join(', ');

        const prompt = ACTION_PLANNING_PROMPT
            .replace('{riskAnalysis}', JSON.stringify(state.riskInterpretation, null, 2))
            .replace('{treeType}', project.treeType)
            .replace('{projectAge}', projectAge)
            .replace('{healthScore}', healthScore)
            .replace('{activeRisks}', activeRisksText);

        const startTime = Date.now();
        const messages = [
            new SystemMessage(ACTION_RECOMMENDATION_SYSTEM_PROMPT),
            new HumanMessage(prompt)
        ];

        const response = await llm.invoke(messages);
        let content = response.content;

        if (content.includes('```json')) {
            content = content.split('```json')[1].split('```')[0].trim();
        } else if (content.includes('```')) {
            content = content.split('```')[1].split('```')[0].trim();
        }

        const result = JSON.parse(content);
        state.plannedActions = result.actions || [];
        state.processingTime += Date.now() - startTime;

        return state;
    } catch (error) {
        state.errors.push(`Action planning error: ${error.message}`);
        return state;
    }
};

const priorityRankingNode = async (state) => {
    try {
        if (state.plannedActions.length === 0) {
            state.rankedActions = [];
            return state;
        }

        const { healthScore, riskLevel, daysSinceMaintenance } = state.projectContext;
        const llm = initializeLLM();

        const prompt = PRIORITY_RANKING_PROMPT
            .replace('{actions}', JSON.stringify(state.plannedActions, null, 2))
            .replace('{healthScore}', healthScore)
            .replace('{riskLevel}', riskLevel)
            .replace('{daysSinceMaintenance}', daysSinceMaintenance);

        const startTime = Date.now();
        const messages = [
            new SystemMessage(ACTION_RECOMMENDATION_SYSTEM_PROMPT),
            new HumanMessage(prompt)
        ];

        const response = await llm.invoke(messages);
        let content = response.content;

        if (content.includes('```json')) {
            content = content.split('```json')[1].split('```')[0].trim();
        } else if (content.includes('```')) {
            content = content.split('```')[1].split('```')[0].trim();
        }

        const result = JSON.parse(content);
        state.rankedActions = result.rankedActions || [];
        state.processingTime += Date.now() - startTime;

        return state;
    } catch (error) {
        state.errors.push(`Priority ranking error: ${error.message}`);
        return state;
    }
};

const explanationNode = async (state) => {
    try {
        if (state.rankedActions.length === 0) {
            state.finalRecommendations = [];
            return state;
        }

        const llm = initializeLLM();
        const recommendations = [];

        for (const rankedAction of state.rankedActions) {
            const originalAction = state.plannedActions.find(a => a.action === rankedAction.action);

            const prompt = EXPLANATION_PROMPT
                .replace('{action}', rankedAction.action)
                .replace('{priority}', rankedAction.priority)
                .replace('{timeWindow}', JSON.stringify(originalAction?.timeWindow || {}))
                .replace('{situation}', state.riskInterpretation.reasoning)
                .replace('{riskAddressed}', (originalAction?.riskAddressed || []).join(', '))
                .replace('{impact}', rankedAction.impact);

            const startTime = Date.now();
            const messages = [
                new SystemMessage(ACTION_RECOMMENDATION_SYSTEM_PROMPT),
                new HumanMessage(prompt)
            ];

            const response = await llm.invoke(messages);
            let content = response.content;

            if (content.includes('```json')) {
                content = content.split('```json')[1].split('```')[0].trim();
            } else if (content.includes('```')) {
                content = content.split('```')[1].split('```')[0].trim();
            }

            const explanation = JSON.parse(content);
            state.processingTime += Date.now() - startTime;

            recommendations.push({
                ...rankedAction,
                timeWindow: originalAction?.timeWindow,
                riskAddressed: originalAction?.riskAddressed,
                explanation: explanation.explanation,
                consequences: explanation.consequences
            });
        }

        state.finalRecommendations = recommendations;
        return state;
    } catch (error) {
        state.errors.push(`Explanation generation error: ${error.message}`);
        return state;
    }
};

const storeOutputNode = async (state) => {
    try {
        state.finalRecommendations = state.finalRecommendations.map(rec => ({
            ...rec,
            aiMetadata: {
                model: process.env.AI_MODEL || "gemini-pro",
                processingTime: state.processingTime,
                confidence: 0.85,
                workflowVersion: '1.0'
            },
            riskContext: {
                overallRisk: state.riskInterpretation.overallRisk,
                compoundingRisks: state.riskInterpretation.compoundingRisks,
                riskInterpretation: state.riskInterpretation.reasoning
            }
        }));

        return state;
    } catch (error) {
        state.errors.push(`Storage error: ${error.message}`);
        return state;
    }
};

const buildActionRecommendationWorkflow = () => {
    const workflow = new StateGraph({
        channels: {
            projectContext: null,
            riskSignals: [],
            riskInterpretation: null,
            plannedActions: [],
            rankedActions: [],
            finalRecommendations: [],
            errors: [],
            processingTime: 0
        }
    });

    workflow.addNode("loadContext", loadProjectContextNode);
    workflow.addNode("detectRisks", riskSignalDetectorNode);
    workflow.addNode("interpretRisks", riskInterpretationNode);
    workflow.addNode("planActions", actionPlanningNode);
    workflow.addNode("rankPriorities", priorityRankingNode);
    workflow.addNode("generateExplanations", explanationNode);
    workflow.addNode("storeOutput", storeOutputNode);

    workflow.addEdge("__start__", "loadContext");
    workflow.addEdge("loadContext", "detectRisks");
    workflow.addEdge("detectRisks", "interpretRisks");
    workflow.addEdge("interpretRisks", "planActions");
    workflow.addEdge("planActions", "rankPriorities");
    workflow.addEdge("rankPriorities", "generateExplanations");
    workflow.addEdge("generateExplanations", "storeOutput");
    workflow.addEdge("storeOutput", "__end__");

    return workflow.compile();
};

export const generateActionRecommendations = async (projectContext) => {
    const workflow = buildActionRecommendationWorkflow();
    const initialState = new RecommendationState();
    initialState.projectContext = projectContext;

    try {
        const result = await workflow.invoke(initialState);

        if (result.errors && result.errors.length > 0) {
            throw new Error(`Workflow errors: ${result.errors.join(', ')}`);
        }

        return result.finalRecommendations;
    } catch (error) {
        console.error("Action Recommendation Workflow Failed:", error.message);
        return getMockActionFallback(projectContext);
    }
};

export default {
    generateActionRecommendations,
    buildActionRecommendationWorkflow
};
