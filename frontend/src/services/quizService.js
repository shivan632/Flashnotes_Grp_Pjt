// frontend/src/services/quizService.js
// Quiz API service

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
        console.error('Quiz API Error:', error);
        throw error;
    }
}

// Get all quizzes
export async function getQuizzes() {
    try {
        const data = await fetchAPI('/quiz');
        return data.quizzes || [];
    } catch (error) {
        console.error('Error fetching quizzes:', error);
        return [];
    }
}

// Get single quiz by ID
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

// Start a quiz attempt
export async function startQuiz(quizId) {
    try {
        const data = await fetchAPI(`/quiz/${quizId}/start`, {
            method: 'POST'
        });
        return data;
    } catch (error) {
        console.error('Error starting quiz:', error);
        throw error;
    }
}

// Submit quiz answers
export async function submitQuiz(quizId, attemptId, answers, timeTakenSeconds) {
    try {
        const data = await fetchAPI(`/quiz/${quizId}/submit`, {
            method: 'POST',
            body: JSON.stringify({
                attemptId,
                answers,
                timeTakenSeconds
            })
        });
        return data.result;
    } catch (error) {
        console.error('Error submitting quiz:', error);
        throw error;
    }
}

// Get user's quiz attempts
export async function getQuizAttempts() {
    try {
        const data = await fetchAPI('/quiz/attempts/all');
        return data.attempts || [];
    } catch (error) {
        console.error('Error fetching attempts:', error);
        return [];
    }
}

// Get specific quiz attempt
export async function getQuizAttemptById(attemptId) {
    try {
        const data = await fetchAPI(`/quiz/attempt/${attemptId}`);
        return data.attempt;
    } catch (error) {
        console.error('Error fetching attempt:', error);
        throw error;
    }
}