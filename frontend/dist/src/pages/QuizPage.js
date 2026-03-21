// frontend/src/pages/QuizPage.js
// Quiz Page - Display all available quizzes with enhanced UI

import { Sidebar } from '../components/layout/Sidebar.js';
import { AIChatSidebar } from '../components/layout/AIChatSidebar.js';
import { Header } from '../components/common/Header.js';
import { QuizCard } from '../components/quiz/QuizCard.js';
import { LoadingSpinner } from '../components/common/LoadingSpinner.js';
import { getQuizzes } from '../services/quizService.js';
import { showError } from '../components/common/ErrorMessage.js';

let currentQuizId = null;

export async function QuizPage() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    if (!isAuthenticated) {
        window.location.hash = '#/login';
        return '';
    }
    
    // Show loading state with skeleton
    const loadingHtml = `
        <div class="min-h-screen bg-gradient-to-b from-[#111827] to-[#0F172A] relative">
            ${Sidebar()}
            ${AIChatSidebar()}
            <div id="mainContent" class="min-h-screen transition-all duration-300" 
                 style="margin-left: 256px; margin-right: 384px; width: calc(100% - 640px);">
                ${Header({ title: 'Quiz' })}
                <main class="container mx-auto px-4 py-8">
                    <div class="mb-8 animate-pulse">
                        <div class="h-10 bg-[#374151] rounded-lg w-64 mb-2"></div>
                        <div class="h-5 bg-[#374151] rounded-lg w-96"></div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        ${Array(6).fill(0).map(() => `
                            <div class="bg-[#1F2937] rounded-2xl p-6 animate-pulse">
                                <div class="w-14 h-14 bg-[#374151] rounded-xl mb-4"></div>
                                <div class="h-6 bg-[#374151] rounded-lg w-3/4 mb-3"></div>
                                <div class="h-4 bg-[#374151] rounded-lg w-full mb-2"></div>
                                <div class="h-4 bg-[#374151] rounded-lg w-5/6 mb-4"></div>
                                <div class="flex justify-between">
                                    <div class="h-8 bg-[#374151] rounded-lg w-20"></div>
                                    <div class="h-8 bg-[#374151] rounded-lg w-24"></div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </main>
            </div>
        </div>
    `;
    
    try {
        const quizzes = await getQuizzes();
        
        const completedQuizzes = quizzes.filter(q => q.bestScore !== null).length;
        const totalQuizzes = quizzes.length;
        const averageScore = quizzes.reduce((sum, q) => sum + (q.bestScore || 0), 0) / totalQuizzes || 0;
        
        return `
            <div class="min-h-screen bg-gradient-to-b from-[#111827] to-[#0F172A] relative">
                ${Sidebar()}
                ${AIChatSidebar()}
                <div id="mainContent" class="min-h-screen transition-all duration-300" 
                     style="margin-left: 256px; margin-right: 384px; width: calc(100% - 640px);">
                    ${Header({ title: 'Quiz' })}
                    <main class="container mx-auto px-4 py-8">
                        <!-- Header Section -->
                        <div class="mb-8 animate-fadeInUp">
                            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <div class="flex items-center gap-2 mb-2">
                                        <div class="w-10 h-10 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-xl flex items-center justify-center">
                                            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                            </svg>
                                        </div>
                                        <h1 class="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">
                                            Test Your Knowledge
                                        </h1>
                                    </div>
                                    <p class="text-[#9CA3AF] mt-2">Take quizzes on topics you've learned and track your progress</p>
                                </div>
                                
                                <!-- Stats Cards -->
                                <div class="flex gap-3">
                                    <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-xl px-4 py-2 border border-[#374151]">
                                        <div class="text-xs text-[#9CA3AF]">Completed</div>
                                        <div class="text-xl font-bold text-[#3B82F6]">${completedQuizzes}/${totalQuizzes}</div>
                                    </div>
                                    <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-xl px-4 py-2 border border-[#374151]">
                                        <div class="text-xs text-[#9CA3AF]">Avg Score</div>
                                        <div class="text-xl font-bold text-[#3B82F6]">${Math.round(averageScore)}%</div>
                                    </div>
                                </div>
                            </div>
                            <div class="w-24 h-1 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full mt-4"></div>
                        </div>
                        
                        ${quizzes.length > 0 ? `
                            <!-- Quiz Grid with Staggered Animation -->
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                ${quizzes.map((quiz, index) => `
                                    <div class="quiz-card-wrapper animate-fadeInUp" style="animation-delay: ${index * 0.05}s">
                                        ${QuizCard({ quiz })}
                                    </div>
                                `).join('')}
                            </div>
                            
                            <!-- Progress Section -->
                            <div class="mt-12 bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-6 border border-[#374151] animate-fadeInUp" style="animation-delay: 0.3s">
                                <div class="flex items-center gap-3 mb-4">
                                    <div class="w-8 h-8 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-lg flex items-center justify-center">
                                        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                        </svg>
                                    </div>
                                    <h3 class="text-lg font-bold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">Your Progress</h3>
                                </div>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <div class="flex justify-between text-sm mb-2">
                                            <span class="text-[#9CA3AF]">Overall Completion</span>
                                            <span class="text-[#3B82F6]">${Math.round((completedQuizzes / totalQuizzes) * 100)}%</span>
                                        </div>
                                        <div class="w-full bg-[#374151] rounded-full h-2">
                                            <div class="bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] h-2 rounded-full transition-all duration-500" style="width: ${(completedQuizzes / totalQuizzes) * 100}%"></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div class="flex justify-between text-sm mb-2">
                                            <span class="text-[#9CA3AF]">Average Score</span>
                                            <span class="text-[#3B82F6]">${Math.round(averageScore)}%</span>
                                        </div>
                                        <div class="w-full bg-[#374151] rounded-full h-2">
                                            <div class="bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] h-2 rounded-full transition-all duration-500" style="width: ${averageScore}%"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="mt-4 pt-4 border-t border-[#374151]">
                                    <div class="flex justify-between text-sm">
                                        <span class="text-[#9CA3AF]">Quizzes Attempted</span>
                                        <span class="text-[#E5E7EB] font-medium">${completedQuizzes} / ${totalQuizzes}</span>
                                    </div>
                                </div>
                            </div>
                        ` : `
                            <div class="text-center py-16 bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl border border-[#374151]">
                                <div class="relative">
                                    <div class="absolute inset-0 flex items-center justify-center">
                                        <div class="w-24 h-24 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full opacity-10 blur-xl"></div>
                                    </div>
                                    <svg class="w-24 h-24 mx-auto mb-5 text-[#4B5563] relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    <p class="text-[#9CA3AF] text-lg mb-2">No quizzes available yet</p>
                                    <p class="text-sm text-[#6B7280] max-w-sm mx-auto">Check back later for new quizzes to test your knowledge!</p>
                                    <div class="mt-4 flex justify-center gap-2">
                                        <div class="w-1.5 h-1.5 bg-[#3B82F6] rounded-full animate-pulse"></div>
                                        <div class="w-1.5 h-1.5 bg-[#60A5FA] rounded-full animate-pulse delay-100"></div>
                                        <div class="w-1.5 h-1.5 bg-[#A78BFA] rounded-full animate-pulse delay-200"></div>
                                    </div>
                                </div>
                            </div>
                        `}
                    </main>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error loading quizzes:', error);
        showError('Failed to load quizzes', 'error');
        return loadingHtml;
    }
}

// Setup quiz page events
export function setupQuizPage() {
    // Start quiz buttons
    document.querySelectorAll('.start-quiz').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const quizId = btn.dataset.id;
            if (quizId) {
                currentQuizId = quizId;
                // Add click animation
                btn.classList.add('scale-95');
                setTimeout(() => {
                    window.location.hash = `#/quiz/${quizId}/attempt`;
                }, 150);
            }
        });
    });
    
    // Quiz cards
    document.querySelectorAll('.quiz-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't trigger if clicking the button
            if (e.target.closest('.start-quiz')) return;
            
            const quizId = card.dataset.id;
            if (quizId) {
                currentQuizId = quizId;
                // Add click animation
                card.classList.add('scale-[0.98]');
                setTimeout(() => {
                    window.location.hash = `#/quiz/${quizId}/attempt`;
                }, 150);
            }
        });
    });
}

// Add CSS animations
const quizPageStyles = `
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
    
    .animate-fadeInUp {
        animation: fadeInUp 0.5s ease-out forwards;
        opacity: 0;
    }
    
    .quiz-card-wrapper {
        opacity: 0;
    }
`;

if (!document.querySelector('#quiz-page-styles')) {
    const style = document.createElement('style');
    style.id = 'quiz-page-styles';
    style.textContent = quizPageStyles;
    document.head.appendChild(style);
}