// frontend/src/pages/QuizAttempt.js
import { QuizQuestion, setupQuizQuestionEvents } from '/src/components/quiz/QuizQuestion.js';

// State management
let currentQuestionIndex = 0;
let userAnswers = {};
let quizData = null;
let attemptData = null;
let questionsList = [];
let startTime = null;
let timerInterval = null;
let timeRemaining = null;
let totalTimeSeconds = null;
let quizTitle = '';
let quizDataResponse = null;

export async function QuizAttemptPage() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    if (!isAuthenticated) {
        window.location.hash = '#/login';
        return '';
    }
    
    const hash = window.location.hash;
    const attemptId = hash.split('/').pop();
    
    if (!attemptId || attemptId === 'attempt') {
        window.location.hash = '#/dashboard';
        return '';
    }
    
    return `
        <div class="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#111827] to-[#0F172A]">
            <div class="container mx-auto px-4 py-8">
                <div id="quizAttemptContainer" class="max-w-4xl mx-auto">
                    <div class="flex justify-center items-center py-20">
                        <div class="text-center">
                            <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#3B82F6] border-t-transparent mb-4"></div>
                            <p class="text-[#9CA3AF]">Loading quiz attempt...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export async function setupQuizAttempt() {
    const hash = window.location.hash;
    const attemptId = hash.split('/').pop();
    if (!attemptId || attemptId === 'attempt') return;
    await loadQuizAttempt(attemptId);
}

export function cleanupQuiz() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

async function loadQuizAttempt(attemptId) {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Not authenticated');
        
        console.log('📝 Loading quiz attempt:', attemptId);
        
        const response = await fetch(`${window.API_URL || 'http://localhost:10000/api'}/quiz/attempt/${attemptId}`, {
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
        
        if (!response.ok) throw new Error('Failed to load quiz attempt');
        
        const data = await response.json();
        attemptData = data.attempt;
        if (!attemptData) throw new Error('Quiz attempt not found');
        
        console.log('✅ Attempt loaded:', attemptData);
        
        const quizResponse = await fetch(`${window.API_URL || 'http://localhost:10000/api'}/quiz/${attemptData.quiz_id}/questions`, {
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
        
        if (!quizResponse.ok) throw new Error('Failed to load quiz questions');
        
        const quizDataResponse = await quizResponse.json();
        const rawQuestions = quizDataResponse.questions;
        
        questionsList = rawQuestions.map(q => {
            let options = [];
            if (q.options && Array.isArray(q.options)) {
                options = q.options;
            } else if (typeof q.options === 'string') {
                try { options = JSON.parse(q.options); } catch(e) { options = []; }
            }
            return {
                id: q.id,
                question: q.question,
                options: options,
                points: q.points || 1,
                explanation: q.explanation || null,
                correct_option: q.correct_option,
                correct_answer: options[q.correct_option - 1] || null
            };
        });
        
        quizTitle = quizDataResponse.quiz?.title || 'Quiz';
        
        if (attemptData.answers) {
            userAnswers = attemptData.answers;
        }
        
        if (attemptData.status === 'completed') {
            renderCompletedResult();
            return;
        }
        
        quizData = quizDataResponse.quiz;
        totalTimeSeconds = quizData.time_limit || (questionsList.length * 30);
        timeRemaining = totalTimeSeconds;
        startQuiz();
        
    } catch (error) {
        console.error('Error loading quiz attempt:', error);
        const container = document.getElementById('quizAttemptContainer');
        if (container) {
            container.innerHTML = `
                <div class="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center backdrop-blur-sm">
                    <div class="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <p class="text-red-400 mb-2 text-lg font-semibold">Failed to load quiz attempt</p>
                    <p class="text-[#9CA3AF] text-sm mb-6">${error.message}</p>
                    <button onclick="window.location.hash='#/dashboard'" 
                            class="px-6 py-2.5 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                        Back to Dashboard
                    </button>
                </div>
            `;
        }
    }
}

function startQuiz() {
    startTime = new Date();
    currentQuestionIndex = 0;
    userAnswers = {};
    renderQuizInterface();
    startTimer();
}

function renderQuizInterface() {
    const container = document.getElementById('quizAttemptContainer');
    if (!container) return;
    
    const currentQuestion = questionsList[currentQuestionIndex];
    const totalQuestions = questionsList.length;
    const selectedOption = userAnswers[currentQuestion.id];
    
    const timerHtml = `
        <div class="fixed top-4 right-4 z-50 group">
            <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl shadow-2xl border border-[#374151] p-4 backdrop-blur-sm hover:scale-105 transition-all duration-300">
                <div class="text-xs text-[#9CA3AF] mb-1 text-center">Time Remaining</div>
                <div class="font-mono text-3xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent" id="timerDisplay">
                    ${formatTime(timeRemaining)}
                </div>
                <div class="w-full bg-[#374151] rounded-full h-2 mt-3">
                    <div class="bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] h-2 rounded-full transition-all duration-1000" 
                         id="timerProgress"
                         style="width: ${(timeRemaining / totalTimeSeconds) * 100}%"></div>
                </div>
            </div>
        </div>
    `;
    
    const navigationCard = `
        <div class="mb-6 animate-fadeInUp">
            <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-6 border border-[#374151] shadow-xl hover:shadow-2xl transition-all duration-300">
                <div class="mb-4">
                    <div class="flex items-center gap-3 mb-2">
                        <div class="w-10 h-10 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-xl flex items-center justify-center shadow-lg">
                            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                            </svg>
                        </div>
                        <h1 class="text-2xl font-bold bg-gradient-to-r from-white to-[#9CA3AF] bg-clip-text text-transparent">${escapeHtml(quizData.title)}</h1>
                    </div>
                    ${quizData.description ? `<p class="text-[#9CA3AF] ml-12">${escapeHtml(quizData.description)}</p>` : ''}
                </div>
                
                <div class="mb-6">
                    <div class="flex justify-between text-sm text-[#9CA3AF] mb-2">
                        <span>Progress</span>
                        <span class="font-semibold text-[#3B82F6]">${currentQuestionIndex + 1}/${totalQuestions} Questions</span>
                    </div>
                    <div class="w-full bg-[#374151] rounded-full h-2 overflow-hidden">
                        <div class="bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] h-2 rounded-full transition-all duration-500 ease-out" 
                             style="width: ${((currentQuestionIndex + 1) / totalQuestions) * 100}%"></div>
                    </div>
                </div>
                
                <div class="flex justify-between gap-3">
                    <button id="prevQuestion" 
                            class="flex items-center gap-2 px-6 py-2.5 bg-[#374151] text-white rounded-xl hover:bg-[#4B5563] transition-all duration-300 ${currentQuestionIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}"
                            ${currentQuestionIndex === 0 ? 'disabled' : ''}>
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                        </svg>
                        Previous
                    </button>
                    
                    ${currentQuestionIndex === totalQuestions - 1 ? `
                        <button id="submitQuiz" 
                                class="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                            Submit Quiz
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </button>
                    ` : `
                        <button id="nextQuestion" 
                                class="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] text-white rounded-xl hover:from-[#60A5FA] hover:to-[#8B5CF6] transition-all duration-300 transform hover:scale-105 shadow-lg">
                            Next
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                        </button>
                    `}
                </div>
            </div>
        </div>
    `;
    
    const questionHtml = QuizQuestion({
        question: currentQuestion,
        index: currentQuestionIndex,
        total: totalQuestions,
        selectedOption: selectedOption
    });
    
    container.innerHTML = `
        ${timerHtml}
        <div class="quiz-content">
            ${navigationCard}
            ${questionHtml}
        </div>
    `;
    
    setupQuizQuestionEvents();
    attachNavigationEvents();
}

function attachNavigationEvents() {
    const prevBtn = document.getElementById('prevQuestion');
    if (prevBtn) {
        const newPrevBtn = prevBtn.cloneNode(true);
        prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
        newPrevBtn.addEventListener('click', () => previousQuestion());
    }
    
    const nextBtn = document.getElementById('nextQuestion');
    if (nextBtn) {
        const newNextBtn = nextBtn.cloneNode(true);
        nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
        newNextBtn.addEventListener('click', () => nextQuestion());
    }
    
    const submitBtn = document.getElementById('submitQuiz');
    if (submitBtn) {
        const newSubmitBtn = submitBtn.cloneNode(true);
        submitBtn.parentNode.replaceChild(newSubmitBtn, submitBtn);
        newSubmitBtn.addEventListener('click', () => submitQuiz());
    }
}

function saveCurrentAnswer() {
    const currentQuestion = questionsList[currentQuestionIndex];
    const selectedRadio = document.querySelector(`input[name="question-${currentQuestion.id}"]:checked`);
    if (selectedRadio) {
        const optionIndex = parseInt(selectedRadio.value);
        userAnswers[currentQuestion.id] = optionIndex;
    }
}

function nextQuestion() {
    saveCurrentAnswer();
    if (currentQuestionIndex < questionsList.length - 1) {
        currentQuestionIndex++;
        renderQuizInterface();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function previousQuestion() {
    saveCurrentAnswer();
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuizInterface();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
        if (timeRemaining > 0) {
            timeRemaining--;
            const timerDisplay = document.getElementById('timerDisplay');
            const timerProgress = document.getElementById('timerProgress');
            
            if (timerDisplay) timerDisplay.textContent = formatTime(timeRemaining);
            if (timerProgress) {
                const percentage = (timeRemaining / totalTimeSeconds) * 100;
                timerProgress.style.width = `${percentage}%`;
                if (percentage < 20) {
                    timerProgress.classList.remove('from-[#3B82F6]', 'to-[#A78BFA]');
                    timerProgress.classList.add('from-red-500', 'to-red-600');
                    if (timerDisplay) timerDisplay.classList.add('text-red-500');
                }
            }
            if (timeRemaining === 0) {
                clearInterval(timerInterval);
                autoSubmitQuiz();
            }
        }
    }, 1000);
}

function autoSubmitQuiz() {
    const container = document.getElementById('quizAttemptContainer');
    if (!container) return;
    
    container.insertAdjacentHTML('afterbegin', `
        <div class="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-4 text-center mb-6 animate-pulse backdrop-blur-sm">
            <p class="text-yellow-400 font-semibold">⏰ Time's Up!</p>
            <p class="text-[#9CA3AF] text-sm">Auto-submitting your quiz...</p>
        </div>
    `);
    
    saveCurrentAnswer();
    submitQuizToBackend(attemptData.id, userAnswers, totalTimeSeconds)
        .then(() => window.location.hash = `#/quiz/results/${attemptData.id}`)
        .catch(error => {
            console.error('Error auto-submitting quiz:', error);
            alert('Failed to auto-submit quiz. Please try again.');
            window.location.reload();
        });
}

function submitQuiz() {
    saveCurrentAnswer();
    const timeTakenSeconds = totalTimeSeconds - timeRemaining;
    const unansweredCount = questionsList.filter(q => userAnswers[q.id] === undefined).length;
    
    if (unansweredCount > 0) {
        if (!confirm(`⚠️ You have ${unansweredCount} unanswered question(s). Are you sure you want to submit?`)) return;
    } else {
        if (!confirm('Are you sure you want to submit your quiz?')) return;
    }
    
    const container = document.getElementById('quizAttemptContainer');
    if (!container) return;
    
    container.innerHTML = `
        <div class="flex justify-center items-center py-20">
            <div class="text-center">
                <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#3B82F6] border-t-transparent mb-4"></div>
                <p class="text-[#9CA3AF]">Submitting your quiz...</p>
            </div>
        </div>
    `;
    
    if (timerInterval) clearInterval(timerInterval);
    
    submitQuizToBackend(attemptData.id, userAnswers, timeTakenSeconds)
        .then(() => window.location.hash = `#/quiz/results/${attemptData.id}`)
        .catch(error => {
            console.error('Error submitting quiz:', error);
            container.innerHTML = `
                <div class="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center backdrop-blur-sm">
                    <div class="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <p class="text-red-400 mb-2 text-lg font-semibold">Failed to submit quiz</p>
                    <p class="text-[#9CA3AF] text-sm mb-6">${error.message}</p>
                    <div class="flex gap-3 justify-center">
                        <button onclick="location.reload()" 
                                class="px-6 py-2.5 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] text-white rounded-xl hover:shadow-lg transition-all duration-300">
                            Try Again
                        </button>
                        <button onclick="window.location.hash='#/dashboard'" 
                                class="px-6 py-2.5 bg-[#374151] text-white rounded-xl hover:bg-[#4B5563] transition-all duration-300">
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            `;
        });
}

async function submitQuizToBackend(attemptId, answers, timeTakenSeconds) {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');
    
    const formattedAnswers = {};
    Object.entries(answers).forEach(([questionId, optionIndex]) => {
        formattedAnswers[questionId] = optionIndex + 1;
    });
    
    const quizId = quizData.id;
    
    const response = await fetch(`${window.API_URL || 'http://localhost:10000/api'}/quiz/${quizId}/submit`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            attemptId: attemptId,
            answers: formattedAnswers,
            timeTakenSeconds: timeTakenSeconds
        })
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit quiz');
    }
    
    return await response.json();
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function renderCompletedResult() {
    const container = document.getElementById('quizAttemptContainer');
    if (!container) return;
    
    const totalQuestions = questionsList.length;
    const percentage = Math.round(attemptData.percentage || 0);
    const passed = percentage >= 70;
    const storedAnswers = attemptData.answers || {};
    
    let correctCountDisplay = 0;
    const scoreColor = passed ? 'from-green-500 to-emerald-500' : 'from-orange-500 to-red-500';
    const scoreIcon = passed ? '🎉' : '📚';
    const scoreMessage = passed ? 'Excellent! You passed!' : 'Keep practicing! You\'ll do better next time.';
    
    let html = `
        <!-- Hero Score Card -->
        <div class="relative mb-8 overflow-hidden group">
            <div class="absolute inset-0 bg-gradient-to-r ${scoreColor} opacity-20 rounded-2xl blur-2xl group-hover:opacity-30 transition-opacity duration-500"></div>
            <div class="relative bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-8 border border-[#374151] backdrop-blur-sm shadow-2xl">
                <div class="text-center">
                    <div class="inline-block mb-4">
                        <div class="relative">
                            <div class="absolute inset-0 bg-gradient-to-r ${scoreColor} rounded-full blur-xl animate-pulse"></div>
                            <div class="relative w-24 h-24 bg-gradient-to-r ${scoreColor} rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-all duration-500">
                                <span class="text-5xl">${scoreIcon}</span>
                            </div>
                        </div>
                    </div>
                    <h1 class="text-3xl font-bold bg-gradient-to-r from-white to-[#9CA3AF] bg-clip-text text-transparent mb-2">${escapeHtml(quizTitle)}</h1>
                    <p class="text-[#9CA3AF] mb-4">Completed on ${new Date(attemptData.completed_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p class="text-lg font-semibold ${passed ? 'text-green-400' : 'text-orange-400'} mb-6">${scoreMessage}</p>
                </div>
                
                <!-- Stats Grid -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div class="text-center p-4 bg-[#111827] rounded-xl border border-[#374151] hover:border-[#3B82F6] transition-all duration-300 group/stat">
                        <div class="text-3xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent mb-1">${percentage}%</div>
                        <div class="text-xs text-[#9CA3AF]">Overall Score</div>
                        <div class="w-full bg-[#374151] rounded-full h-1 mt-2">
                            <div class="bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] h-1 rounded-full" style="width: ${percentage}%"></div>
                        </div>
                    </div>
                    <div class="text-center p-4 bg-[#111827] rounded-xl border border-[#374151] hover:border-green-500/50 transition-all duration-300">
                        <div class="text-3xl font-bold text-green-400 mb-1">${attemptData.correct_count || 0}/${totalQuestions}</div>
                        <div class="text-xs text-[#9CA3AF]">Correct Answers</div>
                    </div>
                    <div class="text-center p-4 bg-[#111827] rounded-xl border border-[#374151] hover:border-red-500/50 transition-all duration-300">
                        <div class="text-3xl font-bold text-red-400 mb-1">${totalQuestions - (attemptData.correct_count || 0)}</div>
                        <div class="text-xs text-[#9CA3AF]">Incorrect Answers</div>
                    </div>
                    <div class="text-center p-4 bg-[#111827] rounded-xl border border-[#374151] hover:border-[#3B82F6] transition-all duration-300">
                        <div class="text-3xl font-bold ${passed ? 'text-green-400' : 'text-orange-400'} mb-1">${passed ? 'PASS' : 'FAIL'}</div>
                        <div class="text-xs text-[#9CA3AF]">Final Status</div>
                    </div>
                </div>
                
                <button onclick="window.location.hash='#/score'" 
                        class="w-full py-3 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] text-white rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] font-semibold flex items-center justify-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 17l-5-5m0 0l5-5m-5 5h12"></path>
                    </svg>
                    Back to Scores
                </button>
            </div>
        </div>
        
        <h2 class="text-2xl font-bold bg-gradient-to-r from-white to-[#9CA3AF] bg-clip-text text-transparent mb-6 flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-xl flex items-center justify-center shadow-lg">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
            </div>
            Question Review
        </h2>
    `;
    
    questionsList.forEach((q, idx) => {
        const userAnswerValue = storedAnswers[q.id];
        const userAnswerIndex = (userAnswerValue !== undefined && userAnswerValue !== null) ? userAnswerValue : -1;
        const correctAnswerIndex = getCorrectOptionIndex(q);
        const isCorrect = (userAnswerIndex !== -1) && (userAnswerIndex === correctAnswerIndex);
        
        if (isCorrect) correctCountDisplay++;
        
        const userSelectedText = (userAnswerIndex !== -1 && q.options[userAnswerIndex]) ? q.options[userAnswerIndex] : 'Not answered';
        const correctAnswerText = (correctAnswerIndex !== -1 && q.options[correctAnswerIndex]) ? q.options[correctAnswerIndex] : 'Not available';
        
        html += `
            <div class="group bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-6 mb-5 border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${isCorrect ? 'border-green-500/30 hover:border-green-500/60' : 'border-red-500/30 hover:border-red-500/60'}">
                <!-- Question Header -->
                <div class="flex items-center gap-3 mb-4 pb-3 border-b border-[#374151]">
                    <div class="relative">
                        <div class="absolute inset-0 bg-gradient-to-r ${isCorrect ? 'from-green-500 to-emerald-500' : 'from-red-500 to-orange-500'} rounded-xl blur-md opacity-50"></div>
                        <div class="relative w-10 h-10 bg-gradient-to-r ${isCorrect ? 'from-green-500 to-emerald-500' : 'from-red-500 to-orange-500'} rounded-xl flex items-center justify-center shadow-lg">
                            <span class="text-white font-bold text-lg">${idx + 1}</span>
                        </div>
                    </div>
                    <div class="flex-1">
                        <div class="flex items-center gap-2">
                            <span class="px-3 py-1 text-xs font-semibold rounded-full ${isCorrect ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}">
                                ${isCorrect ? '✓ CORRECT' : '✗ INCORRECT'}
                            </span>
                            <span class="text-xs text-[#6B7280]">${q.points} point${q.points > 1 ? 's' : ''}</span>
                        </div>
                    </div>
                </div>
                
                <h3 class="text-lg font-semibold text-white mb-5 leading-relaxed">${escapeHtml(q.question)}</h3>
                
                <!-- Answer Cards -->
                <div class="grid md:grid-cols-2 gap-4 mb-4">
                    <div class="p-4 rounded-xl ${isCorrect ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'} hover:scale-[1.02] transition-all duration-300">
                        <div class="flex items-center gap-2 mb-2">
                            <div class="w-6 h-6 rounded-full ${isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'} flex items-center justify-center">
                                <span class="text-xs ${isCorrect ? 'text-green-400' : 'text-red-400'}">📝</span>
                            </div>
                            <div class="text-xs text-[#9CA3AF] uppercase tracking-wide">Your Answer</div>
                        </div>
                        <div class="text-white font-medium">${escapeHtml(userSelectedText)}</div>
                    </div>
                    
                    <div class="p-4 rounded-xl bg-green-500/10 border border-green-500/30 hover:scale-[1.02] transition-all duration-300">
                        <div class="flex items-center gap-2 mb-2">
                            <div class="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                                <span class="text-xs text-green-400">✓</span>
                            </div>
                            <div class="text-xs text-[#9CA3AF] uppercase tracking-wide">Correct Answer</div>
                        </div>
                        <div class="text-white font-medium">${escapeHtml(correctAnswerText)}</div>
                    </div>
                </div>
                
                <!-- All Options Dropdown -->
                <details class="mt-3 group/details">
                    <summary class="text-xs text-[#9CA3AF] cursor-pointer hover:text-[#3B82F6] transition-colors flex items-center gap-1">
                        <svg class="w-4 h-4 group-open/details:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                        View all options
                    </summary>
                    <div class="mt-3 space-y-2">
                        ${q.options.map((opt, optIdx) => {
                            const isUserSelected = userAnswerIndex === optIdx;
                            const isCorrectOpt = correctAnswerIndex === optIdx;
                            
                            let bgClass = 'bg-[#111827] border-[#374151]';
                            let indicator = '';
                            let indicatorColor = '';
                            
                            if (isCorrectOpt) {
                                bgClass = 'bg-green-500/20 border-green-500/50';
                                indicator = '✓ Correct Answer';
                                indicatorColor = 'text-green-400';
                            }
                            if (isUserSelected && !isCorrectOpt) {
                                bgClass = 'bg-red-500/20 border-red-500/50';
                                indicator = '✗ Your Answer';
                                indicatorColor = 'text-red-400';
                            }
                            if (isUserSelected && isCorrectOpt) {
                                bgClass = 'bg-green-500/30 border-green-500/50';
                                indicator = '✓ Your Answer (Correct)';
                                indicatorColor = 'text-green-400';
                            }
                            
                            return `
                                <div class="p-3 rounded-lg border ${bgClass} transition-all duration-200 hover:scale-[1.01]">
                                    <div class="flex items-center justify-between">
                                        <span class="text-[#E5E7EB] text-sm">${escapeHtml(opt)}</span>
                                        ${indicator ? `<span class="text-xs ${indicatorColor} font-medium">${indicator}</span>` : ''}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </details>
            </div>
        `;
    });
    
    html += `
        <div class="text-center mt-8 pb-8">
            <button onclick="window.location.hash='#/score'" 
                    class="px-8 py-3 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] text-white rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold flex items-center gap-2 mx-auto">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 17l-5-5m0 0l5-5m-5 5h12"></path>
                </svg>
                Back to Scores Dashboard
            </button>
        </div>
    `;
    
    container.innerHTML = html;
}

function getCorrectOptionIndex(question) {
    if (question.correct_option !== undefined && question.correct_option !== null) {
        return question.correct_option - 1;
    }
    return -1;
}

const quizAttemptStyles = `
    @keyframes slideIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .quiz-content { animation: slideIn 0.4s ease-out forwards; }
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeInUp { animation: fadeInUp 0.5s ease-out forwards; }
`;

if (!document.querySelector('#quiz-attempt-styles')) {
    const style = document.createElement('style');
    style.id = 'quiz-attempt-styles';
    style.textContent = quizAttemptStyles;
    document.head.appendChild(style);
}