// frontend/src/components/common/LoadingSpinner.js
// Loading Spinner Component - Multiple styles and animations

// Main loading spinner (3 circles)
export function LoadingSpinner({ size = 'md', text = '' }) {
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
    
    return `
        <div class="flex flex-col justify-center items-center py-8">
            <div class="loading-spinner ${sizeClasses[size] || sizeClasses.md}">
                <div></div>
                <div></div>
                <div></div>
            </div>
            ${text ? `<p class="mt-4 text-[#9CA3AF] ${textSizeClasses[size] || textSizeClasses.md} animate-pulse">${text}</p>` : ''}
        </div>
    `;
}

// Dots loading spinner
export function DotsSpinner({ color = '#3B82F6', size = 'md' }) {
    const dotSizes = {
        sm: 'w-2 h-2',
        md: 'w-3 h-3',
        lg: 'w-4 h-4',
        xl: 'w-5 h-5'
    };
    
    return `
        <div class="flex justify-center items-center space-x-2 py-4">
            <div class="${dotSizes[size]} bg-[${color}] rounded-full animate-bounce" style="animation-delay: 0s"></div>
            <div class="${dotSizes[size]} bg-[${color}] rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
            <div class="${dotSizes[size]} bg-[${color}] rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
        </div>
    `;
}

// Pulsing spinner (single circle)
export function PulseSpinner({ color = '#3B82F6', size = 'md' }) {
    const sizes = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
        xl: 'w-20 h-20'
    };
    
    return `
        <div class="flex justify-center items-center py-4">
            <div class="${sizes[size]} bg-[${color}] rounded-full animate-pulse opacity-70"></div>
        </div>
    `;
}

// Ring spinner (circular progress)
export function RingSpinner({ color = '#3B82F6', size = 'md' }) {
    const sizes = {
        sm: 'w-6 h-6',
        md: 'w-10 h-10',
        lg: 'w-14 h-14',
        xl: 'w-20 h-20'
    };
    
    return `
        <div class="flex justify-center items-center py-4">
            <div class="${sizes[size]} border-4 border-[${color}]/20 border-t-[${color}] rounded-full animate-spin"></div>
        </div>
    `;
}

// Skeleton loader for content
export function SkeletonLoader({ type = 'card', count = 1 }) {
    if (type === 'card') {
        return `
            <div class="space-y-4">
                ${Array(count).fill(0).map(() => `
                    <div class="bg-[#1F2937] rounded-xl p-6 animate-pulse">
                        <div class="flex items-center space-x-4 mb-4">
                            <div class="w-12 h-12 bg-[#374151] rounded-full"></div>
                            <div class="flex-1">
                                <div class="h-4 bg-[#374151] rounded w-3/4 mb-2"></div>
                                <div class="h-3 bg-[#374151] rounded w-1/2"></div>
                            </div>
                        </div>
                        <div class="h-20 bg-[#374151] rounded mb-4"></div>
                        <div class="flex space-x-2">
                            <div class="h-8 bg-[#374151] rounded w-20"></div>
                            <div class="h-8 bg-[#374151] rounded w-20"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    } else if (type === 'text') {
        return `
            <div class="space-y-3">
                ${Array(count).fill(0).map(() => `
                    <div class="animate-pulse">
                        <div class="h-4 bg-[#374151] rounded w-full mb-2"></div>
                        <div class="h-4 bg-[#374151] rounded w-5/6"></div>
                    </div>
                `).join('')}
            </div>
        `;
    } else if (type === 'table') {
        return `
            <div class="animate-pulse">
                <div class="h-10 bg-[#374151] rounded-t-xl mb-2"></div>
                ${Array(count).fill(0).map(() => `
                    <div class="h-12 bg-[#1F2937] border-b border-[#374151]"></div>
                `).join('')}
                <div class="h-10 bg-[#374151] rounded-b-xl mt-2"></div>
            </div>
        `;
    }
    
    return `
        <div class="animate-pulse space-y-3">
            <div class="h-32 bg-[#374151] rounded-xl"></div>
            <div class="h-4 bg-[#374151] rounded w-3/4"></div>
            <div class="h-4 bg-[#374151] rounded w-1/2"></div>
        </div>
    `;
}

// Full page loader with overlay
export function FullPageLoader({ message = 'Loading...' }) {
    return `
        <div class="fixed inset-0 bg-[#111827]/80 backdrop-blur-sm z-[9999] flex items-center justify-center">
            <div class="bg-[#1F2937] rounded-2xl p-8 shadow-2xl flex flex-col items-center space-y-4">
                <div class="loading-spinner w-20 h-20">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <p class="text-[#E5E7EB] font-medium animate-pulse">${message}</p>
            </div>
        </div>
    `;
}

// Button loading spinner (small inline spinner)
export function ButtonSpinner() {
    return `
        <svg class="animate-spin h-4 w-4 text-white inline-block mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    `;
}

// Progress bar loader
export function ProgressBar({ progress = 0, color = '#3B82F6' }) {
    return `
        <div class="w-full bg-[#374151] rounded-full h-2 overflow-hidden">
            <div class="h-full rounded-full transition-all duration-300 ease-out" 
                 style="width: ${progress}%; background: ${color};"></div>
        </div>
    `;
}

// Card loader (for quiz cards, note cards, etc.)
export function CardLoader({ count = 3 }) {
    return `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${Array(count).fill(0).map(() => `
                <div class="bg-[#1F2937] rounded-xl p-6 animate-pulse">
                    <div class="w-12 h-12 bg-[#374151] rounded-lg mb-4"></div>
                    <div class="h-5 bg-[#374151] rounded w-3/4 mb-3"></div>
                    <div class="h-4 bg-[#374151] rounded w-full mb-2"></div>
                    <div class="h-4 bg-[#374151] rounded w-5/6 mb-4"></div>
                    <div class="flex justify-between">
                        <div class="h-8 bg-[#374151] rounded w-20"></div>
                        <div class="h-8 bg-[#374151] rounded w-24"></div>
                    </div>
                </div>
            `).join('')}
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