// backend/test-api.js
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

async function testAPI() {
    try {
        // First, get a token (you'll need to login first)
        // For testing, we'll skip auth by using a test endpoint
        
        const response = await fetch('http://localhost:5000/api/ai/test');
        const data = await response.json();
        
        console.log('📡 API Test Result:', data);
        
    } catch (error) {
        console.error('❌ API Test Failed:', error.message);
    }
}

testAPI();