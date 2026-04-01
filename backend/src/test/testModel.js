import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const API_KEY = process.env.NOTES_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

// Models to test (based on your available models)
const MODELS_TO_TEST = [
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'gemini-1.5-pro',
    'gemini-1.0-pro'
];

async function testModel(modelName) {
    console.log(`\n🧪 Testing: ${modelName}`);
    console.log('-'.repeat(40));
    
    try {
        const model = genAI.getGenerativeModel({ 
            model: modelName,
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 500,
            }
        });
        
        console.log('   Sending test prompt...');
        const result = await model.generateContent('What is JavaScript? Answer in one sentence.');
        const response = await result.response;
        const text = response.text();
        
        console.log(`   ✅ WORKING!`);
        console.log(`   Response: ${text.substring(0, 100)}...`);
        return { model: modelName, working: true, response: text };
        
    } catch (error) {
        console.log(`   ❌ FAILED: ${error.message.substring(0, 80)}`);
        return { model: modelName, working: false, error: error.message };
    }
}

async function testAllModels() {
    console.log('🚀 Testing Gemini Models\n');
    console.log('='.repeat(50));
    
    const results = [];
    
    for (const modelName of MODELS_TO_TEST) {
        const result = await testModel(modelName);
        results.push(result);
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('\n📊 SUMMARY');
    console.log('='.repeat(50));
    
    const workingModels = results.filter(r => r.working);
    
    if (workingModels.length > 0) {
        console.log(`\n✅ Working models (${workingModels.length}):`);
        workingModels.forEach(m => {
            console.log(`   🟢 ${m.model}`);
        });
        
        console.log('\n💡 Recommended: Use the first working model -', workingModels[0].model);
        console.log('\n📝 Add to your notesGemini.js:');
        console.log(`   model: '${workingModels[0].model}'`);
        
    } else {
        console.log('\n❌ No working models found!');
        console.log('   Check your API key and internet connection.');
    }
}

testAllModels();