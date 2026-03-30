// frontend/src/components/roadmap/RoadmapInput.js
// Topic input and settings component

export function RoadmapInput({ onGenerate, isLoading = false }) {
    return `
        <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-6 border border-[#374151] shadow-xl">
            <div class="flex items-center gap-3 mb-6">
                <div class="w-10 h-10 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-xl flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                    </svg>
                </div>
                <div>
                    <h3 class="text-lg font-bold text-white">Generate Learning Roadmap</h3>
                    <p class="text-xs text-[#9CA3AF]">AI-powered personalized learning path</p>
                </div>
            </div>
            
            <div class="space-y-4">
                <!-- Topic Input -->
                <div>
                    <label class="block text-sm font-medium text-[#9CA3AF] mb-2">📚 Topic</label>
                    <input type="text" 
                           id="roadmapTopic"
                           placeholder="e.g., Python, Machine Learning, React, Web Development"
                           class="w-full px-4 py-3 bg-[#111827] border border-[#374151] rounded-xl text-white placeholder-[#6B7280] focus:outline-none focus:border-[#3B82F6] transition-all">
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Difficulty Selector -->
                    <div>
                        <label class="block text-sm font-medium text-[#9CA3AF] mb-2">⚡ Difficulty Level</label>
                        <div class="flex gap-2">
                            <button type="button" 
                                    id="difficultyBeginner"
                                    class="difficulty-btn flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all bg-green-500/20 text-green-400 border border-green-500/30">
                                🌱 Beginner
                            </button>
                            <button type="button" 
                                    id="difficultyIntermediate"
                                    class="difficulty-btn flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all bg-[#374151] text-[#9CA3AF] hover:bg-yellow-500/20 hover:text-yellow-400">
                                ⚡ Intermediate
                            </button>
                            <button type="button" 
                                    id="difficultyAdvanced"
                                    class="difficulty-btn flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all bg-[#374151] text-[#9CA3AF] hover:bg-red-500/20 hover:text-red-400">
                                🚀 Advanced
                            </button>
                        </div>
                    </div>
                    
                    <!-- Depth Selector -->
                    <div>
                        <label class="block text-sm font-medium text-[#9CA3AF] mb-2">📏 Depth Level</label>
                        <div class="flex gap-2">
                            <button type="button" 
                                    id="depth2"
                                    class="depth-btn flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all bg-[#374151] text-[#9CA3AF] hover:bg-[#4B5563]">
                                Level 2
                            </button>
                            <button type="button" 
                                    id="depth3"
                                    class="depth-btn flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all bg-[#3B82F6] text-white">
                                Level 3
                            </button>
                            <button type="button" 
                                    id="depth4"
                                    class="depth-btn flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all bg-[#374151] text-[#9CA3AF] hover:bg-[#4B5563]">
                                Level 4
                            </button>
                            <button type="button" 
                                    id="depth5"
                                    class="depth-btn flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all bg-[#374151] text-[#9CA3AF] hover:bg-[#4B5563]">
                                Level 5
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Generate Button -->
                <button id="generateRoadmapBtn"
                        class="w-full mt-4 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] hover:from-[#60A5FA] hover:to-[#8B5CF6] text-white py-3 rounded-xl font-medium transition-all transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2"
                        ${isLoading ? 'disabled' : ''}>
                    ${isLoading ? 
                        '<div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Generating...' : 
                        '✨ Generate Roadmap'
                    }
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
            btn.addEventListener('click', () => {
                // Reset all difficulty buttons
                difficulties.forEach(d => {
                    const b = document.getElementById(d.id);
                    if (b) {
                        b.classList.remove('bg-green-500/20', 'text-green-400', 'border-green-500/30');
                        b.classList.remove('bg-yellow-500/20', 'text-yellow-400');
                        b.classList.remove('bg-red-500/20', 'text-red-400');
                        b.classList.add('bg-[#374151]', 'text-[#9CA3AF]');
                    }
                });
                // Style selected button
                btn.classList.remove('bg-[#374151]', 'text-[#9CA3AF]');
                if (diff.value === 'beginner') {
                    btn.classList.add('bg-green-500/20', 'text-green-400', 'border-green-500/30');
                } else if (diff.value === 'intermediate') {
                    btn.classList.add('bg-yellow-500/20', 'text-yellow-400');
                } else {
                    btn.classList.add('bg-red-500/20', 'text-red-400');
                }
                selectedDifficulty = diff.value;
            });
        }
    });
    
    // Depth buttons
    for (let i = 2; i <= 5; i++) {
        const btn = document.getElementById(`depth${i}`);
        if (btn) {
            btn.addEventListener('click', () => {
                // Reset all depth buttons
                for (let j = 2; j <= 5; j++) {
                    const b = document.getElementById(`depth${j}`);
                    if (b) {
                        b.classList.remove('bg-[#3B82F6]', 'text-white');
                        b.classList.add('bg-[#374151]', 'text-[#9CA3AF]');
                    }
                }
                // Style selected button
                btn.classList.remove('bg-[#374151]', 'text-[#9CA3AF]');
                btn.classList.add('bg-[#3B82F6]', 'text-white');
                selectedDepth = i;
            });
        }
    }
    
    // Generate button
    const generateBtn = document.getElementById('generateRoadmapBtn');
    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            const topicInput = document.getElementById('roadmapTopic');
            const topic = topicInput?.value.trim();
            
            if (!topic) {
                alert('Please enter a topic');
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
                generateBtn?.click();
            }
        });
    }
}