// frontend/src/components/main/HistoryItem.js

export function HistoryItem({ topic, searchedAt, onClick }) {
    const date = new Date(searchedAt).toLocaleDateString();
    
    return `
        <div class="bg-[#111827] p-3 rounded-lg flex justify-between items-center hover:bg-[#1F2937] transition-all cursor-pointer history-item" 
             data-topic="${topic}">
            <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-[#60A5FA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                <span class="text-[#E5E7EB]">${topic}</span>
            </div>
            <span class="text-[#9CA3AF] text-sm">${date}</span>
        </div>
    `;
}

// Create multiple history items from array
export function HistoryItemsList(history) {
    if (!history || history.length === 0) {
        return `
            <div class="text-center py-8 text-[#9CA3AF]">
                <svg class="w-16 h-16 mx-auto mb-3 text-[#4B5563]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p>No search history yet</p>
            </div>
        `;
    }
    
    return history.map(item => HistoryItem({
        topic: item.topic,
        searchedAt: item.searchedAt
    })).join('');
}