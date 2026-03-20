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
    
    // Ensure notes is an array
    if (!Array.isArray(notes)) {
        notes = [];
    }
    
    return `
        <div class="bg-[#1F2937] p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl sm:text-2xl font-bold text-[#3B82F6] flex items-center gap-2">
                    <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                    </svg>
                    Saved Notes
                </h3>
                <span class="bg-[#3B82F6] text-white px-3 py-1 rounded-full text-sm">${notes.length}</span>
            </div>
            
            <div id="storageContainer" class="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                ${notes.length > 0 ? notes.map(note => `
                    <div class="bg-[#111827] p-4 rounded-lg hover:shadow-lg transition-all group" data-note-id="${note.id}">
                        <div class="flex justify-between items-start mb-2">
                            <span class="bg-[#3B82F6] text-white text-xs px-2 py-1 rounded">${note.topic || 'Untitled'}</span>
                            <span class="text-[#9CA3AF] text-xs">${note.savedAt ? new Date(note.savedAt).toLocaleDateString() : 'Unknown'}</span>
                        </div>
                        <p class="text-[#3B82F6] font-semibold mb-2">Q: ${truncateText(note.question || 'No question', 50)}</p>
                        <p class="text-[#E5E7EB] text-sm">${truncateText(note.answer || 'No answer', 80)}</p>
                        <div class="flex justify-end mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button class="delete-note text-red-400 hover:text-red-500 text-sm flex items-center gap-1 transition-colors" data-id="${note.id}">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                                Delete
                            </button>
                        </div>
                    </div>
                `).join('') : `
                    <div class="text-center py-8">
                        <svg class="w-16 h-16 mx-auto text-[#4B5563] mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                        </svg>
                        <p class="text-[#9CA3AF]">No saved notes yet</p>
                        <p class="text-sm text-[#6B7280] mt-2">Generate Q&A and click Save to see them here</p>
                    </div>
                `}
            </div>
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
            
            if (!confirm('Are you sure you want to delete this note?')) {
                return;
            }
            
            try {
                await deleteNote(noteId);
                window.location.reload(); // Simple refresh to update UI
            } catch (error) {
                console.error('Delete error:', error);
                showError('Failed to delete note', 'error');
            }
        });
    });
}