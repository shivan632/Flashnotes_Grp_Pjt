// backend/src/services/ai.service.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY);

// Initialize OpenRouter as fallback
let openrouter = null;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;

if (OPENROUTER_API_KEY) {
    try {
        openrouter = new OpenAI({
            baseURL: 'https://openrouter.ai/api/v1',
            apiKey: OPENROUTER_API_KEY,
            defaultHeaders: {
                'HTTP-Referer': 'https://flashnotes.app',
                'X-Title': 'Flashnotes'
            }
        });
        console.log('✅ OpenRouter client initialized for AI service');
    } catch (error) {
        console.error('❌ OpenRouter initialization error:', error.message);
    }
}

// Working model names (based on test results)
const GEMINI_MODELS = [
    'gemini-2.5-flash',      // ✅ Fastest Gemini (2-3s)
    'gemini-1.5-flash',      // ✅ Fast & reliable
    'gemini-1.5-pro'         // ✅ Slower but more accurate
];

const OPENROUTER_MODELS = [
    'liquid/lfm-2.5-1.2b-instruct:free',  // ✅ Fastest (1.5s)
    'nvidia/nemotron-nano-9b-v2:free',    // ✅ Fast & reliable
    'openai/gpt-oss-120b:free',           // ✅ Good quality
    'z-ai/glm-4.5-air:free'               // ✅ Working fallback
];

// Generate Q&A for a given topic using multiple AI providers
export const generateQA = async (topic, count = 5) => {
    try {
        console.log(`🤖 Generating ${count} Q&A for topic: ${topic}`);
        
        // Fallback questions (always available)
        const fallbackData = getFallbackQuestions(topic, count);
        
        // Try Gemini first
        if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'AIzaSyC_V7jYScslWhDuKSjnMm-') {
            const geminiResult = await tryGeminiQA(topic, count);
            if (geminiResult && geminiResult.length > 0) {
                console.log('✅ Q&A generated using Gemini');
                return geminiResult.slice(0, count);
            }
        }
        
        // Try OpenRouter if Gemini fails
        if (openrouter && OPENROUTER_API_KEY) {
            const openrouterResult = await tryOpenRouterQA(topic, count);
            if (openrouterResult && openrouterResult.length > 0) {
                console.log('✅ Q&A generated using OpenRouter');
                return openrouterResult.slice(0, count);
            }
        }
        
        // Use fallback if all APIs fail
        console.log('⚠️ Using fallback questions (all APIs failed)');
        return fallbackData;
        
    } catch (error) {
        console.error('Generation error:', error.message);
        return getFallbackQuestions(topic, count);
    }
};

// Try Gemini with multiple model fallbacks
async function tryGeminiQA(topic, count) {
    const prompt = `Generate ${count} important questions and their detailed answers about "${topic}". 
    Format each as:
    Q: [question]
    A: [detailed answer]
    
    Make answers informative and educational.`;
    
    for (const modelName of GEMINI_MODELS) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            
            const qaList = parseQA(text);
            if (qaList.length > 0) {
                console.log(`✅ Gemini model ${modelName} worked!`);
                return qaList;
            }
        } catch (error) {
            console.log(`⚠️ Gemini model ${modelName} failed: ${error.message}`);
            continue;
        }
    }
    return null;
}

// Try OpenRouter with multiple model fallbacks
async function tryOpenRouterQA(topic, count) {
    const prompt = `Generate ${count} important questions and their detailed answers about "${topic}". 
    
    Format each as:
    Q: [question]
    A: [detailed answer]
    
    Make answers informative and educational.`;
    
    for (const modelName of OPENROUTER_MODELS) {
        try {
            const completion = await openrouter.chat.completions.create({
                model: modelName,
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful educational assistant that creates clear Q&A pairs.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 2000
            });
            
            let text = null;
            if (completion.choices && completion.choices[0]?.message?.content) {
                text = completion.choices[0].message.content;
            }
            
            if (text) {
                const qaList = parseQA(text);
                if (qaList.length > 0) {
                    console.log(`✅ OpenRouter model ${modelName} worked!`);
                    return qaList;
                }
            }
        } catch (error) {
            console.log(`⚠️ OpenRouter model ${modelName} failed: ${error.message}`);
            continue;
        }
    }
    return null;
}

function parseQA(text) {
    const qaList = [];
    const lines = text.split('\n');
    let currentQuestion = '';
    let currentAnswer = '';
    let isAnswer = false;
    
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        if (!line) continue;
        
        if (line.match(/^Q[:.]?\s/i) || line.match(/^Question[:.]?\s/i)) {
            if (currentQuestion && currentAnswer) {
                qaList.push({ question: currentQuestion, answer: currentAnswer });
            }
            currentQuestion = line.replace(/^Q[:.]?\s/i, '').replace(/^Question[:.]?\s/i, '');
            currentAnswer = '';
            isAnswer = false;
        }
        else if (line.match(/^A[:.]?\s/i) || line.match(/^Answer[:.]?\s/i)) {
            currentAnswer = line.replace(/^A[:.]?\s/i, '').replace(/^Answer[:.]?\s/i, '');
            isAnswer = true;
        }
        else if (isAnswer) {
            currentAnswer += ' ' + line;
        }
    }
    
    if (currentQuestion && currentAnswer) {
        qaList.push({ question: currentQuestion, answer: currentAnswer });
    }
    
    return qaList;
}

function getFallbackQuestions(topic, count) {
    const allTopics = {
        'Operating System': [
            { q: 'What is an Operating System?', a: 'An Operating System (OS) is system software that manages computer hardware and software resources.' },
            { q: 'What is a process?', a: 'A process is a program in execution. It includes program code, program counter, registers, and stack.' },
            { q: 'What is virtual memory?', a: 'Virtual memory is a memory management technique that creates an illusion of more memory than physically available.' },
            { q: 'What is a deadlock?', a: 'A deadlock is a situation where two or more processes are waiting for each other to release resources.' },
            { q: 'What is scheduling?', a: 'Scheduling is the process of deciding which process runs on the CPU at a given time.' }
        ],
        'Database': [
            { q: 'What is a database?', a: 'A database is an organized collection of structured information or data.' },
            { q: 'What is SQL?', a: 'SQL (Structured Query Language) is used to manage and manipulate relational databases.' },
            { q: 'What is a primary key?', a: 'A primary key uniquely identifies each record in a database table.' },
            { q: 'What is normalization?', a: 'Normalization organizes data to reduce redundancy and improve integrity.' },
            { q: 'What is a foreign key?', a: 'A foreign key is a field that links two tables together.' }
        ],
        'React': [
            { q: 'What is React?', a: 'React is a JavaScript library for building user interfaces.' },
            { q: 'What is JSX?', a: 'JSX is a syntax extension that allows writing HTML in JavaScript.' },
            { q: 'What are React Hooks?', a: 'Hooks let you use state and other React features in functional components.' },
            { q: 'What is useState?', a: 'useState is a Hook that adds state to functional components.' },
            { q: 'What is useEffect?', a: 'useEffect handles side effects like data fetching in React components.' }
        ],
        'Node.js': [
            { q: 'What is Node.js?', a: 'Node.js is a JavaScript runtime built on Chrome V8 engine.' },
            { q: 'What is npm?', a: 'npm is the Node Package Manager for installing JavaScript packages.' },
            { q: 'What is Express?', a: 'Express is a web framework for Node.js.' },
            { q: 'What is the event loop?', a: 'The event loop handles asynchronous operations in Node.js.' },
            { q: 'What is middleware?', a: 'Middleware functions execute during the request-response cycle.' }
        ]
    };
    
    let topicData = allTopics[topic];
    if (!topicData) {
        topicData = [];
        for (let i = 1; i <= count; i++) {
            topicData.push({
                q: `What is an important concept in ${topic}?`,
                a: `${topic} is a fascinating field. Please try a more specific topic for detailed questions.`
            });
        }
    }
    
    const result = [];
    for (let i = 0; i < Math.min(count, topicData.length); i++) {
        result.push({ question: topicData[i].q, answer: topicData[i].a });
    }
    
    return result;
}

export const generateQuiz = async (topic, count = 10) => {
    const qaList = await generateQA(topic, count);
    
    const questions = [];
    for (let i = 0; i < qaList.length; i++) {
        const qa = qaList[i];
        const options = [
            qa.answer,
            'This is an incorrect option',
            'Another wrong answer',
            'Not the correct choice'
        ];
        // Shuffle options
        for (let j = options.length - 1; j > 0; j--) {
            const k = Math.floor(Math.random() * (j + 1));
            [options[j], options[k]] = [options[k], options[j]];
        }
        const correctIndex = options.indexOf(qa.answer);
        
        questions.push({
            id: i + 1,
            question: qa.question,
            answer: qa.answer,
            options: options,
            correctOption: correctIndex
        });
    }
    
    return questions;
};

export default { generateQA, generateQuiz };