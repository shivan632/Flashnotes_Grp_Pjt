// frontend/src/components/roadmap/ProgressTracker.js
// Track user progress on roadmap - Enhanced UI

export function ProgressTracker({ progress, totalNodes, onUpdate }) {
    const percentage = progress?.percentage_complete || 0;
    const completedNodes = progress?.completed_nodes || 0;
    const hasNodes = totalNodes > 0;
    
    // Determine color based on percentage
    const progressColor = percentage >= 70 ? 'from-emerald-500 to-green-500' : 
                         percentage >= 30 ? 'from-[#3B82F6] to-[#60A5FA]' : 
                         'from-amber-500 to-orange-500';
    
    return `
        <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-5 border border-[#374151] shadow-lg hover:shadow-xl transition-all duration-300">
            <div class="flex items-center gap-2 mb-4">
                <div class="relative">
                    <div class="absolute inset-0 bg-gradient-to-r from-[#10B981] to-[#059669] rounded-lg blur-md opacity-0 group-hover:opacity-50 transition-opacity"></div>
                    <div class="relative w-9 h-9 bg-gradient-to-r from-[#10B981] to-[#059669] rounded-lg flex items-center justify-center shadow-md">
                        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                </div>
                <div>
                    <h4 class="text-md font-semibold text-white">Your Progress</h4>
                    <p class="text-xs text-[#6B7280]">Track your learning journey</p>
                </div>
            </div>
            
            <div class="mb-3">
                <div class="flex justify-between text-xs text-[#9CA3AF] mb-1.5">
                    <span class="flex items-center gap-1">
                        <span class="w-1.5 h-1.5 bg-[#3B82F6] rounded-full animate-pulse"></span>
                        Completion
                    </span>
                    <span class="font-semibold ${percentage >= 70 ? 'text-emerald-400' : percentage >= 30 ? 'text-[#3B82F6]' : 'text-amber-400'}">${Math.round(percentage)}%</span>
                </div>
                <div class="w-full bg-[#374151] rounded-full h-2.5 overflow-hidden">
                    <div class="bg-gradient-to-r ${progressColor} h-2.5 rounded-full transition-all duration-700 ease-out animate-progressBar" style="width: ${percentage}%"></div>
                </div>
            </div>
            
            <div class="flex justify-between text-xs text-[#9CA3AF] mb-5">
                <span class="flex items-center gap-1">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    ${completedNodes}/${totalNodes} topics
                </span>
                <span class="flex items-center gap-1">
                    ${percentage === 100 ? 
                        '<span class="text-green-500">🏆 Completed!</span>' : 
                        `<span class="animate-pulse">📚 ${totalNodes - completedNodes} remaining</span>`
                    }
                </span>
            </div>
            
            ${hasNodes && percentage < 100 ? `
                <button id="updateProgressBtn" class="group relative w-full py-2.5 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] hover:from-[#60A5FA] hover:to-[#8B5CF6] text-white rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-[1.02] shadow-md overflow-hidden">
                    <div class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    <span class="relative z-10 flex items-center justify-center gap-2">
                        <svg class="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        Mark Next Topic Complete
                    </span>
                </button>
            ` : !hasNodes ? `
                <div class="text-center text-amber-500 text-sm py-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
                    ⚠️ No topics found. Please regenerate roadmap.
                </div>
            ` : `
                <div class="text-center text-emerald-500 text-sm py-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 animate-pulse">
                    🎉 Congratulations! You've mastered this roadmap!
                </div>
            `}
        </div>
    `;
}

export function setupProgressTracker({ onUpdate, currentProgress, totalNodes }) {
    const updateBtn = document.getElementById('updateProgressBtn');
    if (updateBtn) {
        const newBtn = updateBtn.cloneNode(true);
        updateBtn.parentNode.replaceChild(newBtn, updateBtn);
        
        newBtn.addEventListener('click', () => {
            const newCompleted = (currentProgress?.completed_nodes || 0) + 1;
            if (newCompleted <= totalNodes) {
                if (onUpdate) onUpdate(newCompleted);
                
                // Button click animation
                newBtn.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    newBtn.style.transform = 'scale(1)';
                }, 150);
            }
        });
    }
}

// Add CSS animation
const progressStyles = `
    @keyframes progressBar {
        from {
            width: 0%;
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    
    .animate-progressBar {
        animation: progressBar 0.8s ease-out forwards;
    }
`;

if (!document.querySelector('#progress-styles')) {
    const style = document.createElement('style');
    style.id = 'progress-styles';
    style.textContent = progressStyles;
    document.head.appendChild(style);
}