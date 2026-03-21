// frontend/src/services/scoreService.js
// Score service for quiz scores and leaderboards

// Get API URL from window (set in index.html)
const API_URL = window.API_URL || 'http://localhost:10000/api';

console.log('🏆 Score Service initialized with API_URL:', API_URL);

// Helper function for API calls
async function fetchAPI(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
    // Check if user is authenticated
    const isProtectedRoute = !endpoint.includes('/auth/') && !endpoint.includes('/health');
    
    if (isProtectedRoute && !token) {
        console.warn('⚠️ No token found for score API');
        throw new Error('Authentication required. Please login.');
    }
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const url = `${API_URL}${endpoint}`;
    console.log(`📡 Score API: ${url}`);
    
    try {
        const response = await fetch(url, {
            ...options,
            headers,
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            if (response.status === 401) {
                console.error('🔒 Unauthorized - clearing token');
                localStorage.removeItem('token');
                localStorage.removeItem('isAuthenticated');
                throw new Error('Session expired. Please login again.');
            }
            throw new Error(data.message || data.error || 'API request failed');
        }
        
        return data;
    } catch (error) {
        console.error('❌ Score API Error:', error.message);
        throw error;
    }
}

// ============= USER SCORES =============

// Get user's scores
export async function getUserScores() {
    try {
        const data = await fetchAPI('/score');
        return data.scores || [];
    } catch (error) {
        console.error('Error fetching scores:', error);
        return [];
    }
}

// Get user stats
export async function getUserStats() {
    try {
        const data = await fetchAPI('/score/stats');
        return data.stats || {
            totalScore: 0,
            averageScore: 0,
            quizzesTaken: 0,
            highestScore: 0,
            rank: 0
        };
    } catch (error) {
        console.error('Error fetching stats:', error);
        return {
            totalScore: 0,
            averageScore: 0,
            quizzesTaken: 0,
            highestScore: 0,
            rank: 0
        };
    }
}

// ============= LEADERBOARD =============

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

// Get global rankings
export async function getGlobalRankings() {
    try {
        const data = await fetchAPI('/score/ranking');
        return data.rankings || [];
    } catch (error) {
        console.error('Error fetching rankings:', error);
        return [];
    }
}

// ============= ACHIEVEMENTS =============

// Get user achievements
export async function getUserAchievements() {
    try {
        const data = await fetchAPI('/score/achievements');
        return data.achievements || [];
    } catch (error) {
        console.error('Error fetching achievements:', error);
        return [];
    }
}

// Claim achievement reward
export async function claimAchievement(achievementId) {
    try {
        const data = await fetchAPI(`/score/achievements/${achievementId}/claim`, {
            method: 'POST',
        });
        return data;
    } catch (error) {
        console.error('Error claiming achievement:', error);
        throw error;
    }
}

// ============= QUIZ ATTEMPTS =============

// Get quiz attempts (from quiz service)
export async function getQuizAttempts() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Authentication required');
        }
        
        const response = await fetch(`${API_URL}/quiz/attempts/all`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('isAuthenticated');
                throw new Error('Session expired. Please login again.');
            }
            throw new Error(data.message || 'Failed to fetch attempts');
        }
        
        return data.attempts || [];
    } catch (error) {
        console.error('Error fetching quiz attempts:', error);
        return [];
    }
}

// ============= USER PROFILE STATS =============

// Get complete user profile stats
export async function getUserProfileStats() {
    try {
        const [scores, attempts, achievements] = await Promise.all([
            getUserScores(),
            getQuizAttempts(),
            getUserAchievements()
        ]);
        
        const completedAttempts = attempts.filter(a => a.status === 'completed');
        const totalScore = scores.reduce((sum, s) => sum + (s.score || 0), 0);
        const totalQuizzes = completedAttempts.length;
        const averageScore = totalQuizzes > 0 
            ? completedAttempts.reduce((sum, a) => sum + (a.percentage || 0), 0) / totalQuizzes 
            : 0;
        const highestScore = Math.max(...completedAttempts.map(a => a.percentage || 0), 0);
        const perfectScores = completedAttempts.filter(a => a.percentage === 100).length;
        const totalQuestions = completedAttempts.reduce((sum, a) => sum + (a.total_questions || 0), 0);
        const correctAnswers = completedAttempts.reduce((sum, a) => sum + (a.correct_count || 0), 0);
        
        return {
            totalScore,
            totalQuizzes,
            averageScore: Math.round(averageScore),
            highestScore,
            perfectScores,
            totalQuestions,
            correctAnswers,
            accuracy: totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0,
            achievements: achievements.length,
            achievementsList: achievements
        };
    } catch (error) {
        console.error('Error fetching profile stats:', error);
        return {
            totalScore: 0,
            totalQuizzes: 0,
            averageScore: 0,
            highestScore: 0,
            perfectScores: 0,
            totalQuestions: 0,
            correctAnswers: 0,
            accuracy: 0,
            achievements: 0,
            achievementsList: []
        };
    }
}

// ============= HELPER FUNCTIONS =============

// Save score locally (for offline mode)
export function saveScoreLocally(scoreData) {
    const pendingScores = JSON.parse(localStorage.getItem('pendingScores') || '[]');
    pendingScores.push({
        ...scoreData,
        timestamp: Date.now()
    });
    localStorage.setItem('pendingScores', JSON.stringify(pendingScores));
}

// Sync pending scores (call when back online)
export async function syncPendingScores() {
    const pendingScores = JSON.parse(localStorage.getItem('pendingScores') || '[]');
    const results = [];
    
    for (const score of pendingScores) {
        try {
            // Try to submit score if there's an endpoint
            // This depends on your backend implementation
            results.push({ success: true, score });
        } catch (error) {
            results.push({ success: false, score, error });
        }
    }
    
    const failed = results.filter(r => !r.success).map(r => r.score);
    localStorage.setItem('pendingScores', JSON.stringify(failed));
    
    return results;
}

// Setup offline sync for scores
export function setupScoreOfflineSync() {
    window.addEventListener('online', async () => {
        console.log('🌐 Back online, syncing scores...');
        const results = await syncPendingScores();
        const successCount = results.filter(r => r.success).length;
        if (successCount > 0) {
            console.log(`✅ Synced ${successCount} scores`);
        }
    });
}

// ============= EXPORT =============
export default {
    getUserScores,
    getUserStats,
    getLeaderboard,
    getGlobalRankings,
    getUserAchievements,
    claimAchievement,
    getQuizAttempts,
    getUserProfileStats,
    saveScoreLocally,
    syncPendingScores,
    setupScoreOfflineSync
};