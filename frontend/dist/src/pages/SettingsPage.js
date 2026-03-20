// frontend/src/pages/SettingsPage.js
// Settings Page - App settings

import { Sidebar } from '../components/layout/Sidebar.js';
import { AIChatSidebar } from '../components/layout/AIChatSidebar.js';
import { Header } from '../components/common/Header.js';

export function SettingsPage() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    if (!isAuthenticated) {
        window.location.hash = '#/login';
        return '';
    }
    
    return `
        <div class="min-h-screen bg-[#111827] relative">
            ${Sidebar()}
            ${AIChatSidebar()}
            <div id="mainContent" class="min-h-screen transition-all duration-300" 
                 style="margin-left: 256px; margin-right: 384px; width: calc(100% - 640px);">
                ${Header({ title: 'Settings' })}
                <main class="container mx-auto px-4 py-8">
                    <div class="max-w-3xl mx-auto space-y-6">
                        <!-- Preferences -->
                        <div class="bg-[#1F2937] rounded-xl shadow-lg p-6">
                            <h3 class="text-xl font-bold text-[#E5E7EB] mb-4">Preferences</h3>
                            <div class="space-y-4">
                                <div class="flex items-center justify-between">
                                    <span class="text-[#E5E7EB]">Dark Mode</span>
                                    <label class="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" class="sr-only peer" checked>
                                        <div class="w-11 h-6 bg-[#374151] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3B82F6]"></div>
                                    </label>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-[#E5E7EB]">Email Notifications</span>
                                    <label class="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" class="sr-only peer" checked>
                                        <div class="w-11 h-6 bg-[#374151] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3B82F6]"></div>
                                    </label>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-[#E5E7EB]">Sound Effects</span>
                                    <label class="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" class="sr-only peer">
                                        <div class="w-11 h-6 bg-[#374151] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3B82F6]"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Account Settings -->
                        <div class="bg-[#1F2937] rounded-xl shadow-lg p-6">
                            <h3 class="text-xl font-bold text-[#E5E7EB] mb-4">Account Settings</h3>
                            <div class="space-y-4">
                                <div>
                                    <label class="block text-[#E5E7EB] text-sm mb-2">Language</label>
                                    <select class="w-full bg-[#111827] border border-[#374151] rounded-lg px-4 py-2 text-[#E5E7EB] focus:outline-none focus:border-[#3B82F6]">
                                        <option>English</option>
                                        <option>Hindi</option>
                                        <option>Spanish</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-[#E5E7EB] text-sm mb-2">Timezone</label>
                                    <select class="w-full bg-[#111827] border border-[#374151] rounded-lg px-4 py-2 text-[#E5E7EB] focus:outline-none focus:border-[#3B82F6]">
                                        <option>IST (UTC+5:30)</option>
                                        <option>EST (UTC-5)</option>
                                        <option>PST (UTC-8)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Danger Zone -->
                        <div class="bg-[#1F2937] rounded-xl shadow-lg p-6 border border-red-500/20">
                            <h3 class="text-xl font-bold text-red-500 mb-4">Danger Zone</h3>
                            <div class="space-y-4">
                                <button class="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-2 rounded-lg transition-colors">
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    `;
}