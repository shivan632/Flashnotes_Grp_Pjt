// frontend/src/components/notifications/NotificationBadge.js
// Notification Badge Component - Enhanced UI

export function NotificationBadge({ count, maxCount = 99, animate = true }) {
    const displayCount = count > maxCount ? `${maxCount}+` : count;
    
    return `
        <div class="relative inline-flex">
            <span class="absolute -top-2 -right-2 min-w-[20px] h-5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center px-1.5 shadow-lg ${animate ? 'animate-pulse' : ''}"
                  style="box-shadow: 0 0 0 2px #1F2937;">
                ${displayCount}
            </span>
        </div>
    `;
}

// Small badge for inline use
export function SmallBadge({ count, color = 'blue' }) {
    const colors = {
        blue: 'from-[#3B82F6] to-[#60A5FA]',
        green: 'from-green-500 to-green-400',
        red: 'from-red-500 to-red-400',
        yellow: 'from-yellow-500 to-yellow-400',
        purple: 'from-[#A78BFA] to-[#8B5CF6]'
    };
    
    const gradient = colors[color] || colors.blue;
    
    return `
        <span class="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-gradient-to-r ${gradient} text-white text-xs font-bold rounded-full shadow-md">
            ${count}
        </span>
    `;
}

// Dot badge (for unread indicator)
export function DotBadge({ animate = true }) {
    return `
        <span class="inline-block w-2.5 h-2.5 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full shadow-md ${animate ? 'animate-pulse' : ''}"></span>
    `;
}

// Add CSS animations
const badgeStyles = `
    @keyframes badgePop {
        0% {
            transform: scale(0.8);
            opacity: 0;
        }
        80% {
            transform: scale(1.1);
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }
    
    .notification-badge {
        animation: badgePop 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
`;

if (!document.querySelector('#badge-styles')) {
    const style = document.createElement('style');
    style.id = 'badge-styles';
    style.textContent = badgeStyles;
    document.head.appendChild(style);
}