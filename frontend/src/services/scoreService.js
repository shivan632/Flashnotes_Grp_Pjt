// frontend/src/services/scoreService.js
// Score API service

const API_URL = 'http://localhost:5000/api';

// Get auth token
const getToken = () => localStorage.getItem('authToken');

// Generic fetch wrapper
async function fetchAPI(endpoint, options = {}) {
    const token = getToken();
    
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
        console.error('Score API Error:', error);
        throw error;
    }
}

// Get user scores and statistics
export async function getUserScores() {
    try {
        const data = await fetchAPI('/score');
        return {
            stats: data.stats || {},
            recentAttempts: data.recentAttempts || []
        };
    } catch (error) {
        console.error('Error fetching scores:', error);
        return { stats: {}, recentAttempts: [] };
    }
}

// Get leaderboard
export async function getLeaderboard(period = 'all', limit = 10) {
    try {
        const data = await fetchAPI(`/score/leaderboard?period=${period}&limit=${limit}`);
        return data.leaderboard || [];
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return [];
    }
}

// Get user achievements
export async function getUserAchievements() {
    try {
        const data = await fetchAPI('/score/achievements');
        return {
            achievements: data.achievements || [],
            totalEarned: data.totalEarned || 0,
            totalAvailable: data.totalAvailable || 0
        };
    } catch (error) {
        console.error('Error fetching achievements:', error);
        return { achievements: [], totalEarned: 0, totalAvailable: 0 };
    }
}

// Get quick stats for dashboard
export async function getQuickStats() {
    try {
        const data = await fetchAPI('/score/stats');
        return data.stats || {};
    } catch (error) {
        console.error('Error fetching stats:', error);
        return {};
    }
}