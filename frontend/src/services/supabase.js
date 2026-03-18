// frontend/src/services/storage.js
import { notesAPI, historyAPI } from './api.js';

// Save a note
export async function saveNote(topic, question, answer) {
    try {
        const result = await notesAPI.save({ topic, question, answer });
        return result.note;
    } catch (error) {
        console.error('Error saving note:', error);
        throw error;
    }
}

// Get all saved notes
export async function getSavedNotes() {
    try {
        const result = await notesAPI.getAll();
        return result.notes || [];
    } catch (error) {
        console.error('Error fetching notes:', error);
        return [];
    }
}

// Delete a note
export async function deleteNote(noteId) {
    try {
        await notesAPI.delete(noteId);
        return true;
    } catch (error) {
        console.error('Error deleting note:', error);
        throw error;
    }
}

// Add to search history
export async function addToHistory(topic) {
    try {
        const result = await historyAPI.add(topic);
        return result.history;
    } catch (error) {
        console.error('Error adding to history:', error);
        // Don't throw - history is not critical
        return null;
    }
}

// Get search history
export async function getSearchHistory() {
    try {
        const result = await historyAPI.getAll();
        return result.history || [];
    } catch (error) {
        console.error('Error fetching history:', error);
        return [];
    }
}