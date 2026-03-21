// frontend/src/services/storage.js
import { authAPI, notesAPI, historyAPI, quizAPI } from './api.js';
import { showError, showSuccess } from '../components/common/ErrorMessage.js';

// ============= STORAGE KEYS =============
const STORAGE_KEYS = {
    NOTES: 'flashnotes_saved_notes',
    HISTORY: 'flashnotes_search_history',
    PENDING_NOTES: 'flashnotes_pending_notes',
    PENDING_HISTORY: 'flashnotes_pending_history'
};

// ============= HELPER FUNCTIONS =============
function getFromLocalStorage(key, defaultValue = []) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
        console.error(`Error reading ${key} from localStorage:`, error);
        return defaultValue;
    }
}

function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error(`Error saving ${key} to localStorage:`, error);
        return false;
    }
}

// ============= NOTES FUNCTIONS =============

// Save a note
export async function saveNote(note) {
    try {
        const token = localStorage.getItem('token');
        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        
        const newNote = {
            id: Date.now().toString(),
            topic: note.topic,
            question: note.question,
            answer: note.answer,
            savedAt: new Date().toISOString(),
            ...note
        };
        
        if (isAuthenticated && token) {
            // Save to backend
            try {
                const result = await notesAPI.saveNote(newNote);
                if (result && result.success) {
                    showSuccess('Note saved successfully!', 'success');
                    return newNote;
                }
            } catch (error) {
                console.error('Failed to save to backend, saving locally:', error);
                // Fallback to local storage
            }
        }
        
        // Save to local storage
        const notes = getFromLocalStorage(STORAGE_KEYS.NOTES);
        notes.unshift(newNote);
        saveToLocalStorage(STORAGE_KEYS.NOTES, notes);
        
        // Add to pending if offline
        if (isAuthenticated && !navigator.onLine) {
            const pending = getFromLocalStorage(STORAGE_KEYS.PENDING_NOTES);
            pending.push(newNote);
            saveToLocalStorage(STORAGE_KEYS.PENDING_NOTES, pending);
        }
        
        showSuccess('Note saved successfully!', 'success');
        return newNote;
        
    } catch (error) {
        console.error('Error saving note:', error);
        showError('Failed to save note', 'error');
        return null;
    }
}

// Get all saved notes
export async function getSavedNotes() {
    try {
        const token = localStorage.getItem('token');
        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        
        if (isAuthenticated && token) {
            try {
                const result = await notesAPI.getNotes();
                if (result && result.notes) {
                    return result.notes;
                }
            } catch (error) {
                console.error('Failed to fetch notes from backend:', error);
            }
        }
        
        // Return from local storage
        return getFromLocalStorage(STORAGE_KEYS.NOTES);
        
    } catch (error) {
        console.error('Error getting saved notes:', error);
        return [];
    }
}

// Delete a note
export async function deleteNote(noteId) {
    try {
        const token = localStorage.getItem('token');
        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        
        if (isAuthenticated && token) {
            try {
                await notesAPI.deleteNote(noteId);
            } catch (error) {
                console.error('Failed to delete from backend:', error);
            }
        }
        
        // Delete from local storage
        const notes = getFromLocalStorage(STORAGE_KEYS.NOTES);
        const updatedNotes = notes.filter(note => note.id !== noteId);
        saveToLocalStorage(STORAGE_KEYS.NOTES, updatedNotes);
        
        showSuccess('Note deleted successfully!', 'success');
        return true;
        
    } catch (error) {
        console.error('Error deleting note:', error);
        showError('Failed to delete note', 'error');
        return false;
    }
}

// ============= HISTORY FUNCTIONS =============

// Add to search history
export async function addToHistory(topic, result = null) {
    try {
        const token = localStorage.getItem('token');
        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        
        const historyItem = {
            id: Date.now().toString(),
            topic: topic,
            searchedAt: new Date().toISOString(),
            result: result
        };
        
        if (isAuthenticated && token) {
            try {
                const result = await historyAPI.addHistory(historyItem);
                if (result && result.success) {
                    return historyItem;
                }
            } catch (error) {
                console.error('Failed to save history to backend:', error);
            }
        }
        
        // Save to local storage
        const history = getFromLocalStorage(STORAGE_KEYS.HISTORY);
        history.unshift(historyItem);
        // Keep only last 50 items
        if (history.length > 50) history.pop();
        saveToLocalStorage(STORAGE_KEYS.HISTORY, history);
        
        // Add to pending if offline
        if (isAuthenticated && !navigator.onLine) {
            const pending = getFromLocalStorage(STORAGE_KEYS.PENDING_HISTORY);
            pending.push(historyItem);
            saveToLocalStorage(STORAGE_KEYS.PENDING_HISTORY, pending);
        }
        
        return historyItem;
        
    } catch (error) {
        console.error('Error adding to history:', error);
        return null;
    }
}

// Get search history
export async function getSearchHistory() {
    try {
        const token = localStorage.getItem('token');
        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        
        if (isAuthenticated && token) {
            try {
                const result = await historyAPI.getHistory();
                if (result && result.history) {
                    return result.history;
                }
            } catch (error) {
                console.error('Failed to fetch history from backend:', error);
            }
        }
        
        // Return from local storage
        return getFromLocalStorage(STORAGE_KEYS.HISTORY);
        
    } catch (error) {
        console.error('Error getting search history:', error);
        return [];
    }
}

// Clear search history
export async function clearHistory() {
    try {
        const token = localStorage.getItem('token');
        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        
        if (isAuthenticated && token) {
            try {
                await historyAPI.clearHistory();
            } catch (error) {
                console.error('Failed to clear history on backend:', error);
            }
        }
        
        // Clear local storage
        saveToLocalStorage(STORAGE_KEYS.HISTORY, []);
        saveToLocalStorage(STORAGE_KEYS.PENDING_HISTORY, []);
        
        showSuccess('History cleared successfully!', 'success');
        return true;
        
    } catch (error) {
        console.error('Error clearing history:', error);
        showError('Failed to clear history', 'error');
        return false;
    }
}

// ============= SYNC FUNCTIONS =============

// Sync pending data when online
export async function syncPendingData() {
    if (!navigator.onLine) return null;
    
    const token = localStorage.getItem('token');
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    if (!isAuthenticated || !token) return null;
    
    const results = {
        notes: { success: 0, failed: 0 },
        history: { success: 0, failed: 0 }
    };
    
    // Sync pending notes
    const pendingNotes = getFromLocalStorage(STORAGE_KEYS.PENDING_NOTES);
    for (const note of pendingNotes) {
        try {
            await notesAPI.saveNote(note);
            results.notes.success++;
        } catch (error) {
            console.error('Failed to sync note:', error);
            results.notes.failed++;
        }
    }
    saveToLocalStorage(STORAGE_KEYS.PENDING_NOTES, []);
    
    // Sync pending history
    const pendingHistory = getFromLocalStorage(STORAGE_KEYS.PENDING_HISTORY);
    for (const item of pendingHistory) {
        try {
            await historyAPI.addHistory(item);
            results.history.success++;
        } catch (error) {
            console.error('Failed to sync history:', error);
            results.history.failed++;
        }
    }
    saveToLocalStorage(STORAGE_KEYS.PENDING_HISTORY, []);
    
    return results;
}

// ============= EXPORT/IMPORT FUNCTIONS =============

// Export all data
export async function exportData() {
    try {
        const notes = await getSavedNotes();
        const history = await getSearchHistory();
        
        const exportData = {
            version: '1.0',
            exportedAt: new Date().toISOString(),
            notes: notes,
            history: history
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `flashnotes_backup_${new Date().toISOString().slice(0,19).replace(/:/g, '-')}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        showSuccess('Data exported successfully!', 'success');
        return true;
        
    } catch (error) {
        console.error('Error exporting data:', error);
        showError('Failed to export data', 'error');
        return false;
    }
}

// Import data
export async function importData(jsonData) {
    try {
        const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
        
        if (!data.notes || !data.history) {
            throw new Error('Invalid backup file format');
        }
        
        // Save to local storage
        saveToLocalStorage(STORAGE_KEYS.NOTES, data.notes);
        saveToLocalStorage(STORAGE_KEYS.HISTORY, data.history);
        
        showSuccess('Data imported successfully!', 'success');
        return true;
        
    } catch (error) {
        console.error('Error importing data:', error);
        showError('Failed to import data', 'error');
        return false;
    }
}