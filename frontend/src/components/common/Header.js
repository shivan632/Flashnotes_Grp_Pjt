// frontend/src/components/common/Header.js
// Header Component - Enhanced with animations, modern design, and achievement notifications

export function Header({ showNav = true, title = 'Flashnotes' }) {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userName = localStorage.getItem('userName') || 'User';
    const userEmail = localStorage.getItem('userEmail') || '';
    
    // Achievement badge will be updated by JavaScript after render
    const achievementBadge = isAuthenticated ? `<span id="achievementBadge" class="hidden absolute -top-1 -right-1 min-w-[16px] h-[16px] bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-[10px] rounded-full flex items-center justify-center px-1 animate-pulse shadow-lg"></span>` : '';
    
    return `
        <header class="bg-gradient-to-r from-[#1F2937] to-[#111827] shadow-lg sticky top-0 z-50 backdrop-blur-sm border-b border-[#374151]/50">
            <nav class="container mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16 lg:h-20">
                    <!-- Logo and Brand -->
                    <div class="flex items-center space-x-3">
                        <a href="#/" class="flex items-center space-x-2 group">
                            <div class="w-9 h-9 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-xl flex items-center justify-center shadow-lg transform group-hover:rotate-3 transition-all duration-300 group-hover:scale-105">
                                <span class="text-white font-bold text-xl">F</span>
                            </div>
                            <span class="text-xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
                                ${title}
                            </span>
                        </a>
                    </div>
                    
                    <!-- Desktop Navigation -->
                    ${showNav ? `
                        <div class="hidden md:flex items-center space-x-1 lg:space-x-2">
                            <a href="#/" class="relative px-4 py-2 text-sm font-medium text-[#E5E7EB] hover:text-[#3B82F6] transition-all duration-300 group">
                                <span>Home</span>
                                <span class="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                            </a>
                            <a href="#/dashboard" class="relative px-4 py-2 text-sm font-medium text-[#E5E7EB] hover:text-[#3B82F6] transition-all duration-300 group">
                                <span>Dashboard</span>
                                <span class="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                            </a>
                            <a href="#/history" class="relative px-4 py-2 text-sm font-medium text-[#E5E7EB] hover:text-[#3B82F6] transition-all duration-300 group">
                                <span>History</span>
                                <span class="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                            </a>
                            <a href="#/quiz" class="relative px-4 py-2 text-sm font-medium text-[#E5E7EB] hover:text-[#3B82F6] transition-all duration-300 group">
                                <span>Quiz</span>
                                <span class="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                            </a>
                            <a href="#/score" class="relative px-4 py-2 text-sm font-medium text-[#E5E7EB] hover:text-[#3B82F6] transition-all duration-300 group">
                                <span>Score</span>
                                <span class="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                            </a>
                        </div>
                    ` : ''}
                    
                    <!-- Right side buttons -->
                    <div class="flex items-center space-x-2 sm:space-x-3">
                        ${isAuthenticated ? `
                            <!-- AI Chat Toggle Button -->
                            <button id="aiChatToggle" 
                                    class="relative p-2 text-[#E5E7EB] hover:text-[#3B82F6] transition-all duration-300 rounded-lg hover:bg-[#374151] group">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                                </svg>
                                <span class="absolute -top-1 -right-1 w-2 h-2 bg-[#3B82F6] rounded-full animate-pulse"></span>
                                <span class="absolute hidden group-hover:block bg-[#111827] text-white text-xs px-2 py-1 rounded -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                                    AI Assistant
                                </span>
                            </button>
                            
                            <!-- Notifications Button with Achievement Badge -->
                            <a href="#/notifications" class="relative p-2 text-[#E5E7EB] hover:text-[#3B82F6] transition-all duration-300 rounded-lg hover:bg-[#374151] group">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                                </svg>
                                ${achievementBadge}
                                <span class="absolute hidden group-hover:block bg-[#111827] text-white text-xs px-2 py-1 rounded -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                                    Notifications
                                </span>
                            </a>
                            
                            <!-- Profile Menu -->
                            <div class="relative group">
                                <button class="flex items-center space-x-2 text-[#E5E7EB] hover:text-[#3B82F6] transition-all duration-300 p-1.5 rounded-lg hover:bg-[#374151]">
                                    <div class="w-8 h-8 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                                        <span class="text-white text-sm font-semibold">
                                            ${userName.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <span class="hidden lg:inline text-sm font-medium">${userName}</span>
                                    <svg class="w-4 h-4 hidden lg:block transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </button>
                                
                                <!-- Profile Dropdown -->
                                <div class="absolute right-0 mt-2 w-64 bg-[#1F2937] border border-[#374151] rounded-xl shadow-2xl hidden group-hover:block hover:block z-50 animate-fadeIn">
                                    <div class="px-4 py-3 border-b border-[#374151] bg-gradient-to-r from-[#1F2937] to-[#111827] rounded-t-xl">
                                        <p class="text-sm font-semibold text-[#E5E7EB]">${userName}</p>
                                        <p class="text-xs text-[#9CA3AF] truncate">${userEmail}</p>
                                    </div>
                                    <div class="py-2">
                                        <a href="#/profile" class="flex items-center space-x-3 px-4 py-2.5 text-sm text-[#E5E7EB] hover:bg-[#374151] transition-all duration-200 group">
                                            <svg class="w-4 h-4 text-[#9CA3AF] group-hover:text-[#3B82F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                            </svg>
                                            <span>My Profile</span>
                                        </a>
                                        <a href="#/settings" class="flex items-center space-x-3 px-4 py-2.5 text-sm text-[#E5E7EB] hover:bg-[#374151] transition-all duration-200 group">
                                            <svg class="w-4 h-4 text-[#9CA3AF] group-hover:text-[#3B82F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                                            </svg>
                                            <span>Settings</span>
                                        </a>
                                        <a href="#/score" class="flex items-center space-x-3 px-4 py-2.5 text-sm text-[#E5E7EB] hover:bg-[#374151] transition-all duration-200 group">
                                            <svg class="w-4 h-4 text-[#9CA3AF] group-hover:text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                                            </svg>
                                            <span>Achievements</span>
                                            ${achievementBadge}
                                        </a>
                                    </div>
                                    <hr class="border-[#374151]">
                                    <div class="py-2">
                                        <button id="logoutBtn" class="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-red-400 hover:bg-[#374151] transition-all duration-200 group">
                                            <svg class="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                                            </svg>
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ` : `
                            <a href="#/login" class="text-[#E5E7EB] hover:text-[#3B82F6] transition-all duration-300 px-4 py-2 text-sm font-medium hover:bg-[#374151] rounded-lg">
                                Login
                            </a>
                            <a href="#/register" class="bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] hover:from-[#60A5FA] hover:to-[#8B5CF6] text-white px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                                Sign Up
                            </a>
                        `}
                        
                        <!-- Mobile menu button -->
                        <button id="mobileMenuBtn" class="md:hidden p-2 text-[#E5E7EB] hover:text-[#3B82F6] transition-all duration-300 rounded-lg hover:bg-[#374151]">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        </button>
                    </div>
                </div>
                
                <!-- Mobile Navigation Menu -->
                <div id="mobileMenu" class="hidden md:hidden py-4 border-t border-[#374151] space-y-2 animate-slideDown">
                    <a href="#/" class="block py-2.5 px-4 text-[#E5E7EB] hover:text-[#3B82F6] hover:bg-[#374151] rounded-lg transition-all duration-200">Home</a>
                    <a href="#/dashboard" class="block py-2.5 px-4 text-[#E5E7EB] hover:text-[#3B82F6] hover:bg-[#374151] rounded-lg transition-all duration-200">Dashboard</a>
                    <a href="#/history" class="block py-2.5 px-4 text-[#E5E7EB] hover:text-[#3B82F6] hover:bg-[#374151] rounded-lg transition-all duration-200">History</a>
                    <a href="#/quiz" class="block py-2.5 px-4 text-[#E5E7EB] hover:text-[#3B82F6] hover:bg-[#374151] rounded-lg transition-all duration-200">Quiz</a>
                    <a href="#/score" class="block py-2.5 px-4 text-[#E5E7EB] hover:text-[#3B82F6] hover:bg-[#374151] rounded-lg transition-all duration-200">Score</a>
                    <hr class="border-[#374151] my-2">
                    <a href="#/profile" class="block py-2.5 px-4 text-[#E5E7EB] hover:text-[#3B82F6] hover:bg-[#374151] rounded-lg transition-all duration-200">My Profile</a>
                    <a href="#/settings" class="block py-2.5 px-4 text-[#E5E7EB] hover:text-[#3B82F6] hover:bg-[#374151] rounded-lg transition-all duration-200">Settings</a>
                    <a href="#/score" class="block py-2.5 px-4 text-[#E5E7EB] hover:text-amber-500 hover:bg-[#374151] rounded-lg transition-all duration-200">🏆 Achievements</a>
                    <button id="mobileLogoutBtn" class="w-full text-left py-2.5 px-4 text-red-400 hover:bg-[#374151] rounded-lg transition-all duration-200">Logout</button>
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
            const icon = mobileBtn.querySelector('svg');
            if (icon) {
                icon.style.transform = mobileMenu.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(90deg)';
            }
        });
    }
    
    // Update achievement badge count
    async function updateAchievementBadge() {
        const badge = document.getElementById('achievementBadge');
        if (!badge) return;
        
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                badge.classList.add('hidden');
                return;
            }
            
            const API_URL = window.API_URL || 'http://localhost:10000/api';
            const response = await fetch(`${API_URL}/achievements/recent`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            const data = await response.json();
            if (data.success && data.recent) {
                const oneDayAgo = new Date();
                oneDayAgo.setDate(oneDayAgo.getDate() - 1);
                const newCount = data.recent.filter(a => new Date(a.earnedAt) > oneDayAgo).length;
                
                if (newCount > 0) {
                    badge.textContent = newCount > 9 ? '9+' : newCount;
                    badge.classList.remove('hidden');
                    badge.style.animation = 'none';
                    setTimeout(() => {
                        badge.style.animation = 'pulse 1s ease-in-out 3';
                    }, 10);
                } else {
                    badge.classList.add('hidden');
                }
            }
        } catch (error) {
            console.error('Error updating achievement badge:', error);
        }
    }
    
    // Update badge on page load and periodically
    updateAchievementBadge();
    setInterval(updateAchievementBadge, 30000);
    
    // Logout buttons
    const logoutBtn = document.getElementById('logoutBtn');
    const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
    
    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userId');
        localStorage.removeItem('pendingUser');
        window.location.hash = '#/';
        setTimeout(() => {
            window.location.reload();
        }, 100);
    };
    
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
    if (mobileLogoutBtn) mobileLogoutBtn.addEventListener('click', handleLogout);
    
    // Close mobile menu when clicking a link
    const mobileLinks = mobileMenu?.querySelectorAll('a');
    mobileLinks?.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });
    
    // Scroll effect
    let lastScroll = 0;
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > lastScroll && currentScroll > 100) {
            header?.classList.add('-translate-y-full', 'transition-transform', 'duration-300');
        } else {
            header?.classList.remove('-translate-y-full');
        }
        lastScroll = currentScroll;
    });
}

// CSS animations
const headerStyles = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .animate-slideDown {
        animation: slideDown 0.3s ease-out;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .animate-fadeIn {
        animation: fadeIn 0.2s ease-out;
    }
`;

if (!document.querySelector('#header-styles')) {
    const style = document.createElement('style');
    style.id = 'header-styles';
    style.textContent = headerStyles;
    document.head.appendChild(style);
}