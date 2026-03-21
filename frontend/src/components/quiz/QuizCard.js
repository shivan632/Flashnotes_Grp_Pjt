// frontend/src/components/quiz/QuizCard.js
// Quiz Card Component - Enhanced UI with modern design

export function QuizCard({ quiz, onClick }) {
    const difficultyColor = {
        'Beginner': 'from-green-500 to-green-400',
        'Intermediate': 'from-yellow-500 to-yellow-400',
        'Advanced': 'from-red-500 to-red-400'
    };
    
    const difficultyBg = {
        'Beginner': 'bg-green-500/20 text-green-400',
        'Intermediate': 'bg-yellow-500/20 text-yellow-400',
        'Advanced': 'bg-red-500/20 text-red-400'
    };
    
    const gradientColor = difficultyColor[quiz.difficulty] || 'from-[#3B82F6] to-[#A78BFA]';
    
    return `
        <div class="quiz-card group relative bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer overflow-hidden border border-[#374151] hover:border-[#3B82F6]" data-id="${quiz.id}">
            <!-- Glow Effect on Hover -->
            <div class="absolute inset-0 bg-gradient-to-r ${gradientColor} opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            
            <!-- Card Content -->
            <div class="relative p-6">
                <!-- Icon with Animation -->
                <div class="relative mb-4">
                    <div class="absolute inset-0 bg-gradient-to-r ${gradientColor} rounded-xl blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                    <div class="relative w-14 h-14 bg-gradient-to-r ${gradientColor} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <span class="text-2xl">${quiz.icon || '📝'}</span>
                    </div>
                </div>
                
                <!-- Title -->
                <h3 class="text-xl font-bold text-[#E5E7EB] group-hover:text-[#3B82F6] transition-colors duration-300 mb-2">
                    ${escapeHtml(quiz.title)}
                </h3>
                
                <!-- Description -->
                <p class="text-[#9CA3AF] text-sm mb-4 line-clamp-2">${escapeHtml(quiz.description || 'Test your knowledge on this topic')}</p>
                
                <!-- Tags -->
                <div class="flex flex-wrap items-center gap-2 mb-4">
                    <span class="text-xs px-2.5 py-1 bg-[#374151] rounded-full text-[#9CA3AF] flex items-center gap-1">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        ${quiz.total_questions} Qs
                    </span>
                    <span class="text-xs px-2.5 py-1 ${difficultyBg[quiz.difficulty] || 'bg-[#374151] text-[#9CA3AF]'} rounded-full flex items-center gap-1">
                        <span class="w-1.5 h-1.5 rounded-full ${difficultyColor[quiz.difficulty] ? 'bg-green-500' : 'bg-[#9CA3AF]'}"></span>
                        ${quiz.difficulty || 'Standard'}
                    </span>
                    ${quiz.time_limit_minutes ? `
                        <span class="text-xs px-2.5 py-1 bg-[#374151] rounded-full text-[#9CA3AF] flex items-center gap-1">
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            ${quiz.time_limit_minutes} min
                        </span>
                    ` : ''}
                </div>
                
                <!-- Progress Bar (if attempted) -->
                ${quiz.bestScore ? `
                    <div class="mb-4">
                        <div class="flex justify-between text-xs mb-1">
                            <span class="text-[#9CA3AF]">Best Score</span>
                            <span class="text-[#3B82F6] font-medium">${quiz.bestScore}%</span>
                        </div>
                        <div class="w-full bg-[#374151] rounded-full h-1.5 overflow-hidden">
                            <div class="bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] h-1.5 rounded-full transition-all duration-500" style="width: ${quiz.bestScore}%"></div>
                        </div>
                    </div>
                ` : ''}
                
                <!-- Footer -->
                <div class="flex items-center justify-between pt-2 border-t border-[#374151] mt-2">
                    <div class="flex items-center gap-1">
                        ${quiz.bestScore ? `
                            <svg class="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                            </svg>
                            <span class="text-[#60A5FA] text-xs">Best: ${quiz.bestScore}%</span>
                        ` : `
                            <svg class="w-4 h-4 text-[#4B5563]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span class="text-[#6B7280] text-xs">Not attempted</span>
                        `}
                    </div>
                    <button class="start-quiz relative overflow-hidden bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] hover:from-[#60A5FA] hover:to-[#8B5CF6] text-white px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-lg group/btn" data-id="${quiz.id}">
                        <span class="relative z-10 flex items-center gap-1">
                            <span>Start Quiz</span>
                            <svg class="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                            </svg>
                        </span>
                        <div class="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                    </button>
                </div>
            </div>
            
            <!-- Hover Border Animation -->
            <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${gradientColor} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
        </div>
    `;
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add CSS animations
const quizCardStyles = `
    @keyframes cardGlow {
        0%, 100% {
            box-shadow: 0 0 5px rgba(59, 130, 246, 0.2);
        }
        50% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
        }
    }
    
    .quiz-card {
        animation: fadeInUp 0.5s ease-out forwards;
        opacity: 0;
    }
    
    .quiz-card:nth-child(1) { animation-delay: 0.05s; }
    .quiz-card:nth-child(2) { animation-delay: 0.1s; }
    .quiz-card:nth-child(3) { animation-delay: 0.15s; }
    .quiz-card:nth-child(4) { animation-delay: 0.2s; }
    .quiz-card:nth-child(5) { animation-delay: 0.25s; }
    .quiz-card:nth-child(6) { animation-delay: 0.3s; }
    
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
    
    .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
`;

if (!document.querySelector('#quiz-card-styles')) {
    const style = document.createElement('style');
    style.id = 'quiz-card-styles';
    style.textContent = quizCardStyles;
    document.head.appendChild(style);
}