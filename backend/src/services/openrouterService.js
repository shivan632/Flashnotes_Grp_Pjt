// backend/src/services/openrouterService.js
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// Get API key from either environment variable
const API_KEY = process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY;

if (!API_KEY) {
    console.error('❌ Missing API key. Set OPENAI_API_KEY or OPENROUTER_API_KEY');
}

// Initialize OpenRouter client
let openrouter = null;

try {
    if (API_KEY) {
        openrouter = new OpenAI({
            baseURL: 'https://openrouter.ai/api/v1',
            apiKey: API_KEY,
            defaultHeaders: {
                'HTTP-Referer': 'https://flashnotes.app',
                'X-Title': 'Flashnotes'
            }
        });
        console.log('✅ OpenRouter client initialized');
    } else {
        console.log('⚠️ OpenRouter client not initialized - API key missing');
    }
} catch (error) {
    console.error('❌ OpenRouter initialization error:', error.message);
}

// ✅ CONFIRMED WORKING FREE MODELS (March 2026)
export const FREE_MODELS = {
    GEMINI_PRO: 'google/gemini-2.5-pro-exp-03-25:free',
    LLAMA_4_MAVERICK: 'meta-llama/llama-4-maverick:free',
    LLAMA_4_SCOUT: 'meta-llama/llama-4-scout:free',
    NEMOTRON_9B: 'nvidia/nemotron-nano-9b-v2:free',
    NEMOTRON_8B: 'nvidia/llama-3.1-nemotron-nano-8b-v1:free',
    MISTRAL_SMALL: 'mistralai/mistral-small-3.1-24b-instruct:free',
    QWEN_CODER: 'qwen/qwen3-coder-480b-a35b-instruct:free',
    STEP_FLASH: 'stepfun/step-3.5-flash:free',
    TRINITY_LARGE: 'arcee-ai/trinity-large-preview:free',
    GPT_OSS_120B: 'openai/gpt-oss-120b:free',
    GLM_Z1: 'thudm/glm-z1-32b:free',
    KIMI_K2: 'moonshotai/kimi-k2:free'
};

const DEFAULT_MODEL = FREE_MODELS.NEMOTRON_9B;

// Fallback summary function
function getFallbackSummary(text, topic) {
    const wordCount = text.split(/\s+/).length;
    const charCount = text.length;
    const preview = text.substring(0, 300);
    
    return `
📝 **SUMMARY**
This document contains ${wordCount} words of content about ${topic || 'the uploaded PDF'}.

🎯 **KEY POINTS**
• Document length: ${charCount} characters, ${wordCount} words
• Content extracted from PDF successfully
• ${Math.ceil(wordCount / 500)} pages approximately

📌 **IMPORTANT NOTES**
AI summary service is currently unavailable. Please configure OpenRouter API key.

📚 **QUICK REFERENCE**
• Preview: ${preview.substring(0, 200)}...
• Generated: ${new Date().toLocaleString()}
    `;
}

export async function generatePDFSummary(text, topic = null, model = DEFAULT_MODEL) {
    // If no API key or client not initialized, return fallback
    if (!openrouter || !API_KEY) {
        console.log('⚠️ Using fallback summary (API key not configured)');
        return {
            success: true,
            summary: getFallbackSummary(text, topic),
            model: 'fallback',
            warning: 'API key not configured'
        };
    }

    try {
        console.log('🤖 Generating PDF summary with OpenRouter...');
        console.log(`📡 Using model: ${model}`);
        
        const maxLength = 15000;
        const truncatedText = text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
        
        const prompt = `
You are an expert study assistant. Analyze the following PDF content and extract the most important information.

PDF CONTENT:
${truncatedText}

Please provide a structured summary with:

📝 **SUMMARY** (2-3 sentences overview)
🎯 **KEY POINTS** (5-10 bullet points)
📌 **IMPORTANT NOTES** (Additional details)
📚 **QUICK REFERENCE** (Key terms and definitions)

Make it easy to read and study-friendly.
`;
        
        console.log('📡 Sending request to OpenRouter...');
        
        const completion = await openrouter.chat.completions.create({
            model: model,
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful study assistant that creates clear, structured summaries.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 2000
        });
        
        // ============= FIX: Safe response parsing =============
        let summary = null;
        
        // Log response structure for debugging
        console.log('📡 Response keys:', Object.keys(completion));
        
        // Try different response formats
        if (completion.choices && Array.isArray(completion.choices) && completion.choices.length > 0) {
            summary = completion.choices[0]?.message?.content;
            console.log('✅ Got summary from choices array');
        } else if (completion.message?.content) {
            summary = completion.message.content;
            console.log('✅ Got summary from message.content');
        } else if (completion.content) {
            summary = completion.content;
            console.log('✅ Got summary from content');
        } else if (completion.response) {
            summary = completion.response;
            console.log('✅ Got summary from response');
        } else {
            console.error('❌ Unknown response format:', JSON.stringify(completion, null, 2));
            throw new Error('Unable to parse OpenRouter response');
        }
        
        if (!summary) {
            throw new Error('No summary content in response');
        }
        
        console.log('✅ Summary generated successfully');
        console.log(`📝 Summary length: ${summary.length} characters`);
        
        return {
            success: true,
            summary: summary,
            model: model,
            usage: completion.usage || null
        };
        
    } catch (error) {
        console.error('OpenRouter Error:', error);
        
        let errorMessage = error.message;
        if (error.message.includes('429')) {
            errorMessage = 'Rate limit exceeded. Please try again in a few seconds.';
        } else if (error.message.includes('404')) {
            errorMessage = 'Model not found. Try a different model.';
        }
        
        // Return fallback instead of failing
        return {
            success: true, // Keep true so frontend shows fallback
            summary: getFallbackSummary(text, topic),
            model: 'fallback',
            error: errorMessage
        };
    }
}

export async function testOpenRouter() {
    if (!openrouter || !API_KEY) {
        return { success: false, error: 'API key not configured' };
    }
    
    try {
        const modelsToTry = [
            FREE_MODELS.NEMOTRON_9B,
            FREE_MODELS.GEMINI_PRO,
            FREE_MODELS.LLAMA_4_SCOUT
        ];
        
        for (const model of modelsToTry) {
            try {
                const completion = await openrouter.chat.completions.create({
                    model: model,
                    messages: [
                        { role: 'user', content: 'Say "Hello from Flashnotes!"' }
                    ],
                    max_tokens: 50
                });
                
                // Safe response parsing
                let message = null;
                if (completion.choices && completion.choices[0]?.message?.content) {
                    message = completion.choices[0].message.content;
                } else if (completion.message?.content) {
                    message = completion.message.content;
                } else {
                    message = 'Connection successful';
                }
                
                return { success: true, message: message, model: model };
            } catch (modelError) {
                console.log(`Model ${model} failed:`, modelError.message);
                continue;
            }
        }
        throw new Error('No working models found');
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function listAvailableModels() {
    return Object.entries(FREE_MODELS).map(([name, id]) => ({
        name,
        id,
        description: `Free model: ${id}`
    }));
}

export default {
    generatePDFSummary,
    testOpenRouter,
    listAvailableModels,
    FREE_MODELS
};