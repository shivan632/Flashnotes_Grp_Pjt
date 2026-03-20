// frontend/src/components/quiz/QuizTimer.js

export function QuizTimer({ seconds, totalSeconds }) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    const getTimerColor = () => {
        const percentage = (seconds / totalSeconds) * 100;
        if (percentage < 20) return 'text-red-500';
        if (percentage < 50) return 'text-yellow-500';
        return 'text-[#3B82F6]';
    };

    return `
        <div class="quiz-timer flex items-center gap-2 bg-[#1F2937] px-4 py-2 rounded-lg">
            <svg class="w-5 h-5 ${getTimerColor()}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="font-mono text-lg ${getTimerColor()}">
                ${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}
            </span>
        </div>
    `;
}