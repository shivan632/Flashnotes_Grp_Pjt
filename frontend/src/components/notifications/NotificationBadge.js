// frontend/src/components/notifications/NotificationBadge.js
// Notification Badge Component - Enhanced UI with better colors

export function NotificationBadge({ count, maxCount = 99, animate = true }) {
    const displayCount = count > maxCount ? `${maxCount}+` : count;
    
    // Dynamic color based on count
    let gradientClass = 'from-red-500 to-red-600';
    if (count >= 50) {
        gradientClass = 'from-red-600 to-red-700';
    } else if (count >= 20) {
        gradientClass = 'from-orange-500 to-red-500';
    } else if (count >= 10) {
        gradientClass = 'from-yellow-500 to-orange-500';
    } else if (count > 0) {
        gradientClass = 'from-[#3B82F6] to-[#A78BFA]';
    }
    
    return `
        <div class="relative inline-flex">
            <span class="absolute -top-2 -right-2 min-w-[20px] h-5 bg-gradient-to-r ${gradientClass} text-white text-xs font-bold rounded-full flex items-center justify-center px-1.5 shadow-lg transform transition-all duration-300 hover:scale-110 ${animate ? 'animate-bounce-subtle' : ''}"
                  style="box-shadow: 0 0 0 2px #1F2937, 0 0 0 4px rgba(59,130,246,0.3);">
                ${displayCount}
            </span>
        </div>
    `;
}

// Small badge for inline use
export function SmallBadge({ count, color = 'blue' }) {
    const colors = {
        blue: 'from-[#3B82F6] to-[#60A5FA]',
        green: 'from-emerald-500 to-green-400',
        red: 'from-rose-500 to-red-400',
        yellow: 'from-amber-500 to-yellow-400',
        purple: 'from-[#A78BFA] to-[#8B5CF6]',
        pink: 'from-pink-500 to-rose-400',
        indigo: 'from-indigo-500 to-purple-400'
    };
    
    const gradient = colors[color] || colors.blue;
    
    return `
        <span class="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-gradient-to-r ${gradient} text-white text-xs font-bold rounded-full shadow-md transform hover:scale-110 transition-all duration-300">
            ${count}
        </span>
    `;
}

// Dot badge (for unread indicator)
export function DotBadge({ animate = true, color = 'blue' }) {
    const colors = {
        blue: 'from-[#3B82F6] to-[#A78BFA]',
        green: 'from-emerald-500 to-green-400',
        red: 'from-rose-500 to-red-400',
        yellow: 'from-amber-500 to-yellow-400',
        purple: 'from-[#A78BFA] to-[#8B5CF6]'
    };
    
    const gradient = colors[color] || colors.blue;
    
    return `
        <span class="inline-block w-2.5 h-2.5 bg-gradient-to-r ${gradient} rounded-full shadow-md ${animate ? 'animate-pulse-glow' : ''}"></span>
    `;
}

// Add CSS animations
const badgeStyles = `
    @keyframes badgePop {
        0% {
            transform: scale(0.6);
            opacity: 0;
        }
        70% {
            transform: scale(1.15);
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }
    
    @keyframes bounce-subtle {
        0%, 100% {
            transform: translateY(0) scale(1);
        }
        50% {
            transform: translateY(-2px) scale(1.05);
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
    
    .notification-badge {
        animation: badgePop 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
    
    .animate-bounce-subtle {
        animation: bounce-subtle 1s ease-in-out infinite;
    }
    
    .animate-pulse-glow {
        animation: pulse-glow 1.5s infinite;
    }
`;

if (!document.querySelector('#badge-styles')) {
    const style = document.createElement('style');
    style.id = 'badge-styles';
    style.textContent = badgeStyles;
    document.head.appendChild(style);
}