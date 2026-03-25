// backend/src/controllers/profileController.js
import { supabase } from '../config/supabase.js';

// Get user profile
export const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        
        console.log('📝 Fetching profile for user:', userId);
        
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .maybeSingle();  // Use maybeSingle to avoid PGRST116 error
        
        if (error) {
            console.error('Profile fetch error:', error);
            throw error;
        }
        
        // If profile doesn't exist, create default profile
        if (!profile) {
            console.log('📝 Creating default profile for user:', userId);
            
            const { data: newProfile, error: insertError } = await supabase
                .from('profiles')
                .insert([{
                    id: userId,
                    full_name: req.user.name || '',
                    email: req.user.email || '',
                    bio: '',
                    location: '',
                    website: '',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }])
                .select()
                .single();
            
            if (insertError) {
                console.error('Profile creation error:', insertError);
                return res.json({
                    success: true,
                    profile: {
                        id: userId,
                        full_name: req.user.name || '',
                        email: req.user.email || '',
                        bio: '',
                        location: '',
                        website: ''
                    }
                });
            }
            
            return res.json({
                success: true,
                profile: newProfile
            });
        }
        
        res.json({
            success: true,
            profile
        });
        
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
};

// Update user profile
export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { full_name, email, bio, location, website } = req.body;
        
        console.log('📝 Updating profile for user:', userId);
        console.log('   Data:', { full_name, email, bio, location, website });
        
        // Check if profile exists
        const { data: existingProfile, error: checkError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .maybeSingle();
        
        if (checkError && checkError.code !== 'PGRST116') {
            throw checkError;
        }
        
        let result;
        
        if (!existingProfile) {
            // Create new profile
            console.log('📝 Creating new profile');
            result = await supabase
                .from('profiles')
                .insert([{
                    id: userId,
                    full_name: full_name || req.user.name,
                    email: email || req.user.email,
                    bio: bio || '',
                    location: location || '',
                    website: website || '',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }])
                .select()
                .single();
        } else {
            // Update existing profile
            console.log('📝 Updating existing profile');
            result = await supabase
                .from('profiles')
                .update({
                    full_name: full_name !== undefined ? full_name : existingProfile.full_name,
                    email: email !== undefined ? email : existingProfile.email,
                    bio: bio !== undefined ? bio : existingProfile.bio,
                    location: location !== undefined ? location : existingProfile.location,
                    website: website !== undefined ? website : existingProfile.website,
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId)
                .select()
                .single();
        }
        
        if (result.error) {
            console.error('Profile update error:', result.error);
            throw result.error;
        }
        
        // Also update users table name if changed
        if (full_name && full_name !== req.user.name) {
            await supabase
                .from('users')
                .update({ name: full_name, updated_at: new Date().toISOString() })
                .eq('id', userId);
        }
        
        res.json({
            success: true,
            profile: result.data,
            message: 'Profile updated successfully'
        });
        
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
};

// Get user stats
export const getUserStats = async (req, res) => {
    try {
        const userId = req.user.id;
        
        console.log('📊 Fetching stats for user:', userId);
        
        // Get quiz attempts
        const { data: attempts, error: attemptsError } = await supabase
            .from('quiz_attempts')
            .select('*')
            .eq('user_id', userId)
            .eq('status', 'completed');
        
        if (attemptsError) {
            console.error('Attempts fetch error:', attemptsError);
            throw attemptsError;
        }
        
        // Get saved notes count
        const { count: savedNotesCount, error: notesError } = await supabase
            .from('saved_notes')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId);
        
        if (notesError) {
            console.error('Notes count error:', notesError);
        }
        
        const totalQuizzes = attempts?.length || 0;
        const averageScore = totalQuizzes > 0 
            ? attempts.reduce((sum, a) => sum + (a.percentage || 0), 0) / totalQuizzes 
            : 0;
        const perfectScores = attempts?.filter(a => a.percentage === 100).length || 0;
        const totalQuestionsAnswered = attempts?.reduce((sum, a) => sum + (a.total_questions || 0), 0) || 0;
        const correctAnswers = attempts?.reduce((sum, a) => sum + (a.correct_count || 0), 0) || 0;
        
        res.json({
            success: true,
            stats: {
                totalQuizzes,
                averageScore: Math.round(averageScore),
                perfectScores,
                savedNotes: savedNotesCount || 0,
                totalQuestionsAnswered,
                correctAnswers
            }
        });
        
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
};

// Get user achievements
export const getUserAchievements = async (req, res) => {
    try {
        const userId = req.user.id;
        
        console.log('🏆 Fetching achievements for user:', userId);
        
        // Get user's quiz attempts to calculate achievements
        const { data: attempts, error: attemptsError } = await supabase
            .from('quiz_attempts')
            .select('*')
            .eq('user_id', userId)
            .eq('status', 'completed');
        
        if (attemptsError) throw attemptsError;
        
        const totalQuizzes = attempts?.length || 0;
        const perfectScores = attempts?.filter(a => a.percentage === 100).length || 0;
        
        // Calculate achievements based on user's activity
        const achievements = [];
        
        // First Quiz Achievement
        if (totalQuizzes >= 1) {
            achievements.push({
                id: 'first_quiz',
                name: 'First Steps',
                description: 'Completed your first quiz',
                icon: '🎯',
                earned: true,
                earnedAt: attempts[0]?.completed_at
            });
        }
        
        // Quiz Master Achievement
        if (totalQuizzes >= 10) {
            achievements.push({
                id: 'quiz_master',
                name: 'Quiz Master',
                description: 'Completed 10 quizzes',
                icon: '🏆',
                earned: true,
                earnedAt: attempts[9]?.completed_at
            });
        }
        
        // Perfect Score Achievement
        if (perfectScores >= 1) {
            achievements.push({
                id: 'perfect_score',
                name: 'Perfect Score',
                description: 'Got 100% on a quiz',
                icon: '⭐',
                earned: true,
                earnedAt: attempts?.find(a => a.percentage === 100)?.completed_at
            });
        }
        
        // Note Keeper Achievement
        const { count: notesCount } = await supabase
            .from('saved_notes')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId);
        
        if (notesCount >= 20) {
            achievements.push({
                id: 'note_keeper',
                name: 'Note Keeper',
                description: 'Saved 20 notes',
                icon: '📝',
                earned: true,
                earnedAt: new Date().toISOString()
            });
        }
        
        res.json({
            success: true,
            achievements,
            totalEarned: achievements.length,
            totalAvailable: 8
        });
        
    } catch (error) {
        console.error('Get achievements error:', error);
        res.status(500).json({ error: 'Failed to fetch achievements' });
    }
};