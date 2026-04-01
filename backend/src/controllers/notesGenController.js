import { generateNotes } from '../services/notesGeneratorService.js';
import { notesToMarkdown } from '../utils/notesHelpers.js';
import { supabaseAdmin } from '../config/supabase.js';

// Generate new notes
export const generateNotesAPI = async (req, res) => {
    try {
        const { topic, difficulty = 'beginner', style = 'detailed' } = req.body;
        const userId = req.user.id;
        
        if (!topic || topic.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Topic is required'
            });
        }
        
        console.log(`🚀 Generating notes for: ${topic} (${difficulty}, ${style})`);
        
        const result = await generateNotes(topic, difficulty, style);
        
        const notesContent = {
            ...result.notes,
            generated_at: result.generated_at,
            is_fallback: result.is_fallback || false
        };
        
        const { data: savedNote, error } = await supabaseAdmin
            .from('generated_notes')
            .insert({
                user_id: userId,
                topic: topic,
                title: result.notes.title,
                content: notesContent,
                difficulty: difficulty,
                style: style,
                is_fallback: result.is_fallback || false
            })
            .select()
            .single();
        
        if (error) {
            console.error('❌ Save error:', error);
            return res.json({
                success: true,
                notes: result.notes,
                topic: topic,
                difficulty: difficulty,
                is_fallback: result.is_fallback || false,
                saved: false
            });
        }
        
        console.log(`✅ Notes saved with ID: ${savedNote?.id}`);
        
        res.json({
            success: true,
            notes: result.notes,
            savedId: savedNote?.id,
            topic: topic,
            difficulty: difficulty,
            is_fallback: result.is_fallback || false,
            generated_at: result.generated_at
        });
        
    } catch (error) {
        console.error('❌ Generate notes error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to generate notes'
        });
    }
};

// Get user's saved notes
export const getUserNotes = async (req, res) => {
    try {
        const userId = req.user.id;
        const { limit = 20, offset = 0, favorite = false } = req.query;
        
        console.log('📊 Fetching notes for user:', userId);
        
        let query = supabaseAdmin
            .from('generated_notes')
            .select('*')
            .eq('user_id', userId);
        
        if (favorite === 'true') {
            query = query.eq('is_favorite', true);
        }
        
        const { data: notes, error } = await query
            .order('generated_at', { ascending: false })
            .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);
        
        if (error) {
            console.error('❌ Supabase error:', error);
            return res.status(500).json({ 
                success: false, 
                message: 'Database error: ' + error.message
            });
        }
        
        console.log(`✅ Found ${notes?.length || 0} notes`);
        
        const parsedNotes = notes?.map(note => {
            try {
                let content = note.content;
                if (typeof content === 'string') {
                    content = JSON.parse(content);
                }
                return {
                    ...note,
                    content: content,
                    key_concepts_count: content?.key_concepts?.length || 0,
                    code_examples_count: content?.code_examples?.length || 0
                };
            } catch (parseError) {
                console.error('Error parsing note:', note.id, parseError.message);
                return {
                    ...note,
                    content: { overview: 'Error loading content' },
                    key_concepts_count: 0,
                    code_examples_count: 0
                };
            }
        }) || [];
        
        res.json({
            success: true,
            notes: parsedNotes,
            count: parsedNotes.length,
            total: parsedNotes.length
        });
        
    } catch (error) {
        console.error('❌ Get user notes error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch notes: ' + error.message 
        });
    }
};

// Get single note by ID
export const getNoteById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        
        console.log('📖 Fetching note with UUID:', id);
        
        const { data, error } = await supabaseAdmin
            .from('generated_notes')
            .select('*')
            .eq('id', id)
            .eq('user_id', userId);
        
        if (error) {
            console.error('❌ Supabase error:', error);
            return res.status(500).json({ 
                success: false, 
                message: 'Database error: ' + error.message 
            });
        }
        
        if (!data || data.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Note not found' 
            });
        }
        
        const note = data[0];
        console.log('✅ Note found:', note.id);
        
        let parsedContent = note.content;
        if (typeof parsedContent === 'string') {
            try {
                parsedContent = JSON.parse(parsedContent);
            } catch (e) {
                parsedContent = { overview: 'Error loading content' };
            }
        }
        
        res.json({
            success: true,
            note: { ...note, content: parsedContent }
        });
        
    } catch (error) {
        console.error('❌ Get note error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch note: ' + error.message 
        });
    }
};

// Download notes as Markdown
export const downloadNotes = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        
        const { data, error } = await supabaseAdmin
            .from('generated_notes')
            .select('*')
            .eq('id', id)
            .eq('user_id', userId);
        
        if (error || !data || data.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Note not found'
            });
        }
        
        const note = data[0];
        
        let notesContent = note.content;
        if (typeof notesContent === 'string') {
            notesContent = JSON.parse(notesContent);
        }
        
        const markdown = notesToMarkdown(notesContent, note.topic);
        
        res.setHeader('Content-Type', 'text/markdown');
        res.setHeader('Content-Disposition', `attachment; filename="${note.topic.replace(/[^a-z0-9]/gi, '_')}_notes.md"`);
        res.send(markdown);
        
    } catch (error) {
        console.error('❌ Download error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to download notes'
        });
    }
};

// Delete note
export const deleteNote = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        
        console.log('🗑️ Deleting note:', id);
        
        const { error } = await supabaseAdmin
            .from('generated_notes')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);
        
        if (error) {
            console.error('❌ Delete error:', error);
            return res.status(500).json({ 
                success: false, 
                message: 'Failed to delete: ' + error.message 
            });
        }
        
        console.log('✅ Note deleted');
        
        res.json({
            success: true,
            message: 'Note deleted successfully'
        });
        
    } catch (error) {
        console.error('❌ Delete error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete note: ' + error.message
        });
    }
};

// Toggle favorite
export const toggleFavorite = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { is_favorite } = req.body;
        
        const { error } = await supabaseAdmin
            .from('generated_notes')
            .update({ 
                is_favorite: is_favorite,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .eq('user_id', userId);
        
        if (error) throw error;
        
        res.json({
            success: true,
            message: is_favorite ? 'Added to favorites' : 'Removed from favorites'
        });
        
    } catch (error) {
        console.error('❌ Toggle favorite error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update favorite status'
        });
    }
};

// Get user notes statistics
export const getUserNotesStats = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const { data: notes, error } = await supabaseAdmin
            .from('generated_notes')
            .select('*')
            .eq('user_id', userId);
        
        if (error) throw error;
        
        const stats = {
            total_notes: notes?.length || 0,
            favorite_notes: notes?.filter(n => n.is_favorite).length || 0,
            total_views: notes?.reduce((sum, n) => sum + (n.view_count || 0), 0) || 0,
            fallback_notes: notes?.filter(n => n.is_fallback).length || 0
        };
        
        res.json({
            success: true,
            stats: stats
        });
        
    } catch (error) {
        console.error('❌ Get user notes stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch stats'
        });
    }
};