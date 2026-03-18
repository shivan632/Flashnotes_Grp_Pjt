// backend/src/controllers/notesController.js
import { supabase } from '../config/supabase.js';

// Get all notes for a user
export const getAllNotes = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const { data: notes, error } = await supabase
            .from('saved_notes')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Transform to frontend format
        const formattedNotes = notes.map(note => ({
            id: note.id,
            topic: note.topic,
            question: note.question,
            answer: note.answer,
            savedAt: note.created_at
        }));
        
        res.json({
            success: true,
            notes: formattedNotes
        });
        
    } catch (error) {
        console.error('Get all notes error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch notes'
        });
    }
};

// Get single note by ID
export const getNoteById = async (req, res) => {
    try {
        const userId = req.user.id;
        const noteId = req.params.id;
        
        const { data: note, error } = await supabase
            .from('saved_notes')
            .select('*')
            .eq('id', noteId)
            .eq('user_id', userId)
            .single();
        
        if (error) {
            if (error.code === 'PGRST116') {
                return res.status(404).json({
                    success: false,
                    message: 'Note not found'
                });
            }
            throw error;
        }
        
        res.json({
            success: true,
            note: {
                id: note.id,
                topic: note.topic,
                question: note.question,
                answer: note.answer,
                savedAt: note.created_at
            }
        });
        
    } catch (error) {
        console.error('Get note by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch note'
        });
    }
};

// Create new note
export const createNote = async (req, res) => {
    try {
        const userId = req.user.id;
        const { topic, question, answer } = req.body;
        
        // Validate input
        if (!topic || !question || !answer) {
            return res.status(400).json({
                success: false,
                message: 'Topic, question, and answer are required'
            });
        }
        
        const { data: note, error } = await supabase
            .from('saved_notes')
            .insert([{
                user_id: userId,
                topic,
                question,
                answer,
                created_at: new Date().toISOString()
            }])
            .select()
            .single();
        
        if (error) throw error;
        
        res.status(201).json({
            success: true,
            message: 'Note saved successfully',
            note: {
                id: note.id,
                topic: note.topic,
                question: note.question,
                answer: note.answer,
                savedAt: note.created_at
            }
        });
        
    } catch (error) {
        console.error('Create note error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to save note'
        });
    }
};

// Update note
export const updateNote = async (req, res) => {
    try {
        const userId = req.user.id;
        const noteId = req.params.id;
        const { topic, question, answer } = req.body;
        
        // Check if note exists and belongs to user
        const { data: existingNote, error: checkError } = await supabase
            .from('saved_notes')
            .select('id')
            .eq('id', noteId)
            .eq('user_id', userId)
            .single();
        
        if (checkError || !existingNote) {
            return res.status(404).json({
                success: false,
                message: 'Note not found'
            });
        }
        
        // Update note
        const { data: note, error } = await supabase
            .from('saved_notes')
            .update({
                topic: topic || existingNote.topic,
                question: question || existingNote.question,
                answer: answer || existingNote.answer,
                updated_at: new Date().toISOString()
            })
            .eq('id', noteId)
            .eq('user_id', userId)
            .select()
            .single();
        
        if (error) throw error;
        
        res.json({
            success: true,
            message: 'Note updated successfully',
            note: {
                id: note.id,
                topic: note.topic,
                question: note.question,
                answer: note.answer,
                savedAt: note.created_at
            }
        });
        
    } catch (error) {
        console.error('Update note error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update note'
        });
    }
};

// Delete note
export const deleteNote = async (req, res) => {
    try {
        const userId = req.user.id;
        const noteId = req.params.id;
        
        // Check if note exists and belongs to user
        const { data: existingNote, error: checkError } = await supabase
            .from('saved_notes')
            .select('id')
            .eq('id', noteId)
            .eq('user_id', userId)
            .single();
        
        if (checkError || !existingNote) {
            return res.status(404).json({
                success: false,
                message: 'Note not found'
            });
        }
        
        // Delete note
        const { error } = await supabase
            .from('saved_notes')
            .delete()
            .eq('id', noteId)
            .eq('user_id', userId);
        
        if (error) throw error;
        
        res.json({
            success: true,
            message: 'Note deleted successfully'
        });
        
    } catch (error) {
        console.error('Delete note error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete note'
        });
    }
};