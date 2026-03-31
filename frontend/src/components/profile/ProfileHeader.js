// frontend/src/components/profile/ProfileHeader.js
// Profile Header Component - Enhanced UI with beautiful animations

export function ProfileHeader({ user, stats }) {
    const { name = 'User', email = '', avatar = null, bio = '', memberSince = new Date() } = user;
    const { quizzesTaken = 0, perfectScores = 0, savedNotes = 0, streak = 0 } = stats;
    const initials = name.charAt(0).toUpperCase();
    
    const memberDate = new Date(memberSince).toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
    });
    
    return `
        <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-6 border border-[#374151] shadow-xl animate-fadeInUp">
            <div class="flex flex-col md:flex-row items-center md:items-start gap-6">
                <!-- Avatar Section with 3D effect -->
                <div class="relative group">
                    <div class="absolute -inset-1 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full blur-xl opacity-0 group-hover:opacity-70 transition-all duration-500"></div>
                    <div class="absolute inset-0 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full animate-pulse-slow opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div class="relative w-28 h-28 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 overflow-hidden">
                        ${avatar ? `
                            <img src="${avatar}" alt="${name}" class="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500">
                        ` : `
                            <span class="text-white text-4xl font-bold bg-gradient-to-r from-white to-[#E5E7EB] bg-clip-text text-transparent">${initials}</span>
                        `}
                        <div class="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-[#1F2937] shadow-lg animate-pulse"></div>
                </div>
                
                <!-- User Info -->
                <div class="flex-1 text-center md:text-left">
                    <div class="flex items-center justify-center md:justify-start gap-2 flex-wrap">
                        <h2 class="text-2xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">${escapeHtml(name)}</h2>
                        <span class="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full flex items-center gap-1">
                            <span class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                            Active
                        </span>
                    </div>
                    <p class="text-[#9CA3AF] text-sm mt-2 flex items-center justify-center md:justify-start gap-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                        ${escapeHtml(email)}
                    </p>
                    ${bio ? `
                        <p class="text-[#E5E7EB] text-sm mt-3 max-w-md leading-relaxed bg-[#111827]/50 p-3 rounded-xl border-l-4 border-[#3B82F6]">${escapeHtml(bio)}</p>
                    ` : ''}
                    <p class="text-[#6B7280] text-xs mt-3 flex items-center justify-center md:justify-start gap-2">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        Member since ${memberDate}
                        <span class="w-1 h-1 bg-[#4B5563] rounded-full"></span>
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                        Profile ID: ${Math.random().toString(36).substr(2, 8).toUpperCase()}
                    </p>
                </div>
                
                <!-- Edit Button -->
                <button id="editProfileBtn" class="group/btn relative overflow-hidden bg-[#374151] hover:bg-gradient-to-r hover:from-[#3B82F6] hover:to-[#A78BFA] text-[#E5E7EB] hover:text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl">
                    <div class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                    <svg class="w-4 h-4 group-hover/btn:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                    </svg>
                    <span>Edit Profile</span>
                </button>
            </div>
            
            <!-- Stats Grid -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#374151]">
                <div class="text-center group cursor-pointer hover:scale-105 transition-all duration-300 p-3 rounded-xl hover:bg-[#1F2937]">
                    <div class="text-2xl font-bold text-[#3B82F6] group-hover:scale-110 transition-transform">${quizzesTaken}</div>
                    <div class="text-xs text-[#9CA3AF] mt-1 flex items-center justify-center gap-1">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        Quizzes Taken
                    </div>
                </div>
                <div class="text-center group cursor-pointer hover:scale-105 transition-all duration-300 p-3 rounded-xl hover:bg-[#1F2937]">
                    <div class="text-2xl font-bold text-[#F59E0B] group-hover:scale-110 transition-transform">${perfectScores}</div>
                    <div class="text-xs text-[#9CA3AF] mt-1 flex items-center justify-center gap-1">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                        </svg>
                        Perfect Scores
                    </div>
                </div>
                <div class="text-center group cursor-pointer hover:scale-105 transition-all duration-300 p-3 rounded-xl hover:bg-[#1F2937]">
                    <div class="text-2xl font-bold text-[#10B981] group-hover:scale-110 transition-transform">${savedNotes}</div>
                    <div class="text-xs text-[#9CA3AF] mt-1 flex items-center justify-center gap-1">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                        </svg>
                        Saved Notes
                    </div>
                </div>
                <div class="text-center group cursor-pointer hover:scale-105 transition-all duration-300 p-3 rounded-xl hover:bg-[#1F2937]">
                    <div class="text-2xl font-bold text-[#EF4444] group-hover:scale-110 transition-transform">${streak}</div>
                    <div class="text-xs text-[#9CA3AF] mt-1 flex items-center justify-center gap-1">
                        <span>🔥</span> Day Streak
                    </div>
                </div>
            </div>
        </div>
    `;
}

export function setupProfileHeader(onEdit) {
    const editBtn = document.getElementById('editProfileBtn');
    if (editBtn && onEdit) {
        const newBtn = editBtn.cloneNode(true);
        editBtn.parentNode.replaceChild(newBtn, editBtn);
        newBtn.addEventListener('click', () => {
            onEdit();
        });
    }
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}