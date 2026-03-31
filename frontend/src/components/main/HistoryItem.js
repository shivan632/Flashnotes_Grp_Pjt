// frontend/src/components/main/HistoryItem.js
// History Item Component - Enhanced UI with modern design

export function HistoryItem({ topic, searchedAt, onClick }) {
    const date = new Date(searchedAt);
    const formattedDate = date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
    });
    const formattedTime = date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit'
    });
    
    return `
        <div class="group bg-gradient-to-br from-[#1F2937] to-[#111827] p-4 rounded-xl flex justify-between items-center hover:bg-gradient-to-br hover:from-[#1F2937] hover:to-[#1A2436] transition-all duration-300 cursor-pointer history-item border border-[#374151] hover:border-[#3B82F6] hover:shadow-xl hover:shadow-blue-500/10 transform hover:-translate-y-1" 
             data-topic="${topic}">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-gradient-to-br from-[#3B82F6] to-[#A78BFA] rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                </div>
                <div>
                    <span class="text-[#E5E7EB] font-medium group-hover:text-[#3B82F6] transition-colors duration-300">${escapeHtml(topic)}</span>
                    <p class="text-xs text-[#6B7280] mt-0.5 group-hover:text-[#9CA3AF] transition-colors">Click to search again</p>
                </div>
            </div>
            <div class="text-right">
                <span class="text-[#9CA3AF] text-sm group-hover:text-[#60A5FA] transition-colors">${formattedDate}</span>
                <p class="text-xs text-[#6B7280] mt-0.5">${formattedTime}</p>
            </div>
            <div class="opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
                <svg class="w-5 h-5 text-[#3B82F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
            </div>
        </div>
    `;
}

// Create multiple history items from array with animation delay
export function HistoryItemsList(history) {
    if (!history || history.length === 0) {
        return `
            <div class="text-center py-12 bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl border border-[#374151]">
                <div class="relative">
                    <div class="absolute inset-0 flex items-center justify-center">
                        <div class="w-24 h-24 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full opacity-10 blur-xl"></div>
                    </div>
                    <svg class="w-20 h-20 mx-auto mb-4 text-[#4B5563] relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p class="text-[#9CA3AF] text-lg mb-2">No search history yet</p>
                    <p class="text-sm text-[#6B7280]">Your searched topics will appear here</p>
                    <div class="mt-4 flex justify-center gap-2">
                        <div class="w-1.5 h-1.5 bg-[#3B82F6] rounded-full animate-pulse"></div>
                        <div class="w-1.5 h-1.5 bg-[#60A5FA] rounded-full animate-pulse delay-100"></div>
                        <div class="w-1.5 h-1.5 bg-[#A78BFA] rounded-full animate-pulse delay-200"></div>
                    </div>
                </div>
            </div>
        `;
    }
    
    return history.map((item, index) => {
        const itemHtml = HistoryItem({
            topic: item.topic,
            searchedAt: item.searchedAt
        });
        return `<div class="history-item-container animate-slideInUp" style="animation-delay: ${index * 0.05}s">${itemHtml}</div>`;
    }).join('');
}

// Helper function to escape HTML
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add CSS animations
const historyItemStyles = `
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(15px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes glowPulse {
        0%, 100% {
            box-shadow: 0 0 5px rgba(59, 130, 246, 0.2);
        }
        50% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
        }
    }
    
    .animate-slideInUp {
        animation: slideInUp 0.4s ease-out forwards;
    }
    
    .history-item-container {
        opacity: 0;
    }
    
    .history-item {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
`;

if (!document.querySelector('#history-item-styles')) {
    const style = document.createElement('style');
    style.id = 'history-item-styles';
    style.textContent = historyItemStyles;
    document.head.appendChild(style);
}