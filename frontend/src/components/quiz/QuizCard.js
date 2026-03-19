// frontend/src/components/quiz/QuizCard.js

export function QuizCard({ quiz, onClick }) {
    const difficultyColor = {
        'Beginner': 'text-green-500',
        'Intermediate': 'text-yellow-500',
        'Advanced': 'text-red-500'
    };

    return `
        <div class="quiz-card bg-[#1F2937] rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all hover:scale-105 cursor-pointer" data-id="${quiz.id}">
            <div class="w-12 h-12 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-lg flex items-center justify-center mb-4 text-2xl">
                ${quiz.icon || '📝'}
            </div>
            <h3 class="text-xl font-bold text-[#E5E7EB] mb-2">${quiz.title}</h3>
            <p class="text-[#9CA3AF] text-sm mb-2">${quiz.description || ''}</p>
            <div class="flex items-center gap-2 mb-4">
                <span class="text-xs px-2 py-1 bg-[#374151] rounded-full text-[#9CA3AF]">${quiz.total_questions} questions</span>
                <span class="text-xs px-2 py-1 bg-[#374151] rounded-full ${difficultyColor[quiz.difficulty] || 'text-[#9CA3AF]'}">${quiz.difficulty}</span>
                ${quiz.time_limit_minutes ? `
                    <span class="text-xs px-2 py-1 bg-[#374151] rounded-full text-[#9CA3AF]">${quiz.time_limit_minutes} min</span>
                ` : ''}
            </div>
            <div class="flex items-center justify-between">
                ${quiz.bestScore ? `
                    <span class="text-[#60A5FA] text-sm">Best: ${quiz.bestScore}%</span>
                ` : `
                    <span class="text-[#9CA3AF] text-sm">Not attempted</span>
                `}
                <button class="start-quiz bg-[#3B82F6] hover:bg-[#60A5FA] text-white px-4 py-2 rounded-lg text-sm transition-all" data-id="${quiz.id}">
                    Start Quiz
                </button>
            </div>
        </div>
    `;
}