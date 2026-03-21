// frontend/src/services/quizService.js
// Quiz API service - Complete fixed version

// Get API URL from window (set in index.html)
const API_URL = window.API_URL || 'http://localhost:10000/api';

console.log('🔧 Quiz Service initialized with API_URL:', API_URL);

// Helper function for API calls
async function fetchAPI(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
    // Check if user is authenticated for protected routes
    const isProtectedRoute = !endpoint.includes('/auth/') && !endpoint.includes('/health');
    
    if (isProtectedRoute && !token) {
        console.warn('⚠️ No token found, redirecting to login');
        window.location.hash = '#/login';
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
    console.log(`📡 Fetching: ${url}`);
    
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
                window.location.hash = '#/login';
                throw new Error('Session expired. Please login again.');
            }
            throw new Error(data.message || data.error || 'API request failed');
        }
        
        return data;
    } catch (error) {
        console.error('❌ Fetch error:', error.message);
        throw error;
    }
}

// ============= PRE-MADE QUIZZES =============

// Get all quizzes
export async function getQuizzes() {
    try {
        const data = await fetchAPI('/quiz');
        return data.quizzes || [];
    } catch (error) {
        console.error('Error fetching quizzes:', error);
        throw error;
    }
}

// Get quiz by ID
export async function getQuizById(quizId) {
    try {
        const data = await fetchAPI(`/quiz/${quizId}`);
        return data.quiz;
    } catch (error) {
        console.error('Error fetching quiz:', error);
        throw error;
    }
}

// Get quiz questions
export async function getQuizQuestions(quizId) {
    try {
        const data = await fetchAPI(`/quiz/${quizId}/questions`);
        return data.questions || [];
    } catch (error) {
        console.error('Error fetching questions:', error);
        throw error;
    }
}

// Start quiz attempt
export async function startQuizAttempt(quizId) {
    try {
        const data = await fetchAPI(`/quiz/${quizId}/start`, {
            method: 'POST',
        });
        return data.attemptId;
    } catch (error) {
        console.error('Error starting quiz:', error);
        throw error;
    }
}

// Submit quiz answers - MAIN FUNCTION
export async function submitQuiz(quizId, attemptId, answers, timeTakenSeconds) {
    try {
        const data = await fetchAPI(`/quiz/${quizId}/submit`, {
            method: 'POST',
            body: JSON.stringify({ attemptId, answers, timeTakenSeconds }),
        });
        return data.result;
    } catch (error) {
        console.error('Error submitting quiz:', error);
        throw error;
    }
}

// Alias for backward compatibility (calls submitQuiz)
export const submitQuizAttempt = async (attemptId, answers, timeTakenSeconds) => {
    console.warn('⚠️ submitQuizAttempt is deprecated. Please use submitQuiz(quizId, attemptId, answers, timeTakenSeconds)');
    throw new Error('Please use submitQuiz with quizId parameter');
};

// Get user's quiz attempts
export async function getUserQuizAttempts() {
    try {
        const data = await fetchAPI('/quiz/attempts/all');
        return data.attempts || [];
    } catch (error) {
        console.error('Error fetching attempts:', error);
        throw error;
    }
}

// Get specific quiz attempt by ID
export async function getQuizAttemptById(attemptId) {
    try {
        const data = await fetchAPI(`/quiz/attempt/${attemptId}`);
        return data.attempt;
    } catch (error) {
        console.error('Error fetching attempt:', error);
        throw error;
    }
}

// ============= AI-GENERATED QUIZZES =============

// Generate AI quiz on the fly
export async function generateAIQuiz(topic, count = 10) {
    try {
        const data = await fetchAPI(`/quiz/ai/generate?topic=${encodeURIComponent(topic)}&count=${count}`);
        return data.quiz;
    } catch (error) {
        console.error('Error generating AI quiz:', error);
        throw error;
    }
}

// Submit AI-generated quiz
export async function submitAIQuiz(quizData) {
    try {
        const data = await fetchAPI('/quiz/ai/submit', {
            method: 'POST',
            body: JSON.stringify(quizData),
        });
        return data.result;
    } catch (error) {
        console.error('Error submitting AI quiz:', error);
        throw error;
    }
}

// ============= QUIZ STATISTICS =============

// Get quiz statistics for user
export async function getQuizStats() {
    try {
        const attempts = await getUserQuizAttempts();
        const completed = attempts.filter(a => a.status === 'completed');
        
        const totalQuizzes = completed.length;
        const averageScore = totalQuizzes > 0 
            ? completed.reduce((sum, a) => sum + (a.percentage || 0), 0) / totalQuizzes 
            : 0;
        const perfectScores = completed.filter(a => a.percentage === 100).length;
        const totalQuestionsAnswered = completed.reduce((sum, a) => sum + (a.total_questions || 0), 0);
        const correctAnswers = completed.reduce((sum, a) => sum + (a.correct_count || 0), 0);
        
        return {
            totalQuizzes,
            averageScore: Math.round(averageScore),
            perfectScores,
            totalQuestionsAnswered,
            correctAnswers,
            accuracy: totalQuestionsAnswered > 0 ? Math.round((correctAnswers / totalQuestionsAnswered) * 100) : 0
        };
    } catch (error) {
        console.error('Error fetching quiz stats:', error);
        return {
            totalQuizzes: 0,
            averageScore: 0,
            perfectScores: 0,
            totalQuestionsAnswered: 0,
            correctAnswers: 0,
            accuracy: 0
        };
    }
}

// Get quiz recommendations based on user performance
export async function getQuizRecommendations() {
    try {
        const quizzes = await getQuizzes();
        const attempts = await getUserQuizAttempts();
        
        const completedQuizIds = new Set(attempts.map(a => a.quiz_id));
        const recommended = quizzes.filter(q => !completedQuizIds.has(q.id));
        
        const difficultyOrder = { 'easy': 1, 'medium': 2, 'hard': 3 };
        recommended.sort((a, b) => (difficultyOrder[a.difficulty] || 2) - (difficultyOrder[b.difficulty] || 2));
        
        return recommended.slice(0, 3);
    } catch (error) {
        console.error('Error getting recommendations:', error);
        return [];
    }
}

// ============= OFFLINE SUPPORT =============

// Store pending quiz submission
export function storePendingQuizSubmission(quizData) {
    const pending = JSON.parse(localStorage.getItem('pendingQuizSubmissions') || '[]');
    pending.push({
        ...quizData,
        timestamp: Date.now()
    });
    localStorage.setItem('pendingQuizSubmissions', JSON.stringify(pending));
}

// Retry pending quiz submissions
export async function retryPendingSubmissions() {
    const pending = JSON.parse(localStorage.getItem('pendingQuizSubmissions') || '[]');
    const results = [];
    
    for (const submission of pending) {
        try {
            const result = await submitAIQuiz(submission);
            results.push({ success: true, submission, result });
        } catch (error) {
            results.push({ success: false, submission, error });
        }
    }
    
    const failed = results.filter(r => !r.success).map(r => r.submission);
    localStorage.setItem('pendingQuizSubmissions', JSON.stringify(failed));
    
    return results;
}

// Setup offline sync
export function setupOfflineSync() {
    window.addEventListener('online', async () => {
        console.log('🌐 Back online, syncing quiz submissions...');
        const results = await retryPendingSubmissions();
        const successCount = results.filter(r => r.success).length;
        if (successCount > 0) {
            console.log(`✅ Synced ${successCount} quiz submissions`);
        }
    });
}

// ============= HELPER FUNCTIONS =============

// Clear all quiz caches
export function clearQuizCache() {
    console.log('🗑️ Quiz cache cleared');
}

// Preload quiz data
export async function preloadQuizData(quizIds) {
    const promises = [];
    for (const quizId of quizIds) {
        promises.push(getQuizById(quizId));
        promises.push(getQuizQuestions(quizId));
    }
    await Promise.all(promises);
    console.log('📦 Quiz data preloaded');
}

// Export quiz results as text
export function exportQuizResults(attempt) {
    const content = `
╔══════════════════════════════════════════════════════════╗
║                    QUIZ RESULTS                          ║
╠══════════════════════════════════════════════════════════╣
║ Quiz: ${attempt.quiz?.title || 'Quiz'}
║ Date: ${new Date(attempt.completed_at).toLocaleString()}
║ Score: ${Math.round(attempt.percentage)}%
║ Correct: ${attempt.correct_count}/${attempt.total_questions}
║ Time Taken: ${Math.floor(attempt.time_taken_seconds / 60)}m ${attempt.time_taken_seconds % 60}s
║ Status: ${attempt.percentage >= 70 ? '✅ PASSED' : '❌ NEEDS REVIEW'}
╚══════════════════════════════════════════════════════════╝
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quiz-results-${attempt.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

// ============= EXPORT =============
export default {
    getQuizzes,
    getQuizById,
    getQuizQuestions,
    startQuizAttempt,
    submitQuiz,
    submitQuizAttempt,
    getUserQuizAttempts,
    getQuizAttemptById,
    generateAIQuiz,
    submitAIQuiz,
    getQuizStats,
    getQuizRecommendations,
    storePendingQuizSubmission,
    retryPendingSubmissions,
    setupOfflineSync,
    clearQuizCache,
    preloadQuizData,
    exportQuizResults
};