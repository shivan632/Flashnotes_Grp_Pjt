// backend/src/controllers/historyController.js
import { supabase } from '../config/supabase.js';

// Get all history for a user
export const getAllHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const { data: history, error } = await supabase
            .from('history')
            .select('*')
            .eq('user_id', userId)
            .order('searched_at', { ascending: false });
        
        if (error) throw error;
        
        // Transform to frontend format
        const formattedHistory = history.map(item => ({
            id: item.id,
            topic: item.topic,
            searchedAt: item.searched_at
        }));
        
        res.json({
            success: true,
            history: formattedHistory
        });
        
    } catch (error) {
        console.error('Get all history error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch history'
        });
    }
};

// Add to history
export const addToHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const { topic } = req.body;
        
        if (!topic) {
            return res.status(400).json({
                success: false,
                message: 'Topic is required'
            });
        }
        
        // Check if topic already exists in history (optional: update timestamp instead)
        const { data: existing, error: checkError } = await supabase
            .from('history')
            .select('id')
            .eq('user_id', userId)
            .eq('topic', topic)
            .single();
        
        if (existing) {
            // Update existing history entry
            const { data: updated, error: updateError } = await supabase
                .from('history')
                .update({ searched_at: new Date().toISOString() })
                .eq('id', existing.id)
                .select()
                .single();
            
            if (updateError) throw updateError;
            
            return res.json({
                success: true,
                message: 'History updated',
                history: {
                    id: updated.id,
                    topic: updated.topic,
                    searchedAt: updated.searched_at
                }
            });
        }
        
        // Create new history entry
        const { data: history, error } = await supabase
            .from('history')
            .insert([{
                user_id: userId,
                topic,
                searched_at: new Date().toISOString()
            }])
            .select()
            .single();
        
        if (error) throw error;
        
        res.status(201).json({
            success: true,
            message: 'Added to history',
            history: {
                id: history.id,
                topic: history.topic,
                searchedAt: history.searched_at
            }
        });
        
    } catch (error) {
        console.error('Add to history error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add to history'
        });
    }
};

// Delete history entry
export const deleteHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const historyId = req.params.id;
        
        const { error } = await supabase
            .from('history')
            .delete()
            .eq('id', historyId)
            .eq('user_id', userId);
        
        if (error) throw error;
        
        res.json({
            success: true,
            message: 'History entry deleted'
        });
        
    } catch (error) {
        console.error('Delete history error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete history'
        });
    }
};

// Clear all history
export const clearHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const { error } = await supabase
            .from('history')
            .delete()
            .eq('user_id', userId);
        
        if (error) throw error;
        
        res.json({
            success: true,
            message: 'All history cleared'
        });
        
    } catch (error) {
        console.error('Clear history error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to clear history'
        });
    }
};