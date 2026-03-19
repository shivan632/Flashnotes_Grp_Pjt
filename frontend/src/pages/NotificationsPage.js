// frontend/src/pages/NotificationsPage.js
// Notifications Page - View all notifications

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
    
    return `
        <div class="min-h-screen bg-[#111827] relative">
            ${Sidebar()}
            ${AIChatSidebar()}
            <div id="mainContent" class="min-h-screen transition-all duration-300" 
                 style="margin-left: 256px; margin-right: 384px; width: calc(100% - 640px);">
                ${Header({ title: 'Notifications' })}
                <main class="container mx-auto px-4 py-8">
                    <div class="mb-8 flex justify-between items-center">
                        <div>
                            <h1 class="text-3xl font-bold text-[#E5E7EB]">Notifications</h1>
                            <p class="text-[#9CA3AF] mt-2">Stay updated with your learning progress</p>
                        </div>
                        ${unreadCount > 0 ? `
                            <button id="markAllReadBtn" class="bg-[#3B82F6] hover:bg-[#60A5FA] text-white px-4 py-2 rounded-lg text-sm transition-all">
                                Mark All as Read
                            </button>
                        ` : ''}
                    </div>
                    
                    <!-- Notification Filters -->
                    <div class="flex gap-2 mb-6">
                        <button class="filter-btn active px-4 py-2 bg-[#3B82F6] text-white rounded-lg text-sm" data-filter="all">All</button>
                        <button class="filter-btn px-4 py-2 bg-[#1F2937] text-[#E5E7EB] hover:bg-[#374151] rounded-lg text-sm" data-filter="unread">Unread</button>
                        <button class="filter-btn px-4 py-2 bg-[#1F2937] text-[#E5E7EB] hover:bg-[#374151] rounded-lg text-sm" data-filter="quiz">Quiz</button>
                        <button class="filter-btn px-4 py-2 bg-[#1F2937] text-[#E5E7EB] hover:bg-[#374151] rounded-lg text-sm" data-filter="achievement">Achievements</button>
                    </div>
                    
                    <!-- Notifications List -->
                    <div class="bg-[#1F2937] rounded-xl shadow-lg overflow-hidden">
                        ${notifications.map(notif => `
                            <div class="notification-item p-4 hover:bg-[#374151] transition-colors border-b border-[#374151] last:border-0 ${!notif.read ? 'bg-[#111827]' : ''}" data-id="${notif.id}" data-type="${notif.type}" data-read="${notif.read}">
                                <div class="flex items-start gap-4">
                                    <div class="w-10 h-10 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full flex items-center justify-center text-xl flex-shrink-0">
                                        ${notif.icon}
                                    </div>
                                    <div class="flex-1">
                                        <div class="flex justify-between items-start">
                                            <h3 class="font-semibold text-[#E5E7EB]">${notif.title}</h3>
                                            <span class="text-xs text-[#9CA3AF]">${new Date(notif.time).toLocaleDateString()}</span>
                                        </div>
                                        <p class="text-sm text-[#9CA3AF] mt-1">${notif.message}</p>
                                        <div class="flex gap-3 mt-2">
                                            ${!notif.read ? `
                                                <button class="mark-read text-xs text-[#60A5FA] hover:text-[#3B82F6]" data-id="${notif.id}">
                                                    Mark as read
                                                </button>
                                            ` : ''}
                                            <button class="delete-notification text-xs text-red-400 hover:text-red-500" data-id="${notif.id}">
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                    ${!notif.read ? '<span class="w-2 h-2 bg-[#3B82F6] rounded-full mt-2"></span>' : ''}
                                </div>
                            </div>
                        `).join('')}
                        
                        ${notifications.length === 0 ? `
                            <div class="text-center py-12">
                                <svg class="w-20 h-20 mx-auto text-[#4B5563] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                                </svg>
                                <p class="text-[#9CA3AF] text-lg">No notifications</p>
                                <p class="text-sm text-[#6B7280] mt-2">You're all caught up!</p>
                            </div>
                        ` : ''}
                    </div>
                </main>
            </div>
        </div>
    `;
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
                const dot = item.querySelector('span.w-2');
                if (dot) dot.remove();
                const markBtn = item.querySelector('.mark-read');
                if (markBtn) markBtn.remove();
            });
            localStorage.setItem('notificationCount', '0');
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
                const dot = item.querySelector('span.w-2');
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
            }
        });
    });
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            document.querySelectorAll('.filter-btn').forEach(b => {
                b.classList.remove('bg-[#3B82F6]', 'text-white');
                b.classList.add('bg-[#1F2937]', 'text-[#E5E7EB]');
            });
            btn.classList.add('bg-[#3B82F6]', 'text-white');
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