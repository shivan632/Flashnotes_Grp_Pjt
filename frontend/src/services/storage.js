// frontend/src/services/storage.js
// Local storage fallback when backend is not available
// Also used for caching

import { notesAPI, historyAPI } from './api.js';

const USE_BACKEND = true; // Set to false to use localStorage only

// Local storage keys for fallback
const STORAGE_KEYS = {
    NOTES: 'flashnotes_saved',
    HISTORY: 'flashnotes_history'
};

// ============= SAVED NOTES =============

export async function saveNote(topic, question, answer) {
    if (USE_BACKEND) {
        try {
            const result = await notesAPI.save({ topic, question, answer });
            return result;
        } catch (error) {
            console.warn('Backend save failed, using localStorage:', error);
            // Fallback to localStorage
        }
    }
    
    // Fallback to localStorage
    const notes = getLocalNotes();
    const newNote = {
        id: Date.now(),
        topic,
        question,
        answer,
        savedAt: new Date().toISOString()
    };
    
    notes.unshift(newNote);
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
    return newNote;
}

export async function getSavedNotes() {
    if (USE_BACKEND) {
        try {
            const result = await notesAPI.getAll();
            return result;
        } catch (error) {
            console.warn('Backend fetch failed, using localStorage:', error);
        }
    }
    
    // Fallback to localStorage
    const notes = localStorage.getItem(STORAGE_KEYS.NOTES);
    return notes ? JSON.parse(notes) : [];
}

export async function deleteNote(noteId) {
    if (USE_BACKEND) {
        try {
            await notesAPI.delete(noteId);
            return true;
        } catch (error) {
            console.warn('Backend delete failed, using localStorage:', error);
        }
    }
    
    // Fallback to localStorage
    const notes = getLocalNotes();
    const filteredNotes = notes.filter(note => note.id !== noteId);
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(filteredNotes));
    return true;
}

// ============= SEARCH HISTORY =============

export async function addToHistory(topic) {
    if (USE_BACKEND) {
        try {
            const result = await historyAPI.add(topic);
            return result;
        } catch (error) {
            console.warn('Backend history add failed, using localStorage:', error);
        }
    }
    
    // Fallback to localStorage
    const history = getLocalHistory();
    const newEntry = {
        id: Date.now(),
        topic,
        searchedAt: new Date().toISOString()
    };
    
    history.unshift(newEntry);
    if (history.length > 20) history.pop();
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    return newEntry;
}

export async function getSearchHistory() {
    if (USE_BACKEND) {
        try {
            const result = await historyAPI.getAll();
            return result;
        } catch (error) {
            console.warn('Backend history fetch failed, using localStorage:', error);
        }
    }
    
    // Fallback to localStorage
    const history = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return history ? JSON.parse(history) : [];
}

// Local storage helpers
function getLocalNotes() {
    const notes = localStorage.getItem(STORAGE_KEYS.NOTES);
    return notes ? JSON.parse(notes) : [];
}

function getLocalHistory() {
    const history = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return history ? JSON.parse(history) : [];
}

// Clear all data
export async function clearAllData() {
    if (USE_BACKEND) {
        try {
            await historyAPI.clear();
        } catch (error) {
            console.warn('Backend clear failed:', error);
        }
    }
    
    localStorage.removeItem(STORAGE_KEYS.NOTES);
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
}