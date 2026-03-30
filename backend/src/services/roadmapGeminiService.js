// backend/src/services/roadmapGeminiService.js
import { getGeminiModel, testGeminiConnection } from '../config/gemini.js';

/**
 * Generate structured roadmap for a topic using Gemini AI
 * @param {string} topic - Topic name (e.g., "Python", "React")
 * @param {string} difficulty - beginner, intermediate, advanced
 * @param {number} depth - Number of levels (2-5)
 * @returns {Promise<Object>} Structured roadmap data
 */
export async function generateRoadmapWithGemini(topic, difficulty = 'beginner', depth = 3) {
    try {
        console.log('🤖 Generating roadmap for:', topic);
        console.log(`   📊 Difficulty: ${difficulty}, Depth: ${depth}`);
        
        const model = getGeminiModel();
        
        // Build the prompt
        const prompt = buildRoadmapPrompt(topic, difficulty, depth);
        
        console.log('📡 Sending to Gemini API...');
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Parse the JSON response
        const roadmapData = parseGeminiResponse(text, topic);
        
        console.log(`✅ Roadmap generated: ${roadmapData.nodes.length} nodes, ${roadmapData.edges.length} edges`);
        
        return roadmapData;
        
    } catch (error) {
        console.error('Gemini Roadmap Error:', error);
        
        // Return fallback roadmap if API fails
        console.log('📝 Using fallback roadmap...');
        return getFallbackRoadmap(topic, difficulty, depth);
    }
}

/**
 * Build the prompt for Gemini API - IMPROVED for specific content
 */
function buildRoadmapPrompt(topic, difficulty, depth) {
    const difficultyGuide = {
        beginner: 'Basic concepts, simple explanations, introductory topics. Focus on fundamentals.',
        intermediate: 'Practical applications, tools, frameworks, real-world examples. Include best practices.',
        advanced: 'Optimization, architecture patterns, advanced techniques, expert-level concepts.'
    };
    
    // Get specific topics based on technology
    const techSpecificTips = getTechSpecificTips(topic, difficulty);
    
    return `You are an expert curriculum designer. Create a DETAILED and SPECIFIC learning roadmap for "${topic}" at ${difficulty} level with ${depth} levels deep.

IMPORTANT RULES:
1. DO NOT use generic names like "Part 1", "Part 2", "Introduction Part X"
2. Use SPECIFIC, REAL topic names (e.g., "JSX Syntax", "React Hooks", "State Management with Redux")
3. Each node name must be meaningful and descriptive (3-8 words max)
4. Include REAL concepts that actually exist in ${topic}

${techSpecificTips}

${difficulty === 'beginner' ? `
For BEGINNER level, focus on:
- What is ${topic} and why use it?
- Basic syntax and setup
- Core fundamentals
- Simple examples` : difficulty === 'intermediate' ? `
For INTERMEDIATE level, focus on:
- Advanced concepts and patterns
- State management
- Performance optimization
- Real-world applications` : `
For ADVANCED level, focus on:
- Expert-level patterns
- Architecture design
- Optimization techniques
- Production-ready practices`}

Return ONLY a valid JSON object with this EXACT structure:

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
      "description": "Detailed description of what to learn in this topic",
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
 * Get technology-specific tips for better roadmap generation
 */
function getTechSpecificTips(topic, difficulty) {
    const topicLower = topic.toLowerCase();
    
    if (topicLower.includes('react')) {
        if (difficulty === 'beginner') {
            return `For React beginner roadmap, include these SPECIFIC topics:
- JSX (JavaScript XML) syntax
- Functional Components vs Class Components
- Props and PropTypes
- useState Hook for state management
- Event Handling in React
- Conditional Rendering
- Lists and Keys (map() function)
- Forms and Controlled Components`;
        } else if (difficulty === 'intermediate') {
            return `For React intermediate roadmap, include these SPECIFIC topics:
- useEffect Hook (side effects, API calls)
- useContext Hook for global state
- Custom Hooks creation
- React Router v6 (routing)
- Redux Toolkit (state management)
- React Query (data fetching)
- Performance optimization (memo, useCallback, useMemo)
- Code splitting (lazy, Suspense)`;
        } else {
            return `For React advanced roadmap, include these SPECIFIC topics:
- Higher-Order Components (HOCs)
- Render Props pattern
- Compound Components pattern
- Server Components
- Next.js Framework
- React Server Components (RSC)
- Testing (Jest, React Testing Library, Vitest)
- Deployment and CI/CD`;
        }
    }
    
    if (topicLower.includes('python')) {
        if (difficulty === 'beginner') {
            return `For Python beginner roadmap, include these SPECIFIC topics:
- Variables and Data Types
- Strings and String Methods
- Lists, Tuples, Dictionaries, Sets
- If-Else Statements
- Loops (for, while)
- Functions and Lambda
- File Handling (open, read, write)
- Error Handling (try-except)`;
        } else if (difficulty === 'intermediate') {
            return `For Python intermediate roadmap, include these SPECIFIC topics:
- List Comprehensions
- Generators and Iterators
- Decorators
- Object-Oriented Programming (Classes, Inheritance)
- Modules and Packages (pip, virtualenv)
- Working with APIs (requests)
- Database (SQLite, PostgreSQL)
- Web Scraping (BeautifulSoup, Selenium)`;
        } else {
            return `For Python advanced roadmap, include these SPECIFIC topics:
- Multithreading and Multiprocessing
- Asyncio and Async/Await
- Web Frameworks (FastAPI, Django)
- Data Science (NumPy, Pandas, Matplotlib)
- Machine Learning (scikit-learn, TensorFlow)
- Testing (pytest, unittest)
- Deployment (Docker, AWS, Heroku)`;
        }
    }
    
    if (topicLower.includes('javascript') || topicLower.includes('js')) {
        if (difficulty === 'beginner') {
            return `For JavaScript beginner roadmap, include these SPECIFIC topics:
- Variables (var, let, const)
- Data Types (String, Number, Boolean, etc.)
- Functions and Scope
- Arrays and Objects
- Loops (for, while, forEach)
- Conditionals (if-else, switch)
- DOM Manipulation
- Events and Event Listeners`;
        } else if (difficulty === 'intermediate') {
            return `For JavaScript intermediate roadmap, include these SPECIFIC topics:
- ES6+ Features (arrow functions, destructuring)
- Promises and Async/Await
- Closures and Higher-Order Functions
- Modules (import/export)
- Error Handling (try-catch)
- Local Storage and Session Storage
- Fetch API and AJAX
- Regular Expressions`;
        } else {
            return `For JavaScript advanced roadmap, include these SPECIFIC topics:
- Prototypal Inheritance
- Event Loop and Concurrency
- Design Patterns in JS
- Web APIs (WebSockets, Service Workers)
- Performance Optimization
- Testing (Jest, Mocha, Cypress)
- Build Tools (Webpack, Vite)
- TypeScript Integration`;
        }
    }
    
    return `For ${topic}, create a comprehensive roadmap with real, specific topics that are actually used in ${topic} development.`;
}

/**
 * Parse Gemini response and extract JSON
 */
function parseGeminiResponse(text, topic) {
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
                model: 'gemini-1.5-flash',
                topic: topic
            }
        };
        
    } catch (error) {
        console.error('Failed to parse Gemini response:', error);
        throw new Error('Invalid response from AI');
    }
}

/**
 * Fallback roadmap with SPECIFIC topics (no generic names)
 */
function getFallbackRoadmap(topic, difficulty, depth) {
    console.log('📝 Using fallback roadmap for:', topic);
    
    // Specific topics based on actual technology
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
    
    // Default topics for any technology
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
    
    // Get tech-specific topics or fallback to defaults
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

export default { generateRoadmapWithGemini, testGeminiConnection };