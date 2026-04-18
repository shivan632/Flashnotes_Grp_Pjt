// backend/src/services/openrouterNotesService.js
import dotenv from 'dotenv';
dotenv.config();

const OPENROUTER_NOTES_API_KEY = process.env.OPENROUTER_NOTES_API_KEY;
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

// Working free models (verified from your test)
export const OPENROUTER_MODELS = {
    PRIMARY: 'arcee-ai/trinity-large-preview:free',
    FALLBACKS: [
        'nvidia/nemotron-nano-9b-v2:free',
        'qwen/qwen3-coder:free',
        'openai/gpt-oss-120b:free'
    ]
};

/**
 * Generate content with OpenRouter
 */
export async function generateWithOpenRouter(prompt, options = {}) {
    const {
        model = OPENROUTER_MODELS.PRIMARY,
        temperature = 0.7,
        max_tokens = 4096
    } = options;

    if (!OPENROUTER_NOTES_API_KEY) {
        throw new Error('❌ OPENROUTER_NOTES_API_KEY not configured in .env file');
    }

    console.log(`📡 Calling OpenRouter with model: ${model}`);

    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${OPENROUTER_NOTES_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'http://localhost:3000',
            'X-Title': 'FlashNotes App'
        },
        body: JSON.stringify({
            model: model,
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: temperature,
            max_tokens: max_tokens
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`OpenRouter API error (${response.status}): ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    return {
        success: true,
        text: data.choices[0].message.content,
        model: data.model,
        usage: data.usage
    };
}

/**
 * Generate with automatic fallback to other models
 */
export async function generateWithFallback(prompt, options = {}) {
    // Try primary model first
    try {
        console.log(`🎯 Trying primary model: ${OPENROUTER_MODELS.PRIMARY}`);
        const result = await generateWithOpenRouter(prompt, {
            ...options,
            model: OPENROUTER_MODELS.PRIMARY
        });
        console.log(`✅ Primary model succeeded: ${OPENROUTER_MODELS.PRIMARY}`);
        return result;
    } catch (primaryError) {
        console.log(`⚠️ Primary model failed: ${primaryError.message}`);
        
        // Try fallback models
        for (const fallbackModel of OPENROUTER_MODELS.FALLBACKS) {
            try {
                console.log(`🔄 Trying fallback model: ${fallbackModel}`);
                const result = await generateWithOpenRouter(prompt, {
                    ...options,
                    model: fallbackModel
                });
                console.log(`✅ Fallback model succeeded: ${fallbackModel}`);
                return result;
            } catch (fallbackError) {
                console.log(`❌ Fallback ${fallbackModel} failed: ${fallbackError.message}`);
            }
        }
        
        throw new Error('All OpenRouter models failed. Check your API key and internet connection.');
    }
}

export default {
    generateWithOpenRouter,
    generateWithFallback,
    OPENROUTER_MODELS
};