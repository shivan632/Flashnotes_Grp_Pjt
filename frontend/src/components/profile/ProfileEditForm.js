// frontend/src/components/profile/ProfileEditForm.js
// Profile Edit Form Component - Enhanced UI

export function ProfileEditForm({ user, onSave }) {
    const { name = '', email = '', bio = '', location = '', website = '' } = user;
    
    return `
        <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-6 border border-[#374151]">
            <div class="flex items-center gap-3 mb-6 pb-3 border-b border-[#374151]">
                <div class="w-8 h-8 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-xl flex items-center justify-center">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                </div>
                <h3 class="text-xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">Edit Profile</h3>
            </div>
            
            <form id="profileEditForm" class="space-y-5">
                <!-- Name Field -->
                <div class="group">
                    <label class="block text-sm font-medium text-[#E5E7EB] mb-2 transition-colors group-focus-within:text-[#3B82F6]">
                        Full Name
                    </label>
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg class="w-5 h-5 text-[#9CA3AF] group-focus-within:text-[#3B82F6] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                        </div>
                        <input type="text" 
                               id="profileName" 
                               value="${escapeHtml(name)}"
                               class="w-full bg-[#111827] border-2 border-[#374151] rounded-xl pl-10 pr-4 py-3 text-[#E5E7EB] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/30 transition-all duration-300"
                               placeholder="Enter your full name">
                    </div>
                </div>
                
                <!-- Email Field -->
                <div class="group">
                    <label class="block text-sm font-medium text-[#E5E7EB] mb-2 transition-colors group-focus-within:text-[#3B82F6]">
                        Email Address
                    </label>
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg class="w-5 h-5 text-[#9CA3AF] group-focus-within:text-[#3B82F6] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                        </div>
                        <input type="email" 
                               id="profileEmail" 
                               value="${escapeHtml(email)}"
                               class="w-full bg-[#111827] border-2 border-[#374151] rounded-xl pl-10 pr-4 py-3 text-[#E5E7EB] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/30 transition-all duration-300"
                               placeholder="Enter your email">
                    </div>
                </div>
                
                <!-- Bio Field -->
                <div class="group">
                    <label class="block text-sm font-medium text-[#E5E7EB] mb-2 transition-colors group-focus-within:text-[#3B82F6]">
                        Bio
                    </label>
                    <div class="relative">
                        <div class="absolute top-3 left-0 pl-3 pointer-events-none">
                            <svg class="w-5 h-5 text-[#9CA3AF] group-focus-within:text-[#3B82F6] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path>
                            </svg>
                        </div>
                        <textarea 
                               id="profileBio" 
                               rows="3"
                               class="w-full bg-[#111827] border-2 border-[#374151] rounded-xl pl-10 pr-4 py-3 text-[#E5E7EB] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/30 transition-all duration-300"
                               placeholder="Tell us about yourself">${escapeHtml(bio)}</textarea>
                    </div>
                </div>
                
                <!-- Location Field -->
                <div class="group">
                    <label class="block text-sm font-medium text-[#E5E7EB] mb-2 transition-colors group-focus-within:text-[#3B82F6]">
                        Location
                    </label>
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg class="w-5 h-5 text-[#9CA3AF] group-focus-within:text-[#3B82F6] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                        </div>
                        <input type="text" 
                               id="profileLocation" 
                               value="${escapeHtml(location)}"
                               class="w-full bg-[#111827] border-2 border-[#374151] rounded-xl pl-10 pr-4 py-3 text-[#E5E7EB] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/30 transition-all duration-300"
                               placeholder="Your location">
                    </div>
                </div>
                
                <!-- Website Field -->
                <div class="group">
                    <label class="block text-sm font-medium text-[#E5E7EB] mb-2 transition-colors group-focus-within:text-[#3B82F6]">
                        Website
                    </label>
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg class="w-5 h-5 text-[#9CA3AF] group-focus-within:text-[#3B82F6] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.66 0 3-4.03 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4.03-3-9s1.34-9 3-9"></path>
                            </svg>
                        </div>
                        <input type="url" 
                               id="profileWebsite" 
                               value="${escapeHtml(website)}"
                               class="w-full bg-[#111827] border-2 border-[#374151] rounded-xl pl-10 pr-4 py-3 text-[#E5E7EB] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/30 transition-all duration-300"
                               placeholder="https://your-website.com">
                    </div>
                </div>
                
                <!-- Submit Button -->
                <button type="submit" 
                        id="saveProfileBtn"
                        class="w-full bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] hover:from-[#60A5FA] hover:to-[#8B5CF6] text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Save Changes
                </button>
            </form>
        </div>
    `;
}

// Setup profile edit form events
export function setupProfileEditForm(onSave) {
    const form = document.getElementById('profileEditForm');
    const submitBtn = document.getElementById('saveProfileBtn');
    
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
                alert('Name and email are required');
                return;
            }
            
            if (submitBtn) {
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<div class="loading-spinner-small"></div> Saving...';
                submitBtn.disabled = true;
                
                try {
                    if (onSave) {
                        await onSave({ name, email, bio, location, website });
                    }
                } catch (error) {
                    console.error('Save error:', error);
                    alert('Failed to save profile. Please try again.');
                } finally {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }
            }
        });
    }
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}