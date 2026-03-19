// frontend/src/main.js - COMPLETE UPDATED VERSION WITH ALL ROUTES

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

// ============= PAGE IMPORTS =============
import { SavedPage } from './pages/SavedPage.js';
import { QuizPage } from './pages/QuizPage.js';
import { ScorePage } from './pages/ScorePage.js';
import { ProfilePage } from './pages/ProfilePage.js';
import { SettingsPage } from './pages/SettingsPage.js';
import { NotificationsPage } from './pages/NotificationsPage.js';

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
            ${Sidebar()}
            ${AIChatSidebar()}
            <div id="mainContent" class="min-h-screen transition-all duration-300" 
                 style="margin-left: 256px; margin-right: 384px; width: calc(100% - 640px);">
                ${await Dashboard()}
            </div>
        </div>
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
            ${Sidebar()}
            ${AIChatSidebar()}
            <div id="mainContent" class="min-h-screen transition-all duration-300" 
                 style="margin-left: 256px; margin-right: 384px; width: calc(100% - 640px);">
                ${Header({ title: 'History' })}
                <main class="container mx-auto px-4 py-8">
                    <div class="mb-8">
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
                    
                    <!-- Rest of your history content -->
                </main>
            </div>
        </div>
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
    [ROUTES.HISTORY]: HistoryPage,
    // NEW ROUTES
    [ROUTES.SAVED]: SavedPage,
    [ROUTES.QUIZ]: QuizPage,
    [ROUTES.SCORE]: ScorePage,
    [ROUTES.PROFILE]: ProfilePage,
    [ROUTES.SETTINGS]: SettingsPage,
    [ROUTES.NOTIFICATIONS]: NotificationsPage
};

// ============= GLOBAL STATE =============
let isGenerating = false;

// ============= HANDLE GENERATE FUNCTION =============
async function handleGenerate() {
    if (isGenerating) return;
    
    const input = document.getElementById('topicInput');
    if (!input) return;
    
    const topic = input.value.trim();
    
    // Validate topic
    const validation = validateTopic(topic);
    if (!validation.isValid) {
        showError(validation.errors.topic, 'warning');
        input.focus();
        return;
    }
    
    const generateBtn = document.getElementById('generateBtn');
    const qaDisplay = document.getElementById('qaDisplay');
    
    isGenerating = true;
    
    // Show loading state
    if (generateBtn) {
        generateBtn.disabled = true;
        generateBtn.innerHTML = '<span>Generating...</span> <div class="loading-spinner-small"></div>';
    }
    
    // Show loading in display
    if (qaDisplay) {
        qaDisplay.innerHTML = `
            <div class="text-center py-12 bg-[#1F2937] rounded-xl">
                <div class="loading-spinner mx-auto"></div>
                <p class="text-[#9CA3AF] mt-4">Generating questions for "${topic}"...</p>
                <p class="text-sm text-[#6B7280] mt-2">This may take a few seconds</p>
            </div>
        `;
    }
    
    try {
        // Add to history
        await addToHistory(topic);
        
        // Generate Q&A
        const qaList = await generateQA(topic);
        
        // Display results
        if (qaDisplay) {
            if (qaList.length > 0) {
                qaDisplay.innerHTML = qaList.map((qa, index) => 
                    QACard(qa.question, qa.answer, topic, index)
                ).join('');
                
                // Setup card events
                setupQACardEvents();
                
                showError('Questions generated successfully!', 'success');
            } else {
                qaDisplay.innerHTML = `
                    <div class="text-center py-12 bg-[#1F2937] rounded-xl">
                        <p class="text-[#9CA3AF]">No questions generated. Try another topic.</p>
                    </div>
                `;
            }
        }
        
        // Refresh sections
        await refreshSections();
        
    } catch (error) {
        console.error('Generation error:', error);
        if (qaDisplay) {
            qaDisplay.innerHTML = `
                <div class="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg text-center">
                    ${ERROR_MESSAGES.GENERIC || 'Error generating questions. Please try again.'}
                </div>
            `;
        }
        showError(error.message || ERROR_MESSAGES.GENERIC, 'error');
    } finally {
        // Reset button
        if (generateBtn) {
            generateBtn.disabled = false;
            generateBtn.innerHTML = '<span>Generate</span> <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>';
        }
        isGenerating = false;
    }
}

// Refresh dashboard sections
async function refreshSections() {
    // Refresh storage section
    const storageSection = document.querySelector('.storage-section');
    if (storageSection) {
        const newStorage = await StorageArea();
        storageSection.innerHTML = newStorage;
        setupStorageEvents();
    }
    
    // Refresh history section
    const historySection = document.querySelector('.history-section');
    if (historySection) {
        const newHistory = await HistoryList();
        historySection.innerHTML = newHistory;
        setupHistoryEvents();
    }
}

// ============= SETUP DASHBOARD =============
function setupDashboardEvents() {
    // Generate button
    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn) {
        const newBtn = generateBtn.cloneNode(true);
        generateBtn.parentNode.replaceChild(newBtn, generateBtn);
        newBtn.addEventListener('click', handleGenerate);
    }
    
    // Enter key in input
    const topicInput = document.getElementById('topicInput');
    if (topicInput) {
        topicInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !isGenerating) {
                handleGenerate();
            }
        });
    }
    
    // Quick topics
    setupQuickTopics();
    
    // Storage and history events
    setupStorageEvents();
    setupHistoryEvents();
}

// ============= HASH-BASED ROUTER =============
async function router() {
    // Get the hash or default to '/'
    let path = window.location.hash.slice(1) || '/';
    
    // Remove trailing slash
    if (path.endsWith('/') && path.length > 1) {
        path = path.slice(0, -1);
    }
    
    console.log('Current hash path:', path);
    
    const pageFunction = routes[path];
    const app = document.getElementById('app');
    
    if (!app) return;
    
    // Show loading state
    app.innerHTML = `
        <div class="min-h-screen flex items-center justify-center">
            <div class="loading-spinner">
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    `;
    
    try {
        // Execute page function (might be async)
        const pageContent = await (typeof pageFunction === 'function' ? pageFunction() : pageFunction);
        app.innerHTML = pageContent;
        
        // Setup navigation
        setupNavigation();
        
        // Setup component events after a short delay
        setTimeout(() => {
            // Global components
            setupNavbar();
            setupSidebar();
            setupHeader();
            setupAIChat();
            
            // Page-specific components
            if (path === ROUTES.REGISTER) {
                setupRegistrationForm();
            } else if (path === ROUTES.LOGIN) {
                setupLoginForm();
            } else if (path === ROUTES.VERIFY_OTP) {
                setupOTPVerification();
            } else if (path === ROUTES.DASHBOARD) {
                setupDashboardEvents();
                setupDashboard();
            } else if (path === ROUTES.HISTORY) {
                setupHistoryEvents();
            }
            // New pages don't need special setup yet
        }, 100);
        
    } catch (error) {
        console.error('Router error:', error);
        
        // Handle 404
        if (!pageFunction) {
            app.innerHTML = `
                <div class="min-h-screen flex items-center justify-center bg-[#111827]">
                    <div class="bg-[#1F2937] p-8 rounded-xl shadow-2xl text-center max-w-md">
                        <h1 class="text-6xl font-bold text-[#3B82F6] mb-4">404</h1>
                        <p class="text-2xl text-[#E5E7EB] mb-4">Page Not Found</p>
                        <p class="text-[#9CA3AF] mb-8">The page you're looking for doesn't exist or has been moved.</p>
                        <a href="#/" class="bg-[#3B82F6] hover:bg-[#60A5FA] text-white px-6 py-3 rounded-lg transition-all transform hover:scale-105 inline-block">
                            Go Home
                        </a>
                    </div>
                </div>
            `;
        }
    }
}

// ============= INITIALIZE APP =============
// Listen for hash changes
window.addEventListener('hashchange', router);

// Initial route when page loads
document.addEventListener('DOMContentLoaded', () => {
    // If no hash, set to home
    if (!window.location.hash) {
        window.location.hash = '#/';
    } else {
        router();
    }
});

// Handle browser back/forward buttons
window.addEventListener('popstate', router);

// Export for use in other files
export { router, handleGenerate };