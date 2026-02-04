import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { FUTURE_RISK_SYSTEM_PROMPT, FUTURE_RISK_USER_PROMPT } from "./prompts/futureRiskPrompts.js";

const llm = new ChatGoogleGenerativeAI({
    modelName: process.env.AI_MODEL || "gemini-pro",
    temperature: 0.2,
    apiKey: process.env.GOOGLE_API_KEY
});

export const forecastFutureRisk = async (project, trends, speciesData) => {
    try {
        const prompt = FUTURE_RISK_USER_PROMPT
            .replace('{projectName}', project.name)
            .replace('{treeSpecies}', project.treeType)
            .replace('{location}', project.location.coordinates.join(','))
            .replace('{healthScore}', project.healthScore)
            .replace('{healthSlope}', trends.healthSlope)
            .replace('{maintenanceGap}', trends.maintenanceGap)
            .replace('{riskFactors}', trends.riskFactors.join(', ') || 'None')
            .replace('{waterNeed}', speciesData.water_need)
            .replace('{tempRange}', speciesData.temperature_c);

        const response = await llm.invoke([
            new SystemMessage(FUTURE_RISK_SYSTEM_PROMPT),
            new HumanMessage(prompt)
        ]);

        let clean = response.content.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(clean);
    } catch (error) {
        console.error("Future Risk Agent Failed:", error);
        return {
            riskLevel: "Low",
            explanation: "Analysis failed, defaulting to low risk.",
            actions: []
        };
    }
};
