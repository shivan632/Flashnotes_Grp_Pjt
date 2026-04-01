export function NotesInput({ onGenerate, isLoading = false }) {
    return `
        <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-6 border border-[#374151] shadow-xl">
            <div class="flex items-center gap-3 mb-6">
                <div class="relative">
                    <div class="absolute inset-0 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-xl blur-md opacity-0 group-hover:opacity-50 transition-opacity"></div>
                    <div class="relative w-11 h-11 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-xl flex items-center justify-center shadow-lg">
                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"></path>
                        </svg>
                    </div>
                </div>
                <div>
                    <h3 class="text-lg font-bold text-white">AI Notes Generator</h3>
                    <p class="text-xs text-[#6B7280]">Generate structured notes with code examples</p>
                </div>
            </div>
            
            <div class="space-y-4">
                <!-- Topic Input -->
                <div>
                    <label class="block text-sm font-medium text-[#9CA3AF] mb-2">📚 Topic</label>
                    <input type="text" 
                           id="notesTopic"
                           placeholder="e.g., Python, JavaScript, React, Machine Learning"
                           class="w-full px-4 py-3 bg-[#111827] border-2 border-[#374151] rounded-xl text-white placeholder-[#6B7280] focus:outline-none focus:border-[#3B82F6] transition-all duration-300">
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                    <!-- Difficulty Selector -->
                    <div>
                        <label class="block text-sm font-medium text-[#9CA3AF] mb-2">⚡ Difficulty</label>
                        <div class="flex gap-2">
                            <button type="button" 
                                    id="notesDifficultyBeginner"
                                    class="difficulty-btn flex-1 px-3 py-2 rounded-xl text-sm font-medium transition-all bg-green-500/20 text-green-400 border border-green-500/30">
                                🌱 Beginner
                            </button>
                            <button type="button" 
                                    id="notesDifficultyIntermediate"
                                    class="difficulty-btn flex-1 px-3 py-2 rounded-xl text-sm font-medium transition-all bg-[#374151] text-[#9CA3AF] hover:bg-yellow-500/20 hover:text-yellow-400">
                                ⚡ Intermediate
                            </button>
                            <button type="button" 
                                    id="notesDifficultyAdvanced"
                                    class="difficulty-btn flex-1 px-3 py-2 rounded-xl text-sm font-medium transition-all bg-[#374151] text-[#9CA3AF] hover:bg-red-500/20 hover:text-red-400">
                                🚀 Advanced
                            </button>
                        </div>
                    </div>
                    
                    <!-- Style Selector -->
                    <div>
                        <label class="block text-sm font-medium text-[#9CA3AF] mb-2">📝 Style</label>
                        <div class="flex gap-2">
                            <button type="button" 
                                    id="notesStyleDetailed"
                                    class="style-btn flex-1 px-3 py-2 rounded-xl text-sm font-medium transition-all bg-[#3B82F6] text-white">
                                Detailed
                            </button>
                            <button type="button" 
                                    id="notesStyleConcise"
                                    class="style-btn flex-1 px-3 py-2 rounded-xl text-sm font-medium transition-all bg-[#374151] text-[#9CA3AF] hover:bg-[#4B5563]">
                                Concise
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Generate Button -->
                <button id="generateNotesBtn"
                        class="group relative w-full mt-4 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] hover:from-[#60A5FA] hover:to-[#8B5CF6] text-white py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] shadow-lg overflow-hidden"
                        ${isLoading ? 'disabled' : ''}>
                    <div class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    <span class="relative z-10 flex items-center justify-center gap-2">
                        ${isLoading ? 
                            '<div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Generating...' : 
                            '<svg class="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"></path></svg> Generate Notes'
                        }
                    </span>
                </button>
            </div>
        </div>
    `;
}

export function setupNotesInput(onGenerate) {
    let selectedDifficulty = 'beginner';
    let selectedStyle = 'detailed';
    
    // Difficulty buttons
    const difficulties = [
        { id: 'notesDifficultyBeginner', value: 'beginner' },
        { id: 'notesDifficultyIntermediate', value: 'intermediate' },
        { id: 'notesDifficultyAdvanced', value: 'advanced' }
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
                        b.classList.remove('bg-green-500/20', 'text-green-400', 'border-green-500/30');
                        b.classList.remove('bg-yellow-500/20', 'text-yellow-400');
                        b.classList.remove('bg-red-500/20', 'text-red-400');
                        b.classList.add('bg-[#374151]', 'text-[#9CA3AF]');
                    }
                });
                newBtn.classList.remove('bg-[#374151]', 'text-[#9CA3AF]');
                if (diff.value === 'beginner') {
                    newBtn.classList.add('bg-green-500/20', 'text-green-400', 'border-green-500/30');
                } else if (diff.value === 'intermediate') {
                    newBtn.classList.add('bg-yellow-500/20', 'text-yellow-400');
                } else {
                    newBtn.classList.add('bg-red-500/20', 'text-red-400');
                }
                selectedDifficulty = diff.value;
            });
        }
    });
    
    // Style buttons
    const styles = [
        { id: 'notesStyleDetailed', value: 'detailed' },
        { id: 'notesStyleConcise', value: 'concise' }
    ];
    
    styles.forEach(style => {
        const btn = document.getElementById(style.id);
        if (btn) {
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            
            newBtn.addEventListener('click', () => {
                styles.forEach(s => {
                    const b = document.getElementById(s.id);
                    if (b) {
                        b.classList.remove('bg-[#3B82F6]', 'text-white');
                        b.classList.add('bg-[#374151]', 'text-[#9CA3AF]');
                    }
                });
                newBtn.classList.remove('bg-[#374151]', 'text-[#9CA3AF]');
                newBtn.classList.add('bg-[#3B82F6]', 'text-white');
                selectedStyle = style.value;
            });
        }
    });
    
    // Generate button
    const generateBtn = document.getElementById('generateNotesBtn');
    if (generateBtn) {
        const newBtn = generateBtn.cloneNode(true);
        generateBtn.parentNode.replaceChild(newBtn, generateBtn);
        
        newBtn.addEventListener('click', () => {
            const topicInput = document.getElementById('notesTopic');
            const topic = topicInput?.value.trim();
            
            if (!topic) {
                alert('Please enter a topic');
                topicInput?.focus();
                return;
            }
            
            onGenerate(topic, selectedDifficulty, selectedStyle);
        });
    }
    
    // Enter key support
    const topicInput = document.getElementById('notesTopic');
    if (topicInput) {
        topicInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('generateNotesBtn')?.click();
            }
        });
    }
}