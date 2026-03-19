// frontend/src/main.js - COMPLETE FINAL VERSION

// ============= UTILITIES =============
import { setupNavigation } from './utils/navigation.js';
import { formatDate, truncateText } from './utils/helpers.js';
import { validateTopic } from './utils/validation.js';
import { ROUTES, QUICK_TOPICS, ERROR_MESSAGES } from './utils/constants.js';

// ============= SERVICES =============
import { generateQA } from './services/ai.js';
import { authAPI } from './services/api.js';
import { 
    saveNote, 
    getSavedNotes, 
    addToHistory, 
    getSearchHistory,
    deleteNote 
} from './services/storage.js';

// ============= COMMON COMPONENTS =============
import { LoadingSpinner } from './components/common/LoadingSpinner.js';
import { showError } from './components/common/ErrorMessage.js';
import { Header, setupHeader } from './components/common/Header.js';
import { Footer } from './components/common/Footer.js';

// ============= LAYOUT COMPONENTS =============
import { Navbar, setupNavbar } from './components/layout/Navbar.js';
import { Sidebar, setupSidebar } from './components/layout/Sidebar.js';
import { AIChatSidebar, setupAIChat } from './components/layout/AIChatSidebar.js';

// ============= AUTH COMPONENTS =============
import { LoginForm, setupLoginForm } from './components/auth/LoginForm.js';
import { RegistrationForm, setupRegistrationForm } from './components/auth/RegistrationForm.js';
import { OTPVerification, setupOTPVerification } from './components/auth/OTPVerification.js';

// ============= MAIN COMPONENTS =============
import { Dashboard, setupDashboard } from './components/main/Dashboard.js';
import { StorageArea, setupStorageEvents } from './components/main/StorageArea.js';
import { HistoryList, setupHistoryEvents } from './components/main/HistoryList.js';
import { QACard, setupQACardEvents } from './components/main/QACard.js';
import { TopicInput, setupQuickTopics } from './components/main/TopicInput.js';

// ============= WELCOME COMPONENTS =============
import { WelcomeHero } from './components/welcome/WelcomeHero.js';
import { FeaturesSection } from './components/welcome/FeaturesSection.js';
import { Introduction } from './components/welcome/Introduction.js';
import { FutureVision } from './components/welcome/FutureVision.js';

// ============= PAGE COMPONENTS =============

function WelcomePage() {
    return `
        <div class="min-h-screen flex flex-col">
            ${Navbar()}
            ${WelcomeHero()}
            ${FeaturesSection()}
            ${Introduction()}
            ${FutureVision()}
            ${Footer()}
        </div>
    `;
}

function RegisterPage() {
    return `
        <div class="min-h-screen flex flex-col">
            ${Navbar()}
            <div class="flex-1">
                ${RegistrationForm()}
            </div>
            ${Footer()}
        </div>
    `;
}

function LoginPage() {
    return `
        <div class="min-h-screen flex flex-col">
            ${Navbar()}
            <div class="flex-1">
                ${LoginForm()}
            </div>
            ${Footer()}
        </div>
    `;
}

function VerifyOTPPage() {
    return `
        <div class="min-h-screen flex flex-col">
            ${Navbar()}
            <div class="flex-1">
                ${OTPVerification()}
            </div>
            ${Footer()}
        </div>
    `;
}

async function DashboardPage() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    if (!isAuthenticated) {
        window.location.hash = '#/login';
        return '';
    }
    
    return `
        <div class="min-h-screen bg-[#111827] relative">
            <!-- Left Sidebar -->
            ${Sidebar()}
            
            <!-- Right AI Chat Sidebar -->
            ${AIChatSidebar()}
            
            <!-- Main Content with dynamic margins -->
            <div id="mainContent" class="min-h-screen transition-all duration-300" 
                 style="margin-left: 256px; margin-right: 384px; width: calc(100% - 640px);">
                ${await Dashboard()}
            </div>
        </div>
        
        <script>
            (function() {
                // Function to adjust main content based on right sidebar visibility
                function adjustMainContent() {
                    const sidebar = document.getElementById('aiChatSidebar');
                    const mainContent = document.getElementById('mainContent');
                    
                    if (sidebar && mainContent) {
                        if (sidebar.style.display === 'none') {
                            mainContent.style.marginRight = '0';
                            mainContent.style.width = 'calc(100% - 256px)';
                        } else {
                            mainContent.style.marginRight = '384px';
                            mainContent.style.width = 'calc(100% - 640px)';
                        }
                    }
                }
                
                // Watch for close button
                const closeBtn = document.getElementById('closeAIChat');
                if (closeBtn) {
                    closeBtn.addEventListener('click', function() {
                        setTimeout(adjustMainContent, 50);
                    });
                }
                
                // Watch for toggle button
                const toggleBtn = document.getElementById('aiChatToggle');
                if (toggleBtn) {
                    toggleBtn.addEventListener('click', function() {
                        setTimeout(adjustMainContent, 50);
                    });
                }
                
                // Initial adjustment
                window.addEventListener('load', adjustMainContent);
            })();
        </script>
    `;
}

async function HistoryPage() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    if (!isAuthenticated) {
        window.location.hash = '#/login';
        return '';
    }
    
    const notes = await getSavedNotes();
    const history = await getSearchHistory();
    
    return `
        <div class="min-h-screen bg-[#111827] relative">
            <!-- Left Sidebar -->
            ${Sidebar()}
            
            <!-- Right AI Chat Sidebar -->
            ${AIChatSidebar()}
            
            <!-- Main Content with dynamic margins -->
            <div id="mainContent" class="min-h-screen transition-all duration-300" 
                 style="margin-left: 256px; margin-right: 384px; width: calc(100% - 640px);">
                ${Header({ title: 'History' })}
                <main class="container mx-auto px-4 py-8">
                    <div class="mb-8 animate-fadeIn">
                        <h1 class="text-3xl font-bold text-[#E5E7EB]">Your Learning Journey</h1>
                        <p class="text-[#9CA3AF] mt-2">Track all your saved notes and search history</p>
                    </div>
                    
                    <div class="flex gap-4 mb-8">
                        <div class="bg-[#1F2937] px-4 py-2 rounded-lg">
                            <span class="text-[#3B82F6] font-bold">${notes.length}</span>
                            <span class="text-[#9CA3AF] text-sm ml-1">Notes</span>
                        </div>
                        <div class="bg-[#1F2937] px-4 py-2 rounded-lg">
                            <span class="text-[#3B82F6] font-bold">${history.length}</span>
                            <span class="text-[#9CA3AF] text-sm ml-1">Searches</span>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <!-- Saved Notes Section -->
                        <div class="bg-[#1F2937] rounded-xl shadow-lg p-6">
                            <h2 class="text-2xl font-bold mb-4 text-[#3B82F6]">Saved Notes (${notes.length})</h2>
                            <div class="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                ${notes.length > 0 ? notes.map(note => `
                                    <div class="bg-[#111827] p-4 rounded-lg">
                                        <span class="bg-[#3B82F6] text-white text-xs px-2 py-1 rounded">${note.topic}</span>
                                        <p class="text-[#3B82F6] font-semibold mt-2">Q: ${truncateText(note.question, 80)}</p>
                                        <p class="text-[#E5E7EB] text-sm">${truncateText(note.answer, 150)}</p>
                                    </div>
                                `).join('') : '<p class="text-center text-[#9CA3AF] py-8">No saved notes yet</p>'}
                            </div>
                        </div>
                        
                        <!-- Search History Section -->
                        <div class="bg-[#1F2937] rounded-xl shadow-lg p-6">
                            <h2 class="text-2xl font-bold mb-4 text-[#3B82F6]">Search History (${history.length})</h2>
                            <div class="space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar">
                                ${history.length > 0 ? history.map(entry => `
                                    <div class="bg-[#111827] p-3 rounded-lg flex justify-between">
                                        <span>${entry.topic}</span>
                                        <span class="text-[#9CA3AF] text-sm">${formatDate(entry.searchedAt)}</span>
                                    </div>
                                `).join('') : '<p class="text-center text-[#9CA3AF] py-8">No history yet</p>'}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
        
        <script>
            (function() {
                function adjustMainContent() {
                    const sidebar = document.getElementById('aiChatSidebar');
                    const mainContent = document.getElementById('mainContent');
                    
                    if (sidebar && mainContent) {
                        if (sidebar.style.display === 'none') {
                            mainContent.style.marginRight = '0';
                            mainContent.style.width = 'calc(100% - 256px)';
                        } else {
                            mainContent.style.marginRight = '384px';
                            mainContent.style.width = 'calc(100% - 640px)';
                        }
                    }
                }
                
                const closeBtn = document.getElementById('closeAIChat');
                if (closeBtn) {
                    closeBtn.addEventListener('click', function() {
                        setTimeout(adjustMainContent, 50);
                    });
                }
                
                const toggleBtn = document.getElementById('aiChatToggle');
                if (toggleBtn) {
                    toggleBtn.addEventListener('click', function() {
                        setTimeout(adjustMainContent, 50);
                    });
                }
                
                window.addEventListener('load', adjustMainContent);
            })();
        </script>
    `;
}

// ============= ROUTES =============
const routes = {
    [ROUTES.HOME]: WelcomePage,
    [ROUTES.WELCOME]: WelcomePage,
    [ROUTES.REGISTER]: RegisterPage,
    [ROUTES.LOGIN]: LoginPage,
    [ROUTES.VERIFY_OTP]: VerifyOTPPage,
    [ROUTES.DASHBOARD]: DashboardPage,
    [ROUTES.HISTORY]: HistoryPage
};

// ============= ROUTER =============
async function router() {
    let path = window.location.hash.slice(1) || '/';
    if (path.endsWith('/') && path.length > 1) path = path.slice(0, -1);
    
    const pageFunction = routes[path];
    const app = document.getElementById('app');
    
    if (!app) return;
    
    app.innerHTML = `<div class="min-h-screen flex items-center justify-center"><div class="loading-spinner"><div></div><div></div><div></div></div></div>`;
    
    try {
        const pageContent = await (typeof pageFunction === 'function' ? pageFunction() : pageFunction);
        app.innerHTML = pageContent;
        
        setupNavigation();
        
        setTimeout(() => {
            setupNavbar();
            setupSidebar();
            setupHeader();
            setupAIChat();
            
            if (path === ROUTES.REGISTER) setupRegistrationForm();
            else if (path === ROUTES.LOGIN) setupLoginForm();
            else if (path === ROUTES.VERIFY_OTP) setupOTPVerification();
            else if (path === ROUTES.DASHBOARD) setupDashboard();
            else if (path === ROUTES.HISTORY) setupHistoryEvents();
        }, 100);
        
    } catch (error) {
        app.innerHTML = `<div class="min-h-screen flex items-center justify-center">Error loading page</div>`;
    }
}

// ============= INITIALIZE =============
window.addEventListener('hashchange', router);
document.addEventListener('DOMContentLoaded', () => {
    if (!window.location.hash) window.location.hash = '#/';
    else router();
});

export { router };