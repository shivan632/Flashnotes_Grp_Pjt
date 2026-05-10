// backend/src/services/roadmapGeminiService.js
import dotenv from 'dotenv';
dotenv.config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_NOTES_API_KEY;
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

// ✅ Working OpenRouter free models (from test results)
const OPENROUTER_MODELS = [
    'liquid/lfm-2.5-1.2b-instruct:free',     // ⚡ Fastest (1.5s)
    'nvidia/nemotron-nano-9b-v2:free',       // ✅ Fast & reliable
    'nvidia/nemotron-nano-12b-v2-vl:free',   // ✅ Good quality
    'openai/gpt-oss-120b:free',              // ✅ Good
    'z-ai/glm-4.5-air:free'                  // ✅ Working fallback
];

/**
 * Call OpenRouter API to generate roadmap
 */
async function callOpenRouter(prompt) {
    if (!OPENROUTER_API_KEY) {
        throw new Error('OpenRouter API key not configured');
    }

    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://flashnotes.app',
            'X-Title': 'FlashNotes'
        },
        body: JSON.stringify({
            model: OPENROUTER_MODELS[0],
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert curriculum designer that creates detailed, specific learning roadmaps. Always return valid JSON only.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 4096
        })
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(`OpenRouter API error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content;
}

/**
 * Try multiple OpenRouter models until one works
 */
async function tryMultipleOpenRouterModels(prompt) {
    for (const model of OPENROUTER_MODELS) {
        try {
            console.log(`📡 Trying OpenRouter model: ${model}`);
            
            const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'https://flashnotes.app',
                    'X-Title': 'FlashNotes'
                },
                body: JSON.stringify({
                    model: model,
                    messages: [
                        {
                            role: 'system',
                            content: 'You are an expert curriculum designer that creates detailed, specific learning roadmaps. Return ONLY valid JSON.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 4096
                })
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                console.log(`⚠️ Model ${model} failed: ${error.error?.message || response.statusText}`);
                continue;
            }

            const data = await response.json();
            const text = data.choices[0]?.message?.content;
            
            if (text && text.length > 100) {
                console.log(`✅ OpenRouter model ${model} worked!`);
                return text;
            }
        } catch (error) {
            console.log(`⚠️ Model ${model} failed: ${error.message}`);
            continue;
        }
    }
    return null;
}

/**
 * Generate structured roadmap for a topic using OpenRouter API
 * @param {string} topic - Topic name (e.g., "Python", "React")
 * @param {string} difficulty - beginner, intermediate, advanced
 * @param {number} depth - Number of levels (2-5)
 * @returns {Promise<Object>} Structured roadmap data
 */
export async function generateRoadmapWithGemini(topic, difficulty = 'beginner', depth = 3) {
    try {
        console.log('🤖 Generating roadmap for:', topic);
        console.log(`   📊 Difficulty: ${difficulty}, Depth: ${depth}`);
        
        // Build the prompt
        const prompt = buildRoadmapPrompt(topic, difficulty, depth);
        
        console.log('📡 Sending to OpenRouter API...');
        
        // Try OpenRouter first
        let text = await tryMultipleOpenRouterModels(prompt);
        
        if (!text) {
            throw new Error('All OpenRouter models failed');
        }
        
        // Parse the JSON response
        const roadmapData = parseAPIResponse(text, topic);
        
        console.log(`✅ Roadmap generated: ${roadmapData.nodes.length} nodes, ${roadmapData.edges.length} edges`);
        
        return roadmapData;
        
    } catch (error) {
        console.error('Roadmap Generation Error:', error);
        
        // Return fallback roadmap if API fails
        console.log('📝 Using fallback roadmap...');
        return getFallbackRoadmap(topic, difficulty, depth);
    }
}

/**
 * Parse API response and extract JSON
 */
function parseAPIResponse(text, topic) {
    try {
        // Extract JSON from response
        let jsonStr = text;
        const startIdx = text.indexOf('{');
        const endIdx = text.lastIndexOf('}') + 1;
        
        if (startIdx !== -1 && endIdx > startIdx) {
            jsonStr = text.substring(startIdx, endIdx);
        }
        
        const roadmap = JSON.parse(jsonStr);
        
        // Validate and ensure required fields
        return {
            topic: roadmap.topic || topic,
            title: roadmap.title || `Complete ${topic} Roadmap`,
            description: roadmap.description || `Learn ${topic} from scratch`,
            difficulty: roadmap.difficulty || 'beginner',
            depth_level: roadmap.depth_level || 3,
            nodes: roadmap.nodes || [],
            edges: roadmap.edges || [],
            metadata: {
                generated_at: new Date().toISOString(),
                model: 'openrouter',
                topic: topic
            }
        };
        
    } catch (error) {
        console.error('Failed to parse API response:', error);
        throw new Error('Invalid response from AI');
    }
}

/**
 * Build the prompt for API - IMPROVED for specific content
 */
function buildRoadmapPrompt(topic, difficulty, depth) {
    const difficultyText = difficulty === 'beginner' ? 'Basic concepts, simple explanations, introductory topics.' :
                          difficulty === 'intermediate' ? 'Practical applications, tools, frameworks, real-world examples.' :
                          'Optimization, architecture patterns, advanced techniques, expert-level concepts.';
    
    const exampleCount = difficulty === 'beginner' ? 8 : difficulty === 'intermediate' ? 10 : 12;
    
    return `You are an expert curriculum designer. Create a DETAILED and SPECIFIC learning roadmap for "${topic}" at ${difficulty} level with ${depth} levels deep.

IMPORTANT RULES:
1. DO NOT use generic names like "Part 1", "Part 2", "Introduction Part X"
2. Use SPECIFIC, REAL topic names (e.g., "JSX Syntax", "React Hooks", "State Management with Redux")
3. Each node name must be meaningful and descriptive (3-8 words max)
4. Include REAL concepts that actually exist in ${topic}

Return ONLY a valid JSON object with this EXACT structure. DO NOT include any other text:

{
  "topic": "${topic}",
  "title": "Complete ${topic} Learning Path - ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Level",
  "description": "A comprehensive ${difficulty} level roadmap with specific topics to master ${topic}",
  "difficulty": "${difficulty}",
  "depth_level": ${depth},
  "nodes": [
    {
      "id": "1",
      "name": "SPECIFIC TOPIC NAME - NOT GENERIC",
      "level": 0,
      "description": "Detailed description of what to learn",
      "estimated_time": "X hours",
      "resources": ["Official Documentation", "Video Tutorial", "Practice Exercises"]
    }
  ],
  "edges": [
    { "from": "1", "to": "1.1" }
  ]
}

Generate ${Math.min(depth * 3 + 2, 15)} to ${Math.min(depth * 5 + 3, 25)} specific nodes for "${topic}" at ${difficulty} level.
Each node must have a unique id (use "1", "1.1", "1.1.1", "2", "2.1", etc.)
Level 0 is the root/overview node.
Level 1 are main categories.
Level 2+ are sub-topics based on depth ${depth}.`;
}

/**
 * Fallback roadmap with SPECIFIC topics (no generic names)
 */
function getFallbackRoadmap(topic, difficulty, depth) {
    console.log('📝 Using fallback roadmap for:', topic);
    
    const specificTopics = getSpecificTopicsForTech(topic, difficulty);
    
    const nodes = [];
    const edges = [];
    
    // Root node
    nodes.push({
        id: "1",
        name: `${topic} ${difficulty === 'beginner' ? 'Fundamentals' : difficulty === 'intermediate' ? 'Mastery' : 'Expert'} Path`,
        level: 0,
        description: `Master ${topic} from ${difficulty} level with hands-on practice`,
        estimated_time: "40-60 hours",
        resources: ["Official Documentation", "Video Courses", "Practice Platforms"]
    });
    
    // Level 1 nodes - specific topics
    specificTopics.forEach((topicName, idx) => {
        const nodeId = `${idx + 2}`;
        nodes.push({
            id: nodeId,
            name: topicName,
            level: 1,
            description: `Learn and practice ${topicName.toLowerCase()}`,
            estimated_time: "4-8 hours",
            resources: ["Hands-on exercises", "Code examples", "Mini projects"]
        });
        edges.push({ from: "1", to: nodeId });
        
        // Level 2 nodes if depth > 1
        if (depth > 1) {
            for (let i = 1; i <= 2; i++) {
                const subId = `${nodeId}.${i}`;
                const subName = getSubTopicName(topicName, i);
                nodes.push({
                    id: subId,
                    name: subName,
                    level: 2,
                    description: `Deep dive into ${topicName.toLowerCase()} - Part ${i}`,
                    estimated_time: "2-4 hours",
                    resources: ["Advanced tutorials", "Real-world examples", "Practice challenges"]
                });
                edges.push({ from: nodeId, to: subId });
            }
        }
    });
    
    return {
        topic: topic,
        title: `Complete ${topic} Learning Path - ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Level`,
        description: `A comprehensive ${difficulty} level roadmap with specific topics to master ${topic}`,
        difficulty: difficulty,
        depth_level: depth,
        nodes: nodes,
        edges: edges,
        is_fallback: true,
        metadata: {
            generated_at: new Date().toISOString(),
            model: 'fallback',
            topic: topic
        }
    };
}

/**
 * Get specific topics based on technology and difficulty
 */
function getSpecificTopicsForTech(topic, difficulty) {
    const topicLower = topic.toLowerCase();
    
    const techTopics = {
        react: {
            beginner: [
                "What is React and Why Use It?",
                "JSX Syntax and Expressions",
                "Functional Components",
                "Props and Component Communication",
                "useState Hook for State Management",
                "Event Handling in React",
                "Conditional Rendering",
                "Lists and Keys (map method)"
            ],
            intermediate: [
                "useEffect Hook (Side Effects & API Calls)",
                "useContext Hook for Global State",
                "Custom Hooks Creation",
                "React Router v6 for Navigation",
                "Redux Toolkit for State Management",
                "React Query for Data Fetching",
                "Performance Optimization (memo, useCallback, useMemo)",
                "Code Splitting with lazy and Suspense"
            ],
            advanced: [
                "Higher-Order Components (HOCs) Pattern",
                "Render Props Pattern",
                "Compound Components Pattern",
                "Server Components",
                "Next.js Framework (SSR/SSG)",
                "Testing with Jest and React Testing Library",
                "Deployment and CI/CD Pipelines",
                "Micro-Frontends Architecture"
            ]
        },
        python: {
            beginner: [
                "Variables and Data Types",
                "Strings and String Methods",
                "Lists, Tuples, and Dictionaries",
                "If-Else and Conditional Statements",
                "Loops (for, while, nested loops)",
                "Functions and Lambda Expressions",
                "File Handling (open, read, write)",
                "Error Handling with try-except"
            ],
            intermediate: [
                "List Comprehensions and Generator Expressions",
                "Decorators and Function Wrappers",
                "Object-Oriented Programming (Classes, Inheritance)",
                "Modules and Packages (pip, virtualenv)",
                "Working with APIs using requests",
                "Database Integration (SQLite, PostgreSQL)",
                "Web Scraping with BeautifulSoup",
                "Regular Expressions (re module)"
            ],
            advanced: [
                "Multithreading and Multiprocessing",
                "Asyncio and Async/Await",
                "Web Frameworks (FastAPI, Django, Flask)",
                "Data Science with NumPy and Pandas",
                "Data Visualization (Matplotlib, Seaborn)",
                "Machine Learning with scikit-learn",
                "Deep Learning with TensorFlow/PyTorch",
                "Testing with pytest and unittest"
            ]
        },
        javascript: {
            beginner: [
                "Variables (var, let, const)",
                "Data Types and Type Conversion",
                "Functions and Scope",
                "Arrays and Array Methods",
                "Objects and Object Methods",
                "Loops (for, while, forEach, map)",
                "Conditionals (if-else, switch, ternary)",
                "DOM Manipulation and Events"
            ],
            intermediate: [
                "ES6+ Features (arrow functions, destructuring, spread/rest)",
                "Promises and Async/Await",
                "Closures and Higher-Order Functions",
                "Modules (import/export)",
                "Error Handling (try-catch, throw)",
                "Local Storage and Session Storage",
                "Fetch API and AJAX",
                "Regular Expressions"
            ],
            advanced: [
                "Prototypal Inheritance and Classes",
                "Event Loop and Concurrency Model",
                "Design Patterns in JavaScript",
                "Web APIs (WebSockets, Service Workers, WebRTC)",
                "Performance Optimization Techniques",
                "Testing (Jest, Mocha, Cypress)",
                "Build Tools (Webpack, Vite, Rollup)",
                "TypeScript Integration"
            ]
        }
    };
    
    const defaultTopics = {
        beginner: [
            `Introduction to ${topic}`,
            `${topic} Basics and Syntax`,
            `Core Concepts of ${topic}`,
            `Working with ${topic} Tools`,
            `Practice Exercises for ${topic}`,
            `Building Simple Projects`,
            `Debugging and Troubleshooting`,
            `Best Practices for Beginners`
        ],
        intermediate: [
            `Advanced ${topic} Concepts`,
            `${topic} Design Patterns`,
            `Performance Optimization in ${topic}`,
            `Working with APIs in ${topic}`,
            `State Management in ${topic}`,
            `Testing ${topic} Applications`,
            `Real-World ${topic} Projects`,
            `Deployment Strategies`
        ],
        advanced: [
            `Expert ${topic} Patterns`,
            `Architecture Design in ${topic}`,
            `Microservices with ${topic}`,
            `Security Best Practices`,
            `CI/CD for ${topic}`,
            `Monitoring and Logging`,
            `Scalability Patterns`,
            `Contributing to Open Source`
        ]
    };
    
    const tech = Object.keys(techTopics).find(t => topicLower.includes(t));
    
    if (tech && techTopics[tech][difficulty]) {
        return techTopics[tech][difficulty];
    }
    
    return defaultTopics[difficulty] || defaultTopics.beginner;
}

/**
 * Get sub-topic names for level 2 nodes
 */
function getSubTopicName(parentName, partNumber) {
    const cleanName = parentName.replace(/[^a-zA-Z0-9 ]/g, '');
    
    if (partNumber === 1) {
        return `${cleanName} - Fundamentals & Core Concepts`;
    } else {
        return `${cleanName} - Advanced Techniques & Best Practices`;
    }
}

export default { generateRoadmapWithGemini };