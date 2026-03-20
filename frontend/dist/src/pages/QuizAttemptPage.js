// frontend/src/pages/QuizAttemptPage.js
// Quiz Attempt Page - Take a quiz

import { Sidebar } from '../components/layout/Sidebar.js';
import { AIChatSidebar } from '../components/layout/AIChatSidebar.js';
import { Header } from '../components/common/Header.js';
import { QuizQuestion } from '../components/quiz/QuizQuestion.js';
import { QuizResult } from '../components/quiz/QuizResult.js';
import { QuizTimer } from '../components/quiz/QuizTimer.js';
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
    
    // Extract quiz ID from hash - FIXED
    const hash = window.location.hash;
    console.log('Current hash:', hash);
    
    // Match pattern #/quiz/123/attempt
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
    
    // Show loading state
    return `
        <div class="min-h-screen bg-[#111827] relative">
            ${Sidebar()}
            ${AIChatSidebar()}
            <div id="mainContent" class="min-h-screen transition-all duration-300" 
                 style="margin-left: 256px; margin-right: 384px; width: calc(100% - 640px);">
                ${Header({ title: 'Loading Quiz...' })}
                <main class="container mx-auto px-4 py-8">
                    <div class="flex justify-center items-center h-64">
                        ${LoadingSpinner()}
                    </div>
                </main>
            </div>
        </div>
    `;
}

// Initialize quiz attempt
export async function initQuizAttempt() {
    try {
        console.log('Initializing quiz attempt for ID:', quizState.id);
        
        if (!quizState.id) {
            throw new Error('Quiz ID not found');
        }
        
        // Get quiz details
        const quiz = await getQuizById(quizState.id);
        console.log('Quiz loaded:', quiz);
        
        if (!quiz) {
            throw new Error('Quiz not found');
        }
        
        quizState.title = quiz.title;
        
        // Get questions
        const questions = await getQuizQuestions(quizState.id);
        console.log('Questions loaded:', questions.length);
        
        if (!questions || questions.length === 0) {
            throw new Error('No questions found for this quiz');
        }
        
        quizState.questions = questions;
        
        // Start quiz attempt
        const result = await startQuiz(quizState.id);
        console.log('Start quiz result:', result);
        
        if (!result || !result.attemptId) {
            throw new Error('Failed to start quiz attempt');
        }
        
        quizState.attemptId = result.attemptId;
        
        // Set timer
        quizState.totalTime = (quiz.time_limit_minutes || 15) * 60;
        quizState.timeLeft = quizState.totalTime;
        quizState.status = 'taking';
        
        // Initialize answers object
        quizState.answers = {};
        questions.forEach(q => {
            quizState.answers[q.id] = undefined;
        });
        
        // Start timer
        startTimer();
        
        // Render quiz
        renderQuiz();
        
    } catch (error) {
        console.error('Error initializing quiz:', error);
        showError(error.message || 'Failed to load quiz', 'error');
        
        // Redirect back to quiz page after 2 seconds
        setTimeout(() => {
            window.location.hash = '#/quiz';
        }, 2000);
    }
}

// Render quiz interface
function renderQuiz() {
    const mainContent = document.getElementById('mainContent');
    if (!mainContent) return;
    
    const currentQ = quizState.questions[quizState.currentQuestion];
    
    mainContent.innerHTML = `
        ${Header({ title: quizState.title })}
        <main class="container mx-auto px-4 py-8">
            <!-- Quiz Header -->
            <div class="flex justify-between items-center mb-6">
                <div>
                    <h1 class="text-2xl font-bold text-[#E5E7EB]">${quizState.title}</h1>
                    <p class="text-sm text-[#9CA3AF] mt-1">Question ${quizState.currentQuestion + 1} of ${quizState.questions.length}</p>
                </div>
                ${QuizTimer({ 
                    seconds: quizState.timeLeft, 
                    totalSeconds: quizState.totalTime 
                })}
            </div>
            
            <!-- Progress Bar -->
            <div class="w-full bg-[#374151] rounded-full h-2 mb-8">
                <div class="bg-[#3B82F6] h-2 rounded-full transition-all duration-300" 
                     style="width: ${((quizState.currentQuestion + 1) / quizState.questions.length) * 100}%"></div>
            </div>
            
            <!-- Question -->
            ${QuizQuestion({
                question: currentQ,
                index: quizState.currentQuestion,
                total: quizState.questions.length,
                selectedOption: quizState.answers[currentQ.id],
                onSelect: (option) => selectAnswer(currentQ.id, option)
            })}
            
            <!-- Navigation Buttons -->
            <div class="flex justify-between mt-6">
                <button id="prevQuestionBtn" 
                        class="px-6 py-2 bg-[#374151] text-[#E5E7EB] rounded-lg hover:bg-[#4B5563] transition-all ${quizState.currentQuestion === 0 ? 'opacity-50 cursor-not-allowed' : ''}"
                        ${quizState.currentQuestion === 0 ? 'disabled' : ''}>
                    Previous
                </button>
                ${quizState.currentQuestion === quizState.questions.length - 1 ? `
                    <button id="submitQuizBtn" class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all">
                        Submit Quiz
                    </button>
                ` : `
                    <button id="nextQuestionBtn" class="px-6 py-2 bg-[#3B82F6] hover:bg-[#60A5FA] text-white rounded-lg transition-all">
                        Next
                    </button>
                `}
            </div>
        </main>
    `;
    
    // Attach event listeners
    attachQuizEvents();
}

// Attach quiz events
function attachQuizEvents() {
    // Previous button
    const prevBtn = document.getElementById('prevQuestionBtn');
    if (prevBtn && quizState.currentQuestion > 0) {
        prevBtn.addEventListener('click', () => {
            quizState.currentQuestion--;
            renderQuiz();
        });
    }
    
    // Next button
    const nextBtn = document.getElementById('nextQuestionBtn');
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (quizState.currentQuestion < quizState.questions.length - 1) {
                // Check if current question is answered
                const currentQ = quizState.questions[quizState.currentQuestion];
                if (quizState.answers[currentQ.id] === undefined) {
                    alert('Please select an answer before proceeding');
                    return;
                }
                quizState.currentQuestion++;
                renderQuiz();
            }
        });
    }
    
    // Submit button
    const submitBtn = document.getElementById('submitQuizBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', submitQuizHandler);
    }
    
    // Radio buttons
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const questionId = parseInt(e.target.name.split('-')[1]);
            const value = parseInt(e.target.value);
            selectAnswer(questionId, value);
        });
    });
}

// Select answer
function selectAnswer(questionId, optionIndex) {
    console.log('Selected answer:', { questionId, optionIndex });
    quizState.answers[questionId] = optionIndex;
}

// Start timer
function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
        if (quizState.status !== 'taking') return;
        
        quizState.timeLeft--;
        
        // Update timer display
        const timerElement = document.querySelector('.quiz-timer');
        if (timerElement) {
            const minutes = Math.floor(quizState.timeLeft / 60);
            const seconds = quizState.timeLeft % 60;
            const timerColor = quizState.timeLeft < quizState.totalTime * 0.2 ? 'text-red-500' : 
                              quizState.timeLeft < quizState.totalTime * 0.5 ? 'text-yellow-500' : 'text-[#3B82F6]';
            
            timerElement.querySelector('span').textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            timerElement.querySelector('span').className = `font-mono text-lg ${timerColor}`;
            timerElement.querySelector('svg').className = `w-5 h-5 ${timerColor}`;
        }
        
        // Auto-submit when time runs out
        if (quizState.timeLeft <= 0) {
            clearInterval(timerInterval);
            submitQuizHandler();
        }
    }, 1000);
}

// Submit quiz handler
async function submitQuizHandler() {
    if (quizState.status !== 'taking') return;
    
    // Check if all questions are answered
    const unanswered = quizState.questions.filter(q => quizState.answers[q.id] === undefined);
    if (unanswered.length > 0) {
        if (!confirm(`You have ${unanswered.length} unanswered question(s). Submit anyway?`)) {
            return;
        }
    }
    
    clearInterval(timerInterval);
    quizState.status = 'submitting';
    
    // Show loading
    const submitBtn = document.getElementById('submitQuizBtn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Submitting...';
    }
    
    try {
        const timeTaken = quizState.totalTime - quizState.timeLeft;
        console.log('Submitting quiz with data:', {
            quizId: quizState.id,
            attemptId: quizState.attemptId,
            answers: quizState.answers,
            timeTaken
        });
        
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

// Show result
function showResult(result) {
    const mainContent = document.getElementById('mainContent');
    if (!mainContent) return;
    
    mainContent.innerHTML = `
        ${Header({ title: 'Quiz Results' })}
        <main class="container mx-auto px-4 py-8 max-w-2xl">
            ${QuizResult({
                result,
                onRetry: () => {
                    window.location.hash = `#/quiz/${quizState.id}/attempt`;
                },
                onHome: () => {
                    window.location.hash = '#/quiz';
                }
            })}
        </main>
    `;
    
    // Attach result events
    const retryBtn = document.getElementById('retryQuizBtn');
    if (retryBtn) {
        retryBtn.addEventListener('click', () => {
            // Reset state
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

// Clean up timer
export function cleanupQuiz() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}