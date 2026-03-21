// backend/src/controllers/scoreController.js
import { supabase } from '../config/supabase.js';

// Get user's scores
export const getUserScores = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Get all completed quiz attempts
        const { data: attempts, error } = await supabase
            .from('quiz_attempts')
            .select(`
                *,
                quizzes (
                    title,
                    topic
                )
            `)
            .eq('user_id', userId)
            .eq('status', 'completed')
            .order('completed_at', { ascending: false });
        
        if (error) throw error;
        
        // Calculate stats
        const stats = {
            totalQuizzes: attempts.length,
            averageScore: attempts.length > 0 
                ? attempts.reduce((sum, a) => sum + (a.percentage || 0), 0) / attempts.length 
                : 0,
            perfectScores: attempts.filter(a => a.percentage === 100).length,
            totalQuestionsAnswered: attempts.reduce((sum, a) => sum + (a.total_questions || 0), 0),
            correctAnswers: attempts.reduce((sum, a) => sum + (a.correct_count || 0), 0),
            totalPoints: attempts.reduce((sum, a) => sum + (a.score || 0), 0),
            currentStreak: 0 // Can be implemented later
        };
        
        res.json({
            success: true,
            scores: attempts,
            stats: {
                ...stats,
                averageScore: Math.round(stats.averageScore)
            },
            recentAttempts: attempts.slice(0, 10)
        });
        
    } catch (error) {
        console.error('Get user scores error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch scores'
        });
    }
};

// Get leaderboard
export const getLeaderboard = async (req, res) => {
    try {
        const { period = 'all', limit = 10 } = req.query;
        
        console.log('📊 Fetching leaderboard:', { period, limit });
        
        // Build query
        let query = supabase
            .from('quiz_attempts')
            .select(`
                user_id,
                percentage,
                users (
                    name,
                    email
                )
            `)
            .eq('status', 'completed');
        
        // Apply period filter
        if (period === 'week') {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            query = query.gte('completed_at', oneWeekAgo.toISOString());
        } else if (period === 'month') {
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
            query = query.gte('completed_at', oneMonthAgo.toISOString());
        }
        
        const { data: attempts, error } = await query;
        
        if (error) throw error;
        
        // Group by user and calculate average
        const userStats = {};
        
        attempts.forEach(attempt => {
            const userId = attempt.user_id;
            const userName = attempt.users?.name || 'Anonymous';
            const userEmail = attempt.users?.email || '';
            
            if (!userStats[userId]) {
                userStats[userId] = {
                    user_id: userId,
                    name: userName,
                    email: userEmail,
                    total_score: 0,
                    total_quizzes: 0,
                    scores: []
                };
            }
            
            userStats[userId].total_score += (attempt.percentage || 0);
            userStats[userId].total_quizzes++;
            userStats[userId].scores.push(attempt.percentage || 0);
        });
        
        // Calculate average and sort
        const leaderboard = Object.values(userStats).map(user => ({
            user_id: user.user_id,
            name: user.name,
            email: user.email,
            average_score: user.total_score / user.total_quizzes,
            total_quizzes: user.total_quizzes,
            best_score: Math.max(...user.scores)
        }));
        
        // Sort by average score (descending)
        leaderboard.sort((a, b) => b.average_score - a.average_score);
        
        // Limit results
        const limitedLeaderboard = leaderboard.slice(0, parseInt(limit));
        
        res.json({
            success: true,
            leaderboard: limitedLeaderboard,
            period,
            totalUsers: leaderboard.length
        });
        
    } catch (error) {
        console.error('Get leaderboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch leaderboard'
        });
    }
};

// Get user stats
export const getUserStats = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const { data: attempts, error } = await supabase
            .from('quiz_attempts')
            .select('*')
            .eq('user_id', userId)
            .eq('status', 'completed');
        
        if (error) throw error;
        
        const totalQuizzes = attempts.length;
        const averageScore = totalQuizzes > 0 
            ? attempts.reduce((sum, a) => sum + (a.percentage || 0), 0) / totalQuizzes 
            : 0;
        const bestScore = totalQuizzes > 0 
            ? Math.max(...attempts.map(a => a.percentage || 0)) 
            : 0;
        const perfectScores = attempts.filter(a => a.percentage === 100).length;
        const totalQuestions = attempts.reduce((sum, a) => sum + (a.total_questions || 0), 0);
        const correctAnswers = attempts.reduce((sum, a) => sum + (a.correct_count || 0), 0);
        
        res.json({
            success: true,
            stats: {
                totalQuizzes,
                averageScore: Math.round(averageScore),
                bestScore: Math.round(bestScore),
                perfectScores,
                totalQuestions,
                correctAnswers,
                accuracy: totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0
            }
        });
        
    } catch (error) {
        console.error('Get user stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch stats'
        });
    }
};

// Get user achievements
export const getUserAchievements = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Get user's quiz attempts
        const { data: attempts, error } = await supabase
            .from('quiz_attempts')
            .select('*')
            .eq('user_id', userId)
            .eq('status', 'completed');
        
        if (error) throw error;
        
        // Calculate achievements
        const achievements = [];
        const totalQuizzes = attempts.length;
        
        // First quiz achievement
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
        
        // Quiz master achievement
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
        
        // Perfect score achievement
        const perfectScores = attempts.filter(a => a.percentage === 100);
        if (perfectScores.length >= 1) {
            achievements.push({
                id: 'perfect_score',
                name: 'Perfect Score',
                description: 'Got 100% on a quiz',
                icon: '⭐',
                earned: true,
                earnedAt: perfectScores[0]?.completed_at
            });
        }
        
        // Streak achievement
        // Can be implemented later
        
        res.json({
            success: true,
            achievements,
            totalEarned: achievements.length,
            totalAvailable: 10
        });
        
    } catch (error) {
        console.error('Get achievements error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch achievements'
        });
    }
};