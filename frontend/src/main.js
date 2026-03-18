// frontend/src/main.js

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

// ============= COMPONENTS =============
import { LoadingSpinner } from './components/common/LoadingSpinner.js';
import { showError } from './components/common/ErrorMessage.js';
import { Header, setupHeader } from './components/common/Header.js';
import { Footer } from './components/common/Footer.js';
import { Navbar, setupNavbar } from './components/layout/Navbar.js';
import { Sidebar, setupSidebar } from './components/layout/Sidebar.js';
import { LoginForm, setupLoginForm } from './components/auth/LoginForm.js';
import { RegistrationForm, setupRegistrationForm } from './components/auth/RegistrationForm.js';
import { OTPVerification, setupOTPVerification } from './components/auth/OTPVerification.js';
import { QACard, setupQACardEvents } from './components/main/QACard.js';

// ============= PAGE COMPONENTS =============

function WelcomePage() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    return `
        <div class="min-h-screen flex flex-col">
            ${Navbar()}
            <div class="flex-1 animated-bg">
                <div class="container mx-auto px-4 py-20">
                    <div class="max-w-4xl mx-auto text-center">
                        <div class="mb-8 animate-bounce">
                            <div class="w-24 h-24 mx-auto bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-2xl flex items-center justify-center shadow-2xl">
                                <span class="text-white text-4xl font-bold">F</span>
                            </div>
                        </div>
                        <h1 class="text-6xl md:text-7xl font-bold mb-6">
                            <span class="bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">
                                Flashnotes
                            </span>
                        </h1>
                        <p class="text-2xl text-[#60A5FA] mb-6">Your AI-Powered Learning Companion</p>
                        <p class="text-xl text-[#E5E7EB] mb-12 max-w-2xl mx-auto">
                            Generate instant questions and answers for any topic. Save, organize, and review your learning materials effortlessly.
                        </p>
                        <div class="flex gap-4 justify-center">
                            ${!isAuthenticated ? `
                                <a href="#/register" class="bg-[#3B82F6] hover:bg-[#60A5FA] text-white px-8 py-4 rounded-lg transition-all transform hover:scale-105 shadow-lg text-lg font-semibold">
                                    Get Started Free
                                </a>
                                <a href="#/login" class="border-2 border-[#3B82F6] text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white px-8 py-4 rounded-lg transition-all text-lg font-semibold">
                                    Sign In
                                </a>
                            ` : `
                                <a href="#/dashboard" class="bg-[#3B82F6] hover:bg-[#60A5FA] text-white px-8 py-4 rounded-lg transition-all transform hover:scale-105 shadow-lg text-lg font-semibold">
                                    Go to Dashboard
                                </a>
                            `}
                        </div>
                        <div class="mt-16">
                            ${LoadingSpinner()}
                        </div>
                    </div>
                </div>
            </div>
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
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userName = user.name || localStorage.getItem('userName') || 'Learner';
    const notes = await getSavedNotes();
    const history = await getSearchHistory();
    
    return `
        <div class="min-h-screen bg-[#111827] flex">
            ${Sidebar()}
            <div class="flex-1 main-content">
                ${Header({ title: 'Dashboard', userName })}
                <main class="container mx-auto px-4 py-8">
                    <div class="mb-8 animate-fadeIn">
                        <h1 class="text-3xl font-bold text-[#E5E7EB]">
                            Welcome back, <span class="text-[#3B82F6]">${userName}!</span>
                        </h1>
                        <p class="text-[#9CA3AF] mt-2">Ready to learn something new today?</p>
                    </div>
                    
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div class="bg-[#1F2937] p-4 rounded-lg">
                            <div class="text-2xl font-bold text-[#3B82F6]">${notes.length}</div>
                            <div class="text-sm text-[#9CA3AF]">Saved Notes</div>
                        </div>
                        <div class="bg-[#1F2937] p-4 rounded-lg">
                            <div class="text-2xl font-bold text-[#3B82F6]">${history.length}</div>
                            <div class="text-sm text-[#9CA3AF]">Topics Searched</div>
                        </div>
                        <div class="bg-[#1F2937] p-4 rounded-lg">
                            <div class="text-2xl font-bold text-[#3B82F6]">${Math.floor(Math.random() * 10) + 1}</div>
                            <div class="text-sm text-[#9CA3AF]">Study Streak</div>
                        </div>
                        <div class="bg-[#1F2937] p-4 rounded-lg">
                            <div class="text-2xl font-bold text-[#3B82F6]">${new Date().toLocaleDateString()}</div>
                            <div class="text-sm text-[#9CA3AF]">Last Active</div>
                        </div>
                    </div>
                    
                    <div class="bg-[#1F2937] p-8 rounded-xl shadow-lg mb-8">
                        <h3 class="text-2xl font-bold mb-4 text-[#3B82F6] flex items-center gap-2">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                            </svg>
                            What would you like to learn today?
                        </h3>
                        
                        <div class="flex flex-col md:flex-row gap-4">
                            <input type="text" 
                                   id="topicInput"
                                   placeholder="e.g., Operating System, Quantum Physics, Machine Learning..." 
                                   class="flex-1 bg-[#111827] border-2 border-[#3B82F6] rounded-lg px-4 py-3 text-[#E5E7EB] focus:outline-none focus:border-[#A78BFA] transition-colors"
                                   autocomplete="off">
                            <button id="generateBtn" 
                                    class="bg-[#3B82F6] hover:bg-[#60A5FA] text-white px-8 py-3 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2 font-medium">
                                <span>Generate</span>
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                </svg>
                            </button>
                        </div>
                        
                        <div class="flex flex-wrap gap-2 mt-4">
                            <span class="text-[#9CA3AF] text-sm">Popular:</span>
                            ${QUICK_TOPICS.slice(0, 6).map(topic => `
                                <button class="quick-topic text-sm text-[#60A5FA] hover:text-[#3B82F6] px-3 py-1 bg-[#111827] rounded-full transition-colors">
                                    ${topic}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div id="qaDisplay" class="space-y-4 mb-8">
                        <div class="text-center py-12 bg-[#1F2937] rounded-xl">
                            <svg class="w-20 h-20 mx-auto text-[#4B5563] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <p class="text-[#9CA3AF] text-lg">Enter a topic above to generate questions and answers</p>
                            <p class="text-sm text-[#6B7280] mt-2">Try "Operating System" or "Machine Learning" to get started</p>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div class="storage-section" id="storageSection">
                            ${await StorageArea()}
                        </div>
                        <div class="history-section" id="historySection">
                            ${await HistoryList()}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    `;
}

async function HistoryPage() {
    const notes = await getSavedNotes();
    const history = await getSearchHistory();
    
    return `
        <div class="min-h-screen bg-[#111827] flex">
            ${Sidebar()}
            <div class="flex-1 main-content">
                ${Header({ title: 'History' })}
                <main class="container mx-auto px-4 py-8">
                    <div class="mb-8">
                        <h1 class="text-3xl font-bold text-[#E5E7EB]">Your Learning Journey</h1>
                        <p class="text-[#9CA3AF] mt-2">Track all your saved notes and search history</p>
                    </div>
                    
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div class="bg-[#1F2937] rounded-xl shadow-lg p-6">
                            <h2 class="text-2xl font-bold mb-4 text-[#3B82F6]">Saved Notes (${notes.length})</h2>
                            <div class="space-y-4 max-h-[600px] overflow-y-auto">
                                ${notes.length > 0 ? notes.map(note => `
                                    <div class="bg-[#111827] p-4 rounded-lg">
                                        <span class="bg-[#3B82F6] text-white text-xs px-2 py-1 rounded">${note.topic}</span>
                                        <p class="text-[#3B82F6] font-semibold mt-2">Q: ${truncateText(note.question, 80)}</p>
                                        <p class="text-[#E5E7EB] text-sm">${truncateText(note.answer, 150)}</p>
                                        <p class="text-[#9CA3AF] text-xs mt-2">${formatDate(note.savedAt)}</p>
                                    </div>
                                `).join('') : '<p class="text-center text-[#9CA3AF] py-8">No saved notes yet</p>'}
                            </div>
                        </div>
                        
                        <div class="bg-[#1F2937] rounded-xl shadow-lg p-6">
                            <h2 class="text-2xl font-bold mb-4 text-[#3B82F6]">Search History (${history.length})</h2>
                            <div class="space-y-2 max-h-[600px] overflow-y-auto">
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
    `;
}

// Storage Area component
async function StorageArea() {
    const notes = await getSavedNotes();
    return `
        <div class="bg-[#1F2937] p-6 rounded-xl shadow-lg">
            <h3 class="text-2xl font-bold mb-4 text-[#3B82F6]">Saved Notes (${notes.length})</h3>
            <div class="space-y-3 max-h-96 overflow-y-auto">
                ${notes.length > 0 ? notes.map(note => `
                    <div class="bg-[#111827] p-4 rounded-lg">
                        <span class="bg-[#3B82F6] text-white text-xs px-2 py-1 rounded">${note.topic}</span>
                        <p class="text-[#E5E7EB] mt-2">Q: ${truncateText(note.question, 50)}</p>
                    </div>
                `).join('') : '<p class="text-center text-[#9CA3AF] py-8">No saved notes</p>'}
            </div>
        </div>
    `;
}

// History List component
async function HistoryList() {
    const history = await getSearchHistory();
    return `
        <div class="bg-[#1F2937] p-6 rounded-xl shadow-lg">
            <h3 class="text-2xl font-bold mb-4 text-[#3B82F6]">Search History (${history.length})</h3>
            <div class="space-y-2 max-h-96 overflow-y-auto">
                ${history.length > 0 ? history.map(entry => `
                    <div class="bg-[#111827] p-3 rounded-lg flex justify-between">
                        <span>${entry.topic}</span>
                        <span class="text-[#9CA3AF] text-sm">${formatDate(entry.searchedAt)}</span>
                    </div>
                `).join('') : '<p class="text-center text-[#9CA3AF] py-8">No history yet</p>'}
            </div>
        </div>
    `;
}

// Routes
const routes = {
    '/': WelcomePage,
    '/welcome': WelcomePage,
    '/register': RegisterPage,
    '/login': LoginPage,
    '/verify-otp': VerifyOTPPage,
    '/dashboard': DashboardPage,
    '/history': HistoryPage
};

// Router
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
            
            if (path === '/register') setupRegistrationForm();
            else if (path === '/login') setupLoginForm();
            else if (path === '/verify-otp') setupOTPVerification();
            else if (path === '/dashboard') setupDashboard();
        }, 100);
    } catch (error) {
        app.innerHTML = `<div class="min-h-screen flex items-center justify-center">Error loading page</div>`;
    }
}

// Setup dashboard
function setupDashboard() {
    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn) {
        generateBtn.addEventListener('click', handleGenerate);
    }
}

// Handle generate
let isGenerating = false;
async function handleGenerate() {
    if (isGenerating) return;
    
    const input = document.getElementById('topicInput');
    const topic = input.value.trim();
    
    if (!topic) {
        showError('Please enter a topic', 'warning');
        return;
    }
    
    isGenerating = true;
    const btn = document.getElementById('generateBtn');
    btn.disabled = true;
    btn.innerHTML = 'Generating...';
    
    try {
        await addToHistory(topic);
        const qaList = await generateQA(topic);
        
        document.getElementById('qaDisplay').innerHTML = qaList.map((qa, i) => 
            QACard(qa.question, qa.answer, topic, i)
        ).join('');
        
        setupQACardEvents();
        
        // Refresh sections
        document.getElementById('storageSection').innerHTML = await StorageArea();
        document.getElementById('historySection').innerHTML = await HistoryList();
        
    } catch (error) {
        showError('Failed to generate', 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = 'Generate';
        isGenerating = false;
    }
}

// Initialize
window.addEventListener('hashchange', router);
document.addEventListener('DOMContentLoaded', () => {
    if (!window.location.hash) window.location.hash = '#/';
    else router();
});