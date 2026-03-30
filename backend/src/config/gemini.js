// backend/src/config/gemini.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Get API key for roadmap (separate from PDF key)
const ROADMAP_GEMINI_API_KEY = process.env.ROADMAP_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

if (!ROADMAP_GEMINI_API_KEY) {
    console.error('❌ ROADMAP_GEMINI_API_KEY is missing!');
    console.error('   Please add to .env file');
} else {
    console.log('✅ Gemini API key loaded for roadmap');
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(ROADMAP_GEMINI_API_KEY);

// Model configuration
const MODEL_CONFIG = {
    model: 'gemini-1.5-flash',  // Fast model for roadmap generation
    generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 4096,
        topP: 0.9,
        topK: 40,
    }
};

// Get generative model
export const getGeminiModel = () => {
    if (!ROADMAP_GEMINI_API_KEY) {
        throw new Error('Gemini API key not configured');
    }
    return genAI.getGenerativeModel(MODEL_CONFIG);
};

// Test connection
export const testGeminiConnection = async () => {
    try {
        const model = getGeminiModel();
        const result = await model.generateContent("Say 'Roadmap Generator is ready'");
        const response = await result.response;
        return { success: true, message: response.text() };
    } catch (error) {
        console.error('Gemini connection error:', error);
        return { success: false, error: error.message };
    }
};

export default { getGeminiModel, testGeminiConnection };