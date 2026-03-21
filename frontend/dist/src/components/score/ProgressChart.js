// frontend/src/components/score/ProgressChart.js
// Progress Chart Component - Enhanced UI with proper visibility (FIXED)

export function ProgressChart({ data, title = 'Progress Over Time', height = 64 }) {
    if (!data || data.length === 0) {
        return `
            <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl shadow-xl p-6 border border-[#374151]">
                <div class="flex items-center gap-3 mb-4">
                    <div class="w-8 h-8 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-xl flex items-center justify-center">
                        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                        </svg>
                    </div>
                    <h3 class="text-xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">${title}</h3>
                </div>
                <div class="text-center py-12">
                    <div class="relative">
                        <div class="absolute inset-0 flex items-center justify-center">
                            <div class="w-20 h-20 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full opacity-10 blur-xl"></div>
                        </div>
                        <svg class="w-16 h-16 mx-auto mb-3 text-[#4B5563] relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                        </svg>
                        <p class="text-[#9CA3AF]">No chart data available yet</p>
                        <p class="text-xs text-[#6B7280] mt-1">Complete quizzes to see your progress</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    const maxScore = Math.max(...data.map(d => d.score), 100);
    
    return `
        <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl shadow-xl p-6 border border-[#374151] transition-all duration-300 hover:shadow-2xl">
            <!-- Header -->
            <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-xl flex items-center justify-center">
                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                        </svg>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">${title}</h3>
                        <p class="text-xs text-[#6B7280]">Your learning journey</p>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <div class="flex items-center gap-1">
                        <div class="w-2 h-2 bg-[#3B82F6] rounded-full"></div>
                        <span class="text-xs text-[#9CA3AF]">Score %</span>
                    </div>
                    <div class="flex items-center gap-1">
                        <div class="w-2 h-2 bg-[#60A5FA] rounded-full"></div>
                        <span class="text-xs text-[#9CA3AF]">Target (70%)</span>
                    </div>
                </div>
            </div>
            
            <!-- Chart Container -->
            <div class="relative" style="height: ${height * 4}px">
                <!-- Y-Axis Labels -->
                <div class="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-between text-xs text-[#6B7280]">
                    <span>100%</span>
                    <span>75%</span>
                    <span>50%</span>
                    <span>25%</span>
                    <span>0%</span>
                </div>
                
                <!-- Chart Bars -->
                <div class="ml-10 h-full flex items-end justify-between gap-2">
                    ${data.map((item, index) => {
                        const height = Math.max((item.score / maxScore) * 100, 2);
                        const isAboveTarget = item.score >= 70;
                        const barColor = isAboveTarget ? 'from-[#3B82F6] to-[#60A5FA]' : 'from-[#F59E0B] to-[#EF4444]';
                        
                        return `
                            <div class="flex-1 flex flex-col items-center group relative" style="height: 100%">
                                <!-- Bar Container -->
                                <div class="relative w-full flex-1 flex items-end">
                                    <div class="w-full bg-gradient-to-t ${barColor} rounded-t-xl transition-all duration-500 ease-out cursor-pointer relative group/bar" 
                                         style="height: ${height}%; min-height: 4px;">
                                        <!-- Tooltip -->
                                        <div class="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-[#1F2937] border border-[#374151] text-[#E5E7EB] text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-lg z-20 pointer-events-none">
                                            <div class="font-semibold">${item.label}</div>
                                            <div class="text-[#3B82F6]">${item.score}%</div>
                                        </div>
                                        
                                        <!-- Animated Pulse Effect on Hover -->
                                        <div class="absolute inset-0 bg-white/20 opacity-0 group-hover/bar:opacity-100 transition-opacity duration-300 rounded-t-xl"></div>
                                    </div>
                                </div>
                                
                                <!-- Target Line Indicator -->
                                <div class="absolute bottom-0 left-0 right-0 pointer-events-none">
                                    <div class="border-t-2 border-dashed border-[#60A5FA] relative" style="bottom: ${(70 / maxScore) * 100}%">
                                        <div class="absolute -left-1 -top-1 w-2 h-2 bg-[#60A5FA] rounded-full"></div>
                                    </div>
                                </div>
                                
                                <!-- Label -->
                                <div class="mt-3 text-center">
                                    <span class="text-xs text-[#9CA3AF] group-hover:text-[#3B82F6] transition-colors">${item.label}</span>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
            
            <!-- Stats Summary -->
            <div class="mt-6 pt-4 border-t border-[#374151] grid grid-cols-3 gap-4">
                <div class="text-center">
                    <div class="text-2xl font-bold text-[#3B82F6]">${Math.round(data.reduce((sum, d) => sum + d.score, 0) / data.length)}%</div>
                    <div class="text-xs text-[#9CA3AF]">Average Score</div>
                </div>
                <div class="text-center">
                    <div class="text-2xl font-bold text-[#3B82F6]">${data.filter(d => d.score >= 70).length}</div>
                    <div class="text-xs text-[#9CA3AF]">Above Target</div>
                </div>
                <div class="text-center">
                    <div class="text-2xl font-bold text-[#3B82F6]">${Math.max(...data.map(d => d.score))}%</div>
                    <div class="text-xs text-[#9CA3AF]">Best Score</div>
                </div>
            </div>
            
            ${data.length > 1 ? `
            <!-- Trend Indicator -->
            <div class="mt-4 pt-3 border-t border-[#374151] flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <svg class="w-4 h-4 ${data[data.length - 1].score > data[0].score ? 'text-green-500' : data[data.length - 1].score < data[0].score ? 'text-red-500' : 'text-yellow-500'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${data[data.length - 1].score > data[0].score ? 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' : data[data.length - 1].score < data[0].score ? 'M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6' : 'M5 12h14'}"></path>
                    </svg>
                    <span class="text-xs text-[#9CA3AF]">
                        ${data[data.length - 1].score > data[0].score 
                            ? `Up by ${Math.abs(data[data.length - 1].score - data[0].score)}% since start` 
                            : data[data.length - 1].score < data[0].score 
                            ? `Down by ${Math.abs(data[data.length - 1].score - data[0].score)}% since start`
                            : 'No change since start'}
                    </span>
                </div>
                <div class="text-xs text-[#6B7280]">
                    Last ${data.length} ${data.length === 1 ? 'quiz' : 'quizzes'}
                </div>
            </div>
            ` : ''}
        </div>
    `;
}

// Line Chart variant for smoother progression
export function LineProgressChart({ data, title = 'Progress Trend' }) {
    if (!data || data.length === 0) {
        return ProgressChart({ data: [], title });
    }
    
    const maxScore = Math.max(...data.map(d => d.score), 100);
    const points = data.map((item, index) => {
        const x = (index / (data.length - 1)) * 100;
        const y = 100 - (item.score / maxScore) * 100;
        return `${x},${y}`;
    }).join(' ');
    
    return `
        <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl shadow-xl p-6 border border-[#374151]">
            <div class="flex items-center gap-3 mb-6">
                <div class="w-10 h-10 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-xl flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4 2 2"></path>
                    </svg>
                </div>
                <h3 class="text-xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">${title}</h3>
            </div>
            
            <div class="relative h-64">
                <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <!-- Grid Lines -->
                    <line x1="0" y1="0" x2="100" y2="0" stroke="#374151" stroke-width="0.5" stroke-dasharray="2,2"/>
                    <line x1="0" y1="25" x2="100" y2="25" stroke="#374151" stroke-width="0.5" stroke-dasharray="2,2"/>
                    <line x1="0" y1="50" x2="100" y2="50" stroke="#374151" stroke-width="0.5" stroke-dasharray="2,2"/>
                    <line x1="0" y1="75" x2="100" y2="75" stroke="#374151" stroke-width="0.5" stroke-dasharray="2,2"/>
                    <line x1="0" y1="100" x2="100" y2="100" stroke="#374151" stroke-width="0.5" stroke-dasharray="2,2"/>
                    
                    <!-- Line -->
                    <polyline points="${points}" fill="none" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    
                    <!-- Points -->
                    ${data.map((item, index) => {
                        const x = (index / (data.length - 1)) * 100;
                        const y = 100 - (item.score / maxScore) * 100;
                        return `
                            <circle cx="${x}" cy="${y}" r="2" fill="#3B82F6" stroke="#1F2937" stroke-width="1"/>
                        `;
                    }).join('')}
                </svg>
                
                <!-- X-Axis Labels -->
                <div class="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-[#6B7280] px-2">
                    ${data.map(item => `<span>${item.label}</span>`).join('')}
                </div>
            </div>
        </div>
    `;
}

// Add CSS animations
const chartStyles = `
    @keyframes barRise {
        from {
            height: 0;
            opacity: 0;
        }
        to {
            height: var(--target-height);
            opacity: 1;
        }
    }
    
    .progress-chart-bar {
        animation: barRise 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }
    
    .chart-tooltip {
        transition: all 0.2s ease;
    }
`;

if (!document.querySelector('#chart-styles')) {
    const style = document.createElement('style');
    style.id = 'chart-styles';
    style.textContent = chartStyles;
    document.head.appendChild(style);
}