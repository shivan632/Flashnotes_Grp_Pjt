// frontend/src/components/score/ScoreCard.js
// Score Card Component - Enhanced UI with modern design

export function ScoreCard({ title, value, change, icon, color = 'blue', subtitle = '', trend = null }) {
    const colorClasses = {
        blue: {
            text: 'text-[#3B82F6]',
            bg: 'bg-[#3B82F6]',
            gradient: 'from-[#3B82F6] to-[#60A5FA]',
            light: 'bg-[#3B82F6]/10'
        },
        green: {
            text: 'text-green-500',
            bg: 'bg-green-500',
            gradient: 'from-green-500 to-green-400',
            light: 'bg-green-500/10'
        },
        yellow: {
            text: 'text-yellow-500',
            bg: 'bg-yellow-500',
            gradient: 'from-yellow-500 to-yellow-400',
            light: 'bg-yellow-500/10'
        },
        red: {
            text: 'text-red-500',
            bg: 'bg-red-500',
            gradient: 'from-red-500 to-red-400',
            light: 'bg-red-500/10'
        },
        purple: {
            text: 'text-purple-500',
            bg: 'bg-purple-500',
            gradient: 'from-purple-500 to-purple-400',
            light: 'bg-purple-500/10'
        },
        orange: {
            text: 'text-orange-500',
            bg: 'bg-orange-500',
            gradient: 'from-orange-500 to-orange-400',
            light: 'bg-orange-500/10'
        }
    };
    
    const selectedColor = colorClasses[color] || colorClasses.blue;
    const isPositive = change && change > 0;
    const isNegative = change && change < 0;
    const trendIcon = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '';
    const trendColor = trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : '';
    
    // Format value based on type
    let formattedValue = value;
    if (typeof value === 'number') {
        if (value > 1000000) {
            formattedValue = (value / 1000000).toFixed(1) + 'M';
        } else if (value > 1000) {
            formattedValue = (value / 1000).toFixed(1) + 'K';
        }
    }
    
    return `
        <div class="score-card group relative bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-[#374151] hover:border-[#3B82F6]">
            <!-- Glow Effect on Hover -->
            <div class="absolute inset-0 bg-gradient-to-r ${selectedColor.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            
            <div class="relative p-6">
                <div class="flex items-start justify-between mb-4">
                    <!-- Icon Container -->
                    <div class="relative">
                        <div class="absolute inset-0 bg-gradient-to-r ${selectedColor.gradient} rounded-xl blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                        <div class="relative w-12 h-12 bg-gradient-to-r ${selectedColor.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <span class="text-2xl">${icon}</span>
                        </div>
                    </div>
                    
                    <!-- Change Badge -->
                    ${change ? `
                        <div class="flex items-center gap-1">
                            <div class="px-2.5 py-1 rounded-full ${isPositive ? 'bg-green-500/20' : isNegative ? 'bg-red-500/20' : 'bg-[#374151]'}">
                                <span class="text-xs font-medium ${isPositive ? 'text-green-500' : isNegative ? 'text-red-500' : 'text-[#9CA3AF]'}">
                                    ${isPositive ? '↑' : isNegative ? '↓' : '→'} ${Math.abs(change)}%
                                </span>
                            </div>
                        </div>
                    ` : ''}
                </div>
                
                <!-- Title with Tooltip -->
                <div class="mb-2">
                    <h3 class="text-sm font-medium text-[#9CA3AF] group-hover:text-[#E5E7EB] transition-colors">${title}</h3>
                    ${subtitle ? `<p class="text-xs text-[#6B7280] mt-0.5">${subtitle}</p>` : ''}
                </div>
                
                <!-- Value with Animation -->
                <div class="flex items-baseline gap-2">
                    <div class="text-3xl font-bold ${selectedColor.text} group-hover:scale-105 transition-transform duration-300">
                        ${formattedValue}
                    </div>
                    ${trendIcon ? `
                        <span class="text-lg ${trendColor} animate-pulse">${trendIcon}</span>
                    ` : ''}
                </div>
                
                <!-- Progress Bar (optional) -->
                ${typeof value === 'number' && value <= 100 ? `
                    <div class="mt-4">
                        <div class="w-full bg-[#374151] rounded-full h-1.5 overflow-hidden">
                            <div class="bg-gradient-to-r ${selectedColor.gradient} h-1.5 rounded-full transition-all duration-500 group-hover:scale-x-100" style="width: ${value}%"></div>
                        </div>
                    </div>
                ` : ''}
                
                <!-- Sparkline (small trend indicator) -->
                <div class="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg class="w-8 h-8 text-[#374151]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="${isPositive ? 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' : isNegative ? 'M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6' : 'M5 12h14'}"></path>
                    </svg>
                </div>
            </div>
            
            <!-- Hover Border Animation -->
            <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${selectedColor.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
        </div>
    `;
}

// Mini Score Card (compact version for dashboards)
export function MiniScoreCard({ title, value, icon, color = 'blue' }) {
    const selectedColor = colorClasses[color] || colorClasses.blue;
    
    return `
        <div class="group bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-xl p-4 border border-[#374151] hover:border-[#3B82F6] transition-all duration-300 hover:-translate-y-0.5">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-gradient-to-r ${selectedColor.gradient} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span class="text-lg">${icon}</span>
                </div>
                <div>
                    <p class="text-xs text-[#9CA3AF]">${title}</p>
                    <p class="text-xl font-bold ${selectedColor.text}">${value}</p>
                </div>
            </div>
        </div>
    `;
}

// Stat Card with Circular Progress
export function CircularProgressCard({ title, value, max = 100, icon, color = 'blue' }) {
    const percentage = (value / max) * 100;
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    const selectedColor = colorClasses[color] || colorClasses.blue;
    
    return `
        <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-6 border border-[#374151] hover:border-[#3B82F6] transition-all duration-300">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-sm font-medium text-[#9CA3AF]">${title}</h3>
                <div class="w-8 h-8 bg-gradient-to-r ${selectedColor.gradient} rounded-lg flex items-center justify-center">
                    <span class="text-sm">${icon}</span>
                </div>
            </div>
            
            <div class="relative flex justify-center">
                <svg class="w-32 h-32 transform -rotate-90">
                    <circle cx="64" cy="64" r="40" stroke="#374151" stroke-width="8" fill="none"/>
                    <circle cx="64" cy="64" r="40" stroke="url(#gradient-${color})" 
                            stroke-width="8" fill="none" 
                            stroke-dasharray="${circumference}" 
                            stroke-dashoffset="${offset}"
                            stroke-linecap="round"
                            class="transition-all duration-1000 ease-out"/>
                    <defs>
                        <linearGradient id="gradient-${color}" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stop-color="${color === 'blue' ? '#3B82F6' : color === 'green' ? '#10B981' : color === 'yellow' ? '#F59E0B' : '#A78BFA'}" />
                            <stop offset="100%" stop-color="${color === 'blue' ? '#60A5FA' : color === 'green' ? '#34D399' : color === 'yellow' ? '#FBBF24' : '#C084FC'}" />
                        </linearGradient>
                    </defs>
                </svg>
                <div class="absolute inset-0 flex items-center justify-center">
                    <div class="text-center">
                        <div class="text-2xl font-bold ${selectedColor.text}">${Math.round(percentage)}<span class="text-sm">%</span></div>
                        <div class="text-xs text-[#9CA3AF]">${value}/${max}</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Helper function for color classes
const colorClasses = {
    blue: {
        text: 'text-[#3B82F6]',
        bg: 'bg-[#3B82F6]',
        gradient: 'from-[#3B82F6] to-[#60A5FA]',
        light: 'bg-[#3B82F6]/10'
    },
    green: {
        text: 'text-green-500',
        bg: 'bg-green-500',
        gradient: 'from-green-500 to-green-400',
        light: 'bg-green-500/10'
    },
    yellow: {
        text: 'text-yellow-500',
        bg: 'bg-yellow-500',
        gradient: 'from-yellow-500 to-yellow-400',
        light: 'bg-yellow-500/10'
    },
    red: {
        text: 'text-red-500',
        bg: 'bg-red-500',
        gradient: 'from-red-500 to-red-400',
        light: 'bg-red-500/10'
    },
    purple: {
        text: 'text-purple-500',
        bg: 'bg-purple-500',
        gradient: 'from-purple-500 to-purple-400',
        light: 'bg-purple-500/10'
    },
    orange: {
        text: 'text-orange-500',
        bg: 'bg-orange-500',
        gradient: 'from-orange-500 to-orange-400',
        light: 'bg-orange-500/10'
    }
};

// Add CSS animations
const scoreCardStyles = `
    @keyframes valuePop {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.1);
        }
        100% {
            transform: scale(1);
        }
    }
    
    .score-card {
        animation: fadeInUp 0.4s ease-out forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

if (!document.querySelector('#score-card-styles')) {
    const style = document.createElement('style');
    style.id = 'score-card-styles';
    style.textContent = scoreCardStyles;
    document.head.appendChild(style);
}