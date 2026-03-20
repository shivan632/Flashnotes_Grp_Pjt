// frontend/src/pages/ProfilePage.js
// Profile Page - User profile

import { Sidebar } from '../components/layout/Sidebar.js';
import { AIChatSidebar } from '../components/layout/AIChatSidebar.js';
import { Header } from '../components/common/Header.js';

export function ProfilePage() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    if (!isAuthenticated) {
        window.location.hash = '#/login';
        return '';
    }
    
    const userName = localStorage.getItem('userName') || 'User';
    const userEmail = localStorage.getItem('userEmail') || 'user@example.com';
    
    return `
        <div class="min-h-screen bg-[#111827] relative">
            ${Sidebar()}
            ${AIChatSidebar()}
            <div id="mainContent" class="min-h-screen transition-all duration-300" 
                 style="margin-left: 256px; margin-right: 384px; width: calc(100% - 640px);">
                ${Header({ title: 'My Profile' })}
                <main class="container mx-auto px-4 py-8">
                    <div class="max-w-3xl mx-auto">
                        <!-- Profile Header -->
                        <div class="bg-[#1F2937] rounded-xl shadow-lg p-8 mb-6">
                            <div class="flex flex-col items-center">
                                <div class="w-24 h-24 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full flex items-center justify-center mb-4">
                                    <span class="text-white text-3xl font-bold">${userName.charAt(0).toUpperCase()}</span>
                                </div>
                                <h2 class="text-2xl font-bold text-[#E5E7EB]">${userName}</h2>
                                <p class="text-[#9CA3AF]">${userEmail}</p>
                                <p class="text-sm text-[#60A5FA] mt-2">Member since March 2026</p>
                            </div>
                            
                            <!-- Stats Grid -->
                            <div class="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-[#374151]">
                                <div class="text-center">
                                    <div class="text-2xl font-bold text-[#3B82F6]">24</div>
                                    <div class="text-xs text-[#9CA3AF]">Quizzes Taken</div>
                                </div>
                                <div class="text-center">
                                    <div class="text-2xl font-bold text-[#3B82F6]">18</div>
                                    <div class="text-xs text-[#9CA3AF]">Perfect Scores</div>
                                </div>
                                <div class="text-center">
                                    <div class="text-2xl font-bold text-[#3B82F6]">45</div>
                                    <div class="text-xs text-[#9CA3AF]">Saved Notes</div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Edit Profile Form -->
                        <div class="bg-[#1F2937] rounded-xl shadow-lg p-6">
                            <h3 class="text-xl font-bold text-[#E5E7EB] mb-4">Edit Profile</h3>
                            <form id="profileForm" class="space-y-4">
                                <div>
                                    <label class="block text-[#E5E7EB] text-sm mb-2">Full Name</label>
                                    <input type="text" value="${userName}" 
                                           class="w-full bg-[#111827] border border-[#374151] rounded-lg px-4 py-2 text-[#E5E7EB] focus:outline-none focus:border-[#3B82F6] transition-colors">
                                </div>
                                <div>
                                    <label class="block text-[#E5E7EB] text-sm mb-2">Email</label>
                                    <input type="email" value="${userEmail}" 
                                           class="w-full bg-[#111827] border border-[#374151] rounded-lg px-4 py-2 text-[#E5E7EB] focus:outline-none focus:border-[#3B82F6] transition-colors">
                                </div>
                                <div>
                                    <label class="block text-[#E5E7EB] text-sm mb-2">Bio</label>
                                    <textarea rows="4" class="w-full bg-[#111827] border border-[#374151] rounded-lg px-4 py-2 text-[#E5E7EB] focus:outline-none focus:border-[#3B82F6] transition-colors" 
                                              placeholder="Tell us about yourself...">AI enthusiast and lifelong learner passionate about technology and education.</textarea>
                                </div>
                                <button type="submit" 
                                        class="bg-[#3B82F6] hover:bg-[#60A5FA] text-white px-6 py-2 rounded-lg transition-all transform hover:scale-105">
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