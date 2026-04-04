// backend/src/test/list-models.js
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const apiKey = process.env.GEMINI_CODE_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    console.log('\n📋 Listing available Gemini models...\n');
    
    // List of models to try
    const modelsToTry = [
        'gemini-2.5-flash',
        'gemini-2.5-pro',
        'gemini-2.0-flash',
        'gemini-2.0-flash-001',
        'gemini-2.0-flash-lite',
        'gemini-1.5-flash',
        'gemini-1.5-pro',
        'gemini-1.0-pro'
    ];
    
    for (const model of modelsToTry) {
        try {
            const testModel = genAI.getGenerativeModel({ model: model });
            const result = await testModel.generateContent('test');
            await result.response;
            console.log(`✅ ${model} - WORKING`);
        } catch (error) {
            if (error.message.includes('404')) {
                console.log(`❌ ${model} - NOT FOUND`);
            } else if (error.message.includes('429')) {
                console.log(`⚠️ ${model} - RATE LIMITED (quota exceeded)`);
            } else {
                console.log(`❌ ${model} - ${error.message.substring(0, 50)}`);
            }
        }
    }
    
    console.log('\n✅ Done\n');
}

listModels();