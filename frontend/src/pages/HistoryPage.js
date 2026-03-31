// frontend/src/pages/HistoryPage.js
// History Page - Displays all saved notes and search history with enhanced UI

import { getSavedNotes, getSearchHistory } from '../services/storage.js';
import { showError, showSuccess } from '../components/common/ErrorMessage.js';

export default async function HistoryPage() {
    const notes = await getSavedNotes() || [];
    const history = await getSearchHistory() || [];
    
    return `
        <div class="min-h-screen bg-gradient-to-b from-[#0F172A] via-[#111827] to-[#0F172A]">
            <!-- Navigation -->
            <nav class="bg-gradient-to-r from-[#1F2937] via-[#1A2436] to-[#111827] shadow-2xl sticky top-0 z-50 border-b border-[#374151]/80 backdrop-blur-sm">
                <div class="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex justify-between items-center py-4">
                        <div class="flex items-center gap-3">
                            <div class="relative group">
                                <div class="absolute inset-0 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-xl blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
                                <div class="relative w-10 h-10 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-all duration-500">
                                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <h1 class="text-2xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">Flashnotes History</h1>
                                <p class="text-xs text-[#6B7280]">Your learning journey at a glance</p>
                            </div>
                        </div>
                        <div class="flex gap-2">
                            <a href="#/dashboard" class="group relative flex items-center gap-2 px-4 py-2 rounded-xl text-[#E5E7EB] hover:text-[#3B82F6] transition-all duration-300 hover:bg-[#374151] overflow-hidden">
                                <div class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                <svg class="w-4 h-4 relative group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                                </svg>
                                <span class="relative">Dashboard</span>
                            </a>
                            <a href="#/history" class="group relative flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] text-white shadow-lg">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span>History</span>
                            </a>
                            <button id="logoutBtn" class="group relative flex items-center gap-2 px-4 py-2 rounded-xl text-[#E5E7EB] hover:text-red-400 transition-all duration-300 hover:bg-red-500/10 overflow-hidden">
                                <div class="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/10 to-red-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                <svg class="w-4 h-4 relative group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                                </svg>
                                <span class="relative">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            
            <!-- History Content -->
            <div class="container mx-auto px-4 py-8 max-w-7xl">
                <!-- Hero Section -->
                <div class="mb-10 text-center animate-fadeInUp">
                    <div class="relative inline-block">
                        <div class="absolute inset-0 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full blur-2xl opacity-30 animate-pulse"></div>
                        <div class="relative">
                            <h2 class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent mb-3">
                                Your Learning Journey
                            </h2>
                        </div>
                    </div>
                    <p class="text-[#9CA3AF] text-lg">Track all your saved notes and search history</p>
                    <div class="w-24 h-1 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] mx-auto rounded-full mt-4"></div>
                </div>
                
                <!-- Stats Cards -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
                    <div class="group bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-5 border border-[#374151] hover:border-[#3B82F6] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-fadeInUp" style="animation-delay: 0.1s">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-4xl font-bold text-[#3B82F6] group-hover:scale-110 transition-transform inline-block">${notes.length}</div>
                                <div class="text-sm text-[#9CA3AF] mt-1 flex items-center gap-1">
                                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                                    </svg>
                                    Saved Notes
                                </div>
                            </div>
                            <div class="relative">
                                <div class="absolute inset-0 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] rounded-xl blur-md opacity-0 group-hover:opacity-50 transition-opacity"></div>
                                <div class="relative w-14 h-14 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                    <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div class="mt-3 pt-3 border-t border-[#374151]">
                            <div class="flex justify-between text-xs text-[#6B7280]">
                                <span>Total notes in collection</span>
                                <span class="text-[#3B82F6]">📚 ${notes.length} items</span>
                            </div>
                        </div>
                    </div>
                    <div class="group bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-5 border border-[#374151] hover:border-[#3B82F6] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-fadeInUp" style="animation-delay: 0.2s">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-4xl font-bold text-[#3B82F6] group-hover:scale-110 transition-transform inline-block">${history.length}</div>
                                <div class="text-sm text-[#9CA3AF] mt-1 flex items-center gap-1">
                                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    Topics Searched
                                </div>
                            </div>
                            <div class="relative">
                                <div class="absolute inset-0 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] rounded-xl blur-md opacity-0 group-hover:opacity-50 transition-opacity"></div>
                                <div class="relative w-14 h-14 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                    <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div class="mt-3 pt-3 border-t border-[#374151]">
                            <div class="flex justify-between text-xs text-[#6B7280]">
                                <span>Total search queries</span>
                                <span class="text-[#3B82F6]">🔍 ${history.length} searches</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <!-- Saved Notes Section -->
                    <div class="animate-fadeInUp" style="animation-delay: 0.3s">
                        <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl shadow-xl border border-[#374151] overflow-hidden hover:shadow-2xl transition-all duration-300">
                            <div class="p-5 border-b border-[#374151] bg-gradient-to-r from-[#1F2937] to-[#111827]">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center gap-3">
                                        <div class="relative">
                                            <div class="absolute inset-0 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-lg blur-md opacity-0 group-hover:opacity-50 transition-opacity"></div>
                                            <div class="relative w-10 h-10 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-lg flex items-center justify-center shadow-md">
                                                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                                                </svg>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 class="text-xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">Saved Notes</h3>
                                            <p class="text-xs text-[#6B7280]">Your personal knowledge base</p>
                                        </div>
                                    </div>
                                    <div class="bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-md">${notes.length}</div>
                                </div>
                            </div>
                            
                            <div class="p-5 max-h-[550px] overflow-y-auto custom-scrollbar">
                                ${notes.length > 0 ? notes.map((note, index) => `
                                    <div class="group bg-gradient-to-r from-[#111827] to-[#1F2937] rounded-xl p-4 mb-4 hover:bg-gradient-to-r hover:from-[#1A2436] hover:to-[#2D3748] transition-all duration-300 border border-[#374151] hover:border-[#3B82F6] hover:translate-x-1" style="animation: slideInRight 0.3s ease-out ${index * 0.05}s forwards">
                                        <div class="flex justify-between items-start mb-3">
                                            <div class="flex items-center gap-2">
                                                <div class="w-6 h-6 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-lg flex items-center justify-center">
                                                    <span class="text-white text-xs">📝</span>
                                                </div>
                                                <span class="bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] text-white text-xs px-2.5 py-1 rounded-full font-medium">${escapeHtml(note.topic)}</span>
                                            </div>
                                            <span class="text-[#9CA3AF] text-xs flex items-center gap-1">
                                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                </svg>
                                                ${formatDate(note.savedAt)}
                                            </span>
                                        </div>
                                        <div class="mb-3 pl-8">
                                            <p class="text-[#3B82F6] font-semibold text-sm mb-2 flex items-start gap-2">
                                                <span class="text-[#60A5FA]">Q:</span>
                                                <span>${escapeHtml(truncateText(note.question, 100))}</span>
                                            </p>
                                            <p class="text-[#E5E7EB] text-sm leading-relaxed flex items-start gap-2">
                                                <span class="text-[#9CA3AF]">A:</span>
                                                <span>${escapeHtml(truncateText(note.answer, 150))}</span>
                                            </p>
                                        </div>
                                        <div class="mt-3 flex justify-end opacity-0 group-hover:opacity-100 transition-all duration-300">
                                            <button class="delete-note text-red-400 hover:text-red-500 text-xs flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-all duration-300" data-id="${note.id}">
                                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                </svg>
                                                Delete Note
                                            </button>
                                        </div>
                                    </div>
                                `).join('') : `
                                    <div class="text-center py-16">
                                        <div class="relative">
                                            <div class="absolute inset-0 flex items-center justify-center">
                                                <div class="w-24 h-24 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full opacity-10 blur-2xl"></div>
                                            </div>
                                            <svg class="w-20 h-20 mx-auto mb-4 text-[#4B5563] relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                                            </svg>
                                            <p class="text-[#9CA3AF] text-lg mb-2">✨ No saved notes yet</p>
                                            <p class="text-sm text-[#6B7280] max-w-xs mx-auto">Generate Q&A from the dashboard and click "Save Note" to build your collection</p>
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
                            </div>
                        </div>
                    </div>
                    
                    <!-- Search History Section -->
                    <div class="animate-fadeInUp" style="animation-delay: 0.4s">
                        <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl shadow-xl border border-[#374151] overflow-hidden hover:shadow-2xl transition-all duration-300">
                            <div class="p-5 border-b border-[#374151] bg-gradient-to-r from-[#1F2937] to-[#111827]">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center gap-3">
                                        <div class="relative">
                                            <div class="absolute inset-0 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-lg blur-md opacity-0 group-hover:opacity-50 transition-opacity"></div>
                                            <div class="relative w-10 h-10 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-lg flex items-center justify-center shadow-md">
                                                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                </svg>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 class="text-xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">Search History</h3>
                                            <p class="text-xs text-[#6B7280]">Your learning exploration</p>
                                        </div>
                                    </div>
                                    ${history.length > 0 ? `
                                        <button id="clearHistoryBtn" class="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-red-400 hover:text-red-500 hover:bg-red-500/10 transition-all duration-300">
                                            <svg class="w-3 h-3 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                            </svg>
                                            Clear All
                                        </button>
                                    ` : ''}
                                </div>
                            </div>
                            
                            <div class="p-5 max-h-[550px] overflow-y-auto custom-scrollbar">
                                ${history.length > 0 ? history.map((entry, index) => `
                                    <div class="group flex justify-between items-center p-3 bg-[#111827] rounded-xl mb-2 hover:bg-[#1A2436] transition-all duration-300 cursor-pointer border border-[#374151] hover:border-[#3B82F6] hover:translate-x-1" data-topic="${escapeHtml(entry.topic)}" style="animation: slideInLeft 0.3s ease-out ${index * 0.05}s forwards">
                                        <div class="flex items-center gap-3">
                                            <div class="relative">
                                                <div class="absolute inset-0 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] rounded-lg blur-md opacity-0 group-hover:opacity-50 transition-opacity"></div>
                                                <div class="relative w-8 h-8 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                                    </svg>
                                                </div>
                                            </div>
                                            <span class="text-[#E5E7EB] group-hover:text-[#3B82F6] transition-colors font-medium">${escapeHtml(entry.topic)}</span>
                                        </div>
                                        <div class="flex items-center gap-3">
                                            <span class="text-[#9CA3AF] text-xs flex items-center gap-1">
                                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                </svg>
                                                ${formatDate(entry.searchedAt)}
                                            </span>
                                            <svg class="w-4 h-4 text-[#60A5FA] opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                                            </svg>
                                        </div>
                                    </div>
                                `).join('') : `
                                    <div class="text-center py-16">
                                        <div class="relative">
                                            <div class="absolute inset-0 flex items-center justify-center">
                                                <div class="w-24 h-24 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full opacity-10 blur-2xl"></div>
                                            </div>
                                            <svg class="w-20 h-20 mx-auto mb-4 text-[#4B5563] relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                            </svg>
                                            <p class="text-[#9CA3AF] text-lg mb-2">🔍 No search history yet</p>
                                            <p class="text-sm text-[#6B7280] max-w-xs mx-auto">Your searched topics will appear here as you explore</p>
                                            <div class="mt-6 flex justify-center gap-2">
                                                <div class="w-1.5 h-1.5 bg-[#3B82F6] rounded-full animate-pulse"></div>
                                                <div class="w-1.5 h-1.5 bg-[#60A5FA] rounded-full animate-pulse delay-100"></div>
                                                <div class="w-1.5 h-1.5 bg-[#A78BFA] rounded-full animate-pulse delay-200"></div>
                                            </div>
                                            <a href="#/dashboard" class="inline-block mt-6 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] text-white px-6 py-2.5 rounded-xl hover:from-[#60A5FA] hover:to-[#8B5CF6] transition-all duration-300 transform hover:scale-105 shadow-lg">
                                                🔍 Start Searching
                                            </a>
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
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
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

// Setup history page events
export function setupHistoryPage() {
    // Delete note buttons
    document.querySelectorAll('.delete-note').forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        newBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            const noteId = newBtn.dataset.id;
            if (noteId && confirm('Are you sure you want to delete this note?')) {
                try {
                    const { deleteNote } = await import('../services/storage.js');
                    await deleteNote(parseInt(noteId));
                    showSuccess('Note deleted successfully!', 'success');
                    setTimeout(() => window.location.reload(), 500);
                } catch (error) {
                    showError('Failed to delete note', 'error');
                }
            }
        });
    });
    
    // Search history click
    document.querySelectorAll('[data-topic]').forEach(item => {
        const newItem = item.cloneNode(true);
        item.parentNode.replaceChild(newItem, item);
        
        newItem.addEventListener('click', () => {
            const topic = newItem.dataset.topic;
            if (topic) {
                window.location.hash = '#/dashboard';
                setTimeout(() => {
                    const topicInput = document.getElementById('topicInput');
                    if (topicInput) {
                        topicInput.value = topic;
                        const generateBtn = document.getElementById('generateBtn');
                        if (generateBtn) generateBtn.click();
                    }
                }, 100);
            }
        });
    });
    
    // Clear history button
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    if (clearHistoryBtn) {
        const newBtn = clearHistoryBtn.cloneNode(true);
        clearHistoryBtn.parentNode.replaceChild(newBtn, clearHistoryBtn);
        
        newBtn.addEventListener('click', async () => {
            if (confirm('Are you sure you want to clear all search history? This action cannot be undone.')) {
                try {
                    const { clearHistory } = await import('../services/storage.js');
                    await clearHistory();
                    showSuccess('History cleared successfully!', 'success');
                    setTimeout(() => window.location.reload(), 500);
                } catch (error) {
                    showError('Failed to clear history', 'error');
                }
            }
        });
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        const newBtn = logoutBtn.cloneNode(true);
        logoutBtn.parentNode.replaceChild(newBtn, logoutBtn);
        
        newBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to logout?')) {
                localStorage.clear();
                window.location.hash = '#/';
                window.location.reload();
            }
        });
    }
}

// Add CSS animations
const historyPageStyles = `
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
    
    @keyframes pulse-glow {
        0%, 100% {
            opacity: 0.3;
            transform: scale(1);
        }
        50% {
            opacity: 0.6;
            transform: scale(1.05);
        }
    }
    
    .animate-fadeInUp {
        animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        opacity: 0;
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
    
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(135deg, #60A5FA, #8B5CF6);
    }
`;

if (!document.querySelector('#history-page-styles')) {
    const style = document.createElement('style');
    style.id = 'history-page-styles';
    style.textContent = historyPageStyles;
    document.head.appendChild(style);
}