console.log('Starting debug...');
try {
    await import('@langchain/langgraph');
    console.log('✅ @langchain/langgraph imported');
} catch (e) {
    console.error('❌ @langchain/langgraph output error:', e.message);
}

try {
    await import('@langchain/google-genai');
    console.log('✅ @langchain/google-genai imported');
} catch (e) {
    console.error('❌ @langchain/google-genai error:', e.message);
}

try {
    await import('./aiAgents/suitabilityAgent.js');
    console.log('✅ suitabilityAgent imported');
} catch (e) {
    console.error('❌ suitabilityAgent error:', e.message);
}
console.log('Debug complete');
