// frontend/src/services/voiceNotesService.js

// ============= DYNAMIC API URL DETECTION =============
const getApiBaseUrl = () => {
    // Check if we're in production (Vercel)
    const isProduction = window.location.hostname !== 'localhost' && 
                         window.location.hostname !== '127.0.0.1';
    
    if (isProduction) {
        // Use your deployed Render backend URL
        // Make sure this matches your actual Render URL
        return 'https://flashnotes-api.onrender.com/api';
    }
    
    // Local development
    return 'http://localhost:10000/api';
};

const API_BASE_URL = getApiBaseUrl();
console.log('🎤 Voice Notes API URL:', API_BASE_URL);

// ============= HELPER FUNCTION =============
async function fetchAPI(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };
    
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('📡 Fetching:', url);
    
    try {
        const response = await fetch(url, {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...options.headers
            }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'API request failed');
        }
        
        return data;
        
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

// ============= VOICE NOTES CRUD OPERATIONS =============

export async function saveVoiceNote(data) {
    try {
        const result = await fetchAPI('/voice-notes/save', {
            method: 'POST',
            body: JSON.stringify({
                text: data.text,
                source: data.source || 'voice'
            })
        });
        
        return {
            success: true,
            note: result.note,
            message: result.message
        };
    } catch (error) {
        console.error('Save voice note error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

export async function getVoiceNotes(options = {}) {
    try {
        const { limit = 50, offset = 0, favorite = false } = options;
        
        let url = `/voice-notes?limit=${limit}&offset=${offset}`;
        if (favorite) {
            url += `&favorite=${favorite}`;
        }
        
        const result = await fetchAPI(url);
        
        return {
            success: true,
            notes: result.notes || [],
            count: result.count || 0
        };
    } catch (error) {
        console.error('Get voice notes error:', error);
        return {
            success: false,
            notes: [],
            count: 0,
            error: error.message
        };
    }
}

export async function getVoiceNoteById(id) {
    try {
        const result = await fetchAPI(`/voice-notes/${id}`);
        
        return {
            success: true,
            note: result.note
        };
    } catch (error) {
        console.error('Get voice note by ID error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

export async function updateVoiceNote(id, data) {
    try {
        const result = await fetchAPI(`/voice-notes/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                text: data.text
            })
        });
        
        return {
            success: true,
            note: result.note,
            message: result.message
        };
    } catch (error) {
        console.error('Update voice note error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

export async function deleteVoiceNote(id) {
    try {
        const result = await fetchAPI(`/voice-notes/${id}`, {
            method: 'DELETE'
        });
        
        return {
            success: true,
            message: result.message
        };
    } catch (error) {
        console.error('Delete voice note error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

export async function toggleVoiceNoteFavorite(id, isFavorite) {
    try {
        const result = await fetchAPI(`/voice-notes/${id}/favorite`, {
            method: 'PATCH',
            body: JSON.stringify({ is_favorite: isFavorite })
        });
        
        return {
            success: true,
            is_favorite: result.is_favorite,
            message: result.message
        };
    } catch (error) {
        console.error('Toggle favorite error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

export async function getVoiceNotesStats() {
    try {
        const result = await fetchAPI('/voice-notes/stats');
        
        return {
            success: true,
            stats: result.stats || {
                total_notes: 0,
                favorite_notes: 0,
                total_words: 0,
                total_chars: 0,
                avg_words_per_note: 0
            }
        };
    } catch (error) {
        console.error('Get voice notes stats error:', error);
        return {
            success: false,
            stats: null,
            error: error.message
        };
    }
}

// ============= HELPER FUNCTIONS =============

export function formatNoteDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

export function truncateText(text, maxLength = 150) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

export function searchVoiceNotes(notes, keyword) {
    if (!keyword || keyword.trim() === '') return notes;
    const searchTerm = keyword.toLowerCase().trim();
    return notes.filter(note => note.text.toLowerCase().includes(searchTerm));
}

export function filterVoiceNotesByFavorite(notes, showFavoritesOnly) {
    if (!showFavoritesOnly) return notes;
    return notes.filter(note => note.is_favorite);
}

export function sortVoiceNotes(notes, sortBy = 'date', order = 'desc') {
    const sorted = [...notes];
    
    switch (sortBy) {
        case 'date':
            sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            break;
        case 'wordCount':
            sorted.sort((a, b) => (b.word_count || 0) - (a.word_count || 0));
            break;
        case 'charCount':
            sorted.sort((a, b) => (b.char_count || 0) - (a.char_count || 0));
            break;
        case 'alphabetical':
            sorted.sort((a, b) => a.text.localeCompare(b.text));
            break;
        default:
            sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    
    if (order === 'asc') {
        return sorted.reverse();
    }
    
    return sorted;
}

// ============= DEFAULT EXPORT =============
export default {
    saveVoiceNote,
    getVoiceNotes,
    getVoiceNoteById,
    updateVoiceNote,
    deleteVoiceNote,
    toggleVoiceNoteFavorite,
    getVoiceNotesStats,
    formatNoteDate,
    truncateText,
    searchVoiceNotes,
    filterVoiceNotesByFavorite,
    sortVoiceNotes
};