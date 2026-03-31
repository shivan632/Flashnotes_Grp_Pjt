// frontend/src/components/saved/SavedNoteCard.js
// Saved Note Card Component - Enhanced UI with Modal View

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
    
    const isLongAnswer = answer.length > 120;
    const previewAnswer = isLongAnswer ? answer.substring(0, 120) + '...' : answer;
    
    return `
        <div class="saved-note-card group bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl overflow-hidden border border-[#374151] hover:border-[#3B82F6] transition-all duration-300 hover:shadow-xl hover:-translate-y-1" data-note-id="${id}" data-note-topic="${escapeHtml(topic)}" data-note-question="${escapeHtml(question)}" data-note-answer="${escapeHtml(answer)}" data-note-date="${formattedDate} ${formattedTime}">
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
                        <p class="text-[#E5E7EB] text-sm font-medium leading-relaxed group-hover/question:text-[#3B82F6] transition-colors line-clamp-2">
                            ${escapeHtml(question)}
                        </p>
                    </div>
                </div>
                
                <div class="group/answer">
                    <div class="flex items-start gap-2">
                        <span class="text-[#60A5FA] font-semibold text-sm mt-0.5">A:</span>
                        <div class="flex-1">
                            <p class="text-[#9CA3AF] text-sm leading-relaxed group-hover/answer:text-[#E5E7EB] transition-colors line-clamp-3">
                                ${escapeHtml(previewAnswer)}
                            </p>
                        </div>
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
                    View Details
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
        
        <!-- Note Detail Modal -->
        <div id="noteModal-${id}" class="note-modal fixed inset-0 bg-black/80 backdrop-blur-md z-50 hidden items-center justify-center p-4" style="display: none;">
            <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden border border-[#374151] shadow-2xl animate-modalPop">
                <div class="flex items-center justify-between p-5 border-b border-[#374151] bg-gradient-to-r from-[#1F2937] to-[#111827]">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-xl flex items-center justify-center">
                            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                            </svg>
                        </div>
                        <div>
                            <h3 class="text-lg font-bold text-white">Note Details</h3>
                            <p class="text-xs text-[#9CA3AF]">Topic: <span class="text-[#3B82F6]">${escapeHtml(topic)}</span></p>
                        </div>
                    </div>
                    <button class="close-modal text-[#9CA3AF] hover:text-white transition-colors p-2 hover:bg-[#374151] rounded-lg">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                
                <div class="p-6 overflow-y-auto max-h-[calc(80vh-120px)] space-y-5">
                    <div>
                        <div class="flex items-center gap-2 mb-3">
                            <span class="text-[#3B82F6] font-bold text-lg">Q.</span>
                            <span class="text-xs text-[#6B7280]">Question</span>
                        </div>
                        <p class="text-[#E5E7EB] leading-relaxed pl-2 border-l-4 border-[#3B82F6]">${escapeHtml(question)}</p>
                    </div>
                    
                    <div>
                        <div class="flex items-center gap-2 mb-3">
                            <span class="text-[#60A5FA] font-bold text-lg">A.</span>
                            <span class="text-xs text-[#6B7280]">Answer</span>
                        </div>
                        <div class="p-4 bg-[#111827] rounded-xl border border-[#374151]">
                            <p class="text-[#E5E7EB] leading-relaxed whitespace-pre-wrap">${escapeHtml(answer)}</p>
                        </div>
                    </div>
                    
                    <div class="pt-3 border-t border-[#374151]">
                        <div class="flex items-center justify-between text-xs text-[#6B7280]">
                            <span>📅 Saved on ${formattedDate} at ${formattedTime}</span>
                            <span>🆔 Note ID: #${id}</span>
                        </div>
                    </div>
                </div>
                
                <div class="p-5 border-t border-[#374151] flex justify-end gap-3">
                    <button class="close-modal-btn px-4 py-2 bg-[#374151] hover:bg-[#4B5563] text-white rounded-lg transition-all">Close</button>
                    <button class="delete-from-modal bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white px-4 py-2 rounded-lg transition-all flex items-center gap-2" data-id="${id}">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                        Delete Note
                    </button>
                </div>
            </div>
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

// Setup saved note card events
export function setupSavedNoteCardEvents(onView, onDelete) {
    // View note button - opens modal with full answer
    document.querySelectorAll('.view-note').forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        newBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = newBtn.closest('.saved-note-card');
            const modalId = card?.id ? `noteModal-${card.dataset.noteId}` : null;
            const modal = modalId ? document.getElementById(modalId) : null;
            
            if (modal) {
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    // Close modal buttons
    document.querySelectorAll('.close-modal, .close-modal-btn').forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        newBtn.addEventListener('click', () => {
            const modal = newBtn.closest('.note-modal');
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    });
    
    // Delete from modal
    document.querySelectorAll('.delete-from-modal').forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        newBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const modal = newBtn.closest('.note-modal');
            const id = newBtn.dataset.id;
            
            if (id && confirm('Are you sure you want to delete this note?')) {
                if (onDelete) await onDelete(parseInt(id));
                if (modal) {
                    modal.style.display = 'none';
                    document.body.style.overflow = '';
                }
            }
        });
    });
    
    // Delete note button on card
    document.querySelectorAll('.delete-note').forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        newBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            const card = newBtn.closest('.saved-note-card');
            const id = card?.dataset.noteId;
            if (id && onDelete && confirm('Are you sure you want to delete this note?')) {
                await onDelete(parseInt(id));
            }
        });
    });
    
    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.note-modal').forEach(modal => {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            });
        }
    });
    
    // Close modal on background click
    document.querySelectorAll('.note-modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    });
    
    // Card click for view (optional)
    document.querySelectorAll('.saved-note-card').forEach(card => {
        const newCard = card.cloneNode(true);
        card.parentNode.replaceChild(newCard, card);
        
        newCard.addEventListener('click', (e) => {
            if (e.target.closest('.view-note') || e.target.closest('.delete-note')) {
                return;
            }
            const id = newCard.dataset.noteId;
            const modalId = `noteModal-${id}`;
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        });
    });
}

// Add modal animation styles
const modalStyles = `
    @keyframes modalPop {
        from {
            opacity: 0;
            transform: scale(0.95) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: scale(1) translateY(0);
        }
    }
    
    .animate-modalPop {
        animation: modalPop 0.2s ease-out forwards;
    }
    
    .note-modal {
        animation: fadeIn 0.2s ease-out;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;

if (!document.querySelector('#modal-styles')) {
    const style = document.createElement('style');
    style.id = 'modal-styles';
    style.textContent = modalStyles;
    document.head.appendChild(style);
}