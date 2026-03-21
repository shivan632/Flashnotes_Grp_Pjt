// frontend/src/services/scoreService.js
// Score API service - Complete with all exports

const API_URL = 'https://flashnotes-grp-pjt.onrender.com/api';

// Get auth token
const getToken = () => localStorage.getItem('authToken');

// Generic fetch wrapper
async function fetchAPI(endpoint, options = {}) {
    const token = getToken();
    
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
    
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers: {
                ...headers,
                ...options.headers
            }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'API request failed');
        }
        
        return data;
    } catch (error) {
        console.error('Score API Error:', error);
        throw error;
    }
}

// Get user scores and statistics
export async function getUserScores() {
    try {
        const data = await fetchAPI('/score');
        return {
            stats: data.stats || {},
            recentAttempts: data.recentAttempts || []
        };
    } catch (error) {
        console.error('Error fetching scores:', error);
        return { stats: {}, recentAttempts: [] };
    }
}

// Get leaderboard
export async function getLeaderboard(period = 'all', limit = 10) {
    try {
        const data = await fetchAPI(`/score/leaderboard?period=${period}&limit=${limit}`);
        return data.leaderboard || [];
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return [];
    }
}

// Get user achievements
export async function getUserAchievements() {
    try {
        const data = await fetchAPI('/score/achievements');
        return {
            achievements: data.achievements || [],
            totalEarned: data.totalEarned || 0,
            totalAvailable: data.totalAvailable || 0
        };
    } catch (error) {
        console.error('Error fetching achievements:', error);
        return { achievements: [], totalEarned: 0, totalAvailable: 0 };
    }
}

// Get quiz attempts - ADDED
export async function getQuizAttempts() {
    try {
        const data = await fetchAPI('/quiz/attempts/all');
        return data.attempts || [];
    } catch (error) {
        console.error('Error fetching quiz attempts:', error);
        return [];
    }
}

// Get specific quiz attempt
export async function getQuizAttemptById(attemptId) {
    try {
        const data = await fetchAPI(`/quiz/attempt/${attemptId}`);
        return data.attempt;
    } catch (error) {
        console.error('Error fetching quiz attempt:', error);
        return null;
    }
}

// Get quick stats for dashboard
export async function getQuickStats() {
    try {
        const data = await fetchAPI('/score/stats');
        return data.stats || {};
    } catch (error) {
        console.error('Error fetching stats:', error);
        return {};
    }
}

// Get performance analytics
export async function getPerformanceAnalytics() {
    try {
        const scores = await getUserScores();
        const achievements = await getUserAchievements();
        
        const { stats, recentAttempts } = scores;
        
        // Calculate trends
        const last5Scores = recentAttempts.slice(0, 5).map(a => a.percentage || 0);
        const trend = last5Scores.length > 1 
            ? last5Scores[0] - last5Scores[last5Scores.length - 1]
            : 0;
        
        return {
            overview: {
                totalQuizzes: stats.totalQuizzes || 0,
                averageScore: stats.averageScore || 0,
                perfectScores: stats.perfectScores || 0,
                totalPoints: stats.totalPoints || 0,
                currentStreak: stats.currentStreak || 0,
                bestStreak: stats.longestStreak || 0
            },
            trends: {
                trend: trend > 0 ? 'improving' : trend < 0 ? 'declining' : 'stable',
                last5Scores
            },
            achievements: {
                earned: achievements.totalEarned || 0,
                total: achievements.totalAvailable || 0,
                progress: achievements.totalAvailable > 0 
                    ? (achievements.totalEarned / achievements.totalAvailable * 100).toFixed(1) 
                    : 0,
                recent: achievements.achievements.filter(a => a.earned).slice(0, 5)
            },
            recentActivity: recentAttempts.slice(0, 10).map(a => ({
                quiz: a.quizzes?.title,
                score: a.percentage,
                date: a.completed_at,
                passed: (a.percentage || 0) >= 70
            }))
        };
    } catch (error) {
        console.error('Error fetching performance analytics:', error);
        return null;
    }
}

// Get user ranking
export async function getUserRanking() {
    try {
        const scores = await getUserScores();
        const leaderboard = await getLeaderboard('all', 100);
        
        const userEmail = localStorage.getItem('userEmail');
        const userName = localStorage.getItem('userName');
        const userEntry = leaderboard.find(entry => 
            entry.email === userEmail || entry.name === userName
        );
        
        if (userEntry) {
            return {
                rank: userEntry.rank,
                totalPlayers: leaderboard.length,
                percentile: ((leaderboard.length - userEntry.rank) / leaderboard.length * 100).toFixed(1),
                points: userEntry.points,
                nextRank: userEntry.rank > 1 ? leaderboard[userEntry.rank - 2] : null,
                pointsToNext: userEntry.rank > 1 ? (leaderboard[userEntry.rank - 2]?.points - userEntry.points) : 0
            };
        }
        
        return null;
    } catch (error) {
        console.error('Error fetching user ranking:', error);
        return null;
    }
}

// Export all functions
export default {
    getUserScores,
    getLeaderboard,
    getUserAchievements,
    getQuizAttempts,
    getQuizAttemptById,
    getQuickStats,
    getPerformanceAnalytics,
    getUserRanking
};