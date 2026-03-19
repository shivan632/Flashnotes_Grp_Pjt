// backend/src/controllers/scoreController.js
import { supabase } from '../config/supabase.js';

// Get user's scores and statistics
export const getUserScores = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get aggregated scores from user_scores table
        const { data: scores, error: scoresError } = await supabase
            .from('user_scores')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();

        if (scoresError) throw scoresError;

        // Get recent quiz attempts
        const { data: recentAttempts, error: attemptsError } = await supabase
            .from('quiz_attempts')
            .select(`
                id,
                quiz_id,
                percentage,
                correct_count,
                total_questions,
                completed_at,
                quizzes (
                    title,
                    topic
                )
            `)
            .eq('user_id', userId)
            .eq('status', 'completed')
            .order('completed_at', { ascending: false })
            .limit(10);

        if (attemptsError) throw attemptsError;

        // Calculate statistics
        const stats = {
            totalQuizzes: scores?.total_quizzes_taken || 0,
            averageScore: Math.round(scores?.average_score || 0),
            perfectScores: scores?.perfect_scores || 0,
            currentStreak: scores?.current_streak || 0,
            totalPoints: scores?.total_points || 0,
            totalQuestionsAnswered: scores?.total_questions_answered || 0,
            correctAnswers: scores?.correct_answers || 0
        };

        res.json({
            success: true,
            stats,
            recentAttempts: recentAttempts || []
        });

    } catch (error) {
        console.error('Get scores error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch scores'
        });
    }
};

// Get global leaderboard
export const getLeaderboard = async (req, res) => {
    try {
        const { period = 'all', limit = 10 } = req.query;

        let query = supabase
            .from('user_scores')
            .select(`
                user_id,
                total_quizzes_taken,
                average_score,
                perfect_scores,
                total_points,
                profiles (
                    name,
                    email
                )
            `)
            .order('total_points', { ascending: false })
            .limit(limit);

        // Add time filter if needed
        if (period === 'weekly') {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            query = supabase
                .from('quiz_attempts')
                .select(`
                    user_id,
                    COUNT(*) as quizzes_taken,
                    AVG(percentage) as avg_score,
                    SUM(correct_count * 10) as points,
                    profiles (
                        name,
                        email
                    )
                `)
                .gte('completed_at', weekAgo.toISOString())
                .eq('status', 'completed')
                .group('user_id, profiles.name, profiles.email')
                .order('points', { ascending: false })
                .limit(limit);
        }

        const { data: leaderboard, error } = await query;

        if (error) throw error;

        // Format leaderboard data
        const formattedLeaderboard = leaderboard.map((entry, index) => ({
            rank: index + 1,
            userId: entry.user_id,
            name: entry.profiles?.name || 'Anonymous',
            quizzesTaken: entry.total_quizzes_taken || entry.quizzes_taken || 0,
            averageScore: Math.round(entry.average_score || 0),
            perfectScores: entry.perfect_scores || 0,
            points: entry.total_points || entry.points || 0
        }));

        res.json({
            success: true,
            leaderboard: formattedLeaderboard,
            period
        });

    } catch (error) {
        console.error('Get leaderboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch leaderboard'
        });
    }
};

// Get user's achievements
export const getUserAchievements = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get earned achievements
        const { data: earned, error: earnedError } = await supabase
            .from('user_achievements')
            .select(`
                achievement_id,
                earned_at,
                achievements (
                    name,
                    description,
                    icon,
                    points
                )
            `)
            .eq('user_id', userId)
            .order('earned_at', { ascending: false });

        if (earnedError) throw earnedError;

        // Get all available achievements
        const { data: allAchievements, error: allError } = await supabase
            .from('achievements')
            .select('*')
            .order('points');

        if (allError) throw allError;

        // Mark which ones are earned
        const earnedIds = new Set(earned?.map(e => e.achievement_id) || []);
        
        const achievements = allAchievements.map(ach => ({
            ...ach,
            earned: earnedIds.has(ach.id),
            earnedAt: earned?.find(e => e.achievement_id === ach.id)?.earned_at || null
        }));

        res.json({
            success: true,
            achievements,
            totalEarned: earned?.length || 0,
            totalAvailable: allAchievements.length
        });

    } catch (error) {
        console.error('Get achievements error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch achievements'
        });
    }
};

// Get quick stats for dashboard
export const getStats = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get today's date
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Get various stats in parallel
        const [
            { data: userStats },
            { data: todayAttempt },
            { data: bestQuiz },
            { data: recentActivity }
        ] = await Promise.all([
            // Overall stats
            supabase
                .from('user_scores')
                .select('*')
                .eq('user_id', userId)
                .maybeSingle(),

            // Today's activity
            supabase
                .from('quiz_attempts')
                .select('id')
                .eq('user_id', userId)
                .eq('status', 'completed')
                .gte('completed_at', today.toISOString()),

            // Best quiz
            supabase
                .from('quiz_attempts')
                .select(`
                    percentage,
                    quizzes (
                        title
                    )
                `)
                .eq('user_id', userId)
                .eq('status', 'completed')
                .order('percentage', { ascending: false })
                .limit(1)
                .maybeSingle(),

            // Recent activity count (last 7 days)
            supabase
                .from('quiz_attempts')
                .select('id')
                .eq('user_id', userId)
                .eq('status', 'completed')
                .gte('completed_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        ]);

        res.json({
            success: true,
            stats: {
                totalQuizzes: userStats?.total_quizzes_taken || 0,
                averageScore: Math.round(userStats?.average_score || 0),
                perfectScores: userStats?.perfect_scores || 0,
                currentStreak: userStats?.current_streak || 0,
                todayActivity: todayAttempt?.length || 0,
                bestQuiz: bestQuiz ? {
                    title: bestQuiz.quizzes?.title,
                    score: Math.round(bestQuiz.percentage)
                } : null,
                weeklyActivity: recentActivity?.length || 0
            }
        });

    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch stats'
        });
    }
};