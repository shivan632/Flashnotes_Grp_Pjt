// frontend/src/pages/HistoryPage.js
// History Page - Displays all saved notes and search history with enhanced UI

import { getSavedNotes, getSearchHistory } from '../services/storage.js';

export default async function HistoryPage() {
    const notes = await getSavedNotes() || [];
    const history = await getSearchHistory() || [];
    
    return `
        <div class="min-h-screen bg-gradient-to-b from-[#111827] to-[#0F172A]">
            <!-- Navigation -->
            <nav class="bg-gradient-to-r from-[#1F2937] to-[#111827] shadow-xl sticky top-0 z-50 border-b border-[#374151]">
                <div class="container mx-auto px-4">
                    <div class="flex justify-between items-center py-4">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-xl flex items-center justify-center">
                                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <h1 class="text-2xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">Flashnotes History</h1>
                        </div>
                        <div class="flex gap-4">
                            <a href="#/dashboard" class="group text-[#E5E7EB] hover:text-[#3B82F6] transition-all duration-300 flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-[#374151]">
                                <svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                                </svg>
                                Dashboard
                            </a>
                            <a href="#/history" class="group text-[#3B82F6] flex items-center gap-1 px-3 py-2 rounded-lg bg-[#374151]/50">
                                <svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                History
                            </a>
                            <button id="logoutBtn" class="group text-[#E5E7EB] hover:text-red-400 transition-all duration-300 flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-red-500/10">
                                <svg class="w-5 h-5 group-hover:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                                </svg>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            
            <!-- History Content -->
            <div class="container mx-auto px-4 py-8">
                <!-- Header -->
                <div class="mb-8 text-center animate-fadeInUp">
                    <h2 class="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent mb-2">
                        Your Learning Journey
                    </h2>
                    <p class="text-[#9CA3AF]">Track all your saved notes and search history</p>
                    <div class="w-24 h-1 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] mx-auto rounded-full mt-4"></div>
                </div>
                
                <!-- Stats Cards -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-5 border border-[#374151] animate-fadeInUp" style="animation-delay: 0.1s">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-3xl font-bold text-[#3B82F6]">${notes.length}</div>
                                <div class="text-sm text-[#9CA3AF] mt-1">Saved Notes</div>
                            </div>
                            <div class="w-12 h-12 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] rounded-xl flex items-center justify-center">
                                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-5 border border-[#374151] animate-fadeInUp" style="animation-delay: 0.2s">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-3xl font-bold text-[#3B82F6]">${history.length}</div>
                                <div class="text-sm text-[#9CA3AF] mt-1">Topics Searched</div>
                            </div>
                            <div class="w-12 h-12 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] rounded-xl flex items-center justify-center">
                                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <!-- Saved Notes Section -->
                    <div class="animate-fadeInUp" style="animation-delay: 0.3s">
                        <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl shadow-xl border border-[#374151] overflow-hidden">
                            <div class="p-5 border-b border-[#374151] bg-gradient-to-r from-[#1F2937] to-[#111827]">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center gap-2">
                                        <div class="w-8 h-8 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-lg flex items-center justify-center">
                                            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                                            </svg>
                                        </div>
                                        <h3 class="text-xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">Saved Notes</h3>
                                    </div>
                                    <div class="bg-[#3B82F6] text-white px-3 py-1 rounded-full text-sm font-medium">${notes.length}</div>
                                </div>
                            </div>
                            
                            <div class="p-5 max-h-[500px] overflow-y-auto custom-scrollbar">
                                ${notes.length > 0 ? notes.map((note, index) => `
                                    <div class="group bg-gradient-to-r from-[#111827] to-[#1F2937] rounded-xl p-4 mb-3 hover:bg-gradient-to-r hover:from-[#1F2937] hover:to-[#2D3748] transition-all duration-300 border border-[#374151] hover:border-[#3B82F6]" style="animation: slideInRight 0.3s ease-out ${index * 0.05}s forwards">
                                        <div class="flex justify-between items-start mb-3">
                                            <span class="bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] text-white text-xs px-2.5 py-1 rounded-full font-medium">${escapeHtml(note.topic)}</span>
                                            <span class="text-[#9CA3AF] text-xs flex items-center gap-1">
                                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                </svg>
                                                ${formatDate(note.savedAt)}
                                            </span>
                                        </div>
                                        <p class="text-[#3B82F6] font-semibold mb-2 text-sm">Q: ${escapeHtml(truncateText(note.question, 100))}</p>
                                        <p class="text-[#E5E7EB] text-sm leading-relaxed">A: ${escapeHtml(truncateText(note.answer, 150))}</p>
                                        <div class="mt-3 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button class="delete-note text-red-400 hover:text-red-500 text-xs flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-red-500/10 transition-all" data-id="${note.id}">
                                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                </svg>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                `).join('') : `
                                    <div class="text-center py-12">
                                        <div class="relative">
                                            <div class="absolute inset-0 flex items-center justify-center">
                                                <div class="w-20 h-20 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full opacity-10 blur-xl"></div>
                                            </div>
                                            <svg class="w-16 h-16 mx-auto mb-3 text-[#4B5563] relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                                            </svg>
                                            <p class="text-[#9CA3AF]">No saved notes yet</p>
                                            <p class="text-sm text-[#6B7280] mt-2">Generate Q&A and save them to see them here</p>
                                            <a href="#/dashboard" class="inline-block mt-4 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] text-white px-5 py-2 rounded-xl hover:from-[#60A5FA] hover:to-[#8B5CF6] transition-all duration-300 transform hover:scale-105">
                                                Go to Dashboard
                                            </a>
                                        </div>
                                    </div>
                                `}
                            </div>
                        </div>
                    </div>
                    
                    <!-- Search History Section -->
                    <div class="animate-fadeInUp" style="animation-delay: 0.4s">
                        <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl shadow-xl border border-[#374151] overflow-hidden">
                            <div class="p-5 border-b border-[#374151] bg-gradient-to-r from-[#1F2937] to-[#111827]">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center gap-2">
                                        <div class="w-8 h-8 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-lg flex items-center justify-center">
                                            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                            </svg>
                                        </div>
                                        <h3 class="text-xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">Search History</h3>
                                    </div>
                                    <div class="bg-[#3B82F6] text-white px-3 py-1 rounded-full text-sm font-medium">${history.length}</div>
                                </div>
                                ${history.length > 0 ? `
                                    <div class="mt-3">
                                        <button id="clearHistoryBtn" class="text-xs text-red-400 hover:text-red-500 transition-all duration-300 flex items-center gap-1">
                                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                            </svg>
                                            Clear All
                                        </button>
                                    </div>
                                ` : ''}
                            </div>
                            
                            <div class="p-5 max-h-[500px] overflow-y-auto custom-scrollbar">
                                ${history.length > 0 ? history.map((entry, index) => `
                                    <div class="group flex justify-between items-center p-3 bg-[#111827] rounded-xl mb-2 hover:bg-[#1F2937] transition-all duration-300 cursor-pointer border border-[#374151] hover:border-[#3B82F6]" data-topic="${escapeHtml(entry.topic)}" style="animation: slideInLeft 0.3s ease-out ${index * 0.05}s forwards">
                                        <div class="flex items-center gap-2">
                                            <div class="w-8 h-8 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                                </svg>
                                            </div>
                                            <span class="text-[#E5E7EB] group-hover:text-[#3B82F6] transition-colors">${escapeHtml(entry.topic)}</span>
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <span class="text-[#9CA3AF] text-xs">${formatDate(entry.searchedAt)}</span>
                                            <svg class="w-4 h-4 text-[#60A5FA] opacity-0 group-hover:opacity-100 transition-opacity group-hover:translate-x-1 transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                                            </svg>
                                        </div>
                                    </div>
                                `).join('') : `
                                    <div class="text-center py-12">
                                        <div class="relative">
                                            <div class="absolute inset-0 flex items-center justify-center">
                                                <div class="w-20 h-20 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full opacity-10 blur-xl"></div>
                                            </div>
                                            <svg class="w-16 h-16 mx-auto mb-3 text-[#4B5563] relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                            </svg>
                                            <p class="text-[#9CA3AF]">No search history yet</p>
                                            <p class="text-sm text-[#6B7280] mt-2">Your searched topics will appear here</p>
                                            <div class="mt-3 flex justify-center gap-1">
                                                <div class="w-1 h-1 bg-[#3B82F6] rounded-full animate-pulse"></div>
                                                <div class="w-1 h-1 bg-[#60A5FA] rounded-full animate-pulse delay-100"></div>
                                                <div class="w-1 h-1 bg-[#A78BFA] rounded-full animate-pulse delay-200"></div>
                                            </div>
                                        </div>
                                    </div>
                                `}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Helper functions
function formatDate(dateString) {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add CSS animations
const historyPageStyles = `
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
    
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideInLeft {
        from {
            opacity: 0;
            transform: translateX(20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .animate-fadeInUp {
        animation: fadeInUp 0.5s ease-out forwards;
        opacity: 0;
    }
    
    .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-track {
        background: #1F2937;
        border-radius: 10px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #3B82F6;
        border-radius: 10px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #60A5FA;
    }
`;

if (!document.querySelector('#history-page-styles')) {
    const style = document.createElement('style');
    style.id = 'history-page-styles';
    style.textContent = historyPageStyles;
    document.head.appendChild(style);
}