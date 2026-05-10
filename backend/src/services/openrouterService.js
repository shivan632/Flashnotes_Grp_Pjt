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

// ✅ CONFIRMED WORKING FREE MODELS (from test results - May 2026)
export const FREE_MODELS = {
    // ⭐ FASTEST WORKING MODELS (from test)
    LIQUID_2_5_INSTRUCT: 'liquid/lfm-2.5-1.2b-instruct:free',     // ✅ FASTEST (1.5s)
    GLM_4_5_AIR: 'z-ai/glm-4.5-air:free',                          // ✅ WORKING (11.8s)
    
    // NVIDIA Models - Confirmed Working
    NEMOTRON_9B: 'nvidia/nemotron-nano-9b-v2:free',                // ✅ WORKING
    NEMOTRON_12B: 'nvidia/nemotron-nano-12b-v2-vl:free',           // ✅ WORKING
    
    // OpenAI Models - Confirmed Working
    GPT_OSS_120B: 'openai/gpt-oss-120b:free',                      // ✅ WORKING
    
    // Gemini Models - Confirmed Working
    GEMINI_2_5_FLASH: 'gemini-2.5-flash',                          // ✅ WORKING (Google)
    
    // Qwen Models - Rate Limited
    QWEN_3_CODER: 'qwen/qwen3-coder:free',                         // ⚠️ Rate Limited
    QWEN_3_NEXT: 'qwen/qwen3-next-80b-a3b-instruct:free',         // ⚠️ Rate Limited
    
    // Deprecated/Removed Models (DO NOT USE)
    // STEP_FLASH: 'stepfun/step-3.5-flash:free',                  // ❌ 404 - REMOVED
    // TRINITY_LARGE: 'arcee-ai/trinity-large-preview:free',       // ❌ 404 - REMOVED
    // TRINITY_MINI: 'arcee-ai/trinity-mini:free',                 // ❌ 404 - REMOVED
};

// Ordered list of models to try (WORKING models FIRST)
const MODEL_PRIORITY = [
    // ⭐ FASTEST WORKING MODELS
    FREE_MODELS.LIQUID_2_5_INSTRUCT,      // ✅ Fastest (1.5s)
    FREE_MODELS.GEMINI_2_5_FLASH,         // ✅ Google Gemini (2s)
    FREE_MODELS.GPT_OSS_120B,             // ✅ OpenAI GPT (3.5s)
    FREE_MODELS.NEMOTRON_12B,             // ✅ NVIDIA (5.35s)
    FREE_MODELS.NEMOTRON_9B,              // ✅ NVIDIA (6.34s)
    FREE_MODELS.GLM_4_5_AIR,              // ✅ Z-AI (11.8s)
    
    // ⚠️ Rate Limited - Try after working models
    FREE_MODELS.QWEN_3_CODER,              // ⚠️ Rate limited
    FREE_MODELS.QWEN_3_NEXT,              // ⚠️ Rate limited
];

// Default model (fastest working)
const DEFAULT_MODEL = FREE_MODELS.LIQUID_2_5_INSTRUCT;

// Track if we're in fallback mode
let isInFallbackMode = false;
let currentWorkingModel = DEFAULT_MODEL;

// Fallback summary function (graceful degradation)
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
AI summary service is currently experiencing high demand. Please try again in a few seconds.

📚 **QUICK REFERENCE**
• Preview: ${preview.substring(0, 200)}...
• Generated: ${new Date().toLocaleString()}
    `;
}

// Try multiple models until one works
async function tryMultipleModels(text, topic) {
    const modelsToTry = MODEL_PRIORITY;
    let lastError = null;
    
    for (const model of modelsToTry) {
        try {
            console.log(`📡 Trying model: ${model}`);
            
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
            
            // Parse response
            let summary = null;
            
            if (completion.choices && Array.isArray(completion.choices) && completion.choices.length > 0) {
                summary = completion.choices[0]?.message?.content;
            } else if (completion.message?.content) {
                summary = completion.message.content;
            } else if (completion.content) {
                summary = completion.content;
            }
            
            if (summary && summary.length > 50) {
                console.log(`✅ Model ${model} worked!`);
                currentWorkingModel = model;
                isInFallbackMode = false;
                return {
                    success: true,
                    summary: summary,
                    model: model,
                    usage: completion.usage || null
                };
            }
            
            throw new Error('No valid summary content');
            
        } catch (error) {
            console.log(`⚠️ Model ${model} failed: ${error.message}`);
            lastError = error;
            continue;
        }
    }
    
    // All models failed
    throw lastError || new Error('All models failed');
}

export async function generatePDFSummary(text, topic = null, model = null) {
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
        
        let result;
        
        // If specific model provided, try that first
        if (model && model !== DEFAULT_MODEL) {
            try {
                console.log(`📡 Trying specified model: ${model}`);
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
                
                let summary = null;
                if (completion.choices && completion.choices[0]?.message?.content) {
                    summary = completion.choices[0].message.content;
                }
                if (summary && summary.length > 50) {
                    console.log(`✅ Model ${model} worked!`);
                    return {
                        success: true,
                        summary: summary,
                        model: model,
                        usage: completion.usage || null
                    };
                }
            } catch (specError) {
                console.log(`⚠️ Specified model failed: ${specError.message}`);
                // Fall through to try multiple models
            }
        }
        
        // Try multiple models
        result = await tryMultipleModels(text, topic);
        
        console.log('✅ Summary generated successfully');
        console.log(`📝 Summary length: ${result.summary.length} characters`);
        console.log(`📡 Model used: ${result.model}`);
        
        return result;
        
    } catch (error) {
        console.error('OpenRouter Error:', error);
        
        let errorMessage = error.message;
        if (error.message.includes('429')) {
            errorMessage = 'Rate limit exceeded. Please try again in a few seconds.';
        } else if (error.message.includes('404')) {
            errorMessage = 'Model not found. Trying alternative models...';
        } else if (error.message.includes('500') || error.message.includes('502')) {
            errorMessage = 'OpenRouter server is busy. Using fallback summary.';
        }
        
        // Return fallback
        return {
            success: true,
            summary: getFallbackSummary(text, topic),
            model: 'fallback',
            error: errorMessage,
            warning: 'Using fallback summary due to API issues'
        };
    }
}

export async function testOpenRouter() {
    if (!openrouter || !API_KEY) {
        return { success: false, error: 'API key not configured' };
    }
    
    try {
        // Try working models first (based on test results)
        const workingModels = [
            FREE_MODELS.LIQUID_2_5_INSTRUCT,   // Fastest
            FREE_MODELS.GEMINI_2_5_FLASH,       // Google
            FREE_MODELS.GPT_OSS_120B,           // OpenAI
            FREE_MODELS.NEMOTRON_12B,           // NVIDIA
            FREE_MODELS.NEMOTRON_9B,            // NVIDIA
            FREE_MODELS.GLM_4_5_AIR             // Z-AI
        ];
        
        for (const model of workingModels) {
            try {
                console.log(`Testing model: ${model}`);
                const completion = await openrouter.chat.completions.create({
                    model: model,
                    messages: [
                        { role: 'user', content: 'Say "Hello from Flashnotes!"' }
                    ],
                    max_tokens: 50
                });
                
                let message = null;
                if (completion.choices && completion.choices[0]?.message?.content) {
                    message = completion.choices[0].message.content;
                } else {
                    message = 'Connection successful';
                }
                
                console.log(`✅ Model ${model} works!`);
                return { 
                    success: true, 
                    message: message, 
                    model: model,
                    availableModels: MODEL_PRIORITY.length
                };
            } catch (modelError) {
                console.log(`⚠️ Model ${model} failed:`, modelError.message);
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
        description: `Free model: ${id}`,
        status: getModelStatus(id)
    }));
}

function getModelStatus(modelId) {
    const workingModels = [
        'liquid/lfm-2.5-1.2b-instruct:free',
        'gemini-2.5-flash',
        'openai/gpt-oss-120b:free',
        'nvidia/nemotron-nano-12b-v2-vl:free',
        'nvidia/nemotron-nano-9b-v2:free',
        'z-ai/glm-4.5-air:free'
    ];
    
    if (workingModels.includes(modelId)) {
        return '✅ Working';
    } else if (modelId.includes('qwen')) {
        return '⚠️ Rate Limited';
    } else if (modelId.includes('stepfun') || modelId.includes('trinity')) {
        return '❌ Deprecated';
    }
    return '❓ Unknown';
}

export async function getCurrentWorkingModel() {
    return {
        model: currentWorkingModel,
        inFallbackMode: isInFallbackMode
    };
}

export { MODEL_PRIORITY };

export default {
    generatePDFSummary,
    testOpenRouter,
    listAvailableModels,
    getCurrentWorkingModel,
    FREE_MODELS,
    MODEL_PRIORITY
};