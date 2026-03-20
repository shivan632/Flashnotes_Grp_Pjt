// frontend/src/components/quiz/QuizResult.js

export function QuizResult({ result, onRetry, onHome }) {
    const percentage = result.percentage || 0;
    const passed = percentage >= 70;
    
    const getMessage = () => {
        if (percentage >= 90) return 'Excellent! You\'re a quiz master! 🏆';
        if (percentage >= 70) return 'Good job! You passed! 🎉';
        if (percentage >= 50) return 'Keep practicing! You\'re getting there! 💪';
        return 'Don\'t give up! Try again! 🌟';
    };

    return `
        <div class="quiz-result bg-[#1F2937] rounded-xl p-8 text-center">
            <div class="mb-6">
                <div class="w-32 h-32 mx-auto relative">
                    <svg class="w-32 h-32 transform -rotate-90">
                        <circle cx="64" cy="64" r="56" stroke="#374151" stroke-width="8" fill="none"/>
                        <circle cx="64" cy="64" r="56" stroke="${passed ? '#10B981' : '#F59E0B'}" 
                                stroke-width="8" fill="none" 
                                stroke-dasharray="${2 * Math.PI * 56}" 
                                stroke-dashoffset="${2 * Math.PI * 56 * (1 - percentage / 100)}"
                                class="transition-all duration-1000"/>
                    </svg>
                    <div class="absolute inset-0 flex items-center justify-center">
                        <span class="text-3xl font-bold text-[#E5E7EB]">${Math.round(percentage)}%</span>
                    </div>
                </div>
            </div>
            
            <h2 class="text-2xl font-bold text-[#E5E7EB] mb-2">${getMessage()}</h2>
            
            <div class="grid grid-cols-2 gap-4 my-6">
                <div class="bg-[#111827] p-4 rounded-lg">
                    <div class="text-2xl font-bold text-[#3B82F6]">${result.correctCount}/${result.totalQuestions}</div>
                    <div class="text-sm text-[#9CA3AF]">Correct Answers</div>
                </div>
                <div class="bg-[#111827] p-4 rounded-lg">
                    <div class="text-2xl font-bold text-[#3B82F6]">${result.score}</div>
                    <div class="text-sm text-[#9CA3AF]">Total Score</div>
                </div>
            </div>
            
            <div class="flex gap-4 justify-center">
                <button id="retryQuizBtn" class="bg-[#3B82F6] hover:bg-[#60A5FA] text-white px-6 py-2 rounded-lg transition-all">
                    Try Again
                </button>
                <button id="homeBtn" class="border border-[#374151] hover:bg-[#374151] text-[#E5E7EB] px-6 py-2 rounded-lg transition-all">
                    Back to Quizzes
                </button>
            </div>
        </div>
    `;
}