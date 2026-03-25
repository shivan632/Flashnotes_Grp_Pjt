// frontend/src/components/layout/Sidebar.js
import { FeedbackModal, setupFeedbackModal, openFeedbackModal } from '../feedback/FeedbackModal.js';

export function Sidebar() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userName = localStorage.getItem('userName') || 'User';
    const userEmail = localStorage.getItem('userEmail') || 'user@example.com';
    
    if (!isAuthenticated) return '';
    
    const currentPath = window.location.hash.slice(1) || '/';
    
    const menuItems = [
        {
            section: 'MAIN',
            items: [
                { path: '/', label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
                { path: '/dashboard', label: 'Dashboard', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z' },
                { path: '/history', label: 'History', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' }
            ]
        },
        {
            section: 'LEARNING',
            items: [
                { path: '/saved', label: 'Saved Notes', icon: 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z' },
                { path: '/favorites', label: 'Favorites', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
                { path: '/quiz', label: 'Quiz', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                { path: '/score', label: 'Score', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' }
            ]
        },
        {
            section: 'ACCOUNT',
            items: [
                { path: '/profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
                { path: '/settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
                { path: '/notifications', label: 'Notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' }
            ]
        }
    ];
    
    return `
        <aside class="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-[#1F2937] to-[#111827] shadow-xl z-50 overflow-y-auto border-r border-[#374151]/50 flex flex-col">
            <!-- Logo Section -->
            <div class="flex items-center justify-center h-14 border-b border-[#374151] sticky top-0 bg-gradient-to-r from-[#1F2937] to-[#111827] z-10 flex-shrink-0">
                <a href="#/" class="flex items-center space-x-2 group">
                    <div class="w-8 h-8 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-lg flex items-center justify-center shadow-md transform group-hover:rotate-3 transition-all duration-300">
                        <span class="text-white font-bold text-base">F</span>
                    </div>
                    <span class="text-base font-bold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">
                        Flashnotes
                    </span>
                </a>
            </div>
            
            <!-- User Info -->
            <div class="p-4 border-b border-[#374151] bg-gradient-to-r from-[#1F2937] to-[#111827] flex-shrink-0">
                <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-xl flex items-center justify-center shadow-md">
                        <span class="text-white font-bold text-base">${userName.charAt(0).toUpperCase()}</span>
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-[#E5E7EB] text-sm font-medium truncate">${userName}</p>
                        <p class="text-[#9CA3AF] text-xs truncate">${userEmail}</p>
                    </div>
                </div>
            </div>
            
            <!-- Navigation Menu -->
            <div class="flex-1 overflow-y-auto py-4 px-3">
                ${menuItems.map(section => `
                    <div class="mb-6">
                        <h3 class="px-2 mb-2 text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">
                            ${section.section}
                        </h3>
                        <div class="space-y-1">
                            ${section.items.map(item => {
                                const isActive = currentPath === item.path;
                                return `
                                    <a href="#${item.path}" 
                                       class="flex items-center space-x-3 px-3 py-2 text-sm transition-all duration-300 rounded-lg sidebar-link group
                                              ${isActive 
                                                ? 'bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] text-white shadow-md' 
                                                : 'text-[#E5E7EB] hover:bg-[#374151] hover:text-[#3B82F6]'}">
                                        <svg class="w-4 h-4 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-white' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${item.icon}"></path>
                                        </svg>
                                        <span class="text-sm">${item.label}</span>
                                        ${isActive ? '<span class="ml-auto w-1.5 h-1.5 bg-white rounded-full"></span>' : ''}
                                    </a>
                                `;
                            }).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <!-- Feedback Button -->
<div class="p-3 border-t border-[#374151] bg-gradient-to-r from-[#1F2937] to-[#111827] flex-shrink-0">
    <button id="feedbackSidebarBtn" 
            class="flex items-center space-x-3 px-3 py-2 text-sm transition-all duration-300 rounded-lg w-full text-left group text-[#60A5FA] hover:text-[#3B82F6] hover:bg-[#3B82F6]/10">
        <div class="w-8 h-8 bg-gradient-to-r from-[#F59E0B] to-[#F59E0B]/50 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
            </svg>
        </div>
        <span class="text-sm">Give Feedback</span>
        <span class="ml-auto text-xs text-gray-500 group-hover:text-[#3B82F6]">❤️</span>
    </button>
</div>
            
            <!-- Logout Button -->
            <div class="p-4 border-t border-[#374151] bg-gradient-to-r from-[#1F2937] to-[#111827] flex-shrink-0">
                <button id="sidebarLogoutBtn" 
                        class="flex items-center space-x-3 px-3 py-2 text-sm transition-all duration-300 rounded-lg w-full text-left group text-red-400 hover:text-red-500 hover:bg-red-500/10">
                    <svg class="w-4 h-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                    </svg>
                    <span class="text-sm">Logout</span>
                </button>
            </div>
            
            <!-- Footer Badge -->
            <div class="p-3 border-t border-[#374151] bg-[#111827]/30 flex-shrink-0">
                <div class="text-center">
                    <p class="text-xs text-[#6B7280]">v1.0.0</p>
                </div>
            </div>
        </aside>
        
        ${FeedbackModal()}
    `;
}

export function setupSidebar() {
    // Highlight current page
    document.querySelectorAll('.sidebar-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${window.location.hash}`) {
            link.classList.add('bg-gradient-to-r', 'from-[#3B82F6]', 'to-[#A78BFA]', 'text-white', 'shadow-md');
            const svg = link.querySelector('svg');
            if (svg) svg.classList.add('text-white');
        }
    });
    
    // Handle logout
    const sidebarLogoutBtn = document.getElementById('sidebarLogoutBtn');
    if (sidebarLogoutBtn) {
        sidebarLogoutBtn.addEventListener('click', handleLogout);
    }
    
    // Hover effects
    const menuItems = document.querySelectorAll('.sidebar-link, #sidebarLogoutBtn, #feedbackSidebarBtn');
    menuItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const icon = item.querySelector('svg');
            if (icon) {
                icon.style.transform = 'scale(1.1) translateX(2px)';
            }
        });
        item.addEventListener('mouseleave', () => {
            const icon = item.querySelector('svg');
            if (icon) {
                icon.style.transform = 'scale(1) translateX(0)';
            }
        });
    });
    
    // Setup feedback modal
    setupFeedbackModal();
    
    // Feedback button click
    const feedbackBtn = document.getElementById('feedbackSidebarBtn');
    if (feedbackBtn) {
        feedbackBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openFeedbackModal();
        });
    }
}

function handleLogout() {
    const logoutBtn = document.getElementById('sidebarLogoutBtn');
    if (logoutBtn) {
        logoutBtn.style.transform = 'scale(0.95)';
        logoutBtn.style.opacity = '0.5';
    }
    
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    localStorage.removeItem('pendingUser');
    localStorage.removeItem('notificationCount');
    localStorage.removeItem('aiChatOpen');
    localStorage.removeItem('sidebarCollapsed');
    
    setTimeout(() => {
        window.location.hash = '#/';
        window.location.reload();
    }, 200);
}

const sidebarStyles = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(-10px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .sidebar-link, #sidebarLogoutBtn, #feedbackSidebarBtn {
        animation: slideIn 0.2s ease-out;
        animation-fill-mode: both;
    }
`;

if (!document.querySelector('#sidebar-styles')) {
    const style = document.createElement('style');
    style.id = 'sidebar-styles';
    style.textContent = sidebarStyles;
    document.head.appendChild(style);
}