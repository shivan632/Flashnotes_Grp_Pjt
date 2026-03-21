// frontend/src/pages/ProfilePage.js
// Profile Page - User profile with enhanced UI

import { Sidebar } from '../components/layout/Sidebar.js';
import { AIChatSidebar } from '../components/layout/AIChatSidebar.js';
import { Header } from '../components/common/Header.js';
import { AvatarUpload, setupAvatarUpload } from '../components/profile/AvatarUpload.js';
import { ProfileEditForm, setupProfileEditForm } from '../components/profile/ProfileEditForm.js';
import { ProfileHeader } from '../components/profile/ProfileHeader.js';
import { ProfileStats } from '../components/profile/ProfileStats.js';
import { getUserScores, getQuizAttempts, getUserAchievements } from '../services/scoreService.js';


export async function ProfilePage() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    if (!isAuthenticated) {
        window.location.hash = '#/login';
        return '';
    }
    
    const userName = localStorage.getItem('userName') || 'User';
    const userEmail = localStorage.getItem('userEmail') || 'user@example.com';
    const userAvatar = localStorage.getItem('userAvatar') || null;
    const memberSince = localStorage.getItem('memberSince') || new Date().toISOString();
    
    // Fetch user stats from backend
    let stats = {
        totalQuizzes: 24,
        averageScore: 85,
        perfectScores: 18,
        currentStreak: 7,
        longestStreak: 14,
        totalPoints: 1250,
        totalQuestionsAnswered: 240,
        correctAnswers: 204,
        savedNotes: 45
    };
    
    let recentActivity = [];
    
    try {
        const scores = await getUserScores();
        if (scores && scores.stats) {
            stats = { ...stats, ...scores.stats };
        }
        
        const attempts = await getQuizAttempts();
        if (attempts && attempts.length > 0) {
            recentActivity = attempts.slice(0, 5).map(attempt => ({
                type: 'quiz',
                message: `Completed ${attempt.quizzes?.title || 'Quiz'} with ${Math.round(attempt.percentage)}% score`,
                date: attempt.completed_at
            }));
        }
        
        const achievements = await getUserAchievements();
        if (achievements && achievements.achievements) {
            const recentAchievements = achievements.achievements.filter(a => a.earned).slice(0, 3);
            recentActivity.push(...recentAchievements.map(ach => ({
                type: 'achievement',
                message: `Earned "${ach.name}" achievement!`,
                date: ach.earnedAt
            })));
            recentActivity.sort((a, b) => new Date(b.date) - new Date(a.date));
            recentActivity = recentActivity.slice(0, 5);
        }
    } catch (error) {
        console.error('Error fetching profile data:', error);
    }
    
    const userData = {
        name: userName,
        email: userEmail,
        avatar: userAvatar,
        bio: localStorage.getItem('userBio') || 'AI enthusiast and lifelong learner passionate about technology and education.',
        location: localStorage.getItem('userLocation') || 'New York, USA',
        website: localStorage.getItem('userWebsite') || '',
        memberSince: memberSince
    };
    
    return `
        <div class="min-h-screen bg-gradient-to-b from-[#111827] to-[#0F172A] relative">
            ${Sidebar()}
            ${AIChatSidebar()}
            <div id="mainContent" class="min-h-screen transition-all duration-300" 
                 style="margin-left: 256px; margin-right: 384px; width: calc(100% - 640px);">
                ${Header({ title: 'My Profile' })}
                <main class="container mx-auto px-4 py-8">
                    <div class="max-w-4xl mx-auto">
                        <!-- Profile Header with Avatar -->
                        <div class="mb-6 animate-fadeInUp">
                            ${ProfileHeader({ 
                                user: userData, 
                                stats: {
                                    quizzesTaken: stats.totalQuizzes,
                                    perfectScores: stats.perfectScores,
                                    savedNotes: stats.savedNotes,
                                    streak: stats.currentStreak
                                }
                            })}
                        </div>
                        
                        <!-- Stats Cards Row -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 animate-fadeInUp" style="animation-delay: 0.1s">
                            <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-6 border border-[#374151]">
                                <div class="flex items-center justify-between mb-4">
                                    <h3 class="text-lg font-bold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">Performance</h3>
                                    <div class="w-8 h-8 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] rounded-lg flex items-center justify-center">
                                        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                                        </svg>
                                    </div>
                                </div>
                                <div class="space-y-3">
                                    <div>
                                        <div class="flex justify-between text-sm mb-1">
                                            <span class="text-[#9CA3AF]">Average Score</span>
                                            <span class="text-[#3B82F6] font-semibold">${stats.averageScore}%</span>
                                        </div>
                                        <div class="w-full bg-[#374151] rounded-full h-2">
                                            <div class="bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] h-2 rounded-full transition-all duration-500" style="width: ${stats.averageScore}%"></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div class="flex justify-between text-sm mb-1">
                                            <span class="text-[#9CA3AF]">Accuracy</span>
                                            <span class="text-[#3B82F6] font-semibold">${Math.round((stats.correctAnswers / stats.totalQuestionsAnswered) * 100)}%</span>
                                        </div>
                                        <div class="w-full bg-[#374151] rounded-full h-2">
                                            <div class="bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] h-2 rounded-full transition-all duration-500" style="width: ${Math.round((stats.correctAnswers / stats.totalQuestionsAnswered) * 100)}%"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-6 border border-[#374151]">
                                <div class="flex items-center justify-between mb-4">
                                    <h3 class="text-lg font-bold bg-gradient-to-r from-[#F59E0B] to-[#EF4444] bg-clip-text text-transparent">Streak Stats</h3>
                                    <div class="w-8 h-8 bg-gradient-to-r from-[#F59E0B] to-[#EF4444] rounded-lg flex items-center justify-center">
                                        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                        </svg>
                                    </div>
                                </div>
                                <div class="grid grid-cols-2 gap-4">
                                    <div class="text-center p-3 bg-[#111827] rounded-xl">
                                        <div class="text-2xl font-bold text-[#F59E0B]">${stats.currentStreak}</div>
                                        <div class="text-xs text-[#9CA3AF] mt-1">Current Streak</div>
                                    </div>
                                    <div class="text-center p-3 bg-[#111827] rounded-xl">
                                        <div class="text-2xl font-bold text-[#EF4444]">${stats.longestStreak}</div>
                                        <div class="text-xs text-[#9CA3AF] mt-1">Longest Streak</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Stats Grid -->
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 animate-fadeInUp" style="animation-delay: 0.2s">
                            <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-4 text-center border border-[#374151] group hover:border-[#3B82F6] transition-all duration-300">
                                <div class="text-2xl font-bold text-[#3B82F6] group-hover:scale-110 transition-transform">${stats.totalQuizzes}</div>
                                <div class="text-xs text-[#9CA3AF] mt-1">Quizzes Taken</div>
                            </div>
                            <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-4 text-center border border-[#374151] group hover:border-[#3B82F6] transition-all duration-300">
                                <div class="text-2xl font-bold text-[#3B82F6] group-hover:scale-110 transition-transform">${stats.perfectScores}</div>
                                <div class="text-xs text-[#9CA3AF] mt-1">Perfect Scores</div>
                            </div>
                            <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-4 text-center border border-[#374151] group hover:border-[#3B82F6] transition-all duration-300">
                                <div class="text-2xl font-bold text-[#3B82F6] group-hover:scale-110 transition-transform">${stats.savedNotes}</div>
                                <div class="text-xs text-[#9CA3AF] mt-1">Saved Notes</div>
                            </div>
                            <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-4 text-center border border-[#374151] group hover:border-[#3B82F6] transition-all duration-300">
                                <div class="text-2xl font-bold text-[#3B82F6] group-hover:scale-110 transition-transform">${stats.totalPoints}</div>
                                <div class="text-xs text-[#9CA3AF] mt-1">Total Points</div>
                            </div>
                        </div>
                        
                        <!-- Recent Activity -->
                        <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-6 border border-[#374151] mb-6 animate-fadeInUp" style="animation-delay: 0.3s">
                            <div class="flex items-center gap-3 mb-4">
                                <div class="w-8 h-8 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-lg flex items-center justify-center">
                                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </div>
                                <h3 class="text-lg font-bold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">Recent Activity</h3>
                            </div>
                            <div class="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
                                ${recentActivity.length > 0 ? recentActivity.map((activity, index) => `
                                    <div class="flex items-center gap-3 p-3 bg-[#111827] rounded-xl hover:bg-[#1F2937] transition-all duration-300" style="animation: slideInRight 0.3s ease-out ${index * 0.05}s forwards">
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
                        <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-6 border border-[#374151] animate-fadeInUp" style="animation-delay: 0.4s">
                            <div class="flex items-center gap-3 mb-6 pb-3 border-b border-[#374151]">
                                <div class="w-8 h-8 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-lg flex items-center justify-center">
                                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                                    </svg>
                                </div>
                                <h3 class="text-xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">Edit Profile</h3>
                            </div>
                            
                            <form id="profileForm" class="space-y-5">
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
                                               value="${escapeHtml(userName)}"
                                               class="w-full bg-[#111827] border-2 border-[#374151] rounded-xl pl-10 pr-4 py-3 text-[#E5E7EB] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/30 transition-all duration-300"
                                               placeholder="Enter your full name">
                                    </div>
                                </div>
                                
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
                                               value="${escapeHtml(userEmail)}"
                                               class="w-full bg-[#111827] border-2 border-[#374151] rounded-xl pl-10 pr-4 py-3 text-[#E5E7EB] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/30 transition-all duration-300"
                                               placeholder="Enter your email">
                                    </div>
                                </div>
                                
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
                                               rows="4"
                                               class="w-full bg-[#111827] border-2 border-[#374151] rounded-xl pl-10 pr-4 py-3 text-[#E5E7EB] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/30 transition-all duration-300"
                                               placeholder="Tell us about yourself">${escapeHtml(localStorage.getItem('userBio') || 'AI enthusiast and lifelong learner passionate about technology and education.')}</textarea>
                                    </div>
                                </div>
                                
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
                                               value="${escapeHtml(localStorage.getItem('userLocation') || 'New York, USA')}"
                                               class="w-full bg-[#111827] border-2 border-[#374151] rounded-xl pl-10 pr-4 py-3 text-[#E5E7EB] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/30 transition-all duration-300"
                                               placeholder="Your location">
                                    </div>
                                </div>
                                
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
                                               value="${escapeHtml(localStorage.getItem('userWebsite') || '')}"
                                               class="w-full bg-[#111827] border-2 border-[#374151] rounded-xl pl-10 pr-4 py-3 text-[#E5E7EB] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/30 transition-all duration-300"
                                               placeholder="https://your-website.com">
                                    </div>
                                </div>
                                
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
                    </div>
                </main>
            </div>
        </div>
    `;
}

// Helper functions
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
            
            const name = document.getElementById('profileName')?.value;
            const email = document.getElementById('profileEmail')?.value;
            const bio = document.getElementById('profileBio')?.value;
            const location = document.getElementById('profileLocation')?.value;
            const website = document.getElementById('profileWebsite')?.value;
            
            if (saveBtn) {
                const originalText = saveBtn.innerHTML;
                saveBtn.innerHTML = '<div class="loading-spinner-small"></div> Saving...';
                saveBtn.disabled = true;
                
                try {
                    // Simulate API call
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                    localStorage.setItem('userName', name);
                    localStorage.setItem('userEmail', email);
                    localStorage.setItem('userBio', bio);
                    localStorage.setItem('userLocation', location);
                    localStorage.setItem('userWebsite', website);
                    
                    // Show success message
                    const successMsg = document.createElement('div');
                    successMsg.className = 'fixed bottom-4 right-4 bg-green-500/20 border border-green-500 text-green-400 px-4 py-2 rounded-lg shadow-xl z-50 animate-fadeInOut';
                    successMsg.innerHTML = 'Profile updated successfully!';
                    document.body.appendChild(successMsg);
                    setTimeout(() => successMsg.remove(), 2000);
                    
                    // Reload page to reflect changes
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                    
                } catch (error) {
                    console.error('Save error:', error);
                    const errorMsg = document.createElement('div');
                    errorMsg.className = 'fixed bottom-4 right-4 bg-red-500/20 border border-red-500 text-red-400 px-4 py-2 rounded-lg shadow-xl z-50 animate-fadeInOut';
                    errorMsg.innerHTML = 'Failed to save profile';
                    document.body.appendChild(errorMsg);
                    setTimeout(() => errorMsg.remove(), 2000);
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
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes fadeInOut {
        0% {
            opacity: 0;
            transform: translateY(10px);
        }
        15% {
            opacity: 1;
            transform: translateY(0);
        }
        85% {
            opacity: 1;
            transform: translateY(0);
        }
        100% {
            opacity: 0;
            transform: translateY(-10px);
        }
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
    
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #60A5FA;
    }
`;

if (!document.querySelector('#profile-page-styles')) {
    const style = document.createElement('style');
    style.id = 'profile-page-styles';
    style.textContent = profilePageStyles;
    document.head.appendChild(style);
}