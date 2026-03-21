// frontend/src/services/aiChat.js
// AI Chat Service - Enhanced with better features

const API_URL = 'https://flashnotes-grp-pjt.onrender.com/api';

// Store conversation history with metadata
let conversationHistory = [];
let sessionId = null;
let totalTokensUsed = 0;

// Initialize session ID
const initSession = () => {
    if (!sessionId) {
        sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    return sessionId;
};

// Save conversation to localStorage
export const saveConversationToLocal = () => {
    try {
        const savedConversations = JSON.parse(localStorage.getItem('aiChatHistory') || '[]');
        const currentConversation = {
            id: sessionId,
            title: conversationHistory[0]?.content?.substring(0, 50) || 'New Conversation',
            messages: conversationHistory,
            timestamp: new Date().toISOString(),
            tokenCount: totalTokensUsed
        };
        
        // Check if conversation already exists
        const existingIndex = savedConversations.findIndex(c => c.id === sessionId);
        if (existingIndex >= 0) {
            savedConversations[existingIndex] = currentConversation;
        } else {
            savedConversations.unshift(currentConversation);
        }
        
        // Keep only last 50 conversations
        while (savedConversations.length > 50) {
            savedConversations.pop();
        }
        
        localStorage.setItem('aiChatHistory', JSON.stringify(savedConversations));
    } catch (error) {
        console.error('Error saving conversation:', error);
    }
};

// Load conversation from localStorage
export const loadConversation = (conversationId) => {
    try {
        const savedConversations = JSON.parse(localStorage.getItem('aiChatHistory') || '[]');
        const conversation = savedConversations.find(c => c.id === conversationId);
        if (conversation) {
            conversationHistory = conversation.messages;
            sessionId = conversation.id;
            totalTokensUsed = conversation.tokenCount || 0;
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error loading conversation:', error);
        return false;
    }
};

// Get all saved conversations
export const getSavedConversations = () => {
    try {
        return JSON.parse(localStorage.getItem('aiChatHistory') || '[]');
    } catch (error) {
        console.error('Error getting conversations:', error);
        return [];
    }
};

// Delete a conversation
export const deleteConversation = (conversationId) => {
    try {
        const savedConversations = JSON.parse(localStorage.getItem('aiChatHistory') || '[]');
        const filtered = savedConversations.filter(c => c.id !== conversationId);
        localStorage.setItem('aiChatHistory', JSON.stringify(filtered));
        
        if (sessionId === conversationId) {
            clearConversation();
        }
        return true;
    } catch (error) {
        console.error('Error deleting conversation:', error);
        return false;
    }
};

// Send message to AI with enhanced features
export async function sendAIMessage(message, options = {}) {
    const {
        context = '',
        temperature = 0.7,
        maxTokens = 1000,
        includeHistory = true
    } = options;
    
    try {
        const token = localStorage.getItem('authToken');
        
        if (!token) {
            throw new Error('Not authenticated');
        }
        
        // Initialize session if needed
        initSession();
        
        // Get current topic from dashboard
        const topicInput = document.getElementById('topicInput');
        const currentTopic = topicInput?.value || context || 'general';
        
        // Prepare request body
        const requestBody = {
            message: message,
            context: currentTopic,
            temperature: temperature,
            maxTokens: maxTokens,
            conversationHistory: includeHistory ? conversationHistory : []
        };
        
        console.log('🤖 Sending message to AI:', { message, currentTopic });
        
        const response = await fetch(`${API_URL}/ai/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(requestBody)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Failed to get AI response');
        }
        
        // Add to conversation history
        conversationHistory.push(
            { role: 'user', content: message, timestamp: new Date().toISOString() },
            { role: 'assistant', content: data.message, timestamp: new Date().toISOString() }
        );
        
        // Update token usage
        if (data.usage) {
            totalTokensUsed += data.usage.total_tokens || 0;
        }
        
        // Keep history manageable (last 30 messages for better context)
        if (conversationHistory.length > 30) {
            conversationHistory = conversationHistory.slice(-30);
        }
        
        // Save conversation to localStorage
        saveConversationToLocal();
        
        return {
            success: true,
            message: data.message,
            usage: data.usage,
            conversationId: sessionId,
            tokenCount: totalTokensUsed
        };
        
    } catch (error) {
        console.error('AI Chat error:', error);
        
        // Provide helpful error messages
        let errorMessage = error.message || 'Failed to get response';
        if (error.message.includes('429')) {
            errorMessage = 'Rate limit exceeded. Please wait a moment before sending more messages.';
        } else if (error.message.includes('401')) {
            errorMessage = 'Session expired. Please log in again.';
        } else if (error.message.includes('503')) {
            errorMessage = 'AI service temporarily unavailable. Please try again later.';
        }
        
        return {
            success: false,
            message: errorMessage,
            error: error.message
        };
    }
}

// Clear conversation history
export function clearConversation() {
    conversationHistory = [];
    sessionId = initSession();
    totalTokensUsed = 0;
    saveConversationToLocal();
}

// Get conversation history with metadata
export function getConversationHistory() {
    return {
        messages: [...conversationHistory],
        sessionId: sessionId,
        tokenCount: totalTokensUsed,
        messageCount: conversationHistory.length
    };
}

// Get conversation summary
export function getConversationSummary() {
    if (conversationHistory.length === 0) {
        return null;
    }
    
    const userMessages = conversationHistory.filter(m => m.role === 'user');
    const lastMessage = conversationHistory[conversationHistory.length - 1];
    
    return {
        totalMessages: conversationHistory.length,
        userMessages: userMessages.length,
        assistantMessages: conversationHistory.length - userMessages.length,
        lastMessageTime: lastMessage?.timestamp || null,
        firstMessageTime: conversationHistory[0]?.timestamp || null,
        tokensUsed: totalTokensUsed
    };
}

// Set conversation context (for starting new topics)
export function setConversationContext(context) {
    if (context) {
        conversationHistory.unshift({
            role: 'system',
            content: `Current context: ${context}`,
            timestamp: new Date().toISOString()
        });
    }
}

// Export conversation as JSON
export function exportConversation() {
    const exportData = {
        sessionId: sessionId,
        exportedAt: new Date().toISOString(),
        messages: conversationHistory,
        tokenCount: totalTokensUsed,
        version: '1.0'
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `flashnotes-chat-${sessionId}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

// Import conversation from JSON
export function importConversation(jsonData) {
    try {
        const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
        
        if (data.messages && Array.isArray(data.messages)) {
            conversationHistory = data.messages;
            sessionId = data.sessionId || initSession();
            totalTokensUsed = data.tokenCount || 0;
            saveConversationToLocal();
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error importing conversation:', error);
        return false;
    }
}

// Get suggested prompts based on current topic
export async function getSuggestedPrompts(topic) {
    const suggestions = [
        `Explain ${topic} in simple terms`,
        `What are the key concepts of ${topic}?`,
        `Give me examples of ${topic} in real life`,
        `What are common mistakes when learning ${topic}?`,
        `How does ${topic} relate to other topics?`,
        `What are the best resources to learn ${topic}?`,
        `Can you create a study plan for ${topic}?`,
        `What are the career opportunities in ${topic}?`
    ];
    
    return suggestions;
}

// Retry last failed message
export async function retryLastMessage() {
    const lastUserMessage = [...conversationHistory].reverse().find(m => m.role === 'user');
    if (lastUserMessage) {
        // Remove the failed assistant response if exists
        if (conversationHistory.length > 0 && conversationHistory[conversationHistory.length - 1].role === 'assistant') {
            conversationHistory.pop();
        }
        return await sendAIMessage(lastUserMessage.content);
    }
    return null;
}

// Rate the AI response
export function rateResponse(messageIndex, rating) {
    if (conversationHistory[messageIndex] && conversationHistory[messageIndex].role === 'assistant') {
        conversationHistory[messageIndex].rating = rating;
        saveConversationToLocal();
        return true;
    }
    return false;
}

// Get typing speed suggestions
export function getTypingSuggestions(currentInput) {
    if (!currentInput || currentInput.length < 3) return [];
    
    const words = currentInput.toLowerCase().split(' ');
    const lastWord = words[words.length - 1];
    
    const suggestions = [
        'explain',
        'what is',
        'how to',
        'example of',
        'difference between',
        'why is',
        'when to use',
        'best practices for'
    ];
    
    return suggestions.filter(s => s.startsWith(lastWord) || s.includes(lastWord));
}

// Analyze conversation sentiment
export function analyzeConversation() {
    const positiveWords = ['good', 'great', 'excellent', 'helpful', 'thanks', 'understand', 'clear'];
    const negativeWords = ['bad', 'wrong', 'confused', 'unclear', 'difficult', 'error', 'not working'];
    
    let positiveCount = 0;
    let negativeCount = 0;
    
    conversationHistory.forEach(message => {
        const content = message.content.toLowerCase();
        positiveWords.forEach(word => {
            if (content.includes(word)) positiveCount++;
        });
        negativeWords.forEach(word => {
            if (content.includes(word)) negativeCount++;
        });
    });
    
    const total = positiveCount + negativeCount;
    const sentiment = total > 0 ? (positiveCount / total) * 100 : 50;
    
    return {
        sentiment: sentiment > 60 ? 'positive' : sentiment < 40 ? 'negative' : 'neutral',
        confidence: total > 10 ? 'high' : total > 5 ? 'medium' : 'low',
        positiveCount,
        negativeCount,
        score: sentiment
    };
}