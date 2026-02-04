import { StateGraph } from "@langchain/langgraph";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { PROJECT_INSIGHT_SYSTEM_PROMPT, HEALTH_CHANGE_PROMPT, MAINTENANCE_FEEDBACK_PROMPT, SIMULATION_ANALYSIS_PROMPT } from "./prompts/projectInsightPrompts.js";

const initializeLLM = () => {
    return new ChatGoogleGenerativeAI({
        model: process.env.AI_MODEL || "gemini-pro",
        temperature: parseFloat(process.env.AI_TEMPERATURE) || 0.3,
        apiKey: process.env.GEMINI_API_KEY
    });
};

// Enhanced Project Insight Fallback with Multiple Detailed Mock Data Variants
const getMockInsightFallback = (analysisType) => {
    const mockInsights = {
        'health_change': [
            {
                title: "🌱 Health Trajectory Analysis",
                summary: "Project health shows steady improvement with 12% growth in vegetation density over the past 30 days.",
                keyFindings: [
                    "Canopy coverage increased from 68% to 76%",
                    "Soil moisture levels stabilized at optimal range (45-55%)",
                    "Root system development exceeding projections by 18%"
                ],
                recommendations: [
                    "Continue current irrigation schedule",
                    "Monitor for potential pest activity in sector 3",
                    "Consider expanding planting area to adjacent zones"
                ],
                confidence: 0.87,
                dataPoints: 156
            },
            {
                title: "🌿 Vegetation Health Update",
                summary: "Moderate health improvement detected with some areas requiring attention.",
                keyFindings: [
                    "Overall health score: 7.8/10 (up from 7.2)",
                    "3 zones showing exceptional growth patterns",
                    "Minor stress indicators in northern quadrant"
                ],
                recommendations: [
                    "Increase nutrient supplementation in stressed areas",
                    "Adjust watering frequency for optimal absorption",
                    "Schedule health assessment for northern sector"
                ],
                confidence: 0.82,
                dataPoints: 142
            }
        ],
        'maintenance_feedback': [
            {
                title: "🔧 Maintenance Impact Assessment",
                summary: "Recent maintenance activities have yielded positive results with 23% improvement in target metrics.",
                keyFindings: [
                    "Pruning operations improved air circulation by 31%",
                    "Fertilization increased nutrient uptake efficiency",
                    "Pest control measures reduced infestation risk by 45%"
                ],
                recommendations: [
                    "Maintain current maintenance schedule",
                    "Document successful techniques for future reference",
                    "Consider scaling successful interventions to other areas"
                ],
                confidence: 0.91,
                dataPoints: 203
            },
            {
                title: "⚙️ Maintenance Effectiveness Report",
                summary: "Maintenance interventions showing measurable positive impact on project health.",
                keyFindings: [
                    "Response time to issues improved by 40%",
                    "Resource utilization optimized to 85% efficiency",
                    "Team productivity increased with new protocols"
                ],
                recommendations: [
                    "Continue monitoring intervention outcomes",
                    "Share best practices across all project zones",
                    "Schedule quarterly maintenance review"
                ],
                confidence: 0.88,
                dataPoints: 178
            }
        ],
        'simulation_analysis': [
            {
                title: "🔮 Future Scenario Projection",
                summary: "Simulation models predict favorable outcomes under current management strategies.",
                keyFindings: [
                    "95% probability of meeting 6-month growth targets",
                    "Risk factors well-managed with current protocols",
                    "Resource allocation optimized for maximum efficiency"
                ],
                recommendations: [
                    "Maintain current trajectory with minor adjustments",
                    "Prepare contingency plans for identified risk scenarios",
                    "Monitor key performance indicators weekly"
                ],
                confidence: 0.85,
                dataPoints: 312
            },
            {
                title: "📊 Predictive Analysis Results",
                summary: "Advanced modeling indicates strong project performance trajectory.",
                keyFindings: [
                    "Expected yield increase of 28% by end of season",
                    "Climate resilience factors above regional average",
                    "Sustainability metrics trending positively"
                ],
                recommendations: [
                    "Continue data collection for model refinement",
                    "Implement early warning system for risk mitigation",
                    "Plan for capacity expansion based on projections"
                ],
                confidence: 0.89,
                dataPoints: 267
            }
        ]
    };

    const insights = mockInsights[analysisType] || mockInsights['health_change'];
    const selectedInsight = insights[Math.floor(Math.random() * insights.length)];

    console.warn(`\n${'='.repeat(80)}`);
    console.warn(`⚠️  PROJECT INSIGHT FALLBACK ACTIVATED`);
    console.warn(`${'='.repeat(80)}`);
    console.log(`🔍  Analysis Type: ${analysisType}`);
    console.log(`📊  Mock Insight: ${selectedInsight.title}`);
    console.log(`📈  Confidence: ${(selectedInsight.confidence * 100).toFixed(1)}%`);
    console.log(`📍  Data Points: ${selectedInsight.dataPoints}`);
    console.log(`💡  Summary: ${selectedInsight.summary}`);
    console.warn(`${'='.repeat(80)}\n`);

    return {
        ...selectedInsight,
        mocked: true,
        timestamp: new Date().toISOString()
    };
};

class InsightState {
    constructor() {
        this.projectContext = null;
        this.environmentalDelta = null;
        this.analysisType = null;
        this.llmResponse = null;
        this.finalInsight = null;
        this.errors = [];
    }
}

const projectContextNode = async (state) => {
    try {
        if (!state.projectContext) {
            state.errors.push("Missing project context");
        }
        return state;
    } catch (error) {
        state.errors.push(`Context error: ${error.message}`);
        return state;
    }
};

const environmentalDeltaNode = async (state) => {
    try {
        const { currentEnv, previousEnv } = state.projectContext;

        state.environmentalDelta = {
            rainfallChange: currentEnv.rainfall - (previousEnv?.rainfall || currentEnv.rainfall),
            temperatureChange: currentEnv.temperature.max - (previousEnv?.temperature?.max || currentEnv.temperature.max),
            newRisks: currentEnv.activeRisks.filter(r =>
                !previousEnv?.activeRisks?.some(pr => pr.type === r.type)
            )
        };

        return state;
    } catch (error) {
        state.errors.push(`Delta calculation error: ${error.message}`);
        return state;
    }
};

const llmAnalysisNode = async (state) => {
    try {
        const llm = initializeLLM();
        let systemPrompt, userPrompt;

        switch (state.analysisType) {
            case 'health_change':
                systemPrompt = PROJECT_INSIGHT_SYSTEM_PROMPT;
                userPrompt = HEALTH_CHANGE_PROMPT
                    .replace('{projectName}', state.projectContext.projectName)
                    .replace('{currentHealth}', state.projectContext.currentHealth)
                    .replace('{previousHealth}', state.projectContext.previousHealth || 'N/A')
                    .replace('{rainfallChange}', state.environmentalDelta.rainfallChange)
                    .replace('{tempChange}', state.environmentalDelta.temperatureChange)
                    .replace('{newRisks}', state.environmentalDelta.newRisks.map(r => r.type).join(', ') || 'None');
                break;

            case 'maintenance_feedback':
                systemPrompt = PROJECT_INSIGHT_SYSTEM_PROMPT;
                userPrompt = MAINTENANCE_FEEDBACK_PROMPT
                    .replace('{projectName}', state.projectContext.projectName)
                    .replace('{actionType}', state.projectContext.lastAction?.type || 'General Maintenance')
                    .replace('{actionDate}', state.projectContext.lastAction?.date || 'Recent')
                    .replace('{healthBefore}', state.projectContext.healthBeforeAction || 'N/A')
                    .replace('{healthAfter}', state.projectContext.currentHealth);
                break;

            case 'simulation_analysis':
                systemPrompt = PROJECT_INSIGHT_SYSTEM_PROMPT;
                userPrompt = SIMULATION_ANALYSIS_PROMPT
                    .replace('{projectName}', state.projectContext.projectName)
                    .replace('{simulationResults}', JSON.stringify(state.projectContext.simulationResults || {}));
                break;

            default:
                throw new Error(`Unknown analysis type: ${state.analysisType}`);
        }

        const response = await llm.invoke([
            new SystemMessage(systemPrompt),
            new HumanMessage(userPrompt)
        ]);

        state.llmResponse = response.content;
        return state;
    } catch (error) {
        state.errors.push(`LLM analysis error: ${error.message}`);
        return state;
    }
};

const parseInsightNode = async (state) => {
    try {
        if (state.errors.length > 0) {
            throw new Error(`Workflow errors: ${state.errors.join(', ')}`);
        }

        let cleanedResponse = state.llmResponse
            .replace(/```json/g, '')
            .replace(/```/g, '')
            .trim();

        const parsed = JSON.parse(cleanedResponse);

        state.finalInsight = {
            title: parsed.title || "Project Insight",
            summary: parsed.summary || "Analysis completed",
            keyFindings: parsed.keyFindings || parsed.key_findings || [],
            recommendations: parsed.recommendations || [],
            confidence: parsed.confidence || 0.8,
            analysisType: state.analysisType,
            timestamp: new Date().toISOString()
        };

        return state;
    } catch (error) {
        state.errors.push(`Parsing error: ${error.message}`);
        return state;
    }
};

const buildInsightWorkflow = () => {
    const workflow = new StateGraph({
        channels: {
            projectContext: null,
            environmentalDelta: null,
            analysisType: null,
            llmResponse: null,
            finalInsight: null,
            errors: []
        }
    });

    workflow.addNode("loadContext", projectContextNode);
    workflow.addNode("calculateDelta", environmentalDeltaNode);
    workflow.addNode("llmAnalysis", llmAnalysisNode);
    workflow.addNode("parseInsight", parseInsightNode);

    workflow.addEdge("loadContext", "calculateDelta");
    workflow.addEdge("calculateDelta", "llmAnalysis");
    workflow.addEdge("llmAnalysis", "parseInsight");

    workflow.setEntryPoint("loadContext");
    workflow.setFinishPoint("parseInsight");

    return workflow.compile();
};

export const generateProjectInsight = async (projectContext, analysisType) => {
    const workflow = buildInsightWorkflow();

    const initialState = {
        projectContext,
        analysisType,
        environmentalDelta: null,
        llmResponse: null,
        finalInsight: null,
        errors: []
    };

    try {
        const result = await workflow.invoke(initialState);
        if (result.errors && result.errors.length > 0) {
            throw new Error(`Workflow errors: ${result.errors.join(', ')}`);
        }
        return result.finalInsight;
    } catch (error) {
        console.error("Project Insight Workflow Failed:", error.message);
        return getMockInsightFallback(analysisType);
    }
};

export default {
    generateProjectInsight,
    buildInsightWorkflow
};
