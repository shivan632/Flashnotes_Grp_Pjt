// frontend/src/components/score/ProgressChart.js

export function ProgressChart({ data }) {
    const maxScore = Math.max(...data.map(d => d.score), 100);
    
    return `
        <div class="progress-chart bg-[#1F2937] rounded-xl shadow-lg p-6">
            <h3 class="text-xl font-bold text-[#E5E7EB] mb-6">Progress Over Time</h3>
            <div class="h-64 flex items-end justify-between gap-2">
                ${data.map(item => {
                    const height = (item.score / maxScore) * 100;
                    return `
                        <div class="flex-1 flex flex-col items-center group">
                            <div class="w-full bg-[#3B82F6] rounded-t-lg transition-all group-hover:bg-[#60A5FA] relative" 
                                 style="height: ${height}%">
                                <div class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#1F2937] text-[#E5E7EB] text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    ${item.score}%
                                </div>
                            </div>
                            <span class="text-xs text-[#9CA3AF] mt-2">${item.label}</span>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}