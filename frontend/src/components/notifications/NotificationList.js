// frontend/src/components/notifications/NotificationList.js
// Notification List Component - Enhanced UI with better colors

import { NotificationItem } from './NotificationItem.js';
import { DotBadge } from './NotificationBadge.js';

export function NotificationList({ notifications, onMarkRead, onDelete, onMarkAllRead }) {
    const unreadCount = notifications.filter(n => !n.read).length;
    
    if (!notifications || notifications.length === 0) {
        return `
            <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-10 text-center border border-[#374151]">
                <div class="relative">
                    <div class="absolute inset-0 flex items-center justify-center">
                        <div class="w-28 h-28 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full opacity-10 blur-2xl"></div>
                    </div>
                    <svg class="w-20 h-20 mx-auto mb-5 text-[#4B5563] relative z-10 animate-float" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                    </svg>
                    <p class="text-[#9CA3AF] text-lg mb-2">✨ No notifications yet</p>
                    <p class="text-sm text-[#6B7280] max-w-xs mx-auto">When you receive notifications, they'll appear here</p>
                    <div class="mt-6 flex justify-center gap-2">
                        <div class="w-1.5 h-1.5 bg-[#3B82F6] rounded-full animate-pulse"></div>
                        <div class="w-1.5 h-1.5 bg-[#60A5FA] rounded-full animate-pulse delay-100"></div>
                        <div class="w-1.5 h-1.5 bg-[#A78BFA] rounded-full animate-pulse delay-200"></div>
                        <div class="w-1.5 h-1.5 bg-[#8B5CF6] rounded-full animate-pulse delay-300"></div>
                    </div>
                </div>
            </div>
        `;
    }
    
    return `
        <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl border border-[#374151] overflow-hidden shadow-xl">
            <!-- Header -->
            <div class="flex items-center justify-between p-5 border-b border-[#374151] bg-gradient-to-r from-[#1F2937] to-[#111827]">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-xl flex items-center justify-center shadow-lg">
                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                        </svg>
                    </div>
                    <div>
                        <h3 class="text-lg font-bold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">Notifications</h3>
                        <p class="text-xs text-[#6B7280] mt-0.5">Stay updated with your learning progress</p>
                    </div>
                </div>
                <div class="flex items-center gap-3">
                    ${unreadCount > 0 ? `
                        <button id="markAllReadBtn" class="text-xs text-[#60A5FA] hover:text-[#3B82F6] transition-all duration-300 flex items-center gap-1 group px-3 py-1.5 rounded-lg hover:bg-[#3B82F6]/10">
                            <svg class="w-3 h-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            Mark all read
                        </button>
                    ` : ''}
                    <div class="bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md transform hover:scale-105 transition-all">
                        ${notifications.length}
                    </div>
                </div>
            </div>
            
            <!-- Notifications List -->
            <div class="divide-y divide-[#374151] max-h-[500px] overflow-y-auto custom-scrollbar">
                ${notifications.map(notification => `
                    <div class="notification-item-wrapper transition-all duration-300 hover:bg-[#1A2436]">
                        ${NotificationItem({ 
                            notification, 
                            onRead: onMarkRead,
                            onDelete: onDelete 
                        })}
                    </div>
                `).join('')}
            </div>
            
            <!-- Footer Actions -->
            <div class="p-3 border-t border-[#374151] bg-[#111827]/50 flex justify-center gap-4">
                <button id="clearAllNotificationsBtn" class="text-xs text-rose-400 hover:text-rose-500 transition-all duration-300 flex items-center gap-1 group px-3 py-1.5 rounded-lg hover:bg-rose-500/10">
                    <svg class="w-3 h-3 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    Clear all
                </button>
            </div>
        </div>
    `;
}

// Setup notification list events
export function setupNotificationList(notifications, onMarkRead, onDelete, onMarkAllRead, onClearAll) {
    // Mark individual as read
    document.querySelectorAll('.mark-read-btn').forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        const item = newBtn.closest('.notification-item');
        const id = item?.dataset.id;
        
        newBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (id && onMarkRead) onMarkRead(parseInt(id));
        });
    });
    
    // Delete individual notification
    document.querySelectorAll('.delete-notification-btn').forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        const item = newBtn.closest('.notification-item');
        const id = item?.dataset.id;
        
        newBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (id && onDelete) onDelete(parseInt(id));
        });
    });
    
    // Mark all as read
    const markAllBtn = document.getElementById('markAllReadBtn');
    if (markAllBtn && onMarkAllRead) {
        const newMarkAllBtn = markAllBtn.cloneNode(true);
        markAllBtn.parentNode.replaceChild(newMarkAllBtn, markAllBtn);
        
        newMarkAllBtn.addEventListener('click', (e) => {
            e.preventDefault();
            onMarkAllRead();
        });
    }
    
    // Clear all notifications
    const clearAllBtn = document.getElementById('clearAllNotificationsBtn');
    if (clearAllBtn && onClearAll) {
        const newClearAllBtn = clearAllBtn.cloneNode(true);
        clearAllBtn.parentNode.replaceChild(newClearAllBtn, clearAllBtn);
        
        newClearAllBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('⚠️ Are you sure you want to clear all notifications? This action cannot be undone.')) {
                onClearAll();
            }
        });
    }
    
    // Click on notification item
    document.querySelectorAll('.notification-item').forEach(item => {
        const newItem = item.cloneNode(true);
        item.parentNode.replaceChild(newItem, item);
        
        newItem.addEventListener('click', (e) => {
            if (e.target.closest('.mark-read-btn') || e.target.closest('.delete-notification-btn')) {
                return;
            }
            const id = newItem.dataset.id;
            if (id && onMarkRead) onMarkRead(parseInt(id));
        });
    });
}

// Add CSS animations
const notificationListStyles = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(-15px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes float {
        0%, 100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-8px);
        }
    }
    
    @keyframes pulse-glow {
        0%, 100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
        }
        50% {
            box-shadow: 0 0 0 4px rgba(59, 130, 246, 0);
        }
    }
    
    .animate-float {
        animation: float 3s ease-in-out infinite;
    }
    
    .notification-item {
        animation: slideInRight 0.3s ease-out forwards;
    }
    
    .notification-item-wrapper {
        opacity: 0;
        animation: slideInRight 0.35s ease-out forwards;
    }
    
    .notification-item-wrapper:nth-child(1) { animation-delay: 0.05s; }
    .notification-item-wrapper:nth-child(2) { animation-delay: 0.1s; }
    .notification-item-wrapper:nth-child(3) { animation-delay: 0.15s; }
    .notification-item-wrapper:nth-child(4) { animation-delay: 0.2s; }
    .notification-item-wrapper:nth-child(5) { animation-delay: 0.25s; }
    
    .custom-scrollbar::-webkit-scrollbar {
        width: 5px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-track {
        background: #1F2937;
        border-radius: 10px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: linear-gradient(135deg, #3B82F6, #A78BFA);
        border-radius: 10px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(135deg, #60A5FA, #8B5CF6);
    }
`;

if (!document.querySelector('#notification-list-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-list-styles';
    style.textContent = notificationListStyles;
    document.head.appendChild(style);
}