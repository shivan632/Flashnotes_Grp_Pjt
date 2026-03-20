// frontend/src/pages/SavedPage.js
// Saved List Page - View all saved notes

import { Sidebar } from '../components/layout/Sidebar.js';
import { AIChatSidebar } from '../components/layout/AIChatSidebar.js';
import { Header } from '../components/common/Header.js';
import { getSavedNotes } from '../services/storage.js';
import { formatDate, truncateText } from '../utils/helpers.js';

export async function SavedPage() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    if (!isAuthenticated) {
        window.location.hash = '#/login';
        return '';
    }
    
    const notes = await getSavedNotes();
    
    return `
        <div class="min-h-screen bg-[#111827] relative">
            ${Sidebar()}
            ${AIChatSidebar()}
            <div id="mainContent" class="min-h-screen transition-all duration-300" 
                 style="margin-left: 256px; margin-right: 384px; width: calc(100% - 640px);">
                ${Header({ title: 'Saved List' })}
                <main class="container mx-auto px-4 py-8">
                    <div class="mb-8">
                        <h1 class="text-3xl font-bold text-[#E5E7EB]">Your Saved Notes</h1>
                        <p class="text-[#9CA3AF] mt-2">All your saved questions and answers in one place</p>
                    </div>
                    
                    ${notes.length > 0 ? `
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            ${notes.map(note => `
                                <div class="bg-[#1F2937] rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all hover:scale-105">
                                    <div class="flex justify-between items-start mb-3">
                                        <span class="bg-[#3B82F6] text-white text-xs px-2 py-1 rounded">${note.topic}</span>
                                        <span class="text-[#9CA3AF] text-xs">${formatDate(note.savedAt)}</span>
                                    </div>
                                    <p class="text-[#3B82F6] font-semibold mb-2">Q: ${truncateText(note.question, 60)}</p>
                                    <p class="text-[#E5E7EB] text-sm">${truncateText(note.answer, 100)}</p>
                                    <div class="mt-4 flex justify-end space-x-2">
                                        <button class="view-note text-[#60A5FA] hover:text-[#3B82F6] p-2" data-id="${note.id}">
                                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                            </svg>
                                        </button>
                                        <button class="delete-note text-red-400 hover:text-red-500 p-2" data-id="${note.id}">
                                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : `
                        <div class="text-center py-12 bg-[#1F2937] rounded-xl">
                            <svg class="w-20 h-20 mx-auto text-[#4B5563] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                            </svg>
                            <p class="text-[#9CA3AF] text-lg">No saved notes yet</p>
                            <p class="text-sm text-[#6B7280] mt-2">Generate Q&A and click Save to see them here</p>
                            <a href="#/dashboard" class="inline-block mt-4 bg-[#3B82F6] text-white px-6 py-2 rounded-lg hover:bg-[#60A5FA]">
                                Go to Dashboard
                            </a>
                        </div>
                    `}
                </main>
            </div>
        </div>
    `;
}