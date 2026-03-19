// frontend/src/services/storage.js - COMPLETE FIXED VERSION
import { notesAPI, historyAPI } from './api.js';

// ============= LOCAL STORAGE FALLBACK =============
const STORAGE_KEYS = {
    NOTES: 'flashnotes_saved',
    HISTORY: 'flashnotes_history'
};

// Get from localStorage (fallback)
function getLocalNotes() {
    const notes = localStorage.getItem(STORAGE_KEYS.NOTES);
    return notes ? JSON.parse(notes) : [];
}

function getLocalHistory() {
    const history = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return history ? JSON.parse(history) : [];
}

// ============= SAVED NOTES =============
export async function getSavedNotes() {
    // Try to get from API first
    try {
        const result = await notesAPI.getAll();
        console.log('API notes response:', result); // Debug log
        if (result && result.notes) {
            return result.notes;
        }
    } catch (error) {
        console.warn('API fetch failed, using localStorage:', error);
    }
    
    // Fallback to localStorage
    return getLocalNotes();
}

export async function saveNote(topic, question, answer) {
    const note = { topic, question, answer, savedAt: new Date().toISOString() };
    
    try {
        const result = await notesAPI.save(note);
        console.log('Save successful:', result);
        return result.note || note;
    } catch (error) {
        console.warn('API save failed, using localStorage:', error);
        
        // Fallback to localStorage
        const notes = getLocalNotes();
        const newNote = {
            id: Date.now(),
            ...note
        };
        notes.unshift(newNote);
        localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
        return newNote;
    }
}

export async function deleteNote(noteId) {
    try {
        await notesAPI.delete(noteId);
        return true;
    } catch (error) {
        console.warn('API delete failed, using localStorage:', error);
        
        // Fallback to localStorage
        const notes = getLocalNotes().filter(n => n.id !== noteId);
        localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
        return true;
    }
}

// ============= SEARCH HISTORY =============
export async function getSearchHistory() {
    try {
        const result = await historyAPI.getAll();
        console.log('API history response:', result); // Debug log
        if (result && result.history) {
            return result.history;
        }
    } catch (error) {
        console.warn('API history fetch failed, using localStorage:', error);
    }
    
    // Fallback to localStorage
    return getLocalHistory();
}

export async function addToHistory(topic) {
    try {
        const result = await historyAPI.add(topic);
        return result;
    } catch (error) {
        console.warn('API history add failed, using localStorage:', error);
        
        // Fallback to localStorage
        const history = getLocalHistory();
        const newEntry = {
            id: Date.now(),
            topic,
            searchedAt: new Date().toISOString()
        };
        history.unshift(newEntry);
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
        return newEntry;
    }
}