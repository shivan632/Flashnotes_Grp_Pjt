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
                { path: '/saved', label: 'Saved Notes', icon: 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z' },
                { path: '/score', label: 'Score', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' }
            ]
        },
        {
            section: 'LEARNING',
            items: [
                { path: '/quiz', label: 'Quiz', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                {path: '/voice-notes',label: 'Voice Notes',icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z',badge: 'NEW'},
                { path: '/pdf-reader', label: 'PDF Reader', icon: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z', badge: 'NEW' },
                { path: '/notes-generator', label: 'AI Notes', icon: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25', badge: 'NEW' },
                { path: '/code-editor', label: 'Code Editor', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
                { path: '/roadmap', label: 'Generate Roadmap', icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7', badge: 'NEW' },
                { path: '/my-roadmaps', label: 'My Roadmaps', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' }
            ]
        },
        {
            section: 'ACCOUNT',
            items: [
                { path: '/profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
                { path: '/notifications', label: 'Notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9', badge: 'UW' },
                { path: '/settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }
            ]
        }
    ];
    
    return `
        <aside class="fixed left-0 top-0 h-full w-64 bg-gradient-to-br from-[#1F2937] via-[#1A2436] to-[#111827] shadow-2xl z-50 overflow-y-auto border-r border-[#374151]/50 flex flex-col backdrop-blur-sm">
            <!-- Logo Section with 3D effect -->
            <div class="relative flex items-center justify-center h-14 border-b border-[#374151] sticky top-0 bg-gradient-to-r from-[#1F2937] to-[#111827] z-10 flex-shrink-0 overflow-hidden group">
                <div class="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-purple-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <a href="#/" class="flex items-center space-x-2 group">
                    <div class="w-8 h-8 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-lg flex items-center justify-center shadow-lg transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-300">
                        <span class="text-white font-bold text-base">F</span>
                    </div>
                    <span class="text-base font-bold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent group-hover:scale-105 transition-transform">
                        Flashnotes
                    </span>
                </a>
            </div>
            
            <!-- User Info with 3D hover -->
            <div class="p-4 border-b border-[#374151] bg-gradient-to-r from-[#1F2937] to-[#111827] flex-shrink-0 group">
                <div class="flex items-center space-x-3 transform group-hover:scale-[1.02] transition-all duration-300">
                    <div class="w-10 h-10 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-300">
                        <span class="text-white font-bold text-base">${userName.charAt(0).toUpperCase()}</span>
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-[#E5E7EB] text-sm font-medium truncate group-hover:text-[#3B82F6] transition-colors">${userName}</p>
                        <p class="text-[#9CA3AF] text-xs truncate">${userEmail}</p>
                    </div>
                </div>
            </div>
            
            <!-- Navigation Menu with 3D animations -->
            <div class="flex-1 overflow-y-auto py-4 px-3">
                ${menuItems.map(section => `
                    <div class="mb-6">
                        <h3 class="px-2 mb-2 text-xs font-bold text-[#9CA3AF] uppercase tracking-wider flex items-center gap-2">
                            <span class="w-1 h-1 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full"></span>
                            ${section.section}
                            <span class="w-1 h-1 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full"></span>
                        </h3>
                        <div class="space-y-1">
                            ${section.items.map(item => {
                                const isActive = currentPath === item.path;
                                return `
                                    <a href="#${item.path}" 
                                       class="relative flex items-center space-x-3 px-3 py-2 text-sm transition-all duration-300 rounded-lg sidebar-link group overflow-hidden
                                              ${isActive 
                                                ? 'bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] text-white shadow-lg' 
                                                : 'text-[#E5E7EB] hover:bg-[#374151] hover:text-[#3B82F6] hover:translate-x-1'}"
                                       style="transform-style: preserve-3d;">
                                        <div class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ${isActive ? 'hidden' : ''}"></div>
                                        <svg class="w-4 h-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 ${isActive ? 'text-white' : 'group-hover:text-[#3B82F6]'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${item.icon}"></path>
                                        </svg>
                                        <span class="text-sm">${item.label}</span>
                                        ${item.badge ? `<span class="ml-auto text-xs px-1.5 py-0.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full animate-pulse shadow-md">${item.badge}</span>` : ''}
                                        ${isActive ? '<span class="ml-auto w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>' : ''}
                                    </a>
                                `;
                            }).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <!-- Feedback Button with 3D effect -->
            <div class="p-3 border-t border-[#374151] bg-gradient-to-r from-[#1F2937] to-[#111827] flex-shrink-0 group">
                <button id="feedbackSidebarBtn" 
                        class="relative flex items-center space-x-3 px-3 py-2 text-sm transition-all duration-300 rounded-lg w-full text-left group/btn text-[#60A5FA] hover:text-[#3B82F6] hover:bg-[#3B82F6]/10 overflow-hidden">
                    <div class="absolute inset-0 bg-gradient-to-r from-yellow-500/0 via-yellow-500/10 to-yellow-500/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                    <div class="w-8 h-8 bg-gradient-to-r from-[#F59E0B] to-[#F59E0B]/50 rounded-lg flex items-center justify-center shadow-md transform group-hover/btn:scale-110 group-hover/btn:rotate-6 transition-all duration-300">
                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                        </svg>
                    </div>
                    <span class="text-sm">Give Feedback</span>
                    <span class="ml-auto text-xs text-gray-500 group-hover/btn:text-[#3B82F6] group-hover/btn:scale-125 transition-all">❤️</span>
                </button>
            </div>
            
            <!-- Logout Button with 3D effect -->
            <div class="p-4 border-t border-[#374151] bg-gradient-to-r from-[#1F2937] to-[#111827] flex-shrink-0 group">
                <button id="sidebarLogoutBtn" 
                        class="relative flex items-center space-x-3 px-3 py-2 text-sm transition-all duration-300 rounded-lg w-full text-left group/btn text-red-400 hover:text-red-500 hover:bg-red-500/10 overflow-hidden">
                    <div class="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/10 to-red-500/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                    <svg class="w-4 h-4 transition-all duration-300 group-hover/btn:scale-110 group-hover/btn:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                    </svg>
                    <span class="text-sm">Logout</span>
                    <span class="ml-auto text-xs opacity-0 group-hover/btn:opacity-100 transition-all group-hover/btn:translate-x-1">→</span>
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
    // Highlight current page with animation
    document.querySelectorAll('.sidebar-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${window.location.hash}`) {
            link.classList.add('bg-gradient-to-r', 'from-[#3B82F6]', 'to-[#A78BFA]', 'text-white', 'shadow-lg');
            const svg = link.querySelector('svg');
            if (svg) svg.classList.add('text-white');
        }
    });
    
    // Handle logout with animation
    const sidebarLogoutBtn = document.getElementById('sidebarLogoutBtn');
    if (sidebarLogoutBtn) {
        sidebarLogoutBtn.addEventListener('click', handleLogout);
    }
    
    // Enhanced 3D hover effects
    const menuItems = document.querySelectorAll('.sidebar-link, #sidebarLogoutBtn, #feedbackSidebarBtn');
    menuItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const icon = item.querySelector('svg');
            if (icon) {
                icon.style.transform = 'scale(1.15) translateX(3px) rotate(6deg)';
            }
        });
        item.addEventListener('mouseleave', () => {
            const icon = item.querySelector('svg');
            if (icon) {
                icon.style.transform = 'scale(1) translateX(0) rotate(0deg)';
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
        logoutBtn.style.transition = 'all 0.3s ease';
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

// Enhanced CSS with 3D animations
const sidebarStyles = `
    @keyframes slideIn3D {
        from {
            opacity: 0;
            transform: translateX(-20px) rotateY(30deg);
        }
        to {
            opacity: 1;
            transform: translateX(0) rotateY(0deg);
        }
    }
    
    @keyframes glowPulse {
        0%, 100% {
            box-shadow: 0 0 5px rgba(59, 130, 246, 0.3);
        }
        50% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.6);
        }
    }
    
    @keyframes shine {
        0% {
            transform: translateX(-100%);
        }
        100% {
            transform: translateX(100%);
        }
    }
    
    .sidebar-link, #sidebarLogoutBtn, #feedbackSidebarBtn {
        animation: slideIn3D 0.3s ease-out forwards;
        transform-style: preserve-3d;
        backface-visibility: hidden;
    }
    
    .sidebar-link:nth-child(1) { animation-delay: 0.05s; }
    .sidebar-link:nth-child(2) { animation-delay: 0.1s; }
    .sidebar-link:nth-child(3) { animation-delay: 0.15s; }
    .sidebar-link:nth-child(4) { animation-delay: 0.2s; }
    .sidebar-link:nth-child(5) { animation-delay: 0.25s; }
    .sidebar-link:nth-child(6) { animation-delay: 0.3s; }
    
    .sidebar-link:hover {
        transform: translateX(4px) translateZ(8px);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
    }
    
    /* Custom scrollbar */
    .sidebar-scroll::-webkit-scrollbar {
        width: 4px;
    }
    
    .sidebar-scroll::-webkit-scrollbar-track {
        background: #1F2937;
    }
    
    .sidebar-scroll::-webkit-scrollbar-thumb {
        background: linear-gradient(135deg, #3B82F6, #A78BFA);
        border-radius: 10px;
    }
`;

if (!document.querySelector('#sidebar-styles')) {
    const style = document.createElement('style');
    style.id = 'sidebar-styles';
    style.textContent = sidebarStyles;
    document.head.appendChild(style);
}