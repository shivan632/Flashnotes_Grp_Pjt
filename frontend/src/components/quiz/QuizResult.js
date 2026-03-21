// frontend/src/components/quiz/QuizResult.js
// Quiz Result Component - Enhanced UI with modern design

export function QuizResult({ result, onRetry, onHome }) {
    const percentage = result.percentage || 0;
    const passed = percentage >= 70;
    const scoreColor = passed ? '#10B981' : '#F59E0B';
    const gradientFrom = passed ? 'from-green-500' : 'from-yellow-500';
    const gradientTo = passed ? 'to-emerald-600' : 'to-orange-500';
    
    const getMessage = () => {
        if (percentage >= 90) return { text: 'Excellent! You\'re a quiz master!', icon: '🏆', emoji: '🎉' };
        if (percentage >= 70) return { text: 'Good job! You passed!', icon: '🎯', emoji: '🎉' };
        if (percentage >= 50) return { text: 'Keep practicing! You\'re getting there!', icon: '💪', emoji: '📚' };
        return { text: 'Don\'t give up! Try again!', icon: '🌟', emoji: '🚀' };
    };
    
    const message = getMessage();
    
    return `
        <div class="quiz-result bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-8 text-center border border-[#374151] animate-fadeInUp">
            <!-- Header with Confetti Effect -->
            <div class="relative mb-6">
                <div class="absolute inset-0 flex justify-center items-center">
                    <div class="w-full h-full absolute overflow-hidden">
                        ${passed ? `
                            <div class="confetti absolute top-0 left-1/4 animate-float">
                                <span class="text-lg">🎉</span>
                            </div>
                            <div class="confetti absolute top-10 right-1/4 animate-float-delay-1">
                                <span class="text-lg">✨</span>
                            </div>
                            <div class="confetti absolute bottom-0 left-1/3 animate-float-delay-2">
                                <span class="text-lg">⭐</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
                <div class="relative z-10">
                    <span class="text-6xl">${message.icon}</span>
                </div>
            </div>
            
            <!-- Score Circle -->
            <div class="mb-6 relative">
                <div class="w-40 h-40 mx-auto relative">
                    <svg class="w-40 h-40 transform -rotate-90">
                        <!-- Background Circle -->
                        <circle cx="80" cy="80" r="70" stroke="#374151" stroke-width="10" fill="none"/>
                        <!-- Progress Circle -->
                        <circle cx="80" cy="80" r="70" stroke="${scoreColor}" 
                                stroke-width="10" fill="none" 
                                stroke-dasharray="${2 * Math.PI * 70}" 
                                stroke-dashoffset="${2 * Math.PI * 70 * (1 - percentage / 100)}"
                                stroke-linecap="round"
                                class="transition-all duration-1000 ease-out"/>
                    </svg>
                    <div class="absolute inset-0 flex flex-col items-center justify-center">
                        <span class="text-4xl font-bold text-[#E5E7EB]">${Math.round(percentage)}<span class="text-2xl">%</span></span>
                        <span class="text-xs text-[#9CA3AF] mt-1">Score</span>
                    </div>
                </div>
                
                <!-- Status Badge -->
                <div class="absolute -top-2 -right-2">
                    <div class="bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                        ${passed ? 'PASSED' : 'NEEDS PRACTICE'}
                    </div>
                </div>
            </div>
            
            <!-- Message -->
            <h2 class="text-2xl font-bold bg-gradient-to-r from-[#E5E7EB] to-[#9CA3AF] bg-clip-text text-transparent mb-2">
                ${message.text}
            </h2>
            <p class="text-[#9CA3AF] text-sm mb-6">
                ${message.emoji} You got ${result.correctCount} out of ${result.totalQuestions} questions correct
            </p>
            
            <!-- Stats Grid -->
            <div class="grid grid-cols-2 gap-4 my-6">
                <div class="group bg-[#111827] p-4 rounded-xl hover:bg-[#1F2937] transition-all duration-300 hover:scale-105 cursor-pointer">
                    <div class="text-2xl font-bold text-[#3B82F6] group-hover:scale-110 transition-transform">
                        ${result.correctCount}/${result.totalQuestions}
                    </div>
                    <div class="text-sm text-[#9CA3AF] mt-1">Correct Answers</div>
                    <div class="w-full bg-[#374151] rounded-full h-1 mt-2">
                        <div class="bg-[#3B82F6] h-1 rounded-full transition-all duration-500" style="width: ${(result.correctCount / result.totalQuestions) * 100}%"></div>
                    </div>
                </div>
                <div class="group bg-[#111827] p-4 rounded-xl hover:bg-[#1F2937] transition-all duration-300 hover:scale-105 cursor-pointer">
                    <div class="text-2xl font-bold text-[#3B82F6] group-hover:scale-110 transition-transform">
                        ${result.score}
                    </div>
                    <div class="text-sm text-[#9CA3AF] mt-1">Total Score</div>
                    <div class="w-full bg-[#374151] rounded-full h-1 mt-2">
                        <div class="bg-[#3B82F6] h-1 rounded-full transition-all duration-500" style="width: ${(result.score / (result.totalQuestions * 10)) * 100}%"></div>
                    </div>
                </div>
            </div>
            
            <!-- Performance Details -->
            <div class="bg-[#111827]/50 rounded-xl p-4 mb-6">
                <div class="flex items-center justify-between text-sm mb-2">
                    <span class="text-[#9CA3AF]">Accuracy</span>
                    <span class="text-[#3B82F6] font-semibold">${Math.round(percentage)}%</span>
                </div>
                <div class="w-full bg-[#374151] rounded-full h-2">
                    <div class="bg-gradient-to-r ${gradientFrom} ${gradientTo} h-2 rounded-full transition-all duration-500" style="width: ${percentage}%"></div>
                </div>
                
                <div class="grid grid-cols-2 gap-4 mt-4 pt-3 border-t border-[#374151]">
                    <div>
                        <div class="text-xs text-[#6B7280]">Time Spent</div>
                        <div class="text-sm text-[#E5E7EB] font-medium">${formatTime(result.timeTakenSeconds || 0)}</div>
                    </div>
                    <div>
                        <div class="text-xs text-[#6B7280]">Points Earned</div>
                        <div class="text-sm text-[#3B82F6] font-medium">${result.score} / ${result.totalQuestions * 10}</div>
                    </div>
                </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row gap-3 justify-center">
                <button id="retryQuizBtn" 
                        class="group relative overflow-hidden bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] hover:from-[#60A5FA] hover:to-[#8B5CF6] text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
                    <span class="relative z-10 flex items-center justify-center gap-2">
                        <svg class="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                        </svg>
                        Try Again
                    </span>
                    <div class="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
                <button id="homeBtn" 
                        class="group relative overflow-hidden border-2 border-[#374151] hover:border-[#3B82F6] text-[#E5E7EB] hover:text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105">
                    <span class="relative z-10 flex items-center justify-center gap-2">
                        <svg class="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                        </svg>
                        Back to Quizzes
                    </span>
                    <div class="absolute inset-0 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
            </div>
            
            <!-- Share Button -->
            <div class="mt-4">
                <button id="shareResultBtn" 
                        class="text-xs text-[#6B7280] hover:text-[#3B82F6] transition-colors flex items-center justify-center gap-1 mx-auto">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                    </svg>
                    Share your result
                </button>
            </div>
        </div>
    `;
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
        return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
}

// Add CSS animations
const quizResultStyles = `
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
    
    @keyframes float {
        0%, 100% {
            transform: translateY(0) rotate(0deg);
        }
        50% {
            transform: translateY(-10px) rotate(5deg);
        }
    }
    
    .animate-fadeInUp {
        animation: fadeInUp 0.6s ease-out;
    }
    
    .animate-float {
        animation: float 3s ease-in-out infinite;
    }
    
    .animate-float-delay-1 {
        animation: float 3s ease-in-out infinite 0.5s;
    }
    
    .animate-float-delay-2 {
        animation: float 3s ease-in-out infinite 1s;
    }
    
    .confetti {
        pointer-events: none;
        font-size: 1.25rem;
    }
    
    .quiz-result {
        backdrop-filter: blur(10px);
    }
`;

if (!document.querySelector('#quiz-result-styles')) {
    const style = document.createElement('style');
    style.id = 'quiz-result-styles';
    style.textContent = quizResultStyles;
    document.head.appendChild(style);
}