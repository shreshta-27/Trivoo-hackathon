import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage } from "@langchain/core/messages";
import { ENVIRONMENTAL_CONTEXT_PROMPT } from "./prompts/suitabilityPrompts.js";

const llm = new ChatGoogleGenerativeAI({
    modelName: process.env.AI_MODEL || "gemini-pro",
    temperature: 0.1, // Low temp for more consistent data
    apiKey: process.env.GOOGLE_API_KEY
});

export const getEnvironmentalContext = async (lat, lon) => {
    try {
        const prompt = ENVIRONMENTAL_CONTEXT_PROMPT
            .replace('{lat}', lat)
            .replace('{lon}', lon);

        const response = await llm.invoke([new HumanMessage(prompt)]);

        let clean = response.content.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(clean);
    } catch (error) {
        console.error("Env Agent Error:", error);
        // Fallback for safety or demo
        return {
            rainfall_mm: 1200,
            temp_min_c: 20,
            temp_max_c: 35,
            soil_type: "Loamy"
        };
    }
};
