import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

const logFile = fs.createWriteStream('test_run.log');
const log = (msg) => {
    console.log(msg);
    logFile.write(typeof msg === 'object' ? JSON.stringify(msg, null, 2) + '\n' : msg + '\n');
};
const errorLog = (msg) => {
    console.error(msg);
    logFile.write('ERROR: ' + (typeof msg === 'object' ? JSON.stringify(msg, null, 2) : msg) + '\n');
};

log('1. Dotenv configured');
log('API Key check: ' + (process.env.GOOGLE_API_KEY ? 'Present' : 'Missing'));
log('GEMINI Key check: ' + (process.env.GEMINI_API_KEY ? 'Present' : 'Missing'));

async function runTest() {
    log('2. Importing agent...');
    try {
        const agentModule = await import('./aiAgents/suitabilityAgent.js');
        log('3. Agent imported successfully');

        const { analyzeSuitability } = agentModule;

        log('4. Preparing mocked data...');
        const projectDetails = {
            name: 'Test Teak Plantation',
            plantationSize: 50,
            treeType: 'teak'
        };

        const environmentalContext = {
            location: { latitude: 18.5204, longitude: 73.8567 },
            soil: { type: 'loamy', pH: 6.8, organicMatter: 3.5, drainage: 'good' },
            climate: { averageRainfall: 1200, temperatureRange: { min: 20, max: 35 }, humidity: 65, climateZone: 'tropical' },
            risks: [{ type: 'pest', probability: 'medium', season: 'monsoon' }]
        };

        log('5. Running analysis...');
        try {
            const result = await analyzeSuitability(projectDetails, environmentalContext);
            log('\n✅ Analysis Result:');
            log(result);
            log('\n🎉 Feature is working correctly!');
        } catch (innerError) {
            errorLog('Inner Execution Error: ' + innerError.message);
            if (innerError.stack) errorLog(innerError.stack);
        }

    } catch (error) {
        errorLog('❌ Top Level Error: ' + error.message);
        if (error.stack) errorLog(error.stack);
    }
}

runTest();
