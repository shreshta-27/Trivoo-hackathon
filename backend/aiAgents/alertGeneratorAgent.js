import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ALERT_SYSTEM_PROMPT, GENERATE_ALERT_CONTENT_PROMPT } from "./prompts/alertGeneratorPrompts.js";
import dotenv from 'dotenv';

dotenv.config();

const initializeLLM = () => {
    return new ChatGoogleGenerativeAI({
        modelName: process.env.AI_MODEL || "gemini-pro",
        temperature: 0.4, // Slightly higher for persuasive/urgent tone
        apiKey: process.env.GOOGLE_API_KEY
    });
};

export const generateAlertContent = async (context) => {
    try {
        const llm = initializeLLM();

        const prompt = GENERATE_ALERT_CONTENT_PROMPT
            .replace('{riskType}', context.riskType)
            .replace('{severity}', context.severity)
            .replace('{projectName}', context.projectName)
            .replace('{location}', context.location)
            .replace('{issueDescription}', context.issueDescription)
            .replace('{actionRecommendation}', context.actionRecommendation)
            .replace('{urgencyLevel}', context.urgencyLevel);

        console.log(`🧠 AI Generating Alert for ${context.riskType}...`);

        const response = await llm.invoke([
            new SystemMessage(ALERT_SYSTEM_PROMPT),
            new HumanMessage(prompt)
        ]);

        let content = response.content.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(content);
    } catch (error) {
        console.error("AI Alert Generation Failed:", error);
        // Fallback content if AI fails
        return {
            subject: `URGENT: Issue Detected in ${context.projectName}`,
            htmlBody: `
                <h2 style="color:red;">High Risk Alert</h2>
                <p>An issue has been detected in <strong>${context.projectName}</strong>.</p>
                <p>Risk: ${context.issueDescription}</p>
                <p>Please check your dashboard immediately.</p>
            `
        };
    }
};

export default { generateAlertContent };
