// Comprehensive API Key and Feature Test
import dotenv from 'dotenv';
dotenv.config();

console.log('\n🧪 COMPREHENSIVE API KEY & FEATURE TEST\n');
console.log('='.repeat(80));

// Test 1: Verify all API keys are present
console.log('\n📋 TEST 1: API Keys Verification');
console.log('-'.repeat(80));

const apiKeys = {
    'GEMINI_API_KEY': process.env.GEMINI_API_KEY,
    'OPENWEATHER_API_KEY': process.env.OPENWEATHER_API_KEY,
    'NEWS_API_KEY': process.env.NEWS_API_KEY,
    'GROK_API_KEY': process.env.GROK_API_KEY,
    'BYTEZ_API_KEY': process.env.BYTEZ_API_KEY,
    'EMAIL_USER': process.env.EMAIL_USER,
    'EMAIL_PASS': process.env.EMAIL_PASS
};

let allKeysPresent = true;
for (const [key, value] of Object.entries(apiKeys)) {
    const status = value ? '✅' : '❌';
    console.log(`${status} ${key}: ${value ? 'Set' : 'Missing'}`);
    if (!value) allKeysPresent = false;
}

console.log(`\n${allKeysPresent ? '✅' : '❌'} All API Keys Status: ${allKeysPresent ? 'PASS' : 'FAIL'}`);

// Test 2: Test OpenWeather API
console.log('\n🌤️  TEST 2: OpenWeather API');
console.log('-'.repeat(80));

import axios from 'axios';

async function testOpenWeatherAPI() {
    try {
        const lat = 28.6139;
        const lon = 77.2090;
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`;

        const response = await axios.get(url);
        console.log('✅ OpenWeather API Response:');
        console.log(`   Location: ${response.data.name}`);
        console.log(`   Temperature: ${response.data.main.temp}°C`);
        console.log(`   Weather: ${response.data.weather[0].description}`);
        return true;
    } catch (error) {
        console.error('❌ OpenWeather API Failed:', error.message);
        return false;
    }
}

// Test 3: Test News API
console.log('\n📰 TEST 3: News API');
console.log('-'.repeat(80));

async function testNewsAPI() {
    try {
        const url = `https://newsapi.org/v2/everything?q=environment&pageSize=5&apiKey=${process.env.NEWS_API_KEY}`;

        const response = await axios.get(url);
        console.log('✅ News API Response:');
        console.log(`   Total Results: ${response.data.totalResults}`);
        console.log(`   Articles Retrieved: ${response.data.articles.length}`);
        if (response.data.articles.length > 0) {
            console.log(`   First Article: ${response.data.articles[0].title}`);
        }
        return true;
    } catch (error) {
        console.error('❌ News API Failed:', error.message);
        return false;
    }
}

// Test 4: Test Email Service with Fallback
console.log('\n📧 TEST 4: Email Service with Fallback');
console.log('-'.repeat(80));

import { sendWelcomeEmail } from './utils/emailService.js';

async function testEmailService() {
    try {
        const result = await sendWelcomeEmail('test@example.com', 'Test User');
        console.log('✅ Email Service Result:');
        console.log(`   Success: ${result.success}`);
        console.log(`   Mocked: ${result.mocked || false}`);
        console.log(`   Message ID: ${result.messageId}`);
        if (result.mockDetails) {
            console.log(`   Mock Status: ${result.mockDetails.status}`);
        }
        return true;
    } catch (error) {
        console.error('❌ Email Service Failed:', error.message);
        return false;
    }
}

// Run all tests
async function runAllTests() {
    const results = {
        apiKeys: allKeysPresent,
        openWeather: false,
        newsAPI: false,
        emailService: false
    };

    results.openWeather = await testOpenWeatherAPI();
    await new Promise(resolve => setTimeout(resolve, 1000));

    results.newsAPI = await testNewsAPI();
    await new Promise(resolve => setTimeout(resolve, 1000));

    results.emailService = await testEmailService();

    console.log('\n' + '='.repeat(80));
    console.log('📊 FINAL TEST RESULTS');
    console.log('='.repeat(80));
    console.log(`API Keys Present: ${results.apiKeys ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`OpenWeather API: ${results.openWeather ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`News API: ${results.newsAPI ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Email Service: ${results.emailService ? '✅ PASS' : '❌ FAIL'}`);

    const allPassed = Object.values(results).every(r => r === true);
    console.log(`\n${allPassed ? '🎉 ALL TESTS PASSED!' : '⚠️  SOME TESTS FAILED'}\n`);
}

runAllTests().catch(console.error);
