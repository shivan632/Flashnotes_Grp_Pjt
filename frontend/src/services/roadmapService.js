// frontend/src/services/roadmapService.js
// Roadmap API service for backend communication

const API_URL = window.API_URL || 'http://localhost:10000/api';

// Helper function for API calls
async function fetchAPI(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.message || 'API request failed');
    }
    
    return data;
}

/**
 * Generate a new roadmap
 * @param {string} topic - Topic name
 * @param {string} difficulty - beginner, intermediate, advanced
 * @param {number} depth - Depth level (2-5)
 */
export async function generateRoadmap(topic, difficulty = 'beginner', depth = 3) {
    try {
        console.log('🚀 Generating roadmap:', { topic, difficulty, depth });
        
        const data = await fetchAPI('/roadmap/generate', {
            method: 'POST',
            body: JSON.stringify({ topic, difficulty, depth })
        });
        
        return data;
        
    } catch (error) {
        console.error('Generate roadmap error:', error);
        throw error;
    }
}

/**
 * Get user's all roadmaps
 * @param {number} limit - Number of roadmaps per page
 * @param {number} offset - Pagination offset
 */
export async function getUserRoadmaps(limit = 20, offset = 0) {
    try {
        const data = await fetchAPI(`/roadmap/user/all?limit=${limit}&offset=${offset}`);
        return data;
        
    } catch (error) {
        console.error('Get user roadmaps error:', error);
        return { success: false, roadmaps: [], count: 0 };
    }
}

/**
 * Get single roadmap by ID
 * @param {number|string} id - Roadmap ID
 */
export async function getRoadmapById(id) {
    try {
        const data = await fetchAPI(`/roadmap/${id}`);
        return data;
        
    } catch (error) {
        console.error('Get roadmap error:', error);
        throw error;
    }
}

/**
 * Delete roadmap
 * @param {number|string} id - Roadmap ID
 */
export async function deleteRoadmap(id) {
    try {
        const data = await fetchAPI(`/roadmap/${id}`, {
            method: 'DELETE'
        });
        return data;
        
    } catch (error) {
        console.error('Delete roadmap error:', error);
        throw error;
    }
}

/**
 * Save roadmap to collection
 * @param {number|string} id - Roadmap ID
 */
export async function saveRoadmap(id) {
    try {
        const data = await fetchAPI(`/roadmap/${id}/save`, {
            method: 'POST'
        });
        return data;
        
    } catch (error) {
        console.error('Save roadmap error:', error);
        throw error;
    }
}

/**
 * Update user progress on roadmap
 * @param {number|string} id - Roadmap ID
 * @param {number} completed_nodes - Number of completed nodes
 */
export async function updateProgress(id, completed_nodes) {
    try {
        const data = await fetchAPI(`/roadmap/${id}/progress`, {
            method: 'POST',
            body: JSON.stringify({ completed_nodes })
        });
        return data;
        
    } catch (error) {
        console.error('Update progress error:', error);
        throw error;
    }
}

// Export all functions
export default {
    generateRoadmap,
    getUserRoadmaps,
    getRoadmapById,
    deleteRoadmap,
    saveRoadmap,
    updateProgress
};