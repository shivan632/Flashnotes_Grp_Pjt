// frontend/src/pages/QuizAttemptPage.js
// Quiz Attempt Page - Take a quiz with enhanced UI

import { Sidebar } from '../components/layout/Sidebar.js';
import { AIChatSidebar } from '../components/layout/AIChatSidebar.js';
import { Header } from '../components/common/Header.js';
import { QuizQuestion } from '../components/quiz/QuizQuestion.js';
import { QuizResult } from '../components/quiz/QuizResult.js';
import { QuizTimer, DigitalTimer, TimerBar } from '../components/quiz/QuizTimer.js';
import { LoadingSpinner } from '../components/common/LoadingSpinner.js';
import { getQuizById, getQuizQuestions, startQuiz, submitQuiz } from '../services/quizService.js';
import { showError } from '../components/common/ErrorMessage.js';

let quizState = {
    id: null,
    title: '',
    questions: [],
    currentQuestion: 0,
    answers: {},
    timeLeft: 0,
    totalTime: 0,
    attemptId: null,
    status: 'loading' // loading, taking, completed
};

let timerInterval = null;

export async function QuizAttemptPage() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    if (!isAuthenticated) {
        window.location.hash = '#/login';
        return '';
    }
    
    const hash = window.location.hash;
    console.log('Current hash:', hash);
    
    const match = hash.match(/^#\/quiz\/(\d+)\/attempt$/);
    
    if (!match) {
        console.error('Invalid quiz attempt URL:', hash);
        window.location.hash = '#/quiz';
        return '';
    }
    
    const quizId = parseInt(match[1]);
    console.log('Extracted quiz ID:', quizId);
    
    if (isNaN(quizId)) {
        window.location.hash = '#/quiz';
        return '';
    }
    
    quizState.id = quizId;
    quizState.status = 'loading';
    
    return `
        <div class="min-h-screen bg-gradient-to-b from-[#111827] to-[#0F172A] relative">
            ${Sidebar()}
            ${AIChatSidebar()}
            <div id="mainContent" class="min-h-screen transition-all duration-300" 
                 style="margin-left: 256px; margin-right: 384px; width: calc(100% - 640px);">
                ${Header({ title: 'Loading Quiz...' })}
                <main class="container mx-auto px-4 py-8">
                    <div class="flex justify-center items-center h-96">
                        <div class="text-center">
                            <div class="loading-spinner w-20 h-20 mx-auto mb-4">
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                            <p class="text-[#9CA3AF] animate-pulse">Loading quiz questions...</p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    `;
}

export async function initQuizAttempt() {
    try {
        console.log('Initializing quiz attempt for ID:', quizState.id);
        
        if (!quizState.id) {
            throw new Error('Quiz ID not found');
        }
        
        // Show loading with progress
        const mainContent = document.getElementById('mainContent');
        if (mainContent) {
            mainContent.innerHTML = `
                ${Header({ title: 'Loading Quiz...' })}
                <main class="container mx-auto px-4 py-8">
                    <div class="max-w-3xl mx-auto">
                        <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-8 border border-[#374151]">
                            <div class="flex items-center gap-4 mb-6">
                                <div class="w-12 h-12 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-xl animate-pulse"></div>
                                <div class="flex-1">
                                    <div class="h-6 bg-[#374151] rounded-lg w-3/4 animate-pulse"></div>
                                    <div class="h-4 bg-[#374151] rounded-lg w-1/2 mt-2 animate-pulse"></div>
                                </div>
                            </div>
                            <div class="space-y-3">
                                ${Array(5).fill(0).map(() => `
                                    <div class="h-16 bg-[#374151] rounded-xl animate-pulse"></div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </main>
            `;
        }
        
        const quiz = await getQuizById(quizState.id);
        console.log('Quiz loaded:', quiz);
        
        if (!quiz) {
            throw new Error('Quiz not found');
        }
        
        quizState.title = quiz.title;
        
        const questions = await getQuizQuestions(quizState.id);
        console.log('Questions loaded:', questions.length);
        
        if (!questions || questions.length === 0) {
            throw new Error('No questions found for this quiz');
        }
        
        quizState.questions = questions;
        
        const result = await startQuiz(quizState.id);
        console.log('Start quiz result:', result);
        
        if (!result || !result.attemptId) {
            throw new Error('Failed to start quiz attempt');
        }
        
        quizState.attemptId = result.attemptId;
        quizState.totalTime = (quiz.time_limit_minutes || 15) * 60;
        quizState.timeLeft = quizState.totalTime;
        quizState.status = 'taking';
        
        quizState.answers = {};
        questions.forEach(q => {
            quizState.answers[q.id] = undefined;
        });
        
        startTimer();
        renderQuiz();
        
    } catch (error) {
        console.error('Error initializing quiz:', error);
        showError(error.message || 'Failed to load quiz', 'error');
        
        setTimeout(() => {
            window.location.hash = '#/quiz';
        }, 2000);
    }
}

function renderQuiz() {
    const mainContent = document.getElementById('mainContent');
    if (!mainContent) return;
    
    const currentQ = quizState.questions[quizState.currentQuestion];
    const progress = ((quizState.currentQuestion + 1) / quizState.questions.length) * 100;
    
    mainContent.innerHTML = `
        ${Header({ title: quizState.title })}
        <main class="container mx-auto px-4 py-8 max-w-4xl">
            <div class="animate-fadeInUp">
                <!-- Quiz Header with Enhanced Timer -->
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <div class="flex items-center gap-2 mb-2">
                            <div class="w-8 h-8 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-lg flex items-center justify-center">
                                <span class="text-white text-sm font-bold">${quizState.currentQuestion + 1}</span>
                            </div>
                            <h1 class="text-2xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">
                                ${quizState.title}
                            </h1>
                        </div>
                        <p class="text-sm text-[#9CA3AF]">Question ${quizState.currentQuestion + 1} of ${quizState.questions.length}</p>
                    </div>
                    <div class="flex items-center gap-4">
                        ${DigitalTimer({ 
                            seconds: quizState.timeLeft, 
                            totalSeconds: quizState.totalTime 
                        })}
                    </div>
                </div>
                
                <!-- Enhanced Progress Bar -->
                <div class="mb-8">
                    <div class="flex justify-between text-xs text-[#9CA3AF] mb-2">
                        <span>Progress</span>
                        <span>${Math.round(progress)}%</span>
                    </div>
                    <div class="w-full bg-[#374151] rounded-full h-2 overflow-hidden">
                        <div class="bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] h-2 rounded-full transition-all duration-500 ease-out" 
                             style="width: ${progress}%"></div>
                    </div>
                </div>
                
                <!-- Question Card with Animation -->
                <div class="quiz-question-container animate-slideInUp">
                    ${QuizQuestion({
                        question: currentQ,
                        index: quizState.currentQuestion,
                        total: quizState.questions.length,
                        selectedOption: quizState.answers[currentQ.id],
                        onSelect: (option) => selectAnswer(currentQ.id, option)
                    })}
                </div>
                
                <!-- Navigation Buttons with Enhanced UI -->
                <div class="flex justify-between mt-8 gap-4">
                    <button id="prevQuestionBtn" 
                            class="group relative overflow-hidden px-6 py-3 bg-[#374151] hover:bg-[#4B5563] text-[#E5E7EB] rounded-xl transition-all duration-300 flex items-center gap-2 ${quizState.currentQuestion === 0 ? 'opacity-50 cursor-not-allowed' : ''}"
                            ${quizState.currentQuestion === 0 ? 'disabled' : ''}>
                        <svg class="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                        </svg>
                        Previous
                    </button>
                    ${quizState.currentQuestion === quizState.questions.length - 1 ? `
                        <button id="submitQuizBtn" 
                                class="group relative overflow-hidden px-8 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2">
                            <span>Submit Quiz</span>
                            <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                            <div class="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </button>
                    ` : `
                        <button id="nextQuestionBtn" 
                                class="group relative overflow-hidden px-8 py-3 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] hover:from-[#60A5FA] hover:to-[#8B5CF6] text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2">
                            <span>Next Question</span>
                            <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                            <div class="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </button>
                    `}
                </div>
                
                <!-- Answer Status Indicator -->
                <div class="mt-6 flex justify-center gap-2">
                    ${quizState.questions.map((q, idx) => {
                        const isAnswered = quizState.answers[q.id] !== undefined;
                        const isCurrent = idx === quizState.currentQuestion;
                        return `
                            <div class="w-2 h-2 rounded-full transition-all duration-300 ${isAnswered ? 'bg-[#3B82F6]' : 'bg-[#374151]'} ${isCurrent ? 'scale-150 ring-2 ring-[#3B82F6]' : ''}"></div>
                        `;
                    }).join('')}
                </div>
            </div>
        </main>
    `;
    
    attachQuizEvents();
}

function attachQuizEvents() {
    const prevBtn = document.getElementById('prevQuestionBtn');
    if (prevBtn && quizState.currentQuestion > 0) {
        prevBtn.addEventListener('click', () => {
            quizState.currentQuestion--;
            renderQuiz();
        });
    }
    
    const nextBtn = document.getElementById('nextQuestionBtn');
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (quizState.currentQuestion < quizState.questions.length - 1) {
                const currentQ = quizState.questions[quizState.currentQuestion];
                if (quizState.answers[currentQ.id] === undefined) {
                    showError('Please select an answer before proceeding', 'warning');
                    return;
                }
                quizState.currentQuestion++;
                renderQuiz();
            }
        });
    }
    
    const submitBtn = document.getElementById('submitQuizBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', submitQuizHandler);
    }
    
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const questionId = parseInt(e.target.name.split('-')[1]);
            const value = parseInt(e.target.value);
            selectAnswer(questionId, value);
            
            // Add visual feedback
            const label = e.target.closest('.option-label');
            if (label) {
                label.classList.add('ring-2', 'ring-[#3B82F6]', 'scale-[1.02]');
                setTimeout(() => {
                    label.classList.remove('ring-2', 'ring-[#3B82F6]', 'scale-[1.02]');
                }, 200);
            }
        });
    });
}

function selectAnswer(questionId, optionIndex) {
    console.log('Selected answer:', { questionId, optionIndex });
    quizState.answers[questionId] = optionIndex;
    
    // Update answer status indicator
    const indicators = document.querySelectorAll('.w-2.h-2');
    if (indicators[quizState.currentQuestion]) {
        indicators[quizState.currentQuestion].classList.add('bg-[#3B82F6]');
        indicators[quizState.currentQuestion].classList.remove('bg-[#374151]');
    }
}

function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
        if (quizState.status !== 'taking') return;
        
        quizState.timeLeft--;
        
        const timerElement = document.querySelector('.digital-timer');
        if (timerElement) {
            const minutes = Math.floor(quizState.timeLeft / 60);
            const seconds = quizState.timeLeft % 60;
            const percentage = (quizState.timeLeft / quizState.totalTime) * 100;
            const isWarning = percentage < 20;
            
            const minutesSpan = timerElement.querySelector('.minutes');
            const secondsSpan = timerElement.querySelector('.seconds');
            const progressBar = timerElement.querySelector('.timer-progress');
            
            if (minutesSpan) minutesSpan.textContent = minutes.toString().padStart(2, '0');
            if (secondsSpan) secondsSpan.textContent = seconds.toString().padStart(2, '0');
            if (progressBar) progressBar.style.width = `${percentage}%`;
            
            if (isWarning) {
                minutesSpan?.classList.add('text-red-500');
                secondsSpan?.classList.add('text-red-500');
            }
        }
        
        if (quizState.timeLeft <= 0) {
            clearInterval(timerInterval);
            submitQuizHandler();
        }
    }, 1000);
}

async function submitQuizHandler() {
    if (quizState.status !== 'taking') return;
    
    const unanswered = quizState.questions.filter(q => quizState.answers[q.id] === undefined);
    if (unanswered.length > 0) {
        if (!confirm(`⚠️ You have ${unanswered.length} unanswered question(s). Submit anyway?`)) {
            return;
        }
    }
    
    clearInterval(timerInterval);
    quizState.status = 'submitting';
    
    const submitBtn = document.getElementById('submitQuizBtn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<div class="loading-spinner-small mx-auto"></div> Submitting...';
    }
    
    try {
        const timeTaken = quizState.totalTime - quizState.timeLeft;
        const result = await submitQuiz(
            quizState.id,
            quizState.attemptId,
            quizState.answers,
            timeTaken
        );
        
        console.log('Quiz result:', result);
        quizState.status = 'completed';
        showResult(result);
        
    } catch (error) {
        console.error('Error submitting quiz:', error);
        showError('Failed to submit quiz', 'error');
        quizState.status = 'taking';
        
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Submit Quiz';
        }
    }
}

function showResult(result) {
    const mainContent = document.getElementById('mainContent');
    if (!mainContent) return;
    
    mainContent.innerHTML = `
        ${Header({ title: 'Quiz Results' })}
        <main class="container mx-auto px-4 py-8 max-w-3xl">
            <div class="animate-fadeInUp">
                ${QuizResult({
                    result,
                    onRetry: () => {
                        window.location.hash = `#/quiz/${quizState.id}/attempt`;
                    },
                    onHome: () => {
                        window.location.hash = '#/quiz';
                    }
                })}
            </div>
        </main>
    `;
    
    const retryBtn = document.getElementById('retryQuizBtn');
    if (retryBtn) {
        retryBtn.addEventListener('click', () => {
            quizState = {
                ...quizState,
                currentQuestion: 0,
                answers: {},
                timeLeft: quizState.totalTime,
                status: 'loading'
            };
            window.location.hash = `#/quiz/${quizState.id}/attempt`;
        });
    }
    
    const homeBtn = document.getElementById('homeBtn');
    if (homeBtn) {
        homeBtn.addEventListener('click', () => {
            window.location.hash = '#/quiz';
        });
    }
}

export function cleanupQuiz() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

// Add CSS animations
const quizAttemptStyles = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .animate-fadeInUp {
        animation: fadeInUp 0.5s ease-out forwards;
    }
    
    .animate-slideInUp {
        animation: slideInUp 0.4s ease-out forwards;
    }
    
    .quiz-question-container {
        opacity: 0;
        animation: fadeInUp 0.5s ease-out forwards;
    }
`;

if (!document.querySelector('#quiz-attempt-styles')) {
    const style = document.createElement('style');
    style.id = 'quiz-attempt-styles';
    style.textContent = quizAttemptStyles;
    document.head.appendChild(style);
}