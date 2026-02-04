import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
console.log('API Key present:', !!apiKey);

const model = new ChatGoogleGenerativeAI({
    modelName: "gemini-pro",
    maxOutputTokens: 2048,
    apiKey: apiKey
});

async function test() {
    try {
        console.log('Testing Google GenAI...');
        const res = await model.invoke([
            ["human", "Hello, explain how AI works in one sentence."]
        ]);
        console.log('Success:', res.content);
    } catch (e) {
        console.error('Failure:', e);
    }
}

test();
