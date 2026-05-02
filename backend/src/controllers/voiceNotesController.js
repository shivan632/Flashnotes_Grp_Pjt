// backend/src/controllers/voiceNotesController.js
import { supabaseAdmin } from '../config/supabase.js';
import achievementService from '../services/achievementService.js';

// Save voice note - WITH ACHIEVEMENT CHECK
export const saveVoiceNote = async (req, res) => {
    try {
        const userId = req.user?.id;
        
        console.log('📝 Saving voice note for user:', userId);
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }
        
        const { text, source = 'voice' } = req.body;
        
        if (!text || text.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Text content is required'
            });
        }
        
        const wordCount = text.trim().split(/\s+/).length;
        const charCount = text.length;
        
        const { data, error } = await supabaseAdmin
            .from('voice_notes')
            .insert([{
                user_id: userId,
                text: text.trim(),
                source: source,
                word_count: wordCount,
                char_count: charCount,
                created_at: new Date().toISOString()
            }])
            .select()
            .single();
        
        if (error) {
            console.error('❌ Supabase insert error:', error);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
        
        console.log('✅ Voice note saved with ID:', data.id);
        
        // Check and award achievements
        try {
            const newlyEarned = await achievementService.checkAndAwardAchievements(
                userId,
                'voice_note_saved',
                {
                    text_length: text.length,
                    word_count: wordCount,
                    char_count: charCount
                }
            );
            
            if (newlyEarned && newlyEarned.length > 0) {
                console.log(`🎉 User ${userId} earned ${newlyEarned.length} new achievement(s) from voice note!`);
            }
        } catch (achievementError) {
            console.error('⚠️ Achievement check error (non-critical):', achievementError);
        }
        
        res.status(201).json({
            success: true,
            message: 'Voice note saved successfully',
            note: {
                id: data.id,
                text: data.text,
                source: data.source,
                word_count: data.word_count,
                char_count: data.char_count,
                is_favorite: data.is_favorite,
                created_at: data.created_at
            }
        });
        
    } catch (error) {
        console.error('Save voice note error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to save voice note'
        });
    }
};

// Get all voice notes for a user
export const getVoiceNotes = async (req, res) => {
    try {
        const userId = req.user?.id;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }
        
        const { limit = 50, offset = 0, favorite = false } = req.query;
        
        let query = supabaseAdmin
            .from('voice_notes')
            .select('*')
            .eq('user_id', userId);
        
        if (favorite === 'true') {
            query = query.eq('is_favorite', true);
        }
        
        const { data, error } = await query
            .order('created_at', { ascending: false })
            .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);
        
        if (error) throw error;
        
        res.json({
            success: true,
            notes: data || [],
            count: data?.length || 0
        });
        
    } catch (error) {
        console.error('Get voice notes error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch voice notes'
        });
    }
};

// Get single voice note by ID
export const getVoiceNoteById = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }
        
        const { data, error } = await supabaseAdmin
            .from('voice_notes')
            .select('*')
            .eq('id', id)
            .eq('user_id', userId)
            .single();
        
        if (error) {
            if (error.code === 'PGRST116') {
                return res.status(404).json({
                    success: false,
                    message: 'Voice note not found'
                });
            }
            throw error;
        }
        
        res.json({
            success: true,
            note: data
        });
        
    } catch (error) {
        console.error('Get voice note by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch voice note'
        });
    }
};

// Update voice note
export const updateVoiceNote = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;
        const { text } = req.body;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }
        
        if (!text || text.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Text content is required'
            });
        }
        
        // Check if note exists and belongs to user
        const { data: existing, error: checkError } = await supabaseAdmin
            .from('voice_notes')
            .select('id')
            .eq('id', id)
            .eq('user_id', userId)
            .single();
        
        if (checkError || !existing) {
            return res.status(404).json({
                success: false,
                message: 'Voice note not found'
            });
        }
        
        const wordCount = text.trim().split(/\s+/).length;
        const charCount = text.length;
        
        const { data, error } = await supabaseAdmin
            .from('voice_notes')
            .update({
                text: text.trim(),
                word_count: wordCount,
                char_count: charCount,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .eq('user_id', userId)
            .select()
            .single();
        
        if (error) throw error;
        
        res.json({
            success: true,
            message: 'Voice note updated successfully',
            note: data
        });
        
    } catch (error) {
        console.error('Update voice note error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update voice note'
        });
    }
};

// Delete voice note
export const deleteVoiceNote = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }
        
        const { error } = await supabaseAdmin
            .from('voice_notes')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);
        
        if (error) throw error;
        
        res.json({
            success: true,
            message: 'Voice note deleted successfully'
        });
        
    } catch (error) {
        console.error('Delete voice note error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete voice note'
        });
    }
};

// Toggle favorite status
export const toggleFavorite = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;
        const { is_favorite } = req.body;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }
        
        const { data, error } = await supabaseAdmin
            .from('voice_notes')
            .update({ 
                is_favorite: is_favorite,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .eq('user_id', userId)
            .select()
            .single();
        
        if (error) throw error;
        
        res.json({
            success: true,
            message: is_favorite ? 'Added to favorites' : 'Removed from favorites',
            is_favorite: data.is_favorite
        });
        
    } catch (error) {
        console.error('Toggle favorite error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update favorite status'
        });
    }
};

// Get voice notes statistics
export const getVoiceNotesStats = async (req, res) => {
    try {
        const userId = req.user?.id;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }
        
        const { data: notes, error } = await supabaseAdmin
            .from('voice_notes')
            .select('word_count, char_count, is_favorite, created_at')
            .eq('user_id', userId);
        
        if (error) throw error;
        
        const stats = {
            total_notes: notes?.length || 0,
            favorite_notes: notes?.filter(n => n.is_favorite).length || 0,
            total_words: notes?.reduce((sum, n) => sum + (n.word_count || 0), 0) || 0,
            total_chars: notes?.reduce((sum, n) => sum + (n.char_count || 0), 0) || 0,
            avg_words_per_note: notes?.length ? Math.round(notes.reduce((sum, n) => sum + (n.word_count || 0), 0) / notes.length) : 0
        };
        
        res.json({
            success: true,
            stats: stats
        });
        
    } catch (error) {
        console.error('Get voice notes stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch stats'
        });
    }
};

// Export all functions
export default {
    saveVoiceNote,
    getVoiceNotes,
    getVoiceNoteById,
    updateVoiceNote,
    deleteVoiceNote,
    toggleFavorite,
    getVoiceNotesStats
};