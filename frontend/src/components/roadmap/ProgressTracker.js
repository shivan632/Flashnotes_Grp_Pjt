// frontend/src/components/roadmap/ProgressTracker.js
// Track user progress on roadmap

export function ProgressTracker({ progress, totalNodes, onUpdate }) {
    const percentage = progress?.percentage_complete || 0;
    const completedNodes = progress?.completed_nodes || 0;
    
    // If no nodes exist, show message instead of update button
    const hasNodes = totalNodes > 0;
    
    return `
        <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-5 border border-[#374151]">
            <div class="flex items-center gap-2 mb-3">
                <div class="w-8 h-8 bg-gradient-to-r from-[#10B981] to-[#059669] rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <h4 class="text-md font-semibold text-white">Your Progress</h4>
            </div>
            
            <div class="w-full bg-[#374151] rounded-full h-3 mb-3">
                <div class="bg-gradient-to-r from-[#3B82F6] to-[#10B981] h-3 rounded-full transition-all duration-500" style="width: ${percentage}%"></div>
            </div>
            
            <div class="flex justify-between text-xs text-[#9CA3AF] mb-4">
                <span>Completed: ${completedNodes}/${totalNodes} topics</span>
                <span>${percentage === 100 ? '🎉 Completed!' : `${Math.round(percentage)}% done`}</span>
            </div>
            
            ${hasNodes && percentage < 100 ? `
                <button id="updateProgressBtn" class="w-full py-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-xl text-sm font-medium transition-all">
                    📝 Mark Next Topic Complete
                </button>
            ` : !hasNodes ? `
                <div class="text-center text-yellow-500 text-sm py-2">
                    ⚠️ No topics found. Please regenerate roadmap.
                </div>
            ` : `
                <div class="text-center text-green-500 text-sm py-2">
                    ✅ Congratulations! You've completed this roadmap!
                </div>
            `}
        </div>
    `;
}

export function setupProgressTracker({ onUpdate, currentProgress, totalNodes }) {
    const updateBtn = document.getElementById('updateProgressBtn');
    if (updateBtn) {
        updateBtn.addEventListener('click', () => {
            const newCompleted = (currentProgress?.completed_nodes || 0) + 1;
            if (newCompleted <= totalNodes) {
                if (onUpdate) onUpdate(newCompleted);
            }
        });
    }
}