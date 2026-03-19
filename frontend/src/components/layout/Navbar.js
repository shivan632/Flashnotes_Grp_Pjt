// frontend/src/components/layout/Navbar.js - COMPLETE WITH AI CHAT BUTTON

export function Navbar() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userName = localStorage.getItem('userName') || 'User';
    const userEmail = localStorage.getItem('userEmail') || '';
    
    return `
        <nav class="bg-[#1F2937] shadow-lg sticky top-0 z-40">
            <div class="container mx-auto px-4">
                <div class="flex items-center justify-between h-16">
                    <!-- Logo -->
                    <div class="flex items-center space-x-4">
                        <a href="#/" class="flex items-center space-x-2">
                            <div class="w-8 h-8 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-lg flex items-center justify-center">
                                <span class="text-white font-bold text-xl">F</span>
                            </div>
                            <span class="text-xl font-bold text-[#3B82F6]">Flashnotes</span>
                        </a>
                    </div>
                    
                    <!-- Right side -->
                    <div class="flex items-center space-x-3">
                        ${isAuthenticated ? `
                            <!-- AI Chat Toggle Button -->
                            <button id="aiChatToggle" 
                                    class="p-2 text-[#E5E7EB] hover:text-[#3B82F6] transition-colors rounded-lg hover:bg-[#374151] relative"
                                    title="AI Assistant">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                                </svg>
                                <span class="absolute -top-1 -right-1 w-2 h-2 bg-[#3B82F6] rounded-full animate-pulse"></span>
                            </button>
                            
                            <!-- User Menu -->
                            <div class="relative group">
                                <button class="flex items-center space-x-2 text-[#E5E7EB] hover:text-[#3B82F6] p-2 rounded-lg hover:bg-[#374151]">
                                    <div class="w-8 h-8 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full flex items-center justify-center">
                                        <span class="text-white text-sm font-semibold">${userName.charAt(0).toUpperCase()}</span>
                                    </div>
                                    <span class="hidden lg:inline text-sm">${userName}</span>
                                </button>
                                
                                <!-- Dropdown -->
                                <div class="absolute right-0 mt-2 w-48 bg-[#1F2937] border border-[#374151] rounded-lg shadow-xl hidden group-hover:block">
                                    <div class="px-4 py-3 border-b border-[#374151]">
                                        <p class="text-sm text-[#E5E7EB]">${userName}</p>
                                        <p class="text-xs text-[#9CA3AF]">${userEmail}</p>
                                    </div>
                                    <a href="#/profile" class="block px-4 py-2 text-sm text-[#E5E7EB] hover:bg-[#374151]">Profile</a>
                                    <a href="#/settings" class="block px-4 py-2 text-sm text-[#E5E7EB] hover:bg-[#374151]">Settings</a>
                                    <hr class="border-[#374151]">
                                    <button id="logoutBtn" class="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[#374151]">Logout</button>
                                </div>
                            </div>
                        ` : `
                            <a href="#/login" class="text-[#E5E7EB] hover:text-[#3B82F6] px-4 py-2">Login</a>
                            <a href="#/register" class="bg-[#3B82F6] text-white px-4 py-2 rounded-lg hover:bg-[#60A5FA]">Sign Up</a>
                        `}
                    </div>
                </div>
            </div>
        </nav>
    `;
}

export function setupNavbar() {
    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.clear();
            window.location.hash = '#/';
            window.location.reload();
        });
    }
}