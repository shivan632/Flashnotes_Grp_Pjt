import { getDifficultyColor, getDifficultyIcon, getNotesSummary } from '../../utils/notesHelpers.js';

export function NotesCard({ note, onView, onDelete }) {
    // Parse content if it's a string
    let notesContent;
    try {
        notesContent = typeof note.content === 'string' ? JSON.parse(note.content) : note.content;
    } catch (e) {
        notesContent = { overview: '', key_concepts: [] };
    }
    
    const difficultyColor = getDifficultyColor(note.difficulty);
    const difficultyIcon = getDifficultyIcon(note.difficulty);
    const summary = getNotesSummary(notesContent);
    const date = new Date(note.generated_at).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
    });
    
    const noteId = note.id || '';
    
    return `
        <div class="group bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl overflow-hidden border border-[#374151] hover:border-[#3B82F6] transition-all duration-300 hover:-translate-y-1 shadow-lg" data-note-id="${noteId}">
            <div class="relative p-5">
                <div class="flex items-start justify-between mb-3">
                    <div class="flex items-center gap-2">
                        <div class="w-8 h-8 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-lg flex items-center justify-center">
                            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"></path>
                            </svg>
                        </div>
                        <div>
                            <h3 class="text-lg font-bold text-white group-hover:text-[#3B82F6] transition-colors line-clamp-1">${escapeHtml(note.title || note.topic)}</h3>
                            <p class="text-xs text-[#6B7280]">${date}</p>
                        </div>
                    </div>
                    <span class="px-2 py-0.5 text-xs rounded-full ${difficultyColor} flex items-center gap-1">
                        <span>${difficultyIcon}</span>
                        <span>${note.difficulty}</span>
                    </span>
                </div>
                
                <p class="text-sm text-[#9CA3AF] line-clamp-2 mb-3">${escapeHtml(summary)}</p>
                
                <div class="flex items-center justify-between pt-2 border-t border-[#374151]">
                    <span class="text-xs text-[#6B7280]">📚 ${notesContent.key_concepts?.length || 0} concepts</span>
                    <div class="flex gap-2">
                        <button class="view-note-btn px-3 py-1.5 bg-[#3B82F6]/20 text-[#3B82F6] rounded-lg text-xs font-medium hover:bg-[#3B82F6] hover:text-white transition-all" data-id="${noteId}">
                            View Notes
                        </button>
                        <button class="delete-note-btn p-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all" data-id="${noteId}">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}