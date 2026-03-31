// frontend/src/components/common/LoadingSpinner.js
// Loading Spinner Component - Enhanced with 3D animations and dynamic effects

// Main loading spinner (3 circles with 3D rotation)
export function LoadingSpinner({ size = 'md', text = '', color = 'gradient' }) {
    const sizeClasses = {
        sm: 'w-12 h-12',
        md: 'w-20 h-20',
        lg: 'w-28 h-28',
        xl: 'w-36 h-36'
    };
    
    const textSizeClasses = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl'
    };
    
    const colorClasses = {
        blue: 'from-[#3B82F6] to-[#60A5FA]',
        purple: 'from-[#A78BFA] to-[#8B5CF6]',
        green: 'from-[#10B981] to-[#34D399]',
        red: 'from-[#EF4444] to-[#F87171]',
        yellow: 'from-[#F59E0B] to-[#FBBF24]',
        gradient: 'from-[#3B82F6] to-[#A78BFA]'
    };
    
    const gradient = colorClasses[color] || colorClasses.gradient;
    
    return `
        <div class="flex flex-col justify-center items-center py-8 group perspective-1000">
            <div class="relative ${sizeClasses[size] || sizeClasses.md}">
                <div class="loading-spinner-3d absolute inset-0">
                    <div class="absolute inset-0 rounded-full bg-gradient-to-r ${gradient} animate-spin-3d"></div>
                    <div class="absolute inset-2 rounded-full bg-gradient-to-r ${gradient} animate-spin-3d-reverse opacity-70"></div>
                    <div class="absolute inset-4 rounded-full bg-[#111827] flex items-center justify-center">
                        <div class="w-2 h-2 bg-gradient-to-r ${gradient} rounded-full animate-pulse-glow"></div>
                    </div>
                </div>
            </div>
            ${text ? `<p class="mt-6 text-[#9CA3AF] ${textSizeClasses[size] || textSizeClasses.md} animate-pulse-glow flex items-center gap-2">
                <span class="w-1.5 h-1.5 bg-gradient-to-r ${gradient} rounded-full animate-bounce"></span>
                ${text}
                <span class="w-1.5 h-1.5 bg-gradient-to-r ${gradient} rounded-full animate-bounce delay-150"></span>
            </p>` : ''}
        </div>
    `;
}

// 3D Dots loading spinner
export function DotsSpinner({ color = 'gradient', size = 'md', count = 3 }) {
    const dotSizes = {
        sm: 'w-2 h-2',
        md: 'w-3 h-3',
        lg: 'w-4 h-4',
        xl: 'w-5 h-5'
    };
    
    const colorClasses = {
        blue: 'bg-[#3B82F6]',
        purple: 'bg-[#A78BFA]',
        green: 'bg-[#10B981]',
        red: 'bg-[#EF4444]',
        yellow: 'bg-[#F59E0B]',
        gradient: 'bg-gradient-to-r from-[#3B82F6] to-[#A78BFA]'
    };
    
    const dotColor = color === 'gradient' ? 'bg-gradient-to-r from-[#3B82F6] to-[#A78BFA]' : colorClasses[color];
    
    const dots = Array(count).fill(0).map((_, i) => `
        <div class="${dotSizes[size]} ${dotColor} rounded-full animate-bounce-3d" style="animation-delay: ${i * 0.15}s"></div>
    `).join('');
    
    return `
        <div class="flex justify-center items-center space-x-3 py-6 perspective-500">
            ${dots}
        </div>
    `;
}

// 3D Pulsing spinner with glow effect
export function PulseSpinner({ color = 'gradient', size = 'md' }) {
    const sizes = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
        xl: 'w-20 h-20'
    };
    
    const colorClasses = {
        blue: 'bg-[#3B82F6]',
        purple: 'bg-[#A78BFA]',
        green: 'bg-[#10B981]',
        red: 'bg-[#EF4444]',
        yellow: 'bg-[#F59E0B]',
        gradient: 'bg-gradient-to-r from-[#3B82F6] to-[#A78BFA]'
    };
    
    const pulseColor = color === 'gradient' ? 'bg-gradient-to-r from-[#3B82F6] to-[#A78BFA]' : colorClasses[color];
    
    return `
        <div class="flex justify-center items-center py-6">
            <div class="relative">
                <div class="absolute inset-0 ${pulseColor} rounded-full animate-ping opacity-30"></div>
                <div class="absolute inset-0 ${pulseColor} rounded-full animate-pulse opacity-50"></div>
                <div class="${sizes[size]} ${pulseColor} rounded-full animate-pulse-3d shadow-2xl"></div>
            </div>
        </div>
    `;
}

// 3D Ring spinner with neon effect
export function RingSpinner({ color = 'gradient', size = 'md' }) {
    const sizes = {
        sm: 'w-6 h-6',
        md: 'w-10 h-10',
        lg: 'w-14 h-14',
        xl: 'w-20 h-20'
    };
    
    const colorClasses = {
        blue: 'border-[#3B82F6]',
        purple: 'border-[#A78BFA]',
        green: 'border-[#10B981]',
        red: 'border-[#EF4444]',
        yellow: 'border-[#F59E0B]',
        gradient: 'border-t-[#3B82F6] border-r-[#A78BFA] border-b-transparent border-l-transparent'
    };
    
    const ringColor = color === 'gradient' ? 'border-t-[#3B82F6] border-r-[#A78BFA] border-b-transparent border-l-transparent' : `border-4 border-[${color}]/20 border-t-[${color}]`;
    
    return `
        <div class="flex justify-center items-center py-6 perspective-500">
            <div class="${sizes[size]} rounded-full animate-spin-3d shadow-neon" 
                 style="border: 3px solid transparent; ${ringColor.includes('border-t') ? ringColor : `border: 3px solid rgba(59,130,246,0.2); border-top-color: ${color};`}">
            </div>
        </div>
    `;
}

// 3D Skeleton loader with shimmer effect
export function SkeletonLoader({ type = 'card', count = 1, with3D = true }) {
    const shimmerClass = with3D ? 'shimmer-3d' : 'animate-pulse';
    
    if (type === 'card') {
        return `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${Array(count).fill(0).map(() => `
                    <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-6 ${shimmerClass} overflow-hidden relative group perspective-500">
                        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        <div class="flex items-center space-x-4 mb-4">
                            <div class="w-12 h-12 bg-gradient-to-r from-[#374151] to-[#4B5563] rounded-xl transform group-hover:rotate-6 transition-all duration-300"></div>
                            <div class="flex-1">
                                <div class="h-4 bg-gradient-to-r from-[#374151] to-[#4B5563] rounded w-3/4 mb-2"></div>
                                <div class="h-3 bg-gradient-to-r from-[#374151] to-[#4B5563] rounded w-1/2"></div>
                            </div>
                        </div>
                        <div class="h-20 bg-gradient-to-r from-[#374151] to-[#4B5563] rounded-xl mb-4"></div>
                        <div class="flex space-x-3">
                            <div class="h-9 bg-gradient-to-r from-[#374151] to-[#4B5563] rounded-xl w-24 transform hover:scale-105 transition-all"></div>
                            <div class="h-9 bg-gradient-to-r from-[#374151] to-[#4B5563] rounded-xl w-24"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    if (type === 'text') {
        return `
            <div class="space-y-4">
                ${Array(count).fill(0).map(() => `
                    <div class="${shimmerClass} space-y-2">
                        <div class="h-4 bg-gradient-to-r from-[#374151] to-[#4B5563] rounded-lg w-full"></div>
                        <div class="h-4 bg-gradient-to-r from-[#374151] to-[#4B5563] rounded-lg w-5/6"></div>
                        <div class="h-4 bg-gradient-to-r from-[#374151] to-[#4B5563] rounded-lg w-4/6"></div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    if (type === 'table') {
        return `
            <div class="${shimmerClass} overflow-hidden rounded-2xl border border-[#374151]">
                <div class="h-12 bg-gradient-to-r from-[#374151] to-[#4B5563] rounded-t-2xl"></div>
                ${Array(count).fill(0).map(() => `
                    <div class="h-14 bg-[#1F2937] border-b border-[#374151] flex items-center px-4">
                        <div class="h-4 bg-[#374151] rounded w-1/4"></div>
                        <div class="h-4 bg-[#374151] rounded w-1/4 ml-auto"></div>
                    </div>
                `).join('')}
                <div class="h-12 bg-gradient-to-r from-[#374151] to-[#4B5563] rounded-b-2xl"></div>
            </div>
        `;
    }
    
    // Default skeleton
    return `
        <div class="${shimmerClass} space-y-3">
            <div class="h-32 bg-gradient-to-r from-[#374151] to-[#4B5563] rounded-2xl"></div>
            <div class="h-5 bg-gradient-to-r from-[#374151] to-[#4B5563] rounded-lg w-3/4"></div>
            <div class="h-4 bg-gradient-to-r from-[#374151] to-[#4B5563] rounded-lg w-1/2"></div>
        </div>
    `;
}

// Full page 3D loader with overlay
export function FullPageLoader({ message = 'Loading...', color = 'gradient' }) {
    const colorClasses = {
        blue: 'from-[#3B82F6] to-[#60A5FA]',
        purple: 'from-[#A78BFA] to-[#8B5CF6]',
        gradient: 'from-[#3B82F6] to-[#A78BFA]'
    };
    
    const gradient = colorClasses[color] || colorClasses.gradient;
    
    return `
        <div class="fixed inset-0 bg-[#0F172A]/90 backdrop-blur-md z-[9999] flex items-center justify-center">
            <div class="relative perspective-1000">
                <!-- 3D Rotating Background -->
                <div class="absolute inset-0 bg-gradient-to-r ${gradient} rounded-full blur-3xl animate-pulse opacity-20"></div>
                
                <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-10 shadow-2xl flex flex-col items-center space-y-6 transform-gpu animate-float-3d border border-[#374151]">
                    <!-- 3D Spinner -->
                    <div class="relative w-24 h-24">
                        <div class="absolute inset-0 rounded-full bg-gradient-to-r ${gradient} animate-spin-3d"></div>
                        <div class="absolute inset-2 rounded-full bg-gradient-to-r ${gradient} animate-spin-3d-reverse opacity-70"></div>
                        <div class="absolute inset-4 rounded-full bg-[#111827] flex items-center justify-center">
                            <div class="w-3 h-3 bg-gradient-to-r ${gradient} rounded-full animate-pulse-glow"></div>
                        </div>
                    </div>
                    
                    <!-- Animated Text -->
                    <div class="flex items-center gap-3">
                        <span class="w-2 h-2 bg-gradient-to-r ${gradient} rounded-full animate-bounce"></span>
                        <p class="text-[#E5E7EB] font-medium text-lg tracking-wide animate-pulse-glow">${message}</p>
                        <span class="w-2 h-2 bg-gradient-to-r ${gradient} rounded-full animate-bounce delay-150"></span>
                        <span class="w-2 h-2 bg-gradient-to-r ${gradient} rounded-full animate-bounce delay-300"></span>
                    </div>
                    
                    <!-- Progress Dots -->
                    <div class="flex gap-2 mt-2">
                        <div class="w-1.5 h-1.5 bg-gradient-to-r ${gradient} rounded-full animate-pulse-scale"></div>
                        <div class="w-1.5 h-1.5 bg-gradient-to-r ${gradient} rounded-full animate-pulse-scale delay-150"></div>
                        <div class="w-1.5 h-1.5 bg-gradient-to-r ${gradient} rounded-full animate-pulse-scale delay-300"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 3D Button spinner
export function ButtonSpinner({ color = 'white', size = 'sm' }) {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6'
    };
    
    return `
        <svg class="animate-spin-3d ${sizeClasses[size]} text-${color} inline-block mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    `;
}

// 3D Progress bar loader with neon effect
export function ProgressBar({ progress = 0, color = 'gradient', showPercentage = true }) {
    const colorClasses = {
        blue: '#3B82F6',
        purple: '#A78BFA',
        green: '#10B981',
        red: '#EF4444',
        yellow: '#F59E0B',
        gradient: 'linear-gradient(90deg, #3B82F6, #A78BFA)'
    };
    
    const barColor = color === 'gradient' ? 'linear-gradient(90deg, #3B82F6, #A78BFA)' : colorClasses[color];
    
    return `
        <div class="w-full space-y-3">
            <div class="relative w-full bg-[#374151] rounded-full h-3 overflow-hidden shadow-inner">
                <div class="absolute inset-0 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full transition-all duration-500 ease-out shadow-neon"
                     style="width: ${progress}%; background: ${barColor};">
                    <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                </div>
            </div>
            ${showPercentage ? `
                <div class="flex justify-between items-center text-sm">
                    <span class="text-[#9CA3AF]">Loading</span>
                    <span class="text-[#3B82F6] font-mono font-bold animate-pulse">${Math.round(progress)}%</span>
                </div>
            ` : ''}
        </div>
    `;
}

// 3D Card loader grid
export function CardLoader({ count = 3, variant = 'quiz' }) {
    const cardVariants = {
        quiz: `
            <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-6 shimmer-3d overflow-hidden relative group">
                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <div class="w-14 h-14 bg-gradient-to-r from-[#374151] to-[#4B5563] rounded-xl mb-4 transform group-hover:rotate-6 transition-all"></div>
                <div class="h-5 bg-gradient-to-r from-[#374151] to-[#4B5563] rounded-lg w-3/4 mb-3"></div>
                <div class="h-4 bg-gradient-to-r from-[#374151] to-[#4B5563] rounded-lg w-full mb-2"></div>
                <div class="h-4 bg-gradient-to-r from-[#374151] to-[#4B5563] rounded-lg w-5/6 mb-4"></div>
                <div class="flex justify-between">
                    <div class="h-9 bg-gradient-to-r from-[#374151] to-[#4B5563] rounded-xl w-24"></div>
                    <div class="h-9 bg-gradient-to-r from-[#374151] to-[#4B5563] rounded-xl w-28"></div>
                </div>
            </div>
        `,
        roadmap: `
            <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-5 shimmer-3d overflow-hidden relative group">
                <div class="flex items-center gap-3 mb-3">
                    <div class="w-10 h-10 bg-gradient-to-r from-[#374151] to-[#4B5563] rounded-lg"></div>
                    <div class="flex-1">
                        <div class="h-4 bg-gradient-to-r from-[#374151] to-[#4B5563] rounded w-3/4"></div>
                        <div class="h-3 bg-gradient-to-r from-[#374151] to-[#4B5563] rounded w-1/2 mt-1"></div>
                    </div>
                </div>
                <div class="h-24 bg-gradient-to-r from-[#374151] to-[#4B5563] rounded-xl mb-3"></div>
                <div class="flex justify-between">
                    <div class="h-6 bg-gradient-to-r from-[#374151] to-[#4B5563] rounded w-20"></div>
                    <div class="h-6 bg-gradient-to-r from-[#374151] to-[#4B5563] rounded w-16"></div>
                </div>
            </div>
        `,
        note: `
            <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-5 shimmer-3d overflow-hidden relative group">
                <div class="flex items-center gap-3 mb-3">
                    <div class="w-8 h-8 bg-gradient-to-r from-[#374151] to-[#4B5563] rounded-lg"></div>
                    <div class="h-4 bg-gradient-to-r from-[#374151] to-[#4B5563] rounded w-1/2"></div>
                </div>
                <div class="h-16 bg-gradient-to-r from-[#374151] to-[#4B5563] rounded-lg mb-3"></div>
                <div class="flex gap-2">
                    <div class="h-7 bg-gradient-to-r from-[#374151] to-[#4B5563] rounded-lg w-20"></div>
                    <div class="h-7 bg-gradient-to-r from-[#374151] to-[#4B5563] rounded-lg w-20"></div>
                </div>
            </div>
        `
    };
    
    const cardHtml = cardVariants[variant] || cardVariants.quiz;
    
    return `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${Array(count).fill(0).map(() => cardHtml).join('')}
        </div>
    `;
}

// Export all spinner variants
export const LoadingSpinners = {
    default: LoadingSpinner,
    dots: DotsSpinner,
    pulse: PulseSpinner,
    ring: RingSpinner,
    skeleton: SkeletonLoader,
    fullPage: FullPageLoader,
    button: ButtonSpinner,
    progress: ProgressBar,
    card: CardLoader
};

// Add CSS animations to head
const loadingSpinnerStyles = `
    @keyframes spin-3d {
        0% {
            transform: rotate(0deg) rotateY(0deg);
        }
        100% {
            transform: rotate(360deg) rotateY(360deg);
        }
    }
    
    @keyframes spin-3d-reverse {
        0% {
            transform: rotate(0deg) rotateY(0deg);
        }
        100% {
            transform: rotate(-360deg) rotateY(-360deg);
        }
    }
    
    @keyframes bounce-3d {
        0%, 100% {
            transform: translateY(0) scale(1);
        }
        50% {
            transform: translateY(-15px) scale(1.2) rotateY(180deg);
        }
    }
    
    @keyframes pulse-3d {
        0%, 100% {
            transform: scale(1) rotateY(0deg);
            opacity: 1;
        }
        50% {
            transform: scale(1.2) rotateY(180deg);
            opacity: 0.7;
        }
    }
    
    @keyframes pulse-scale {
        0%, 100% {
            transform: scale(1);
            opacity: 0.5;
        }
        50% {
            transform: scale(1.5);
            opacity: 1;
        }
    }
    
    @keyframes float-3d {
        0%, 100% {
            transform: translateY(0) rotateX(0deg);
        }
        50% {
            transform: translateY(-10px) rotateX(5deg);
        }
    }
    
    @keyframes shimmer {
        0% {
            transform: translateX(-100%);
        }
        100% {
            transform: translateX(100%);
        }
    }
    
    @keyframes pulse-glow {
        0%, 100% {
            box-shadow: 0 0 5px rgba(59, 130, 246, 0.5);
        }
        50% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.8);
        }
    }
    
    .animate-spin-3d {
        animation: spin-3d 1.5s linear infinite;
    }
    
    .animate-spin-3d-reverse {
        animation: spin-3d-reverse 1.5s linear infinite;
    }
    
    .animate-bounce-3d {
        animation: bounce-3d 0.8s ease-in-out infinite;
    }
    
    .animate-pulse-3d {
        animation: pulse-3d 1s ease-in-out infinite;
    }
    
    .animate-pulse-scale {
        animation: pulse-scale 1s ease-in-out infinite;
    }
    
    .animate-float-3d {
        animation: float-3d 3s ease-in-out infinite;
    }
    
    .animate-shimmer {
        animation: shimmer 1.5s infinite;
    }
    
    .animate-pulse-glow {
        animation: pulse-glow 2s ease-in-out infinite;
    }
    
    .shimmer-3d {
        position: relative;
        overflow: hidden;
    }
    
    .perspective-500 {
        perspective: 500px;
    }
    
    .perspective-1000 {
        perspective: 1000px;
    }
    
    .shadow-neon {
        box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
    }
    
    .shadow-neon:hover {
        box-shadow: 0 0 20px rgba(59, 130, 246, 0.8);
    }
`;

if (!document.querySelector('#loading-spinner-styles')) {
    const style = document.createElement('style');
    style.id = 'loading-spinner-styles';
    style.textContent = loadingSpinnerStyles;
    document.head.appendChild(style);
}