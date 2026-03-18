// History Page - Displays all saved notes and search history

import { getSavedNotes, getSearchHistory } from '../services/storage.js';

export default function HistoryPage() {
    const notes = getSavedNotes();
    const history = getSearchHistory();
    
    return `
        <div class="min-h-screen bg-[#111827]">
            <!-- Navigation -->
            <nav class="bg-[#1F2937] shadow-lg">
                <div class="container mx-auto px-4">
                    <div class="flex justify-between items-center py-4">
                        <h1 class="text-2xl font-bold text-[#3B82F6]">Flashnotes History</h1>
                        <div class="flex gap-6">
                            <a href="#/dashboard" class="text-[#E5E7EB] hover:text-[#3B82F6] transition-colors flex items-center gap-1">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                                </svg>
                                Dashboard
                            </a>
                            <a href="#/history" class="text-[#3B82F6] flex items-center gap-1">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                History
                            </a>
                            <a href="#/" id="logoutBtn" class="text-[#E5E7EB] hover:text-[#3B82F6] transition-colors flex items-center gap-1">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                                </svg>
                                Logout
                            </a>
                        </div>
                    </div>
                </div>
            </nav>
            
            <!-- History Content -->
            <div class="container mx-auto px-4 py-8">
                <h2 class="text-3xl font-bold text-[#E5E7EB] mb-8">Your Learning Journey</h2>
                
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <!-- Saved Notes Section -->
                    <div class="space-y-4">
                        <h3 class="text-xl font-semibold text-[#60A5FA] flex items-center gap-2">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                            </svg>
                            Saved Notes (${notes.length})
                        </h3>
                        
                        <div class="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                            ${notes.length > 0 ? notes.map(note => `
                                <div class="bg-[#1F2937] rounded-xl p-5 shadow-lg hover:shadow-xl transition-all">
                                    <div class="flex justify-between items-start">
                                        <span class="bg-[#3B82F6] text-white text-xs px-2 py-1 rounded">${note.topic}</span>
                                        <span class="text-[#9CA3AF] text-xs">${new Date(note.savedAt).toLocaleString()}</span>
                                    </div>
                                    <p class="text-[#3B82F6] font-semibold mt-3">Q: ${note.question}</p>
                                    <p class="text-[#E5E7EB] text-sm mt-2">${note.answer}</p>
                                </div>
                            `).join('') : `
                                <div class="bg-[#1F2937] rounded-xl p-8 text-center">
                                    <svg class="w-20 h-20 mx-auto text-[#4B5563] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                                    </svg>
                                    <p class="text-[#9CA3AF]">No saved notes yet</p>
                                    <p class="text-sm text-[#6B7280] mt-2">Start generating Q&A and save them to see them here</p>
                                    <a href="#/dashboard" class="inline-block mt-4 bg-[#3B82F6] text-white px-4 py-2 rounded-lg hover:bg-[#60A5FA] transition-colors">
                                        Go to Dashboard
                                    </a>
                                </div>
                            `}
                        </div>
                    </div>
                    
                    <!-- Search History Section -->
                    <div class="space-y-4">
                        <h3 class="text-xl font-semibold text-[#60A5FA] flex items-center gap-2">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            Search History (${history.length})
                        </h3>
                        
                        <div class="bg-[#1F2937] rounded-xl p-5 shadow-lg max-h-[600px] overflow-y-auto">
                            ${history.length > 0 ? history.map(entry => `
                                <div class="flex justify-between items-center py-3 border-b border-[#374151] last:border-0">
                                    <div class="flex items-center gap-2">
                                        <svg class="w-4 h-4 text-[#60A5FA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                        </svg>
                                        <span class="text-[#E5E7EB]">${entry.topic}</span>
                                    </div>
                                    <span class="text-[#9CA3AF] text-sm">${new Date(entry.searchedAt).toLocaleDateString()}</span>
                                </div>
                            `).join('') : `
                                <div class="text-center py-8">
                                    <svg class="w-16 h-16 mx-auto text-[#4B5563] mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    <p class="text-[#9CA3AF]">No search history yet</p>
                                    <p class="text-sm text-[#6B7280] mt-2">Your searched topics will appear here</p>
                                </div>
                            `}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}