// backend/test-gemini.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from correct path
dotenv.config({ path: path.join(__dirname, '.env') });

async function testGemini() {
    try {
        console.log('🔍 Testing Gemini API...');
        console.log('Current directory:', __dirname);
        console.log('API Key present:', !!process.env.GEMINI_API_KEY);
        
        if (!process.env.GEMINI_API_KEY) {
            console.error('❌ GEMINI_API_KEY not found in .env file');
            console.log('Please add your Gemini API key to backend/.env');
            return;
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        
        // TRY DIFFERENT MODEL NAMES (one of these will work)
        const modelsToTry = [
            "gemini-2.5-flash",        // Latest Flash model
            "gemini-1.5-flash-002",     // Stable Flash model
            "gemini-1.5-flash",         // Might still work
            "gemini-1.5-pro-002",       // Stable Pro model
            "gemini-1.5-flash-8b"       // Smallest/fastest
        ];
        
        let workingModel = null;
        let response = null;
        
        for (const modelName of modelsToTry) {
            console.log(`\n📤 Trying model: ${modelName}...`);
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const prompt = "Explain what is an operating system in 2 sentences.";
                const result = await model.generateContent(prompt);
                response = await result.response;
                const text = response.text();
                
                console.log(`✅ SUCCESS with model: ${modelName}`);
                console.log('📥 Response:', text);
                workingModel = modelName;
                break;
            } catch (modelError) {
                console.log(`❌ Failed with ${modelName}: ${modelError.message}`);
                // Continue to next model
            }
        }
        
        if (workingModel) {
            console.log(`\n🎉 Working model found: ${workingModel}`);
        } else {
            console.log('\n❌ No working model found. Your API key might be invalid or region-locked.');
            console.log('\n🔧 Troubleshooting:');
            console.log('1. Go to https://makersuite.google.com/app/apikey');
            console.log('2. Create a NEW API key');
            console.log('3. Update your .env file');
            console.log('4. Try again');
        }
        
    } catch (error) {
        console.error('❌ Gemini API error:', error.message);
    }
}

testGemini();