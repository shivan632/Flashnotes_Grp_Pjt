// frontend/src/components/score/ScoreCard.js

export function ScoreCard({ title, value, change, icon, color = 'blue' }) {
    const colorClasses = {
        blue: 'text-[#3B82F6]',
        green: 'text-green-500',
        yellow: 'text-yellow-500',
        red: 'text-red-500',
        purple: 'text-purple-500'
    };

    return `
        <div class="score-card bg-[#1F2937] rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all">
            <div class="flex items-center justify-between mb-4">
                <div class="w-10 h-10 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-lg flex items-center justify-center">
                    <span class="text-white text-xl">${icon}</span>
                </div>
                ${change ? `
                    <span class="text-xs ${change > 0 ? 'text-green-500' : 'text-red-500'} bg-[#111827] px-2 py-1 rounded">
                        ${change > 0 ? '+' : ''}${change}%
                    </span>
                ` : ''}
            </div>
            <h3 class="text-sm text-[#9CA3AF] mb-1">${title}</h3>
            <div class="text-2xl font-bold ${colorClasses[color] || colorClasses.blue}">${value}</div>
        </div>
    `;
}