// frontend/src/components/profile/AvatarUpload.js
// Avatar Upload Component - Enhanced UI with beautiful animations

export function AvatarUpload({ currentAvatar, userName, onAvatarChange }) {
    const initials = userName ? userName.charAt(0).toUpperCase() : 'U';
    
    return `
        <div class="relative group">
            <!-- Glow Rings -->
            <div class="absolute inset-0 rounded-full bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] blur-xl opacity-0 group-hover:opacity-60 transition-all duration-500 -z-10"></div>
            <div class="absolute -inset-2 rounded-full bg-gradient-to-r from-[#3B82F6]/30 to-[#A78BFA]/30 blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse-slow"></div>
            
            <!-- Avatar Container -->
            <div class="relative w-32 h-32 mx-auto">
                <!-- Outer Ring Animation -->
                <div class="absolute -inset-1 rounded-full bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110"></div>
                
                <!-- Avatar -->
                <div class="relative w-32 h-32 bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-full flex items-center justify-center shadow-2xl group-hover:scale-105 transition-all duration-500 cursor-pointer overflow-hidden border-4 border-[#374151] group-hover:border-[#3B82F6]"
                     id="avatarContainer">
                    ${currentAvatar ? `
                        <img src="${currentAvatar}" alt="Avatar" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                    ` : `
                        <div class="relative">
                            <div class="absolute inset-0 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full blur-md animate-pulse-slow"></div>
                            <span class="relative text-5xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">${initials}</span>
                        </div>
                    `}
                    
                    <!-- Overlay on Hover -->
                    <div class="absolute inset-0 bg-gradient-to-br from-[#3B82F6]/80 to-[#A78BFA]/80 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-sm">
                        <svg class="w-10 h-10 text-white transform group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                    </div>
                </div>
                
                <input type="file" 
                       id="avatarInput" 
                       accept="image/*" 
                       class="hidden"
                       data-onchange="${onAvatarChange}">
            </div>
            
            <!-- Upload Button -->
            <button id="uploadAvatarBtn" 
                    class="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-1.5 z-10 group/btn">
                <svg class="w-3.5 h-3.5 group-hover/btn:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                </svg>
                <span>Change</span>
                <span class="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></span>
            </button>
            
            <!-- Upload Progress -->
            <div id="uploadProgress" class="absolute inset-0 bg-[#1F2937]/90 backdrop-blur-sm rounded-full flex items-center justify-center hidden z-20">
                <div class="flex flex-col items-center gap-2">
                    <div class="w-8 h-8 border-3 border-[#3B82F6] border-t-transparent rounded-full animate-spin"></div>
                    <span class="text-xs text-white">Uploading...</span>
                </div>
            </div>
            
            <!-- Success Checkmark -->
            <div id="uploadSuccess" class="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg transform scale-0 transition-transform duration-300 z-20">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
            </div>
        </div>
    `;
}

// Setup avatar upload events
export function setupAvatarUpload(onSuccess) {
    const uploadBtn = document.getElementById('uploadAvatarBtn');
    const avatarInput = document.getElementById('avatarInput');
    const avatarContainer = document.getElementById('avatarContainer');
    const uploadProgress = document.getElementById('uploadProgress');
    const uploadSuccess = document.getElementById('uploadSuccess');
    
    if (uploadBtn && avatarInput) {
        uploadBtn.addEventListener('click', () => {
            avatarInput.click();
        });
        
        avatarInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            // Validate file type
            if (!file.type.startsWith('image/')) {
                showNotification('Please select an image file (JPEG, PNG, GIF)', 'error');
                return;
            }
            
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                showNotification('Image size should be less than 5MB', 'error');
                return;
            }
            
            // Show progress
            if (uploadProgress) {
                uploadProgress.classList.remove('hidden');
                uploadProgress.classList.add('animate-fadeIn');
            }
            if (avatarContainer) {
                avatarContainer.classList.add('opacity-70');
            }
            
            try {
                // Create preview
                const reader = new FileReader();
                reader.onload = (event) => {
                    if (avatarContainer) {
                        avatarContainer.innerHTML = `
                            <img src="${event.target.result}" alt="Avatar" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                            <div class="absolute inset-0 bg-gradient-to-br from-[#3B82F6]/80 to-[#A78BFA]/80 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-sm">
                                <svg class="w-10 h-10 text-white transform group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                </svg>
                            </div>
                        `;
                    }
                };
                reader.readAsDataURL(file);
                
                // Simulate upload delay (replace with actual API call)
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Show success animation
                if (uploadSuccess) {
                    uploadSuccess.classList.remove('scale-0');
                    uploadSuccess.classList.add('scale-100');
                    setTimeout(() => {
                        uploadSuccess.classList.remove('scale-100');
                        uploadSuccess.classList.add('scale-0');
                    }, 2000);
                }
                
                showNotification('Avatar updated successfully!', 'success');
                
                if (onSuccess) onSuccess(file);
                
            } catch (error) {
                console.error('Upload error:', error);
                showNotification('Failed to upload image. Please try again.', 'error');
            } finally {
                if (uploadProgress) {
                    uploadProgress.classList.add('hidden');
                    uploadProgress.classList.remove('animate-fadeIn');
                }
                if (avatarContainer) {
                    avatarContainer.classList.remove('opacity-70');
                }
            }
        });
    }
}

// Notification helper
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed bottom-4 right-4 z-50 animate-slideInRight`;
    notification.innerHTML = `
        <div class="flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-sm ${
            type === 'success' ? 'bg-green-500/20 border border-green-500/50' : 
            type === 'error' ? 'bg-red-500/20 border border-red-500/50' : 
            'bg-[#3B82F6]/20 border border-[#3B82F6]/50'
        }">
            <div class="w-8 h-8 rounded-full flex items-center justify-center ${
                type === 'success' ? 'bg-green-500/30' : 
                type === 'error' ? 'bg-red-500/30' : 
                'bg-[#3B82F6]/30'
            }">
                ${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}
            </div>
            <p class="text-sm text-white">${message}</p>
        </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.classList.add('animate-fadeOut');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animations
const avatarStyles = `
    @keyframes avatarPulse {
        0%, 100% {
            transform: scale(1);
            opacity: 1;
        }
        50% {
            transform: scale(1.05);
            opacity: 0.9;
        }
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: scale(0.9);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: scale(1);
        }
        to {
            opacity: 0;
            transform: scale(0.9);
        }
    }
    
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes pulse-slow {
        0%, 100% {
            opacity: 0.3;
            transform: scale(1);
        }
        50% {
            opacity: 0.6;
            transform: scale(1.05);
        }
    }
    
    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
    
    .animate-pulse-slow {
        animation: pulse-slow 2s ease-in-out infinite;
    }
    
    .animate-fadeIn {
        animation: fadeIn 0.3s ease-out forwards;
    }
    
    .animate-fadeOut {
        animation: fadeOut 0.3s ease-out forwards;
    }
    
    .animate-slideInRight {
        animation: slideInRight 0.3s ease-out forwards;
    }
    
    .border-3 {
        border-width: 3px;
    }
    
    .avatar-uploading {
        animation: avatarPulse 1s ease-in-out infinite;
    }
    
    /* Ripple effect for button */
    .ripple {
        position: relative;
        overflow: hidden;
    }
    
    .ripple::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: translate(-50%, -50%);
        transition: width 0.6s, height 0.6s;
    }
    
    .ripple:active::after {
        width: 300px;
        height: 300px;
    }
`;

if (!document.querySelector('#avatar-styles')) {
    const style = document.createElement('style');
    style.id = 'avatar-styles';
    style.textContent = avatarStyles;
    document.head.appendChild(style);
}