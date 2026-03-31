// frontend/src/components/profile/ProfileStats.js
// Profile Stats Component - Enhanced UI with beautiful animations

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
            <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-6 border border-[#374151] shadow-xl animate-fadeInUp">
                <div class="flex items-center gap-3 mb-6 pb-3 border-b border-[#374151]">
                    <div class="relative">
                        <div class="absolute inset-0 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-xl blur-md"></div>
                        <div class="relative w-10 h-10 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-xl flex items-center justify-center shadow-lg">
                            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                            </svg>
                        </div>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">Performance Overview</h3>
                        <p class="text-xs text-[#6B7280] mt-0.5">Your learning statistics at a glance</p>
                    </div>
                </div>
                
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div class="text-center p-4 bg-gradient-to-br from-[#111827] to-[#0F172A] rounded-xl hover:scale-105 transition-all duration-300 cursor-pointer group border border-[#374151] hover:border-[#3B82F6]">
                        <div class="text-2xl font-bold text-[#3B82F6] group-hover:scale-110 transition-transform">${totalQuizzes}</div>
                        <div class="text-xs text-[#9CA3AF] mt-1 flex items-center justify-center gap-1">
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            Total Quizzes
                        </div>
                    </div>
                    <div class="text-center p-4 bg-gradient-to-br from-[#111827] to-[#0F172A] rounded-xl hover:scale-105 transition-all duration-300 cursor-pointer group border border-[#374151] hover:border-[#3B82F6]">
                        <div class="text-2xl font-bold text-[#3B82F6] group-hover:scale-110 transition-transform">${averageScore}%</div>
                        <div class="text-xs text-[#9CA3AF] mt-1 flex items-center justify-center gap-1">
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                            </svg>
                            Average Score
                        </div>
                        <div class="w-full bg-[#374151] rounded-full h-1 mt-2">
                            <div class="bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] h-1 rounded-full transition-all duration-500" style="width: ${averageScore}%"></div>
                        </div>
                    </div>
                    <div class="text-center p-4 bg-gradient-to-br from-[#111827] to-[#0F172A] rounded-xl hover:scale-105 transition-all duration-300 cursor-pointer group border border-[#374151] hover:border-[#3B82F6]">
                        <div class="text-2xl font-bold text-[#3B82F6] group-hover:scale-110 transition-transform">${accuracy}%</div>
                        <div class="text-xs text-[#9CA3AF] mt-1 flex items-center justify-center gap-1">
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            Accuracy
                        </div>
                        <div class="w-full bg-[#374151] rounded-full h-1 mt-2">
                            <div class="bg-gradient-to-r from-[#10B981] to-[#34D399] h-1 rounded-full transition-all duration-500" style="width: ${accuracy}%"></div>
                        </div>
                    </div>
                    <div class="text-center p-4 bg-gradient-to-br from-[#111827] to-[#0F172A] rounded-xl hover:scale-105 transition-all duration-300 cursor-pointer group border border-[#374151] hover:border-[#3B82F6]">
                        <div class="text-2xl font-bold text-[#3B82F6] group-hover:scale-110 transition-transform">${totalPoints}</div>
                        <div class="text-xs text-[#9CA3AF] mt-1 flex items-center justify-center gap-1">
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            Total Points
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Streak Stats -->
            <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-6 border border-[#374151] shadow-xl animate-fadeInUp" style="animation-delay: 0.1s">
                <div class="flex items-center gap-3 mb-6 pb-3 border-b border-[#374151]">
                    <div class="relative">
                        <div class="absolute inset-0 bg-gradient-to-r from-[#F59E0B] to-[#EF4444] rounded-xl blur-md"></div>
                        <div class="relative w-10 h-10 bg-gradient-to-r from-[#F59E0B] to-[#EF4444] rounded-xl flex items-center justify-center shadow-lg">
                            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                            </svg>
                        </div>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold bg-gradient-to-r from-[#F59E0B] to-[#EF4444] bg-clip-text text-transparent">Streak Stats</h3>
                        <p class="text-xs text-[#6B7280] mt-0.5">Keep the fire burning!</p>
                    </div>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                    <div class="text-center p-5 bg-gradient-to-br from-[#F59E0B]/10 to-transparent rounded-xl hover:scale-105 transition-all duration-300">
                        <div class="text-3xl font-bold text-[#F59E0B] flex items-center justify-center gap-2">
                            <span>🔥</span> ${currentStreak}
                        </div>
                        <div class="text-xs text-[#9CA3AF] mt-2">Current Streak</div>
                        <div class="w-full bg-[#374151] rounded-full h-1.5 mt-3">
                            <div class="bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] h-1.5 rounded-full transition-all duration-500" style="width: ${Math.min(currentStreak / 30 * 100, 100)}%"></div>
                        </div>
                        <div class="text-xs text-[#6B7280] mt-2">${30 - currentStreak > 0 ? `${30 - currentStreak} more to milestone` : 'Milestone achieved! 🎉'}</div>
                    </div>
                    <div class="text-center p-5 bg-gradient-to-br from-[#EF4444]/10 to-transparent rounded-xl hover:scale-105 transition-all duration-300">
                        <div class="text-3xl font-bold text-[#EF4444] flex items-center justify-center gap-2">
                            <span>🏆</span> ${longestStreak}
                        </div>
                        <div class="text-xs text-[#9CA3AF] mt-2">Longest Streak</div>
                        <div class="w-full bg-[#374151] rounded-full h-1.5 mt-3">
                            <div class="bg-gradient-to-r from-[#EF4444] to-[#F87171] h-1.5 rounded-full transition-all duration-500" style="width: ${Math.min(longestStreak / 30 * 100, 100)}%"></div>
                        </div>
                        <div class="text-xs text-[#6B7280] mt-2">Your best record!</div>
                    </div>
                </div>
            </div>
            
            <!-- Achievement Stats -->
            <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-6 border border-[#374151] shadow-xl animate-fadeInUp" style="animation-delay: 0.2s">
                <div class="flex items-center gap-3 mb-6 pb-3 border-b border-[#374151]">
                    <div class="relative">
                        <div class="absolute inset-0 bg-gradient-to-r from-[#10B981] to-[#34D399] rounded-xl blur-md"></div>
                        <div class="relative w-10 h-10 bg-gradient-to-r from-[#10B981] to-[#34D399] rounded-xl flex items-center justify-center shadow-lg">
                            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                            </svg>
                        </div>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold bg-gradient-to-r from-[#10B981] to-[#34D399] bg-clip-text text-transparent">Achievement Stats</h3>
                        <p class="text-xs text-[#6B7280] mt-0.5">Your accomplishments</p>
                    </div>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                    <div class="text-center p-4 bg-gradient-to-br from-[#111827] to-[#0F172A] rounded-xl hover:scale-105 transition-all duration-300">
                        <div class="text-2xl font-bold text-[#10B981] flex items-center justify-center gap-2">
                            <span>⭐</span> ${perfectScores}
                        </div>
                        <div class="text-xs text-[#9CA3AF] mt-1">Perfect Scores</div>
                        <div class="mt-2 text-[#6B7280] text-xs">🎯 ${perfectScores === 0 ? 'Complete your first perfect score!' : 'Keep the momentum!'}</div>
                    </div>
                    <div class="text-center p-4 bg-gradient-to-br from-[#111827] to-[#0F172A] rounded-xl hover:scale-105 transition-all duration-300">
                        <div class="text-2xl font-bold text-[#10B981] flex items-center justify-center gap-2">
                            <span>📈</span> ${totalQuizzes === 0 ? 0 : Math.floor(perfectScores / totalQuizzes * 100)}%
                        </div>
                        <div class="text-xs text-[#9CA3AF] mt-1">Perfect Rate</div>
                        <div class="w-full bg-[#374151] rounded-full h-1 mt-2">
                            <div class="bg-gradient-to-r from-[#10B981] to-[#34D399] h-1 rounded-full transition-all duration-500" style="width: ${totalQuizzes === 0 ? 0 : Math.min(perfectScores / totalQuizzes * 100, 100)}%"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Recent Activity -->
            <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-6 border border-[#374151] shadow-xl animate-fadeInUp" style="animation-delay: 0.3s">
                <div class="flex items-center gap-3 mb-6 pb-3 border-b border-[#374151]">
                    <div class="relative">
                        <div class="absolute inset-0 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-xl blur-md"></div>
                        <div class="relative w-10 h-10 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-xl flex items-center justify-center shadow-lg">
                            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">Recent Activity</h3>
                        <p class="text-xs text-[#6B7280] mt-0.5">Your latest learning moments</p>
                    </div>
                </div>
                
                <div class="space-y-3 max-h-80 overflow-y-auto custom-scrollbar pr-2">
                    ${recentActivity && recentActivity.length > 0 ? recentActivity.map((activity, index) => `
                        <div class="flex items-center gap-3 p-3 bg-gradient-to-r from-[#111827] to-[#1F2937] rounded-xl hover:translate-x-1 transition-all duration-300 border border-[#374151] hover:border-[#3B82F6]" style="animation: slideInRight 0.3s ease-out ${index * 0.05}s forwards">
                            <div class="w-10 h-10 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-xl flex items-center justify-center shadow-md">
                                <span class="text-lg">${getActivityIcon(activity.type)}</span>
                            </div>
                            <div class="flex-1">
                                <p class="text-sm text-[#E5E7EB] font-medium">${escapeHtml(activity.message)}</p>
                                <p class="text-xs text-[#6B7280] mt-0.5 flex items-center gap-1">
                                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    ${formatDate(activity.date)}
                                </p>
                            </div>
                            <div class="opacity-0 group-hover:opacity-100 transition-opacity">
                                <svg class="w-4 h-4 text-[#3B82F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                                </svg>
                            </div>
                        </div>
                    `).join('') : `
                        <div class="text-center py-12">
                            <div class="relative">
                                <div class="absolute inset-0 flex items-center justify-center">
                                    <div class="w-20 h-20 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full opacity-10 blur-xl"></div>
                                </div>
                                <svg class="w-16 h-16 mx-auto text-[#4B5563] mb-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <p class="text-[#9CA3AF] text-base mb-2">No recent activity</p>
                                <p class="text-xs text-[#6B7280]">Complete quizzes to see your activity here</p>
                                <div class="mt-4 flex justify-center gap-2">
                                    <div class="w-1.5 h-1.5 bg-[#3B82F6] rounded-full animate-pulse"></div>
                                    <div class="w-1.5 h-1.5 bg-[#60A5FA] rounded-full animate-pulse delay-100"></div>
                                    <div class="w-1.5 h-1.5 bg-[#A78BFA] rounded-full animate-pulse delay-200"></div>
                                </div>
                            </div>
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
        case 'roadmap': return '🗺️';
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
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add CSS animations
const profileStatsStyles = `
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
    
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(-15px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes pulse-slow {
        0%, 100% {
            opacity: 0.5;
            transform: scale(1);
        }
        50% {
            opacity: 0.8;
            transform: scale(1.05);
        }
    }
    
    .animate-fadeInUp {
        animation: fadeInUp 0.5s ease-out forwards;
        opacity: 0;
    }
    
    .animate-slideInRight {
        animation: slideInRight 0.3s ease-out forwards;
        opacity: 0;
    }
    
    .custom-scrollbar::-webkit-scrollbar {
        width: 5px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-track {
        background: #1F2937;
        border-radius: 10px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: linear-gradient(135deg, #3B82F6, #A78BFA);
        border-radius: 10px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(135deg, #60A5FA, #8B5CF6);
    }
`;

if (!document.querySelector('#profile-stats-styles')) {
    const style = document.createElement('style');
    style.id = 'profile-stats-styles';
    style.textContent = profileStatsStyles;
    document.head.appendChild(style);
}