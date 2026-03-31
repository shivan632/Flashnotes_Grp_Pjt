// frontend/src/components/main/HistoryList.js - Enhanced UI
import { getSearchHistory, clearHistory } from '../../services/storage.js';
import { showError, showSuccess } from '../common/ErrorMessage.js';

export async function HistoryList() {
    let history = [];
    try {
        history = await getSearchHistory() || [];
    } catch (error) {
        console.error('Error loading history:', error);
    }
    
    if (!Array.isArray(history)) {
        history = [];
    }
    
    return `
        <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-[#374151]">
            <div class="flex items-center justify-between mb-5">
                <h3 class="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent flex items-center gap-2">
                    <svg class="w-6 h-6 sm:w-7 sm:h-7 text-[#3B82F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Search History
                </h3>
                <div class="bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                    ${history.length}
                </div>
            </div>
            
            <div id="historyContainer" class="space-y-3 max-h-[450px] overflow-y-auto custom-scrollbar pr-1">
                ${history.length > 0 ? history.map((entry, index) => {
                    const date = entry.searchedAt ? new Date(entry.searchedAt) : null;
                    const formattedDate = date ? date.toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                    }) : 'Unknown';
                    const formattedTime = date ? date.toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit'
                    }) : '';
                    
                    return `
                        <div class="history-item group bg-gradient-to-r from-[#111827] to-[#1F2937] p-3.5 rounded-xl flex justify-between items-center hover:bg-gradient-to-r hover:from-[#1F2937] hover:to-[#2D3748] transition-all duration-300 cursor-pointer border border-[#374151] hover:border-[#3B82F6] hover:shadow-lg hover:shadow-[#3B82F6]/10 transform hover:-translate-y-0.5"
                             data-topic="${escapeHtml(entry.topic || '')}"
                             style="animation: slideInRight 0.3s ease-out ${index * 0.05}s forwards">
                            <div class="flex items-center gap-3 flex-1 min-w-0">
                                <div class="w-8 h-8 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                    </svg>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <span class="text-[#E5E7EB] font-medium truncate block group-hover:text-[#3B82F6] transition-colors">${escapeHtml(entry.topic || 'Unknown topic')}</span>
                                    <p class="text-xs text-[#6B7280] mt-0.5 flex items-center gap-1">
                                        <span class="w-1 h-1 bg-[#3B82F6] rounded-full"></span>
                                        Click to search again
                                    </p>
                                </div>
                            </div>
                            <div class="text-right flex-shrink-0 ml-3">
                                <span class="text-[#9CA3AF] text-sm font-medium">${formattedDate}</span>
                                <p class="text-xs text-[#6B7280] mt-0.5">${formattedTime}</p>
                            </div>
                            <div class="opacity-0 group-hover:opacity-100 transition-all duration-300 ml-2">
                                <svg class="w-4 h-4 text-[#60A5FA] group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                                </svg>
                            </div>
                        </div>
                    `;
                }).join('') : `
                    <div class="text-center py-12 bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl border border-[#374151]">
                        <div class="relative">
                            <div class="absolute inset-0 flex items-center justify-center">
                                <div class="w-24 h-24 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full opacity-10 blur-xl"></div>
                            </div>
                            <svg class="w-20 h-20 mx-auto mb-4 text-[#4B5563] relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <p class="text-[#9CA3AF] text-lg mb-2">No search history yet</p>
                            <p class="text-sm text-[#6B7280] max-w-xs mx-auto">Your searched topics will appear here. Start exploring new topics!</p>
                            <div class="mt-4 flex justify-center gap-2">
                                <div class="w-1.5 h-1.5 bg-[#3B82F6] rounded-full animate-pulse"></div>
                                <div class="w-1.5 h-1.5 bg-[#60A5FA] rounded-full animate-pulse delay-100"></div>
                                <div class="w-1.5 h-1.5 bg-[#A78BFA] rounded-full animate-pulse delay-200"></div>
                            </div>
                        </div>
                    </div>
                `}
            </div>
            
            ${history.length > 0 ? `
                <div class="mt-4 pt-3 border-t border-[#374151]">
                    <button id="clearHistoryBtn" class="text-sm text-red-400 hover:text-red-500 transition-all duration-300 flex items-center gap-2 group w-full justify-center py-2 hover:bg-red-500/10 rounded-lg">
                        <svg class="w-4 h-4 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                        <span>Clear All History</span>
                    </button>
                </div>
            ` : ''}
        </div>
    `;
}

export function setupHistoryEvents() {
    const historyItems = document.querySelectorAll('.history-item');
    historyItems.forEach(item => {
        const newItem = item.cloneNode(true);
        item.parentNode.replaceChild(newItem, item);
        
        newItem.addEventListener('click', () => {
            const topic = newItem.dataset.topic;
            if (!topic) return;
            
            const topicInput = document.getElementById('topicInput');
            if (topicInput) {
                topicInput.value = topic;
                topicInput.classList.add('border-[#A78BFA]', 'scale-[1.02]');
                setTimeout(() => {
                    topicInput.classList.remove('border-[#A78BFA]', 'scale-[1.02]');
                }, 300);
                
                const generateBtn = document.getElementById('generateBtn');
                if (generateBtn) {
                    generateBtn.classList.add('scale-105');
                    setTimeout(() => {
                        generateBtn.classList.remove('scale-105');
                    }, 200);
                    generateBtn.click();
                }
            }
        });
    });
    
    // Clear history button
    const clearBtn = document.getElementById('clearHistoryBtn');
    if (clearBtn) {
        const newClearBtn = clearBtn.cloneNode(true);
        clearBtn.parentNode.replaceChild(newClearBtn, clearBtn);
        
        newClearBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            if (confirm('⚠️ Are you sure you want to clear all search history? This action cannot be undone.')) {
                newClearBtn.disabled = true;
                newClearBtn.innerHTML = '<div class="loading-spinner-small"></div> Clearing...';
                
                try {
                    await clearHistory();
                    
                    const historySection = document.querySelector('.history-section');
                    if (historySection) {
                        const { HistoryList } = await import('./HistoryList.js');
                        historySection.innerHTML = await HistoryList();
                        setupHistoryEvents();
                    }
                    
                    showSuccess('History cleared successfully!', 'success');
                } catch (error) {
                    console.error('Error clearing history:', error);
                    showError('Failed to clear history', 'error');
                } finally {
                    newClearBtn.disabled = false;
                    newClearBtn.innerHTML = '<svg class="w-4 h-4 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg><span>Clear All History</span>';
                }
            }
        });
    }
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add CSS animations
const historyListStyles = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(-10px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .history-item {
        opacity: 0;
    }
    
    .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-track {
        background: #1F2937;
        border-radius: 10px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #3B82F6;
        border-radius: 10px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #60A5FA;
    }
    
    .loading-spinner-small {
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255,255,255,0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
        display: inline-block;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;

if (!document.querySelector('#history-list-styles')) {
    const style = document.createElement('style');
    style.id = 'history-list-styles';
    style.textContent = historyListStyles;
    document.head.appendChild(style);
}