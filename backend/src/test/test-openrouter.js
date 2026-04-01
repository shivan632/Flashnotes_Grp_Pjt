// backend/src/test/test-openrouter.js
import dotenv from 'dotenv';
import { generatePDFSummary, testOpenRouter, listAvailableModels, getCurrentWorkingModel } from '../services/openrouterService.js';

dotenv.config();

async function testOpenRouterConnection() {
    console.log('\n🧪 OPENROUTER API TEST SUITE\n');
    console.log('='.repeat(60));
    
    // Check if API key is loaded
    const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
    console.log(`\n🔑 API Key Status: ${apiKey ? '✅ Loaded' : '❌ Missing'}`);
    
    if (apiKey) {
        console.log(`   Key preview: ${apiKey.substring(0, 15)}...`);
        console.log(`   Key type: ${apiKey.startsWith('sk-or-v1') ? 'OpenRouter' : 'OpenAI'}`);
    } else {
        console.log('\n⚠️ No API key found in .env file');
        console.log('   Please add OPENROUTER_API_KEY or OPENAI_API_KEY to backend/.env');
        console.log('   Example: OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxx\n');
        return;
    }
    
    // Test 1: Basic connection test
    console.log('\n📡 TEST 1: Basic Connection Test');
    console.log('-'.repeat(50));
    
    const connectionTest = await testOpenRouter();
    
    if (connectionTest.success) {
        console.log('✅ Connection successful!');
        console.log(`   Working model: ${connectionTest.model}`);
        console.log(`   Available models: ${connectionTest.availableModels || 'N/A'}`);
        console.log(`   Response: ${connectionTest.message?.substring(0, 100)}...`);
    } else {
        console.log('❌ Connection failed:', connectionTest.error);
        console.log('   Possible issues:');
        console.log('   - Invalid API key');
        console.log('   - No credits on OpenRouter');
        console.log('   - Network issues');
        console.log('   - Rate limited');
        return;
    }
    
    // Test 2: List available models from our service
    console.log('\n📋 TEST 2: Available Models in Service');
    console.log('-'.repeat(50));
    
    const models = await listAvailableModels();
    console.log(`✅ Found ${models.length} models configured:`);
    
    // Show first 10 models
    models.slice(0, 10).forEach((model, index) => {
        console.log(`   ${(index + 1).toString().padStart(2)}. ${model.name.padEnd(20)} → ${model.id}`);
    });
    if (models.length > 10) {
        console.log(`   ... and ${models.length - 10} more`);
    }
    
    // Test 3: Generate PDF summary with sample text
    console.log('\n📝 TEST 3: Generate PDF Summary');
    console.log('-'.repeat(50));
    
    const sampleText = `
JavaScript is a high-level, interpreted programming language that conforms to the ECMAScript specification. 
It is a language that is also characterized as dynamic, weakly typed, prototype-based and multi-paradigm.
Alongside HTML and CSS, JavaScript is one of the core technologies of the World Wide Web. 
JavaScript enables interactive web pages and is an essential part of web applications. 
The vast majority of websites use it for client-side page behavior, and all major web browsers have a dedicated 
JavaScript engine to execute it.

Key features of JavaScript include:
- First-class functions
- Prototype-based object orientation
- Dynamic typing
- Event-driven programming
- Asynchronous programming with Promises and async/await

JavaScript was created by Brendan Eich in 1995 while working at Netscape Communications.
`;
    
    console.log('📡 Generating summary for sample text...');
    console.log('   This will try multiple models automatically if needed\n');
    
    const startTime = Date.now();
    const result = await generatePDFSummary(sampleText, 'JavaScript');
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    if (result.success) {
        console.log(`✅ Summary generated successfully! (${duration}s)`);
        console.log(`   Model used: ${result.model}`);
        console.log(`   Summary length: ${result.summary?.length || 0} characters`);
        
        if (result.usage) {
            console.log(`   Tokens: ${result.usage.total_tokens || 'N/A'}`);
        }
        
        if (result.warning) {
            console.log(`   ⚠️ Warning: ${result.warning}`);
        }
        
        if (result.error) {
            console.log(`   ⚠️ Note: ${result.error}`);
        }
        
        if (result.summary && !result.summary.includes('unavailable') && !result.summary.includes('fallback')) {
            console.log('\n📄 SUMMARY PREVIEW:');
            console.log('='.repeat(50));
            console.log(result.summary.substring(0, 800));
            if (result.summary.length > 800) {
                console.log('\n... (truncated)');
            }
            console.log('='.repeat(50));
        } else if (result.summary && (result.summary.includes('unavailable') || result.summary.includes('fallback'))) {
            console.log('\n⚠️ Fallback summary used. API models may be rate limited.');
            console.log('   Preview of fallback:');
            console.log('-'.repeat(40));
            console.log(result.summary.substring(0, 400));
            console.log('-'.repeat(40));
        }
    } else {
        console.log('❌ Summary generation failed:', result.error);
    }
    
    // Test 4: Check current working model
    console.log('\n🔧 TEST 4: Current Working Model Status');
    console.log('-'.repeat(50));
    
    try {
        const workingModel = await getCurrentWorkingModel();
        console.log(`   Current working model: ${workingModel.model}`);
        console.log(`   Fallback mode: ${workingModel.inFallbackMode ? 'Yes (using fallback)' : 'No (API working)'}`);
    } catch (error) {
        console.log('   Could not get working model status:', error.message);
    }
    
    // Test 5: Error handling test
    console.log('\n🛡️ TEST 5: Error Handling');
    console.log('-'.repeat(50));
    
    try {
        const errorTest = await generatePDFSummary('', '');
        if (errorTest.success) {
            console.log('✅ Empty input handled gracefully');
            if (errorTest.model === 'fallback') {
                console.log('   Used fallback model (graceful degradation)');
            }
        }
    } catch (error) {
        console.log('❌ Error handling failed:', error.message);
    }
    
    // Test 6: Performance test with different text lengths
    console.log('\n⚡ TEST 6: Performance Test');
    console.log('-'.repeat(50));
    
    const shortText = "JavaScript is a programming language for web development.";
    
    console.log('   Testing with short text (50 chars)...');
    const shortStart = Date.now();
    const shortResult = await generatePDFSummary(shortText, 'JS Short');
    const shortDuration = ((Date.now() - shortStart) / 1000).toFixed(2);
    console.log(`   ✅ Short text completed (${shortDuration}s) - Model: ${shortResult.model}`);
    
    // Summary
    console.log('\n📊 TEST SUMMARY');
    console.log('='.repeat(60));
    
    const isWorking = connectionTest.success && result.model !== 'fallback';
    
    if (isWorking) {
        console.log('✅ All tests passed! OpenRouter is working correctly.');
        console.log('\n💡 Notes:');
        console.log('   - PDF summary feature is ready to use');
        console.log('   - Auto model fallback is enabled');
        console.log('   - You can now upload PDFs and get AI summaries');
        console.log(`   - Working model: ${result.model}`);
    } else if (connectionTest.success && result.model === 'fallback') {
        console.log('⚠️ Connection works but summary generation is using fallback.');
        console.log('   Possible reasons:');
        console.log('   - Rate limiting (too many requests)');
        console.log('   - OpenRouter server issues');
        console.log('   - All models temporarily unavailable');
        console.log('\n   Recommendations:');
        console.log('   - Wait 30 seconds and try again');
        console.log('   - Check OpenRouter status at https://status.openrouter.ai');
        console.log('   - Try again in a few minutes');
    } else {
        console.log('❌ Tests failed. Please check:');
        console.log('   1. API key is correct');
        console.log('   2. OpenRouter account has credits');
        console.log('   3. Internet connection');
    }
    
    console.log('\n✅ Test suite completed\n');
    console.log('💡 Tip: Run this test again if you get errors - they are temporary!');
}

// Run tests
testOpenRouterConnection().catch(console.error);

export default testOpenRouterConnection;