// backend/src/test/test-gemini-code.js
import dotenv from 'dotenv';
import { executeCode, testGeminiCodeConnection } from '../services/geminiCodeService.js';

dotenv.config();

async function testGeminiCodeExecution() {
    console.log('\n🧪 GEMINI CODE EXECUTION TEST SUITE\n');
    console.log('='.repeat(60));
    
    // Check API key
    const apiKey = process.env.GEMINI_CODE_API_KEY;
    console.log(`\n🔑 API Key Status: ${apiKey ? '✅ Loaded' : '❌ Missing'}`);
    
    if (!apiKey) {
        console.log('\n⚠️ Please add GEMINI_CODE_API_KEY to .env file');
        return;
    }
    
    // Test connection
    console.log('\n🔌 TEST 1: Connection Test');
    console.log('-'.repeat(50));
    
    const connTest = await testGeminiCodeConnection();
    if (connTest.success) {
        console.log(`✅ Connected successfully!`);
        console.log(`   Model: ${connTest.model}`);
        console.log(`   Response: ${connTest.message?.substring(0, 100)}`);
    } else {
        console.log(`❌ Connection failed: ${connTest.error}`);
        return;
    }
    
    // Test 2: Python Code
    console.log('\n🐍 TEST 2: Execute Python Code');
    console.log('-'.repeat(50));
    
    const pythonCode = `print("Hello from Flashnotes!")
print("Sum of 10 and 20 is:", 10 + 20)`;
    
    const pythonResult = await executeCode(pythonCode, 'python');
    if (pythonResult.success) {
        console.log('✅ Python execution successful!');
        console.log('   Output:', pythonResult.output?.trim());
    } else {
        console.log('❌ Python failed:', pythonResult.error);
    }
    
    // Test 3: JavaScript Code
    console.log('\n📜 TEST 3: Execute JavaScript Code');
    console.log('-'.repeat(50));
    
    const jsCode = `console.log("Hello from JavaScript!");
console.log("Sum of 10 and 20 is:", 10 + 20);`;
    
    const jsResult = await executeCode(jsCode, 'javascript');
    if (jsResult.success) {
        console.log('✅ JavaScript execution successful!');
        console.log('   Output:', jsResult.output?.trim());
    } else {
        console.log('❌ JavaScript failed:', jsResult.error);
    }
    
    console.log('\n📊 TEST SUMMARY');
    console.log('='.repeat(60));
    console.log('✅ Gemini Code Execution test suite completed\n');
}

testGeminiCodeExecution();