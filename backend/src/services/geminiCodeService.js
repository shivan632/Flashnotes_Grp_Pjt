// backend/src/services/geminiCodeService.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_CODE_API_KEY || process.env.GEMINI_API_KEY;
const OPENROUTER_CODE_API_KEY = process.env.OPENROUTER_CODE_API_KEY || process.env.OPENROUTER_API_KEY;

// ✅ ALL WORKING MODELS FROM TEST
const WORKING_MODELS = [
    { name: 'Liquid 2.5 Instruct', id: 'liquid/lfm-2.5-1.2b-instruct:free', provider: 'OpenRouter', timeout: 5000 },
    { name: 'Trinity Mini', id: 'arcee-ai/trinity-mini:free', provider: 'OpenRouter', timeout: 8000 },
    { name: 'GPT OSS 120B', id: 'openai/gpt-oss-120b:free', provider: 'OpenRouter', timeout: 12000 },
    { name: 'Trinity Large', id: 'arcee-ai/trinity-large-preview:free', provider: 'OpenRouter', timeout: 15000 },
    { name: 'GLM 4.5 Air', id: 'z-ai/glm-4.5-air:free', provider: 'OpenRouter', timeout: 15000 },
    { name: 'Nemotron 9B', id: 'nvidia/nemotron-nano-9b-v2:free', provider: 'OpenRouter', timeout: 25000 },
    { name: 'Nemotron 12B', id: 'nvidia/nemotron-nano-12b-v2-vl:free', provider: 'OpenRouter', timeout: 25000 },
    { name: 'Gemini 2.5 Flash', id: 'gemini-2.5-flash', provider: 'Google', timeout: 10000 },
];

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

// Execute code with OpenRouter (using CODE API key)
async function executeWithOpenRouter(code, language, modelId, timeout = 10000) {
    if (!OPENROUTER_CODE_API_KEY) {
        return { success: false, error: 'OpenRouter Code API key not configured' };
    }
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENROUTER_CODE_API_KEY}`,
                'HTTP-Referer': 'https://flashnotes.app',
                'X-Title': 'Flashnotes Code Editor'
            },
            body: JSON.stringify({
                model: modelId,
                messages: [
                    {
                        role: 'system',
                        content: `You are a code executor. Execute the ${language} code and return ONLY the output. No explanations, no markdown, just the raw output.`
                    },
                    {
                        role: 'user',
                        content: `Execute this ${language} code and show me the output:\n\n${code}\n\nOutput:`
                    }
                ],
                max_tokens: 2000,
                temperature: 0
            }),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        const result = await response.json();
        
        if (result.error) {
            return { success: false, error: result.error.message || 'API error' };
        }
        
        let output = result.choices?.[0]?.message?.content || '';
        output = output.replace(/```\w*\n?/g, '').replace(/```$/g, '').trim();
        
        return { success: true, output: output, error: '' };
        
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            return { success: false, error: 'Request timeout' };
        }
        return { success: false, error: error.message };
    }
}

// Execute code with Gemini
async function executeWithGemini(code, language, modelId) {
    if (!GEMINI_API_KEY) {
        return { success: false, error: 'Gemini API key not configured' };
    }
    
    try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: modelId,
            generationConfig: { temperature: 0, maxOutputTokens: 4096 }
        });
        
        const mappedLanguage = LANGUAGE_MAP[language.toLowerCase()] || 'python';
        const prompt = `Execute the following ${mappedLanguage} code and return ONLY the output:\n\n${code}\n\nOutput:`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let output = response.text();
        output = output.replace(/```\w*\n?/g, '').replace(/```$/g, '').trim();
        
        return { success: true, output: output, error: '' };
        
    } catch (error) {
        if (error.message.includes('429')) {
            return { success: false, error: 'Rate limit exceeded (quota full)' };
        }
        return { success: false, error: error.message };
    }
}

// Main execute function with auto-fallback
export async function executeCode(code, language) {
    console.log(`🚀 Executing ${language} code...`);
    
    let lastError = null;
    
    // Try each working model in order
    for (const model of WORKING_MODELS) {
        console.log(`📡 Trying: ${model.name} (${model.provider})`);
        
        let result;
        
        if (model.provider === 'OpenRouter') {
            if (!OPENROUTER_CODE_API_KEY) {
                console.log(`   ⚠️ OpenRouter Code API key missing, skipping`);
                continue;
            }
            result = await executeWithOpenRouter(code, language, model.id, model.timeout);
        } else {
            if (!GEMINI_API_KEY) {
                console.log(`   ⚠️ Gemini API key missing, skipping`);
                continue;
            }
            result = await executeWithGemini(code, language, model.id);
        }
        
        if (result.success) {
            console.log(`   ✅ Success with ${model.name} (${model.provider})`);
            return result;
        }
        
        console.log(`   ❌ Failed: ${result.error}`);
        lastError = result.error;
        
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.error('❌ All models failed');
    return {
        success: false,
        output: '',
        error: lastError || 'No working model available'
    };
}

export default { executeCode };