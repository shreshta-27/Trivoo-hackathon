import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

// Test data
const testUser = {
    name: 'Test User',
    email: 'shreshtajunjuru@gmail.com',
    password: 'test123456',
    profession: 'System Admin'
};

const testProject = {
    name: 'Test Plantation Project',
    location: {
        latitude: 18.5204,
        longitude: 73.8567,
        address: 'Pune, Maharashtra'
    },
    treeType: 'Teak',
    plantationSize: 1000,
    metadata: {
        plantedDate: new Date().toISOString(),
        targetCompletionDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    }
};

// Color codes for console
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

const log = {
    success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
    error: (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
    info: (msg) => console.log(`${colors.blue}ℹ ${msg}${colors.reset}`),
    test: (msg) => console.log(`${colors.cyan}▶ ${msg}${colors.reset}`),
    warn: (msg) => console.log(`${colors.yellow}⚠ ${msg}${colors.reset}`)
};

// Test results tracker
const results = {
    passed: 0,
    failed: 0,
    tests: []
};

async function runTest(name, testFn) {
    log.test(`Testing: ${name}`);
    try {
        await testFn();
        results.passed++;
        results.tests.push({ name, status: 'PASS' });
        log.success(`${name} - PASSED`);
        return true;
    } catch (error) {
        results.failed++;
        results.tests.push({ name, status: 'FAIL', error: error.message });
        log.error(`${name} - FAILED: ${error.message}`);
        return false;
    }
}

// Test 1: Server Health Check
async function testServerHealth() {
    const response = await axios.get(`${BASE_URL}/`);
    if (response.data.message !== 'Trivo API is running') {
        throw new Error('Server health check failed');
    }
}

// Test 2: Get All Crops
async function testGetAllCrops() {
    const response = await axios.get(`${BASE_URL}/api/crops/crops`);
    if (!response.data.success || response.data.count !== 10) {
        throw new Error(`Expected 10 crops, got ${response.data.count}`);
    }
    log.info(`Found ${response.data.count} crops in database`);
}

// Test 3: Crop Recommendations
async function testCropRecommendations() {
    const response = await axios.get(`${BASE_URL}/api/crops/recommendations`, {
        params: {
            rainfall: 1200,
            temperature: 25,
            soilType: 'Black',
            limit: 5
        }
    });
    if (!response.data.success || !response.data.data.recommendations) {
        throw new Error('Crop recommendations failed');
    }
    log.info(`Received ${response.data.data.recommendations.length} recommendations`);
    log.info(`Top recommendation: ${response.data.data.recommendations[0].crop.name} (Score: ${response.data.data.recommendations[0].suitability.score})`);
}

// Test 4: Region-Based Recommendations
async function testRegionRecommendations() {
    const response = await axios.get(`${BASE_URL}/api/crops/region`, {
        params: { regionName: 'Pune' }
    });
    if (!response.data.success) {
        throw new Error('Region recommendations failed');
    }
    log.info(`Region: ${response.data.region}`);
    log.info(`Top crop for Pune: ${response.data.data.recommendations[0].crop.name}`);
}

// Test 5: User Registration
async function testUserRegistration() {
    try {
        const response = await axios.post(`${BASE_URL}/api/users/register`, testUser);
        if (!response.data.success) {
            throw new Error('User registration failed');
        }
        log.info(`User registered: ${response.data.user.email}`);
        log.info(`User profession: ${response.data.user.profession}`);
        return response.data;
    } catch (error) {
        if (error.response?.data?.message?.includes('already exists')) {
            log.warn('User already exists, skipping registration');
            return null;
        }
        throw error;
    }
}

// Test 6: User Login
async function testUserLogin() {
    const response = await axios.post(`${BASE_URL}/api/users/login`, {
        email: testUser.email,
        password: testUser.password
    });
    if (!response.data.success || !response.data.token) {
        throw new Error('User login failed');
    }
    log.info(`User logged in successfully`);
    log.info(`Token received: ${response.data.token.substring(0, 20)}...`);
    return response.data.token;
}

// Test 7: Email Service Test
async function testEmailService() {
    const emailTest = await axios.post(`${BASE_URL}/api/test/email`, {
        email: 'shreshtajunjuru@gmail.com',
        name: 'Shreshta Junjuru'
    });
    if (!emailTest.data.success) {
        throw new Error('Email test failed');
    }
    log.info('Test email sent to shreshtajunjuru@gmail.com');
}

// Test 8: List All Databases
async function testListDatabases() {
    const response = await axios.get(`${BASE_URL}/api/analytics/databases`);
    if (!response.data.success) {
        throw new Error('List databases failed');
    }
    log.info(`Found ${response.data.databases.length} databases`);
}

// Main test runner
async function runAllTests() {
    console.log('\n' + '='.repeat(60));
    log.info('TRIVO BACKEND COMPREHENSIVE TEST SUITE');
    console.log('='.repeat(60) + '\n');

    // Server Health Tests
    console.log('\n📡 SERVER HEALTH TESTS\n');
    await runTest('Server Health Check', testServerHealth);

    // Crop System Tests
    console.log('\n🌱 CROP RECOMMENDATION TESTS\n');
    await runTest('Get All Crops', testGetAllCrops);
    await runTest('Crop Recommendations', testCropRecommendations);
    await runTest('Region-Based Recommendations', testRegionRecommendations);

    // User System Tests
    console.log('\n👤 USER SYSTEM TESTS\n');
    await runTest('User Registration', testUserRegistration);
    await runTest('User Login', testUserLogin);

    // Email Tests
    console.log('\n📧 EMAIL SERVICE TESTS\n');
    await runTest('Email Service', testEmailService);

    // Database Tests
    console.log('\n💾 DATABASE TESTS\n');
    await runTest('List Databases', testListDatabases);

    // Summary
    console.log('\n' + '='.repeat(60));
    log.info('TEST SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total Tests: ${results.passed + results.failed}`);
    log.success(`Passed: ${results.passed}`);
    if (results.failed > 0) {
        log.error(`Failed: ${results.failed}`);
    }
    console.log('='.repeat(60) + '\n');

    // Detailed Results
    console.log('\nDETAILED RESULTS:\n');
    results.tests.forEach((test, index) => {
        const status = test.status === 'PASS'
            ? `${colors.green}PASS${colors.reset}`
            : `${colors.red}FAIL${colors.reset}`;
        console.log(`${index + 1}. ${test.name}: ${status}`);
        if (test.error) {
            console.log(`   Error: ${test.error}`);
        }
    });

    process.exit(results.failed > 0 ? 1 : 0);
}

// Run tests
runAllTests().catch(error => {
    log.error(`Test suite failed: ${error.message}`);
    process.exit(1);
});
