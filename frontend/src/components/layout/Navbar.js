// Navbar Component

export function Navbar() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const currentPath = window.location.hash.slice(1) || '/';
    
    const navItems = [
        { path: '/', label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { path: '/dashboard', label: 'Dashboard', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z' },
        { path: '/history', label: 'History', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' }
    ];
    
    return `
        <nav class="bg-[#1F2937] shadow-lg sticky top-0 z-50">
            <div class="container mx-auto px-4">
                <div class="flex items-center justify-between h-16">
                    <!-- Logo -->
                    <a href="#/" class="flex items-center space-x-2">
                        <div class="w-8 h-8 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-lg flex items-center justify-center">
                            <span class="text-white font-bold text-xl">F</span>
                        </div>
                        <span class="text-xl font-bold text-[#3B82F6]">Flashnotes</span>
                    </a>
                    
                    <!-- Desktop Navigation -->
                    <div class="hidden md:flex items-center space-x-1">
                        ${navItems.map(item => `
                            <a href="#${item.path}" 
                               class="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all
                                      ${currentPath === item.path 
                                        ? 'bg-[#3B82F6] text-white' 
                                        : 'text-[#E5E7EB] hover:bg-[#374151] hover:text-[#3B82F6]'}">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${item.icon}"></path>
                                </svg>
                                <span>${item.label}</span>
                            </a>
                        `).join('')}
                    </div>
                    
                    <!-- Right Section -->
                    <div class="flex items-center space-x-3">
                        ${isAuthenticated ? `
                            <div class="relative">
                                <button id="profileBtn" class="flex items-center space-x-2 text-[#E5E7EB] hover:text-[#3B82F6] transition-colors">
                                    <div class="w-8 h-8 bg-[#3B82F6] rounded-full flex items-center justify-center">
                                        <span class="text-white text-sm font-semibold">
                                            ${localStorage.getItem('userName')?.charAt(0) || 'U'}
                                        </span>
                                    </div>
                                    <span class="hidden lg:inline">${localStorage.getItem('userName') || 'User'}</span>
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </button>
                                
                                <!-- Dropdown Menu -->
                                <div id="profileDropdown" class="absolute right-0 mt-2 w-48 bg-[#1F2937] border border-[#374151] rounded-lg shadow-xl hidden">
                                    <a href="#/profile" class="flex items-center space-x-2 px-4 py-2 text-sm text-[#E5E7EB] hover:bg-[#374151] transition-colors">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                        </svg>
                                        <span>Profile</span>
                                    </a>
                                    <a href="#/settings" class="flex items-center space-x-2 px-4 py-2 text-sm text-[#E5E7EB] hover:bg-[#374151] transition-colors">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        </svg>
                                        <span>Settings</span>
                                    </a>
                                    <hr class="border-[#374151] my-1">
                                    <button id="logoutBtn" class="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-400 hover:bg-[#374151] transition-colors">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                                        </svg>
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </div>
                        ` : `
                            <a href="#/login" class="text-[#E5E7EB] hover:text-[#3B82F6] transition-colors px-4 py-2 text-sm font-medium">
                                Login
                            </a>
                            <a href="#/register" class="bg-[#3B82F6] hover:bg-[#60A5FA] text-white px-4 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105">
                                Sign Up
                            </a>
                        `}
                        
                        <!-- Mobile menu button -->
                        <button id="mobileMenuBtn" class="md:hidden text-[#E5E7EB] hover:text-[#3B82F6] transition-colors">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        </button>
                    </div>
                </div>
                
                <!-- Mobile Navigation Menu -->
                <div id="mobileMenu" class="hidden md:hidden py-4 border-t border-[#374151]">
                    ${navItems.map(item => `
                        <a href="#${item.path}" 
                           class="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all
                                  ${currentPath === item.path 
                                    ? 'bg-[#3B82F6] text-white' 
                                    : 'text-[#E5E7EB] hover:bg-[#374151]'}">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${item.icon}"></path>
                            </svg>
                            <span>${item.label}</span>
                        </a>
                    `).join('')}
                </div>
            </div>
        </nav>
    `;
}

// Setup navbar events
export function setupNavbar() {
    // Mobile menu toggle
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Profile dropdown toggle
    const profileBtn = document.getElementById('profileBtn');
    const profileDropdown = document.getElementById('profileDropdown');
    
    if (profileBtn && profileDropdown) {
        profileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            profileDropdown.classList.toggle('hidden');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!profileBtn.contains(e.target)) {
                profileDropdown.classList.add('hidden');
            }
        });
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('userName');
            localStorage.removeItem('userEmail');
            window.location.hash = '#/';
        });
    }
}