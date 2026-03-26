// frontend/src/services/api.js
// Vanilla JavaScript - Production Ready

// Get API URL from window (set in index.html) or use default
const API_URL = (typeof window !== 'undefined' && window.API_URL) 
    ? window.API_URL 
    : (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? 'http://localhost:10000/api'
        : 'https://flashnotes-backend.onrender.com/api';

console.log('🔧 API_URL configured:', API_URL);

// Helper function for API calls with retry logic for rate limiting
async function apiCall(url, options = {}, retries = 3, delay = 1000) {
    let lastError = null;
    
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
            });
            
            // Handle rate limiting (429)
            if (response.status === 429) {
                const waitTime = delay * attempt;
                console.warn(`⚠️ Rate limited (429) on attempt ${attempt}/${retries}. Waiting ${waitTime}ms...`);
                
                if (attempt === retries) {
                    throw new Error('Too many requests. Please try again in a few minutes.');
                }
                
                await new Promise(resolve => setTimeout(resolve, waitTime));
                continue;
            }
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || data.message || 'API request failed');
            }
            
            return data;
            
        } catch (error) {
            lastError = error;
            console.error(`API Error (${url}) attempt ${attempt}/${retries}:`, error.message);
            
            // Don't retry on non-rate-limit errors for certain endpoints
            if (attempt === retries || error.message.includes('Too many requests')) {
                throw error;
            }
            
            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    
    throw lastError;
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
        }, 2, 1000); // 2 retries, 1 second delay
    },

    getNotes: async () => {
        const token = localStorage.getItem('token');
        return apiCall(`${API_URL}/notes`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        }, 3, 1500); // 3 retries, 1.5 second delay
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
        }, 3, 1500);
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

// ============= SCORE API =============
export const scoreAPI = {
    getUserScores: async () => {
        const token = localStorage.getItem('token');
        return apiCall(`${API_URL}/score`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        }, 3, 1500);
    },

    getUserStats: async () => {
        const token = localStorage.getItem('token');
        return apiCall(`${API_URL}/score/stats`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        }, 3, 1500);
    },

    getLeaderboard: async (period = 'all', limit = 10) => {
        const token = localStorage.getItem('token');
        return apiCall(`${API_URL}/score/leaderboard?period=${period}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        }, 2, 1000);
    },

    getAchievements: async () => {
        const token = localStorage.getItem('token');
        return apiCall(`${API_URL}/score/achievements`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        }, 2, 1000);
    }
};

// Export default
export default { authAPI, notesAPI, historyAPI, quizAPI, scoreAPI };