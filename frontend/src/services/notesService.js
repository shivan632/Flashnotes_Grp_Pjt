// Notes Generator API service

const API_URL = window.API_URL || 'http://localhost:10000/api';

async function fetchAPI(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log('📡 Token added to request');
    } else {
        console.warn('⚠️ No token found');
    }
    
    const url = `${API_URL}${endpoint}`;
    console.log(`📡 Request: ${options.method || 'GET'} ${url}`);
    
    try {
        const response = await fetch(url, {
            ...options,
            headers,
        });
        
        console.log(`📡 Response status: ${response.status}`);
        
        if (!response.ok) {
            if (response.status === 401) {
                console.error('🔒 Unauthorized - redirecting to login');
                localStorage.removeItem('token');
                localStorage.removeItem('isAuthenticated');
                window.location.hash = '#/login';
            }
            const data = await response.json();
            throw new Error(data.message || 'API request failed');
        }
        
        const data = await response.json();
        return data;
        
    } catch (error) {
        console.error('❌ API Error:', error.message);
        throw error;
    }
}

// Generate notes for a topic
export async function generateNotes(topic, difficulty = 'beginner', style = 'detailed') {
    try {
        console.log('📝 Generating notes:', { topic, difficulty, style });
        
        const data = await fetchAPI('/notes-gen/generate', {  // ✅ UPDATED
            method: 'POST',
            body: JSON.stringify({ topic, difficulty, style })
        });
        
        return data;
    } catch (error) {
        console.error('Generate notes error:', error);
        throw error;
    }
}

// Get user's all saved notes
export async function getUserNotes(limit = 20, offset = 0, favorite = false) {
    try {
        let endpoint = `/notes-gen/user/all?limit=${limit}&offset=${offset}`;  // ✅ UPDATED
        if (favorite) {
            endpoint += `&favorite=true`;
        }
        
        console.log('📊 Fetching user notes:', endpoint);
        
        const data = await fetchAPI(endpoint);
        
        console.log('📊 Response:', { 
            success: data.success, 
            notesCount: data.notes?.length,
            total: data.total 
        });
        
        return {
            success: true,
            notes: data.notes || [],
            count: data.count || 0,
            total: data.total || 0
        };
    } catch (error) {
        console.error('Get user notes error:', error);
        return { success: false, notes: [], count: 0, total: 0 };
    }
}

// Get single note by ID
export async function getNoteById(id) {
    try {
        if (!id) {
            throw new Error('Note ID is required');
        }
        
        console.log('📖 Fetching note by ID:', id);
        
        const data = await fetchAPI(`/notes-gen/${id}`);  // ✅ UPDATED
        
        if (!data || !data.note) {
            throw new Error('Note not found in response');
        }
        
        console.log('✅ Note fetched:', data.note.id, data.note.topic);
        
        return {
            success: true,
            note: data.note
        };
    } catch (error) {
        console.error('Get note error:', error);
        return { success: false, error: error.message };
    }
}

// Download notes as markdown file
export async function downloadNotes(id) {
    try {
        const token = localStorage.getItem('token');
        const url = `${API_URL}/notes-gen/${id}/download`;  // ✅ UPDATED
        
        console.log('📥 Downloading notes:', url);
        
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) {
            throw new Error('Download failed');
        }
        
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = 'notes.md';
        if (contentDisposition) {
            const match = contentDisposition.match(/filename="(.+)"/);
            if (match) filename = match[1];
        }
        
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(downloadUrl);
        
        console.log('✅ Download completed:', filename);
        
        return { success: true };
    } catch (error) {
        console.error('Download error:', error);
        return { success: false, error: error.message };
    }
}

// Delete a note
export async function deleteNote(id) {
    try {
        console.log('🗑️ Deleting note:', id);
        
        const data = await fetchAPI(`/notes-gen/${id}`, {   // ✅ UPDATED
            method: 'DELETE' 
        });
        
        console.log('✅ Note deleted:', id);
        
        return { 
            success: true, 
            message: data.message || 'Note deleted successfully' 
        };
    } catch (error) {
        console.error('Delete note error:', error);
        return { success: false, error: error.message };
    }
}

// Toggle favorite status of a note
export async function toggleFavorite(id, isFavorite) {
    try {
        console.log('⭐ Toggling favorite:', id, isFavorite);
        
        const data = await fetchAPI(`/notes-gen/${id}/favorite`, {  // ✅ UPDATED
            method: 'PATCH',
            body: JSON.stringify({ is_favorite: isFavorite })
        });
        
        return { 
            success: true, 
            message: data.message,
            is_favorite: isFavorite
        };
    } catch (error) {
        console.error('Toggle favorite error:', error);
        return { success: false, error: error.message };
    }
}

// Get user notes statistics
export async function getUserNotesStats() {
    try {
        console.log('📊 Fetching notes stats');
        
        const data = await fetchAPI('/notes-gen/stats');  // ✅ UPDATED
        
        return { 
            success: true, 
            stats: data.stats || {
                total_notes: 0,
                favorite_notes: 0,
                total_views: 0,
                fallback_notes: 0
            }
        };
    } catch (error) {
        console.error('Get notes stats error:', error);
        return { 
            success: false, 
            stats: { 
                total_notes: 0, 
                favorite_notes: 0, 
                total_views: 0, 
                fallback_notes: 0 
            }
        };
    }
}

export default {
    generateNotes,
    getUserNotes,
    getNoteById,
    downloadNotes,
    deleteNote,
    toggleFavorite,
    getUserNotesStats
};