import fetch from 'node-fetch';

const API_URL = 'http://localhost:5000/api';

async function testAuthentication() {
    console.log('🧪 Testing Trivo Authentication System\n');

    console.log('1️⃣ Testing User Registration...');
    const registerData = {
        name: 'Test User',
        email: 'test@trivo.com',
        password: 'test123',
        profession: 'ngo'
    };

    try {
        const registerResponse = await fetch(`${API_URL}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(registerData)
        });
        const registerResult = await registerResponse.json();

        if (registerResponse.ok) {
            console.log('✅ Registration successful!');
            console.log('   User:', registerResult.name);
            console.log('   Email:', registerResult.email);
            console.log('   Profession:', registerResult.profession);
            console.log('   Token:', registerResult.token.substring(0, 20) + '...\n');

            console.log('2️⃣ Testing User Login...');
            const loginResponse = await fetch(`${API_URL}/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: registerData.email,
                    password: registerData.password
                })
            });
            const loginResult = await loginResponse.json();

            if (loginResponse.ok) {
                console.log('✅ Login successful!');
                console.log('   Token:', loginResult.token.substring(0, 20) + '...\n');

                console.log('3️⃣ Testing Protected Route (Get Profile)...');
                const profileResponse = await fetch(`${API_URL}/users/profile`, {
                    headers: {
                        'Authorization': `Bearer ${loginResult.token}`
                    }
                });
                const profileResult = await profileResponse.json();

                if (profileResponse.ok) {
                    console.log('✅ Profile retrieved successfully!');
                    console.log('   Name:', profileResult.name);
                    console.log('   Email:', profileResult.email);
                    console.log('   Profession:', profileResult.profession);
                    console.log('\n✨ All tests passed! Authentication system is working correctly.\n');
                } else {
                    console.log('❌ Profile retrieval failed:', profileResult.message);
                }
            } else {
                console.log('❌ Login failed:', loginResult.message);
            }
        } else {
            console.log('❌ Registration failed:', registerResult.message);
        }
    } catch (error) {
        console.log('❌ Error:', error.message);
    }
}

testAuthentication();
