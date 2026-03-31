// frontend/src/pages/SettingsPage.js
// Settings Page - App settings with enhanced UI

import { Sidebar } from '../components/layout/Sidebar.js';
import { AIChatSidebar } from '../components/layout/AIChatSidebar.js';
import { Header } from '../components/common/Header.js';
import { showError, showSuccess } from '../components/common/ErrorMessage.js';

export function SettingsPage() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    if (!isAuthenticated) {
        window.location.hash = '#/login';
        return '';
    }
    
    const userEmail = localStorage.getItem('userEmail') || 'user@example.com';
    const userName = localStorage.getItem('userName') || 'User';
    const currentTheme = localStorage.getItem('theme') || 'dark';
    
    return `
        <div class="min-h-screen bg-gradient-to-b from-[#111827] to-[#0F172A] relative" id="settingsPageRoot">
            ${Sidebar()}
            ${AIChatSidebar()}
            <div id="mainContent" class="min-h-screen transition-all duration-300" 
                 style="margin-left: 256px; margin-right: 384px; width: calc(100% - 640px);">
                ${Header({ title: 'Settings' })}
                <main class="container mx-auto px-4 py-8">
                    <div class="max-w-4xl mx-auto">
                        <!-- Header -->
                        <div class="mb-8 animate-fadeInUp">
                            <div class="relative inline-block">
                                <div class="absolute inset-0 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full blur-2xl opacity-30 animate-pulse"></div>
                                <div class="relative flex items-center gap-2 mb-2">
                                    <div class="w-12 h-12 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-300">
                                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                                        </svg>
                                    </div>
                                    <h1 class="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">
                                        Settings
                                    </h1>
                                </div>
                            </div>
                            <p class="text-[#9CA3AF] mt-2">Customize your app experience and account preferences</p>
                            <div class="w-24 h-1 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full mt-4"></div>
                        </div>
                        
                        <!-- Preferences Section -->
                        <div class="bg-gradient-to-br from-[#1F2937] via-[#1A2436] to-[#111827] rounded-2xl shadow-xl p-6 mb-6 border border-[#374151] hover:border-[#3B82F6] transition-all duration-300 animate-fadeInUp" style="animation-delay: 0.1s">
                            <div class="flex items-center gap-3 mb-6 pb-3 border-b border-[#374151]">
                                <div class="relative">
                                    <div class="absolute inset-0 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-lg blur-md opacity-0 group-hover:opacity-50 transition-opacity"></div>
                                    <div class="relative w-10 h-10 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-xl flex items-center justify-center shadow-md">
                                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                                        </svg>
                                    </div>
                                </div>
                                <div>
                                    <h3 class="text-xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">Preferences</h3>
                                    <p class="text-xs text-[#6B7280]">Customize your app experience</p>
                                </div>
                            </div>
                            <div class="space-y-4">
                                <!-- Dark/Light Mode Toggle -->
                                <div class="group flex items-center justify-between p-4 bg-gradient-to-r from-[#111827] to-[#1F2937] rounded-xl hover:bg-gradient-to-r hover:from-[#1A2436] hover:to-[#2D3748] transition-all duration-300 hover:translate-x-1">
                                    <div class="flex items-center gap-4">
                                        <div class="relative">
                                            <div class="absolute inset-0 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-lg blur-md opacity-0 group-hover:opacity-50 transition-opacity"></div>
                                            <div class="relative w-12 h-12 bg-gradient-to-r from-[#374151] to-[#4B5563] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                <svg class="w-6 h-6 text-[#9CA3AF] group-hover:text-[#3B82F6] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" id="themeIcon">
                                                    ${currentTheme === 'dark' ? 
                                                        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>' :
                                                        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>'
                                                    }
                                                </svg>
                                            </div>
                                        </div>
                                        <div>
                                            <span class="text-[#E5E7EB] font-medium group-hover:text-[#3B82F6] transition-colors">Dark/Light Mode</span>
                                            <p class="text-xs text-[#9CA3AF] mt-0.5">Switch between dark and light theme</p>
                                        </div>
                                    </div>
                                    <label class="relative inline-flex items-center cursor-pointer group/switch">
                                        <input type="checkbox" id="themeToggle" class="sr-only peer" ${currentTheme === 'light' ? 'checked' : ''}>
                                        <div class="w-12 h-6 bg-[#374151] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3B82F6] group-hover/switch:scale-105 transition-transform"></div>
                                    </label>
                                </div>
                                
                                <!-- Email Notifications Toggle -->
                                <div class="group flex items-center justify-between p-4 bg-gradient-to-r from-[#111827] to-[#1F2937] rounded-xl hover:bg-gradient-to-r hover:from-[#1A2436] hover:to-[#2D3748] transition-all duration-300 hover:translate-x-1">
                                    <div class="flex items-center gap-4">
                                        <div class="relative">
                                            <div class="absolute inset-0 bg-gradient-to-r from-[#10B981] to-[#34D399] rounded-lg blur-md opacity-0 group-hover:opacity-50 transition-opacity"></div>
                                            <div class="relative w-12 h-12 bg-gradient-to-r from-[#374151] to-[#4B5563] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                <svg class="w-6 h-6 text-[#9CA3AF] group-hover:text-[#10B981] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                                </svg>
                                            </div>
                                        </div>
                                        <div>
                                            <span class="text-[#E5E7EB] font-medium group-hover:text-[#10B981] transition-colors">Email Notifications</span>
                                            <p class="text-xs text-[#9CA3AF] mt-0.5">Receive updates and reminders via email</p>
                                        </div>
                                    </div>
                                    <label class="relative inline-flex items-center cursor-pointer group/switch">
                                        <input type="checkbox" id="emailNotificationsToggle" class="sr-only peer" checked>
                                        <div class="w-12 h-6 bg-[#374151] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10B981] group-hover/switch:scale-105 transition-transform"></div>
                                    </label>
                                </div>
                                
                                <!-- Sound Effects Toggle -->
                                <div class="group flex items-center justify-between p-4 bg-gradient-to-r from-[#111827] to-[#1F2937] rounded-xl hover:bg-gradient-to-r hover:from-[#1A2436] hover:to-[#2D3748] transition-all duration-300 hover:translate-x-1">
                                    <div class="flex items-center gap-4">
                                        <div class="relative">
                                            <div class="absolute inset-0 bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] rounded-lg blur-md opacity-0 group-hover:opacity-50 transition-opacity"></div>
                                            <div class="relative w-12 h-12 bg-gradient-to-r from-[#374151] to-[#4B5563] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                <svg class="w-6 h-6 text-[#9CA3AF] group-hover:text-[#F59E0B] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>
                                                </svg>
                                            </div>
                                        </div>
                                        <div>
                                            <span class="text-[#E5E7EB] font-medium group-hover:text-[#F59E0B] transition-colors">Sound Effects</span>
                                            <p class="text-xs text-[#9CA3AF] mt-0.5">Play sounds for notifications and actions</p>
                                        </div>
                                    </div>
                                    <label class="relative inline-flex items-center cursor-pointer group/switch">
                                        <input type="checkbox" id="soundToggle" class="sr-only peer">
                                        <div class="w-12 h-6 bg-[#374151] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F59E0B] group-hover/switch:scale-105 transition-transform"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Account Settings Section -->
                        <div class="bg-gradient-to-br from-[#1F2937] via-[#1A2436] to-[#111827] rounded-2xl shadow-xl p-6 mb-6 border border-[#374151] hover:border-[#3B82F6] transition-all duration-300 animate-fadeInUp" style="animation-delay: 0.2s">
                            <div class="flex items-center gap-3 mb-6 pb-3 border-b border-[#374151]">
                                <div class="relative">
                                    <div class="absolute inset-0 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-lg blur-md opacity-0 group-hover:opacity-50 transition-opacity"></div>
                                    <div class="relative w-10 h-10 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-xl flex items-center justify-center shadow-md">
                                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                        </svg>
                                    </div>
                                </div>
                                <div>
                                    <h3 class="text-xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">Account Settings</h3>
                                    <p class="text-xs text-[#6B7280]">Manage your account information</p>
                                </div>
                            </div>
                            <div class="space-y-5">
                                <!-- Language Selector -->
                                <div class="space-y-2">
                                    <label class="block text-sm font-medium text-[#E5E7EB] flex items-center gap-2">
                                        <span>🌐</span> Language
                                    </label>
                                    <div class="relative group">
                                        <select id="languageSelect" class="w-full bg-[#111827] border-2 border-[#374151] rounded-xl px-4 py-3 text-[#E5E7EB] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/30 appearance-none cursor-pointer transition-all duration-300 hover:border-[#4B5563]">
                                            <option value="en">🇺🇸 English</option>
                                            <option value="hi">🇮🇳 Hindi</option>
                                            <option value="es">🇪🇸 Spanish</option>
                                            <option value="fr">🇫🇷 French</option>
                                            <option value="de">🇩🇪 German</option>
                                        </select>
                                        <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <svg class="w-4 h-4 text-[#9CA3AF] group-hover:text-[#3B82F6] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Timezone Selector -->
                                <div class="space-y-2">
                                    <label class="block text-sm font-medium text-[#E5E7EB] flex items-center gap-2">
                                        <span>🕐</span> Timezone
                                    </label>
                                    <div class="relative group">
                                        <select id="timezoneSelect" class="w-full bg-[#111827] border-2 border-[#374151] rounded-xl px-4 py-3 text-[#E5E7EB] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/30 appearance-none cursor-pointer transition-all duration-300 hover:border-[#4B5563]">
                                            <option value="IST">🇮🇳 IST (UTC+5:30)</option>
                                            <option value="EST">🇺🇸 EST (UTC-5)</option>
                                            <option value="PST">🇺🇸 PST (UTC-8)</option>
                                            <option value="GMT">🇬🇧 GMT (UTC+0)</option>
                                            <option value="CET">🇪🇺 CET (UTC+1)</option>
                                        </select>
                                        <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <svg class="w-4 h-4 text-[#9CA3AF] group-hover:text-[#3B82F6] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Email Display -->
                                <div class="space-y-2">
                                    <label class="block text-sm font-medium text-[#E5E7EB] flex items-center gap-2">
                                        <span>📧</span> Account Email
                                    </label>
                                    <div class="bg-gradient-to-r from-[#111827] to-[#1A2436] border border-[#374151] rounded-xl px-4 py-3 text-[#9CA3AF] flex items-center justify-between hover:border-[#3B82F6] transition-all duration-300">
                                        <span class="font-mono">${userEmail}</span>
                                        <button id="changeEmailBtn" class="text-xs text-[#60A5FA] hover:text-[#3B82F6] transition-all duration-300 hover:scale-105 px-3 py-1 rounded-lg hover:bg-[#3B82F6]/10">Change</button>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Save Button -->
                            <button id="saveSettingsBtn" class="group relative mt-6 w-full bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] hover:from-[#60A5FA] hover:to-[#8B5CF6] text-white py-3.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl overflow-hidden">
                                <div class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                <span class="relative z-10 flex items-center justify-center gap-2">
                                    <svg class="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                    Save Settings
                                </span>
                            </button>
                        </div>
                        
                        <!-- Danger Zone Section -->
                        <div class="bg-gradient-to-br from-[#1F2937] via-[#1A2436] to-[#111827] rounded-2xl shadow-xl p-6 border border-red-500/30 hover:border-red-500/50 transition-all duration-300 animate-fadeInUp" style="animation-delay: 0.3s">
                            <div class="flex items-center gap-3 mb-6 pb-3 border-b border-red-500/20">
                                <div class="relative">
                                    <div class="absolute inset-0 bg-gradient-to-r from-red-500 to-rose-500 rounded-lg blur-md opacity-0 group-hover:opacity-50 transition-opacity"></div>
                                    <div class="relative w-10 h-10 bg-gradient-to-r from-red-500 to-rose-600 rounded-xl flex items-center justify-center shadow-md">
                                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                                        </svg>
                                    </div>
                                </div>
                                <div>
                                    <h3 class="text-xl font-bold text-red-500">Danger Zone</h3>
                                    <p class="text-xs text-[#6B7280]">Irreversible actions</p>
                                </div>
                            </div>
                            <div class="bg-gradient-to-r from-red-500/5 to-red-500/0 rounded-xl p-5 border border-red-500/20">
                                <p class="text-[#9CA3AF] text-sm mb-4 leading-relaxed">⚠️ Once you delete your account, there is no going back. All your data including notes, quizzes, roadmaps and progress will be permanently removed.</p>
                                <button id="deleteAccountBtn" class="group relative w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden">
                                    <div class="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/10 to-red-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                    <svg class="w-5 h-5 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                    </svg>
                                    <span class="relative">Delete Account Permanently</span>
                                </button>
                            </div>
                        </div>
                        
                        <!-- About Section -->
                        <div class="bg-gradient-to-br from-[#1F2937] via-[#1A2436] to-[#111827] rounded-2xl shadow-xl p-6 mt-6 border border-[#374151] hover:border-[#3B82F6] transition-all duration-300 animate-fadeInUp" style="animation-delay: 0.4s">
                            <div class="flex items-center gap-3 mb-4">
                                <div class="relative">
                                    <div class="absolute inset-0 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-lg blur-md opacity-0 group-hover:opacity-50 transition-opacity"></div>
                                    <div class="relative w-10 h-10 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-xl flex items-center justify-center shadow-md">
                                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                    </div>
                                </div>
                                <div>
                                    <h3 class="text-lg font-bold text-[#E5E7EB]">About Flashnotes</h3>
                                    <p class="text-xs text-[#6B7280]">Version information</p>
                                </div>
                            </div>
                            <div class="space-y-2 text-sm text-[#9CA3AF]">
                                <div class="flex items-center gap-3 p-3 bg-[#111827] rounded-xl">
                                    <span class="w-8 h-8 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-lg flex items-center justify-center">📘</span>
                                    <span>Version 2.0.0</span>
                                </div>
                                <div class="flex items-center gap-3 p-3 bg-[#111827] rounded-xl">
                                    <span class="w-8 h-8 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-lg flex items-center justify-center">©️</span>
                                    <span>© 2024 Flashnotes. All rights reserved.</span>
                                </div>
                                <div class="flex flex-wrap gap-3 mt-4 pt-2">
                                    <a href="#" class="text-sm text-[#60A5FA] hover:text-[#3B82F6] transition-all duration-300 hover:scale-105 inline-flex items-center gap-1">
                                        <span>🔒</span> Privacy Policy
                                    </a>
                                    <a href="#" class="text-sm text-[#60A5FA] hover:text-[#3B82F6] transition-all duration-300 hover:scale-105 inline-flex items-center gap-1">
                                        <span>📜</span> Terms of Service
                                    </a>
                                    <a href="#" class="text-sm text-[#60A5FA] hover:text-[#3B82F6] transition-all duration-300 hover:scale-105 inline-flex items-center gap-1">
                                        <span>💬</span> Contact Support
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    `;
}

// Apply theme to body
function applyTheme(theme) {
    if (theme === 'light') {
        document.body.classList.add('light-mode');
        document.body.style.backgroundColor = '#f9fafb';
        document.body.style.color = '#111827';
        
        const mainContent = document.getElementById('mainContent');
        if (mainContent) {
            mainContent.style.backgroundColor = '#f9fafb';
        }
        
        const sidebar = document.querySelector('aside');
        if (sidebar) {
            sidebar.style.backgroundColor = '#ffffff';
            sidebar.classList.add('shadow-lg');
        }
        
        document.querySelectorAll('.bg-gradient-to-br').forEach(el => {
            el.style.backgroundColor = '#ffffff';
        });
        
    } else {
        document.body.classList.remove('light-mode');
        document.body.style.backgroundColor = '#111827';
        document.body.style.color = '#E5E7EB';
        
        const mainContent = document.getElementById('mainContent');
        if (mainContent) {
            mainContent.style.backgroundColor = '';
        }
        
        const sidebar = document.querySelector('aside');
        if (sidebar) {
            sidebar.style.backgroundColor = '';
        }
    }
}

// Setup settings page events
export function setupSettingsPage() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);
    
    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.checked = savedTheme === 'light';
        
        themeToggle.addEventListener('change', (e) => {
            const newTheme = e.target.checked ? 'light' : 'dark';
            localStorage.setItem('theme', newTheme);
            applyTheme(newTheme);
            
            const themeIcon = document.querySelector('#themeIcon');
            if (themeIcon) {
                if (newTheme === 'dark') {
                    themeIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>';
                } else {
                    themeIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>';
                }
            }
            
            showSuccess(`${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} mode activated!`, 'success');
        });
    }
    
    // Save Settings
    const saveBtn = document.getElementById('saveSettingsBtn');
    if (saveBtn) {
        const newSaveBtn = saveBtn.cloneNode(true);
        saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);
        
        newSaveBtn.addEventListener('click', () => {
            const darkMode = document.getElementById('themeToggle')?.checked;
            const emailNotifications = document.getElementById('emailNotificationsToggle')?.checked;
            const soundEffects = document.getElementById('soundToggle')?.checked;
            const language = document.getElementById('languageSelect')?.value;
            const timezone = document.getElementById('timezoneSelect')?.value;
            
            localStorage.setItem('emailNotifications', emailNotifications);
            localStorage.setItem('soundEffects', soundEffects);
            localStorage.setItem('language', language);
            localStorage.setItem('timezone', timezone);
            
            showSuccess('Settings saved successfully!', 'success');
        });
    }
    
    // Delete Account
    const deleteBtn = document.getElementById('deleteAccountBtn');
    if (deleteBtn) {
        const newDeleteBtn = deleteBtn.cloneNode(true);
        deleteBtn.parentNode.replaceChild(newDeleteBtn, deleteBtn);
        
        newDeleteBtn.addEventListener('click', async () => {
            const confirmed = confirm('⚠️ Are you absolutely sure? This action cannot be undone and all your data will be permanently deleted.');
            
            if (confirmed) {
                const password = prompt('Please enter your password to confirm account deletion:');
                
                if (!password) {
                    showError('Account deletion cancelled', 'warning');
                    return;
                }
                
                newDeleteBtn.disabled = true;
                newDeleteBtn.innerHTML = '<div class="loading-spinner-small mx-auto"></div> Deleting...';
                
                try {
                    const token = localStorage.getItem('token');
                    const email = localStorage.getItem('userEmail');
                    
                    const response = await fetch(`${window.API_URL}/auth/delete-account`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ email, password })
                    });
                    
                    const data = await response.json();
                    
                    if (!response.ok) {
                        throw new Error(data.error || 'Failed to delete account');
                    }
                    
                    showSuccess('Account deleted successfully. Goodbye!', 'success');
                    
                    localStorage.clear();
                    
                    setTimeout(() => {
                        window.location.hash = '#/';
                        window.location.reload();
                    }, 2000);
                    
                } catch (error) {
                    console.error('Delete account error:', error);
                    showError(error.message || 'Failed to delete account. Please try again.', 'error');
                    newDeleteBtn.disabled = false;
                    newDeleteBtn.innerHTML = '<svg class="w-5 h-5 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg> Delete Account Permanently';
                }
            }
        });
    }
    
    // Change Email
    const changeEmailBtn = document.getElementById('changeEmailBtn');
    if (changeEmailBtn) {
        const newChangeBtn = changeEmailBtn.cloneNode(true);
        changeEmailBtn.parentNode.replaceChild(newChangeBtn, changeEmailBtn);
        
        newChangeBtn.addEventListener('click', () => {
            const newEmail = prompt('Enter your new email address:', localStorage.getItem('userEmail'));
            if (newEmail && newEmail.includes('@')) {
                localStorage.setItem('userEmail', newEmail);
                showSuccess('Email updated successfully!', 'success');
                setTimeout(() => location.reload(), 1000);
            } else if (newEmail) {
                showError('Please enter a valid email address', 'error');
            }
        });
    }
    
    // Load saved settings
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
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes pulse-glow {
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
    
    .animate-fadeInUp {
        animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        opacity: 0;
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
    
    /* Light Mode Styles */
    body.light-mode {
        background-color: #f9fafb;
        color: #111827;
    }
    
    body.light-mode .bg-gradient-to-br {
        background: linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%);
        border-color: #e5e7eb;
    }
    
    body.light-mode .bg-[#111827] {
        background-color: #f9fafb;
    }
    
    body.light-mode .text-[#E5E7EB] {
        color: #111827;
    }
    
    body.light-mode .border-[#374151] {
        border-color: #e5e7eb;
    }
    
    body.light-mode .text-[#9CA3AF] {
        color: #6b7280;
    }
    
    /* Hover transitions */
    .group-hover\\:translate-x-1 {
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    /* Switch transition */
    .peer:checked ~ .peer-checked\\:bg-\\[\\#3B82F6\\] {
        transition: background-color 0.3s ease;
    }
`;

if (!document.querySelector('#settings-page-styles')) {
    const style = document.createElement('style');
    style.id = 'settings-page-styles';
    style.textContent = settingsPageStyles;
    document.head.appendChild(style);
}