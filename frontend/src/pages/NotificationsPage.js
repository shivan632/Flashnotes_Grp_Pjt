// frontend/src/pages/NotificationsPage.js
// Notifications Page - View all notifications with enhanced UI

import { Sidebar } from '../components/layout/Sidebar.js';
import { AIChatSidebar } from '../components/layout/AIChatSidebar.js';
import { Header } from '../components/common/Header.js';

export function NotificationsPage() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    if (!isAuthenticated) {
        window.location.hash = '#/login';
        return '';
    }
    
    // Get notifications from localStorage or use defaults
    const notifications = JSON.parse(localStorage.getItem('notifications')) || [
        {
            id: 1,
            title: 'Quiz Completed',
            message: 'You scored 85% on the Operating System quiz!',
            time: '2024-03-18T10:30:00',
            read: false,
            icon: '🎯',
            type: 'quiz'
        },
        {
            id: 2,
            title: 'New Achievement',
            message: 'Congratulations! You earned the "Quick Learner" badge',
            time: '2024-03-18T09:15:00',
            read: false,
            icon: '🏆',
            type: 'achievement'
        },
        {
            id: 3,
            title: 'Study Reminder',
            message: 'Time to review your saved notes on Machine Learning',
            time: '2024-03-17T14:20:00',
            read: true,
            icon: '📚',
            type: 'reminder'
        },
        {
            id: 4,
            title: 'AI Assistant',
            message: 'New AI-generated questions available for Python',
            time: '2024-03-16T11:45:00',
            read: true,
            icon: '🤖',
            type: 'ai'
        }
    ];
    
    const unreadCount = notifications.filter(n => !n.read).length;
    const totalCount = notifications.length;
    
    return `
        <div class="min-h-screen bg-gradient-to-b from-[#111827] to-[#0F172A] relative">
            ${Sidebar()}
            ${AIChatSidebar()}
            <div id="mainContent" class="min-h-screen transition-all duration-300" 
                 style="margin-left: 256px; margin-right: 384px; width: calc(100% - 640px);">
                ${Header({ title: 'Notifications' })}
                <main class="container mx-auto px-4 py-8">
                    <!-- Header with Stats -->
                    <div class="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fadeInUp">
                        <div>
                            <h1 class="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">
                                Notifications
                            </h1>
                            <p class="text-[#9CA3AF] mt-2">Stay updated with your learning progress</p>
                        </div>
                        <div class="flex gap-3">
                            ${unreadCount > 0 ? `
                                <button id="markAllReadBtn" class="group relative overflow-hidden bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] hover:from-[#60A5FA] hover:to-[#8B5CF6] text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-lg">
                                    <span class="relative z-10 flex items-center gap-2">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                        Mark All as Read
                                    </span>
                                    <div class="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </button>
                            ` : ''}
                            <div class="bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg">
                                ${totalCount} total
                            </div>
                        </div>
                    </div>
                    
                    <!-- Stats Cards -->
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                        <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-4 border border-[#374151] animate-fadeInUp" style="animation-delay: 0.05s">
                            <div class="text-2xl font-bold text-[#3B82F6]">${totalCount}</div>
                            <div class="text-xs text-[#9CA3AF] mt-1">Total</div>
                        </div>
                        <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-4 border border-[#374151] animate-fadeInUp" style="animation-delay: 0.1s">
                            <div class="text-2xl font-bold text-[#3B82F6]">${unreadCount}</div>
                            <div class="text-xs text-[#9CA3AF] mt-1">Unread</div>
                        </div>
                        <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-4 border border-[#374151] animate-fadeInUp" style="animation-delay: 0.15s">
                            <div class="text-2xl font-bold text-[#3B82F6]">${notifications.filter(n => n.type === 'quiz').length}</div>
                            <div class="text-xs text-[#9CA3AF] mt-1">Quiz</div>
                        </div>
                        <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-4 border border-[#374151] animate-fadeInUp" style="animation-delay: 0.2s">
                            <div class="text-2xl font-bold text-[#3B82F6]">${notifications.filter(n => n.type === 'achievement').length}</div>
                            <div class="text-xs text-[#9CA3AF] mt-1">Achievements</div>
                        </div>
                    </div>
                    
                    <!-- Notification Filters with Icons -->
                    <div class="flex flex-wrap gap-2 mb-6 animate-fadeInUp" style="animation-delay: 0.25s">
                        <button class="filter-btn active px-4 py-2 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] text-white rounded-xl text-sm font-medium flex items-center gap-2 shadow-lg" data-filter="all">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                            All
                        </button>
                        <button class="filter-btn px-4 py-2 bg-[#1F2937] text-[#E5E7EB] hover:bg-[#374151] rounded-xl text-sm font-medium flex items-center gap-2 transition-all duration-300" data-filter="unread">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                            </svg>
                            Unread
                        </button>
                        <button class="filter-btn px-4 py-2 bg-[#1F2937] text-[#E5E7EB] hover:bg-[#374151] rounded-xl text-sm font-medium flex items-center gap-2 transition-all duration-300" data-filter="quiz">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            Quiz
                        </button>
                        <button class="filter-btn px-4 py-2 bg-[#1F2937] text-[#E5E7EB] hover:bg-[#374151] rounded-xl text-sm font-medium flex items-center gap-2 transition-all duration-300" data-filter="achievement">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                            </svg>
                            Achievements
                        </button>
                        <button class="filter-btn px-4 py-2 bg-[#1F2937] text-[#E5E7EB] hover:bg-[#374151] rounded-xl text-sm font-medium flex items-center gap-2 transition-all duration-300" data-filter="reminder">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            Reminders
                        </button>
                    </div>
                    
                    <!-- Notifications List -->
                    <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl shadow-xl border border-[#374151] overflow-hidden animate-fadeInUp" style="animation-delay: 0.3s">
                        <div class="notifications-container max-h-[600px] overflow-y-auto custom-scrollbar">
                            ${notifications.length > 0 ? notifications.map((notif, index) => `
                                <div class="notification-item group relative p-5 border-b border-[#374151] last:border-0 transition-all duration-300 hover:bg-[#1F2937] ${!notif.read ? 'bg-[#111827]' : ''}" 
                                     data-id="${notif.id}" 
                                     data-type="${notif.type}" 
                                     data-read="${notif.read}"
                                     style="animation: slideInRight 0.3s ease-out ${index * 0.05}s forwards">
                                    <div class="flex items-start gap-4">
                                        <!-- Icon with Animation -->
                                        <div class="relative">
                                            <div class="absolute inset-0 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-xl blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                                            <div class="relative w-12 h-12 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                                <span class="text-2xl">${notif.icon}</span>
                                            </div>
                                        </div>
                                        
                                        <!-- Content -->
                                        <div class="flex-1">
                                            <div class="flex flex-wrap justify-between items-start gap-2">
                                                <h3 class="font-semibold text-[#E5E7EB] group-hover:text-[#3B82F6] transition-colors">
                                                    ${escapeHtml(notif.title)}
                                                </h3>
                                                <div class="flex items-center gap-2">
                                                    <span class="text-xs text-[#9CA3AF] flex items-center gap-1">
                                                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                        </svg>
                                                        ${formatDate(notif.time)}
                                                    </span>
                                                    <span class="text-xs px-2 py-0.5 bg-[#374151] rounded-full text-[#9CA3AF] capitalize">${notif.type}</span>
                                                </div>
                                            </div>
                                            <p class="text-sm text-[#9CA3AF] mt-2 leading-relaxed">${escapeHtml(notif.message)}</p>
                                            <div class="flex gap-4 mt-3">
                                                ${!notif.read ? `
                                                    <button class="mark-read text-xs text-[#60A5FA] hover:text-[#3B82F6] transition-all duration-300 flex items-center gap-1 group/btn">
                                                        <svg class="w-3 h-3 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                                        </svg>
                                                        Mark as read
                                                    </button>
                                                ` : ''}
                                                <button class="delete-notification text-xs text-red-400 hover:text-red-500 transition-all duration-300 flex items-center gap-1 group/btn">
                                                    <svg class="w-3 h-3 group-hover/btn:scale-110 group-hover/btn:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                    </svg>
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <!-- Unread Indicator -->
                                        ${!notif.read ? `
                                            <div class="flex-shrink-0">
                                                <span class="inline-block w-2.5 h-2.5 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full animate-pulse"></span>
                                            </div>
                                        ` : ''}
                                    </div>
                                    
                                    <!-- Hover Border Effect -->
                                    <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                                </div>
                            `).join('') : `
                                <div class="text-center py-16">
                                    <div class="relative">
                                        <div class="absolute inset-0 flex items-center justify-center">
                                            <div class="w-24 h-24 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full opacity-10 blur-xl"></div>
                                        </div>
                                        <svg class="w-20 h-20 mx-auto mb-4 text-[#4B5563] relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                                        </svg>
                                        <p class="text-[#9CA3AF] text-lg mb-2">No notifications</p>
                                        <p class="text-sm text-[#6B7280]">You're all caught up! 🎉</p>
                                        <div class="mt-4 flex justify-center gap-2">
                                            <div class="w-1.5 h-1.5 bg-[#3B82F6] rounded-full animate-pulse"></div>
                                            <div class="w-1.5 h-1.5 bg-[#60A5FA] rounded-full animate-pulse delay-100"></div>
                                            <div class="w-1.5 h-1.5 bg-[#A78BFA] rounded-full animate-pulse delay-200"></div>
                                        </div>
                                    </div>
                                </div>
                            `}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    `;
}

// Helper functions
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Setup notifications page events
export function setupNotificationsPage() {
    // Mark all as read
    const markAllBtn = document.getElementById('markAllReadBtn');
    if (markAllBtn) {
        markAllBtn.addEventListener('click', () => {
            document.querySelectorAll('.notification-item[data-read="false"]').forEach(item => {
                item.classList.remove('bg-[#111827]');
                item.setAttribute('data-read', 'true');
                const dot = item.querySelector('span.animate-pulse');
                if (dot) dot.remove();
                const markBtn = item.querySelector('.mark-read');
                if (markBtn) markBtn.remove();
            });
            localStorage.setItem('notificationCount', '0');
            
            // Show success message
            const successMsg = document.createElement('div');
            successMsg.className = 'fixed bottom-4 right-4 bg-green-500/20 border border-green-500 text-green-400 px-4 py-2 rounded-lg shadow-xl z-50 animate-fadeInOut';
            successMsg.innerHTML = 'All notifications marked as read';
            document.body.appendChild(successMsg);
            setTimeout(() => successMsg.remove(), 2000);
        });
    }
    
    // Mark individual as read
    document.querySelectorAll('.mark-read').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const id = btn.dataset.id;
            const item = document.querySelector(`.notification-item[data-id="${id}"]`);
            if (item) {
                item.classList.remove('bg-[#111827]');
                item.setAttribute('data-read', 'true');
                const dot = item.querySelector('span.animate-pulse');
                if (dot) dot.remove();
                btn.remove();
                
                // Update count
                const currentCount = parseInt(localStorage.getItem('notificationCount') || '0');
                if (currentCount > 0) {
                    localStorage.setItem('notificationCount', (currentCount - 1).toString());
                }
            }
        });
    });
    
    // Delete notification
    document.querySelectorAll('.delete-notification').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const id = btn.dataset.id;
            const item = document.querySelector(`.notification-item[data-id="${id}"]`);
            if (item) {
                const wasUnread = item.getAttribute('data-read') === 'false';
                item.remove();
                
                if (wasUnread) {
                    const currentCount = parseInt(localStorage.getItem('notificationCount') || '0');
                    if (currentCount > 0) {
                        localStorage.setItem('notificationCount', (currentCount - 1).toString());
                    }
                }
                
                // Show delete confirmation
                const deleteMsg = document.createElement('div');
                deleteMsg.className = 'fixed bottom-4 right-4 bg-red-500/20 border border-red-500 text-red-400 px-4 py-2 rounded-lg shadow-xl z-50 animate-fadeInOut';
                deleteMsg.innerHTML = 'Notification deleted';
                document.body.appendChild(deleteMsg);
                setTimeout(() => deleteMsg.remove(), 1500);
            }
        });
    });
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            document.querySelectorAll('.filter-btn').forEach(b => {
                b.classList.remove('bg-gradient-to-r', 'from-[#3B82F6]', 'to-[#A78BFA]', 'text-white', 'shadow-lg');
                b.classList.add('bg-[#1F2937]', 'text-[#E5E7EB]');
            });
            btn.classList.add('bg-gradient-to-r', 'from-[#3B82F6]', 'to-[#A78BFA]', 'text-white', 'shadow-lg');
            btn.classList.remove('bg-[#1F2937]', 'text-[#E5E7EB]');
            
            const filter = btn.dataset.filter;
            
            document.querySelectorAll('.notification-item').forEach(item => {
                if (filter === 'all') {
                    item.style.display = 'block';
                } else if (filter === 'unread') {
                    item.style.display = item.dataset.read === 'false' ? 'block' : 'none';
                } else {
                    item.style.display = item.dataset.type === filter ? 'block' : 'none';
                }
            });
        });
    });
}

// Add CSS animations
const notificationsPageStyles = `
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
    
    @keyframes fadeInOut {
        0% {
            opacity: 0;
            transform: translateY(10px);
        }
        15% {
            opacity: 1;
            transform: translateY(0);
        }
        85% {
            opacity: 1;
            transform: translateY(0);
        }
        100% {
            opacity: 0;
            transform: translateY(-10px);
        }
    }
    
    .notification-item {
        opacity: 0;
    }
    
    .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-track {
        background: #1F2937;
        border-radius: 10px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #3B82F6;
        border-radius: 10px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #60A5FA;
    }
`;

if (!document.querySelector('#notifications-page-styles')) {
    const style = document.createElement('style');
    style.id = 'notifications-page-styles';
    style.textContent = notificationsPageStyles;
    document.head.appendChild(style);
}