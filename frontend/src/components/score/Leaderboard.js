// frontend/src/components/score/Leaderboard.js
// Leaderboard Component - Enhanced UI with modern design

export function Leaderboard({ entries, period = 'all', onPeriodChange, currentUserId }) {
    // Safe data extraction with defaults
    const safeEntries = (entries || []).map(entry => ({
        ...entry,
        name: entry.name || entry.full_name || entry.user_name || 'Anonymous',
        points: entry.total_points || entry.points || 0,
        averageScore: entry.average_score || entry.avg_score || 0,
        quizzesTaken: entry.total_quizzes || entry.total_quizzes_taken || entry.quizzes_taken || 0,
        perfectScores: entry.perfect_scores || 0,
        userId: entry.user_id || entry.userId || entry.id
    }));
    
    const getRankIcon = (rank) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return '';
    };
    
    const getRankClass = (rank) => {
        if (rank === 1) return 'text-yellow-500 bg-yellow-500/20';
        if (rank === 2) return 'text-gray-400 bg-gray-400/20';
        if (rank === 3) return 'text-amber-600 bg-amber-600/20';
        return 'text-[#9CA3AF] bg-[#374151]';
    };
    
    const topThree = safeEntries.slice(0, 3);
    const restEntries = safeEntries.slice(3);
    
    return `
        <div class="leaderboard bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl shadow-xl border border-[#374151] overflow-hidden">
            <!-- Header -->
            <div class="flex justify-between items-center p-6 border-b border-[#374151] bg-gradient-to-r from-[#1F2937] to-[#111827]">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-xl flex items-center justify-center">
                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                        </svg>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">Leaderboard</h3>
                        <p class="text-xs text-[#6B7280]">Top learners this ${period === 'weekly' ? 'week' : 'all time'}</p>
                    </div>
                </div>
                <div class="flex gap-2 bg-[#111827] rounded-xl p-1">
                    <button class="period-btn px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-300 ${period === 'all' ? 'bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] text-white shadow-lg' : 'text-[#9CA3AF] hover:text-[#E5E7EB]'}" data-period="all">
                        All Time
                    </button>
                    <button class="period-btn px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-300 ${period === 'weekly' ? 'bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] text-white shadow-lg' : 'text-[#9CA3AF] hover:text-[#E5E7EB]'}" data-period="weekly">
                        This Week
                    </button>
                </div>
            </div>
            
            ${safeEntries.length > 0 ? `
                <!-- Top 3 Podium -->
                <div class="p-6 pb-0">
                    <div class="flex justify-center items-end gap-4 mb-8">
                        ${topThree[1] ? `
                            <div class="text-center order-1 animate-slideUp" style="animation-delay: 0.1s">
                                <div class="w-20 h-20 mx-auto bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center mb-2 shadow-lg">
                                    <span class="text-4xl">🥈</span>
                                </div>
                                <div class="bg-[#111827] rounded-xl p-2 mt-1">
                                    <p class="font-bold text-sm text-[#E5E7EB]">${escapeHtml(topThree[1].name)}</p>
                                    <p class="text-xs text-[#3B82F6] font-semibold">${topThree[1].points} pts</p>
                                </div>
                                <span class="text-sm font-bold text-gray-400">2nd</span>
                            </div>
                        ` : ''}
                        
                        ${topThree[0] ? `
                            <div class="text-center order-2 animate-slideUp" style="animation-delay: 0s">
                                <div class="relative">
                                    <div class="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl blur-xl opacity-50"></div>
                                    <div class="relative w-24 h-24 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mb-2 shadow-2xl transform scale-110">
                                        <span class="text-5xl">👑</span>
                                    </div>
                                </div>
                                <div class="bg-[#111827] rounded-xl p-2 mt-1">
                                    <p class="font-bold text-sm text-[#E5E7EB]">${escapeHtml(topThree[0].name)}</p>
                                    <p class="text-xs text-[#3B82F6] font-semibold">${topThree[0].points} pts</p>
                                </div>
                                <span class="text-sm font-bold text-yellow-500">1st</span>
                            </div>
                        ` : ''}
                        
                        ${topThree[2] ? `
                            <div class="text-center order-3 animate-slideUp" style="animation-delay: 0.2s">
                                <div class="w-20 h-20 mx-auto bg-gradient-to-br from-amber-600 to-amber-700 rounded-2xl flex items-center justify-center mb-2 shadow-lg">
                                    <span class="text-4xl">🥉</span>
                                </div>
                                <div class="bg-[#111827] rounded-xl p-2 mt-1">
                                    <p class="font-bold text-sm text-[#E5E7EB]">${escapeHtml(topThree[2].name)}</p>
                                    <p class="text-xs text-[#3B82F6] font-semibold">${topThree[2].points} pts</p>
                                </div>
                                <span class="text-sm font-bold text-amber-600">3rd</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
                
                <!-- Rest of Leaderboard -->
                <div class="p-6 pt-0">
                    <div class="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
                        ${restEntries.map((entry, index) => {
                            const rank = index + 4;
                            const isCurrentUser = currentUserId && entry.userId === currentUserId;
                            return `
                                <div class="leaderboard-item group flex items-center gap-3 p-3 bg-[#111827] rounded-xl hover:bg-[#1F2937] transition-all duration-300 hover:translate-x-1 ${isCurrentUser ? 'ring-2 ring-[#3B82F6] bg-[#1F2937]' : ''}" data-user-id="${entry.userId}">
                                    <div class="w-10 h-10 rounded-xl flex items-center justify-center font-bold ${getRankClass(rank)}">
                                        <span class="text-sm">${rank}</span>
                                    </div>
                                    <div class="flex-1">
                                        <div class="flex items-center gap-2">
                                            <p class="font-medium text-[#E5E7EB] group-hover:text-[#3B82F6] transition-colors">
                                                ${escapeHtml(entry.name)}
                                            </p>
                                            ${isCurrentUser ? `
                                                <span class="text-xs px-2 py-0.5 bg-[#3B82F6] text-white rounded-full">You</span>
                                            ` : ''}
                                        </div>
                                        <p class="text-xs text-[#9CA3AF] mt-0.5">
                                            ${entry.quizzesTaken} quizzes • ${entry.perfectScores} perfect
                                        </p>
                                    </div>
                                    <div class="text-right">
                                        <p class="text-lg font-bold text-[#3B82F6]">${entry.points} pts</p>
                                        <p class="text-xs text-[#9CA3AF]">${Math.round(entry.averageScore)}% avg</p>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
                
                <!-- Stats Footer -->
                <div class="p-4 border-t border-[#374151] bg-[#111827]/50 flex justify-between items-center text-xs">
                    <div class="flex items-center gap-4">
                        <div class="flex items-center gap-1">
                            <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            <span class="text-[#9CA3AF]">Gold Medal</span>
                        </div>
                        <div class="flex items-center gap-1">
                            <div class="w-2 h-2 bg-gray-400 rounded-full"></div>
                            <span class="text-[#9CA3AF]">Silver Medal</span>
                        </div>
                        <div class="flex items-center gap-1">
                            <div class="w-2 h-2 bg-amber-600 rounded-full"></div>
                            <span class="text-[#9CA3AF]">Bronze Medal</span>
                        </div>
                    </div>
                    <div>
                        <span class="text-[#6B7280]">Total Players: ${safeEntries.length}</span>
                    </div>
                </div>
            ` : `
                <div class="text-center py-12">
                    <div class="relative">
                        <div class="absolute inset-0 flex items-center justify-center">
                            <div class="w-24 h-24 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full opacity-10 blur-xl"></div>
                        </div>
                        <svg class="w-20 h-20 mx-auto mb-4 text-[#4B5563] relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                        </svg>
                        <p class="text-[#9CA3AF] text-lg mb-2">No leaderboard data yet</p>
                        <p class="text-sm text-[#6B7280] max-w-xs mx-auto">Be the first to take quizzes and claim the top spot!</p>
                        <div class="mt-4 flex justify-center gap-2">
                            <div class="w-1.5 h-1.5 bg-[#3B82F6] rounded-full animate-pulse"></div>
                            <div class="w-1.5 h-1.5 bg-[#60A5FA] rounded-full animate-pulse delay-100"></div>
                            <div class="w-1.5 h-1.5 bg-[#A78BFA] rounded-full animate-pulse delay-200"></div>
                        </div>
                        <a href="#/quiz" class="inline-block mt-6 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] text-white px-6 py-2.5 rounded-xl hover:from-[#60A5FA] hover:to-[#8B5CF6] transition-all duration-300 transform hover:scale-105 shadow-lg">
                            Take a Quiz
                        </a>
                    </div>
                </div>
            `}
        </div>
    `;
}

// Mini leaderboard for dashboard (compact version)
export function MiniLeaderboard({ entries, limit = 5 }) {
    // Safe data extraction with defaults
    const safeEntries = (entries || []).map(entry => ({
        ...entry,
        name: entry.name || entry.full_name || entry.user_name || 'Anonymous',
        points: entry.total_points || entry.points || 0,
        userId: entry.user_id || entry.userId || entry.id
    })).slice(0, limit);
    
    if (!safeEntries || safeEntries.length === 0) {
        return `
            <div class="text-center py-6">
                <p class="text-[#9CA3AF] text-sm">No leaderboard data yet</p>
                <p class="text-xs text-[#6B7280] mt-1">Take a quiz to get started!</p>
            </div>
        `;
    }
    
    return `
        <div class="space-y-2">
            ${safeEntries.map((entry, index) => `
                <div class="flex items-center gap-3 p-2 bg-[#111827] rounded-lg hover:bg-[#1F2937] transition-all duration-300">
                    <div class="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${index === 0 ? 'bg-yellow-500/20 text-yellow-500' : index === 1 ? 'bg-gray-400/20 text-gray-400' : index === 2 ? 'bg-amber-600/20 text-amber-600' : 'bg-[#374151] text-[#9CA3AF]'}">
                        ${index + 1}
                    </div>
                    <div class="flex-1">
                        <p class="text-sm font-medium text-[#E5E7EB] truncate">${escapeHtml(entry.name)}</p>
                    </div>
                    <div class="text-right">
                        <p class="text-sm font-bold text-[#3B82F6]">${entry.points} pts</p>
                    </div>
                </div>
            `).join('')}
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
const leaderboardStyles = `
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .animate-slideUp {
        animation: slideUp 0.5s ease-out forwards;
    }
    
    .leaderboard-item {
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-track {
        background: #1F2937;
        border-radius: 10px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #3B82F6;
        border-radius: 10px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #60A5FA;
    }
`;

if (!document.querySelector('#leaderboard-styles')) {
    const style = document.createElement('style');
    style.id = 'leaderboard-styles';
    style.textContent = leaderboardStyles;
    document.head.appendChild(style);
}