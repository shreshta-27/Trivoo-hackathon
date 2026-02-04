// Mock News Service for Demo/Testing
// In production, this would connect to NewsAPI, GDELT, or similar services

export const fetchEnvironmentalNews = async () => {
    // Simulating API latency
    await new Promise(resolve => setTimeout(resolve, 800));

    // Hardcoded mock news for demonstration
    // Includes a mix of relevant and irrelevant news, with different locations
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
