// frontend/src/components/layout/Navbar.js
// Complete Navbar with Dashboard, Saved List, Quiz, Score, Profile, and Notifications - Enhanced UI

export function Navbar() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userName = localStorage.getItem('userName') || 'User';
    const userEmail = localStorage.getItem('userEmail') || '';
    const userAvatar = localStorage.getItem('userAvatar') || userName.charAt(0).toUpperCase();
    
    const notificationCount = parseInt(localStorage.getItem('notificationCount') || '0');
    
    return `
        <nav class="bg-gradient-to-r from-[#1F2937] via-[#1A2436] to-[#111827] shadow-2xl sticky top-0 z-50 border-b border-[#374151]/80 backdrop-blur-sm">
            <div class="container mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex items-center justify-between h-16 lg:h-20">
                    <!-- Logo and Brand -->
                    <div class="flex items-center space-x-6">
                        <a href="#/" class="flex items-center space-x-2 group">
                            <div class="relative">
                                <div class="absolute inset-0 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-xl blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
                                <div class="relative w-10 h-10 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-500">
                                    <span class="text-white font-bold text-xl">F</span>
                                </div>
                            </div>
                            <span class="text-xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
                                Flashnotes
                            </span>
                        </a>
                        
                        <!-- Main Navigation Links -->
                        ${isAuthenticated ? `
                            <div class="hidden md:flex items-center space-x-1 lg:space-x-2">
                                <a href="#/dashboard" 
                                   class="nav-link relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 overflow-hidden group
                                          ${window.location.hash === '#/dashboard' || window.location.hash === '#/' 
                                            ? 'bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] text-white shadow-lg' 
                                            : 'text-[#E5E7EB] hover:bg-[#374151] hover:text-[#3B82F6]'}">
                                    <div class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                    <span class="flex items-center space-x-2 relative z-10">
                                        <svg class="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                                        </svg>
                                        <span>Dashboard</span>
                                    </span>
                                </a>
                                
                                <a href="#/saved" 
                                   class="nav-link relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 overflow-hidden group
                                          ${window.location.hash === '#/saved' 
                                            ? 'bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] text-white shadow-lg' 
                                            : 'text-[#E5E7EB] hover:bg-[#374151] hover:text-[#3B82F6]'}">
                                    <div class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                    <span class="flex items-center space-x-2 relative z-10">
                                        <svg class="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                                        </svg>
                                        <span>Saved Notes</span>
                                    </span>
                                </a>
                                
                                <a href="#/quiz" 
                                   class="nav-link relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 overflow-hidden group
                                          ${window.location.hash === '#/quiz' 
                                            ? 'bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] text-white shadow-lg' 
                                            : 'text-[#E5E7EB] hover:bg-[#374151] hover:text-[#3B82F6]'}">
                                    <div class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                    <span class="flex items-center space-x-2 relative z-10">
                                        <svg class="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                        <span>Quiz</span>
                                    </span>
                                </a>
                                
                                <a href="#/score" 
                                   class="nav-link relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 overflow-hidden group
                                          ${window.location.hash === '#/score' 
                                            ? 'bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] text-white shadow-lg' 
                                            : 'text-[#E5E7EB] hover:bg-[#374151] hover:text-[#3B82F6]'}">
                                    <div class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                    <span class="flex items-center space-x-2 relative z-10">
                                        <svg class="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                                        </svg>
                                        <span>Score</span>
                                    </span>
                                </a>
                                
                                <a href="#/roadmap" 
                                   class="nav-link relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 overflow-hidden group
                                          ${window.location.hash === '#/roadmap' 
                                            ? 'bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] text-white shadow-lg' 
                                            : 'text-[#E5E7EB] hover:bg-[#374151] hover:text-[#3B82F6]'}">
                                    <div class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                    <span class="flex items-center space-x-2 relative z-10">
                                        <svg class="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                                        </svg>
                                        <span>Roadmap</span>
                                    </span>
                                </a>
                            </div>
                        ` : ''}
                    </div>
                    
                    <!-- Right side icons and user menu -->
                    <div class="flex items-center space-x-2 sm:space-x-3">
                        ${isAuthenticated ? `
                            <!-- AI Chat Toggle Button -->
                            <button id="aiChatToggle" 
                                    class="relative p-2.5 text-[#E5E7EB] hover:text-[#3B82F6] transition-all duration-300 rounded-xl hover:bg-[#374151] group">
                                <div class="absolute inset-0 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                                <svg class="w-5 h-5 relative group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                                </svg>
                                <span class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#3B82F6] rounded-full animate-pulse shadow-lg"></span>
                                <span class="absolute hidden group-hover:block bg-[#111827] text-white text-xs px-2 py-1 rounded -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap shadow-lg z-50">
                                    🤖 AI Assistant
                                </span>
                            </button>
                            
                            <!-- Notification Icon with Counter -->
                            <div class="relative group">
                                <button id="notificationBtn" 
                                        class="relative p-2.5 text-[#E5E7EB] hover:text-[#3B82F6] transition-all duration-300 rounded-xl hover:bg-[#374151] group">
                                    <div class="absolute inset-0 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                                    <svg class="w-5 h-5 relative group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                                    </svg>
                                    ${notificationCount > 0 ? `
                                        <span class="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full flex items-center justify-center px-1 shadow-lg animate-bounce">
                                            ${notificationCount > 9 ? '9+' : notificationCount}
                                        </span>
                                    ` : ''}
                                    <span class="absolute hidden group-hover:block bg-[#111827] text-white text-xs px-2 py-1 rounded -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap shadow-lg z-50">
                                        🔔 Notifications
                                    </span>
                                </button>
                                
                                <!-- Notification Dropdown -->
                                <div id="notificationDropdown" 
                                     class="absolute right-0 mt-3 w-80 bg-gradient-to-b from-[#1F2937] to-[#111827] border border-[#374151] rounded-2xl shadow-2xl hidden group-hover:block hover:block z-50 animate-fadeIn">
                                    <div class="p-4 border-b border-[#374151] flex justify-between items-center bg-gradient-to-r from-[#1F2937] to-[#111827] rounded-t-2xl">
                                        <h3 class="font-semibold text-[#E5E7EB] flex items-center gap-2">
                                            <span class="w-2 h-2 bg-[#3B82F6] rounded-full animate-pulse"></span>
                                            Notifications
                                        </h3>
                                        <button id="markAllRead" class="text-xs text-[#60A5FA] hover:text-[#3B82F6] transition-all duration-300 hover:scale-105">
                                            Mark all read
                                        </button>
                                    </div>
                                    <div class="max-h-96 overflow-y-auto custom-scrollbar" id="notificationList">
                                        ${generateNotifications()}
                                    </div>
                                    <div class="p-3 border-t border-[#374151] text-center bg-[#111827]/50 rounded-b-2xl">
                                        <a href="#/notifications" class="text-sm text-[#60A5FA] hover:text-[#3B82F6] transition-all duration-300 hover:scale-105 inline-flex items-center gap-1">
                                            View all
                                            <svg class="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Profile Menu -->
                            <div class="relative group">
                                <button class="flex items-center space-x-2 text-[#E5E7EB] hover:text-[#3B82F6] transition-all duration-300 p-1.5 rounded-xl hover:bg-[#374151] group">
                                    <div class="relative">
                                        <div class="absolute inset-0 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
                                        <div class="relative w-9 h-9 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                                            <span class="text-white text-sm font-semibold">${userAvatar}</span>
                                        </div>
                                    </div>
                                    <span class="hidden lg:inline text-sm font-medium">${userName}</span>
                                    <svg class="w-4 h-4 hidden lg:block transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </button>
                                
                                <!-- Profile Dropdown -->
                                <div class="absolute right-0 mt-3 w-64 bg-gradient-to-b from-[#1F2937] to-[#111827] border border-[#374151] rounded-2xl shadow-2xl hidden group-hover:block hover:block z-50 animate-fadeIn">
                                    <div class="px-4 py-3 border-b border-[#374151] bg-gradient-to-r from-[#1F2937] to-[#111827] rounded-t-2xl">
                                        <p class="text-sm font-semibold text-[#E5E7EB]">${userName}</p>
                                        <p class="text-xs text-[#9CA3AF] truncate">${userEmail}</p>
                                    </div>
                                    <div class="py-2">
                                        <a href="#/profile" class="flex items-center space-x-3 px-4 py-2.5 text-sm text-[#E5E7EB] hover:bg-[#374151] transition-all duration-200 group hover:translate-x-1">
                                            <svg class="w-4 h-4 text-[#9CA3AF] group-hover:text-[#3B82F6] transition-colors group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                            </svg>
                                            <span>My Profile</span>
                                        </a>
                                        <a href="#/settings" class="flex items-center space-x-3 px-4 py-2.5 text-sm text-[#E5E7EB] hover:bg-[#374151] transition-all duration-200 group hover:translate-x-1">
                                            <svg class="w-4 h-4 text-[#9CA3AF] group-hover:text-[#3B82F6] transition-colors group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                                            </svg>
                                            <span>Settings</span>
                                        </a>
                                        <a href="#/notifications" class="flex items-center space-x-3 px-4 py-2.5 text-sm text-[#E5E7EB] hover:bg-[#374151] transition-all duration-200 group hover:translate-x-1">
                                            <svg class="w-4 h-4 text-[#9CA3AF] group-hover:text-[#3B82F6] transition-colors group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                                            </svg>
                                            <span>Notifications</span>
                                        </a>
                                        <a href="#/my-roadmaps" class="flex items-center space-x-3 px-4 py-2.5 text-sm text-[#E5E7EB] hover:bg-[#374151] transition-all duration-200 group hover:translate-x-1">
                                            <svg class="w-4 h-4 text-[#9CA3AF] group-hover:text-[#3B82F6] transition-colors group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                                            </svg>
                                            <span>My Roadmaps</span>
                                        </a>
                                    </div>
                                    <hr class="border-[#374151]">
                                    <div class="py-2">
                                        <button id="logoutBtn" class="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-red-400 hover:bg-[#374151] transition-all duration-200 group hover:translate-x-1">
                                            <svg class="w-4 h-4 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                                            </svg>
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ` : `
                            <a href="#/login" class="text-[#E5E7EB] hover:text-[#3B82F6] transition-all duration-300 px-4 py-2 text-sm font-medium hover:bg-[#374151] rounded-xl">
                                Login
                            </a>
                            <a href="#/register" class="bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] hover:from-[#60A5FA] hover:to-[#8B5CF6] text-white px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                                Sign Up
                            </a>
                        `}
                        
                        <!-- Mobile menu button -->
                        <button id="mobileMenuBtn" class="md:hidden p-2 text-[#E5E7EB] hover:text-[#3B82F6] transition-all duration-300 rounded-xl hover:bg-[#374151]">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        </button>
                    </div>
                </div>
                
                <!-- Mobile Navigation Menu -->
                <div id="mobileMenu" class="hidden md:hidden py-4 border-t border-[#374151] space-y-2 animate-slideDown">
                    ${isAuthenticated ? `
                        <a href="#/dashboard" class="block py-2.5 px-4 text-[#E5E7EB] hover:text-[#3B82F6] hover:bg-[#374151] rounded-xl transition-all duration-200 hover:translate-x-1">📊 Dashboard</a>
                        <a href="#/saved" class="block py-2.5 px-4 text-[#E5E7EB] hover:text-[#3B82F6] hover:bg-[#374151] rounded-xl transition-all duration-200 hover:translate-x-1">📝 Saved Notes</a>
                        <a href="#/quiz" class="block py-2.5 px-4 text-[#E5E7EB] hover:text-[#3B82F6] hover:bg-[#374151] rounded-xl transition-all duration-200 hover:translate-x-1">🎯 Quiz</a>
                        <a href="#/score" class="block py-2.5 px-4 text-[#E5E7EB] hover:text-[#3B82F6] hover:bg-[#374151] rounded-xl transition-all duration-200 hover:translate-x-1">⭐ Score</a>
                        <a href="#/roadmap" class="block py-2.5 px-4 text-[#E5E7EB] hover:text-[#3B82F6] hover:bg-[#374151] rounded-xl transition-all duration-200 hover:translate-x-1">🗺️ Roadmap</a>
                        <a href="#/my-roadmaps" class="block py-2.5 px-4 text-[#E5E7EB] hover:text-[#3B82F6] hover:bg-[#374151] rounded-xl transition-all duration-200 hover:translate-x-1">📋 My Roadmaps</a>
                        <hr class="border-[#374151] my-2">
                        <a href="#/profile" class="block py-2.5 px-4 text-[#E5E7EB] hover:text-[#3B82F6] hover:bg-[#374151] rounded-xl transition-all duration-200 hover:translate-x-1">👤 My Profile</a>
                        <a href="#/settings" class="block py-2.5 px-4 text-[#E5E7EB] hover:text-[#3B82F6] hover:bg-[#374151] rounded-xl transition-all duration-200 hover:translate-x-1">⚙️ Settings</a>
                        <button id="mobileLogoutBtn" class="w-full text-left py-2.5 px-4 text-red-400 hover:bg-[#374151] rounded-xl transition-all duration-200 hover:translate-x-1">🚪 Logout</button>
                    ` : `
                        <a href="#/login" class="block py-2.5 px-4 text-[#E5E7EB] hover:text-[#3B82F6] hover:bg-[#374151] rounded-xl transition-all duration-200">🔐 Login</a>
                        <a href="#/register" class="block py-2.5 px-4 text-[#3B82F6] font-medium rounded-xl">📝 Register</a>
                    `}
                </div>
            </div>
        </nav>
    `;
}

// Helper function to generate notifications with improved UI
function generateNotifications() {
    const notifications = [
        {
            id: 1,
            title: 'Quiz Completed',
            message: 'You scored 85% on the Operating System quiz! Great job! 🎉',
            time: '5 minutes ago',
            read: false,
            icon: '🎯',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            id: 2,
            title: 'New Achievement',
            message: 'Congratulations! You earned the "Quick Learner" badge! 🏆',
            time: '1 hour ago',
            read: false,
            icon: '🏆',
            color: 'from-yellow-500 to-orange-500'
        },
        {
            id: 3,
            title: 'Study Reminder',
            message: 'Time to review your saved notes on Machine Learning 📚',
            time: '2 hours ago',
            read: false,
            icon: '📚',
            color: 'from-green-500 to-emerald-500'
        },
        {
            id: 4,
            title: 'AI Assistant',
            message: 'New AI-generated questions available for Python 🤖',
            time: '1 day ago',
            read: true,
            icon: '🤖',
            color: 'from-purple-500 to-pink-500'
        }
    ];
    
    return notifications.map(notif => `
        <div class="notification-item p-4 hover:bg-[#374151] transition-all duration-300 border-b border-[#374151] last:border-0 cursor-pointer group ${!notif.read ? 'bg-gradient-to-r from-[#1F2937] to-[#111827]' : ''}" data-id="${notif.id}">
            <div class="flex items-start space-x-3">
                <div class="w-10 h-10 bg-gradient-to-r ${notif.color} rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                    <span class="text-lg">${notif.icon}</span>
                </div>
                <div class="flex-1">
                    <div class="flex justify-between items-start">
                        <p class="text-sm font-semibold text-[#E5E7EB] group-hover:text-[#3B82F6] transition-colors">${notif.title}</p>
                        <span class="text-xs text-[#9CA3AF]">${notif.time}</span>
                    </div>
                    <p class="text-xs text-[#9CA3AF] mt-1 leading-relaxed">${notif.message}</p>
                </div>
                ${!notif.read ? '<span class="w-2 h-2 bg-[#3B82F6] rounded-full animate-pulse mt-1"></span>' : ''}
            </div>
        </div>
    `).join('');
}

// Setup navbar events
export function setupNavbar() {
    // Mobile menu toggle
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            const icon = mobileBtn.querySelector('svg');
            if (icon) {
                icon.style.transform = mobileMenu.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(90deg)';
            }
        });
    }
    
    // Logout buttons
    const logoutBtn = document.getElementById('logoutBtn');
    const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
    
    const handleLogout = () => {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.clear();
            window.location.hash = '#/';
            window.location.reload();
        }
    };
    
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
    if (mobileLogoutBtn) mobileLogoutBtn.addEventListener('click', handleLogout);
    
    // Notification system
    setupNotifications();
    
    // Mark all as read
    const markAllRead = document.getElementById('markAllRead');
    if (markAllRead) {
        markAllRead.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            markAllNotificationsRead();
        });
    }
    
    // Individual notification click
    document.querySelectorAll('.notification-item').forEach(item => {
        const newItem = item.cloneNode(true);
        item.parentNode.replaceChild(newItem, item);
        
        newItem.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const id = newItem.dataset.id;
            markNotificationRead(id);
        });
    });
}

// Notification functions
function setupNotifications() {
    if (!localStorage.getItem('notificationCount')) {
        localStorage.setItem('notificationCount', '4');
    }
    
    document.addEventListener('click', (e) => {
        const notifBtn = document.getElementById('notificationBtn');
        const notifDropdown = document.getElementById('notificationDropdown');
        
        if (notifBtn && notifDropdown && !notifBtn.contains(e.target) && !notifDropdown.contains(e.target)) {
            notifDropdown.classList.add('hidden');
        }
    });
    
    const notifBtn = document.getElementById('notificationBtn');
    const notifDropdown = document.getElementById('notificationDropdown');
    
    if (notifBtn && notifDropdown) {
        const newBtn = notifBtn.cloneNode(true);
        notifBtn.parentNode.replaceChild(newBtn, notifBtn);
        
        newBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            notifDropdown.classList.toggle('hidden');
        });
    }
}

function markNotificationRead(id) {
    console.log('Marking notification as read:', id);
    
    const currentCount = parseInt(localStorage.getItem('notificationCount') || '0');
    if (currentCount > 0) {
        localStorage.setItem('notificationCount', (currentCount - 1).toString());
    }
    
    const notifBtn = document.getElementById('notificationBtn');
    if (notifBtn) {
        const existingBadge = notifBtn.querySelector('span.bg-gradient-to-r');
        if (existingBadge) {
            const newCount = currentCount - 1;
            if (newCount > 0) {
                existingBadge.textContent = newCount > 9 ? '9+' : newCount;
            } else {
                existingBadge.remove();
            }
        }
    }
    
    const notificationItem = document.querySelector(`.notification-item[data-id="${id}"]`);
    if (notificationItem) {
        notificationItem.classList.remove('bg-gradient-to-r');
        const unreadDot = notificationItem.querySelector('span.animate-pulse');
        if (unreadDot) unreadDot.remove();
    }
}

function markAllNotificationsRead() {
    console.log('Marking all notifications as read');
    localStorage.setItem('notificationCount', '0');
    
    const notifBtn = document.getElementById('notificationBtn');
    if (notifBtn) {
        const badge = notifBtn.querySelector('span.bg-gradient-to-r');
        if (badge) badge.remove();
    }
    
    document.querySelectorAll('.notification-item').forEach(item => {
        item.classList.remove('bg-gradient-to-r');
        const dot = item.querySelector('span.animate-pulse');
        if (dot) dot.remove();
    });
    
    const dropdown = document.getElementById('notificationDropdown');
    if (dropdown) dropdown.classList.add('hidden');
}

// Add CSS animations
const navbarStyles = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .animate-fadeIn {
        animation: fadeIn 0.2s ease-out forwards;
    }
    
    .animate-slideDown {
        animation: slideDown 0.3s ease-out forwards;
    }
    
    .nav-link {
        position: relative;
        overflow: hidden;
    }
    
    .nav-link::before {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        width: 0;
        height: 2px;
        background: linear-gradient(90deg, #3B82F6, #A78BFA);
        transition: width 0.3s ease, left 0.3s ease;
    }
    
    .nav-link:hover::before {
        width: 100%;
        left: 0;
    }
    
    .custom-scrollbar::-webkit-scrollbar {
        width: 4px;
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

if (!document.querySelector('#navbar-styles')) {
    const style = document.createElement('style');
    style.id = 'navbar-styles';
    style.textContent = navbarStyles;
    document.head.appendChild(style);
}