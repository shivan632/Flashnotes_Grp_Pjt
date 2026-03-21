// frontend/src/services/quizService.js
// Quiz API service with enhanced features

const API_URL = 'https://flashnotes-grp-pjt.onrender.com/api';

// Cache for quizzes and questions
let quizCache = new Map();
let questionsCache = new Map();
let attemptsCache = [];

// Offline mode flag
let isOffline = false;

// Get auth token
const getToken = () => localStorage.getItem('authToken');

// Generic fetch wrapper with retry and offline support
async function fetchAPI(endpoint, options = {}, retries = 2) {
    const token = getToken();
    
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
    
    let lastError;
    
    for (let i = 0; i <= retries; i++) {
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
                throw new Error(data.message || `API request failed with status ${response.status}`);
            }
            
            isOffline = false;
            return data;
            
        } catch (error) {
            console.error(`Quiz API Error (attempt ${i + 1}):`, error);
            lastError = error;
            
            if (i === retries - 1) {
                isOffline = true;
                // Try to get from cache if offline
                if (options.method === 'GET') {
                    const cached = getCachedData(endpoint);
                    if (cached) {
                        console.log('Using cached data for:', endpoint);
                        return cached;
                    }
                }
                throw error;
            }
            
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
    }
    
    throw lastError;
}

// Cache management
function getCachedData(endpoint) {
    if (endpoint === '/quiz') {
        return { quizzes: quizCache.get('all') || [] };
    }
    if (endpoint.startsWith('/quiz/') && endpoint.endsWith('/questions')) {
        const quizId = endpoint.match(/\/quiz\/(\d+)\/questions/)?.[1];
        if (quizId) {
            const questions = questionsCache.get(quizId);
            if (questions) return { questions };
        }
    }
    return null;
}

function updateCache(endpoint, data) {
    if (endpoint === '/quiz') {
        quizCache.set('all', data.quizzes);
    }
    if (endpoint.startsWith('/quiz/') && endpoint.endsWith('/questions')) {
        const quizId = endpoint.match(/\/quiz\/(\d+)\/questions/)?.[1];
        if (quizId && data.questions) {
            questionsCache.set(quizId, data.questions);
        }
    }
}

// Get all quizzes with caching
export async function getQuizzes(forceRefresh = false) {
    try {
        if (!forceRefresh && quizCache.has('all')) {
            console.log('Returning cached quizzes');
            return quizCache.get('all');
        }
        
        const data = await fetchAPI('/quiz');
        const quizzes = data.quizzes || [];
        quizCache.set('all', quizzes);
        return quizzes;
    } catch (error) {
        console.error('Error fetching quizzes:', error);
        
        // Return cached data if available
        if (quizCache.has('all')) {
            console.log('Returning cached quizzes due to error');
            return quizCache.get('all');
        }
        
        return [];
    }
}

// Get single quiz by ID with caching
export async function getQuizById(quizId, forceRefresh = false) {
    try {
        const cacheKey = `quiz_${quizId}`;
        if (!forceRefresh && quizCache.has(cacheKey)) {
            return quizCache.get(cacheKey);
        }
        
        const data = await fetchAPI(`/quiz/${quizId}`);
        quizCache.set(cacheKey, data.quiz);
        return data.quiz;
    } catch (error) {
        console.error('Error fetching quiz:', error);
        
        // Return cached data if available
        const cacheKey = `quiz_${quizId}`;
        if (quizCache.has(cacheKey)) {
            return quizCache.get(cacheKey);
        }
        
        throw error;
    }
}

// Get quiz questions with caching
export async function getQuizQuestions(quizId, forceRefresh = false) {
    try {
        if (!forceRefresh && questionsCache.has(quizId)) {
            console.log(`Returning cached questions for quiz ${quizId}`);
            return questionsCache.get(quizId);
        }
        
        const data = await fetchAPI(`/quiz/${quizId}/questions`);
        const questions = data.questions || [];
        questionsCache.set(quizId, questions);
        return questions;
    } catch (error) {
        console.error('Error fetching questions:', error);
        
        // Return cached data if available
        if (questionsCache.has(quizId)) {
            return questionsCache.get(quizId);
        }
        
        throw error;
    }
}

// Start a quiz attempt with local backup
export async function startQuiz(quizId) {
    try {
        const data = await fetchAPI(`/quiz/${quizId}/start`, {
            method: 'POST'
        });
        
        // Store attempt in local storage for offline recovery
        const pendingAttempt = {
            quizId,
            attemptId: data.attemptId,
            startedAt: data.startedAt,
            status: 'pending',
            timestamp: Date.now()
        };
        
        const pendingAttempts = JSON.parse(localStorage.getItem('pendingQuizAttempts') || '[]');
        pendingAttempts.push(pendingAttempt);
        localStorage.setItem('pendingQuizAttempts', JSON.stringify(pendingAttempts));
        
        return data;
    } catch (error) {
        console.error('Error starting quiz:', error);
        
        // Create local attempt for offline mode
        if (isOffline) {
            const localAttemptId = `local_${Date.now()}`;
            const localAttempt = {
                quizId,
                attemptId: localAttemptId,
                startedAt: new Date().toISOString(),
                isLocal: true
            };
            
            const offlineAttempts = JSON.parse(localStorage.getItem('offlineQuizAttempts') || '[]');
            offlineAttempts.push(localAttempt);
            localStorage.setItem('offlineQuizAttempts', JSON.stringify(offlineAttempts));
            
            return { attemptId: localAttemptId, isLocal: true };
        }
        
        throw error;
    }
}

// Submit quiz answers with retry for offline submissions
export async function submitQuiz(quizId, attemptId, answers, timeTakenSeconds) {
    // Check if this is a local attempt (offline mode)
    const offlineAttempts = JSON.parse(localStorage.getItem('offlineQuizAttempts') || '[]');
    const isLocalAttempt = offlineAttempts.some(a => a.attemptId === attemptId);
    
    if (isLocalAttempt) {
        // Store for later submission
        const pendingSubmission = {
            quizId,
            attemptId,
            answers,
            timeTakenSeconds,
            timestamp: Date.now(),
            status: 'pending'
        };
        
        const pendingSubmissions = JSON.parse(localStorage.getItem('pendingQuizSubmissions') || '[]');
        pendingSubmissions.push(pendingSubmission);
        localStorage.setItem('pendingQuizSubmissions', JSON.stringify(pendingSubmissions));
        
        // Remove from offline attempts
        const updatedOffline = offlineAttempts.filter(a => a.attemptId !== attemptId);
        localStorage.setItem('offlineQuizAttempts', JSON.stringify(updatedOffline));
        
        // Calculate result locally
        const questions = await getQuizQuestions(quizId, true);
        let correctCount = 0;
        
        Object.entries(answers).forEach(([questionId, selectedOption]) => {
            const question = questions.find(q => q.id == questionId);
            if (question && question.correct_option === selectedOption) {
                correctCount++;
            }
        });
        
        const totalQuestions = questions.length;
        const percentage = (correctCount / totalQuestions) * 100;
        
        return {
            score: correctCount,
            totalQuestions,
            percentage,
            correctCount,
            passed: percentage >= 70,
            isLocal: true
        };
    }
    
    try {
        const data = await fetchAPI(`/quiz/${quizId}/submit`, {
            method: 'POST',
            body: JSON.stringify({
                attemptId,
                answers,
                timeTakenSeconds
            })
        });
        
        // Remove from pending attempts
        const pendingAttempts = JSON.parse(localStorage.getItem('pendingQuizAttempts') || '[]');
        const updatedPending = pendingAttempts.filter(a => a.attemptId !== attemptId);
        localStorage.setItem('pendingQuizAttempts', JSON.stringify(updatedPending));
        
        return data.result;
    } catch (error) {
        console.error('Error submitting quiz:', error);
        
        // Store for later retry
        const pendingSubmission = {
            quizId,
            attemptId,
            answers,
            timeTakenSeconds,
            timestamp: Date.now(),
            status: 'pending'
        };
        
        const pendingSubmissions = JSON.parse(localStorage.getItem('pendingQuizSubmissions') || '[]');
        pendingSubmissions.push(pendingSubmission);
        localStorage.setItem('pendingQuizSubmissions', JSON.stringify(pendingSubmissions));
        
        throw error;
    }
}

// Retry pending quiz submissions (call when back online)
export async function retryPendingSubmissions() {
    const pendingSubmissions = JSON.parse(localStorage.getItem('pendingQuizSubmissions') || '[]');
    const results = [];
    
    for (const submission of pendingSubmissions) {
        try {
            const result = await submitQuiz(
                submission.quizId,
                submission.attemptId,
                submission.answers,
                submission.timeTakenSeconds
            );
            results.push({ success: true, submission, result });
        } catch (error) {
            results.push({ success: false, submission, error });
        }
    }
    
    // Clear successful submissions
    const failedSubmissions = results.filter(r => !r.success).map(r => r.submission);
    localStorage.setItem('pendingQuizSubmissions', JSON.stringify(failedSubmissions));
    
    return results;
}

// Get user's quiz attempts with caching
export async function getQuizAttempts(forceRefresh = false) {
    try {
        if (!forceRefresh && attemptsCache.length > 0) {
            return attemptsCache;
        }
        
        const data = await fetchAPI('/quiz/attempts/all');
        attemptsCache = data.attempts || [];
        return attemptsCache;
    } catch (error) {
        console.error('Error fetching attempts:', error);
        return attemptsCache;
    }
}

// Get specific quiz attempt
export async function getQuizAttemptById(attemptId) {
    try {
        // Check if it's a local attempt
        const offlineAttempts = JSON.parse(localStorage.getItem('offlineQuizAttempts') || '[]');
        const localAttempt = offlineAttempts.find(a => a.attemptId === attemptId);
        
        if (localAttempt) {
            const quiz = await getQuizById(localAttempt.quizId);
            return {
                id: attemptId,
                quiz_id: localAttempt.quizId,
                quiz: { title: quiz?.title },
                status: 'in_progress',
                started_at: localAttempt.startedAt,
                isLocal: true
            };
        }
        
        const data = await fetchAPI(`/quiz/attempt/${attemptId}`);
        return data.attempt;
    } catch (error) {
        console.error('Error fetching attempt:', error);
        throw error;
    }
}

// Get quiz statistics
export async function getQuizStats() {
    try {
        const attempts = await getQuizAttempts();
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
        return null;
    }
}

// Clear all quiz caches
export function clearQuizCache() {
    quizCache.clear();
    questionsCache.clear();
    attemptsCache = [];
    console.log('Quiz cache cleared');
}

// Sync offline data when back online
export function setupOfflineSync() {
    window.addEventListener('online', async () => {
        console.log('Back online, syncing quiz data...');
        const results = await retryPendingSubmissions();
        const successCount = results.filter(r => r.success).length;
        if (successCount > 0) {
            console.log(`Synced ${successCount} quiz submissions`);
            // Refresh caches
            clearQuizCache();
            await getQuizzes(true);
            await getQuizAttempts(true);
        }
    });
}

// Preload quiz data for better performance
export async function preloadQuizData(quizIds) {
    const promises = [];
    
    for (const quizId of quizIds) {
        promises.push(getQuizById(quizId));
        promises.push(getQuizQuestions(quizId));
    }
    
    await Promise.all(promises);
    console.log('Quiz data preloaded');
}

// Get quiz recommendations based on user performance
export async function getQuizRecommendations() {
    try {
        const quizzes = await getQuizzes();
        const attempts = await getQuizAttempts();
        
        const completedQuizIds = new Set(attempts.map(a => a.quiz_id));
        const recommended = quizzes.filter(q => !completedQuizIds.has(q.id));
        
        // Sort by difficulty (easier first for recommendations)
        const difficultyOrder = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3 };
        recommended.sort((a, b) => (difficultyOrder[a.difficulty] || 2) - (difficultyOrder[b.difficulty] || 2));
        
        return recommended.slice(0, 3);
    } catch (error) {
        console.error('Error getting recommendations:', error);
        return [];
    }
}

// Export quiz results as PDF (simulated)
export function exportQuizResults(attempt) {
    const content = `
        Quiz Results - ${attempt.quiz?.title}
        Date: ${new Date(attempt.completed_at).toLocaleString()}
        Score: ${attempt.percentage}%
        Correct: ${attempt.correct_count}/${attempt.total_questions}
        Status: ${attempt.percentage >= 70 ? 'PASSED' : 'NEEDS REVIEW'}
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quiz-results-${attempt.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

// Add to window for debugging
if (typeof window !== 'undefined') {
    window.quizService = {
        clearQuizCache,
        getQuizStats,
        getQuizRecommendations,
        preloadQuizData,
        setupOfflineSync
    };
}