// frontend/src/services/api.js
// API service for communicating with backend

const API_URL = 'https://flashnotes-grp-pjt.onrender.com/api';

// Generic fetch wrapper
async function fetchAPI(endpoint, options = {}) {
    const token = localStorage.getItem('authToken');
    
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
    
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers: {
                ...headers,
                ...options.headers
            }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'API request failed');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Auth endpoints
export const authAPI = {
    register: (userData) => fetchAPI('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
    }),
    
    login: (credentials) => fetchAPI('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
    }),
    
    verifyOTP: (email, otp) => fetchAPI('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ email, otp })
    }),
    
    resendOTP: (email) => fetchAPI('/auth/resend-otp', {
        method: 'POST',
        body: JSON.stringify({ email })
    }),
    
    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
    }
};

// Notes endpoints
export const notesAPI = {
    getAll: () => fetchAPI('/notes'),
    
    getById: (id) => fetchAPI(`/notes/${id}`),
    
    save: (note) => fetchAPI('/notes', {
        method: 'POST',
        body: JSON.stringify(note)
    }),
    
    update: (id, note) => fetchAPI(`/notes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(note)
    }),
    
    delete: (id) => fetchAPI(`/notes/${id}`, {
        method: 'DELETE'
    })
};

// History endpoints - ADD THIS
export const historyAPI = {
    getAll: () => fetchAPI('/history'),
    
    add: (topic) => fetchAPI('/history', {
        method: 'POST',
        body: JSON.stringify({ topic })
    }),
    
    clear: () => fetchAPI('/history', {
        method: 'DELETE'
    }),
    
    delete: (id) => fetchAPI(`/history/${id}`, {
        method: 'DELETE'
    })
};

// Quiz endpoints - ADD THIS
export const quizAPI = {
    getAll: () => fetchAPI('/quiz'),
    
    getById: (id) => fetchAPI(`/quiz/${id}`),
    
    getQuestions: (quizId) => fetchAPI(`/quiz/${quizId}/questions`),
    
    start: (quizId) => fetchAPI(`/quiz/${quizId}/start`, {
        method: 'POST'
    }),
    
    submit: (quizId, attemptId, answers, timeTakenSeconds) => fetchAPI(`/quiz/${quizId}/submit`, {
        method: 'POST',
        body: JSON.stringify({ attemptId, answers, timeTakenSeconds })
    }),
    
    getAttempts: () => fetchAPI('/quiz/attempts/all'),
    
    getAttemptById: (attemptId) => fetchAPI(`/quiz/attempt/${attemptId}`)
};

// Score endpoints - ADD THIS
export const scoreAPI = {
    getUserScores: () => fetchAPI('/score'),
    
    getLeaderboard: (period = 'all', limit = 10) => fetchAPI(`/score/leaderboard?period=${period}&limit=${limit}`),
    
    getAchievements: () => fetchAPI('/score/achievements'),
    
    getStats: () => fetchAPI('/score/stats')
};

// AI endpoints - ADD THIS
export const aiAPI = {
    generateQA: (topic) => fetchAPI('/ai/generate', {
        method: 'POST',
        body: JSON.stringify({ topic })
    }),
    
    chat: (message, context, history) => fetchAPI('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ message, context, history })
    }),
    
    suggest: (topic) => fetchAPI('/ai/suggest', {
        method: 'POST',
        body: JSON.stringify({ topic })
    })
};

// User endpoints
export const userAPI = {
    getProfile: () => fetchAPI('/user/profile'),
    
    updateProfile: (data) => fetchAPI('/user/profile', {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    
    getStats: () => fetchAPI('/user/stats')
};

export default fetchAPI;