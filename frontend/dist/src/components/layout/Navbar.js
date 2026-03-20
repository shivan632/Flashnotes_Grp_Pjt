// frontend/src/components/layout/Navbar.js
// Complete Navbar with Dashboard, Saved List, Quiz, Score, Profile, and Notifications

export function Navbar() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userName = localStorage.getItem('userName') || 'User';
    const userEmail = localStorage.getItem('userEmail') || '';
    const userAvatar = localStorage.getItem('userAvatar') || userName.charAt(0).toUpperCase();
    
    // Get notification count from localStorage or default to 0
    const notificationCount = parseInt(localStorage.getItem('notificationCount') || '3');
    
    return `
        <nav class="bg-[#1F2937] shadow-lg sticky top-0 z-50 border-b border-[#374151]">
            <div class="container mx-auto px-4">
                <div class="flex items-center justify-between h-16">
                    <!-- Logo and Brand -->
                    <div class="flex items-center space-x-6">
                        <a href="#/" class="flex items-center space-x-2 group">
                            <div class="w-8 h-8 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-lg flex items-center justify-center transform group-hover:rotate-3 transition-transform">
                                <span class="text-white font-bold text-xl">F</span>
                            </div>
                            <span class="text-xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">
                                Flashnotes
                            </span>
                        </a>
                        
                        <!-- Main Navigation Links - Visible when authenticated -->
                        ${isAuthenticated ? `
                            <div class="hidden md:flex items-center space-x-1">
                                <a href="#/dashboard" 
                                   class="nav-link px-4 py-2 text-sm font-medium rounded-lg transition-all
                                          ${window.location.hash === '#/dashboard' || window.location.hash === '#/' 
                                            ? 'bg-[#3B82F6] text-white' 
                                            : 'text-[#E5E7EB] hover:bg-[#374151] hover:text-[#3B82F6]'}">
                                    <span class="flex items-center space-x-2">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                                        </svg>
                                        <span>Dashboard</span>
                                    </span>
                                </a>
                                
                                <a href="#/saved" 
                                   class="nav-link px-4 py-2 text-sm font-medium rounded-lg transition-all
                                          ${window.location.hash === '#/saved' 
                                            ? 'bg-[#3B82F6] text-white' 
                                            : 'text-[#E5E7EB] hover:bg-[#374151] hover:text-[#3B82F6]'}">
                                    <span class="flex items-center space-x-2">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                                        </svg>
                                        <span>Saved List</span>
                                    </span>
                                </a>
                                
                                <a href="#/quiz" 
                                   class="nav-link px-4 py-2 text-sm font-medium rounded-lg transition-all
                                          ${window.location.hash === '#/quiz' 
                                            ? 'bg-[#3B82F6] text-white' 
                                            : 'text-[#E5E7EB] hover:bg-[#374151] hover:text-[#3B82F6]'}">
                                    <span class="flex items-center space-x-2">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                        <span>Quiz</span>
                                    </span>
                                </a>
                                
                                <a href="#/score" 
                                   class="nav-link px-4 py-2 text-sm font-medium rounded-lg transition-all
                                          ${window.location.hash === '#/score' 
                                            ? 'bg-[#3B82F6] text-white' 
                                            : 'text-[#E5E7EB] hover:bg-[#374151] hover:text-[#3B82F6]'}">
                                    <span class="flex items-center space-x-2">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                                        </svg>
                                        <span>Score</span>
                                    </span>
                                </a>
                            </div>
                        ` : ''}
                    </div>
                    
                    <!-- Right side icons and user menu -->
                    <div class="flex items-center space-x-3">
                        ${isAuthenticated ? `
                            <!-- AI Chat Toggle Button -->
                            <button id="aiChatToggle" 
                                    class="relative p-2 text-[#E5E7EB] hover:text-[#3B82F6] transition-colors rounded-lg hover:bg-[#374151] group"
                                    title="AI Assistant">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                                </svg>
                                <span class="absolute -top-1 -right-1 w-2 h-2 bg-[#3B82F6] rounded-full animate-pulse"></span>
                                <span class="absolute hidden group-hover:block bg-[#1F2937] text-white text-xs px-2 py-1 rounded -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                                    AI Assistant
                                </span>
                            </button>
                            
                            <!-- Notification Icon with Counter -->
                            <div class="relative group">
                                <button id="notificationBtn" 
                                        class="relative p-2 text-[#E5E7EB] hover:text-[#3B82F6] transition-colors rounded-lg hover:bg-[#374151]"
                                        title="Notifications">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                                    </svg>
                                    ${notificationCount > 0 ? `
                                        <span class="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-xs rounded-full flex items-center justify-center px-1 animate-pulse">
                                            ${notificationCount > 9 ? '9+' : notificationCount}
                                        </span>
                                    ` : ''}
                                </button>
                                
                                <!-- Notification Dropdown -->
                                <div id="notificationDropdown" 
                                     class="absolute right-0 mt-2 w-80 bg-[#1F2937] border border-[#374151] rounded-lg shadow-xl hidden group-hover:block hover:block z-50">
                                    <div class="p-3 border-b border-[#374151] flex justify-between items-center">
                                        <h3 class="font-semibold text-[#E5E7EB]">Notifications</h3>
                                        <button id="markAllRead" class="text-xs text-[#60A5FA] hover:text-[#3B82F6]">Mark all as read</button>
                                    </div>
                                    <div class="max-h-96 overflow-y-auto" id="notificationList">
                                        ${generateNotifications()}
                                    </div>
                                    <div class="p-2 border-t border-[#374151] text-center">
                                        <a href="#/notifications" class="text-sm text-[#60A5FA] hover:text-[#3B82F6]">View all</a>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Profile Menu -->
                            <div class="relative group">
                                <button class="flex items-center space-x-2 text-[#E5E7EB] hover:text-[#3B82F6] transition-colors p-1 rounded-lg hover:bg-[#374151]">
                                    <div class="w-8 h-8 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full flex items-center justify-center">
                                        <span class="text-white text-sm font-semibold">${userAvatar}</span>
                                    </div>
                                    <span class="hidden lg:inline text-sm font-medium">${userName}</span>
                                    <svg class="w-4 h-4 hidden lg:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </button>
                                
                                <!-- Profile Dropdown -->
                                <div class="absolute right-0 mt-2 w-56 bg-[#1F2937] border border-[#374151] rounded-lg shadow-xl hidden group-hover:block hover:block z-50">
                                    <div class="px-4 py-3 border-b border-[#374151]">
                                        <p class="text-sm text-[#E5E7EB] font-medium">${userName}</p>
                                        <p class="text-xs text-[#9CA3AF] truncate">${userEmail}</p>
                                    </div>
                                    <a href="#/profile" class="flex items-center space-x-2 px-4 py-2 text-sm text-[#E5E7EB] hover:bg-[#374151] transition-colors">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                        </svg>
                                        <span>My Profile</span>
                                    </a>
                                    <a href="#/settings" class="flex items-center space-x-2 px-4 py-2 text-sm text-[#E5E7EB] hover:bg-[#374151] transition-colors">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
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
                            <a href="#/login" class="text-[#E5E7EB] hover:text-[#3B82F6] px-4 py-2 text-sm font-medium">Login</a>
                            <a href="#/register" class="bg-[#3B82F6] hover:bg-[#60A5FA] text-white px-4 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105">Sign Up</a>
                        `}
                        
                        <!-- Mobile menu button -->
                        <button id="mobileMenuBtn" class="md:hidden text-[#E5E7EB] hover:text-[#3B82F6] transition-colors p-2">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        </button>
                    </div>
                </div>
                
                <!-- Mobile Navigation Menu -->
                <div id="mobileMenu" class="hidden md:hidden py-4 border-t border-[#374151]">
                    ${isAuthenticated ? `
                        <a href="#/dashboard" class="block py-2 px-4 text-[#E5E7EB] hover:text-[#3B82F6] transition-colors">Dashboard</a>
                        <a href="#/saved" class="block py-2 px-4 text-[#E5E7EB] hover:text-[#3B82F6] transition-colors">Saved List</a>
                        <a href="#/quiz" class="block py-2 px-4 text-[#E5E7EB] hover:text-[#3B82F6] transition-colors">Quiz</a>
                        <a href="#/score" class="block py-2 px-4 text-[#E5E7EB] hover:text-[#3B82F6] transition-colors">Score</a>
                        <hr class="border-[#374151] my-2">
                        <a href="#/profile" class="block py-2 px-4 text-[#E5E7EB] hover:text-[#3B82F6] transition-colors">My Profile</a>
                        <a href="#/settings" class="block py-2 px-4 text-[#E5E7EB] hover:text-[#3B82F6] transition-colors">Settings</a>
                        <button id="mobileLogoutBtn" class="w-full text-left py-2 px-4 text-red-400 hover:bg-[#374151] transition-colors">Logout</button>
                    ` : `
                        <a href="#/login" class="block py-2 px-4 text-[#E5E7EB] hover:text-[#3B82F6] transition-colors">Login</a>
                        <a href="#/register" class="block py-2 px-4 text-[#3B82F6] font-medium">Register</a>
                    `}
                </div>
            </div>
        </nav>
    `;
}

// Helper function to generate notifications
function generateNotifications() {
    const notifications = [
        {
            id: 1,
            title: 'Quiz Completed',
            message: 'You scored 85% on the Operating System quiz!',
            time: '5 minutes ago',
            read: false,
            icon: '🎯'
        },
        {
            id: 2,
            title: 'New Achievement',
            message: 'Congratulations! You earned the "Quick Learner" badge',
            time: '1 hour ago',
            read: false,
            icon: '🏆'
        },
        {
            id: 3,
            title: 'Study Reminder',
            message: 'Time to review your saved notes on Machine Learning',
            time: '2 hours ago',
            read: false,
            icon: '📚'
        },
        {
            id: 4,
            title: 'AI Assistant',
            message: 'New AI-generated questions available for Python',
            time: '1 day ago',
            read: true,
            icon: '🤖'
        }
    ];
    
    return notifications.map(notif => `
        <div class="notification-item p-3 hover:bg-[#374151] transition-colors border-b border-[#374151] last:border-0 ${!notif.read ? 'bg-[#1F2937]' : ''}" data-id="${notif.id}">
            <div class="flex items-start space-x-3">
                <div class="text-xl">${notif.icon}</div>
                <div class="flex-1">
                    <p class="text-sm font-medium text-[#E5E7EB]">${notif.title}</p>
                    <p class="text-xs text-[#9CA3AF] mt-1">${notif.message}</p>
                    <p class="text-xs text-[#60A5FA] mt-1">${notif.time}</p>
                </div>
                ${!notif.read ? '<span class="w-2 h-2 bg-[#3B82F6] rounded-full mt-2"></span>' : ''}
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
        });
    }
    
    // Logout buttons
    const logoutBtn = document.getElementById('logoutBtn');
    const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
    
    const handleLogout = () => {
        localStorage.clear();
        window.location.hash = '#/';
        window.location.reload();
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
        item.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const id = item.dataset.id;
            markNotificationRead(id);
        });
    });
}

// Notification functions - FIXED VERSION
function setupNotifications() {
    // Initialize notification count if not set
    if (!localStorage.getItem('notificationCount')) {
        localStorage.setItem('notificationCount', '4');
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        const notifBtn = document.getElementById('notificationBtn');
        const notifDropdown = document.getElementById('notificationDropdown');
        
        if (notifBtn && notifDropdown && !notifBtn.contains(e.target) && !notifDropdown.contains(e.target)) {
            notifDropdown.classList.add('hidden');
        }
    });
    
    // Toggle dropdown on button click
    const notifBtn = document.getElementById('notificationBtn');
    const notifDropdown = document.getElementById('notificationDropdown');
    
    if (notifBtn && notifDropdown) {
        notifBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            notifDropdown.classList.toggle('hidden');
        });
    }
}

function markNotificationRead(id) {
    console.log('Marking notification as read:', id);
    
    // Update notification count
    const currentCount = parseInt(localStorage.getItem('notificationCount') || '0');
    if (currentCount > 0) {
        localStorage.setItem('notificationCount', (currentCount - 1).toString());
    }
    
    // Update the badge - FIXED SELECTOR
    const notifBtn = document.getElementById('notificationBtn');
    if (notifBtn) {
        const existingBadge = notifBtn.querySelector('span.bg-red-500');
        if (existingBadge) {
            const newCount = currentCount - 1;
            if (newCount > 0) {
                existingBadge.textContent = newCount > 9 ? '9+' : newCount;
            } else {
                existingBadge.remove();
            }
        }
    }
    
    // Mark this notification as read in UI
    const notificationItem = document.querySelector(`.notification-item[data-id="${id}"]`);
    if (notificationItem) {
        notificationItem.classList.remove('bg-[#1F2937]');
        const unreadDot = notificationItem.querySelector('span.w-2');
        if (unreadDot) unreadDot.remove();
    }
}

function markAllNotificationsRead() {
    console.log('Marking all notifications as read');
    localStorage.setItem('notificationCount', '0');
    
    // Remove badge - FIXED
    const notifBtn = document.getElementById('notificationBtn');
    if (notifBtn) {
        const badge = notifBtn.querySelector('span.bg-red-500');
        if (badge) badge.remove();
    }
    
    // Remove all unread indicators from notifications
    document.querySelectorAll('.notification-item').forEach(item => {
        item.classList.remove('bg-[#1F2937]');
        const dot = item.querySelector('span.w-2');
        if (dot) dot.remove();
    });
    
    // Hide dropdown
    const dropdown = document.getElementById('notificationDropdown');
    if (dropdown) dropdown.classList.add('hidden');
}