// frontend/src/components/score/AchievementCard.js
// Achievement Card Component - Enhanced UI with modern design

export function AchievementCard({ achievement }) {
    const earned = achievement.earned || false;
    const earnedDate = earned && achievement.earnedAt ? new Date(achievement.earnedAt) : null;
    const formattedDate = earnedDate ? earnedDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
    }) : '';
    
    const rarityColors = {
        common: 'from-gray-500 to-gray-400',
        rare: 'from-[#3B82F6] to-[#60A5FA]',
        epic: 'from-[#A78BFA] to-[#8B5CF6]',
        legendary: 'from-amber-500 to-yellow-500'
    };
    
    const rarityBg = {
        common: 'bg-gray-500/20 text-gray-400',
        rare: 'bg-[#3B82F6]/20 text-[#3B82F6]',
        epic: 'bg-[#A78BFA]/20 text-[#A78BFA]',
        legendary: 'bg-amber-500/20 text-amber-500'
    };
    
    const rarity = achievement.rarity || 'common';
    const gradientColor = rarityColors[rarity] || rarityColors.common;
    const badgeColor = rarityBg[rarity] || rarityBg.common;
    
    return `
        <div class="achievement-card group relative bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl overflow-hidden transition-all duration-300 ${earned ? 'hover:scale-105 hover:shadow-2xl hover:shadow-[#3B82F6]/20' : 'opacity-60'} border ${earned ? 'border-[#3B82F6] shadow-lg' : 'border-[#374151]'}">
            <!-- Glow Effect on Hover -->
            ${earned ? `
                <div class="absolute inset-0 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            ` : ''}
            
            <!-- Achievement Badge (Ribbon) -->
            ${earned ? `
                <div class="absolute -top-1 -right-1 w-12 h-12">
                    <div class="absolute top-0 right-0 w-0 h-0 border-t-[12px] border-r-[12px] border-t-transparent border-r-[#3B82F6]"></div>
                    <div class="absolute top-1 right-1 text-white text-xs">✓</div>
                </div>
            ` : ''}
            
            <div class="relative p-5">
                <div class="flex items-start gap-4">
                    <!-- Icon Container with Animation -->
                    <div class="relative">
                        <div class="absolute inset-0 bg-gradient-to-r ${gradientColor} rounded-xl blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                        <div class="relative w-14 h-14 bg-gradient-to-r ${gradientColor} rounded-xl flex items-center justify-center shadow-lg ${earned ? 'group-hover:scale-110' : ''} transition-transform duration-300">
                            <span class="text-2xl">${achievement.icon || getDefaultIcon(achievement.name)}</span>
                        </div>
                    </div>
                    
                    <div class="flex-1">
                        <!-- Title with Tooltip -->
                        <div class="flex items-center gap-2 flex-wrap">
                            <h4 class="font-bold text-[#E5E7EB] group-hover:text-[#3B82F6] transition-colors">
                                ${escapeHtml(achievement.name)}
                            </h4>
                            ${earned ? `
                                <span class="px-2 py-0.5 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] text-white text-xs rounded-full animate-pulse">EARNED</span>
                            ` : `
                                <span class="px-2 py-0.5 bg-[#374151] text-[#9CA3AF] text-xs rounded-full">LOCKED</span>
                            `}
                        </div>
                        
                        <!-- Description -->
                        <p class="text-sm text-[#9CA3AF] mt-2 leading-relaxed">${escapeHtml(achievement.description)}</p>
                        
                        <!-- Progress Bar (if not earned and has progress) -->
                        ${!earned && achievement.progress ? `
                            <div class="mt-3">
                                <div class="flex justify-between text-xs mb-1">
                                    <span class="text-[#9CA3AF]">Progress</span>
                                    <span class="text-[#60A5FA]">${achievement.progress.current}/${achievement.progress.total}</span>
                                </div>
                                <div class="w-full bg-[#374151] rounded-full h-1.5 overflow-hidden">
                                    <div class="bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] h-1.5 rounded-full transition-all duration-500" style="width: ${(achievement.progress.current / achievement.progress.total) * 100}%"></div>
                                </div>
                            </div>
                        ` : ''}
                        
                        <!-- Stats Row -->
                        <div class="flex items-center gap-3 mt-3 flex-wrap">
                            <!-- Points Badge -->
                            <div class="flex items-center gap-1 px-2 py-1 bg-[#111827] rounded-full">
                                <svg class="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                                </svg>
                                <span class="text-xs text-[#E5E7EB]">${achievement.points} pts</span>
                            </div>
                            
                            <!-- Date Earned (if earned) -->
                            ${earned && formattedDate ? `
                                <div class="flex items-center gap-1 px-2 py-1 bg-[#111827] rounded-full">
                                    <svg class="w-3 h-3 text-[#60A5FA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                    </svg>
                                    <span class="text-xs text-[#9CA3AF]">${formattedDate}</span>
                                </div>
                            ` : ''}
                            
                            <!-- Rarity Badge -->
                            <div class="flex items-center gap-1 px-2 py-1 ${badgeColor} rounded-full">
                                <span class="w-2 h-2 rounded-full bg-gradient-to-r ${gradientColor}"></span>
                                <span class="text-xs capitalize">${rarity}</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Status Icon -->
                    <div class="flex-shrink-0">
                        ${earned ? `
                            <div class="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center animate-pulse">
                                <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                        ` : `
                            <div class="w-8 h-8 bg-[#374151] rounded-full flex items-center justify-center">
                                <svg class="w-5 h-5 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                        `}
                    </div>
                </div>
            </div>
            
            <!-- Hover Border Animation -->
            ${earned ? `
                <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            ` : ''}
        </div>
    `;
}

// Grid view for multiple achievements
export function AchievementGrid({ achievements, onAchievementClick }) {
    if (!achievements || achievements.length === 0) {
        return `
            <div class="text-center py-12 bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl border border-[#374151]">
                <svg class="w-20 h-20 mx-auto mb-4 text-[#4B5563]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                </svg>
                <p class="text-[#9CA3AF] text-lg mb-2">No achievements yet</p>
                <p class="text-sm text-[#6B7280] max-w-xs mx-auto">Complete quizzes and track your progress to earn achievements!</p>
                <div class="mt-4 flex justify-center gap-2">
                    <div class="w-1.5 h-1.5 bg-[#3B82F6] rounded-full animate-pulse"></div>
                    <div class="w-1.5 h-1.5 bg-[#60A5FA] rounded-full animate-pulse delay-100"></div>
                    <div class="w-1.5 h-1.5 bg-[#A78BFA] rounded-full animate-pulse delay-200"></div>
                </div>
            </div>
        `;
    }
    
    const earnedCount = achievements.filter(a => a.earned).length;
    const totalCount = achievements.length;
    const percentage = (earnedCount / totalCount) * 100;
    
    return `
        <div class="space-y-6">
            <!-- Overall Progress -->
            <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-5 border border-[#374151]">
                <div class="flex items-center justify-between mb-3">
                    <h3 class="text-lg font-bold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">
                        🏆 Achievement Progress
                    </h3>
                    <span class="text-sm text-[#E5E7EB]">${earnedCount}/${totalCount}</span>
                </div>
                <div class="w-full bg-[#374151] rounded-full h-3 overflow-hidden">
                    <div class="bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] h-3 rounded-full transition-all duration-500" style="width: ${percentage}%"></div>
                </div>
                <p class="text-xs text-[#9CA3AF] mt-2">✨ ${totalCount - earnedCount} more achievements to unlock</p>
            </div>
            
            <!-- Achievements Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                ${achievements.map(achievement => `
                    <div class="achievement-item animate-fadeInUp" style="animation-delay: ${achievements.indexOf(achievement) * 0.05}s">
                        ${AchievementCard({ achievement })}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function getDefaultIcon(name) {
    const icons = {
        'Quiz Enthusiast': '📚',
        'Perfect Score': '⭐',
        'Streak Master': '🔥',
        'Quick Learner': '⚡',
        'Speed Demon': '💨',
        'Knowledge Seeker': '🔍',
        'Mastermind': '🧠',
        'Dedicated Learner': '🎯'
    };
    return icons[name] || '🏆';
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add CSS animations
const achievementStyles = `
    @keyframes achievementUnlock {
        0% {
            transform: scale(0.8);
            opacity: 0;
        }
        50% {
            transform: scale(1.1);
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }
    
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
    
    .achievement-card {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .achievement-item {
        opacity: 0;
        animation: fadeInUp 0.5s ease-out forwards;
    }
    
    .achievement-card.earned {
        background: linear-gradient(90deg, #1F2937, #2D3748, #1F2937);
        background-size: 200% 100%;
    }
`;

if (!document.querySelector('#achievement-styles')) {
    const style = document.createElement('style');
    style.id = 'achievement-styles';
    style.textContent = achievementStyles;
    document.head.appendChild(style);
}