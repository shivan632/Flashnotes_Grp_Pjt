// frontend/src/components/saved/SavedNoteGrid.js
import { SavedNoteCard } from './SavedNoteCard.js';
import { LoadingSpinner } from '../common/LoadingSpinner.js';

export function SavedNoteGrid({ notes, onDelete, onView, loading = false, viewMode = 'grid' }) {
    if (loading) {
        return `
            <div class="flex justify-center items-center py-20">
                ${LoadingSpinner({ size: 'lg', text: 'Loading your notes...' })}
            </div>
        `;
    }
    
    if (!notes || notes.length === 0) {
        return `
            <div class="text-center py-16 bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl border border-[#374151]">
                <div class="relative">
                    <div class="absolute inset-0 flex items-center justify-center">
                        <div class="w-32 h-32 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full opacity-10 blur-2xl"></div>
                    </div>
                    <svg class="w-24 h-24 mx-auto mb-5 text-[#4B5563] relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                    </svg>
                    <p class="text-[#9CA3AF] text-lg mb-2">No saved notes yet</p>
                    <p class="text-sm text-[#6B7280] max-w-sm mx-auto">Generate Q&A from the dashboard and click "Save Note" to build your collection</p>
                    <div class="mt-6 flex justify-center gap-2">
                        <div class="w-1.5 h-1.5 bg-[#3B82F6] rounded-full animate-pulse"></div>
                        <div class="w-1.5 h-1.5 bg-[#60A5FA] rounded-full animate-pulse delay-100"></div>
                        <div class="w-1.5 h-1.5 bg-[#A78BFA] rounded-full animate-pulse delay-200"></div>
                    </div>
                    <a href="#/dashboard" class="inline-block mt-6 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] text-white px-6 py-2.5 rounded-xl hover:from-[#60A5FA] hover:to-[#8B5CF6] transition-all duration-300 transform hover:scale-105 shadow-lg">
                        Go to Dashboard
                    </a>
                </div>
            </div>
        `;
    }
    
    const gridClasses = viewMode === 'grid' 
        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
        : 'space-y-4';
    
    return `
        <div class="${gridClasses} saved-notes-grid">
            ${notes.map((note, index) => `
                <div class="saved-note-item animate-fadeInUp" style="animation-delay: ${index * 0.05}s">
                    ${SavedNoteCard({ note, onDelete, onView })}
                </div>
            `).join('')}
        </div>
    `;
}

export function SavedNoteGridHeader({ total, visible, viewMode = 'grid', onViewToggle }) {
    return `
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
                <h2 class="text-2xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">
                    Your Saved Notes
                </h2>
                <p class="text-sm text-[#9CA3AF] mt-1">
                    Showing <span class="text-[#3B82F6] font-medium">${visible}</span> of <span class="text-[#3B82F6] font-medium">${total}</span> notes
                </p>
            </div>
            
            <div class="flex items-center gap-3">
                <div class="bg-[#1F2937] rounded-xl p-1 flex gap-1">
                    <button class="view-toggle-btn p-2 rounded-lg transition-all duration-300 ${viewMode === 'grid' ? 'bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] text-white shadow-lg' : 'text-[#9CA3AF] hover:text-[#E5E7EB]'}" data-view="grid">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                        </svg>
                    </button>
                    <button class="view-toggle-btn p-2 rounded-lg transition-all duration-300 ${viewMode === 'list' ? 'bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] text-white shadow-lg' : 'text-[#9CA3AF] hover:text-[#E5E7EB]'}" data-view="list">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>
                </div>
                
                <button id="exportNotesBtn" class="bg-[#374151] hover:bg-gradient-to-r hover:from-[#3B82F6] hover:to-[#A78BFA] text-[#9CA3AF] hover:text-white px-4 py-2 rounded-xl text-sm transition-all duration-300 flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                    </svg>
                    Export
                </button>
            </div>
        </div>
    `;
}