// frontend/src/components/main/TopicInput.js
import { QUICK_TOPICS } from '../../utils/constants.js';

export function TopicInput() {
    return `
        <div class="group bg-gradient-to-br from-[#1F2937] to-[#111827] p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 mb-10 border border-[#374151] hover:border-[#3B82F6]">
            <h3 class="text-2xl font-bold mb-5 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent flex items-center gap-2">
                <svg class="w-7 h-7 text-[#3B82F6] animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
                What would you like to learn today?
            </h3>
            
            <div class="flex flex-col md:flex-row gap-4">
                <div class="relative flex-1 group/input">
                    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg class="w-5 h-5 text-[#9CA3AF] group-focus-within/input:text-[#3B82F6] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </div>
                    <input type="text" 
                           id="topicInput"
                           placeholder="e.g., Operating System, Quantum Physics, Machine Learning..." 
                           class="w-full bg-[#111827] border-2 border-[#374151] rounded-xl pl-12 pr-4 py-4 text-[#E5E7EB] placeholder:text-[#6B7280] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/30 transition-all duration-300 hover:border-[#60A5FA]"
                           autocomplete="off">
                </div>
                <button id="generateBtn" 
                        class="relative overflow-hidden bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] hover:from-[#60A5FA] hover:to-[#8B5CF6] text-white px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 font-semibold shadow-lg group/btn">
                    <span class="relative z-10">Generate</span>
                    <svg class="w-5 h-5 relative z-10 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                    <div class="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                </button>
            </div>
            
            <!-- Quick Topics -->
            <div class="flex flex-wrap gap-2 mt-6 pt-2">
                <span class="text-[#9CA3AF] text-sm flex items-center gap-1">
                    <span class="w-1 h-1 bg-[#3B82F6] rounded-full"></span>
                    Popular:
                </span>
                ${QUICK_TOPICS.slice(0, 8).map((topic, index) => `
                    <button class="quick-topic group/topic text-sm bg-[#111827] hover:bg-gradient-to-r hover:from-[#3B82F6] hover:to-[#A78BFA] text-[#60A5FA] hover:text-white px-3 py-1.5 rounded-full transition-all duration-300 transform hover:scale-105 border border-[#374151] hover:border-transparent"
                            style="animation: fadeInScale 0.3s ease-out ${index * 0.05}s forwards">
                        ${topic}
                    </button>
                `).join('')}
            </div>
            
            <!-- Hint -->
            <div class="mt-5 pt-3 border-t border-[#374151] flex items-center justify-between text-xs text-[#6B7280]">
                <div class="flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>AI generates multiple Q&A pairs</span>
                </div>
                <div class="flex items-center gap-2">
                    <span>Press Enter to generate</span>
                    <kbd class="px-2 py-0.5 bg-[#374151] rounded text-xs font-mono">↵</kbd>
                </div>
            </div>
        </div>
    `;
}

// Setup quick topic buttons with enhanced animations
export function setupQuickTopics() {
    const quickTopics = document.querySelectorAll('.quick-topic');
    const topicInput = document.getElementById('topicInput');
    const generateBtn = document.getElementById('generateBtn');
    
    quickTopics.forEach(btn => {
        btn.addEventListener('click', () => {
            if (topicInput) {
                const topic = btn.textContent;
                topicInput.value = topic;
                
                // Animate the input
                topicInput.classList.add('border-[#A78BFA]', 'scale-[1.02]', 'shadow-lg');
                setTimeout(() => {
                    topicInput.classList.remove('border-[#A78BFA]', 'scale-[1.02]', 'shadow-lg');
                }, 300);
                
                // Add ripple effect to the button
                if (generateBtn) {
                    generateBtn.classList.add('scale-105');
                    setTimeout(() => {
                        generateBtn.classList.remove('scale-105');
                    }, 200);
                    
                    // Auto-generate after a short delay
                    setTimeout(() => {
                        generateBtn.click();
                    }, 300);
                }
            }
        });
    });
    
    // Add focus animation to input
    if (topicInput) {
        topicInput.addEventListener('focus', () => {
            topicInput.parentElement?.classList.add('ring-2', 'ring-[#3B82F6]/20');
        });
        topicInput.addEventListener('blur', () => {
            topicInput.parentElement?.classList.remove('ring-2', 'ring-[#3B82F6]/20');
        });
    }
}

// Add CSS animations
const topicInputStyles = `
    @keyframes fadeInScale {
        from {
            opacity: 0;
            transform: scale(0.9);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    .quick-topic {
        opacity: 0;
        animation: fadeInScale 0.3s ease-out forwards;
    }
    
    .quick-topic:nth-child(1) { animation-delay: 0.05s; }
    .quick-topic:nth-child(2) { animation-delay: 0.1s; }
    .quick-topic:nth-child(3) { animation-delay: 0.15s; }
    .quick-topic:nth-child(4) { animation-delay: 0.2s; }
    .quick-topic:nth-child(5) { animation-delay: 0.25s; }
    .quick-topic:nth-child(6) { animation-delay: 0.3s; }
    .quick-topic:nth-child(7) { animation-delay: 0.35s; }
    .quick-topic:nth-child(8) { animation-delay: 0.4s; }
    
    #topicInput {
        transition: all 0.2s ease;
    }
    
    #generateBtn {
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
`;

if (!document.querySelector('#topic-input-styles')) {
    const style = document.createElement('style');
    style.id = 'topic-input-styles';
    style.textContent = topicInputStyles;
    document.head.appendChild(style);
}