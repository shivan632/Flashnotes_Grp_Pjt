// backend/src/controllers/historyController.js
import { supabase } from '../config/supabase.js';

// Get search history for a user
export const getHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        
        console.log('📊 Fetching history for user:', userId);
        
        const { data: history, error } = await supabase
            .from('search_history')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(20);
        
        if (error) {
            console.error('❌ Supabase error:', error);
            throw error;
        }
        
        console.log(`✅ Found ${history?.length || 0} history items`);
        
        // Transform to frontend format
        const formattedHistory = history.map(item => ({
            id: item.id,
            topic: item.topic,
            searchedAt: item.created_at
        }));
        
        res.json({
            success: true,
            history: formattedHistory
        });
        
    } catch (error) {
        console.error('❌ Get history error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch history'
        });
    }
};

// Add to search history
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
        
        console.log(`📝 Adding to history: user=${userId}, topic=${topic}`);
        
        // First, check if this topic already exists in history
        const { data: existing } = await supabase
            .from('search_history')
            .select('id')
            .eq('user_id', userId)
            .eq('topic', topic);
        
        // If exists, delete it (to move it to top later)
        if (existing && existing.length > 0) {
            await supabase
                .from('search_history')
                .delete()
                .eq('user_id', userId)
                .eq('topic', topic);
            console.log(`🗑️ Removed existing duplicate: ${topic}`);
        }
        
        // Insert new history entry
        const { data: history, error } = await supabase
            .from('search_history')
            .insert([{
                user_id: userId,
                topic,
                created_at: new Date().toISOString()
            }])
            .select()
            .single();
        
        if (error) throw error;
        
        // Keep only last 20 searches
        const { data: allHistory } = await supabase
            .from('search_history')
            .select('id')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        
        if (allHistory && allHistory.length > 20) {
            const idsToDelete = allHistory.slice(20).map(item => item.id);
            await supabase
                .from('search_history')
                .delete()
                .in('id', idsToDelete);
            console.log(`🧹 Cleaned up old history, kept last 20`);
        }
        
        res.status(201).json({
            success: true,
            message: 'Added to history',
            history: {
                id: history.id,
                topic: history.topic,
                searchedAt: history.created_at
            }
        });
        
    } catch (error) {
        console.error('❌ Add to history error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add to history'
        });
    }
};

// Clear all history
export const clearHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        
        console.log(`🗑️ Clearing all history for user: ${userId}`);
        
        const { error } = await supabase
            .from('search_history')
            .delete()
            .eq('user_id', userId);
        
        if (error) throw error;
        
        res.json({
            success: true,
            message: 'History cleared successfully'
        });
        
    } catch (error) {
        console.error('❌ Clear history error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to clear history'
        });
    }
};

// Delete single history item
export const deleteHistoryItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const historyId = req.params.id;
        
        console.log(`🗑️ Deleting history item ${historyId} for user ${userId}`);
        
        // Check if history item exists and belongs to user
        const { data: existing, error: checkError } = await supabase
            .from('search_history')
            .select('id')
            .eq('id', historyId)
            .eq('user_id', userId)
            .single();
        
        if (checkError || !existing) {
            return res.status(404).json({
                success: false,
                message: 'History item not found'
            });
        }
        
        // Delete history item
        const { error } = await supabase
            .from('search_history')
            .delete()
            .eq('id', historyId)
            .eq('user_id', userId);
        
        if (error) throw error;
        
        res.json({
            success: true,
            message: 'History item deleted successfully'
        });
        
    } catch (error) {
        console.error('❌ Delete history item error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete history item'
        });
    }
};