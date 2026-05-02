// frontend/src/services/achievementService.js
const API_BASE_URL = window.API_URL || 'http://localhost:10000/api';

export async function getUserAchievements() {
    try {
        const token = localStorage.getItem('token');
        
        if (!token) {
            return { success: false, achievements: [], stats: null };
        }
        
        const response = await fetch(`${API_BASE_URL}/achievements`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            return {
                success: true,
                achievements: data.achievements || [],
                stats: data.stats || {
                    total: 0,
                    earned: 0,
                    percentage: 0,
                    total_points: 0
                }
            };
        }
        
        return { success: false, achievements: [], stats: null, error: data.message };
        
    } catch (error) {
        console.error('Get achievements error:', error);
        return { success: false, achievements: [], stats: null, error: error.message };
    }
}

export async function getRecentAchievements() {
    try {
        const token = localStorage.getItem('token');
        
        if (!token) {
            return { success: false, recent: [] };
        }
        
        const response = await fetch(`${API_BASE_URL}/achievements/recent`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            return {
                success: true,
                recent: data.recent || []
            };
        }
        
        return { success: false, recent: [] };
        
    } catch (error) {
        console.error('Get recent achievements error:', error);
        return { success: false, recent: [] };
    }
}

export async function getAchievementProgress(type) {
    try {
        const token = localStorage.getItem('token');
        
        if (!token) {
            return { success: false, achievements: [] };
        }
        
        const response = await fetch(`${API_BASE_URL}/achievements/progress/${type}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            return {
                success: true,
                achievements: data.achievements || []
            };
        }
        
        return { success: false, achievements: [] };
        
    } catch (error) {
        console.error('Get achievement progress error:', error);
        return { success: false, achievements: [] };
    }
}

export default {
    getUserAchievements,
    getRecentAchievements,
    getAchievementProgress
};