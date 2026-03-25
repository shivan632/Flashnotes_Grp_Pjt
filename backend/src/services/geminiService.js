// backend/src/services/geminiService.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Get API key
const GEMINI_API_KEY = process.env.GEMINI_PDF_API_KEY || process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY not found');
}

// Updated model names for 2024/2025
// The correct model names are:
// - 'models/gemini-1.5-flash' (fast)
// - 'models/gemini-1.5-pro' (powerful)
// - 'models/gemini-1.0-pro' (legacy)

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Use the correct model with full path
const MODEL_NAME = 'models/gemini-1.5-flash';

export async function generatePDFSummary(text, topic = null) {
    try {
        console.log('🤖 Generating PDF summary...');
        
        // Check API key
        if (!GEMINI_API_KEY) {
            return {
                success: false,
                error: 'Gemini API key is missing. Please add GEMINI_PDF_API_KEY to .env'
            };
        }
        
        // Use the correct model name format
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });
        
        // Limit text length
        const maxLength = 15000;
        const truncatedText = text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
        
        const prompt = `
        You are an expert study assistant. Analyze the following content and extract the most important information.
        
        CONTENT:
        ${truncatedText}
        
        Please provide a structured summary:
        
        📝 SUMMARY: (2-3 sentences overview)
        🎯 KEY POINTS: (5-10 bullet points)
        📌 IMPORTANT NOTES: (Additional details)
        📚 QUICK REFERENCE: (Key terms and definitions)
        
        Make it easy to read and study-friendly.
        `;
        
        console.log('📡 Sending to Gemini API...');
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const summary = response.text();
        
        console.log('✅ Summary generated successfully');
        
        return {
            success: true,
            summary,
            rawText: truncatedText
        };
        
    } catch (error) {
        console.error('Gemini Error:', error);
        
        // Special handling for 404
        if (error.message.includes('404')) {
            return {
                success: false,
                error: 'Gemini model not found. Please enable Generative Language API in Google Cloud Console.'
            };
        }
        
        return {
            success: false,
            error: error.message
        };
    }
}

export async function testGeminiConnection() {
    try {
        if (!GEMINI_API_KEY) {
            throw new Error('No API key');
        }
        
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });
        const result = await model.generateContent("Hello! Say 'Gemini is working'");
        const response = await result.response;
        
        return { success: true, message: response.text() };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export default { generatePDFSummary, testGeminiConnection };