// frontend/src/pages/SettingsPage.js
// Settings Page - App settings with enhanced UI

import { Sidebar } from '../components/layout/Sidebar.js';
import { AIChatSidebar } from '../components/layout/AIChatSidebar.js';
import { Header } from '../components/common/Header.js';
import { showError } from '../components/common/ErrorMessage.js';

export function SettingsPage() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    if (!isAuthenticated) {
        window.location.hash = '#/login';
        return '';
    }
    
    const userEmail = localStorage.getItem('userEmail') || 'user@example.com';
    
    return `
        <div class="min-h-screen bg-gradient-to-b from-[#111827] to-[#0F172A] relative">
            ${Sidebar()}
            ${AIChatSidebar()}
            <div id="mainContent" class="min-h-screen transition-all duration-300" 
                 style="margin-left: 256px; margin-right: 384px; width: calc(100% - 640px);">
                ${Header({ title: 'Settings' })}
                <main class="container mx-auto px-4 py-8">
                    <div class="max-w-4xl mx-auto">
                        <!-- Header -->
                        <div class="mb-8 animate-fadeInUp">
                            <div class="flex items-center gap-2 mb-2">
                                <div class="w-10 h-10 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-xl flex items-center justify-center">
                                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                                    </svg>
                                </div>
                                <h1 class="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">
                                    Settings
                                </h1>
                            </div>
                            <p class="text-[#9CA3AF] mt-2">Customize your app experience and account preferences</p>
                            <div class="w-24 h-1 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full mt-4"></div>
                        </div>
                        
                        <!-- Preferences Section -->
                        <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl shadow-xl p-6 mb-6 border border-[#374151] animate-fadeInUp" style="animation-delay: 0.1s">
                            <div class="flex items-center gap-3 mb-6 pb-3 border-b border-[#374151]">
                                <div class="w-8 h-8 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-lg flex items-center justify-center">
                                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                                    </svg>
                                </div>
                                <h3 class="text-xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">Preferences</h3>
                            </div>
                            <div class="space-y-5">
                                <!-- Dark Mode Toggle -->
                                <div class="flex items-center justify-between p-3 bg-[#111827] rounded-xl hover:bg-[#1F2937] transition-all duration-300">
                                    <div class="flex items-center gap-3">
                                        <div class="w-10 h-10 bg-[#374151] rounded-lg flex items-center justify-center">
                                            <svg class="w-5 h-5 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                                            </svg>
                                        </div>
                                        <div>
                                            <span class="text-[#E5E7EB] font-medium">Dark Mode</span>
                                            <p class="text-xs text-[#9CA3AF] mt-0.5">Switch between light and dark theme</p>
                                        </div>
                                    </div>
                                    <label class="relative inline-flex items-center cursor-pointer group">
                                        <input type="checkbox" id="darkModeToggle" class="sr-only peer" checked>
                                        <div class="w-11 h-6 bg-[#374151] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3B82F6] group-hover:scale-105 transition-transform"></div>
                                    </label>
                                </div>
                                
                                <!-- Email Notifications Toggle -->
                                <div class="flex items-center justify-between p-3 bg-[#111827] rounded-xl hover:bg-[#1F2937] transition-all duration-300">
                                    <div class="flex items-center gap-3">
                                        <div class="w-10 h-10 bg-[#374151] rounded-lg flex items-center justify-center">
                                            <svg class="w-5 h-5 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                            </svg>
                                        </div>
                                        <div>
                                            <span class="text-[#E5E7EB] font-medium">Email Notifications</span>
                                            <p class="text-xs text-[#9CA3AF] mt-0.5">Receive updates and reminders via email</p>
                                        </div>
                                    </div>
                                    <label class="relative inline-flex items-center cursor-pointer group">
                                        <input type="checkbox" id="emailNotificationsToggle" class="sr-only peer" checked>
                                        <div class="w-11 h-6 bg-[#374151] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3B82F6] group-hover:scale-105 transition-transform"></div>
                                    </label>
                                </div>
                                
                                <!-- Sound Effects Toggle -->
                                <div class="flex items-center justify-between p-3 bg-[#111827] rounded-xl hover:bg-[#1F2937] transition-all duration-300">
                                    <div class="flex items-center gap-3">
                                        <div class="w-10 h-10 bg-[#374151] rounded-lg flex items-center justify-center">
                                            <svg class="w-5 h-5 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>
                                            </svg>
                                        </div>
                                        <div>
                                            <span class="text-[#E5E7EB] font-medium">Sound Effects</span>
                                            <p class="text-xs text-[#9CA3AF] mt-0.5">Play sounds for notifications and actions</p>
                                        </div>
                                    </div>
                                    <label class="relative inline-flex items-center cursor-pointer group">
                                        <input type="checkbox" id="soundToggle" class="sr-only peer">
                                        <div class="w-11 h-6 bg-[#374151] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3B82F6] group-hover:scale-105 transition-transform"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Account Settings Section -->
                        <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl shadow-xl p-6 mb-6 border border-[#374151] animate-fadeInUp" style="animation-delay: 0.2s">
                            <div class="flex items-center gap-3 mb-6 pb-3 border-b border-[#374151]">
                                <div class="w-8 h-8 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-lg flex items-center justify-center">
                                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                    </svg>
                                </div>
                                <h3 class="text-xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">Account Settings</h3>
                            </div>
                            <div class="space-y-5">
                                <!-- Language Selector -->
                                <div class="space-y-2">
                                    <label class="block text-sm font-medium text-[#E5E7EB]">Language</label>
                                    <div class="relative">
                                        <select id="languageSelect" class="w-full bg-[#111827] border-2 border-[#374151] rounded-xl px-4 py-3 text-[#E5E7EB] focus:outline-none focus:border-[#3B82F6] appearance-none cursor-pointer transition-all duration-300">
                                            <option value="en">🇺🇸 English</option>
                                            <option value="hi">🇮🇳 Hindi</option>
                                            <option value="es">🇪🇸 Spanish</option>
                                            <option value="fr">🇫🇷 French</option>
                                            <option value="de">🇩🇪 German</option>
                                        </select>
                                        <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <svg class="w-4 h-4 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Timezone Selector -->
                                <div class="space-y-2">
                                    <label class="block text-sm font-medium text-[#E5E7EB]">Timezone</label>
                                    <div class="relative">
                                        <select id="timezoneSelect" class="w-full bg-[#111827] border-2 border-[#374151] rounded-xl px-4 py-3 text-[#E5E7EB] focus:outline-none focus:border-[#3B82F6] appearance-none cursor-pointer transition-all duration-300">
                                            <option value="IST">🇮🇳 IST (UTC+5:30)</option>
                                            <option value="EST">🇺🇸 EST (UTC-5)</option>
                                            <option value="PST">🇺🇸 PST (UTC-8)</option>
                                            <option value="GMT">🇬🇧 GMT (UTC+0)</option>
                                            <option value="CET">🇪🇺 CET (UTC+1)</option>
                                        </select>
                                        <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <svg class="w-4 h-4 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Email Display -->
                                <div class="space-y-2">
                                    <label class="block text-sm font-medium text-[#E5E7EB]">Account Email</label>
                                    <div class="bg-[#111827] border border-[#374151] rounded-xl px-4 py-3 text-[#9CA3AF] flex items-center justify-between">
                                        <span>${userEmail}</span>
                                        <button id="changeEmailBtn" class="text-xs text-[#60A5FA] hover:text-[#3B82F6] transition-colors">Change</button>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Save Button -->
                            <button id="saveSettingsBtn" class="mt-6 w-full bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] hover:from-[#60A5FA] hover:to-[#8B5CF6] text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                Save Settings
                            </button>
                        </div>
                        
                        <!-- Danger Zone Section -->
                        <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl shadow-xl p-6 border border-red-500/30 animate-fadeInUp" style="animation-delay: 0.3s">
                            <div class="flex items-center gap-3 mb-6 pb-3 border-b border-red-500/20">
                                <div class="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                                    </svg>
                                </div>
                                <h3 class="text-xl font-bold text-red-500">Danger Zone</h3>
                            </div>
                            <div class="space-y-4">
                                <div class="bg-[#111827] rounded-xl p-4">
                                    <p class="text-[#9CA3AF] text-sm mb-3">Once you delete your account, there is no going back. All your data will be permanently removed.</p>
                                    <button id="deleteAccountBtn" class="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group">
                                        <svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                        </svg>
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <!-- About Section -->
                        <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl shadow-xl p-6 mt-6 border border-[#374151] animate-fadeInUp" style="animation-delay: 0.4s">
                            <div class="flex items-center gap-3 mb-4">
                                <div class="w-8 h-8 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-lg flex items-center justify-center">
                                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </div>
                                <h3 class="text-lg font-bold text-[#E5E7EB]">About Flashnotes</h3>
                            </div>
                            <div class="space-y-2 text-sm text-[#9CA3AF]">
                                <p>Version 1.0.0</p>
                                <p>© 2024 Flashnotes. All rights reserved.</p>
                                <div class="flex gap-4 mt-3">
                                    <a href="#" class="text-[#60A5FA] hover:text-[#3B82F6] transition-colors">Privacy Policy</a>
                                    <a href="#" class="text-[#60A5FA] hover:text-[#3B82F6] transition-colors">Terms of Service</a>
                                    <a href="#" class="text-[#60A5FA] hover:text-[#3B82F6] transition-colors">Contact Support</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    `;
}

// Setup settings page events
export function setupSettingsPage() {
    // Save Settings
    const saveBtn = document.getElementById('saveSettingsBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const darkMode = document.getElementById('darkModeToggle')?.checked;
            const emailNotifications = document.getElementById('emailNotificationsToggle')?.checked;
            const soundEffects = document.getElementById('soundToggle')?.checked;
            const language = document.getElementById('languageSelect')?.value;
            const timezone = document.getElementById('timezoneSelect')?.value;
            
            // Save to localStorage
            localStorage.setItem('darkMode', darkMode);
            localStorage.setItem('emailNotifications', emailNotifications);
            localStorage.setItem('soundEffects', soundEffects);
            localStorage.setItem('language', language);
            localStorage.setItem('timezone', timezone);
            
            // Show success message
            const successMsg = document.createElement('div');
            successMsg.className = 'fixed bottom-4 right-4 bg-green-500/20 border border-green-500 text-green-400 px-4 py-2 rounded-lg shadow-xl z-50 animate-fadeInOut';
            successMsg.innerHTML = 'Settings saved successfully!';
            document.body.appendChild(successMsg);
            setTimeout(() => successMsg.remove(), 2000);
        });
    }
    
    // Delete Account
    const deleteBtn = document.getElementById('deleteAccountBtn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            if (confirm('⚠️ Are you absolutely sure? This action cannot be undone and all your data will be permanently deleted.')) {
                // Show loading state
                deleteBtn.disabled = true;
                deleteBtn.innerHTML = '<div class="loading-spinner-small"></div> Deleting...';
                
                // Simulate deletion (replace with actual API call)
                setTimeout(() => {
                    localStorage.clear();
                    window.location.hash = '#/';
                    window.location.reload();
                }, 2000);
            }
        });
    }
    
    // Change Email
    const changeEmailBtn = document.getElementById('changeEmailBtn');
    if (changeEmailBtn) {
        changeEmailBtn.addEventListener('click', () => {
            const newEmail = prompt('Enter your new email address:', localStorage.getItem('userEmail'));
            if (newEmail && newEmail.includes('@')) {
                localStorage.setItem('userEmail', newEmail);
                location.reload();
            } else if (newEmail) {
                alert('Please enter a valid email address');
            }
        });
    }
    
    // Load saved settings
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle && localStorage.getItem('darkMode') === 'true') {
        darkModeToggle.checked = true;
    }
    
    const emailToggle = document.getElementById('emailNotificationsToggle');
    if (emailToggle && localStorage.getItem('emailNotifications') === 'true') {
        emailToggle.checked = true;
    }
    
    const soundToggle = document.getElementById('soundToggle');
    if (soundToggle && localStorage.getItem('soundEffects') === 'true') {
        soundToggle.checked = true;
    }
    
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect && localStorage.getItem('language')) {
        languageSelect.value = localStorage.getItem('language');
    }
    
    const timezoneSelect = document.getElementById('timezoneSelect');
    if (timezoneSelect && localStorage.getItem('timezone')) {
        timezoneSelect.value = localStorage.getItem('timezone');
    }
}

// Add CSS animations
const settingsPageStyles = `
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
`;

if (!document.querySelector('#settings-page-styles')) {
    const style = document.createElement('style');
    style.id = 'settings-page-styles';
    style.textContent = settingsPageStyles;
    document.head.appendChild(style);
}