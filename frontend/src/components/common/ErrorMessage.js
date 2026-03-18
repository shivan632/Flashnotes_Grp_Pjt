// Error Message Component

export function ErrorMessage({ message = 'An error occurred', type = 'error' }) {
    const styles = {
        error: {
            bg: 'bg-red-500/10',
            border: 'border-red-500',
            text: 'text-red-500',
            icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
        },
        warning: {
            bg: 'bg-yellow-500/10',
            border: 'border-yellow-500',
            text: 'text-yellow-500',
            icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
        },
        info: {
            bg: 'bg-blue-500/10',
            border: 'border-blue-500',
            text: 'text-blue-500',
            icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
        },
        success: {
            bg: 'bg-green-500/10',
            border: 'border-green-500',
            text: 'text-green-500',
            icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
        }
    };
    
    const style = styles[type] || styles.error;
    
    return `
        <div class="${style.bg} border ${style.border} ${style.text} p-4 rounded-lg flex items-start gap-3 animate-fadeIn">
            <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${style.icon}"></path>
            </svg>
            <div class="flex-1">
                <p class="font-medium">${message}</p>
            </div>
            <button class="error-close hover:opacity-75 transition-opacity">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
    `;
}

// Show error message
export function showError(message, type = 'error', containerId = 'errorContainer') {
    let container = document.getElementById(containerId);
    
    if (!container) {
        container = document.createElement('div');
        container.id = containerId;
        container.className = 'fixed top-4 right-4 z-50 w-96';
        document.body.appendChild(container);
    }
    
    const errorId = `error-${Date.now()}`;
    const errorHtml = ErrorMessage({ message, type });
    
    const errorDiv = document.createElement('div');
    errorDiv.id = errorId;
    errorDiv.innerHTML = errorHtml;
    container.appendChild(errorDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.classList.add('animate-fadeOut');
            setTimeout(() => errorElement.remove(), 300);
        }
    }, 5000);
    
    // Close button handler
    const closeBtn = errorDiv.querySelector('.error-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            errorDiv.classList.add('animate-fadeOut');
            setTimeout(() => errorDiv.remove(), 300);
        });
    }
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateX(20px); }
        to { opacity: 1; transform: translateX(0); }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(20px); }
    }
    
    .animate-fadeIn {
        animation: fadeIn 0.3s ease-out;
    }
    
    .animate-fadeOut {
        animation: fadeOut 0.3s ease-out forwards;
    }
`;
document.head.appendChild(style);