import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { FUTURESCAPE_SYSTEM_PROMPT, FUTURESCAPE_USER_PROMPT } from "./prompts/futurescapePrompts.js";

const llm = new ChatGoogleGenerativeAI({
    model: process.env.AI_MODEL || "gemini-pro",
    temperature: 0.4,
    apiKey: process.env.GEMINI_API_KEY
});

export const compareScenarios = async (simulatedResults, years, location, speciesData) => {
    try {
        const scenarioText = simulatedResults.map(s =>
            `- Scenario ${s.scenarioId}: ${s.treeCount} ${s.species} trees. Env Score: ${s.metrics.environmental_score}. Density: ${s.metrics.visual_density}.`
        ).join('\n');

        const prompt = FUTURESCAPE_USER_PROMPT
            .replace('{years}', years)
            .replace('{location}', location)
            .replace('{scenarioData}', scenarioText);

        const response = await llm.invoke([
            new SystemMessage(FUTURESCAPE_SYSTEM_PROMPT),
            new HumanMessage(prompt)
        ]);

        let clean = response.content.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(clean);
    } catch (error) {
        console.error("Futurescape Agent Error:", error);
        return {
            summary: "Comparison failed.",
            recommendation: "Review data manually.",
            trade_offs: "None detected."
        };
    }
};

export default {
    compareScenarios
};
