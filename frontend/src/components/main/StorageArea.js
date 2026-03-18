// frontend/src/components/main/StorageArea.js
import { getSavedNotes, deleteNote } from '../../services/storage.js';
import { showError } from '../common/ErrorMessage.js';

export async function StorageArea() {
    const notes = await getSavedNotes();
    
    return `
        <div class="bg-[#1F2937] p-6 rounded-xl shadow-lg">
            <h3 class="text-2xl font-bold mb-4 text-[#3B82F6] flex items-center gap-2">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                </svg>
                Saved Notes (${notes.length})
            </h3>
            <div id="storageContainer" class="space-y-3 max-h-96 overflow-y-auto">
                ${notes.length > 0 ? notes.map(note => `
                    <div class="bg-[#111827] p-4 rounded-lg hover:shadow-lg transition-all" data-note-id="${note.id}">
                        <div class="flex justify-between items-start">
                            <div class="flex-1">
                                <span class="bg-[#3B82F6] text-white text-xs px-2 py-1 rounded">${note.topic}</span>
                                <p class="text-[#E5E7EB] font-medium mt-2">Q: ${note.question.substring(0, 50)}${note.question.length > 50 ? '...' : ''}</p>
                                <p class="text-[#9CA3AF] text-sm mt-1">${note.answer.substring(0, 80)}${note.answer.length > 80 ? '...' : ''}</p>
                                <p class="text-[#A78BFA] text-xs mt-2">Saved: ${new Date(note.savedAt).toLocaleDateString()}</p>
                            </div>
                            <button class="delete-note text-red-400 hover:text-red-500 p-2 transition-colors" data-id="${note.id}">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                `).join('') : `
                    <div class="text-center py-8 text-[#9CA3AF]">
                        <svg class="w-16 h-16 mx-auto mb-3 text-[#4B5563]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                        </svg>
                        <p>No saved notes yet</p>
                        <p class="text-sm mt-2">Generate Q&A and save them here</p>
                    </div>
                `}
            </div>
        </div>
    `;
}

// Setup storage area event listeners
export function setupStorageEvents() {
    const deleteButtons = document.querySelectorAll('.delete-note');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const noteId = parseInt(btn.dataset.id);
            
            // Show confirmation
            if (!confirm('Are you sure you want to delete this note?')) {
                return;
            }
            
            try {
                await deleteNote(noteId);
                
                // Refresh the storage area
                const storageSection = document.querySelector('.storage-section');
                if (storageSection) {
                    storageSection.innerHTML = await StorageArea();
                    setupStorageEvents(); // Re-attach events
                }
                
                showError('Note deleted successfully!', 'success');
                
            } catch (error) {
                showError('Failed to delete note', 'error');
            }
        });
    });
}