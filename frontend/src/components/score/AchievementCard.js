// frontend/src/components/score/AchievementCard.js

export function AchievementCard({ achievement }) {
    const earned = achievement.earned || false;
    
    return `
        <div class="achievement-card bg-[#1F2937] rounded-xl p-4 ${earned ? 'border-2 border-[#3B82F6]' : 'opacity-50'}">
            <div class="flex items-start gap-3">
                <div class="w-10 h-10 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                    ${achievement.icon || '🏆'}
                </div>
                <div class="flex-1">
                    <h4 class="font-semibold text-[#E5E7EB]">${achievement.name}</h4>
                    <p class="text-xs text-[#9CA3AF] mt-1">${achievement.description}</p>
                    <div class="flex items-center gap-2 mt-2">
                        <span class="text-xs text-[#60A5FA]">${achievement.points} points</span>
                        ${earned && achievement.earnedAt ? `
                            <span class="text-xs text-[#9CA3AF]">Earned ${new Date(achievement.earnedAt).toLocaleDateString()}</span>
                        ` : ''}
                    </div>
                </div>
                ${earned ? `
                    <span class="text-green-500 text-xl">✓</span>
                ` : `
                    <span class="text-[#374151] text-xl">○</span>
                `}
            </div>
        </div>
    `;
}