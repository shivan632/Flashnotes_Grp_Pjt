// frontend/src/services/feedbackService.js

const API_URL = window.API_URL || 'http://localhost:10000/api';

export async function submitFeedback(data) {
    try {
        const response = await fetch(`${API_URL}/feedback`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Failed to submit feedback');
        }
        
        return result;
    } catch (error) {
        console.error('Submit feedback error:', error);
        throw error;
    }
}