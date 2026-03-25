// frontend/src/pages/DashboardPage.js
import { Sidebar } from '../components/layout/Sidebar.js';
import { AIChatSidebar } from '../components/layout/AIChatSidebar.js';
import { Dashboard, setupDashboard } from '../components/main/Dashboard.js';

export async function DashboardPage() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    if (!isAuthenticated) {
        window.location.hash = '#/login';
        return '';
    }
    
    return `
        <div class="min-h-screen bg-gradient-to-b from-[#111827] to-[#0F172A] relative">
            ${Sidebar()}
            ${AIChatSidebar()}
            <div id="mainContent" class="min-h-screen transition-all duration-300" 
                 style="margin-left: 256px; margin-right: 384px; width: calc(100% - 640px);">
                <main class="container mx-auto px-4 py-8">
                    ${await Dashboard()}
                </main>
            </div>
        </div>
    `;
}

export function setupDashboardPage() {
    setupDashboard();
}