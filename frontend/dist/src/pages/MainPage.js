// frontend/src/pages/MainPage.js
import { Navbar } from '../components/layout/Navbar.js';
import { Sidebar } from '../components/layout/Sidebar.js';
import { AIChatSidebar } from '../components/layout/AIChatSidebar.js';
import { Dashboard } from '../components/main/Dashboard.js';
import { Footer } from '../components/common/Footer.js';

export async function MainPage() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    if (!isAuthenticated) {
        window.location.hash = '#/login';
        return '';
    }
    
    return `
        <div class="min-h-screen bg-gradient-to-br from-[#111827] to-[#0F172A] flex overflow-hidden">
            <!-- Left Sidebar -->
            ${Sidebar()}
            
            <!-- Right AI Chat Sidebar -->
            ${AIChatSidebar()}
            
            <!-- Main Content -->
            <div id="mainContent" class="flex-1 main-content transition-all duration-300">
                ${Navbar()}
                <main class="relative">
                    ${await Dashboard()}
                </main>
                ${Footer()}
            </div>
        </div>
        
        <!-- Floating Action Button for Mobile -->
        <div class="fixed bottom-6 right-6 md:hidden z-50">
            <button id="mobileMenuFAB" class="w-14 h-14 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full flex items-center justify-center shadow-2xl hover:shadow-[#3B82F6]/30 transition-all duration-300 transform hover:scale-110">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
            </button>
        </div>
        
        <!-- Back to Top Button -->
        <button id="backToTopBtn" class="fixed bottom-6 left-6 w-12 h-12 bg-[#1F2937] border border-[#374151] rounded-full flex items-center justify-center shadow-lg hover:bg-gradient-to-r hover:from-[#3B82F6] hover:to-[#A78BFA] transition-all duration-300 transform hover:scale-110 opacity-0 invisible group z-50">
            <svg class="w-5 h-5 text-[#E5E7EB] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
            </svg>
        </button>
        
        <script>
            // Back to Top Button Logic
            const backToTopBtn = document.getElementById('backToTopBtn');
            if (backToTopBtn) {
                window.addEventListener('scroll', () => {
                    if (window.scrollY > 300) {
                        backToTopBtn.classList.remove('opacity-0', 'invisible');
                        backToTopBtn.classList.add('opacity-100', 'visible');
                    } else {
                        backToTopBtn.classList.add('opacity-0', 'invisible');
                        backToTopBtn.classList.remove('opacity-100', 'visible');
                    }
                });
                
                backToTopBtn.addEventListener('click', () => {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                });
            }
            
            // Mobile Menu FAB
            const mobileMenuFAB = document.getElementById('mobileMenuFAB');
            if (mobileMenuFAB) {
                mobileMenuFAB.addEventListener('click', () => {
                    const sidebar = document.querySelector('.sidebar');
                    if (sidebar) {
                        sidebar.classList.toggle('translate-x-0');
                        sidebar.classList.toggle('-translate-x-full');
                    }
                });
            }
        </script>
    `;
}

// Setup main page events
export function setupMainPage() {
    // Setup dashboard events
    const { setupDashboard } = require('../components/main/Dashboard.js');
    if (typeof setupDashboard === 'function') {
        setupDashboard();
    }
    
    // Setup sidebar events
    const { setupSidebar } = require('../components/layout/Sidebar.js');
    if (typeof setupSidebar === 'function') {
        setupSidebar();
    }
    
    // Setup navbar events
    const { setupNavbar } = require('../components/layout/Navbar.js');
    if (typeof setupNavbar === 'function') {
        setupNavbar();
    }
    
    // Setup footer events (if any)
    const { setupFooter } = require('../components/common/Footer.js');
    if (typeof setupFooter === 'function') {
        setupFooter();
    }
    
    // Close sidebar on mobile when clicking outside
    document.addEventListener('click', (e) => {
        const sidebar = document.querySelector('.sidebar');
        const mobileFAB = document.getElementById('mobileMenuFAB');
        
        if (window.innerWidth < 768 && sidebar && mobileFAB) {
            if (!sidebar.contains(e.target) && !mobileFAB.contains(e.target)) {
                sidebar.classList.add('-translate-x-full');
                sidebar.classList.remove('translate-x-0');
            }
        }
    });
    
    // Add keyboard shortcut for sidebar toggle (Ctrl + B)
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'b') {
            e.preventDefault();
            const sidebar = document.querySelector('.sidebar');
            if (sidebar) {
                sidebar.classList.toggle('translate-x-0');
                sidebar.classList.toggle('-translate-x-full');
            }
        }
        
        // Keyboard shortcut for AI Chat (Ctrl + K)
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            const aiChatToggle = document.getElementById('aiChatToggle');
            if (aiChatToggle) {
                aiChatToggle.click();
            }
        }
        
        // Keyboard shortcut for search (Ctrl + /)
        if (e.ctrlKey && e.key === '/') {
            e.preventDefault();
            const topicInput = document.getElementById('topicInput');
            if (topicInput) {
                topicInput.focus();
            }
        }
    });
    
    // Add notification for keyboard shortcuts
    const showShortcutNotification = (message) => {
        const notification = document.createElement('div');
        notification.className = 'fixed bottom-20 right-6 bg-[#1F2937] border border-[#3B82F6] text-[#E5E7EB] px-4 py-2 rounded-lg shadow-xl z-50 animate-fadeInOut';
        notification.innerHTML = `
            <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-[#3B82F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="text-sm">${message}</span>
            </div>
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2000);
    };
    
    // Optional: Show welcome back message
    const userName = localStorage.getItem('userName');
    if (userName && !sessionStorage.getItem('welcomeShown')) {
        sessionStorage.setItem('welcomeShown', 'true');
        setTimeout(() => {
            showShortcutNotification(`Welcome back, ${userName}! 🎉`);
        }, 500);
    }
}

// Add CSS animations
const mainPageStyles = `
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
    
    .animate-fadeInOut {
        animation: fadeInOut 3s ease-out forwards;
    }
    
    /* Mobile sidebar transition */
    @media (max-width: 768px) {
        .sidebar {
            transform: translateX(-100%);
            transition: transform 0.3s ease-in-out;
        }
        
        .sidebar.translate-x-0 {
            transform: translateX(0);
        }
        
        .main-content {
            margin-left: 0 !important;
            width: 100% !important;
        }
    }
    
    /* Desktop sidebar adjustment */
    @media (min-width: 769px) {
        .main-content {
            margin-left: 256px;
            width: calc(100% - 256px);
            transition: margin-left 0.3s ease-in-out, width 0.3s ease-in-out;
        }
        
        .sidebar.collapsed + .main-content {
            margin-left: 0;
            width: 100%;
        }
    }
    
    /* Back to Top Button Animation */
    #backToTopBtn {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    #backToTopBtn.visible {
        opacity: 1;
        visibility: visible;
    }
`;

if (!document.querySelector('#main-page-styles')) {
    const style = document.createElement('style');
    style.id = 'main-page-styles';
    style.textContent = mainPageStyles;
    document.head.appendChild(style);
}