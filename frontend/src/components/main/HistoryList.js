// frontend/src/components/main/HistoryList.js
import { getSearchHistory } from '../../services/storage.js';

export async function HistoryList() {
    const history = await getSearchHistory();
    
    return `
        <div class="bg-[#1F2937] p-6 rounded-xl shadow-lg">
            <h3 class="text-2xl font-bold mb-4 text-[#3B82F6] flex items-center gap-2">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Search History (${history.length})
            </h3>
            <div id="historyContainer" class="space-y-2 max-h-96 overflow-y-auto">
                ${history.length > 0 ? history.map(entry => `
                    <div class="bg-[#111827] p-3 rounded-lg flex justify-between items-center hover:bg-[#1F2937] transition-all cursor-pointer history-item" data-topic="${entry.topic}">
                        <div class="flex items-center gap-2">
                            <svg class="w-4 h-4 text-[#60A5FA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                            <span class="text-[#E5E7EB]">${entry.topic}</span>
                        </div>
                        <span class="text-[#9CA3AF] text-sm">${new Date(entry.searchedAt).toLocaleDateString()}</span>
                    </div>
                `).join('') : `
                    <div class="text-center py-8 text-[#9CA3AF]">
                        <svg class="w-16 h-16 mx-auto mb-3 text-[#4B5563]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <p>No search history yet</p>
                        <p class="text-sm mt-2">Your searched topics will appear here</p>
                    </div>
                `}
            </div>
        </div>
    `;
}

// Setup history item click events
export function setupHistoryEvents() {
    const historyItems = document.querySelectorAll('.history-item');
    historyItems.forEach(item => {
        item.addEventListener('click', () => {
            const topic = item.dataset.topic;
            const topicInput = document.getElementById('topicInput');
            const generateBtn = document.getElementById('generateBtn');
            
            if (topicInput) {
                topicInput.value = topic;
                // Highlight the input
                topicInput.style.borderColor = '#A78BFA';
                setTimeout(() => {
                    topicInput.style.borderColor = '#3B82F6';
                }, 1000);
                
                // Scroll to input
                topicInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Trigger generation after a short delay
                if (generateBtn) {
                    setTimeout(() => {
                        generateBtn.click();
                    }, 500);
                }
            }
        });
    });
}