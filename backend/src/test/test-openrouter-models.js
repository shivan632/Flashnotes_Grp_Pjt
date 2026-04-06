// backend/src/test/test-openrouter-models.js
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_CODE_API_KEY || process.env.OPENROUTER_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_CODE_API_KEY || process.env.GEMINI_API_KEY;

// List of free models to test
const MODELS_TO_TEST = [
    // Stepfun (Best for code execution)
    { name: 'Step 3.5 Flash', id: 'stepfun/step-3.5-flash:free', provider: 'OpenRouter' },
    { name: 'Step 3.5 Mini', id: 'stepfun/step-3.5-mini:free', provider: 'OpenRouter' },
    
    // Arcee (Good for code)
    { name: 'Trinity Large', id: 'arcee-ai/trinity-large-preview:free', provider: 'OpenRouter' },
    { name: 'Trinity Mini', id: 'arcee-ai/trinity-mini:free', provider: 'OpenRouter' },
    
    // Z-AI (Reliable)
    { name: 'GLM 4.5 Air', id: 'z-ai/glm-4.5-air:free', provider: 'OpenRouter' },
    
    // NVIDIA (Good for code)
    { name: 'Nemotron 9B', id: 'nvidia/nemotron-nano-9b-v2:free', provider: 'OpenRouter' },
    { name: 'Nemotron 12B', id: 'nvidia/nemotron-nano-12b-v2-vl:free', provider: 'OpenRouter' },
    
    // Qwen (Good for code)
    { name: 'Qwen 3 Coder', id: 'qwen/qwen3-coder:free', provider: 'OpenRouter' },
    { name: 'Qwen 3 Next', id: 'qwen/qwen3-next-80b-a3b-instruct:free', provider: 'OpenRouter' },
    
    // Liquid (Fast)
    { name: 'Liquid 2.5 Instruct', id: 'liquid/lfm-2.5-1.2b-instruct:free', provider: 'OpenRouter' },
    
    // OpenAI (Powerful)
    { name: 'GPT OSS 120B', id: 'openai/gpt-oss-120b:free', provider: 'OpenRouter' },
    
    // Gemini (Fallback)
    { name: 'Gemini 2.5 Flash', id: 'gemini-2.5-flash', provider: 'Google' },
    { name: 'Gemini 2.0 Flash', id: 'gemini-2.0-flash', provider: 'Google' },
];

// Test code snippets
const TEST_CODES = {
    python: `print("Hello from Flashnotes!")
print("Testing OpenRouter API")
result = 10 + 20
print(f"Sum of 10 and 20 is: {result}")`,
    
    javascript: `console.log("Hello from Flashnotes!");
console.log("Sum of 10 and 20 is:", 10 + 20);`,
    
    cpp: `#include <iostream>
using namespace std;
int main() {
    cout << "Hello from Flashnotes!" << endl;
    cout << "Sum of 10 and 20 is: " << 10 + 20 << endl;
    return 0;
}`,
    
    java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from Flashnotes!");
        System.out.println("Sum of 10 and 20 is: " + (10 + 20));
    }
}`
};

// Function to execute code with OpenRouter
async function executeWithOpenRouter(code, language, modelId) {
    const startTime = Date.now();
    
    // Map language names
    const langMap = {
        'python': 'python',
        'javascript': 'javascript',
        'cpp': 'cpp',
        'java': 'java'
    };
    
    const mappedLang = langMap[language] || 'python';
    
    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'HTTP-Referer': 'https://flashnotes.app',
                'X-Title': 'Flashnotes Code Test'
            },
            body: JSON.stringify({
                model: modelId,
                messages: [
                    {
                        role: 'system',
                        content: `You are a code executor. Execute the ${mappedLang} code and return ONLY the output. No explanations, no markdown, just the raw output.`
                    },
                    {
                        role: 'user',
                        content: `Execute this ${mappedLang} code and show me the output:\n\n${code}\n\nOutput:`
                    }
                ],
                max_tokens: 2000,
                temperature: 0
            })
        });
        
        const result = await response.json();
        const duration = (Date.now() - startTime) / 1000;
        
        if (result.error) {
            return {
                success: false,
                error: result.error.message || 'API error',
                duration: duration,
                statusCode: response.status
            };
        }
        
        let output = result.choices?.[0]?.message?.content || '';
        // Clean output
        output = output.replace(/```\w*\n?/g, '').replace(/```$/g, '').trim();
        
        return {
            success: true,
            output: output,
            duration: duration,
            statusCode: response.status
        };
        
    } catch (error) {
        return {
            success: false,
            error: error.message,
            duration: (Date.now() - startTime) / 1000
        };
    }
}

// Function to execute code with Gemini
async function executeWithGemini(code, language, modelId) {
    const startTime = Date.now();
    
    if (!GEMINI_API_KEY) {
        return {
            success: false,
            error: 'Gemini API key not configured',
            duration: 0
        };
    }
    
    try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: modelId,
            generationConfig: { temperature: 0, maxOutputTokens: 4096 }
        });
        
        const langMap = { 'python': 'python', 'javascript': 'javascript', 'cpp': 'cpp', 'java': 'java' };
        const mappedLang = langMap[language] || 'python';
        const prompt = `Execute the following ${mappedLang} code and return ONLY the output:\n\n${code}\n\nOutput:`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let output = response.text();
        output = output.replace(/```\w*\n?/g, '').replace(/```$/g, '').trim();
        
        const duration = (Date.now() - startTime) / 1000;
        
        return {
            success: true,
            output: output,
            duration: duration
        };
        
    } catch (error) {
        return {
            success: false,
            error: error.message,
            duration: (Date.now() - startTime) / 1000
        };
    }
}

// Test a single model
async function testModel(model, language = 'python') {
    const testCode = TEST_CODES[language];
    
    console.log(`\n🔍 Testing: ${model.name}`);
    console.log(`   Model ID: ${model.id}`);
    console.log(`   Provider: ${model.provider}`);
    console.log(`   Language: ${language}`);
    console.log('   ' + '-'.repeat(40));
    
    let result;
    
    if (model.provider === 'OpenRouter') {
        if (!OPENROUTER_API_KEY) {
            console.log('   ❌ SKIPPED: OpenRouter API key not configured');
            return { success: false, error: 'No API key', model: model.name };
        }
        result = await executeWithOpenRouter(testCode, language, model.id);
    } else {
        if (!GEMINI_API_KEY) {
            console.log('   ❌ SKIPPED: Gemini API key not configured');
            return { success: false, error: 'No API key', model: model.name };
        }
        result = await executeWithGemini(testCode, language, model.id);
    }
    
    if (result.success) {
        console.log(`   ✅ WORKING! (${result.duration}s)`);
        console.log(`   Output preview: ${result.output.substring(0, 100)}${result.output.length > 100 ? '...' : ''}`);
    } else {
        console.log(`   ❌ FAILED: ${result.error}`);
        if (result.statusCode === 429) {
            console.log('   ⚠️ Rate limited (quota exceeded)');
        }
    }
    
    return { success: result.success, error: result.error, model: model.name, duration: result.duration };
}

// Test all languages with best model
async function testLanguagesWithBestModel(bestModel) {
    console.log('\n' + '='.repeat(60));
    console.log('📝 TESTING ALL LANGUAGES WITH BEST MODEL');
    console.log('='.repeat(60));
    
    const languages = ['python', 'javascript', 'cpp', 'java'];
    
    for (const lang of languages) {
        console.log(`\n🔍 Testing ${lang.toUpperCase()} with ${bestModel.name}`);
        console.log('   ' + '-'.repeat(40));
        
        const testCode = TEST_CODES[lang];
        let result;
        
        if (bestModel.provider === 'OpenRouter') {
            result = await executeWithOpenRouter(testCode, lang, bestModel.id);
        } else {
            result = await executeWithGemini(testCode, lang, bestModel.id);
        }
        
        if (result.success) {
            console.log(`   ✅ ${lang.toUpperCase()} WORKING! (${result.duration}s)`);
            console.log(`   Output: ${result.output.substring(0, 150)}${result.output.length > 150 ? '...' : ''}`);
        } else {
            console.log(`   ❌ ${lang.toUpperCase()} FAILED: ${result.error}`);
        }
    }
}

// Main test function
async function runAllTests() {
    console.log('\n' + '='.repeat(60));
    console.log('🧪 OPENROUTER CODE EXECUTION MODEL TESTER');
    console.log('='.repeat(60));
    
    // Check API keys
    console.log('\n🔑 API Keys Status:');
    console.log(`   OPENROUTER_CODE_API_KEY: ${OPENROUTER_API_KEY ? '✅ ' + OPENROUTER_API_KEY.substring(0, 15) + '...' : '❌ Missing'}`);
    console.log(`   GEMINI_CODE_API_KEY: ${GEMINI_API_KEY ? '✅ ' + GEMINI_API_KEY.substring(0, 15) + '...' : '❌ Missing'}`);
    
    if (!OPENROUTER_API_KEY && !GEMINI_API_KEY) {
        console.log('\n❌ No API keys configured. Please add OPENROUTER_CODE_API_KEY or GEMINI_CODE_API_KEY to .env');
        return;
    }
    
    console.log('\n🚀 Starting model tests...\n');
    
    let workingModels = [];
    
    // Test each model
    for (const model of MODELS_TO_TEST) {
        const result = await testModel(model, 'python');
        if (result.success) {
            workingModels.push({ ...model, duration: result.duration });
        }
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(60));
    
    if (workingModels.length === 0) {
        console.log('\n❌ No working models found!');
        console.log('\nPossible issues:');
        console.log('   1. API key is invalid or expired');
        console.log('   2. OpenRouter service is down');
        console.log('   3. Rate limits exceeded');
        console.log('   4. Network connectivity issues');
    } else {
        console.log(`\n✅ Found ${workingModels.length} working models:\n`);
        
        // Sort by duration (fastest first)
        workingModels.sort((a, b) => a.duration - b.duration);
        
        workingModels.forEach((model, idx) => {
            console.log(`   ${idx + 1}. ${model.name} (${model.provider}) - ${model.duration}s`);
            console.log(`      Model ID: ${model.id}`);
        });
        
        // Recommend best model
        const bestModel = workingModels[0];
        console.log('\n' + '='.repeat(60));
        console.log('🎯 RECOMMENDATION');
        console.log('='.repeat(60));
        console.log(`\n⭐ BEST MODEL: ${bestModel.name}`);
        console.log(`   Model ID: ${bestModel.id}`);
        console.log(`   Provider: ${bestModel.provider}`);
        console.log(`   Response time: ${bestModel.duration}s`);
        
        console.log('\n📝 Add this to your .env:');
        console.log(`   OPENROUTER_MODEL=${bestModel.id}`);
        
        // Test all languages with best model
        await testLanguagesWithBestModel(bestModel);
        
        // Final recommendation
        console.log('\n' + '='.repeat(60));
        console.log('💡 FINAL RECOMMENDATION');
        console.log('='.repeat(60));
        console.log(`
   Use this configuration in your codeController.js:

   const OPENROUTER_MODEL = '${bestModel.id}';
   const USE_OPENROUTER = true;

   Or update your .env file:
   OPENROUTER_MODEL=${bestModel.id}
        `);
    }
    
    console.log('\n✅ Test completed\n');
}

// Run tests
runAllTests().catch(console.error);