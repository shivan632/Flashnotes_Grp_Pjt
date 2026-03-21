// frontend/src/pages/SavedPage.js
import { Sidebar } from '../components/layout/Sidebar.js';
import { AIChatSidebar } from '../components/layout/AIChatSidebar.js';
import { Header } from '../components/common/Header.js';
import { SavedNoteCard } from '../components/saved/SavedNoteCard.js';
import { SavedNoteFilter, setupSavedNoteFilter } from '../components/saved/SavedNoteFilter.js';
import { SavedNoteGrid, SavedNoteGridHeader } from '../components/saved/SavedNoteGrid.js';
import { getSavedNotes, deleteNote } from '../services/storage.js';
import { showError } from '../components/common/ErrorMessage.js';
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
    
    // Extract unique topics for filter
    const topics = [...new Set(notes.map(note => note.topic).filter(Boolean))];
    
    return `
        <div class="min-h-screen bg-gradient-to-b from-[#111827] to-[#0F172A] relative">
            ${Sidebar()}
            ${AIChatSidebar()}
            <div id="mainContent" class="min-h-screen transition-all duration-300" 
                 style="margin-left: 256px; margin-right: 384px; width: calc(100% - 640px);">
                ${Header({ title: 'Saved List' })}
                <main class="container mx-auto px-4 py-8">
                    <!-- Header with Stats -->
                    <div class="mb-8 animate-fadeInUp">
                        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <div class="flex items-center gap-2 mb-2">
                                    <div class="w-10 h-10 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-xl flex items-center justify-center">
                                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                                        </svg>
                                    </div>
                                    <h1 class="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">
                                        Your Saved Notes
                                    </h1>
                                </div>
                                <p class="text-[#9CA3AF] mt-2">All your saved questions and answers in one place</p>
                            </div>
                            
                            <!-- Stats Card -->
                            <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl px-6 py-3 border border-[#374151]">
                                <div class="text-center">
                                    <div class="text-2xl font-bold text-[#3B82F6]">${notes.length}</div>
                                    <div class="text-xs text-[#9CA3AF]">Saved Notes</div>
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
                        <div class="animate-fadeInUp" style="animation-delay: 0.05s">
                            ${SavedNoteFilter({ topics })}
                        </div>
                        
                        <!-- Grid Header with View Toggle -->
                        <div class="animate-fadeInUp" style="animation-delay: 0.1s">
                            ${SavedNoteGridHeader({ 
                                total: notes.length, 
                                visible: notes.length,
                                viewMode: currentViewMode
                            })}
                        </div>
                        
                        <!-- Notes Grid -->
                        <div class="animate-fadeInUp" style="animation-delay: 0.15s">
                            ${SavedNoteGrid({ 
                                notes, 
                                viewMode: currentViewMode,
                                onDelete: async (id) => {
                                    try {
                                        await deleteNote(id);
                                        showError('Note deleted successfully!', 'success');
                                        setTimeout(() => window.location.reload(), 500);
                                    } catch (error) {
                                        showError('Failed to delete note', 'error');
                                    }
                                },
                                onView: (note) => {
                                    alert(`Q: ${note.question}\n\nA: ${note.answer}`);
                                }
                            })}
                        </div>
                    ` : `
                        <div class="text-center py-16 bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl border border-[#374151] animate-fadeInUp">
                            <div class="relative">
                                <div class="absolute inset-0 flex items-center justify-center">
                                    <div class="w-24 h-24 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full opacity-10 blur-xl"></div>
                                </div>
                                <svg class="w-24 h-24 mx-auto mb-5 text-[#4B5563] relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                                </svg>
                                <p class="text-[#9CA3AF] text-lg mb-2">No saved notes yet</p>
                                <p class="text-sm text-[#6B7280] max-w-sm mx-auto">Generate Q&A from the dashboard and click "Save Note" to build your collection</p>
                                <div class="mt-4 flex justify-center gap-2">
                                    <div class="w-1.5 h-1.5 bg-[#3B82F6] rounded-full animate-pulse"></div>
                                    <div class="w-1.5 h-1.5 bg-[#60A5FA] rounded-full animate-pulse delay-100"></div>
                                    <div class="w-1.5 h-1.5 bg-[#A78BFA] rounded-full animate-pulse delay-200"></div>
                                </div>
                                <a href="#/dashboard" class="inline-block mt-6 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] text-white px-6 py-2.5 rounded-xl hover:from-[#60A5FA] hover:to-[#8B5CF6] transition-all duration-300 transform hover:scale-105 shadow-lg">
                                    Go to Dashboard
                                </a>
                            </div>
                        </div>
                    `}
                </main>
            </div>
        </div>
    `;
}

// Setup saved page events
export function setupSavedPage() {
    // View toggle buttons
    const viewToggleBtns = document.querySelectorAll('.view-toggle-btn');
    viewToggleBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            const newViewMode = btn.dataset.view;
            currentViewMode = newViewMode;
            
            // Update active state
            viewToggleBtns.forEach(b => {
                b.classList.remove('bg-gradient-to-r', 'from-[#3B82F6]', 'to-[#A78BFA]', 'text-white', 'shadow-lg');
                b.classList.add('text-[#9CA3AF]');
            });
            btn.classList.add('bg-gradient-to-r', 'from-[#3B82F6]', 'to-[#A78BFA]', 'text-white', 'shadow-lg');
            btn.classList.remove('text-[#9CA3AF]');
            
            // Refresh grid with new view mode
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
        exportBtn.addEventListener('click', async () => {
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
            showError('Notes exported successfully!', 'success');
        });
    }
    
    // View note buttons
    document.querySelectorAll('.view-note').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const noteId = btn.dataset.id;
            // Find the note and show details
            // This can be expanded to open a modal
        });
    });
    
    // Delete note buttons
    document.querySelectorAll('.delete-note').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            const noteId = parseInt(btn.dataset.id);
            
            if (confirm('Are you sure you want to delete this note?')) {
                try {
                    await deleteNote(noteId);
                    showError('Note deleted successfully!', 'success');
                    const card = btn.closest('.saved-note-card');
                    if (card) {
                        card.style.animation = 'fadeOut 0.3s ease-out forwards';
                        setTimeout(() => card.remove(), 300);
                    }
                    const countElement = document.querySelector('.bg-gradient-to-br .text-2xl');
                    if (countElement) {
                        const currentCount = parseInt(countElement.textContent);
                        countElement.textContent = currentCount - 1;
                    }
                } catch (error) {
                    showError('Failed to delete note', 'error');
                }
            }
        });
    });
}

// Add CSS animations
const savedPageStyles = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: scale(1);
        }
        to {
            opacity: 0;
            transform: scale(0.9);
        }
    }
    
    .animate-fadeInUp {
        animation: fadeInUp 0.5s ease-out forwards;
        opacity: 0;
    }
`;

if (!document.querySelector('#saved-page-styles')) {
    const style = document.createElement('style');
    style.id = 'saved-page-styles';
    style.textContent = savedPageStyles;
    document.head.appendChild(style);
}