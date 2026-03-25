// backend/src/services/openrouterService.js
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize OpenRouter client
const openrouter = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
    defaultHeaders: {
        'HTTP-Referer': 'https://flashnotes.app',
        'X-Title': 'Flashnotes'
    }
});

// ✅ CONFIRMED WORKING FREE MODELS (March 2026)
export const FREE_MODELS = {
    // Google Gemini - Best quality
    GEMINI_PRO: 'google/gemini-2.5-pro-exp-03-25:free',
    
    // Meta Llama 4 - Great for long documents
    LLAMA_4_MAVERICK: 'meta-llama/llama-4-maverick:free',
    LLAMA_4_SCOUT: 'meta-llama/llama-4-scout:free',
    
    // NVIDIA Nemotron - Fast and reliable
    NEMOTRON_9B: 'nvidia/nemotron-nano-9b-v2:free',
    NEMOTRON_8B: 'nvidia/llama-3.1-nemotron-nano-8b-v1:free',
    
    // Mistral - Good balance
    MISTRAL_SMALL: 'mistralai/mistral-small-3.1-24b-instruct:free',
    
    // Qwen - Great for coding
    QWEN_CODER: 'qwen/qwen3-coder-480b-a35b-instruct:free',
    
    // StepFun - Fast reasoning
    STEP_FLASH: 'stepfun/step-3.5-flash:free',
    
    // Arcee - Creative writing
    TRINITY_LARGE: 'arcee-ai/trinity-large-preview:free',
    
    // OpenAI GPT-OSS
    GPT_OSS_120B: 'openai/gpt-oss-120b:free',
    
    // GLM
    GLM_Z1: 'thudm/glm-z1-32b:free',
    
    // Kimi - Long context
    KIMI_K2: 'moonshotai/kimi-k2:free'
};

// Default model - Most reliable for PDF summarization
const DEFAULT_MODEL = FREE_MODELS.NEMOTRON_9B;

export async function generatePDFSummary(text, topic = null, model = DEFAULT_MODEL) {
    try {
        console.log('🤖 Generating PDF summary with OpenRouter...');
        console.log(`📡 Using model: ${model}`);
        
        if (!process.env.OPENROUTER_API_KEY) {
            throw new Error('OPENROUTER_API_KEY not found');
        }
        
        // Limit text length for the model
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
        
        const summary = completion.choices[0].message.content;
        
        console.log('✅ Summary generated successfully');
        
        return {
            success: true,
            summary,
            model: model,
            usage: completion.usage
        };
        
    } catch (error) {
        console.error('OpenRouter Error:', error);
        
        // Provide helpful error message
        let errorMessage = error.message;
        if (error.message.includes('429')) {
            errorMessage = 'Rate limit exceeded. Please try again in a few seconds.';
        } else if (error.message.includes('404')) {
            errorMessage = 'Model not found. Try a different model from the FREE_MODELS list.';
        }
        
        return {
            success: false,
            error: errorMessage
        };
    }
}

// Test connection with working models
export async function testOpenRouter() {
    try {
        console.log('🧪 Testing OpenRouter connection...');
        
        // Try the most reliable free model first
        const modelsToTry = [
            FREE_MODELS.NEMOTRON_9B,
            FREE_MODELS.GEMINI_PRO,
            FREE_MODELS.LLAMA_4_SCOUT
        ];
        
        for (const model of modelsToTry) {
            try {
                console.log(`📡 Trying model: ${model}`);
                const completion = await openrouter.chat.completions.create({
                    model: model,
                    messages: [
                        { role: 'user', content: 'Say "Hello from Flashnotes! OpenRouter is working!"' }
                    ],
                    max_tokens: 50
                });
                
                const response = completion.choices[0].message.content;
                console.log(`✅ OpenRouter connected with ${model}:`, response);
                return { success: true, message: response, model: model };
                
            } catch (modelError) {
                console.log(`❌ Model ${model} failed: ${modelError.message}`);
                continue;
            }
        }
        
        throw new Error('No working models found');
        
    } catch (error) {
        console.error('❌ OpenRouter connection failed:', error.message);
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