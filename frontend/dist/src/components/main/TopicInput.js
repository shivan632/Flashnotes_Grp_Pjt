// frontend/src/components/main/TopicInput.js
import { QUICK_TOPICS } from '../../utils/constants.js';

export function TopicInput() {
    return `
        <div class="bg-[#1F2937] p-8 rounded-xl shadow-lg mb-8 hover:shadow-2xl transition-shadow">
            <h3 class="text-2xl font-bold mb-4 text-[#3B82F6] flex items-center gap-2">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
                What would you like to learn today?
            </h3>
            
            <div class="flex flex-col md:flex-row gap-4">
                <input type="text" 
                       id="topicInput"
                       placeholder="e.g., Operating System, Quantum Physics, Machine Learning..." 
                       class="flex-1 bg-[#111827] border-2 border-[#3B82F6] rounded-lg px-4 py-3 text-[#E5E7EB] focus:outline-none focus:border-[#A78BFA] transition-colors"
                       autocomplete="off">
                <button id="generateBtn" 
                        class="bg-[#3B82F6] hover:bg-[#60A5FA] text-white px-8 py-3 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2 font-medium">
                    <span>Generate</span>
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                </button>
            </div>
            
            <!-- Quick Topics -->
            <div class="flex flex-wrap gap-2 mt-4">
                <span class="text-[#9CA3AF] text-sm">Popular:</span>
                ${QUICK_TOPICS.slice(0, 6).map(topic => `
                    <button class="quick-topic text-sm text-[#60A5FA] hover:text-[#3B82F6] px-3 py-1 bg-[#111827] rounded-full transition-colors">
                        ${topic}
                    </button>
                `).join('')}
            </div>
        </div>
    `;
}

// Setup quick topic buttons
export function setupQuickTopics() {
    const quickTopics = document.querySelectorAll('.quick-topic');
    const topicInput = document.getElementById('topicInput');
    const generateBtn = document.getElementById('generateBtn');
    
    quickTopics.forEach(btn => {
        btn.addEventListener('click', () => {
            if (topicInput) {
                topicInput.value = btn.textContent;
                // Trigger click animation
                topicInput.style.borderColor = '#A78BFA';
                setTimeout(() => {
                    topicInput.style.borderColor = '#3B82F6';
                }, 1000);
                
                // Auto-generate after a short delay
                if (generateBtn) {
                    setTimeout(() => {
                        generateBtn.click();
                    }, 500);
                }
            }
        });
    });
}