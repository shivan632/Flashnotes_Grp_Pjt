// frontend/src/components/saved/SavedNoteCard.js
// Saved Note Card Component - Enhanced UI

export function SavedNoteCard({ note, onDelete, onView }) {
    const { id, topic, question, answer, savedAt } = note;
    const date = new Date(savedAt);
    const formattedDate = date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
    });
    const formattedTime = date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit'
    });
    
    const previewAnswer = answer.length > 120 ? answer.substring(0, 120) + '...' : answer;
    
    return `
        <div class="saved-note-card group bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl overflow-hidden border border-[#374151] hover:border-[#3B82F6] transition-all duration-300 hover:shadow-2xl hover:shadow-[#3B82F6]/10 hover:-translate-y-1" data-note-id="${id}">
            <!-- Header with Topic Badge -->
            <div class="relative p-5 pb-3 border-b border-[#374151] bg-gradient-to-r from-[#111827] to-transparent">
                <div class="flex items-start justify-between">
                    <div class="flex items-center gap-2">
                        <div class="w-8 h-8 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                            </svg>
                        </div>
                        <div>
                            <span class="bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] text-white text-xs px-2.5 py-1 rounded-full font-medium">${escapeHtml(topic)}</span>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="text-xs text-[#9CA3AF]">${formattedDate}</div>
                        <div class="text-xs text-[#6B7280]">${formattedTime}</div>
                    </div>
                </div>
            </div>
            
            <!-- Content -->
            <div class="p-5 space-y-3">
                <div class="group/question">
                    <div class="flex items-start gap-2">
                        <span class="text-[#3B82F6] font-semibold text-sm mt-0.5">Q:</span>
                        <p class="text-[#E5E7EB] text-sm font-medium leading-relaxed group-hover/question:text-[#3B82F6] transition-colors">
                            ${escapeHtml(question)}
                        </p>
                    </div>
                </div>
                
                <div class="group/answer">
                    <div class="flex items-start gap-2">
                        <span class="text-[#60A5FA] font-semibold text-sm mt-0.5">A:</span>
                        <p class="text-[#9CA3AF] text-sm leading-relaxed group-hover/answer:text-[#E5E7EB] transition-colors">
                            ${escapeHtml(previewAnswer)}
                        </p>
                    </div>
                </div>
                
                <!-- Tags (Keywords) -->
                <div class="flex flex-wrap gap-1.5 pt-2">
                    ${extractKeywords(topic, question).slice(0, 3).map(keyword => `
                        <span class="text-xs px-2 py-0.5 bg-[#374151]/50 rounded-full text-[#9CA3AF]">#${keyword}</span>
                    `).join('')}
                </div>
            </div>
            
            <!-- Footer Actions -->
            <div class="p-4 pt-3 border-t border-[#374151] bg-[#111827]/50 flex justify-between items-center">
                <button class="view-note group/btn text-[#60A5FA] hover:text-[#3B82F6] text-sm flex items-center gap-1.5 transition-all duration-300" data-id="${id}">
                    <svg class="w-4 h-4 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                    View
                </button>
                <button class="delete-note group/btn text-red-400 hover:text-red-500 text-sm flex items-center gap-1.5 transition-all duration-300" data-id="${id}">
                    <svg class="w-4 h-4 group-hover/btn:scale-110 group-hover/btn:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    Delete
                </button>
            </div>
            
            <!-- Hover Glow Effect -->
            <div class="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" style="box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.3) inset;"></div>
        </div>
    `;
}

function extractKeywords(topic, question) {
    const words = `${topic} ${question}`.toLowerCase().split(/\s+/);
    const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    const keywords = words.filter(w => w.length > 3 && !commonWords.includes(w));
    return [...new Set(keywords)].slice(0, 5);
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}