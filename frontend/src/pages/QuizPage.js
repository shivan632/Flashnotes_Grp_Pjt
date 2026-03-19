// frontend/src/pages/QuizPage.js
// Quiz Page - Display all available quizzes

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
    
    // Show loading state
    const loadingHtml = `
        <div class="min-h-screen bg-[#111827] relative">
            ${Sidebar()}
            ${AIChatSidebar()}
            <div id="mainContent" class="min-h-screen transition-all duration-300" 
                 style="margin-left: 256px; margin-right: 384px; width: calc(100% - 640px);">
                ${Header({ title: 'Quiz' })}
                <main class="container mx-auto px-4 py-8">
                    <div class="flex justify-center items-center h-64">
                        ${LoadingSpinner()}
                    </div>
                </main>
            </div>
        </div>
    `;
    
    // Fetch quizzes
    try {
        const quizzes = await getQuizzes();
        
        return `
            <div class="min-h-screen bg-[#111827] relative">
                ${Sidebar()}
                ${AIChatSidebar()}
                <div id="mainContent" class="min-h-screen transition-all duration-300" 
                     style="margin-left: 256px; margin-right: 384px; width: calc(100% - 640px);">
                    ${Header({ title: 'Quiz' })}
                    <main class="container mx-auto px-4 py-8">
                        <div class="mb-8">
                            <h1 class="text-3xl font-bold text-[#E5E7EB]">Test Your Knowledge</h1>
                            <p class="text-[#9CA3AF] mt-2">Take quizzes on topics you've learned and track your progress</p>
                        </div>
                        
                        ${quizzes.length > 0 ? `
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                ${quizzes.map(quiz => QuizCard({ quiz })).join('')}
                            </div>
                        ` : `
                            <div class="text-center py-12 bg-[#1F2937] rounded-xl">
                                <svg class="w-20 h-20 mx-auto text-[#4B5563] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <p class="text-[#9CA3AF] text-lg">No quizzes available yet</p>
                                <p class="text-sm text-[#6B7280] mt-2">Check back later for new quizzes!</p>
                            </div>
                        `}
                    </main>
                </div>
            </div>
        `;
    } catch (error) {
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
                window.location.hash = `#/quiz/${quizId}/attempt`;
            }
        });
    });
    
    // Quiz cards
    document.querySelectorAll('.quiz-card').forEach(card => {
        card.addEventListener('click', () => {
            const quizId = card.dataset.id;
            if (quizId) {
                currentQuizId = quizId;
                window.location.hash = `#/quiz/${quizId}/attempt`;
            }
        });
    });
}