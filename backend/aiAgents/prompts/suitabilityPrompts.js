/**
 * Suitability Analysis Prompts
 * Structured prompts for the LLM to ensure consistent, explainable outputs
 */

export const SYSTEM_PROMPT = `You are an expert agricultural and forestry advisor specializing in plantation suitability analysis for reforestation projects in India.

Your role is to evaluate whether a proposed plantation project is viable at a specific location based on environmental data.

You must provide:
1. Clear suitability assessment (suitable, suitable_with_caution, or not_recommended)
2. Detailed reasoning explaining your decision
3. Specific fertilizer recommendations
4. Care duration and instructions
5. Risk warnings with mitigation strategies

Your analysis must be:
- Evidence-based: Use the provided environmental data
- Explainable: Clearly state your reasoning
- Practical: Provide actionable recommendations
- Conservative: Err on the side of caution for farmer/NGO success

Output your response as a valid JSON object with this exact structure:
{
  "suitabilityStatus": "suitable" | "suitable_with_caution" | "not_recommended",
  "reasoning": "detailed explanation of your decision",
  "fertilizers": [
    {
      "name": "fertilizer name",
      "type": "organic" | "chemical" | "bio-fertilizer",
      "applicationRate": "e.g., 5kg per tree",
      "frequency": "e.g., once every 3 months"
    }
  ],
  "careDuration": number (days of intensive care needed),
  "careInstructions": ["instruction 1", "instruction 2", ...],
  "irrigationNeeds": "low" | "moderate" | "high",
  "riskWarnings": [
    {
      "type": "drought" | "flood" | "fire" | "pest" | "disease" | "soil_incompatibility",
      "severity": "low" | "medium" | "high",
      "description": "description of the risk",
      "mitigation": "how to mitigate this risk"
    }
  ],
  "confidence": number between 0 and 1
}`;

export const ANALYSIS_PROMPT_TEMPLATE = `Analyze the suitability of the following plantation project:

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
6. Estimate initial care duration (typically 90-180 days for establishment)
7. Provide specific, actionable care instructions

Provide your analysis as a JSON object following the specified structure.`;

export const FEW_SHOT_EXAMPLES = [
    {
        input: {
            projectName: "Teak Plantation",
            latitude: 18.5204,
            longitude: 73.8567,
            plantationSize: 1000,
            treeType: "Teak",
            soilType: "loamy",
            soilPH: 6.8,
            organicMatter: 3.5,
            drainage: "good",
            rainfall: 1200,
            tempMin: 15,
            tempMax: 35,
            humidity: 65,
            climateZone: "subtropical",
            riskFactors: "Medium drought risk in summer"
        },
        output: {
            suitabilityStatus: "suitable",
            reasoning: "Teak thrives in loamy soil with pH 6.5-7.5, making this location ideal. The subtropical climate with 1200mm annual rainfall is adequate for teak growth. Temperature range (15-35°C) is within optimal parameters. The plantation size of 1000 trees is manageable with proper planning.",
            fertilizers: [
                {
                    name: "Vermicompost",
                    type: "organic",
                    applicationRate: "5kg per tree",
                    frequency: "Once every 4 months"
                },
                {
                    name: "NPK 10:26:26",
                    type: "chemical",
                    applicationRate: "200g per tree",
                    frequency: "Once every 6 months"
                }
            ],
            careDuration: 120,
            careInstructions: [
                "Water deeply twice a week for first 3 months",
                "Apply mulch around base to retain moisture",
                "Protect from grazing animals with fencing",
                "Monitor for termite activity monthly",
                "Prune dead branches after 6 months"
            ],
            irrigationNeeds: "moderate",
            riskWarnings: [
                {
                    type: "drought",
                    severity: "medium",
                    description: "Summer drought may stress young saplings",
                    mitigation: "Install drip irrigation system and increase watering frequency during dry months"
                }
            ],
            confidence: 0.9
        }
    },
    {
        input: {
            projectName: "Mango Orchard",
            latitude: 20.5937,
            longitude: 78.9629,
            plantationSize: 500,
            treeType: "Mango",
            soilType: "clay",
            soilPH: 8.2,
            organicMatter: 2.0,
            drainage: "poor",
            rainfall: 600,
            tempMin: 10,
            tempMax: 42,
            humidity: 45,
            climateZone: "semi-arid",
            riskFactors: "High drought risk, poor soil drainage"
        },
        output: {
            suitabilityStatus: "suitable_with_caution",
            reasoning: "Mango prefers well-drained sandy-loamy soil with pH 5.5-7.5. This location has clay soil with high pH (8.2) and poor drainage, which can cause root rot. The semi-arid climate with only 600mm rainfall is below optimal (750-1000mm). However, with soil amendments and irrigation, the project can succeed.",
            fertilizers: [
                {
                    name: "Gypsum",
                    type: "chemical",
                    applicationRate: "1kg per tree",
                    frequency: "Once at planting to reduce pH"
                },
                {
                    name: "Farmyard Manure",
                    type: "organic",
                    applicationRate: "10kg per tree",
                    frequency: "Once every 6 months"
                }
            ],
            careDuration: 180,
            careInstructions: [
                "Amend soil with sand and organic matter to improve drainage",
                "Create raised beds to prevent waterlogging",
                "Install drip irrigation system (mandatory)",
                "Apply gypsum to lower soil pH",
                "Water daily for first 6 months",
                "Monitor soil moisture closely"
            ],
            irrigationNeeds: "high",
            riskWarnings: [
                {
                    type: "drought",
                    severity: "high",
                    description: "Insufficient rainfall for mango cultivation",
                    mitigation: "Mandatory drip irrigation with water storage tanks"
                },
                {
                    type: "soil_incompatibility",
                    severity: "medium",
                    description: "Clay soil with poor drainage can cause root diseases",
                    mitigation: "Improve drainage with sand amendment and raised planting beds"
                }
            ],
            confidence: 0.65
        }
    }
];

export default {
    SYSTEM_PROMPT,
    ANALYSIS_PROMPT_TEMPLATE,
    FEW_SHOT_EXAMPLES
};
