// Header Component

export function Header({ showNav = true, title = 'Flashnotes' }) {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    return `
        <header class="bg-[#1F2937] shadow-lg sticky top-0 z-50">
            <nav class="container mx-auto px-4">
                <div class="flex justify-between items-center h-16">
                    <!-- Logo and Brand -->
                    <div class="flex items-center space-x-3">
                        <a href="#/" class="flex items-center space-x-2">
                            <div class="w-8 h-8 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-lg flex items-center justify-center">
                                <span class="text-white font-bold text-xl">F</span>
                            </div>
                            <span class="text-xl font-bold text-[#3B82F6]">${title}</span>
                        </a>
                    </div>
                    
                    <!-- Desktop Navigation -->
                    ${showNav ? `
                        <div class="hidden md:flex items-center space-x-6">
                            <a href="#/" class="text-[#E5E7EB] hover:text-[#3B82F6] transition-colors px-3 py-2 text-sm font-medium">
                                Home
                            </a>
                            <a href="#/dashboard" class="text-[#E5E7EB] hover:text-[#3B82F6] transition-colors px-3 py-2 text-sm font-medium">
                                Dashboard
                            </a>
                            <a href="#/history" class="text-[#E5E7EB] hover:text-[#3B82F6] transition-colors px-3 py-2 text-sm font-medium">
                                History
                            </a>
                            <a href="#/pricing" class="text-[#E5E7EB] hover:text-[#3B82F6] transition-colors px-3 py-2 text-sm font-medium">
                                Pricing
                            </a>
                        </div>
                    ` : ''}
                    
                    <!-- Right side buttons -->
                    <div class="flex items-center space-x-3">
                        ${isAuthenticated ? `
                            <div class="relative group">
                                <button class="flex items-center space-x-2 text-[#E5E7EB] hover:text-[#3B82F6] transition-colors">
                                    <div class="w-8 h-8 bg-[#3B82F6] rounded-full flex items-center justify-center">
                                        <span class="text-white text-sm font-semibold">
                                            ${localStorage.getItem('userName')?.charAt(0) || 'U'}
                                        </span>
                                    </div>
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </button>
                                <div class="absolute right-0 mt-2 w-48 bg-[#1F2937] border border-[#374151] rounded-lg shadow-xl hidden group-hover:block">
                                    <a href="#/profile" class="block px-4 py-2 text-sm text-[#E5E7EB] hover:bg-[#374151] transition-colors">Profile</a>
                                    <a href="#/settings" class="block px-4 py-2 text-sm text-[#E5E7EB] hover:bg-[#374151] transition-colors">Settings</a>
                                    <hr class="border-[#374151] my-1">
                                    <button id="logoutBtn" class="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[#374151] transition-colors">Logout</button>
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
                
                <!-- Mobile Navigation -->
                <div id="mobileMenu" class="hidden md:hidden py-4 border-t border-[#374151]">
                    <a href="#/" class="block py-2 text-[#E5E7EB] hover:text-[#3B82F6] transition-colors">Home</a>
                    <a href="#/dashboard" class="block py-2 text-[#E5E7EB] hover:text-[#3B82F6] transition-colors">Dashboard</a>
                    <a href="#/history" class="block py-2 text-[#E5E7EB] hover:text-[#3B82F6] transition-colors">History</a>
                    <a href="#/pricing" class="block py-2 text-[#E5E7EB] hover:text-[#3B82F6] transition-colors">Pricing</a>
                </div>
            </nav>
        </header>
    `;
}

// Setup header events
export function setupHeader() {
    // Mobile menu toggle
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
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