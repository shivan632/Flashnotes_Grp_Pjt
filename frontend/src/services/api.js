// frontend/src/services/api.js
// API service for communicating with backend

// Hardcode the URL since live-server doesn't support import.meta.env
const API_URL = 'https://flashnotes-grp-pjt.onrender.com';

// Generic fetch wrapper with error handling
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

// History endpoints
export const historyAPI = {
    getAll: () => fetchAPI('/history'),
    
    add: (topic) => fetchAPI('/history', {
        method: 'POST',
        body: JSON.stringify({ topic })
    }),
    
    clear: () => fetchAPI('/history', {
        method: 'DELETE'
    })
};

// User endpoints
export const userAPI = {
    getProfile: () => fetchAPI('/user/profile'),
    
    updateProfile: (data) => fetchAPI('/user/profile', {
        method: 'PUT',
        body: JSON.stringify(data)
    })
};

export default fetchAPI;