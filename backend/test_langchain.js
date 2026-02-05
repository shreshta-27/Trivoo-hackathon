// Test LangChain initialization
import dotenv from 'dotenv';
dotenv.config();

import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

console.log('Testing LangChain initialization...');
console.log('AI_MODEL:', process.env.AI_MODEL);
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'Set' : 'Not set');

try {
    const llm = new ChatGoogleGenerativeAI({
        model: process.env.AI_MODEL || "gemini-pro",
        temperature: parseFloat(process.env.AI_TEMPERATURE) || 0.3,
        apiKey: process.env.GEMINI_API_KEY
    });
    console.log('✅ LLM initialized successfully!');
    console.log('LLM:', llm);
} catch (error) {
    console.error('❌ LLM initialization failed:');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
}
