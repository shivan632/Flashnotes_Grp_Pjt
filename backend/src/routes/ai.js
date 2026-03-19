// backend/src/routes/ai.js
import express from 'express';
import axios from 'axios';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// DeepSeek API configuration
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

// Chat with DeepSeek
router.post('/chat', authenticateToken, async (req, res) => {
    try {
        const { message, conversationHistory = [] } = req.body;
        const userId = req.user.id;

        if (!message) {
            return res.status(400).json({ 
                success: false, 
                message: 'Message is required' 
            });
        }

        // Prepare conversation history
        const messages = [
            {
                role: 'system',
                content: 'You are a helpful AI learning assistant for Flashnotes. Help users understand topics better, provide examples, and explain concepts clearly.'
            },
            ...conversationHistory,
            { role: 'user', content: message }
        ];

        // Call DeepSeek API
        const response = await axios.post(
            DEEPSEEK_API_URL,
            {
                model: 'deepseek-chat', // or 'deepseek-reasoner' for reasoning mode
                messages: messages,
                temperature: 0.7,
                max_tokens: 2000,
                stream: false
            },
            {
                headers: {
                    'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                timeout: 30000 // 30 second timeout
            }
        );

        // Extract the AI response
        const aiResponse = response.data.choices[0].message.content;
        const tokenUsage = response.data.usage;

        // Return response with token usage (for monitoring)
        res.json({
            success: true,
            message: aiResponse,
            usage: tokenUsage
        });

    } catch (error) {
        console.error('DeepSeek API error:', error.response?.data || error.message);
        
        // Handle different error types
        if (error.response) {
            const status = error.response.status;
            if (status === 401) {
                return res.status(500).json({ 
                    success: false, 
                    message: 'API authentication failed' 
                });
            } else if (status === 429) {
                return res.status(429).json({ 
                    success: false, 
                    message: 'Rate limit exceeded. Please try again later.' 
                });
            }
        }
        
        res.status(500).json({ 
            success: false, 
            message: 'Failed to get AI response' 
        });
    }
});

// Get available models (optional)
router.get('/models', authenticateToken, async (req, res) => {
    try {
        const response = await axios.get('https://api.deepseek.com/v1/models', {
            headers: {
                'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch models' });
    }
});

export default router;