// backend/test-feedback.js
import dotenv from 'dotenv';
dotenv.config();

const API_URL = process.env.API_URL || 'http://localhost:10000/api';

async function testFeedback() {
    console.log('📝 Testing Feedback API...\n');
    
    // Test 1: Submit feedback
    console.log('1. Submitting feedback...');
    const submitRes = await fetch(`${API_URL}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: 'Test User',
            email: 'test@example.com',
            rating: 5,
            feedback: 'This is a test feedback message! Great platform!'
        })
    });
    const submitData = await submitRes.json();
    console.log('   Response:', submitData);
    
    // Test 2: Get feedbacks
    console.log('\n2. Getting feedbacks...');
    const getRes = await fetch(`${API_URL}/feedback?limit=5`);
    const getData = await getRes.json();
    console.log(`   Found ${getData.feedbacks?.length || 0} feedbacks`);
    
    // Test 3: Get stats
    console.log('\n3. Getting stats...');
    const statsRes = await fetch(`${API_URL}/feedback/stats`);
    const statsData = await statsRes.json();
    console.log('   Stats:', statsData.stats);
    
    console.log('\n✅ Feedback API test completed!');
}

testFeedback().catch(console.error);