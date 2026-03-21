// frontend/src/components/profile/ProfileStats.js
// Profile Stats Component - Enhanced UI

export function ProfileStats({ stats, recentActivity }) {
    const {
        totalQuizzes = 0,
        averageScore = 0,
        perfectScores = 0,
        currentStreak = 0,
        longestStreak = 0,
        totalPoints = 0,
        totalQuestionsAnswered = 0,
        correctAnswers = 0
    } = stats;
    
    const accuracy = totalQuestionsAnswered > 0 
        ? Math.round((correctAnswers / totalQuestionsAnswered) * 100) 
        : 0;
    
    return `
        <div class="space-y-6">
            <!-- Stats Overview -->
            <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-6 border border-[#374151]">
                <div class="flex items-center gap-3 mb-6 pb-3 border-b border-[#374151]">
                    <div class="w-8 h-8 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-xl flex items-center justify-center">
                        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                        </svg>
                    </div>
                    <h3 class="text-xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">Performance Overview</h3>
                </div>
                
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div class="text-center p-3 bg-[#111827] rounded-xl">
                        <div class="text-2xl font-bold text-[#3B82F6]">${totalQuizzes}</div>
                        <div class="text-xs text-[#9CA3AF] mt-1">Total Quizzes</div>
                    </div>
                    <div class="text-center p-3 bg-[#111827] rounded-xl">
                        <div class="text-2xl font-bold text-[#3B82F6]">${averageScore}%</div>
                        <div class="text-xs text-[#9CA3AF] mt-1">Average Score</div>
                    </div>
                    <div class="text-center p-3 bg-[#111827] rounded-xl">
                        <div class="text-2xl font-bold text-[#3B82F6]">${accuracy}%</div>
                        <div class="text-xs text-[#9CA3AF] mt-1">Accuracy</div>
                    </div>
                    <div class="text-center p-3 bg-[#111827] rounded-xl">
                        <div class="text-2xl font-bold text-[#3B82F6]">${totalPoints}</div>
                        <div class="text-xs text-[#9CA3AF] mt-1">Total Points</div>
                    </div>
                </div>
            </div>
            
            <!-- Streak Stats -->
            <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-6 border border-[#374151]">
                <div class="flex items-center gap-3 mb-6 pb-3 border-b border-[#374151]">
                    <div class="w-8 h-8 bg-gradient-to-r from-[#F59E0B] to-[#EF4444] rounded-xl flex items-center justify-center">
                        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                        </svg>
                    </div>
                    <h3 class="text-xl font-bold text-[#F59E0B]">Streak Stats</h3>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                    <div class="text-center p-4 bg-gradient-to-r from-[#F59E0B]/10 to-transparent rounded-xl">
                        <div class="text-3xl font-bold text-[#F59E0B]">${currentStreak}</div>
                        <div class="text-xs text-[#9CA3AF] mt-1">Current Streak</div>
                        <div class="w-full bg-[#374151] rounded-full h-1 mt-2">
                            <div class="bg-[#F59E0B] h-1 rounded-full" style="width: ${Math.min(currentStreak / 30 * 100, 100)}%"></div>
                        </div>
                    </div>
                    <div class="text-center p-4 bg-gradient-to-r from-[#EF4444]/10 to-transparent rounded-xl">
                        <div class="text-3xl font-bold text-[#EF4444]">${longestStreak}</div>
                        <div class="text-xs text-[#9CA3AF] mt-1">Longest Streak</div>
                        <div class="w-full bg-[#374151] rounded-full h-1 mt-2">
                            <div class="bg-[#EF4444] h-1 rounded-full" style="width: ${Math.min(longestStreak / 30 * 100, 100)}%"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Achievement Stats -->
            <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-6 border border-[#374151]">
                <div class="flex items-center gap-3 mb-6 pb-3 border-b border-[#374151]">
                    <div class="w-8 h-8 bg-gradient-to-r from-[#10B981] to-[#34D399] rounded-xl flex items-center justify-center">
                        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                        </svg>
                    </div>
                    <h3 class="text-xl font-bold text-[#10B981]">Achievement Stats</h3>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                    <div class="text-center p-3 bg-[#111827] rounded-xl">
                        <div class="text-2xl font-bold text-[#10B981]">${perfectScores}</div>
                        <div class="text-xs text-[#9CA3AF] mt-1">Perfect Scores</div>
                    </div>
                    <div class="text-center p-3 bg-[#111827] rounded-xl">
                        <div class="text-2xl font-bold text-[#10B981]">${Math.floor(perfectScores / totalQuizzes * 100) || 0}%</div>
                        <div class="text-xs text-[#9CA3AF] mt-1">Perfect Rate</div>
                    </div>
                </div>
            </div>
            
            <!-- Recent Activity -->
            <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-6 border border-[#374151]">
                <div class="flex items-center gap-3 mb-6 pb-3 border-b border-[#374151]">
                    <div class="w-8 h-8 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-xl flex items-center justify-center">
                        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <h3 class="text-xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">Recent Activity</h3>
                </div>
                
                <div class="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
                    ${recentActivity && recentActivity.length > 0 ? recentActivity.map((activity, index) => `
                        <div class="flex items-center gap-3 p-3 bg-[#111827] rounded-xl hover:bg-[#1F2937] transition-all duration-300" style="animation: slideInRight 0.3s ease-out ${index * 0.05}s forwards">
                            <div class="w-8 h-8 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-lg flex items-center justify-center">
                                ${getActivityIcon(activity.type)}
                            </div>
                            <div class="flex-1">
                                <p class="text-sm text-[#E5E7EB]">${escapeHtml(activity.message)}</p>
                                <p class="text-xs text-[#6B7280] mt-0.5">${formatDate(activity.date)}</p>
                            </div>
                        </div>
                    `).join('') : `
                        <div class="text-center py-8">
                            <svg class="w-12 h-12 mx-auto text-[#4B5563] mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <p class="text-[#9CA3AF] text-sm">No recent activity</p>
                            <p class="text-xs text-[#6B7280] mt-1">Complete quizzes to see your activity here</p>
                        </div>
                    `}
                </div>
            </div>
        </div>
    `;
}

function getActivityIcon(type) {
    switch (type) {
        case 'quiz': return '📊';
        case 'achievement': return '🏆';
        case 'note': return '📝';
        case 'streak': return '🔥';
        default: return '📬';
    }
}

function formatDate(date) {
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    return d.toLocaleDateString();
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}