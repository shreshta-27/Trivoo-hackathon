import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const FALLBACK_MODELS = [
    "gemini-2.0-flash-exp",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-1.5-pro"
];

const RATE_LIMIT_CONFIG = {
    maxRequestsPerMinute: 15,
    maxRequestsPerHour: 500,
    cooldownPeriod: 60000 // 1 minute
};

const responseCache = new Map();
const CACHE_TTL = 3600000; // 1 hour

const rateLimitTracker = {
    requestsThisMinute: [],
    requestsThisHour: [],
    lastResetMinute: Date.now(),
    lastResetHour: Date.now(),
    inCooldown: false,
    cooldownUntil: null
};

const cleanupRateLimitTrackers = () => {
    const now = Date.now();

    if (now - rateLimitTracker.lastResetMinute >= 60000) {
        rateLimitTracker.requestsThisMinute = [];
        rateLimitTracker.lastResetMinute = now;
    }

    if (now - rateLimitTracker.lastResetHour >= 3600000) {
        rateLimitTracker.requestsThisHour = [];
        rateLimitTracker.lastResetHour = now;
    }

    if (rateLimitTracker.inCooldown && now >= rateLimitTracker.cooldownUntil) {
        rateLimitTracker.inCooldown = false;
        rateLimitTracker.cooldownUntil = null;
        console.log('✓ Cooldown period ended');
    }
};

const checkRateLimit = () => {
    cleanupRateLimitTrackers();

    if (rateLimitTracker.inCooldown) {
        const remainingTime = Math.ceil((rateLimitTracker.cooldownUntil - Date.now()) / 1000);
        throw new Error(`Rate limit cooldown active. Try again in ${remainingTime} seconds`);
    }

    if (rateLimitTracker.requestsThisMinute.length >= RATE_LIMIT_CONFIG.maxRequestsPerMinute) {
        rateLimitTracker.inCooldown = true;
        rateLimitTracker.cooldownUntil = Date.now() + RATE_LIMIT_CONFIG.cooldownPeriod;
        throw new Error('Rate limit exceeded: too many requests per minute');
    }

    if (rateLimitTracker.requestsThisHour.length >= RATE_LIMIT_CONFIG.maxRequestsPerHour) {
        rateLimitTracker.inCooldown = true;
        rateLimitTracker.cooldownUntil = Date.now() + RATE_LIMIT_CONFIG.cooldownPeriod;
        throw new Error('Rate limit exceeded: too many requests per hour');
    }
};

const recordRequest = () => {
    const now = Date.now();
    rateLimitTracker.requestsThisMinute.push(now);
    rateLimitTracker.requestsThisHour.push(now);
};

const generateCacheKey = (messages, modelName) => {
    const content = messages.map(m => m.content).join('|');
    return `${modelName}:${Buffer.from(content).toString('base64').substring(0, 100)}`;
};

const getCachedResponse = (cacheKey) => {
    const cached = responseCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        console.log('✓ Using cached response');
        return cached.response;
    }
    if (cached) {
        responseCache.delete(cacheKey);
    }
    return null;
};

const cacheResponse = (cacheKey, response) => {
    responseCache.set(cacheKey, {
        response,
        timestamp: Date.now()
    });

    if (responseCache.size > 100) {
        const oldestKey = responseCache.keys().next().value;
        responseCache.delete(oldestKey);
    }
};

export const getWorkingModel = async (preferredModel = null) => {
    const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error('No API key configured for Google Generative AI');
    }

    const modelsToTry = preferredModel
        ? [preferredModel, ...FALLBACK_MODELS.filter(m => m !== preferredModel)]
        : FALLBACK_MODELS;

    const uniqueModels = [...new Set(modelsToTry)];

    for (const modelName of uniqueModels) {
        try {
            const model = new ChatGoogleGenerativeAI({
                modelName: modelName,
                model: modelName,
                temperature: parseFloat(process.env.AI_TEMPERATURE) || 0.3,
                apiKey: apiKey,
                maxRetries: 0 // We handle retries ourselves
            });

            await model.invoke([{ role: 'user', content: 'test' }]);

            console.log(`✓ Using model: ${modelName}`);
            return { model, modelName };
        } catch (error) {
            console.warn(`Model ${modelName} failed: ${error.message}`);
            continue;
        }
    }

    throw new Error('All AI models failed. Please check API key and quota.');
};

export const invokeAIWithRetry = async (messages, options = {}) => {
    const {
        maxRetries = 3,
        retryDelay = 1000,
        exponentialBackoff = true,
        useCache = true,
        preferredModel = null
    } = options;

    try {
        checkRateLimit();
    } catch (error) {
        console.error(`⚠️ ${error.message}`);
        throw error;
    }

    if (useCache) {
        const cacheKey = generateCacheKey(messages, preferredModel || 'default');
        const cached = getCachedResponse(cacheKey);
        if (cached) {
            return cached;
        }
    }

    let lastError = null;
    let attempt = 0;

    while (attempt < maxRetries) {
        try {
            attempt++;
            console.log(`AI request attempt ${attempt}/${maxRetries}`);

            const { model, modelName } = await getWorkingModel(preferredModel);

            const startTime = Date.now();
            const response = await model.invoke(messages);
            const processingTime = Date.now() - startTime;

            recordRequest();

            if (useCache) {
                const cacheKey = generateCacheKey(messages, modelName);
                cacheResponse(cacheKey, response);
            }

            console.log(`✓ AI request successful (${processingTime}ms)`);

            return {
                ...response,
                metadata: {
                    modelName,
                    processingTime,
                    attempt,
                    cached: false
                }
            };

        } catch (error) {
            lastError = error;
            console.warn(`Attempt ${attempt} failed: ${error.message}`);

            if (error.message.includes('Rate limit') || error.message.includes('quota')) {
                throw error;
            }

            if (attempt < maxRetries) {
                const delay = exponentialBackoff
                    ? retryDelay * Math.pow(2, attempt - 1)
                    : retryDelay;

                console.log(`Waiting ${delay}ms before retry...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }

    throw new Error(`AI request failed after ${maxRetries} attempts. Last error: ${lastError?.message}`);
};

export const parseAIResponse = (response) => {
    try {
        let content = response.content;

        if (content.includes('```json')) {
            content = content.split('```json')[1].split('```')[0].trim();
        } else if (content.includes('```')) {
            content = content.split('```')[1].split('```')[0].trim();
        }

        return JSON.parse(content);
    } catch (error) {
        throw new Error(`Failed to parse AI response: ${error.message}`);
    }
};

export const getRateLimitStatus = () => {
    cleanupRateLimitTrackers();

    return {
        requestsThisMinute: rateLimitTracker.requestsThisMinute.length,
        requestsThisHour: rateLimitTracker.requestsThisHour.length,
        maxPerMinute: RATE_LIMIT_CONFIG.maxRequestsPerMinute,
        maxPerHour: RATE_LIMIT_CONFIG.maxRequestsPerHour,
        inCooldown: rateLimitTracker.inCooldown,
        cooldownEndsAt: rateLimitTracker.cooldownUntil,
        cacheSize: responseCache.size
    };
};

export const clearCache = () => {
    responseCache.clear();
    console.log('✓ Response cache cleared');
};

export default {
    getWorkingModel,
    invokeAIWithRetry,
    parseAIResponse,
    getRateLimitStatus,
    clearCache
};
