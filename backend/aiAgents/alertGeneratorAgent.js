import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ALERT_SYSTEM_PROMPT, GENERATE_ALERT_CONTENT_PROMPT } from "./prompts/alertGeneratorPrompts.js";
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const callGroq = async (system, user) => {
    try {
        const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
            model: "llama3-8b-8192", // Fast Llama 3 on Groq
            messages: [
                { role: "system", content: system },
                { role: "user", content: user }
            ],
            temperature: 0.6,
            response_format: { type: "json_object" } // Force JSON if supported, or rely on prompt
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.GROK_API_KEY}`,
                'Content-Type': 'application/json'
            },
            timeout: 10000
        });
        return response.data.choices[0].message.content;
    } catch (error) {
        throw new Error(`Groq API Error: ${error.message}`);
    }
};

const initializeGemini = () => {
    return new ChatGoogleGenerativeAI({
        model: process.env.AI_MODEL || "gemini-pro",
        temperature: 0.4,
        apiKey: process.env.GEMINI_API_KEY
    });
};

export const generateAlertContent = async (context) => {
    const prompt = GENERATE_ALERT_CONTENT_PROMPT
        .replace('{riskType}', context.riskType)
        .replace('{severity}', context.severity)
        .replace('{projectName}', context.projectName)
        .replace('{location}', context.location)
        .replace('{issueDescription}', context.issueDescription)
        .replace('{actionRecommendation}', context.actionRecommendation)
        .replace('{urgencyLevel}', context.urgencyLevel);

    console.log(`🧠 AI Generating Alert for ${context.riskType}...`);

    let contentStr = "";

    try {
        if (process.env.GROK_API_KEY) {
            console.log("⚡ Using Groq (Llama 3) for high-speed alert generation...");
            try {
                contentStr = await callGroq(ALERT_SYSTEM_PROMPT + "\n IMPORTANT: Return ONLY JSON.", prompt);
            } catch (groqError) {
                console.warn("⚠️ Groq Failed, falling back to Gemini:", groqError.message);
            }
        }

        if (!contentStr) {
            const llm = initializeGemini();
            const response = await llm.invoke([
                new SystemMessage(ALERT_SYSTEM_PROMPT),
                new HumanMessage(prompt)
            ]);
            contentStr = response.content;
        }

        let clean = contentStr.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(clean);

    } catch (error) {
        console.error("AI Alert Generation Failed:", error);
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
