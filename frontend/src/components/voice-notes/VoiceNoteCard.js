// frontend/src/components/voice-notes/VoiceNoteCard.js

export function VoiceNoteCard({ note, onDelete, onEdit }) {
    const uniqueId = Date.now();
    const date = new Date(note.created_at);
    const formattedDate = date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Truncate text for preview
    const previewText = note.text.length > 150 
        ? note.text.substring(0, 150) + '...' 
        : note.text;
    
    return `
        <div id="voiceNoteCard-${uniqueId}" class="group relative bg-gradient-to-br from-[#1F2937] via-[#1A2436] to-[#111827] rounded-xl border border-[#374151] p-5 hover:border-pink-500/50 hover:shadow-lg hover:shadow-pink-500/10 transition-all duration-300 hover:-translate-y-0.5">
            
            <!-- Animated Gradient Border on Hover -->
            <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500/0 via-pink-500/0 to-pink-500/0 group-hover:from-pink-500/10 group-hover:via-pink-500/5 group-hover:to-pink-500/10 transition-all duration-500 pointer-events-none"></div>
            
            <div class="flex items-start justify-between relative z-10">
                <div class="flex items-center gap-3">
                    <!-- Enhanced Mic Icon with Gradient -->
                    <div class="w-11 h-11 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <svg class="w-5 h-5 text-pink-400 group-hover:text-pink-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                        </svg>
                    </div>
                    <div>
                        <div class="text-white text-sm font-semibold tracking-wide">Voice Note</div>
                        <div class="text-gray-500 text-xs flex items-center gap-1 mt-0.5">
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            ${formattedDate}
                        </div>
                    </div>
                </div>
                
                <!-- Action Buttons with Enhanced Hover Effects -->
                <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                    <button id="editNoteBtn-${uniqueId}" class="p-2.5 rounded-lg text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-200 hover:scale-110" title="Edit">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                    </button>
                    <button id="copyNoteBtn-${uniqueId}" class="p-2.5 rounded-lg text-gray-400 hover:text-green-400 hover:bg-green-500/10 transition-all duration-200 hover:scale-110" title="Copy">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
                        </svg>
                    </button>
                    <button id="deleteNoteBtn-${uniqueId}" class="p-2.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 hover:scale-110" title="Delete">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                    </button>
                </div>
            </div>
            
            <!-- Note Text with Improved Typography -->
            <div class="mt-4 pl-14">
                <p class="text-gray-300 text-sm leading-relaxed line-clamp-3">${previewText}</p>
            </div>
            
            <!-- Stats Bar with Gradient -->
            <div class="mt-4 pt-3 border-t border-[#374151]/50 flex items-center justify-between text-gray-500 text-xs">
                <div class="flex items-center gap-3">
                    <div class="flex items-center gap-1.5">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path>
                        </svg>
                        <span>${note.text.split(/\s+/).length} words</span>
                    </div>
                    <div class="w-1 h-1 bg-gray-600 rounded-full"></div>
                    <div class="flex items-center gap-1.5">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <span>${note.text.length} chars</span>
                    </div>
                </div>
                
                <!-- Decorative Gradient Line -->
                <div class="h-1 w-12 bg-gradient-to-r from-pink-500/0 via-pink-500/30 to-pink-500/0 rounded-full"></div>
            </div>
        </div>
        
        <style>
            .line-clamp-3 {
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }
        </style>
        
        <script>
            (function() {
                const id = '${uniqueId}';
                const card = document.getElementById('voiceNoteCard-' + id);
                
                // Add ripple effect on delete
                const deleteBtn = document.getElementById('deleteNoteBtn-' + id);
                if (deleteBtn) {
                    deleteBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        if (confirm('🗑️ Delete this voice note? This action cannot be undone.')) {
                            // Add ripple effect
                            deleteBtn.style.transform = 'scale(0.9)';
                            setTimeout(() => {
                                deleteBtn.style.transform = '';
                            }, 150);
                            if (window.onDeleteNote) window.onDeleteNote('${note.id}');
                        }
                    });
                }
                
                // Edit button handler
                const editBtn = document.getElementById('editNoteBtn-' + id);
                if (editBtn) {
                    editBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        editBtn.style.transform = 'scale(0.9)';
                        setTimeout(() => {
                            editBtn.style.transform = '';
                        }, 150);
                        if (window.onEditNote) window.onEditNote('${note.id}', \`${note.text.replace(/`/g, '\\`')}\`);
                    });
                }
                
                // Copy button handler with enhanced feedback
                const copyBtn = document.getElementById('copyNoteBtn-' + id);
                if (copyBtn) {
                    copyBtn.addEventListener('click', async (e) => {
                        e.stopPropagation();
                        try {
                            await navigator.clipboard.writeText(\`${note.text.replace(/`/g, '\\`')}\`);
                            const originalHtml = copyBtn.innerHTML;
                            copyBtn.innerHTML = '<svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';
                            copyBtn.style.transform = 'scale(1.1)';
                            setTimeout(() => {
                                copyBtn.innerHTML = originalHtml;
                                copyBtn.style.transform = '';
                            }, 1500);
                        } catch (err) {
                            console.error('Copy failed:', err);
                        }
                    });
                }
                
                // Card hover effect enhancement
                if (card) {
                    card.addEventListener('mouseenter', () => {
                        card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                    });
                }
            })();
        </script>
    `;
}