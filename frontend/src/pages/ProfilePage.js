// frontend/src/pages/ProfilePage.js
// Profile Page - User profile with database connection

import { Sidebar } from '../components/layout/Sidebar.js';
import { AIChatSidebar } from '../components/layout/AIChatSidebar.js';
import { Header } from '../components/common/Header.js';
import { showError, showSuccess } from '../components/common/ErrorMessage.js';

export async function ProfilePage() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const token = localStorage.getItem('token');
    
    if (!isAuthenticated) {
        window.location.hash = '#/login';
        return '';
    }
    
    const userId = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail') || '';
    const userName = localStorage.getItem('userName') || 'User';
    
    // Fetch profile data from database
    let profileData = {
        full_name: userName,
        email: userEmail,
        bio: '',
        location: '',
        website: ''
    };
    
    let stats = {
        totalQuizzes: 0,
        averageScore: 0,
        perfectScores: 0,
        currentStreak: 0,
        longestStreak: 0,
        totalPoints: 0,
        totalQuestionsAnswered: 0,
        correctAnswers: 0,
        savedNotes: 0
    };
    
    let recentActivity = [];
    
    try {
        // Fetch profile from database
        const API_URL = window.API_URL || 'http://localhost:10000/api';
        
        const profileResponse = await fetch(`${API_URL}/user/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (profileResponse.ok) {
            const profileResult = await profileResponse.json();
            if (profileResult.success && profileResult.profile) {
                profileData = {
                    full_name: profileResult.profile.full_name || userName,
                    email: profileResult.profile.email || userEmail,
                    bio: profileResult.profile.bio || '',
                    location: profileResult.profile.location || '',
                    website: profileResult.profile.website || ''
                };
                
                // Update localStorage
                localStorage.setItem('userName', profileData.full_name);
                localStorage.setItem('userEmail', profileData.email);
                localStorage.setItem('userBio', profileData.bio);
                localStorage.setItem('userLocation', profileData.location);
                localStorage.setItem('userWebsite', profileData.website);
            }
        }
        
        // Fetch user stats
        const statsResponse = await fetch(`${API_URL}/user/stats`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (statsResponse.ok) {
            const statsResult = await statsResponse.json();
            if (statsResult.success && statsResult.stats) {
                stats = { ...stats, ...statsResult.stats };
            }
        }
        
        // Fetch recent activity (quiz attempts)
        const attemptsResponse = await fetch(`${API_URL}/quiz/attempts/all`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (attemptsResponse.ok) {
            const attemptsResult = await attemptsResponse.json();
            if (attemptsResult.success && attemptsResult.attempts) {
                recentActivity = attemptsResult.attempts.slice(0, 5).map(attempt => ({
                    type: 'quiz',
                    message: `Completed ${attempt.quizzes?.title || 'Quiz'} with ${Math.round(attempt.percentage)}% score`,
                    date: attempt.completed_at
                }));
            }
        }
        
        // Fetch achievements
        const achievementsResponse = await fetch(`${API_URL}/user/achievements`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (achievementsResponse.ok) {
            const achievementsResult = await achievementsResponse.json();
            if (achievementsResult.success && achievementsResult.achievements) {
                const recentAchievements = achievementsResult.achievements.filter(a => a.earned).slice(0, 3);
                recentActivity.push(...recentAchievements.map(ach => ({
                    type: 'achievement',
                    message: `Earned "${ach.name}" achievement!`,
                    date: ach.earnedAt
                })));
                recentActivity.sort((a, b) => new Date(b.date) - new Date(a.date));
                recentActivity = recentActivity.slice(0, 5);
            }
        }
        
    } catch (error) {
        console.error('Error fetching profile data:', error);
    }
    
    const memberSince = localStorage.getItem('memberSince') || new Date().toISOString().split('T')[0];
    
    return `
        <div class="min-h-screen bg-gradient-to-b from-[#111827] to-[#0F172A] relative">
            ${Sidebar()}
            ${AIChatSidebar()}
            <div id="mainContent" class="min-h-screen transition-all duration-300" 
                 style="margin-left: 256px; margin-right: 384px; width: calc(100% - 640px);">
                ${Header({ title: 'My Profile' })}
                <main class="container mx-auto px-4 py-8">
                    <div class="max-w-4xl mx-auto">
                        <!-- Profile Header -->
                        <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-8 mb-6 border border-[#374151] animate-fadeInUp">
                            <div class="flex flex-col md:flex-row items-center gap-6">
                                <!-- Avatar -->
                                <div class="relative">
                                    <div class="w-28 h-28 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-2xl flex items-center justify-center shadow-xl">
                                        <span class="text-4xl font-bold text-white">${getInitials(profileData.full_name)}</span>
                                    </div>
                                </div>
                                
                                <!-- User Info -->
                                <div class="flex-1 text-center md:text-left">
                                    <h1 class="text-3xl font-bold text-white mb-2">${escapeHtml(profileData.full_name)}</h1>
                                    <p class="text-gray-400 flex items-center justify-center md:justify-start gap-2">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                        </svg>
                                        ${escapeHtml(profileData.email)}
                                    </p>
                                    ${profileData.location ? `
                                        <p class="text-gray-500 text-sm mt-2 flex items-center justify-center md:justify-start gap-1">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                            </svg>
                                            ${escapeHtml(profileData.location)}
                                        </p>
                                    ` : ''}
                                    <p class="text-gray-500 text-xs mt-2">Member since ${memberSince}</p>
                                </div>
                            </div>
                            
                            ${profileData.bio ? `
                                <div class="mt-6 pt-4 border-t border-[#374151]">
                                    <p class="text-gray-300 text-sm">${escapeHtml(profileData.bio)}</p>
                                </div>
                            ` : ''}
                            
                            ${profileData.website ? `
                                <div class="mt-3">
                                    <a href="${profileData.website}" target="_blank" class="text-[#60A5FA] hover:text-[#3B82F6] text-sm inline-flex items-center gap-1">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.66 0 3-4.03 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4.03-3-9s1.34-9 3-9"></path>
                                        </svg>
                                        ${escapeHtml(profileData.website)}
                                    </a>
                                </div>
                            ` : ''}
                        </div>
                        
                        <!-- Stats Cards Row -->
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 animate-fadeInUp" style="animation-delay: 0.1s">
                            <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-4 text-center border border-[#374151]">
                                <div class="text-2xl font-bold text-[#3B82F6]">${stats.totalQuizzes || 0}</div>
                                <div class="text-xs text-[#9CA3AF] mt-1">Quizzes Taken</div>
                            </div>
                            <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-4 text-center border border-[#374151]">
                                <div class="text-2xl font-bold text-[#3B82F6]">${stats.averageScore || 0}%</div>
                                <div class="text-xs text-[#9CA3AF] mt-1">Avg Score</div>
                            </div>
                            <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-4 text-center border border-[#374151]">
                                <div class="text-2xl font-bold text-[#3B82F6]">${stats.perfectScores || 0}</div>
                                <div class="text-xs text-[#9CA3AF] mt-1">Perfect Scores</div>
                            </div>
                            <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-4 text-center border border-[#374151]">
                                <div class="text-2xl font-bold text-[#3B82F6]">${stats.savedNotes || 0}</div>
                                <div class="text-xs text-[#9CA3AF] mt-1">Saved Notes</div>
                            </div>
                        </div>
                        
                        <!-- Recent Activity -->
                        <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-6 border border-[#374151] mb-6 animate-fadeInUp" style="animation-delay: 0.2s">
                            <div class="flex items-center gap-3 mb-4">
                                <div class="w-8 h-8 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-lg flex items-center justify-center">
                                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </div>
                                <h3 class="text-lg font-bold text-white">Recent Activity</h3>
                            </div>
                            <div class="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
                                ${recentActivity.length > 0 ? recentActivity.map((activity, index) => `
                                    <div class="flex items-center gap-3 p-3 bg-[#111827] rounded-xl hover:bg-[#1F2937] transition-all duration-300">
                                        <div class="w-8 h-8 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-lg flex items-center justify-center">
                                            ${activity.type === 'quiz' ? '📊' : '🏆'}
                                        </div>
                                        <div class="flex-1">
                                            <p class="text-sm text-[#E5E7EB]">${escapeHtml(activity.message)}</p>
                                            <p class="text-xs text-[#6B7280] mt-0.5">${formatDate(activity.date)}</p>
                                        </div>
                                    </div>
                                `).join('') : `
                                    <div class="text-center py-8">
                                        <svg class="w-12 h-12 mx-auto text-[#4B5563] mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                        <p class="text-[#9CA3AF] text-sm">No recent activity</p>
                                        <p class="text-xs text-[#6B7280] mt-1">Complete quizzes to see your activity here</p>
                                    </div>
                                `}
                            </div>
                        </div>
                        
                        <!-- Edit Profile Form -->
                        <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-6 border border-[#374151] animate-fadeInUp" style="animation-delay: 0.3s">
                            <div class="flex items-center gap-3 mb-6 pb-3 border-b border-[#374151]">
                                <div class="w-8 h-8 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-lg flex items-center justify-center">
                                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                                    </svg>
                                </div>
                                <h3 class="text-xl font-bold text-white">Edit Profile</h3>
                            </div>
                            
                            <form id="profileForm" class="space-y-5">
                                <div>
                                    <label class="block text-sm font-medium text-[#E5E7EB] mb-2">Full Name</label>
                                    <input type="text" 
                                           id="profileName" 
                                           value="${escapeHtml(profileData.full_name)}"
                                           class="w-full bg-[#111827] border-2 border-[#374151] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#3B82F6] transition-all">
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-[#E5E7EB] mb-2">Email</label>
                                    <input type="email" 
                                           id="profileEmail" 
                                           value="${escapeHtml(profileData.email)}"
                                           class="w-full bg-[#111827] border-2 border-[#374151] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#3B82F6] transition-all">
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-[#E5E7EB] mb-2">Bio</label>
                                    <textarea 
                                           id="profileBio" 
                                           rows="3"
                                           class="w-full bg-[#111827] border-2 border-[#374151] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#3B82F6] transition-all"
                                           placeholder="Tell us about yourself">${escapeHtml(profileData.bio)}</textarea>
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-[#E5E7EB] mb-2">Location</label>
                                    <input type="text" 
                                           id="profileLocation" 
                                           value="${escapeHtml(profileData.location)}"
                                           class="w-full bg-[#111827] border-2 border-[#374151] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#3B82F6] transition-all"
                                           placeholder="City, Country">
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-[#E5E7EB] mb-2">Website</label>
                                    <input type="url" 
                                           id="profileWebsite" 
                                           value="${escapeHtml(profileData.website)}"
                                           class="w-full bg-[#111827] border-2 border-[#374151] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#3B82F6] transition-all"
                                           placeholder="https://your-website.com">
                                </div>
                                
                                <button type="submit" 
                                        id="saveProfileBtn"
                                        class="w-full bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] hover:from-[#60A5FA] hover:to-[#8B5CF6] text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105">
                                    Save Changes
                                </button>
                            </form>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    `;
}

// Helper functions
function getInitials(name) {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function formatDate(dateString) {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / 86400000);
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Setup profile page events
export function setupProfilePage() {
    const form = document.getElementById('profileForm');
    const saveBtn = document.getElementById('saveProfileBtn');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('profileName')?.value.trim();
            const email = document.getElementById('profileEmail')?.value.trim();
            const bio = document.getElementById('profileBio')?.value.trim();
            const location = document.getElementById('profileLocation')?.value.trim();
            const website = document.getElementById('profileWebsite')?.value.trim();
            const token = localStorage.getItem('token');
            const API_URL = window.API_URL || 'http://localhost:10000/api';
            
            if (saveBtn) {
                const originalText = saveBtn.innerHTML;
                saveBtn.innerHTML = '<div class="loading-spinner-small"></div> Saving...';
                saveBtn.disabled = true;
                
                try {
                    const response = await fetch(`${API_URL}/user/profile`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            full_name: name,
                            email: email,
                            bio: bio,
                            location: location,
                            website: website
                        })
                    });
                    
                    const data = await response.json();
                    
                    if (!response.ok) {
                        throw new Error(data.error || 'Failed to update profile');
                    }
                    
                    // Update localStorage
                    localStorage.setItem('userName', name);
                    localStorage.setItem('userEmail', email);
                    localStorage.setItem('userBio', bio);
                    localStorage.setItem('userLocation', location);
                    localStorage.setItem('userWebsite', website);
                    
                    showSuccess('Profile updated successfully!', 'success');
                    
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                    
                } catch (error) {
                    console.error('Save error:', error);
                    showError(error.message || 'Failed to save profile', 'error');
                } finally {
                    saveBtn.innerHTML = originalText;
                    saveBtn.disabled = false;
                }
            }
        });
    }
}

// Add CSS animations
const profilePageStyles = `
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
    
    .animate-fadeInUp {
        animation: fadeInUp 0.5s ease-out forwards;
        opacity: 0;
    }
    
    .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-track {
        background: #1F2937;
        border-radius: 10px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #3B82F6;
        border-radius: 10px;
    }
    
    .loading-spinner-small {
        width: 20px;
        height: 20px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
        display: inline-block;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;

if (!document.querySelector('#profile-page-styles')) {
    const style = document.createElement('style');
    style.id = 'profile-page-styles';
    style.textContent = profilePageStyles;
    document.head.appendChild(style);
}