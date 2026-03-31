// frontend/src/pages/SavedPage.js
import { Sidebar } from '../components/layout/Sidebar.js';
import { AIChatSidebar } from '../components/layout/AIChatSidebar.js';
import { Header } from '../components/common/Header.js';
import { SavedNoteCard, setupSavedNoteCardEvents } from '../components/saved/SavedNoteCard.js';
import { SavedNoteFilter, setupSavedNoteFilter } from '../components/saved/SavedNoteFilter.js';
import { SavedNoteGrid, SavedNoteGridHeader } from '../components/saved/SavedNoteGrid.js';
import { getSavedNotes, deleteNote } from '../services/storage.js';
import { showError, showSuccess } from '../components/common/ErrorMessage.js';
import { LoadingSpinner } from '../components/common/LoadingSpinner.js';

let currentViewMode = 'grid';

export async function SavedPage() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    if (!isAuthenticated) {
        window.location.hash = '#/login';
        return '';
    }
    
    let notes = [];
    let isLoading = true;
    
    try {
        notes = await getSavedNotes() || [];
        isLoading = false;
    } catch (error) {
        console.error('Error loading saved notes:', error);
        showError('Failed to load saved notes', 'error');
        isLoading = false;
    }
    
    const topics = [...new Set(notes.map(note => note.topic).filter(Boolean))];
    
    return `
        <div class="min-h-screen bg-gradient-to-b from-[#0F172A] via-[#111827] to-[#0F172A] relative">
            ${Sidebar()}
            ${AIChatSidebar()}
            <div id="mainContent" class="min-h-screen transition-all duration-300" 
                 style="margin-left: 256px; margin-right: 384px; width: calc(100% - 640px);">
                ${Header({ title: 'Saved List' })}
                <main class="container mx-auto px-4 py-8">
                    <!-- Header with Stats -->
                    <div class="mb-8">
                        <div class="relative">
                            <div class="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <div class="flex items-center gap-3 mb-2">
                                        <div class="relative">
                                            <div class="absolute inset-0 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-xl blur-md opacity-0 group-hover:opacity-50 transition-opacity"></div>
                                            <div class="relative w-12 h-12 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-300">
                                                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                                                </svg>
                                            </div>
                                        </div>
                                        <div>
                                            <h1 class="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">
                                                Your Saved Notes
                                            </h1>
                                            <p class="text-[#9CA3AF] mt-1">All your saved questions and answers in one place</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Stats Card -->
                                <div class="group bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl px-6 py-3 border border-[#374151] hover:border-[#3B82F6] transition-all duration-300 hover:scale-105">
                                    <div class="text-center">
                                        <div class="text-3xl font-bold text-[#3B82F6] group-hover:scale-110 transition-transform">${notes.length}</div>
                                        <div class="text-xs text-[#9CA3AF] flex items-center gap-1 justify-center">
                                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                                            </svg>
                                            Saved Notes
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="w-24 h-1 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full mt-4"></div>
                    </div>
                    
                    ${isLoading ? `
                        <div class="flex justify-center items-center py-20">
                            ${LoadingSpinner({ size: 'lg', text: 'Loading your notes...' })}
                        </div>
                    ` : notes.length > 0 ? `
                        <!-- Filter Section -->
                        <div>
                            ${SavedNoteFilter({ topics })}
                        </div>
                        
                        <!-- Grid Header with View Toggle -->
                        <div>
                            ${SavedNoteGridHeader({ 
                                total: notes.length, 
                                visible: notes.length,
                                viewMode: currentViewMode,
                                onViewToggle: (mode) => {
                                    currentViewMode = mode;
                                    const gridContainer = document.querySelector('.saved-notes-grid');
                                    if (gridContainer) {
                                        const gridClasses = mode === 'grid' 
                                            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                                            : 'space-y-4';
                                        gridContainer.className = `${gridClasses} saved-notes-grid`;
                                    }
                                }
                            })}
                        </div>
                        
                        <!-- Notes Grid -->
                        <div>
                            ${SavedNoteGrid({ 
                                notes, 
                                viewMode: currentViewMode,
                                onDelete: async (id) => {
                                    try {
                                        await deleteNote(id);
                                        showSuccess('Note deleted successfully!', 'success');
                                        setTimeout(() => window.location.reload(), 500);
                                    } catch (error) {
                                        showError('Failed to delete note', 'error');
                                    }
                                },
                                onView: (note) => {
                                    openNoteModal(note);
                                }
                            })}
                        </div>
                    ` : `
                        <div class="text-center py-20 bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl border border-[#374151]">
                            <div class="relative">
                                <div class="absolute inset-0 flex items-center justify-center">
                                    <div class="w-28 h-28 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full opacity-10 blur-2xl"></div>
                                </div>
                                <svg class="w-24 h-24 mx-auto mb-5 text-[#4B5563] relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                                </svg>
                                <p class="text-[#9CA3AF] text-xl mb-2">✨ No saved notes yet</p>
                                <p class="text-sm text-[#6B7280] max-w-sm mx-auto">Generate Q&A from the dashboard and click "Save Note" to build your collection</p>
                                <div class="mt-6 flex justify-center gap-2">
                                    <div class="w-1.5 h-1.5 bg-[#3B82F6] rounded-full animate-pulse"></div>
                                    <div class="w-1.5 h-1.5 bg-[#60A5FA] rounded-full animate-pulse delay-100"></div>
                                    <div class="w-1.5 h-1.5 bg-[#A78BFA] rounded-full animate-pulse delay-200"></div>
                                </div>
                                <a href="#/dashboard" class="inline-block mt-6 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] text-white px-6 py-2.5 rounded-xl hover:from-[#60A5FA] hover:to-[#8B5CF6] transition-all duration-300 transform hover:scale-105 shadow-lg">
                                    📝 Go to Dashboard
                                </a>
                            </div>
                        </div>
                    `}
                </main>
            </div>
        </div>
    `;
}

// Open note modal with full answer (NO ANIMATIONS)
function openNoteModal(note) {
    const modalId = `note-view-modal-${Date.now()}`;
    const modalHtml = `
        <div id="${modalId}" class="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden border border-[#374151] shadow-2xl">
                <div class="flex items-center justify-between p-5 border-b border-[#374151] bg-gradient-to-r from-[#1F2937] to-[#111827]">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-xl flex items-center justify-center shadow-lg">
                            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                            </svg>
                        </div>
                        <div>
                            <h3 class="text-lg font-bold text-white">Note Details</h3>
                            <p class="text-xs text-[#9CA3AF]">Topic: <span class="text-[#3B82F6]">${escapeHtml(note.topic)}</span></p>
                        </div>
                    </div>
                    <button class="close-modal text-[#9CA3AF] hover:text-white transition-all duration-300 p-2 hover:bg-[#374151] rounded-lg hover:scale-110">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                
                <div class="p-6 overflow-y-auto max-h-[calc(85vh-120px)] space-y-5 custom-scrollbar">
                    <div>
                        <div class="flex items-center gap-2 mb-3">
                            <span class="text-[#3B82F6] font-bold text-xl">Q.</span>
                            <span class="text-xs text-[#6B7280]">Question</span>
                        </div>
                        <p class="text-[#E5E7EB] leading-relaxed pl-3 border-l-4 border-[#3B82F6]">${escapeHtml(note.question)}</p>
                    </div>
                    
                    <div>
                        <div class="flex items-center gap-2 mb-3">
                            <span class="text-[#60A5FA] font-bold text-xl">A.</span>
                            <span class="text-xs text-[#6B7280]">Answer</span>
                        </div>
                        <div class="p-4 bg-gradient-to-br from-[#111827] to-[#0F172A] rounded-xl border border-[#374151]">
                            <p class="text-[#E5E7EB] leading-relaxed whitespace-pre-wrap">${escapeHtml(note.answer)}</p>
                        </div>
                    </div>
                    
                    <div class="pt-3 border-t border-[#374151]">
                        <div class="flex items-center justify-between text-xs text-[#6B7280]">
                            <span class="flex items-center gap-1">
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                Saved on ${new Date(note.savedAt).toLocaleDateString()}
                            </span>
                            <span class="font-mono">ID: #${note.id}</span>
                        </div>
                    </div>
                </div>
                
                <div class="p-5 border-t border-[#374151] flex justify-end gap-3">
                    <button class="close-modal-btn px-4 py-2 bg-[#374151] hover:bg-[#4B5563] text-white rounded-xl transition-all duration-300 hover:scale-105">Close</button>
                    <button class="delete-from-modal bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 hover:scale-105" data-id="${note.id}">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                        Delete Note
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modal = document.getElementById(modalId);
    
    const closeModal = () => {
        if (modal) modal.remove();
    };
    
    modal.querySelectorAll('.close-modal, .close-modal-btn').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    const deleteBtn = modal.querySelector('.delete-from-modal');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', async () => {
            const noteId = parseInt(deleteBtn.dataset.id);
            if (confirm('Are you sure you want to delete this note?')) {
                try {
                    await deleteNote(noteId);
                    showSuccess('Note deleted successfully!', 'success');
                    closeModal();
                    setTimeout(() => window.location.reload(), 500);
                } catch (error) {
                    showError('Failed to delete note', 'error');
                }
            }
        });
    }
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal) closeModal();
    });
}

// Setup saved page events
export function setupSavedPage() {
    // View toggle buttons
    const viewToggleBtns = document.querySelectorAll('.view-toggle-btn');
    viewToggleBtns.forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        newBtn.addEventListener('click', async () => {
            const newViewMode = newBtn.dataset.view;
            currentViewMode = newViewMode;
            
            viewToggleBtns.forEach(b => {
                const newB = b.cloneNode(true);
                b.parentNode.replaceChild(newB, b);
                newB.classList.remove('bg-gradient-to-r', 'from-[#3B82F6]', 'to-[#A78BFA]', 'text-white', 'shadow-lg');
                newB.classList.add('text-[#9CA3AF]');
            });
            
            const currentBtn = document.querySelector(`.view-toggle-btn[data-view="${newViewMode}"]`);
            if (currentBtn) {
                currentBtn.classList.add('bg-gradient-to-r', 'from-[#3B82F6]', 'to-[#A78BFA]', 'text-white', 'shadow-lg');
                currentBtn.classList.remove('text-[#9CA3AF]');
            }
            
            const notes = await getSavedNotes();
            const gridContainer = document.querySelector('.saved-notes-grid');
            if (gridContainer) {
                const gridClasses = newViewMode === 'grid' 
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-4';
                gridContainer.className = `${gridClasses} saved-notes-grid`;
            }
        });
    });
    
    // Export notes
    const exportBtn = document.getElementById('exportNotesBtn');
    if (exportBtn) {
        const newExportBtn = exportBtn.cloneNode(true);
        exportBtn.parentNode.replaceChild(newExportBtn, exportBtn);
        
        newExportBtn.addEventListener('click', async () => {
            const notes = await getSavedNotes();
            const exportData = {
                exportedAt: new Date().toISOString(),
                notes: notes,
                count: notes.length
            };
            const dataStr = JSON.stringify(exportData, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', `flashnotes-saved-${Date.now()}.json`);
            linkElement.click();
            showSuccess('Notes exported successfully!', 'success');
        });
    }
    
    // Setup filter events
    setupSavedNoteFilter(
        [],
        (type, value) => {
            const notes = document.querySelectorAll('.saved-note-card');
            notes.forEach(note => {
                if (type === 'topic') {
                    const topic = note.querySelector('.bg-gradient-to-r')?.textContent;
                    if (value === 'all' || topic === value) {
                        note.style.display = 'block';
                    } else {
                        note.style.display = 'none';
                    }
                }
            });
            const visibleCount = document.querySelectorAll('.saved-note-card[style*="display: block"], .saved-note-card:not([style*="display: none"])').length;
            const resultSpan = document.getElementById('resultCount');
            if (resultSpan) resultSpan.textContent = visibleCount;
        },
        (sortBy) => {
            const grid = document.querySelector('.saved-notes-grid');
            const cards = Array.from(document.querySelectorAll('.saved-note-card'));
            if (sortBy === 'newest') {
                cards.sort((a, b) => {
                    const dateA = new Date(a.querySelector('.text-right .text-xs')?.textContent);
                    const dateB = new Date(b.querySelector('.text-right .text-xs')?.textContent);
                    return dateB - dateA;
                });
            } else if (sortBy === 'oldest') {
                cards.sort((a, b) => {
                    const dateA = new Date(a.querySelector('.text-right .text-xs')?.textContent);
                    const dateB = new Date(b.querySelector('.text-right .text-xs')?.textContent);
                    return dateA - dateB;
                });
            } else if (sortBy === 'topic') {
                cards.sort((a, b) => {
                    const topicA = a.querySelector('.bg-gradient-to-r')?.textContent || '';
                    const topicB = b.querySelector('.bg-gradient-to-r')?.textContent || '';
                    return topicA.localeCompare(topicB);
                });
            }
            cards.forEach(card => grid.appendChild(card));
        },
        (searchTerm) => {
            const notes = document.querySelectorAll('.saved-note-card');
            notes.forEach(note => {
                const question = note.querySelector('.text-\\[\\#3B82F6\\]')?.textContent || '';
                const topic = note.querySelector('.bg-gradient-to-r')?.textContent || '';
                if (searchTerm === '' || question.toLowerCase().includes(searchTerm.toLowerCase()) || topic.toLowerCase().includes(searchTerm.toLowerCase())) {
                    note.style.display = 'block';
                } else {
                    note.style.display = 'none';
                }
            });
            const visibleCount = document.querySelectorAll('.saved-note-card[style*="display: block"], .saved-note-card:not([style*="display: none"])').length;
            const resultSpan = document.getElementById('resultCount');
            if (resultSpan) resultSpan.textContent = visibleCount;
        },
        async (ids) => {
            if (confirm(`Delete ${ids.length} selected note(s)?`)) {
                for (const id of ids) {
                    await deleteNote(id);
                }
                showSuccess(`${ids.length} note(s) deleted successfully!`, 'success');
                setTimeout(() => window.location.reload(), 500);
            }
        }
    );
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add CSS animations
const savedPageStyles = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .custom-scrollbar::-webkit-scrollbar {
        width: 5px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-track {
        background: #1F2937;
        border-radius: 10px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: linear-gradient(135deg, #3B82F6, #A78BFA);
        border-radius: 10px;
    }
`;

if (!document.querySelector('#saved-page-styles')) {
    const style = document.createElement('style');
    style.id = 'saved-page-styles';
    style.textContent = savedPageStyles;
    document.head.appendChild(style);
}