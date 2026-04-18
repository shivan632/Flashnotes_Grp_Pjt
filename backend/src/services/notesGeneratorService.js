// backend/src/services/notesGeneratorService.js
import { getNotesGeminiModel } from '../config/notesGemini.js';
import { generateWithFallback } from './openrouterNotesService.js';

export async function generateNotes(topic, difficulty = 'beginner', style = 'detailed') {
    try {
        console.log(`📝 Generating notes for: ${topic} (${difficulty}, ${style})`);
        
        const prompt = buildNotesPrompt(topic, difficulty, style);
        
        // Try OpenRouter first (working, no quota issues)
        console.log('📡 Trying OpenRouter API first...');
        try {
            const openRouterResult = await generateWithFallback(prompt, {
                temperature: 0.7,
                max_tokens: 4096
            });
            
            if (openRouterResult.success) {
                const notesData = parseNotesResponse(openRouterResult.text, topic);
                console.log(`✅ Notes generated with OpenRouter: ${notesData.key_concepts?.length || 0} concepts`);
                console.log(`📡 Model used: ${openRouterResult.model}`);
                
                return {
                    success: true,
                    notes: notesData,
                    topic: topic,
                    difficulty: difficulty,
                    generated_at: new Date().toISOString(),
                    model_used: openRouterResult.model,
                    source: 'openrouter'
                };
            }
        } catch (openRouterError) {
            console.log(`⚠️ OpenRouter failed: ${openRouterError.message}`);
            console.log('🔄 Falling back to Gemini API...');
        }
        
        // Fallback to Gemini API
        console.log('📡 Sending request to Gemini API...');
        const model = getNotesGeminiModel();
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        const notesData = parseNotesResponse(text, topic);
        
        console.log(`✅ Notes generated with Gemini: ${notesData.key_concepts?.length || 0} concepts`);
        
        return {
            success: true,
            notes: notesData,
            topic: topic,
            difficulty: difficulty,
            generated_at: new Date().toISOString(),
            model_used: 'gemini-1.5-pro',
            source: 'gemini'
        };
        
    } catch (error) {
        console.error('Notes generation error:', error);
        
        return {
            success: false,
            notes: getFallbackNotes(topic),
            topic: topic,
            is_fallback: true,
            error: error.message
        };
    }
}

function buildNotesPrompt(topic, difficulty, style) {
    const difficultyText = difficulty === 'beginner' ? 'simple and basic explanations' :
                          difficulty === 'intermediate' ? 'practical and detailed explanations' :
                          'advanced and in-depth explanations';
    
    const exampleCount = difficulty === 'beginner' ? 2 : difficulty === 'intermediate' ? 3 : 4;
    
    return `You are an expert technical writer. Generate comprehensive notes for "${topic}" at ${difficulty} level with ${style} style.

Return ONLY a valid JSON object with this exact structure. DO NOT include any other text, markdown, or explanations outside the JSON.

{
  "title": "${topic} Notes",
  "overview": "2-3 sentences introduction about ${topic}",
  "key_concepts": [
    "Concept 1: Brief explanation",
    "Concept 2: Brief explanation",
    "Concept 3: Brief explanation",
    "Concept 4: Brief explanation"
  ],
  "code_examples": [
    {
      "title": "Basic Example",
      "code": "code here with proper syntax",
      "output": "expected output",
      "explanation": "what this code does"
    }
  ],
  "best_practices": [
    "Best practice 1 with explanation",
    "Best practice 2 with explanation",
    "Best practice 3 with explanation"
  ],
  "common_mistakes": [
    "Mistake 1: How to avoid it",
    "Mistake 2: How to avoid it",
    "Mistake 3: How to avoid it"
  ]
}

Requirements:
- Difficulty level: ${difficultyText}
- Include ${exampleCount} code examples
- Make code examples practical and runnable
- Ensure valid JSON with no trailing commas
- Escape any special characters in strings
- Return ONLY the JSON object, no other text`;
}

function parseNotesResponse(text, topic) {
    try {
        console.log('🔍 Parsing API response...');
        
        let cleanText = text.trim();
        
        // Remove markdown code blocks if present
        cleanText = cleanText.replace(/```json\n?/g, '');
        cleanText = cleanText.replace(/```\n?/g, '');
        cleanText = cleanText.replace(/`/g, '');
        
        // Find JSON object boundaries
        let startIdx = cleanText.indexOf('{');
        let endIdx = cleanText.lastIndexOf('}');
        
        if (startIdx === -1 || endIdx === -1) {
            throw new Error('No JSON object found in response');
        }
        
        let jsonStr = cleanText.substring(startIdx, endIdx + 1);
        
        // Fix common JSON issues
        jsonStr = jsonStr
            .replace(/,\s*}/g, '}')
            .replace(/,\s*]/g, ']')
            .replace(/\n/g, ' ')
            .replace(/\r/g, '')
            .replace(/\t/g, ' ');
        
        // Try to parse
        let notes;
        try {
            notes = JSON.parse(jsonStr);
            console.log('✅ JSON parsed successfully');
        } catch (firstError) {
            console.log('⚠️ First parse failed, trying aggressive cleaning...');
            
            let cleaned = jsonStr;
            cleaned = cleaned.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
            cleaned = cleaned.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":');
            cleaned = cleaned.replace(/'/g, '"');
            cleaned = cleaned.replace(/^\uFEFF/, '');
            
            notes = JSON.parse(cleaned);
            console.log('✅ JSON parsed after aggressive cleaning');
        }
        
        // Ensure all required fields exist with fallbacks
        const result = {
            title: notes.title || `${topic} Notes`,
            overview: notes.overview || `Learn about ${topic} with these comprehensive notes.`,
            key_concepts: Array.isArray(notes.key_concepts) && notes.key_concepts.length > 0 
                ? notes.key_concepts.slice(0, 6)
                : [`Introduction to ${topic}`, `Core concepts of ${topic}`, `Practical applications of ${topic}`],
            code_examples: Array.isArray(notes.code_examples) && notes.code_examples.length > 0
                ? notes.code_examples.slice(0, 4)
                : [{
                    title: `Basic ${topic} Example`,
                    code: `// Basic example code for ${topic}\nconsole.log("Hello, ${topic}!");`,
                    output: `Hello, ${topic}!`,
                    explanation: `This is a simple example to demonstrate basic syntax.`
                }],
            best_practices: Array.isArray(notes.best_practices) && notes.best_practices.length > 0
                ? notes.best_practices.slice(0, 5)
                : [
                    `Write clean and readable code`,
                    `Follow community guidelines`,
                    `Document your code properly`
                ],
            common_mistakes: Array.isArray(notes.common_mistakes) && notes.common_mistakes.length > 0
                ? notes.common_mistakes.slice(0, 5)
                : [
                    `Not handling edge cases: Always consider all possible inputs`,
                    `Poor error handling: Implement proper try-catch blocks`,
                    `Code duplication: Reuse code through functions and modules`
                ]
        };
        
        return result;
        
    } catch (error) {
        console.error('❌ Parse error:', error.message);
        console.log('⚠️ Using fallback notes');
        return getFallbackNotes(topic);
    }
}

function getFallbackNotes(topic) {
    return {
        title: `${topic} Notes`,
        overview: `${topic} is an important technology. This guide will help you understand the core concepts.`,
        key_concepts: [
            `Introduction to ${topic}`,
            `Core concepts of ${topic}`,
            `Practical applications of ${topic}`,
            `Best practices for ${topic}`
        ],
        code_examples: [
            {
                title: `Basic ${topic} Example`,
                code: `// Basic example code for ${topic}\nconsole.log("Hello, ${topic}!");`,
                output: `Hello, ${topic}!`,
                explanation: `This is a simple example to demonstrate basic syntax.`
            }
        ],
        best_practices: [
            `Write clean and readable code`,
            `Follow community guidelines`,
            `Document your code properly`
        ],
        common_mistakes: [
            `Not handling edge cases: Always consider all possible inputs`,
            `Poor error handling: Implement proper try-catch blocks`,
            `Code duplication: Reuse code through functions and modules`
        ]
    };
}