// frontend/src/components/main/StorageArea.js - FIXED
import { getSavedNotes, deleteNote } from '../../services/storage.js';
import { showError } from '../common/ErrorMessage.js';
import { truncateText } from '../../utils/helpers.js';

export async function StorageArea() {
    let notes = [];
    try {
        notes = await getSavedNotes() || [];
    } catch (error) {
        console.error('Error loading notes:', error);
    }
    
    if (!Array.isArray(notes)) {
        notes = [];
    }
    
    return `
        <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-[#374151]">
            <div class="flex items-center justify-between mb-5">
                <h3 class="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent flex items-center gap-2">
                    <svg class="w-6 h-6 sm:w-7 sm:h-7 text-[#3B82F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                    </svg>
                    Saved Notes
                </h3>
                <div class="bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                    ${notes.length}
                </div>
            </div>
            
            <div id="storageContainer" class="space-y-3 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                ${notes.length > 0 ? notes.map((note, index) => {
                    const savedDate = note.savedAt ? new Date(note.savedAt) : null;
                    const formattedDate = savedDate ? savedDate.toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                    }) : 'Unknown';
                    const formattedTime = savedDate ? savedDate.toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit'
                    }) : '';
                    
                    return `
                        <div class="note-item group bg-gradient-to-r from-[#111827] to-[#1F2937] p-4 rounded-xl hover:bg-gradient-to-r hover:from-[#1F2937] hover:to-[#2D3748] transition-all duration-300 border border-[#374151] hover:border-[#3B82F6] hover:shadow-lg hover:shadow-[#3B82F6]/10 transform hover:-translate-y-0.5"
                             data-note-id="${note.id}"
                             style="animation: slideInLeft 0.3s ease-out ${index * 0.05}s forwards">
                            <div class="flex justify-between items-start mb-3">
                                <div class="flex items-center gap-2">
                                    <div class="w-6 h-6 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] rounded-lg flex items-center justify-center">
                                        <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l5 5a2 2 0 01.586 1.414V19a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z"></path>
                                        </svg>
                                    </div>
                                    <span class="bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] text-white text-xs px-2.5 py-1 rounded-full font-medium">${escapeHtml(note.topic || 'Untitled')}</span>
                                </div>
                                <div class="text-right">
                                    <span class="text-[#9CA3AF] text-xs font-medium">${formattedDate}</span>
                                    <p class="text-[#6B7280] text-xs mt-0.5">${formattedTime}</p>
                                </div>
                            </div>
                            <div class="mb-3">
                                <p class="text-[#3B82F6] font-semibold text-sm mb-2 flex items-start gap-2">
                                    <span class="text-[#60A5FA]">Q:</span>
                                    <span class="text-[#E5E7EB] font-normal">${truncateText(escapeHtml(note.question || 'No question'), 60)}</span>
                                </p>
                                <p class="text-[#9CA3AF] text-sm leading-relaxed pl-5 border-l-2 border-[#3B82F6]/30">
                                    ${truncateText(escapeHtml(note.answer || 'No answer'), 100)}
                                </p>
                            </div>
                            <div class="flex justify-end mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <button class="delete-note text-red-400 hover:text-red-500 text-sm flex items-center gap-1.5 transition-all duration-300 hover:scale-105 px-3 py-1.5 rounded-lg hover:bg-red-500/10"
                                        data-id="${note.id}">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                    </svg>
                                    Delete
                                </button>
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
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                            </svg>
                            <p class="text-[#9CA3AF] text-lg mb-2">No saved notes yet</p>
                            <p class="text-sm text-[#6B7280] max-w-xs mx-auto">Generate Q&A and click Save to see them here</p>
                            <div class="mt-4 flex justify-center gap-2">
                                <div class="w-1.5 h-1.5 bg-[#3B82F6] rounded-full animate-pulse"></div>
                                <div class="w-1.5 h-1.5 bg-[#60A5FA] rounded-full animate-pulse delay-100"></div>
                                <div class="w-1.5 h-1.5 bg-[#A78BFA] rounded-full animate-pulse delay-200"></div>
                            </div>
                        </div>
                    </div>
                `}
            </div>
            
            ${notes.length > 0 ? `
                <div class="mt-4 pt-3 border-t border-[#374151]">
                    <button id="clearAllNotesBtn" class="text-sm text-red-400 hover:text-red-500 transition-all duration-300 flex items-center gap-2 group w-full justify-center py-2 hover:bg-red-500/10 rounded-lg">
                        <svg class="w-4 h-4 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                        <span>Clear All Notes</span>
                    </button>
                </div>
            ` : ''}
        </div>
    `;
}

export function setupStorageEvents() {
    const deleteButtons = document.querySelectorAll('.delete-note');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const noteId = parseInt(btn.dataset.id);
            
            if (!confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
                return;
            }
            
            // Add loading state to button
            const originalText = btn.innerHTML;
            btn.innerHTML = '<div class="loading-spinner-small"></div>';
            btn.disabled = true;
            
            try {
                await deleteNote(noteId);
                showError('Note deleted successfully!', 'success');
                
                // Refresh the storage section without page reload
                const storageSection = document.querySelector('.storage-section');
                if (storageSection) {
                    const { StorageArea } = await import('./StorageArea.js');
                    storageSection.innerHTML = await StorageArea();
                    setupStorageEvents();
                }
                
            } catch (error) {
                console.error('Delete error:', error);
                showError('Failed to delete note', 'error');
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        });
    });
    
    // Clear all notes button
    const clearAllBtn = document.getElementById('clearAllNotesBtn');
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const notesCount = document.querySelectorAll('.note-item').length;
            
            if (confirm(`Are you sure you want to delete all ${notesCount} notes? This action cannot be undone.`)) {
                clearAllBtn.disabled = true;
                clearAllBtn.innerHTML = '<div class="loading-spinner-small"></div> Clearing...';
                
                try {
                    const deleteButtons = document.querySelectorAll('.delete-note');
                    for (const btn of deleteButtons) {
                        const noteId = parseInt(btn.dataset.id);
                        await deleteNote(noteId);
                    }
                    
                    showError('All notes cleared successfully!', 'success');
                    
                    // Refresh the storage section
                    const storageSection = document.querySelector('.storage-section');
                    if (storageSection) {
                        const { StorageArea } = await import('./StorageArea.js');
                        storageSection.innerHTML = await StorageArea();
                        setupStorageEvents();
                    }
                    
                } catch (error) {
                    console.error('Clear all error:', error);
                    showError('Failed to clear notes', 'error');
                } finally {
                    clearAllBtn.disabled = false;
                    clearAllBtn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg><span>Clear All Notes</span>';
                }
            }
        });
    }
}

// Helper function to escape HTML
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}