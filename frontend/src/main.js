// frontend/src/main.js - UPDATED WITH ROADMAP ROUTES

// ============= UTILITIES =============
import { setupNavigation, getCurrentPath, redirectIfNotAuthenticated, redirectIfAuthenticated } from './utils/navigation.js';
import { formatDate, truncateText, getInitials, debounce } from './utils/helpers.js';
import { validateTopic, validateSearch } from './utils/validation.js';
import { ROUTES, QUICK_TOPICS, ERROR_MESSAGES, SUCCESS_MESSAGES, APP_CONFIG } from './utils/constants.js';

// ============= SERVICES =============
import { generateQA } from './services/ai.js';
import { authAPI, getCurrentUserProfile } from './services/auth.js';

import { 
    saveNote, 
    getSavedNotes, 
    addToHistory, 
    getSearchHistory,
    deleteNote,
    syncPendingData,
    exportData,
    importData
} from './services/storage.js';
import { initNotifications, addNotificationListener, getUnreadCount, markAsRead } from './services/notificationService.js';

// ============= COMMON COMPONENTS =============
import { LoadingSpinner } from './components/common/LoadingSpinner.js';
import { showError, showSuccess } from './components/common/ErrorMessage.js';
import { Header, setupHeader } from './components/common/Header.js';
import { Footer } from './components/common/Footer.js';

// ============= LAYOUT COMPONENTS =============
import { Navbar, setupNavbar } from './components/layout/Navbar.js';
import { Sidebar, setupSidebar } from './components/layout/Sidebar.js';
import { AIChatSidebar, setupAIChat } from './components/layout/AIChatSidebar.js';
import { setupFeedbackModal } from './components/feedback/FeedbackModal.js';

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

// ============= FEEDBACK COMPONENTS =============
import { FeedbackForm, setupFeedbackForm } from './components/feedback/FeedbackForm.js';
import { FeedbackList, setupFeedbackList } from './components/feedback/FeedbackList.js';

// ============= PAGE IMPORTS =============
import { SavedPage, setupSavedPage } from './pages/SavedPage.js';
import { QuizPage, setupQuizPage } from './pages/QuizPage.js';
import { ScorePage, setupScorePage } from './pages/ScorePage.js';
import { ProfilePage, setupProfilePage } from './pages/ProfilePage.js';
import { SettingsPage, setupSettingsPage } from './pages/SettingsPage.js';
import { NotificationsPage, setupNotificationsPage } from './pages/NotificationsPage.js';
import { QuizAttemptPage, initQuizAttempt, cleanupQuiz } from './pages/QuizAttemptPage.js';
import { VerifyOTPPage, setupVerifyOTP } from './pages/VerifyOTPPage.js';
import { WelcomePage, setupWelcomePage } from './pages/WelcomePage.js';
import { PDFReaderPage, setupPDFReaderPage } from './pages/PDFReaderPage.js';
import { NotesGeneratorPage, setupNotesGeneratorPage } from './pages/NotesGeneratorPage.js';

// ============= ROADMAP PAGE IMPORTS =============
import { RoadmapPage, setupRoadmapPage } from './pages/RoadmapPage.js';
import { MyRoadmapsPage, setupMyRoadmapsPage } from './pages/MyRoadmapsPage.js';
import { RoadmapDetailPage, setupRoadmapDetailPage } from './pages/RoadmapDetailPage.js';

// ============= API URL CONFIGURATION =============
if (typeof window !== 'undefined' && !window.API_URL) {
    console.warn('⚠️ API_URL not configured, using default');
    window.API_URL = window.location.hostname === 'localhost' 
        ? 'http://localhost:10000/api'
        : 'https://flashnotes-api.onrender.com/api';
}
console.log('✅ API_URL:', window.API_URL);

// ============= PAGE COMPONENTS =============

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

function VerifyOTPPageComponent() {
    return `
        <div class="min-h-screen flex flex-col">
            ${Navbar()}
            <div class="flex-1">
                ${VerifyOTPPage()}
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
        <div class="min-h-screen bg-gradient-to-b from-[#111827] to-[#0F172A] relative">
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
        <div class="min-h-screen bg-gradient-to-b from-[#111827] to-[#0F172A] relative">
            ${Sidebar()}
            ${AIChatSidebar()}
            <div id="mainContent" class="min-h-screen transition-all duration-300" 
                 style="margin-left: 256px; margin-right: 384px; width: calc(100% - 640px);">
                ${Header({ title: 'History' })}
                <main class="container mx-auto px-4 py-8">
                    <div class="mb-8">
                        <h1 class="text-3xl font-bold text-[#E5E7EB]">Your Learning Journey</h1>
                        <p class="text-[#9CA3AF] mt-2">Track all your saved notes and search history</p>
                        <div class="w-24 h-1 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full mt-4"></div>
                    </div>
                    
                    <div class="flex gap-4 mb-8">
                        <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-xl px-4 py-2 border border-[#374151]">
                            <div class="text-2xl font-bold text-[#3B82F6]">${notes.length}</div>
                            <div class="text-xs text-[#9CA3AF]">Saved Notes</div>
                        </div>
                        <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-xl px-4 py-2 border border-[#374151]">
                            <div class="text-2xl font-bold text-[#3B82F6]">${history.length}</div>
                            <div class="text-xs text-[#9CA3AF]">Topics Searched</div>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <!-- Saved Notes Section -->
                        <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-6 border border-[#374151]">
                            <div class="flex items-center gap-2 mb-4">
                                <div class="w-8 h-8 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-lg flex items-center justify-center">
                                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                                    </svg>
                                </div>
                                <h3 class="text-lg font-bold text-[#E5E7EB]">Saved Notes</h3>
                            </div>
                            <div class="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
                                ${notes.length > 0 ? notes.map(note => `
                                    <div class="bg-[#111827] p-3 rounded-xl hover:bg-[#1F2937] transition-all">
                                        <div class="flex justify-between items-start">
                                            <span class="bg-[#3B82F6] text-white text-xs px-2 py-1 rounded">${note.topic}</span>
                                            <span class="text-[#9CA3AF] text-xs">${formatDate(note.savedAt)}</span>
                                        </div>
                                        <p class="text-[#3B82F6] font-semibold mt-2">Q: ${truncateText(note.question, 60)}</p>
                                        <p class="text-[#E5E7EB] text-sm mt-1">${truncateText(note.answer, 80)}</p>
                                    </div>
                                `).join('') : '<div class="text-center py-8 text-[#9CA3AF]">No saved notes</div>'}
                            </div>
                        </div>
                        
                        <!-- Search History Section -->
                        <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-6 border border-[#374151]">
                            <div class="flex items-center gap-2 mb-4">
                                <div class="w-8 h-8 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-lg flex items-center justify-center">
                                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </div>
                                <h3 class="text-lg font-bold text-[#E5E7EB]">Search History</h3>
                            </div>
                            <div class="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar">
                                ${history.length > 0 ? history.map(entry => `
                                    <div class="flex justify-between items-center p-2 bg-[#111827] rounded-lg hover:bg-[#1F2937] transition-all cursor-pointer history-item" data-topic="${entry.topic}">
                                        <span class="text-[#E5E7EB]">${entry.topic}</span>
                                        <span class="text-[#9CA3AF] text-xs">${formatDate(entry.searchedAt)}</span>
                                    </div>
                                `).join('') : '<div class="text-center py-8 text-[#9CA3AF]">No search history</div>'}
                            </div>
                        </div>
                    </div>
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
    [ROUTES.VERIFY_OTP]: VerifyOTPPageComponent,
    [ROUTES.DASHBOARD]: DashboardPage,
    [ROUTES.HISTORY]: HistoryPage,
    [ROUTES.SAVED]: SavedPage,
    [ROUTES.QUIZ]: QuizPage,
    [ROUTES.SCORE]: ScorePage,
    [ROUTES.PROFILE]: ProfilePage,
    [ROUTES.SETTINGS]: SettingsPage,
    [ROUTES.PDF_READER]: PDFReaderPage,
    [ROUTES.NOTIFICATIONS]: NotificationsPage,
    [ROUTES.NOTES_GENERATOR]: NotesGeneratorPage,
    
    // Roadmap Routes
    '/roadmap': RoadmapPage,
    '/my-roadmaps': MyRoadmapsPage,
};

// ============= GLOBAL STATE =============
let isGenerating = false;
let notificationUnsubscribe = null;

// ============= NOTIFICATION HANDLER =============
function setupNotificationListener() {
    const updateNotificationBadge = () => {
        const unreadCount = getUnreadCount();
        const notificationBtn = document.getElementById('notificationBtn');
        if (notificationBtn) {
            const existingBadge = notificationBtn.querySelector('.notification-badge');
            if (unreadCount > 0) {
                if (existingBadge) {
                    existingBadge.textContent = unreadCount > 9 ? '9+' : unreadCount;
                } else {
                    const badge = document.createElement('span');
                    badge.className = 'notification-badge absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-xs rounded-full flex items-center justify-center px-1 animate-pulse';
                    badge.textContent = unreadCount > 9 ? '9+' : unreadCount;
                    notificationBtn.appendChild(badge);
                }
            } else if (existingBadge) {
                existingBadge.remove();
            }
        }
    };
    
    notificationUnsubscribe = addNotificationListener(updateNotificationBadge);
    updateNotificationBadge();
}

// ============= HANDLE GENERATE FUNCTION =============
async function handleGenerate() {
    if (isGenerating) return;
    
    const input = document.getElementById('topicInput');
    if (!input) return;
    
    const topic = input.value.trim();
    
    const validation = validateTopic(topic);
    if (!validation.isValid) {
        showError(validation.errors.topic, 'warning');
        input.focus();
        return;
    }
    
    const generateBtn = document.getElementById('generateBtn');
    const qaDisplay = document.getElementById('qaDisplay');
    
    isGenerating = true;
    
    if (generateBtn) {
        generateBtn.disabled = true;
        generateBtn.innerHTML = '<span>Generating...</span> <div class="loading-spinner-small"></div>';
    }
    
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
        await addToHistory(topic);
        const qaList = await generateQA(topic);
        
        if (qaDisplay) {
            if (qaList.length > 0) {
                qaDisplay.innerHTML = qaList.map((qa, index) => 
                    QACard(qa.question, qa.answer, topic, index)
                ).join('');
                setupQACardEvents();
                showSuccess(SUCCESS_MESSAGES.NOTE_SAVED.replace('Note', 'Questions'), 'success');
            } else {
                qaDisplay.innerHTML = `
                    <div class="text-center py-12 bg-[#1F2937] rounded-xl">
                        <p class="text-[#9CA3AF]">No questions generated. Try another topic.</p>
                    </div>
                `;
            }
        }
        
        await refreshSections();
        
    } catch (error) {
        console.error('Generation error:', error);
        if (qaDisplay) {
            qaDisplay.innerHTML = `
                <div class="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg text-center">
                    ${ERROR_MESSAGES.GENERIC}
                </div>
            `;
        }
        showError(error.message || ERROR_MESSAGES.GENERIC, 'error');
    } finally {
        if (generateBtn) {
            generateBtn.disabled = false;
            generateBtn.innerHTML = '<span>Generate</span> <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>';
        }
        isGenerating = false;
    }
}

async function refreshSections() {
    const storageSection = document.querySelector('.storage-section');
    if (storageSection) {
        const newStorage = await StorageArea();
        storageSection.innerHTML = newStorage;
        setupStorageEvents();
    }
    
    const historySection = document.querySelector('.history-section');
    if (historySection) {
        const newHistory = await HistoryList();
        historySection.innerHTML = newHistory;
        setupHistoryEvents();
    }
}

function setupDashboardEvents() {
    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn) {
        const newBtn = generateBtn.cloneNode(true);
        generateBtn.parentNode.replaceChild(newBtn, generateBtn);
        newBtn.addEventListener('click', handleGenerate);
    }
    
    const topicInput = document.getElementById('topicInput');
    if (topicInput) {
        topicInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !isGenerating) {
                handleGenerate();
            }
        });
    }
    
    setupQuickTopics();
    setupStorageEvents();
    setupHistoryEvents();
}

// ============= HASH-BASED ROUTER =============
async function router() {
    let path = window.location.hash.slice(1) || '/';
    
    if (path.endsWith('/') && path.length > 1) {
        path = path.slice(0, -1);
    }
    
    console.log('Current hash path:', path);
    
    let pageFunction = routes[path];
    
    // Check for quiz attempt route
    const quizAttemptMatch = path.match(/^\/quiz\/(\d+)\/attempt$/);
    if (!pageFunction && quizAttemptMatch) {
        pageFunction = QuizAttemptPage;
    }
    
    // Check for roadmap detail route (e.g., /roadmap/123)
    const roadmapDetailMatch = path.match(/^\/roadmap\/(\d+)$/);
    if (!pageFunction && roadmapDetailMatch) {
        pageFunction = RoadmapDetailPage;
    }
    
    const app = document.getElementById('app');
    if (!app) return;
    
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
        cleanupQuiz();
        
        const pageContent = await (typeof pageFunction === 'function' ? pageFunction() : pageFunction);
        app.innerHTML = pageContent;
        
        setupNavigation();
        
        setTimeout(() => {
            // Global components
            setupNavbar();
            setupSidebar();
            setupHeader();
            setupAIChat();
            setupFeedbackModal();
            
            // Page-specific components
            if (path === ROUTES.HOME || path === ROUTES.WELCOME) {
                setupWelcomePage();
            } else if (path === ROUTES.REGISTER) {
                setupRegistrationForm();
            } else if (path === ROUTES.LOGIN) {
                setupLoginForm();
            } else if (path === ROUTES.VERIFY_OTP) {
                setupVerifyOTP();
            } else if (path === ROUTES.DASHBOARD) {
                setupDashboardEvents();
                setupDashboard();
            } else if (path === ROUTES.HISTORY) {
                setupHistoryEvents();
            } else if (path === ROUTES.QUIZ) {
                setupQuizPage();
            } else if (path === ROUTES.SCORE) {
                setupScorePage();
            } else if (path === ROUTES.SAVED) {
                setupSavedPage();
            } else if (path === ROUTES.PROFILE) {
                setupProfilePage();
            } else if (path === ROUTES.SETTINGS) {
                setupSettingsPage();
            } else if (path === ROUTES.NOTIFICATIONS) {
                setupNotificationsPage();
            } else if (path === ROUTES.PDF_READER) {
                setupPDFReaderPage();
            } else if (path === '/roadmap') {
                setupRoadmapPage();
            } else if (path === '/my-roadmaps') {
                setupMyRoadmapsPage();
            } else if (roadmapDetailMatch) {
                const roadmapId = roadmapDetailMatch[1];
                setupRoadmapDetailPage(roadmapId);
            } else if (quizAttemptMatch) {
                initQuizAttempt();
            } else if (path === '/notes-generator') {
                setupNotesGeneratorPage();
            }
        }, 100);
        
    } catch (error) {
        console.error('Router error:', error);
        app.innerHTML = `
            <div class="min-h-screen flex items-center justify-center">
                <div class="text-center">
                    <div class="text-red-500 text-xl mb-4">Error loading page</div>
                    <button onclick="window.location.reload()" class="bg-[#3B82F6] text-white px-4 py-2 rounded-lg">Reload</button>
                </div>
            </div>
        `;
    }
}

function setupOnlineSync() {
    window.addEventListener('online', async () => {
        console.log('Back online, syncing data...');
        showSuccess('Back online! Syncing your data...', 'info');
        const result = await syncPendingData();
        if (result && result.notes.success + result.history.success > 0) {
            showSuccess(`Synced ${result.notes.success + result.history.success} items`, 'success');
            if (getCurrentPath() === ROUTES.DASHBOARD) {
                await refreshSections();
            }
        }
    });
}

// ============= INITIALIZE APP =============
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Flashnotes App Initializing...');
    
    initNotifications();
    setupNotificationListener();
    setupOnlineSync();
    
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const currentPath = getCurrentPath();
    
    if (!isAuthenticated && currentPath !== '/' && currentPath !== '/welcome' && 
        currentPath !== '/login' && currentPath !== '/register' && currentPath !== '/verify-otp') {
        window.location.hash = '#/login';
        return;
    }
    
    if (!window.location.hash) {
        window.location.hash = '#/';
    } else {
        router();
    }
    
    if (navigator.onLine && isAuthenticated) {
        setTimeout(async () => {
            await syncPendingData();
        }, 3000);
    }
    
    if (isAuthenticated) {
        try {
            await getCurrentUserProfile();
        } catch (error) {
            console.error('Failed to load profile:', error);
        }
    }
});

window.addEventListener('hashchange', router);
window.addEventListener('popstate', router);

export { router, handleGenerate, cleanupQuiz };