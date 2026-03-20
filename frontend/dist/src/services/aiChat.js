// frontend/src/services/aiChat.js
const API_URL = 'https://flashnotes-grp-pjt.onrender.com';

// Store conversation history
let conversationHistory = [];

// Send message to AI
export async function sendAIMessage(message) {
    try {
        const token = localStorage.getItem('authToken');
        
        if (!token) {
            throw new Error('Not authenticated');
        }

        const response = await fetch(`${API_URL}/ai/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                message: message,
                conversationHistory: conversationHistory
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to get AI response');
        }

        // Add to conversation history
        conversationHistory.push(
            { role: 'user', content: message },
            { role: 'assistant', content: data.message }
        );

        // Keep history manageable (last 10 messages)
        if (conversationHistory.length > 20) {
            conversationHistory = conversationHistory.slice(-20);
        }

        return {
            success: true,
            message: data.message,
            usage: data.usage
        };

    } catch (error) {
        console.error('AI Chat error:', error);
        return {
            success: false,
            message: error.message || 'Failed to get response'
        };
    }
}

// Clear conversation history
export function clearConversation() {
    conversationHistory = [];
}

// Get conversation history
export function getConversationHistory() {
    return [...conversationHistory];
}