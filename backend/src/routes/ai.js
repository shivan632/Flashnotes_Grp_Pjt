// backend/src/routes/ai.js
import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Initialize Gemini with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Chat with Gemini - USING WORKING MODEL gemini-2.5-flash
router.post('/chat', authenticateToken, async (req, res) => {
    try {
        const { message, context, history = [] } = req.body;

        if (!message) {
            return res.status(400).json({ 
                success: false, 
                message: 'Message is required' 
            });
        }

        console.log('📝 AI Chat Request:', { message, context });

        // Use the working model from your test
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash", // Confirmed working!
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1000,
                topP: 0.8,
                topK: 40
            }
        });

        // Build conversation history for context
        let historyText = '';
        if (history && history.length > 0) {
            historyText = '\nPrevious conversation:\n';
            history.forEach(msg => {
                const role = msg.role === 'user' ? 'User' : 'Assistant';
                historyText += `${role}: ${msg.content}\n`;
            });
        }

        // Create prompt with context
        const prompt = `You are a helpful AI learning assistant for Flashnotes, an educational platform.

Current topic being studied: ${context || 'general'}
${historyText}

User's question: ${message}

Instructions:
- Provide clear, accurate, and educational responses
- Keep explanations concise but thorough
- Use examples when helpful
- If you don't know something, say so honestly
- Format your response for easy reading

Your response:`;

        console.log('🤖 Sending request to Gemini...');
        
        // Generate response
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log('✅ Gemini response received');

        res.json({
            success: true,
            message: text,
            model: "gemini-2.5-flash"
        });

    } catch (error) {
        console.error('❌ Gemini API error:', error.message);
        
        // Handle specific error types
        if (error.message.includes('API key')) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid Gemini API key. Please check your configuration.' 
            });
        }
        
        if (error.message.includes('quota') || error.message.includes('rate limit')) {
            return res.status(429).json({ 
                success: false, 
                message: 'API quota exceeded. Please try again later.' 
            });
        }
        
        res.status(500).json({ 
            success: false, 
            message: 'Failed to get AI response. Please try again.' 
        });
    }
});

// Simple test endpoint
router.get('/test', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Gemini API route is working',
        model: 'gemini-2.5-flash',
        apiKeyPresent: !!process.env.GEMINI_API_KEY,
        timestamp: new Date().toISOString()
    });
});

// Models info endpoint
router.get('/models', (req, res) => {
    res.json({
        success: true,
        currentModel: 'gemini-2.5-flash',
        status: 'working',
        note: 'Tested and confirmed working on March 2026'
    });
});

export default router;