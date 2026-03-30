import fetch from 'node-fetch';

async function testAdmin() {
    try {
        console.log('Testing GET /api/admins/users...');
        const response = await fetch('http://localhost:5000/api/admins/users');
        const data = await response.json();
        console.log('Response Status:', response.status);
        console.log('Data:', JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Fetch Error:', err.message);
    }
}

testAdmin();
