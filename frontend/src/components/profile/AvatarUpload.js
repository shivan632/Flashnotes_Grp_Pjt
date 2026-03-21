// frontend/src/components/profile/AvatarUpload.js
// Avatar Upload Component - Enhanced UI

export function AvatarUpload({ currentAvatar, userName, onAvatarChange }) {
    const initials = userName ? userName.charAt(0).toUpperCase() : 'U';
    
    return `
        <div class="relative group">
            <!-- Avatar Container -->
            <div class="relative w-32 h-32 mx-auto">
                <div class="absolute inset-0 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div class="relative w-32 h-32 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform duration-300 cursor-pointer overflow-hidden"
                     id="avatarContainer">
                    ${currentAvatar ? `
                        <img src="${currentAvatar}" alt="Avatar" class="w-full h-full object-cover">
                    ` : `
                        <span class="text-white text-4xl font-bold">${initials}</span>
                    `}
                    <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] text-white px-4 py-1.5 rounded-full text-xs font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                </svg>
                Change
            </button>
            
            <!-- Upload Progress (Hidden by default) -->
            <div id="uploadProgress" class="absolute inset-0 bg-[#1F2937] rounded-full flex items-center justify-center hidden">
                <div class="loading-spinner-small"></div>
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
    
    if (uploadBtn && avatarInput) {
        uploadBtn.addEventListener('click', () => {
            avatarInput.click();
        });
        
        avatarInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }
            
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Image size should be less than 5MB');
                return;
            }
            
            // Show progress
            if (uploadProgress) {
                uploadProgress.classList.remove('hidden');
            }
            if (avatarContainer) {
                avatarContainer.classList.add('opacity-50');
            }
            
            try {
                // Create preview
                const reader = new FileReader();
                reader.onload = (event) => {
                    if (avatarContainer) {
                        avatarContainer.innerHTML = `
                            <img src="${event.target.result}" alt="Avatar" class="w-full h-full object-cover">
                            <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                </svg>
                            </div>
                        `;
                    }
                };
                reader.readAsDataURL(file);
                
                // Here you would upload to your server
                // For now, just simulate upload
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                if (onSuccess) onSuccess(file);
                
            } catch (error) {
                console.error('Upload error:', error);
                alert('Failed to upload image. Please try again.');
            } finally {
                if (uploadProgress) {
                    uploadProgress.classList.add('hidden');
                }
                if (avatarContainer) {
                    avatarContainer.classList.remove('opacity-50');
                }
            }
        });
    }
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
    
    .avatar-uploading {
        animation: avatarPulse 1s ease-in-out infinite;
    }
`;

if (!document.querySelector('#avatar-styles')) {
    const style = document.createElement('style');
    style.id = 'avatar-styles';
    style.textContent = avatarStyles;
    document.head.appendChild(style);
}