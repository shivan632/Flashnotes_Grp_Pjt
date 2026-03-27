// frontend/src/pages/QuizAttemptPage.js
// Quiz Attempt Page - Take a quiz

import { startQuizAttempt, submitQuiz, getQuizById, getQuizQuestions } from '../services/quizService.js';
import { showError, showSuccess } from '../components/common/ErrorMessage.js';

let quizTimer = null;
let timeLeft = 0;
let currentQuizId = null;
let currentAttemptId = null;
let startTime = null;

export async function QuizAttemptPage() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    if (!isAuthenticated) {
        window.location.hash = '#/login';
        return '';
    }
    
    // Get quiz ID from URL
    const hash = window.location.hash;
    const match = hash.match(/\/quiz\/(\d+)\/attempt/);
    const quizId = match ? match[1] : null;
    
    if (!quizId) {
        window.location.hash = '#/quiz';
        return '';
    }
    
    currentQuizId = quizId;
    
    try {
        // Fetch quiz details and questions
        const [quiz, questions] = await Promise.all([
            getQuizById(quizId),
            getQuizQuestions(quizId)
        ]);
        
        if (!quiz) {
            showError('Quiz not found');
            window.location.hash = '#/quiz';
            return '';
        }
        
        return `
            <div class="min-h-screen bg-gradient-to-b from-[#111827] to-[#0F172A] py-12 px-4">
                <div class="max-w-4xl mx-auto">
                    <!-- Header -->
                    <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-6 mb-8 border border-[#374151]">
                        <div class="flex justify-between items-start">
                            <div>
                                <h1 class="text-2xl font-bold text-white mb-2">${escapeHtml(quiz.title)}</h1>
                                <p class="text-gray-400">Topic: ${escapeHtml(quiz.topic)}</p>
                                <div class="flex gap-2 mt-3">
                                    <span class="px-2 py-1 bg-[#3B82F6]/20 text-[#3B82F6] text-xs rounded-full">${quiz.difficulty || 'Medium'}</span>
                                    <span class="px-2 py-1 bg-[#374151] text-gray-400 text-xs rounded-full">${questions.length} questions</span>
                                </div>
                            </div>
                            <div id="quizTimer" class="bg-[#111827] rounded-xl px-4 py-2 text-center border border-[#374151]">
                                <div class="text-xs text-gray-400">Time Left</div>
                                <div class="text-2xl font-bold text-[#3B82F6]">--:--</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Questions Form -->
                    <form id="quizForm" class="space-y-6">
                        ${questions.map((q, index) => `
                            <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-6 border border-[#374151] hover:border-[#3B82F6]/30 transition-all">
                                <div class="flex items-start gap-3 mb-4">
                                    <span class="w-8 h-8 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full flex items-center justify-center text-white text-sm font-bold">${index + 1}</span>
                                    <h3 class="text-lg font-medium text-white flex-1">${escapeHtml(q.question)}</h3>
                                </div>
                                
                                <div class="space-y-3 ml-11">
                                    ${(q.options || []).map((option, optIndex) => `
                                        <label class="flex items-center gap-3 p-3 bg-[#111827] rounded-xl cursor-pointer hover:bg-[#1F2937] transition-all group">
                                            <input type="radio" 
                                                   name="q${q.id}" 
                                                   value="${optIndex}"
                                                   class="w-4 h-4 text-[#3B82F6] focus:ring-[#3B82F6]">
                                            <span class="text-gray-300 group-hover:text-white transition-colors">${escapeHtml(option)}</span>
                                        </label>
                                    `).join('')}
                                </div>
                            </div>
                        `).join('')}
                        
                        <div class="flex gap-4">
                            <button type="submit" 
                                    id="submitQuizBtn"
                                    class="flex-1 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] hover:from-[#60A5FA] hover:to-[#8B5CF6] text-white py-3 rounded-xl font-medium transition-all transform hover:scale-105 shadow-lg">
                                Submit Quiz
                            </button>
                            <button type="button" 
                                    id="cancelQuizBtn"
                                    class="px-6 bg-[#374151] hover:bg-[#4B5563] text-white rounded-xl transition-all">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
    } catch (error) {
        console.error('Error loading quiz attempt:', error);
        showError('Failed to load quiz');
        return `
            <div class="min-h-screen flex items-center justify-center">
                <div class="text-center">
                    <div class="text-red-500 text-xl mb-4">Failed to load quiz</div>
                    <a href="#/quiz" class="bg-[#3B82F6] text-white px-4 py-2 rounded-lg">Back to Quizzes</a>
                </div>
            </div>
        `;
    }
}

// Initialize quiz attempt
export async function initQuizAttempt() {
    const hash = window.location.hash;
    const match = hash.match(/\/quiz\/(\d+)\/attempt/);
    const quizId = match ? match[1] : null;
    
    if (!quizId) {
        console.log('No quiz ID found in URL');
        return;
    }
    
    currentQuizId = quizId;
    startTime = Date.now();
    
    const form = document.getElementById('quizForm');
    const cancelBtn = document.getElementById('cancelQuizBtn');
    const timerDisplay = document.getElementById('quizTimer');
    
    if (!form) {
        console.log('Quiz form not found');
        return;
    }
    
    try {
        // Start quiz attempt
        console.log('Starting quiz attempt for quiz ID:', quizId);
        currentAttemptId = await startQuizAttempt(quizId);
        console.log('Quiz attempt started with ID:', currentAttemptId);
        
        if (!currentAttemptId) {
            throw new Error('Failed to start quiz attempt');
        }
        
        // Set time limit (30 minutes default)
        const timeLimit = 30 * 60; // 30 minutes in seconds
        timeLeft = timeLimit;
        
        // Start timer
        if (timerDisplay) {
            updateTimerDisplay(timerDisplay);
            if (quizTimer) clearInterval(quizTimer);
            quizTimer = setInterval(() => {
                if (timeLeft > 0) {
                    timeLeft--;
                    updateTimerDisplay(timerDisplay);
                    
                    if (timeLeft === 0) {
                        clearInterval(quizTimer);
                        submitQuizAuto(form);
                    }
                }
            }, 1000);
        }
        
    } catch (error) {
        console.error('Error starting quiz:', error);
        showError(error.message || 'Failed to start quiz. Please try again.');
        setTimeout(() => {
            window.location.hash = '#/quiz';
        }, 2000);
        return;
    }
    
    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await submitQuizManual(form);
    });
    
    // Handle cancel button
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to cancel this quiz? Your progress will be lost.')) {
                if (quizTimer) clearInterval(quizTimer);
                window.location.hash = '#/quiz';
            }
        });
    }
}

// Auto submit when time runs out
async function submitQuizAuto(form) {
    if (!currentAttemptId) {
        showError('Quiz session expired. Please restart the quiz.');
        window.location.hash = '#/quiz';
        return;
    }
    
    const submitBtn = document.getElementById('submitQuizBtn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<div class="loading-spinner-small mx-auto"></div> Time\'s Up! Submitting...';
    }
    
    // Collect answers
    const answers = collectAnswers(form);
    const timeTakenSeconds = Math.floor((Date.now() - startTime) / 1000);
    
    try {
        const result = await submitQuiz(currentQuizId, currentAttemptId, answers, timeTakenSeconds);
        
        showSuccess(`Time's up! You scored ${result.score}/${result.totalQuestions} (${Math.round(result.percentage)}%)`);
        setTimeout(() => {
            window.location.hash = '#/score';
        }, 2500);
    } catch (error) {
        console.error('Error auto-submitting quiz:', error);
        showError(error.message || 'Failed to submit quiz. Please try again.');
        window.location.hash = '#/quiz';
    }
}

// Manual submit
async function submitQuizManual(form) {
    if (!currentAttemptId) {
        showError('Quiz session expired. Please restart the quiz.');
        window.location.hash = '#/quiz';
        return;
    }
    
    // Check if all questions are answered
    const allInputs = form.querySelectorAll('input[type="radio"]');
    const questionGroups = {};
    allInputs.forEach(input => {
        const name = input.name;
        if (!questionGroups[name]) questionGroups[name] = [];
        questionGroups[name].push(input);
    });
    
    const unanswered = [];
    for (const [name, inputs] of Object.entries(questionGroups)) {
        const isAnswered = Array.from(inputs).some(input => input.checked);
        if (!isAnswered) {
            unanswered.push(name);
        }
    }
    
    if (unanswered.length > 0) {
        if (!confirm(`⚠️ You have ${unanswered.length} unanswered question(s). Submit anyway?`)) {
            return;
        }
    }
    
    const submitBtn = document.getElementById('submitQuizBtn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<div class="loading-spinner-small mx-auto"></div> Submitting...';
    submitBtn.disabled = true;
    
    if (quizTimer) clearInterval(quizTimer);
    
    // Collect answers
    const answers = collectAnswers(form);
    const timeTakenSeconds = Math.floor((Date.now() - startTime) / 1000);
    
    try {
        const result = await submitQuiz(currentQuizId, currentAttemptId, answers, timeTakenSeconds);
        
        showSuccess(`Quiz submitted! You scored ${result.score}/${result.totalQuestions} (${Math.round(result.percentage)}%)`);
        
        setTimeout(() => {
            window.location.hash = '#/score';
        }, 2000);
        
    } catch (error) {
        console.error('Error submitting quiz:', error);
        showError(error.message || 'Failed to submit quiz. Please try again.');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Restart timer
        if (quizTimer) {
            const timerDisplay = document.getElementById('quizTimer');
            quizTimer = setInterval(() => {
                if (timeLeft > 0) {
                    timeLeft--;
                    if (timerDisplay) updateTimerDisplay(timerDisplay);
                }
            }, 1000);
        }
    }
}

// Collect answers from form
function collectAnswers(form) {
    const formData = new FormData(form);
    const answers = {};
    
    for (let [key, value] of formData.entries()) {
        const questionId = key.replace('q', '');
        answers[questionId] = parseInt(value);
    }
    
    return answers;
}

// Update timer display
function updateTimerDisplay(container) {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    const timerValue = container.querySelector('.text-2xl');
    if (timerValue) {
        timerValue.textContent = timeString;
        
        if (timeLeft < 60) {
            timerValue.classList.add('text-red-500');
            timerValue.classList.remove('text-[#3B82F6]');
        } else if (timeLeft < 300) {
            timerValue.classList.add('text-yellow-500');
            timerValue.classList.remove('text-[#3B82F6]');
        } else {
            timerValue.classList.remove('text-red-500', 'text-yellow-500');
            timerValue.classList.add('text-[#3B82F6]');
        }
    }
}

// Cleanup quiz timer
export function cleanupQuiz() {
    if (quizTimer) {
        clearInterval(quizTimer);
        quizTimer = null;
    }
    currentAttemptId = null;
    currentQuizId = null;
    startTime = null;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add CSS animations
const quizAttemptStyles = `
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .animate-fadeInUp {
        animation: fadeInUp 0.5s ease-out forwards;
    }
    
    .loading-spinner-small {
        width: 20px;
        height: 20px;
        border: 2px solid rgba(255,255,255,0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
        display: inline-block;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;

if (!document.querySelector('#quiz-attempt-styles')) {
    const style = document.createElement('style');
    style.id = 'quiz-attempt-styles';
    style.textContent = quizAttemptStyles;
    document.head.appendChild(style);
}