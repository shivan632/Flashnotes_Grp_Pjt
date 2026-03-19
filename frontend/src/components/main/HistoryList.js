// frontend/src/components/main/HistoryList.js - FIXED
import { getSearchHistory } from '../../services/storage.js';

export async function HistoryList() {
    let history = [];
    try {
        history = await getSearchHistory() || [];
    } catch (error) {
        console.error('Error loading history:', error);
    }
    
    // Ensure history is an array
    if (!Array.isArray(history)) {
        history = [];
    }
    
    return `
        <div class="bg-[#1F2937] p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl sm:text-2xl font-bold text-[#3B82F6] flex items-center gap-2">
                    <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Search History
                </h3>
                <span class="bg-[#3B82F6] text-white px-3 py-1 rounded-full text-sm">${history.length}</span>
            </div>
            
            <div id="historyContainer" class="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
                ${history.length > 0 ? history.map(entry => `
                    <div class="bg-[#111827] p-3 rounded-lg flex justify-between items-center hover:bg-[#1F2937] transition-all cursor-pointer group history-item" data-topic="${entry.topic || ''}">
                        <div class="flex items-center gap-2 flex-1 min-w-0">
                            <svg class="w-4 h-4 text-[#60A5FA] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                            <span class="text-[#E5E7EB] truncate">${entry.topic || 'Unknown topic'}</span>
                        </div>
                        <span class="text-[#9CA3AF] text-sm flex-shrink-0">${entry.searchedAt ? new Date(entry.searchedAt).toLocaleDateString() : 'Unknown'}</span>
                    </div>
                `).join('') : `
                    <div class="text-center py-8">
                        <svg class="w-16 h-16 mx-auto text-[#4B5563] mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <p class="text-[#9CA3AF]">No search history yet</p>
                        <p class="text-sm text-[#6B7280] mt-2">Your searched topics will appear here</p>
                    </div>
                `}
            </div>
        </div>
    `;
}

export function setupHistoryEvents() {
    const historyItems = document.querySelectorAll('.history-item');
    historyItems.forEach(item => {
        item.addEventListener('click', () => {
            const topic = item.dataset.topic;
            if (!topic) return;
            
            const topicInput = document.getElementById('topicInput');
            if (topicInput) {
                topicInput.value = topic;
                const generateBtn = document.getElementById('generateBtn');
                if (generateBtn) {
                    generateBtn.click();
                }
            }
        });
    });
}