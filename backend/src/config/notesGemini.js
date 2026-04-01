import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const NOTES_GEMINI_API_KEY = process.env.NOTES_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

if (!NOTES_GEMINI_API_KEY) {
    console.error('❌ NOTES_GEMINI_API_KEY is missing!');
    console.error('   Please add to .env file');
} else {
    console.log('✅ Notes Generator Gemini API key loaded');
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(NOTES_GEMINI_API_KEY);

// Model configuration - using confirmed working model
const MODEL_CONFIG = {
    model: 'gemini-2.5-flash',
    generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 4096,
        topP: 0.9,
        topK: 40,
    }
};

// Get generative model for notes
export const getNotesGeminiModel = () => {
    if (!NOTES_GEMINI_API_KEY) {
        throw new Error('Notes Gemini API key not configured');
    }
    return genAI.getGenerativeModel(MODEL_CONFIG);
};

// Test connection
export const testNotesGeminiConnection = async () => {
    try {
        const model = getNotesGeminiModel();
        const result = await model.generateContent("Say 'Notes Generator is ready'");
        const response = await result.response;
        const text = response.text();
        return { success: true, message: text };
    } catch (error) {
        console.error('Notes Gemini connection error:', error);
        return { success: false, error: error.message };
    }
};

export default { getNotesGeminiModel, testNotesGeminiConnection };