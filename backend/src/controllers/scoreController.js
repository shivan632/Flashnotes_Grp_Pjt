// backend/src/controllers/scoreController.js
import { supabase } from '../config/supabase.js';

// Helper function to update user_scores after each quiz
export const updateUserScores = async (userId, correctCount, totalQuestions, percentage, scorePoints = null) => {
    try {
        console.log('🔄 Updating user scores for:', userId);
        console.log('Quiz data:', { correctCount, totalQuestions, percentage });
        
        // Calculate points (if not provided, default to correctCount * 10)
        const pointsEarned = scorePoints !== null ? scorePoints : (correctCount * 10);
        
        // Get current user scores
        const { data: currentScores, error: fetchError } = await supabase
            .from('user_scores')
            .select('*')
            .eq('user_id', userId)
            .single();
        
        if (fetchError && fetchError.code !== 'PGRST116') {
            console.error('Error fetching current scores:', fetchError);
            throw fetchError;
        }
        
        // Calculate new values
        const newTotalQuizzes = (currentScores?.total_quizzes_taken || 0) + 1;
        const newTotalQuestions = (currentScores?.total_questions_answered || 0) + totalQuestions;
        const newCorrectAnswers = (currentScores?.correct_answers || 0) + correctCount;
        const newPerfectScores = (currentScores?.perfect_scores || 0) + (percentage === 100 ? 1 : 0);
        const newTotalPoints = (currentScores?.total_points || 0) + pointsEarned;
        
        // Calculate new average score
        const previousTotalScore = (currentScores?.average_score || 0) * (currentScores?.total_quizzes_taken || 0);
        const newAverageScore = (previousTotalScore + percentage) / newTotalQuizzes;
        
        // Calculate streak
        let newStreak = currentScores?.current_streak || 0;
        const today = new Date().toISOString().split('T')[0];
        const lastQuizDate = currentScores?.last_quiz_date;
        
        if (lastQuizDate) {
            const lastDate = new Date(lastQuizDate);
            const currentDate = new Date(today);
            const diffDays = Math.floor((currentDate - lastDate) / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
                newStreak++;
                console.log(`📅 Streak increased: ${newStreak} days`);
            } else if (diffDays > 1) {
                newStreak = 1;
                console.log(`📅 Streak reset to: ${newStreak} day`);
            } else if (diffDays === 0) {
                console.log(`📅 Same day quiz, streak unchanged: ${newStreak}`);
            }
        } else {
            newStreak = 1;
            console.log(`📅 First quiz, streak started: ${newStreak} day`);
        }
        
        // Update or insert user_scores
        if (currentScores) {
            const { error: updateError } = await supabase
                .from('user_scores')
                .update({
                    total_quizzes_taken: newTotalQuizzes,
                    total_questions_answered: newTotalQuestions,
                    correct_answers: newCorrectAnswers,
                    average_score: Math.round(newAverageScore),
                    perfect_scores: newPerfectScores,
                    current_streak: newStreak,
                    longest_streak: Math.max(newStreak, currentScores.longest_streak || 0),
                    last_quiz_date: today,
                    total_points: newTotalPoints,
                    updated_at: new Date().toISOString()
                })
                .eq('user_id', userId);
            
            if (updateError) {
                console.error('Error updating user scores:', updateError);
                throw updateError;
            }
            
            console.log('✅ User scores updated successfully');
            console.log(`📊 New stats: Quizzes=${newTotalQuizzes}, Points=${newTotalPoints}, Streak=${newStreak}`);
        } else {
            const { error: insertError } = await supabase
                .from('user_scores')
                .insert({
                    user_id: userId,
                    total_quizzes_taken: newTotalQuizzes,
                    total_questions_answered: newTotalQuestions,
                    correct_answers: newCorrectAnswers,
                    average_score: Math.round(newAverageScore),
                    perfect_scores: newPerfectScores,
                    current_streak: newStreak,
                    longest_streak: newStreak,
                    last_quiz_date: today,
                    total_points: newTotalPoints,
                    rank_points: 0,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                });
            
            if (insertError) {
                console.error('Error inserting user scores:', insertError);
                throw insertError;
            }
            
            console.log('✅ New user scores created');
            console.log(`📊 Initial stats: Quizzes=1, Points=${newTotalPoints}, Streak=1`);
        }
        
        return true;
        
    } catch (error) {
        console.error('❌ Error updating user scores:', error);
        throw error;
    }
};

// Get user's scores from user_scores table
export const getUserScores = async (req, res) => {
    try {
        const userId = req.user.id;
        
        console.log('📊 Fetching user scores for:', userId);
        
        // Fetch from user_scores table
        const { data: userScore, error } = await supabase
            .from('user_scores')
            .select('*')
            .eq('user_id', userId)
            .single();
        
        if (error && error.code !== 'PGRST116') {
            console.error('Error fetching user scores:', error);
            throw error;
        }
        
        // If no user_score record exists, create one with default values
        if (!userScore) {
            console.log('No user scores found, creating default record...');
            
            const { data: newUserScore, error: insertError } = await supabase
                .from('user_scores')
                .insert({
                    user_id: userId,
                    total_quizzes_taken: 0,
                    total_questions_answered: 0,
                    correct_answers: 0,
                    average_score: 0,
                    perfect_scores: 0,
                    current_streak: 0,
                    longest_streak: 0,
                    total_points: 0,
                    rank_points: 0,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .select()
                .single();
            
            if (insertError) {
                console.error('Error creating default user scores:', insertError);
                throw insertError;
            }
            
            console.log('✅ Default user scores created');
            
            return res.json({
                success: true,
                stats: {
                    totalQuizzes: 0,
                    averageScore: 0,
                    perfectScores: 0,
                    totalQuestionsAnswered: 0,
                    correctAnswers: 0,
                    totalPoints: 0,
                    currentStreak: 0,
                    accuracy: 0
                },
                scores: []
            });
        }
        
        // Calculate accuracy
        const accuracy = userScore.total_questions_answered > 0 
            ? Math.round((userScore.correct_answers / userScore.total_questions_answered) * 100) 
            : 0;
        
        // Get recent quiz attempts for history
        const { data: recentAttempts, error: attemptsError } = await supabase
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
            .order('completed_at', { ascending: false })
            .limit(10);
        
        if (attemptsError) {
            console.error('Error fetching recent attempts:', attemptsError);
        }
        
        console.log('✅ User scores fetched successfully:', {
            totalQuizzes: userScore.total_quizzes_taken,
            totalPoints: userScore.total_points,
            accuracy: accuracy,
            streak: userScore.current_streak
        });
        
        res.json({
            success: true,
            stats: {
                totalQuizzes: userScore.total_quizzes_taken,
                averageScore: Math.round(userScore.average_score),
                perfectScores: userScore.perfect_scores,
                totalQuestionsAnswered: userScore.total_questions_answered,
                correctAnswers: userScore.correct_answers,
                totalPoints: userScore.total_points,
                currentStreak: userScore.current_streak,
                accuracy: accuracy
            },
            scores: recentAttempts || [],
            recentAttempts: recentAttempts || []
        });
        
    } catch (error) {
        console.error('❌ Get user scores error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch scores',
            error: error.message
        });
    }
};

// Get leaderboard
export const getLeaderboard = async (req, res) => {
    try {
        const { period = 'all', limit = 10 } = req.query;
        
        console.log('📊 Fetching leaderboard:', { period, limit });
        
        let query = supabase
            .from('user_scores')
            .select(`
                user_id,
                total_quizzes_taken,
                average_score,
                total_points,
                users (
                    name,
                    email
                )
            `)
            .gt('total_quizzes_taken', 0);
        
        // Sort based on period
        if (period === 'week') {
            query = query.order('total_points', { ascending: false });
        } else if (period === 'month') {
            query = query.order('total_points', { ascending: false });
        } else {
            query = query.order('average_score', { ascending: false });
        }
        
        const { data: userScores, error } = await query.limit(parseInt(limit));
        
        if (error) {
            console.error('Error fetching leaderboard:', error);
            throw error;
        }
        
        // Format leaderboard data
        const leaderboard = (userScores || []).map(score => ({
            user_id: score.user_id,
            name: score.users?.name || 'Anonymous',
            email: score.users?.email || '',
            average_score: Math.round(score.average_score),
            total_quizzes: score.total_quizzes_taken,
            total_points: score.total_points
        }));
        
        console.log(`✅ Leaderboard fetched: ${leaderboard.length} users`);
        
        res.json({
            success: true,
            leaderboard: leaderboard,
            period,
            totalUsers: leaderboard.length
        });
        
    } catch (error) {
        console.error('❌ Get leaderboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch leaderboard',
            error: error.message
        });
    }
};

// Get user stats (simplified version using user_scores)
export const getUserStats = async (req, res) => {
    try {
        const userId = req.user.id;
        
        console.log('📊 Fetching user stats for:', userId);
        
        const { data: userScore, error } = await supabase
            .from('user_scores')
            .select('*')
            .eq('user_id', userId)
            .single();
        
        if (error && error.code !== 'PGRST116') {
            console.error('Error fetching user stats:', error);
            throw error;
        }
        
        if (!userScore) {
            console.log('No user stats found, returning defaults');
            return res.json({
                success: true,
                stats: {
                    totalQuizzes: 0,
                    averageScore: 0,
                    bestScore: 0,
                    perfectScores: 0,
                    totalQuestions: 0,
                    correctAnswers: 0,
                    accuracy: 0,
                    totalPoints: 0,
                    currentStreak: 0
                }
            });
        }
        
        const accuracy = userScore.total_questions_answered > 0 
            ? Math.round((userScore.correct_answers / userScore.total_questions_answered) * 100) 
            : 0;
        
        // Get best score from quiz_attempts
        const { data: bestAttempt, error: bestError } = await supabase
            .from('quiz_attempts')
            .select('percentage')
            .eq('user_id', userId)
            .eq('status', 'completed')
            .order('percentage', { ascending: false })
            .limit(1)
            .single();
        
        if (bestError && bestError.code !== 'PGRST116') {
            console.error('Error fetching best score:', bestError);
        }
        
        console.log('✅ User stats fetched successfully');
        
        res.json({
            success: true,
            stats: {
                totalQuizzes: userScore.total_quizzes_taken,
                averageScore: Math.round(userScore.average_score),
                bestScore: bestAttempt?.percentage || 0,
                perfectScores: userScore.perfect_scores,
                totalQuestions: userScore.total_questions_answered,
                correctAnswers: userScore.correct_answers,
                accuracy: accuracy,
                totalPoints: userScore.total_points,
                currentStreak: userScore.current_streak,
                longestStreak: userScore.longest_streak
            }
        });
        
    } catch (error) {
        console.error('❌ Get user stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch stats',
            error: error.message
        });
    }
};

// Get score progression for graph
export const getScoreProgression = async (req, res) => {
    try {
        const userId = req.user.id;
        
        console.log('📊 Fetching score progression for:', userId);
        
        // Get all completed quiz attempts ordered by date
        const { data: attempts, error } = await supabase
            .from('quiz_attempts')
            .select('*')
            .eq('user_id', userId)
            .eq('status', 'completed')
            .order('completed_at', { ascending: true });
        
        if (error) {
            console.error('Error fetching attempts for progression:', error);
            throw error;
        }
        
        // If no attempts, return empty data
        if (!attempts || attempts.length === 0) {
            console.log('No quiz attempts found for progression');
            return res.json({
                success: true,
                progression: {
                    weeks: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                    scores: [0, 0, 0, 0],
                    data: []
                }
            });
        }
        
        // Get last 4 weeks of data
        const now = new Date();
        const fourWeeksAgo = new Date();
        fourWeeksAgo.setDate(now.getDate() - 28);
        
        // Filter attempts from last 4 weeks
        const recentAttempts = attempts.filter(attempt => 
            new Date(attempt.completed_at) >= fourWeeksAgo
        );
        
        // Group by week
        const weeklyData = {
            'Week 1': [], // Most recent week
            'Week 2': [],
            'Week 3': [],
            'Week 4': []  // Oldest week
        };
        
        recentAttempts.forEach(attempt => {
            const attemptDate = new Date(attempt.completed_at);
            const daysAgo = Math.floor((now - attemptDate) / (1000 * 60 * 60 * 24));
            const weekIndex = Math.floor(daysAgo / 7);
            
            if (weekIndex === 0) {
                weeklyData['Week 1'].push(attempt.percentage);
            } else if (weekIndex === 1) {
                weeklyData['Week 2'].push(attempt.percentage);
            } else if (weekIndex === 2) {
                weeklyData['Week 3'].push(attempt.percentage);
            } else if (weekIndex === 3) {
                weeklyData['Week 4'].push(attempt.percentage);
            }
        });
        
        // Calculate average for each week
        const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        const scores = weeks.map(week => {
            const weekScores = weeklyData[week];
            if (weekScores.length === 0) return 0;
            const average = weekScores.reduce((sum, score) => sum + score, 0) / weekScores.length;
            return Math.round(average);
        });
        
        console.log('✅ Score progression calculated:', { weeks, scores });
        
        res.json({
            success: true,
            progression: {
                weeks: weeks,
                scores: scores,
                data: recentAttempts.map(attempt => ({
                    date: attempt.completed_at,
                    score: attempt.percentage,
                    percentage: attempt.percentage
                }))
            }
        });
        
    } catch (error) {
        console.error('❌ Get score progression error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch progression data',
            error: error.message
        });
    }
};

// Get user achievements
export const getUserAchievements = async (req, res) => {
    try {
        const userId = req.user.id;
        
        console.log('🏆 Fetching achievements for:', userId);
        
        // Get user's scores
        const { data: userScore, error: scoreError } = await supabase
            .from('user_scores')
            .select('*')
            .eq('user_id', userId)
            .single();
        
        if (scoreError && scoreError.code !== 'PGRST116') {
            throw scoreError;
        }
        
        // Get user's quiz attempts
        const { data: attempts, error: attemptsError } = await supabase
            .from('quiz_attempts')
            .select('*')
            .eq('user_id', userId)
            .eq('status', 'completed')
            .order('completed_at', { ascending: true });
        
        if (attemptsError) {
            throw attemptsError;
        }
        
        // Calculate achievements
        const achievements = [];
        const totalQuizzes = userScore?.total_quizzes_taken || 0;
        
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
        } else {
            achievements.push({
                id: 'quiz_master',
                name: 'Quiz Master',
                description: `Complete 10 quizzes (${totalQuizzes}/10)`,
                icon: '🏆',
                earned: false,
                progress: totalQuizzes,
                target: 10
            });
        }
        
        // Perfect score achievement
        const perfectScores = userScore?.perfect_scores || 0;
        if (perfectScores >= 1) {
            const perfectAttempt = attempts?.find(a => a.percentage === 100);
            achievements.push({
                id: 'perfect_score',
                name: 'Perfect Score',
                description: 'Got 100% on a quiz',
                icon: '⭐',
                earned: true,
                earnedAt: perfectAttempt?.completed_at
            });
        } else {
            achievements.push({
                id: 'perfect_score',
                name: 'Perfect Score',
                description: 'Get 100% on any quiz',
                icon: '⭐',
                earned: false
            });
        }
        
        // Streak achievement
        const streak = userScore?.current_streak || 0;
        if (streak >= 7) {
            achievements.push({
                id: 'streak_master',
                name: 'Streak Master',
                description: 'Maintained a 7-day learning streak',
                icon: '🔥',
                earned: true
            });
        } else {
            achievements.push({
                id: 'streak_master',
                name: 'Streak Master',
                description: `Maintain a 7-day streak (${streak}/7)`,
                icon: '🔥',
                earned: false,
                progress: streak,
                target: 7
            });
        }
        
        // Questions master achievement
        const totalQuestions = userScore?.total_questions_answered || 0;
        if (totalQuestions >= 100) {
            achievements.push({
                id: 'questions_master',
                name: 'Questions Master',
                description: 'Answered 100 questions',
                icon: '📚',
                earned: true
            });
        } else {
            achievements.push({
                id: 'questions_master',
                name: 'Questions Master',
                description: `Answer 100 questions (${totalQuestions}/100)`,
                icon: '📚',
                earned: false,
                progress: totalQuestions,
                target: 100
            });
        }
        
        // Points collector achievement
        const totalPoints = userScore?.total_points || 0;
        if (totalPoints >= 1000) {
            achievements.push({
                id: 'points_collector',
                name: 'Points Collector',
                description: 'Earned 1000 points',
                icon: '💎',
                earned: true
            });
        } else {
            achievements.push({
                id: 'points_collector',
                name: 'Points Collector',
                description: `Earn 1000 points (${totalPoints}/1000)`,
                icon: '💎',
                earned: false,
                progress: totalPoints,
                target: 1000
            });
        }
        
        console.log(`✅ Achievements fetched: ${achievements.filter(a => a.earned).length} earned`);
        
        res.json({
            success: true,
            achievements,
            totalEarned: achievements.filter(a => a.earned).length,
            totalAvailable: 10
        });
        
    } catch (error) {
        console.error('❌ Get achievements error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch achievements',
            error: error.message
        });
    }
};

// Debug endpoint to check user_scores data
export const debugUserScores = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Check user_scores
        const { data: userScores, error: scoresError } = await supabase
            .from('user_scores')
            .select('*')
            .eq('user_id', userId);
        
        // Check quiz_attempts
        const { data: quizAttempts, error: attemptsError } = await supabase
            .from('quiz_attempts')
            .select('*')
            .eq('user_id', userId)
            .eq('status', 'completed');
        
        res.json({
            success: true,
            debug: {
                userScores: userScores || [],
                userScoresCount: userScores?.length || 0,
                quizAttemptsCount: quizAttempts?.length || 0,
                quizAttempts: quizAttempts || [],
                hasUserScores: (userScores?.length || 0) > 0,
                hasQuizAttempts: (quizAttempts?.length || 0) > 0
            }
        });
        
    } catch (error) {
        console.error('Debug error:', error);
        res.status(500).json({
            success: false,
            message: 'Debug failed',
            error: error.message
        });
    }
};