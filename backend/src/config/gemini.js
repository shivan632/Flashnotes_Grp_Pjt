// backend/src/config/gemini.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY is missing!');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// ✅ Use working model
export const getGeminiModel = () => {
    return genAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash',  // Changed from gemini-1.5-flash
        generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 4096,
        }
    });
};

export const testGeminiConnection = async () => {
    try {
        const model = getGeminiModel();
        const result = await model.generateContent("Say 'Connected'");
        const response = await result.response;
        return { success: true, message: response.text() };
    } catch (error) {
        return { success: false, error: error.message };
    }
};