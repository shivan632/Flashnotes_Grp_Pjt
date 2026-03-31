// frontend/src/components/profile/ProfileEditForm.js
// Profile Edit Form Component - Enhanced UI with beautiful animations

export function ProfileEditForm({ user, onSave }) {
    const { name = '', email = '', bio = '', location = '', website = '' } = user;
    
    return `
        <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-6 border border-[#374151] shadow-xl animate-fadeInUp">
            <!-- Header -->
            <div class="flex items-center gap-3 mb-6 pb-3 border-b border-[#374151]">
                <div class="relative">
                    <div class="absolute inset-0 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div class="w-10 h-10 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                    </div>
                </div>
                <div>
                    <h3 class="text-xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">Edit Profile</h3>
                    <p class="text-xs text-[#6B7280] mt-0.5">Update your personal information</p>
                </div>
            </div>
            
            <form id="profileEditForm" class="space-y-5">
                <!-- Name Field -->
                <div class="group">
                    <label class="block text-sm font-medium text-[#E5E7EB] mb-2 transition-all group-focus-within:text-[#3B82F6]">
                        <span class="flex items-center gap-1">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                            Full Name
                        </span>
                    </label>
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <div class="w-8 h-8 rounded-lg bg-[#1F2937] flex items-center justify-center transition-all group-focus-within:bg-[#3B82F6]/20">
                                <svg class="w-4 h-4 text-[#9CA3AF] group-focus-within:text-[#3B82F6] transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                </svg>
                            </div>
                        </div>
                        <input type="text" 
                               id="profileName" 
                               value="${escapeHtml(name)}"
                               class="w-full bg-[#111827] border-2 border-[#374151] rounded-xl pl-14 pr-4 py-3 text-[#E5E7EB] placeholder-[#6B7280] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/30 transition-all duration-300 hover:border-[#4B5563]"
                               placeholder="Enter your full name">
                        <div class="absolute inset-y-0 right-0 flex items-center pr-3 opacity-0 group-focus-within:opacity-100 transition-opacity">
                            <span class="text-xs text-[#3B82F6]">✓</span>
                        </div>
                    </div>
                </div>
                
                <!-- Email Field -->
                <div class="group">
                    <label class="block text-sm font-medium text-[#E5E7EB] mb-2 transition-all group-focus-within:text-[#3B82F6]">
                        <span class="flex items-center gap-1">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                            Email Address
                        </span>
                    </label>
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <div class="w-8 h-8 rounded-lg bg-[#1F2937] flex items-center justify-center transition-all group-focus-within:bg-[#3B82F6]/20">
                                <svg class="w-4 h-4 text-[#9CA3AF] group-focus-within:text-[#3B82F6] transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                </svg>
                            </div>
                        </div>
                        <input type="email" 
                               id="profileEmail" 
                               value="${escapeHtml(email)}"
                               class="w-full bg-[#111827] border-2 border-[#374151] rounded-xl pl-14 pr-4 py-3 text-[#E5E7EB] placeholder-[#6B7280] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/30 transition-all duration-300 hover:border-[#4B5563]"
                               placeholder="Enter your email">
                    </div>
                </div>
                
                <!-- Bio Field -->
                <div class="group">
                    <label class="block text-sm font-medium text-[#E5E7EB] mb-2 transition-all group-focus-within:text-[#3B82F6]">
                        <span class="flex items-center gap-1">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path>
                            </svg>
                            Bio
                        </span>
                    </label>
                    <div class="relative">
                        <div class="absolute top-3 left-0 pl-3 pointer-events-none">
                            <div class="w-8 h-8 rounded-lg bg-[#1F2937] flex items-center justify-center transition-all group-focus-within:bg-[#3B82F6]/20">
                                <svg class="w-4 h-4 text-[#9CA3AF] group-focus-within:text-[#3B82F6] transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path>
                                </svg>
                            </div>
                        </div>
                        <textarea 
                               id="profileBio" 
                               rows="4"
                               class="w-full bg-[#111827] border-2 border-[#374151] rounded-xl pl-14 pr-4 py-3 text-[#E5E7EB] placeholder-[#6B7280] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/30 transition-all duration-300 hover:border-[#4B5563] resize-none"
                               placeholder="Tell us about yourself...">${escapeHtml(bio)}</textarea>
                        <div class="absolute bottom-2 right-3 text-xs text-[#6B7280]">
                            <span id="bioCharCount">${bio.length}</span>/200
                        </div>
                    </div>
                </div>
                
                <!-- Location Field -->
                <div class="group">
                    <label class="block text-sm font-medium text-[#E5E7EB] mb-2 transition-all group-focus-within:text-[#3B82F6]">
                        <span class="flex items-center gap-1">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                            Location
                        </span>
                    </label>
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <div class="w-8 h-8 rounded-lg bg-[#1F2937] flex items-center justify-center transition-all group-focus-within:bg-[#3B82F6]/20">
                                <svg class="w-4 h-4 text-[#9CA3AF] group-focus-within:text-[#3B82F6] transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                </svg>
                            </div>
                        </div>
                        <input type="text" 
                               id="profileLocation" 
                               value="${escapeHtml(location)}"
                               class="w-full bg-[#111827] border-2 border-[#374151] rounded-xl pl-14 pr-4 py-3 text-[#E5E7EB] placeholder-[#6B7280] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/30 transition-all duration-300 hover:border-[#4B5563]"
                               placeholder="Your location">
                    </div>
                </div>
                
                <!-- Website Field -->
                <div class="group">
                    <label class="block text-sm font-medium text-[#E5E7EB] mb-2 transition-all group-focus-within:text-[#3B82F6]">
                        <span class="flex items-center gap-1">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.66 0 3-4.03 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4.03-3-9s1.34-9 3-9"></path>
                            </svg>
                            Website
                        </span>
                    </label>
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <div class="w-8 h-8 rounded-lg bg-[#1F2937] flex items-center justify-center transition-all group-focus-within:bg-[#3B82F6]/20">
                                <svg class="w-4 h-4 text-[#9CA3AF] group-focus-within:text-[#3B82F6] transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.66 0 3-4.03 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4.03-3-9s1.34-9 3-9"></path>
                                </svg>
                            </div>
                        </div>
                        <input type="url" 
                               id="profileWebsite" 
                               value="${escapeHtml(website)}"
                               class="w-full bg-[#111827] border-2 border-[#374151] rounded-xl pl-14 pr-4 py-3 text-[#E5E7EB] placeholder-[#6B7280] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/30 transition-all duration-300 hover:border-[#4B5563]"
                               placeholder="https://your-website.com">
                    </div>
                </div>
                
                <!-- Submit Button -->
                <button type="submit" 
                        id="saveProfileBtn"
                        class="group/btn relative w-full bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] hover:from-[#60A5FA] hover:to-[#8B5CF6] text-white py-3.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl flex items-center justify-center gap-2 overflow-hidden">
                    <div class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                    <svg class="w-5 h-5 group-hover/btn:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Save Changes</span>
                </button>
            </form>
        </div>
    `;
}

// Setup profile edit form events
export function setupProfileEditForm(onSave) {
    const form = document.getElementById('profileEditForm');
    const submitBtn = document.getElementById('saveProfileBtn');
    const bioTextarea = document.getElementById('profileBio');
    const charCountSpan = document.getElementById('bioCharCount');
    
    // Character counter for bio
    if (bioTextarea && charCountSpan) {
        const updateCharCount = () => {
            const length = bioTextarea.value.length;
            charCountSpan.textContent = length;
            if (length > 200) {
                charCountSpan.classList.add('text-red-500');
                charCountSpan.classList.remove('text-[#6B7280]');
            } else {
                charCountSpan.classList.remove('text-red-500');
                charCountSpan.classList.add('text-[#6B7280]');
            }
        };
        bioTextarea.addEventListener('input', updateCharCount);
        updateCharCount();
    }
    
    // Input focus effects
    const inputs = document.querySelectorAll('#profileEditForm input, #profileEditForm textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement?.classList.add('ring-2', 'ring-[#3B82F6]/20');
        });
        input.addEventListener('blur', () => {
            input.parentElement?.classList.remove('ring-2', 'ring-[#3B82F6]/20');
        });
    });
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('profileName')?.value;
            const email = document.getElementById('profileEmail')?.value;
            const bio = document.getElementById('profileBio')?.value;
            const location = document.getElementById('profileLocation')?.value;
            const website = document.getElementById('profileWebsite')?.value;
            
            // Validation
            if (!name || !email) {
                showNotification('Name and email are required', 'error');
                return;
            }
            
            if (bio && bio.length > 200) {
                showNotification('Bio must be less than 200 characters', 'error');
                return;
            }
            
            if (submitBtn) {
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<div class="loading-spinner-small"></div> Saving...';
                submitBtn.disabled = true;
                
                // Add pulse animation
                submitBtn.classList.add('animate-pulse');
                
                try {
                    if (onSave) {
                        await onSave({ name, email, bio, location, website });
                    }
                    showNotification('Profile updated successfully!', 'success');
                } catch (error) {
                    console.error('Save error:', error);
                    showNotification('Failed to save profile. Please try again.', 'error');
                } finally {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('animate-pulse');
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

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add CSS animations
const profileEditStyles = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
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
    
    .animate-fadeInUp {
        animation: fadeInUp 0.5s ease-out forwards;
    }
    
    .animate-slideInRight {
        animation: slideInRight 0.3s ease-out forwards;
    }
    
    .animate-fadeOut {
        animation: fadeOut 0.3s ease-out forwards;
    }
    
    .loading-spinner-small {
        width: 18px;
        height: 18px;
        border: 2px solid rgba(255,255,255,0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
        display: inline-block;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;

if (!document.querySelector('#profile-edit-styles')) {
    const style = document.createElement('style');
    style.id = 'profile-edit-styles';
    style.textContent = profileEditStyles;
    document.head.appendChild(style);
}