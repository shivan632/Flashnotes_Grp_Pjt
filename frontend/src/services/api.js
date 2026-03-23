// frontend/src/services/api.js
// Vanilla JavaScript - Production Ready

// Get API URL from window (set in index.html) or use default
const API_URL = (typeof window !== 'undefined' && window.API_URL) 
    ? window.API_URL 
    : (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? 'http://localhost:10000/api'
        : 'https://flashnotes-backend.onrender.com/api';

console.log('🔧 API_URL configured:', API_URL);

// Helper function for API calls
async function apiCall(url, options = {}) {
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || data.message || 'API request failed');
        }
        
        return data;
    } catch (error) {
        console.error(`API Error (${url}):`, error);
        throw error;
    }
}

// ============= AUTH API =============
export const authAPI = {
    register: async (userData) => {
        return apiCall(`${API_URL}/auth/register`, {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    },

    login: async (email, password) => {
    console.log('Sending login request:', { email, passwordLength: password?.length });
    
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    console.log('Login response:', data);
    
    if (!response.ok) {
        throw new Error(data.error || data.message || 'Login failed');
    }
    return data;
},

    verifyOTP: async (email, otp) => {
        return apiCall(`${API_URL}/auth/verify-otp`, {
            method: 'POST',
            body: JSON.stringify({ email, otp }),
        });
    },

    resendOTP: async (email) => {
    try {
        console.log('📡 API call: resendOTP for', email);
        
        const response = await fetch(`${API_URL}/auth/resend-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });
        
        const data = await response.json();
        console.log('📡 API response:', data);
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to resend OTP');
        }
        
        return data;
    } catch (error) {
        console.error('❌ Resend OTP API error:', error);
        throw error;
    }
},

    forgotPassword: async (email) => {
        return apiCall(`${API_URL}/auth/forgot-password`, {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
    },

    resetPassword: async (token, newPassword) => {
        return apiCall(`${API_URL}/auth/reset-password`, {
            method: 'POST',
            body: JSON.stringify({ token, newPassword }),
        });
    },

    logout: async (token) => {
        return apiCall(`${API_URL}/auth/logout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    }
};

// ============= NOTES API =============
export const notesAPI = {
    saveNote: async (note) => {
        const token = localStorage.getItem('token');
        return apiCall(`${API_URL}/notes/save`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(note),
        });
    },

    getNotes: async () => {
        const token = localStorage.getItem('token');
        return apiCall(`${API_URL}/notes`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    },

    deleteNote: async (noteId) => {
        const token = localStorage.getItem('token');
        return apiCall(`${API_URL}/notes/${noteId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    }
};

// ============= HISTORY API =============
export const historyAPI = {
    addHistory: async (historyItem) => {
        const token = localStorage.getItem('token');
        return apiCall(`${API_URL}/history/add`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(historyItem),
        });
    },

    getHistory: async () => {
        const token = localStorage.getItem('token');
        return apiCall(`${API_URL}/history`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    },

    clearHistory: async () => {
        const token = localStorage.getItem('token');
        return apiCall(`${API_URL}/history/clear`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    }
};

// ============= QUIZ API =============
export const quizAPI = {
    getQuiz: async (topic, count = 10) => {
        const token = localStorage.getItem('token');
        return apiCall(`${API_URL}/quiz/generate?topic=${encodeURIComponent(topic)}&count=${count}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    },

    submitQuiz: async (quizId, answers, score) => {
        const token = localStorage.getItem('token');
        return apiCall(`${API_URL}/quiz/submit`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ quizId, answers, score }),
        });
    }
};

// Export default
export default { authAPI, notesAPI, historyAPI, quizAPI };