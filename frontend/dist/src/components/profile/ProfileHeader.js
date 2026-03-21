// frontend/src/components/profile/ProfileHeader.js
// Profile Header Component - Enhanced UI

export function ProfileHeader({ user, stats }) {
    const { name = 'User', email = '', avatar = null, bio = '', memberSince = new Date() } = user;
    const { quizzesTaken = 0, perfectScores = 0, savedNotes = 0, streak = 0 } = stats;
    const initials = name.charAt(0).toUpperCase();
    
    const memberDate = new Date(memberSince).toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
    });
    
    return `
        <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-6 border border-[#374151]">
            <div class="flex flex-col md:flex-row items-center md:items-start gap-6">
                <!-- Avatar Section -->
                <div class="relative group">
                    <div class="absolute inset-0 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div class="relative w-24 h-24 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform duration-300">
                        ${avatar ? `
                            <img src="${avatar}" alt="${name}" class="w-full h-full object-cover rounded-full">
                        ` : `
                            <span class="text-white text-3xl font-bold">${initials}</span>
                        `}
                    </div>
                </div>
                
                <!-- User Info -->
                <div class="flex-1 text-center md:text-left">
                    <h2 class="text-2xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">${escapeHtml(name)}</h2>
                    <p class="text-[#9CA3AF] text-sm mt-1 flex items-center justify-center md:justify-start gap-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                        ${escapeHtml(email)}
                    </p>
                    ${bio ? `
                        <p class="text-[#E5E7EB] text-sm mt-3 max-w-md leading-relaxed">${escapeHtml(bio)}</p>
                    ` : ''}
                    <p class="text-[#6B7280] text-xs mt-3 flex items-center justify-center md:justify-start gap-1">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        Member since ${memberDate}
                    </p>
                </div>
                
                <!-- Edit Button -->
                <button id="editProfileBtn" class="bg-[#374151] hover:bg-gradient-to-r hover:from-[#3B82F6] hover:to-[#A78BFA] text-[#E5E7EB] hover:text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                    </svg>
                    Edit Profile
                </button>
            </div>
            
            <!-- Stats Grid -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#374151]">
                <div class="text-center group cursor-pointer hover:scale-105 transition-transform">
                    <div class="text-2xl font-bold text-[#3B82F6] group-hover:scale-110 transition-transform">${quizzesTaken}</div>
                    <div class="text-xs text-[#9CA3AF] mt-1">Quizzes Taken</div>
                </div>
                <div class="text-center group cursor-pointer hover:scale-105 transition-transform">
                    <div class="text-2xl font-bold text-[#3B82F6] group-hover:scale-110 transition-transform">${perfectScores}</div>
                    <div class="text-xs text-[#9CA3AF] mt-1">Perfect Scores</div>
                </div>
                <div class="text-center group cursor-pointer hover:scale-105 transition-transform">
                    <div class="text-2xl font-bold text-[#3B82F6] group-hover:scale-110 transition-transform">${savedNotes}</div>
                    <div class="text-xs text-[#9CA3AF] mt-1">Saved Notes</div>
                </div>
                <div class="text-center group cursor-pointer hover:scale-105 transition-transform">
                    <div class="text-2xl font-bold text-[#3B82F6] group-hover:scale-110 transition-transform">${streak}</div>
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
        editBtn.addEventListener('click', () => {
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