"use strict";
async function main() {
    const BASE_URL = 'http://localhost:3001/api';
    console.log('Starting Integration Test...');
    try {
        // 1. Register
        console.log('1. Registering Tenant...');
        const regRes = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                businessName: 'Acme HVAC',
                email: 'admin@acme.com',
                password: 'password123'
            })
        });
        const regData = await regRes.json();
        console.log('Register Response:', regData);
        if (!regRes.ok && regData.message !== 'Error registering user')
            throw new Error('Registration failed');
        // 2. Login
        console.log('2. Logging in...');
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@acme.com',
                password: 'password123'
            })
        });
        const loginData = await loginRes.json();
        console.log('Login Response:', loginData.token ? 'Token Received' : loginData);
        const token = loginData.token;
        if (!token)
            throw new Error('Login failed');
        // 3. Create Customer
        console.log('3. Creating Customer...');
        const custRes = await fetch(`${BASE_URL}/customers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name: 'John Doe',
                address: '123 Main St',
                phone: '555-0199'
            })
        });
        const custData = await custRes.json();
        console.log('Customer Created:', custData);
        // 4. Create Job
        console.log('4. Creating Job...');
        const jobRes = await fetch(`${BASE_URL}/jobs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                customerId: custData.id,
                scheduledStart: new Date().toISOString(),
                description: 'Fix AC'
            })
        });
        const jobData = await jobRes.json();
        console.log('Job Created:', jobData);
        // 5. Get Jobs
        console.log('5. Fetching Jobs...');
        const getJobsRes = await fetch(`${BASE_URL}/jobs`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const jobsData = await getJobsRes.json();
        console.log('Jobs Found:', jobsData.length);
    }
    catch (error) {
        console.error('Test Failed:', error);
    }
}
main();
