// frontend/src/components/layout/Sidebar.js
// Left Sidebar - FIXED POSITION - Always visible

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
                { 
                    path: '/dashboard', 
                    label: 'Dashboard', 
                    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
                },
                { 
                    path: '/history', 
                    label: 'History', 
                    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                }
            ]
        },
        {
            section: 'LEARNING',
            items: [
                { 
                    path: '/saved', 
                    label: 'Saved Notes', 
                    icon: 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z'
                },
                { 
                    path: '/favorites', 
                    label: 'Favorites', 
                    icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
                }
            ]
        },
        {
            section: 'ACCOUNT',
            items: [
                { 
                    path: '/profile', 
                    label: 'Profile', 
                    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                },
                { 
                    path: '/settings', 
                    label: 'Settings', 
                    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
                }
            ]
        }
    ];
    
    return `
        <aside class="fixed left-0 top-0 h-full w-64 bg-[#1F2937] shadow-2xl z-50 overflow-y-auto">
            <!-- Logo -->
            <div class="flex items-center justify-center h-16 border-b border-[#374151] sticky top-0 bg-[#1F2937]">
                <a href="#/" class="flex items-center space-x-2">
                    <div class="w-8 h-8 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-lg flex items-center justify-center">
                        <span class="text-white font-bold text-xl">F</span>
                    </div>
                    <span class="text-xl font-bold text-[#3B82F6]">Flashnotes</span>
                </a>
            </div>
            
            <!-- User Info -->
            <div class="p-4 border-b border-[#374151]">
                <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full flex items-center justify-center">
                        <span class="text-white font-semibold text-lg">${userName.charAt(0).toUpperCase()}</span>
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-[#E5E7EB] font-medium truncate">${userName}</p>
                        <p class="text-[#9CA3AF] text-sm truncate">${userEmail}</p>
                    </div>
                </div>
            </div>
            
            <!-- Navigation Menu -->
            <div class="py-4">
                ${menuItems.map(section => `
                    <div class="mb-6">
                        <h3 class="px-4 mb-2 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">
                            ${section.section}
                        </h3>
                        <div class="space-y-1">
                            ${section.items.map(item => {
                                const isActive = currentPath === item.path;
                                return `
                                    <a href="#${item.path}" 
                                       class="flex items-center space-x-3 px-4 py-2 text-sm transition-all rounded-lg mx-2 sidebar-link
                                              ${isActive 
                                                ? 'bg-[#3B82F6] text-white' 
                                                : 'text-[#E5E7EB] hover:bg-[#374151] hover:text-[#3B82F6]'}">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${item.icon}"></path>
                                        </svg>
                                        <span>${item.label}</span>
                                    </a>
                                `;
                            }).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        </aside>
    `;
}

export function setupSidebar() {
    // Highlight current page
    document.querySelectorAll('.sidebar-link').forEach(link => {
        if (link.getAttribute('href') === `#${window.location.hash}`) {
            link.classList.add('bg-[#3B82F6]', 'text-white');
        }
    });
}