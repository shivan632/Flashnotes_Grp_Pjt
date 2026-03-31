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
            text: 'text-emerald-500',
            bg: 'bg-emerald-500',
            gradient: 'from-emerald-500 to-green-400',
            light: 'bg-emerald-500/10'
        },
        yellow: {
            text: 'text-amber-500',
            bg: 'bg-amber-500',
            gradient: 'from-amber-500 to-yellow-400',
            light: 'bg-amber-500/10'
        },
        red: {
            text: 'text-rose-500',
            bg: 'bg-rose-500',
            gradient: 'from-rose-500 to-red-400',
            light: 'bg-rose-500/10'
        },
        purple: {
            text: 'text-[#A78BFA]',
            bg: 'bg-[#A78BFA]',
            gradient: 'from-[#A78BFA] to-[#8B5CF6]',
            light: 'bg-[#A78BFA]/10'
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
    const trendColor = trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-rose-500' : '';
    
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
            <div class="absolute -inset-0.5 bg-gradient-to-r ${selectedColor.gradient} blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
            
            <div class="relative p-6">
                <div class="flex items-start justify-between mb-4">
                    <!-- Icon Container -->
                    <div class="relative">
                        <div class="absolute inset-0 bg-gradient-to-r ${selectedColor.gradient} rounded-xl blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                        <div class="relative w-12 h-12 bg-gradient-to-r ${selectedColor.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                            <span class="text-2xl">${icon}</span>
                        </div>
                    </div>
                    
                    <!-- Change Badge -->
                    ${change ? `
                        <div class="flex items-center gap-1">
                            <div class="px-2.5 py-1 rounded-full ${isPositive ? 'bg-emerald-500/20' : isNegative ? 'bg-rose-500/20' : 'bg-[#374151]'}">
                                <span class="text-xs font-medium ${isPositive ? 'text-emerald-500' : isNegative ? 'text-rose-500' : 'text-[#9CA3AF]'}">
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
                
                <!-- Progress Bar -->
                ${typeof value === 'number' && value <= 100 && value >= 0 ? `
                    <div class="mt-4">
                        <div class="w-full bg-[#374151] rounded-full h-1.5 overflow-hidden">
                            <div class="bg-gradient-to-r ${selectedColor.gradient} h-1.5 rounded-full transition-all duration-500 group-hover:scale-x-100" style="width: ${value}%"></div>
                        </div>
                    </div>
                ` : ''}
                
                <!-- Sparkline -->
                <div class="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
                    <svg class="w-8 h-8 text-[#374151] group-hover:text-[${color === 'blue' ? '#3B82F6' : color === 'green' ? '#10B981' : color === 'purple' ? '#A78BFA' : '#F59E0B'}] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    const colorClasses = {
        blue: {
            text: 'text-[#3B82F6]',
            gradient: 'from-[#3B82F6] to-[#60A5FA]'
        },
        green: {
            text: 'text-emerald-500',
            gradient: 'from-emerald-500 to-green-400'
        },
        yellow: {
            text: 'text-amber-500',
            gradient: 'from-amber-500 to-yellow-400'
        },
        red: {
            text: 'text-rose-500',
            gradient: 'from-rose-500 to-red-400'
        },
        purple: {
            text: 'text-[#A78BFA]',
            gradient: 'from-[#A78BFA] to-[#8B5CF6]'
        }
    };
    
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
    
    const colorClasses = {
        blue: { text: 'text-[#3B82F6]', stop1: '#3B82F6', stop2: '#60A5FA' },
        green: { text: 'text-emerald-500', stop1: '#10B981', stop2: '#34D399' },
        yellow: { text: 'text-amber-500', stop1: '#F59E0B', stop2: '#FBBF24' },
        red: { text: 'text-rose-500', stop1: '#EF4444', stop2: '#F87171' },
        purple: { text: 'text-[#A78BFA]', stop1: '#A78BFA', stop2: '#C084FC' }
    };
    
    const selectedColor = colorClasses[color] || colorClasses.blue;
    
    return `
        <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-6 border border-[#374151] hover:border-[#3B82F6] transition-all duration-300">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-sm font-medium text-[#9CA3AF]">${title}</h3>
                <div class="w-8 h-8 bg-gradient-to-r from-[${selectedColor.stop1}] to-[${selectedColor.stop2}] rounded-lg flex items-center justify-center">
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
                            <stop offset="0%" stop-color="${selectedColor.stop1}" />
                            <stop offset="100%" stop-color="${selectedColor.stop2}" />
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

// Score Progression Graph Component
export function ScoreProgressionGraph({ progression }) {
    const weeks = progression?.weeks || ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    const scores = progression?.scores || [0, 0, 0, 0];
    const maxScore = Math.max(...scores, 100);
    
    return `
        <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-6 border border-[#374151]">
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h3 class="text-lg font-semibold text-white">📈 Score Progressions</h3>
                    <p class="text-sm text-[#9CA3AF]">Your learning journey</p>
                </div>
                <div class="px-3 py-1 bg-[#3B82F6]/20 rounded-lg">
                    <span class="text-xs text-[#3B82F6]">📅 Last 4 Weeks</span>
                </div>
            </div>
            
            <div class="relative h-64">
                <canvas id="scoreProgressionCanvas" class="w-full h-full" style="width: 100%; height: 100%;"></canvas>
            </div>
            
            <div class="flex justify-between mt-4">
                ${weeks.map(week => `
                    <div class="text-center">
                        <div class="text-xs text-[#9CA3AF]">${week}</div>
                    </div>
                `).join('')}
            </div>
            
            <div class="mt-4 pt-4 border-t border-[#374151]">
                <div class="flex justify-between text-xs text-[#6B7280]">
                    <span>⬤ Current: ${scores[0] || 0}%</span>
                    <span>🏆 Best: ${Math.max(...scores)}%</span>
                    <span>📊 Average: ${Math.round(scores.reduce((a,b) => a + b, 0) / scores.length)}%</span>
                </div>
            </div>
        </div>
        
        <script>
            (function() {
                setTimeout(() => {
                    const canvas = document.getElementById('scoreProgressionCanvas');
                    if (!canvas) return;
                    
                    const container = canvas.parentElement;
                    const width = container.clientWidth;
                    const height = 250;
                    
                    canvas.width = width;
                    canvas.height = height;
                    canvas.style.width = width + 'px';
                    canvas.style.height = height + 'px';
                    
                    const ctx = canvas.getContext('2d');
                    if (!ctx) return;
                    
                    const weeks = ${JSON.stringify(weeks)};
                    const scores = ${JSON.stringify(scores)};
                    
                    ctx.clearRect(0, 0, width, height);
                    ctx.fillStyle = '#111827';
                    ctx.fillRect(0, 0, width, height);
                    
                    // Grid lines
                    ctx.beginPath();
                    ctx.strokeStyle = '#374151';
                    ctx.lineWidth = 1;
                    for (let i = 0; i <= 4; i++) {
                        const y = height - (i * height / 4);
                        ctx.beginPath();
                        ctx.moveTo(40, y);
                        ctx.lineTo(width - 20, y);
                        ctx.stroke();
                        ctx.fillStyle = '#9CA3AF';
                        ctx.font = '10px system-ui';
                        ctx.textAlign = 'right';
                        ctx.fillText((i * 25).toString(), 35, y + 3);
                    }
                    
                    const stepX = (width - 60) / (weeks.length - 1);
                    for (let i = 0; i < weeks.length; i++) {
                        const x = 40 + (i * stepX);
                        ctx.beginPath();
                        ctx.moveTo(x, 10);
                        ctx.lineTo(x, height - 10);
                        ctx.strokeStyle = '#374151';
                        ctx.stroke();
                    }
                    
                    if (scores.some(s => s > 0)) {
                        // Area
                        ctx.beginPath();
                        ctx.moveTo(40, height - (scores[0] / 100) * height);
                        for (let i = 1; i < scores.length; i++) {
                            const x = 40 + (i * stepX);
                            const y = height - (scores[i] / 100) * height;
                            ctx.lineTo(x, y);
                        }
                        ctx.lineTo(40 + ((scores.length - 1) * stepX), height);
                        ctx.lineTo(40, height);
                        ctx.closePath();
                        const gradient = ctx.createLinearGradient(0, 0, 0, height);
                        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
                        gradient.addColorStop(1, 'rgba(59, 130, 246, 0.05)');
                        ctx.fillStyle = gradient;
                        ctx.fill();
                        
                        // Line
                        ctx.beginPath();
                        ctx.moveTo(40, height - (scores[0] / 100) * height);
                        for (let i = 1; i < scores.length; i++) {
                            const x = 40 + (i * stepX);
                            const y = height - (scores[i] / 100) * height;
                            ctx.lineTo(x, y);
                        }
                        ctx.strokeStyle = '#3B82F6';
                        ctx.lineWidth = 3;
                        ctx.stroke();
                        
                        // Points
                        for (let i = 0; i < scores.length; i++) {
                            const x = 40 + (i * stepX);
                            const y = height - (scores[i] / 100) * height;
                            ctx.beginPath();
                            ctx.arc(x, y, 6, 0, 2 * Math.PI);
                            ctx.fillStyle = '#3B82F6';
                            ctx.fill();
                            ctx.beginPath();
                            ctx.arc(x, y, 4, 0, 2 * Math.PI);
                            ctx.fillStyle = '#FFFFFF';
                            ctx.fill();
                            if (scores[i] > 0) {
                                ctx.fillStyle = '#E5E7EB';
                                ctx.font = 'bold 10px system-ui';
                                ctx.textAlign = 'center';
                                let labelX = x;
                                let labelY = y - 12;
                                if (labelY < 20) labelY = y + 20;
                                ctx.fillText(scores[i] + '%', labelX, labelY);
                            }
                        }
                    } else {
                        ctx.fillStyle = '#9CA3AF';
                        ctx.font = '14px system-ui';
                        ctx.textAlign = 'center';
                        ctx.fillText('Complete quizzes to see your progress', width / 2, height / 2);
                    }
                    
                    ctx.beginPath();
                    ctx.strokeStyle = '#6B7280';
                    ctx.lineWidth = 2;
                    ctx.moveTo(40, 10);
                    ctx.lineTo(40, height - 10);
                    ctx.lineTo(width - 20, height - 10);
                    ctx.stroke();
                }, 100);
            })();
        </script>
    `;
}

// Add CSS animations
const scoreCardStyles = `
    @keyframes valuePop {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
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
    
    .score-card {
        animation: fadeInUp 0.4s ease-out forwards;
    }
`;

if (!document.querySelector('#score-card-styles')) {
    const style = document.createElement('style');
    style.id = 'score-card-styles';
    style.textContent = scoreCardStyles;
    document.head.appendChild(style);
}