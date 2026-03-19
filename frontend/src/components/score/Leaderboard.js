// frontend/src/components/score/Leaderboard.js

export function Leaderboard({ entries, period = 'all', onPeriodChange }) {
    const getRankIcon = (rank) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return `${rank}.`;
    };

    return `
        <div class="leaderboard bg-[#1F2937] rounded-xl shadow-lg p-6">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-xl font-bold text-[#E5E7EB]">Leaderboard</h3>
                <div class="flex gap-2">
                    <button class="period-btn px-3 py-1 text-sm rounded-lg transition-all ${period === 'all' ? 'bg-[#3B82F6] text-white' : 'bg-[#374151] text-[#9CA3AF] hover:bg-[#4B5563]'}" data-period="all">All Time</button>
                    <button class="period-btn px-3 py-1 text-sm rounded-lg transition-all ${period === 'weekly' ? 'bg-[#3B82F6] text-white' : 'bg-[#374151] text-[#9CA3AF] hover:bg-[#4B5563]'}" data-period="weekly">This Week</button>
                </div>
            </div>
            
            <div class="space-y-3">
                ${entries.length > 0 ? entries.map(entry => `
                    <div class="leaderboard-item flex items-center gap-3 p-3 bg-[#111827] rounded-lg">
                        <span class="w-8 h-8 flex items-center justify-center text-lg font-bold ${entry.rank <= 3 ? 'text-yellow-500' : 'text-[#9CA3AF]'}">
                            ${getRankIcon(entry.rank)}
                        </span>
                        <div class="flex-1">
                            <p class="font-medium text-[#E5E7EB]">${entry.name}</p>
                            <p class="text-xs text-[#9CA3AF]">${entry.quizzesTaken} quizzes • ${entry.perfectScores} perfect</p>
                        </div>
                        <div class="text-right">
                            <p class="text-lg font-bold text-[#3B82F6]">${entry.points}</p>
                            <p class="text-xs text-[#9CA3AF]">${entry.averageScore}% avg</p>
                        </div>
                    </div>
                `).join('') : `
                    <div class="text-center py-8">
                        <p class="text-[#9CA3AF]">No leaderboard data yet</p>
                        <p class="text-sm text-[#6B7280] mt-2">Take some quizzes to get on the board!</p>
                    </div>
                `}
            </div>
        </div>
    `;
}