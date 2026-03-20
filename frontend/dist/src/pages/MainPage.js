// frontend/src/pages/MainPage.js
import { Navbar } from '../components/layout/Navbar.js';
import { Sidebar } from '../components/layout/Sidebar.js';
import { Dashboard } from '../components/main/Dashboard.js';
import { Footer } from '../components/common/Footer.js';

export async function MainPage() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    if (!isAuthenticated) {
        window.location.hash = '#/login';
        return '';
    }
    
    return `
        <div class="min-h-screen bg-[#111827] flex">
            ${Sidebar()}
            <div class="flex-1 main-content">
                ${Navbar()}
                ${await Dashboard()}
                ${Footer()}
            </div>
        </div>
    `;
}

// Setup main page
export function setupMainPage() {
    const { setupDashboard } = require('../components/main/Dashboard.js');
    setupDashboard();
}