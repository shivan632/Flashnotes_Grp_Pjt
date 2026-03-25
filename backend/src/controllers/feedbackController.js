// backend/src/controllers/feedbackController.js
import { supabase } from '../config/supabase.js';

// Submit feedback
export const submitFeedback = async (req, res) => {
    try {
        const { name, email, rating, feedback } = req.body;
        const userId = req.user?.id || null;

        console.log('📝 Feedback submission:', { name, email, rating, userId });

        if (!name || !email || !rating || !feedback) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
        }

        if (feedback.length < 5) {
            return res.status(400).json({
                success: false,
                message: 'Feedback must be at least 5 characters'
            });
        }

        // Check if user already submitted feedback (if logged in)
        let existingFeedback = null;
        if (userId) {
            const { data: existing } = await supabase
                .from('feedback')
                .select('*')
                .eq('user_id', userId)
                .maybeSingle();
            existingFeedback = existing;
        }

        let result;

        if (existingFeedback) {
            // Update existing feedback
            const { data, error } = await supabase
                .from('feedback')
                .update({
                    name: name.trim(),
                    email: email.trim().toLowerCase(),
                    rating: rating,
                    feedback: feedback.trim(),
                    updated_at: new Date().toISOString(),
                    editable: false  // After update, no more edits
                })
                .eq('id', existingFeedback.id)
                .select()
                .single();

            if (error) throw error;
            result = data;
            
            res.json({
                success: true,
                message: 'Feedback updated successfully!',
                feedback: result,
                isUpdate: true
            });
        } else {
            // Create new feedback
            const { data, error } = await supabase
                .from('feedback')
                .insert([{
                    name: name.trim(),
                    email: email.trim().toLowerCase(),
                    rating: rating,
                    feedback: feedback.trim(),
                    user_id: userId,
                    editable: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }])
                .select()
                .single();

            if (error) throw error;
            result = data;
            
            res.status(201).json({
                success: true,
                message: 'Thank you for your feedback!',
                feedback: result,
                isUpdate: false
            });
        }

    } catch (error) {
        console.error('Submit feedback error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get feedbacks with user info
export const getFeedbacks = async (req, res) => {
    try {
        const { limit = 20, offset = 0, userId } = req.query;

        let query = supabase
            .from('feedback')
            .select('*')
            .order('created_at', { ascending: false });

        if (userId) {
            query = query.eq('user_id', userId);
        }

        const { data: feedbacks, error } = await query
            .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

        if (error) throw error;

        const { count, error: countError } = await supabase
            .from('feedback')
            .select('*', { count: 'exact', head: true });

        res.json({
            success: true,
            feedbacks: feedbacks || [],
            total: count || 0,
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

    } catch (error) {
        console.error('Get feedbacks error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get user's own feedback
export const getUserFeedback = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const { data: feedback, error } = await supabase
            .from('feedback')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();

        if (error) throw error;

        res.json({
            success: true,
            feedback: feedback || null
        });

    } catch (error) {
        console.error('Get user feedback error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete feedback (for admin or user)
export const deleteFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        
        // Check if user owns this feedback or is admin
        const { data: feedback } = await supabase
            .from('feedback')
            .select('user_id')
            .eq('id', id)
            .single();

        if (!feedback) {
            return res.status(404).json({
                success: false,
                message: 'Feedback not found'
            });
        }

        if (feedback.user_id !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You can only delete your own feedback'
            });
        }

        const { error } = await supabase
            .from('feedback')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.json({
            success: true,
            message: 'Feedback deleted successfully'
        });

    } catch (error) {
        console.error('Delete feedback error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get feedback stats
export const getFeedbackStats = async (req, res) => {
    try {
        const { data: feedbacks, error } = await supabase
            .from('feedback')
            .select('rating');

        if (error) throw error;

        const total = feedbacks.length;
        const averageRating = total > 0 
            ? feedbacks.reduce((sum, f) => sum + f.rating, 0) / total 
            : 0;
        
        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        feedbacks.forEach(f => { distribution[f.rating]++; });

        res.json({
            success: true,
            stats: {
                total,
                averageRating: parseFloat(averageRating.toFixed(1)),
                distribution
            }
        });

    } catch (error) {
        console.error('Get feedback stats error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};