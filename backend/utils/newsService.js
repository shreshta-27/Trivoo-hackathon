import axios from 'axios';

export const fetchEnvironmentalNews = async () => {
    if (process.env.NEWS_API_KEY) {
        try {
            console.log("🌍 Fetching live news from NewsAPI...");
            const response = await axios.get('https://newsapi.org/v2/everything', {
                params: {
                    q: 'agriculture OR forestry OR "climate change" OR reforestation AND India',
                    language: 'en',
                    sortBy: 'publishedAt',
                    pageSize: 5,
                    apiKey: process.env.NEWS_API_KEY
                },
                timeout: 8000
            });

            if (response.data.status === 'ok' && response.data.articles.length > 0) {
                console.log(`✅ Fetched ${response.data.articles.length} articles from NewsAPI`);
                return response.data.articles.map(article => ({
                    title: article.title,
                    description: article.description || article.content,
                    source: {
                        name: article.source.name,
                        url: article.url
                    },
                    publishedAt: article.publishedAt
                }));
            }
        } catch (error) {
            console.warn(`⚠️ NewsAPI failed: ${error.message}. Falling back to mock data.`);
        }
    } else {
        console.warn("⚠️ No NEWS_API_KEY found. Using mock data.");
    }

    await new Promise(resolve => setTimeout(resolve, 800));

    return [
        {
            title: "Forest fire reported near Nashik district amid heatwave",
            description: "A large forest fire has been spotted in the hills near Nashik city. Authorities warn that rising temperatures and strong winds are spreading the flames. Smoke is visible from 20km away.",
            source: { name: "Local News Network", url: "https://example.com/nashik-fire" },
            publishedAt: new Date().toISOString()
        },
        {
            title: "Severe drought warning issued for Marathwada region",
            description: "Meteorological department declares impending drought conditions for Marathwada. Water levels in dams are critically low. Farmers asked to conserve water.",
            source: { name: "AgriDaily", url: "https://example.com/drought-warning" },
            publishedAt: new Date().toISOString()
        },
        {
            title: "Tech giant announces new smartphone launch",
            description: "The latest smartphone model features a titanium body and AI capabilities. Pre-orders start tomorrow.",
            source: { name: "TechCrunch", url: "https://example.com/phone-launch" },
            publishedAt: new Date().toISOString()
        },
        {
            title: "Illegal logging activity detected in Western Ghats",
            description: "Forest officials have intercepted a truck carrying illegal timber near the Pune-Satara border. Increased patrolling has been ordered in the reserve forest areas.",
            source: { name: "EcoWatch", url: "https://example.com/illegal-logging" },
            publishedAt: new Date(Date.now() - 86400000).toISOString() // Yesterday
        },
        {
            title: "New parklessour opened in Mumbai suburbs",
            description: "A new community park has been inaugurated in Andheri. It features a walking track and play area for children.",
            source: { name: "City Times", url: "https://example.com/new-park" },
            publishedAt: new Date().toISOString()
        }
    ];
};

export default {
    fetchEnvironmentalNews
};
