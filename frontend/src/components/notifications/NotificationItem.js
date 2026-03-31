// frontend/src/components/notifications/NotificationItem.js
// Notification Item Component - Enhanced UI with better colors

export function NotificationItem({ notification, onRead, onDelete }) {
    const { id, title, message, time, read, icon, type } = notification;
    const date = new Date(time);
    const formattedTime = date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const getIconColor = () => {
        switch (type) {
            case 'quiz': return 'from-[#3B82F6] to-[#60A5FA]';
            case 'achievement': return 'from-amber-500 to-yellow-500';
            case 'reminder': return 'from-emerald-500 to-green-500';
            case 'ai': return 'from-[#A78BFA] to-[#8B5CF6]';
            case 'score': return 'from-rose-500 to-pink-500';
            case 'roadmap': return 'from-teal-500 to-cyan-500';
            default: return 'from-[#3B82F6] to-[#A78BFA]';
        }
    };
    
    const getBorderColor = () => {
        if (read) return 'border-[#374151]';
        switch (type) {
            case 'quiz': return 'border-[#3B82F6]/50';
            case 'achievement': return 'border-amber-500/50';
            case 'reminder': return 'border-emerald-500/50';
            case 'ai': return 'border-[#A78BFA]/50';
            default: return 'border-[#3B82F6]/50';
        }
    };
    
    return `
        <div class="notification-item group relative bg-gradient-to-r from-[#111827] to-[#1F2937] hover:from-[#1A2436] hover:to-[#2D3748] transition-all duration-300 rounded-xl border ${getBorderColor()} hover:border-[#3B82F6] cursor-pointer transform hover:-translate-y-0.5 hover:shadow-xl"
             data-id="${id}"
             style="animation: slideInRight 0.3s ease-out">
            <div class="p-4">
                <div class="flex items-start gap-3">
                    <!-- Icon -->
                    <div class="flex-shrink-0">
                        <div class="w-10 h-10 bg-gradient-to-r ${getIconColor()} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                            <span class="text-white text-xl">${icon || getDefaultIcon(type)}</span>
                        </div>
                    </div>
                    
                    <!-- Content -->
                    <div class="flex-1 min-w-0">
                        <div class="flex items-start justify-between gap-2">
                            <h4 class="text-sm font-semibold text-[#E5E7EB] group-hover:text-[#3B82F6] transition-colors">
                                ${escapeHtml(title)}
                            </h4>
                            <span class="text-xs text-[#6B7280] flex-shrink-0 group-hover:text-[#9CA3AF] transition-colors">${formattedTime}</span>
                        </div>
                        <p class="text-sm text-[#9CA3AF] mt-1 leading-relaxed group-hover:text-[#D1D5DB] transition-colors">${escapeHtml(message)}</p>
                        <div class="flex items-center gap-4 mt-3">
                            ${!read ? `
                                <button class="mark-read-btn text-xs text-[#60A5FA] hover:text-[#3B82F6] transition-all duration-300 flex items-center gap-1 group/btn hover:scale-105">
                                    <svg class="w-3 h-3 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                    Mark as read
                                </button>
                            ` : ''}
                            <button class="delete-notification-btn text-xs text-rose-400 hover:text-rose-500 transition-all duration-300 flex items-center gap-1 group/btn hover:scale-105">
                                <svg class="w-3 h-3 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                                Delete
                            </button>
                        </div>
                    </div>
                    
                    <!-- Unread Indicator -->
                    ${!read ? `
                        <div class="flex-shrink-0">
                            <span class="inline-block w-2.5 h-2.5 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full animate-pulse-glow"></span>
                        </div>
                    ` : ''}
                </div>
            </div>
            
            <!-- Hover Border Effect -->
            <div class="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" style="box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2) inset;"></div>
        </div>
    `;
}

function getDefaultIcon(type) {
    switch (type) {
        case 'quiz': return '📊';
        case 'achievement': return '🏆';
        case 'reminder': return '⏰';
        case 'ai': return '🤖';
        case 'score': return '⭐';
        case 'roadmap': return '🗺️';
        default: return '📬';
    }
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}