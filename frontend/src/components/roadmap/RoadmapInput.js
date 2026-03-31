// frontend/src/components/roadmap/RoadmapInput.js
// Topic input and settings component - Enhanced UI

export function RoadmapInput({ onGenerate, isLoading = false }) {
    return `
        <div class="bg-gradient-to-br from-[#1F2937] via-[#1A2436] to-[#111827] rounded-2xl p-6 border border-[#374151] shadow-xl hover:shadow-2xl transition-all duration-300">
            <div class="flex items-center gap-3 mb-6">
                <div class="relative">
                    <div class="absolute inset-0 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-xl blur-md opacity-0 group-hover:opacity-50 transition-opacity"></div>
                    <div class="relative w-11 h-11 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                        </svg>
                    </div>
                </div>
                <div>
                    <h3 class="text-lg font-bold bg-gradient-to-r from-white to-[#9CA3AF] bg-clip-text text-transparent">Generate Learning Roadmap</h3>
                    <p class="text-xs text-[#6B7280]">AI-powered personalized learning path</p>
                </div>
            </div>
            
            <div class="space-y-4">
                <!-- Topic Input -->
                <div>
                    <label class="block text-sm font-medium text-[#9CA3AF] mb-2 flex items-center gap-1">
                        <span>📚</span> Topic
                    </label>
                    <input type="text" 
                           id="roadmapTopic"
                           placeholder="e.g., Python, Machine Learning, React, Web Development"
                           class="w-full px-4 py-3 bg-[#111827] border-2 border-[#374151] rounded-xl text-white placeholder-[#6B7280] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/30 transition-all duration-300 hover:border-[#4B5563]">
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Difficulty Selector -->
                    <div>
                        <label class="block text-sm font-medium text-[#9CA3AF] mb-2 flex items-center gap-1">
                            <span>⚡</span> Difficulty Level
                        </label>
                        <div class="flex gap-2">
                            <button type="button" 
                                    id="difficultyBeginner"
                                    class="difficulty-btn flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:scale-105">
                                🌱 Beginner
                            </button>
                            <button type="button" 
                                    id="difficultyIntermediate"
                                    class="difficulty-btn flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 bg-[#374151] text-[#9CA3AF] hover:bg-amber-500/20 hover:text-amber-400 hover:scale-105">
                                ⚡ Intermediate
                            </button>
                            <button type="button" 
                                    id="difficultyAdvanced"
                                    class="difficulty-btn flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 bg-[#374151] text-[#9CA3AF] hover:bg-rose-500/20 hover:text-rose-400 hover:scale-105">
                                🚀 Advanced
                            </button>
                        </div>
                    </div>
                    
                    <!-- Depth Selector -->
                    <div>
                        <label class="block text-sm font-medium text-[#9CA3AF] mb-2 flex items-center gap-1">
                            <span>📏</span> Depth Level
                        </label>
                        <div class="flex gap-2">
                            <button type="button" 
                                    id="depth2"
                                    class="depth-btn flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 bg-[#374151] text-[#9CA3AF] hover:bg-[#4B5563] hover:scale-105">
                                Level 2
                            </button>
                            <button type="button" 
                                    id="depth3"
                                    class="depth-btn flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 bg-[#3B82F6] text-white shadow-md hover:scale-105">
                                Level 3
                            </button>
                            <button type="button" 
                                    id="depth4"
                                    class="depth-btn flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 bg-[#374151] text-[#9CA3AF] hover:bg-[#4B5563] hover:scale-105">
                                Level 4
                            </button>
                            <button type="button" 
                                    id="depth5"
                                    class="depth-btn flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 bg-[#374151] text-[#9CA3AF] hover:bg-[#4B5563] hover:scale-105">
                                Level 5
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Generate Button -->
                <button id="generateRoadmapBtn"
                        class="group relative w-full mt-4 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] hover:from-[#60A5FA] hover:to-[#8B5CF6] text-white py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] shadow-lg overflow-hidden"
                        ${isLoading ? 'disabled' : ''}>
                    <div class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    <span class="relative z-10 flex items-center justify-center gap-2">
                        ${isLoading ? 
                            '<div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Generating...' : 
                            '<svg class="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg> Generate Roadmap'
                        }
                    </span>
                </button>
            </div>
        </div>
    `;
}

// Setup roadmap input events
export function setupRoadmapInput(onGenerate) {
    let selectedDifficulty = 'beginner';
    let selectedDepth = 3;
    
    // Difficulty buttons
    const difficulties = [
        { id: 'difficultyBeginner', value: 'beginner' },
        { id: 'difficultyIntermediate', value: 'intermediate' },
        { id: 'difficultyAdvanced', value: 'advanced' }
    ];
    
    difficulties.forEach(diff => {
        const btn = document.getElementById(diff.id);
        if (btn) {
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            
            newBtn.addEventListener('click', () => {
                difficulties.forEach(d => {
                    const b = document.getElementById(d.id);
                    if (b) {
                        b.classList.remove('bg-emerald-500/20', 'text-emerald-400', 'border-emerald-500/30');
                        b.classList.remove('bg-amber-500/20', 'text-amber-400');
                        b.classList.remove('bg-rose-500/20', 'text-rose-400');
                        b.classList.add('bg-[#374151]', 'text-[#9CA3AF]');
                        b.classList.remove('border', 'border-emerald-500/30');
                    }
                });
                
                newBtn.classList.remove('bg-[#374151]', 'text-[#9CA3AF]');
                if (diff.value === 'beginner') {
                    newBtn.classList.add('bg-emerald-500/20', 'text-emerald-400', 'border', 'border-emerald-500/30');
                } else if (diff.value === 'intermediate') {
                    newBtn.classList.add('bg-amber-500/20', 'text-amber-400');
                } else {
                    newBtn.classList.add('bg-rose-500/20', 'text-rose-400');
                }
                selectedDifficulty = diff.value;
            });
        }
    });
    
    // Depth buttons
    for (let i = 2; i <= 5; i++) {
        const btn = document.getElementById(`depth${i}`);
        if (btn) {
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            
            newBtn.addEventListener('click', () => {
                for (let j = 2; j <= 5; j++) {
                    const b = document.getElementById(`depth${j}`);
                    if (b) {
                        b.classList.remove('bg-[#3B82F6]', 'text-white');
                        b.classList.add('bg-[#374151]', 'text-[#9CA3AF]');
                    }
                }
                newBtn.classList.remove('bg-[#374151]', 'text-[#9CA3AF]');
                newBtn.classList.add('bg-[#3B82F6]', 'text-white');
                selectedDepth = i;
            });
        }
    }
    
    // Generate button
    const generateBtn = document.getElementById('generateRoadmapBtn');
    if (generateBtn) {
        const newGenerateBtn = generateBtn.cloneNode(true);
        generateBtn.parentNode.replaceChild(newGenerateBtn, generateBtn);
        
        newGenerateBtn.addEventListener('click', () => {
            const topicInput = document.getElementById('roadmapTopic');
            const topic = topicInput?.value.trim();
            
            if (!topic) {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'fixed bottom-4 right-4 bg-red-500/20 border border-red-500 text-red-400 px-4 py-2 rounded-lg animate-slideInRight z-50';
                errorDiv.textContent = '⚠️ Please enter a topic';
                document.body.appendChild(errorDiv);
                setTimeout(() => errorDiv.remove(), 3000);
                topicInput?.focus();
                return;
            }
            
            onGenerate(topic, selectedDifficulty, selectedDepth);
        });
    }
    
    // Enter key support
    const topicInput = document.getElementById('roadmapTopic');
    if (topicInput) {
        topicInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('generateRoadmapBtn')?.click();
            }
        });
    }
}