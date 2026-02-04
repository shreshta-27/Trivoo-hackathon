/**
 * Suitability Agent - LangGraph Workflow
 * Agentic AI system for evaluating plantation project suitability
 */

import { StateGraph, END } from "@langchain/langgraph";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
// import { SYSTEM_PROMPT, ANALYSIS_PROMPT_TEMPLATE } from "./prompts/suitabilityPrompts.js";
import { checkSoilCompatibility } from "../utils/environmentalDataService.js";

const SYSTEM_PROMPT = `You are an expert agricultural and forestry advisor specializing in plantation suitability analysis for reforestation projects in India.
Your role is to evaluate whether a proposed plantation project is viable at a specific location based on environmental data.
You must provide:
1. Clear suitability assessment (suitable, suitable_with_caution, or not_recommended)
2. Detailed reasoning explaining your decision
3. Specific fertilizer recommendations
4. Care duration and instructions
5. Risk warnings with mitigation strategies
Output your response as a valid JSON object with this exact structure.
IMPORTANT: Ensure "fertilizers" and "riskWarnings" are actual JSON Arrays, NOT strings. Do not use single quotes.
{
  "suitabilityStatus": "suitable" | "suitable_with_caution" | "not_recommended",
  "reasoning": "detailed explanation of your decision",
  "fertilizers": [{ "name": "...", "type": "...", "applicationRate": "...", "frequency": "..." }],
  "careDuration": number,
  "careInstructions": ["..."],
  "irrigationNeeds": "low" | "moderate" | "high",
  "riskWarnings": [{ "type": "...", "severity": "...", "description": "...", "mitigation": "..." }],
  "confidence": number
}`;

const ANALYSIS_PROMPT_TEMPLATE = `Analyze the suitability of the following plantation project:
PROJECT DETAILS:
- Project Name: {projectName}
- Location: Latitude {latitude}, Longitude {longitude}
- Plantation Size: {plantationSize} trees
- Tree Type: {treeType}
ENVIRONMENTAL CONTEXT:
Soil Data:
- Type: {soilType}
- pH: {soilPH}
- Organic Matter: {organicMatter}%
- Drainage: {drainage}
Climate Data:
- Average Rainfall: {rainfall} mm/year
- Temperature Range: {tempMin}°C to {tempMax}°C
- Humidity: {humidity}%
- Climate Zone: {climateZone}
Known Risk Factors:
{riskFactors}
ANALYSIS REQUIREMENTS:
1. Evaluate if the soil type and pH are compatible with {treeType}
2. Assess if rainfall and temperature are adequate
3. Consider the plantation size - larger plantations need more resources
4. Identify potential risks based on climate and location
5. Recommend appropriate fertilizers (prefer organic when possible)
6. Estimate initial care duration
7. Provide specific, actionable care instructions
Provide your analysis as a valid JSON object.`;

// Fallback models in priority order
const FALLBACK_MODELS = [
    "gemini-2.0-flash",
    "gemini-flash-latest",
    "gemini-pro-latest"
];

// Initialize the LLM with fallback support
const initializeLLM = (modelNameOverride) => {
    const modelName = modelNameOverride || process.env.AI_MODEL || FALLBACK_MODELS[0];
    const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;

    return new ChatGoogleGenerativeAI({
        modelName: modelName,
        model: modelName,
        temperature: parseFloat(process.env.AI_TEMPERATURE) || 0.3,
        apiKey: apiKey,
        maxRetries: 1
    });
};

/**
 * State interface for the workflow
 */
class SuitabilityState {
    constructor() {
        this.projectDetails = null;
        this.environmentalContext = null;
        this.soilCompatibility = null;
        this.analysisPrompt = null;
        this.llmResponse = null;
        this.finalRecommendation = null;
        this.errors = [];
    }
}

/**
 * Node 1: Input Context Node
 * Structures incoming data for the workflow
 */
const inputContextNode = async (state) => {
    try {
        // Validate required inputs
        if (!state.projectDetails || !state.environmentalContext) {
            state.errors.push("Missing required project details or environmental context");
            return state;
        }

        console.log("✓ Input context validated");
        return state;
    } catch (error) {
        state.errors.push(`Input validation error: ${error.message}`);
        return state;
    }
};

/**
 * Node 2: Environmental Analysis Node
 * Evaluates soil compatibility and prepares environmental assessment
 */
const environmentalAnalysisNode = async (state) => {
    try {
        const { projectDetails, environmentalContext } = state;

        // Check soil compatibility
        state.soilCompatibility = checkSoilCompatibility(
            environmentalContext.soil,
            projectDetails.treeType
        );

        console.log("✓ Environmental analysis completed");
        console.log(`  Soil compatibility: ${state.soilCompatibility.compatible ? 'Compatible' : 'Needs amendment'}`);

        return state;
    } catch (error) {
        state.errors.push(`Environmental analysis error: ${error.message}`);
        return state;
    }
};

/**
 * Node 3: Suitability Reasoner Node (LLM)
 * Uses LLM to perform multi-factor reasoning
 */
const suitabilityReasonerNode = async (state) => {
    const { projectDetails, environmentalContext } = state;
    const { soil, climate, risks } = environmentalContext;

    // Format risk factors for prompt
    const riskFactorsText = risks.map(r =>
        `- ${r.type}: ${r.probability} probability during ${r.season}`
    ).join('\n');

    // Build the analysis prompt
    const analysisPrompt = ANALYSIS_PROMPT_TEMPLATE
        .replace('{projectName}', projectDetails.name)
        .replace('{latitude}', environmentalContext.location.latitude)
        .replace('{longitude}', environmentalContext.location.longitude)
        .replace('{plantationSize}', projectDetails.plantationSize)
        .replace('{treeType}', projectDetails.treeType)
        .replace('{soilType}', soil.type)
        .replace('{soilPH}', soil.pH)
        .replace('{organicMatter}', soil.organicMatter || 'N/A')
        .replace('{drainage}', soil.drainage)
        .replace('{rainfall}', climate.averageRainfall)
        .replace('{tempMin}', climate.temperatureRange.min)
        .replace('{tempMax}', climate.temperatureRange.max)
        .replace('{humidity}', climate.humidity)
        .replace('{climateZone}', climate.climateZone)
        .replace('{riskFactors}', riskFactorsText || 'No significant risks identified');

    state.analysisPrompt = analysisPrompt;

    // Try models in sequence until one works
    let lastError = null;
    let success = false;
    let llmOutput = null;
    let processingTime = 0;

    // Environment model first, then fallbacks
    const modelsToTry = process.env.AI_MODEL
        ? [process.env.AI_MODEL, ...FALLBACK_MODELS]
        : FALLBACK_MODELS;

    // Remove duplicates
    const uniqueModels = [...new Set(modelsToTry)];

    console.log(`Starting LLM analysis with ${uniqueModels.length} candidate models...`);

    for (const modelName of uniqueModels) {
        try {
            console.log(`Trying model: ${modelName}`);
            const llm = initializeLLM(modelName);
            const startTime = Date.now();

            const messages = [
                new SystemMessage(SYSTEM_PROMPT),
                new HumanMessage(analysisPrompt)
            ];

            const response = await llm.invoke(messages);
            processingTime = Date.now() - startTime;

            // Parse LLM response
            try {
                // Extract JSON from response (handle markdown code blocks)
                let content = response.content;
                if (content.includes('```json')) {
                    content = content.split('```json')[1].split('```')[0].trim();
                } else if (content.includes('```')) {
                    content = content.split('```')[1].split('```')[0].trim();
                }

                llmOutput = JSON.parse(content);
                success = true;
                console.log(`✓ Model ${modelName} succeeded!`);
                break; // Exit loop on success
            } catch (parseError) {
                console.warn(`Failed to parse JSON from ${modelName}, trying next...`);
                lastError = parseError;
                continue;
            }
        } catch (error) {
            console.warn(`Model ${modelName} failed: ${error.message}`);
            lastError = error;
        }
    }

    if (!success) {
        const errorMsg = `All models failed. Last error: ${lastError?.message}`;
        console.error("❌ " + errorMsg);
        state.errors.push(errorMsg);
        return state;
    }

    state.llmResponse = {
        ...llmOutput,
        processingTime
    };

    console.log("✓ LLM analysis completed");
    console.log(`  Status: ${llmOutput.suitabilityStatus}`);
    console.log(`  Confidence: ${llmOutput.confidence}`);
    console.log(`  Processing time: ${processingTime}ms`);

    return state;
};

/**
 * Node 4: Care Plan Generator Node
 * Enhances LLM recommendations with additional care planning
 */
const carePlanGeneratorNode = async (state) => {
    try {
        const { llmResponse, projectDetails } = state;

        if (!llmResponse) {
            state.errors.push("No LLM response available for care plan generation");
            return state;
        }

        // Add plantation size-based adjustments
        let careDuration = llmResponse.careDuration;

        // Larger plantations need longer care periods
        if (projectDetails.plantationSize > 2000) {
            careDuration = Math.ceil(careDuration * 1.2);
        } else if (projectDetails.plantationSize > 5000) {
            careDuration = Math.ceil(careDuration * 1.5);
        }

        // Add size-specific care instructions
        const sizeBasedInstructions = [];
        if (projectDetails.plantationSize > 1000) {
            sizeBasedInstructions.push("Hire dedicated maintenance team for large-scale operations");
            sizeBasedInstructions.push("Implement zone-based monitoring system");
        }
        if (projectDetails.plantationSize > 3000) {
            sizeBasedInstructions.push("Consider mechanized irrigation system");
            sizeBasedInstructions.push("Establish on-site nursery for replacement saplings");
        }

        state.enhancedCarePlan = {
            careDuration,
            careInstructions: [
                ...llmResponse.careInstructions,
                ...sizeBasedInstructions
            ],
            estimatedLabor: Math.ceil(projectDetails.plantationSize / 100), // 1 worker per 100 trees
            estimatedCost: projectDetails.plantationSize * 50 // ₹50 per tree (rough estimate)
        };

        console.log("✓ Care plan enhanced");
        console.log(`  Duration: ${careDuration} days`);
        console.log(`  Estimated labor: ${state.enhancedCarePlan.estimatedLabor} workers`);

        return state;
    } catch (error) {
        state.errors.push(`Care plan generation error: ${error.message}`);
        return state;
    }
};

/**
 * Node 5: Final Recommendation Node
 * Formats the final output for API response
 */
const finalRecommendationNode = async (state) => {
    try {
        const { llmResponse, enhancedCarePlan, soilCompatibility } = state;

        if (!llmResponse) {
            state.errors.push("Cannot generate final recommendation without LLM response");
            return state;
        }

        // Add soil compatibility warning if needed
        const riskWarnings = [...llmResponse.riskWarnings];
        if (!soilCompatibility.compatible) {
            riskWarnings.push({
                type: 'soil_incompatibility',
                severity: 'medium',
                description: 'Soil conditions may require amendment for optimal growth',
                mitigation: 'Apply soil conditioners and organic matter before planting'
            });
        }

        state.finalRecommendation = {
            suitabilityStatus: llmResponse.suitabilityStatus,
            reasoning: llmResponse.reasoning,
            recommendations: {
                fertilizers: llmResponse.fertilizers,
                careDuration: enhancedCarePlan.careDuration,
                careInstructions: enhancedCarePlan.careInstructions,
                irrigationNeeds: llmResponse.irrigationNeeds,
                estimatedLabor: enhancedCarePlan.estimatedLabor,
                estimatedCost: enhancedCarePlan.estimatedCost
            },
            riskWarnings,
            aiMetadata: {
                model: process.env.AI_MODEL || "gemini-pro",
                temperature: parseFloat(process.env.AI_TEMPERATURE) || 0.3,
                processingTime: llmResponse.processingTime,
                confidence: llmResponse.confidence
            }
        };

        console.log("✓ Final recommendation generated");
        return state;
    } catch (error) {
        state.errors.push(`Final recommendation error: ${error.message}`);
        return state;
    }
};

/**
 * Build the LangGraph workflow
 */
const buildSuitabilityWorkflow = () => {
    const workflow = new StateGraph({
        channels: {
            projectDetails: null,
            environmentalContext: null,
            soilCompatibility: null,
            analysisPrompt: null,
            llmResponse: null,
            enhancedCarePlan: null,
            finalRecommendation: null,
            errors: []
        }
    });

    // Add nodes
    workflow.addNode("inputContext", inputContextNode);
    workflow.addNode("environmentalAnalysis", environmentalAnalysisNode);
    workflow.addNode("suitabilityReasoner", suitabilityReasonerNode);
    workflow.addNode("carePlanGenerator", carePlanGeneratorNode);
    workflow.addNode("recommendationGenerator", finalRecommendationNode);

    // Define edges (workflow flow)
    workflow.addEdge("__start__", "inputContext");
    workflow.addEdge("inputContext", "environmentalAnalysis");
    workflow.addEdge("environmentalAnalysis", "suitabilityReasoner");
    workflow.addEdge("suitabilityReasoner", "carePlanGenerator");
    workflow.addEdge("carePlanGenerator", "recommendationGenerator");
    workflow.addEdge("recommendationGenerator", "__end__");

    return workflow.compile();
};

/**
 * Main function to run suitability analysis
 * @param {Object} projectDetails - Project information
 * @param {Object} environmentalContext - Environmental data
 * @returns {Object} Suitability recommendation
 */
export const analyzeSuitability = async (projectDetails, environmentalContext) => {
    console.log("\n🌱 Starting Suitability Analysis...");
    console.log(`Project: ${projectDetails.name}`);
    console.log(`Tree Type: ${projectDetails.treeType}`);
    console.log(`Size: ${projectDetails.plantationSize} trees`);

    const workflow = buildSuitabilityWorkflow();

    const initialState = new SuitabilityState();
    initialState.projectDetails = projectDetails;
    initialState.environmentalContext = environmentalContext;

    try {
        const result = await workflow.invoke(initialState);

        if (result.errors && result.errors.length > 0) {
            throw new Error(`Workflow errors: ${result.errors.join(', ')}`);
        }

        console.log("✅ Analysis completed successfully\n");
        return result.finalRecommendation;
    } catch (error) {
        console.error("❌ Analysis failed:", error.message);
        throw error;
    }
};

export default {
    analyzeSuitability,
    buildSuitabilityWorkflow
};
