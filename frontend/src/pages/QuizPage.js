// frontend/src/pages/QuizPage.js
// Quiz Page - Take quizzes on topics

import { Sidebar } from '../components/layout/Sidebar.js';
import { AIChatSidebar } from '../components/layout/AIChatSidebar.js';
import { Header } from '../components/common/Header.js';

export function QuizPage() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    if (!isAuthenticated) {
        window.location.hash = '#/login';
        return '';
    }
    
    const quizzes = [
        {
            id: 'os',
            title: 'Operating System',
            icon: '🖥️',
            questions: 10,
            level: 'Intermediate',
            bestScore: 85,
            color: 'from-blue-500 to-blue-600'
        },
        {
            id: 'db',
            title: 'Database',
            icon: '🗄️',
            questions: 8,
            level: 'Beginner',
            bestScore: 92,
            color: 'from-green-500 to-green-600'
        },
        {
            id: 'python',
            title: 'Python',
            icon: '🐍',
            questions: 12,
            level: 'Advanced',
            bestScore: 78,
            color: 'from-yellow-500 to-yellow-600'
        },
        {
            id: 'js',
            title: 'JavaScript',
            icon: '📜',
            questions: 15,
            level: 'Intermediate',
            bestScore: 88,
            color: 'from-purple-500 to-purple-600'
        },
        {
            id: 'ml',
            title: 'Machine Learning',
            icon: '🤖',
            questions: 10,
            level: 'Advanced',
            bestScore: 82,
            color: 'from-red-500 to-red-600'
        }
    ];
    
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
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        ${quizzes.map(quiz => `
                            <div class="quiz-card bg-[#1F2937] rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all hover:scale-105 cursor-pointer" data-id="${quiz.id}">
                                <div class="w-12 h-12 bg-gradient-to-r ${quiz.color} rounded-lg flex items-center justify-center mb-4 text-2xl">
                                    ${quiz.icon}
                                </div>
                                <h3 class="text-xl font-bold text-[#E5E7EB] mb-2">${quiz.title}</h3>
                                <p class="text-[#9CA3AF] text-sm mb-4">${quiz.questions} questions • ${quiz.level}</p>
                                <div class="flex items-center justify-between">
                                    <span class="text-[#60A5FA] text-sm">Best: ${quiz.bestScore}%</span>
                                    <button class="start-quiz bg-[#3B82F6] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#60A5FA]" data-id="${quiz.id}">
                                        Start Quiz
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </main>
            </div>
        </div>
    `;
}