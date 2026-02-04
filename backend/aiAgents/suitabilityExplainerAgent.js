import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage } from "@langchain/core/messages";
import { SUITABILITY_EXPLAINER_PROMPT } from "./prompts/suitabilityPrompts.js";

const llm = new ChatGoogleGenerativeAI({
    modelName: process.env.AI_MODEL || "gemini-pro",
    temperature: 0.3,
    apiKey: process.env.GOOGLE_API_KEY
});

export const explainSuitability = async (suitableTrees, envData, plantationSize, locationName) => {
    try {
        // Take top 5 to avoid context limit or slow response
        const topTrees = suitableTrees.slice(0, 5);
        const treeListStr = topTrees.map(t => `${t.name} (Score: ${t.reforestation_score}, Soil: ${t.soil.join(',')})`).join('\n');

        const prompt = SUITABILITY_EXPLAINER_PROMPT
            .replace('{location}', locationName)
            .replace('{rainfall}', envData.rainfall_mm)
            .replace('{tempMin}', envData.temp_min_c)
            .replace('{tempMax}', envData.temp_max_c)
            .replace('{soil}', envData.soil_type)
            .replace('{treeList}', treeListStr)
            .replace('{size}', plantationSize);

        const response = await llm.invoke([new HumanMessage(prompt)]);

        let clean = response.content.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(clean);
    } catch (error) {
        console.error("Explainer Agent Error:", error);
        return [];
    }
};
