// backend/src/services/geminiCodeService.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_CODE_API_KEY;

if (!GEMINI_API_KEY) {
    console.error('❌ GEMINI_CODE_API_KEY is missing in .env');
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// ✅ Working model
const WORKING_MODEL = 'gemini-2.5-flash';

// Language mapping
const LANGUAGE_MAP = {
    'python': 'python',
    'python3': 'python',
    'javascript': 'javascript',
    'js': 'javascript',
    'cpp': 'cpp',
    'c++': 'cpp',
    'java': 'java',
    'c': 'c',
    'go': 'go',
    'rust': 'rust',
    'php': 'php',
    'ruby': 'ruby'
};

// Get model instance
function getModel() {
    return genAI.getGenerativeModel({
        model: WORKING_MODEL,
        generationConfig: {
            temperature: 0,
            maxOutputTokens: 4096,
        }
    });
}

// Execute code using Gemini
export async function executeCode(code, language) {
    if (!GEMINI_API_KEY) {
        return {
            success: false,
            error: 'GEMINI_CODE_API_KEY not configured in .env'
        };
    }

    const mappedLanguage = LANGUAGE_MAP[language.toLowerCase()] || 'python';
    
    console.log(`🚀 Executing ${mappedLanguage} code using ${WORKING_MODEL}...`);

    try {
        const model = getModel();
        
        const prompt = `Execute the following ${mappedLanguage} code and return ONLY the output:

\`\`\`${mappedLanguage}
${code}
\`\`\`

Output:`;
        
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        
        // Clean up the output (remove markdown code blocks if present)
        let cleanOutput = text;
        if (cleanOutput.startsWith('```')) {
            cleanOutput = cleanOutput.replace(/```\w*\n?/g, '').replace(/```$/g, '');
        }
        
        return {
            success: true,
            output: cleanOutput.trim(),
            error: ''
        };
        
    } catch (error) {
        console.error('Gemini Code Execution Error:', error);
        
        if (error.message.includes('429')) {
            return {
                success: false,
                error: 'Rate limit exceeded. Please try again in a few seconds.',
                output: ''
            };
        }
        
        return {
            success: false,
            error: error.message || 'Failed to execute code',
            output: ''
        };
    }
}

// Test connection
export async function testGeminiCodeConnection() {
    if (!GEMINI_API_KEY) {
        return { success: false, error: 'API key not configured' };
    }
    
    try {
        const model = getModel();
        const result = await model.generateContent('Say "Code execution service is ready"');
        const response = result.response;
        const text = response.text();
        
        return { 
            success: true, 
            message: text,
            model: WORKING_MODEL
        };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export default {
    executeCode,
    testGeminiCodeConnection,
    WORKING_MODEL
};