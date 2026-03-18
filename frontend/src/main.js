// src/main.js - Complete file with all imports and functionality

// ============= UTILITIES =============
import { setupNavigation } from './utils/navigation.js';
import { formatDate, truncateText, getInitials, copyToClipboard } from './utils/helpers.js';
import { validateRegistration, validateLogin, validateOTP, validateTopic } from './utils/validation.js';
import { ROUTES, QUICK_TOPICS, SUCCESS_MESSAGES, ERROR_MESSAGES } from './utils/constants.js';
import { isSupabaseConfigured } from './services/supabase.js';

// ============= SERVICES =============
import { generateQA } from './services/ai.js';
import { 
    registerUser, 
    loginUser, 
    verifyOTP, 
    resendOTP, 
    logoutUser,
    getCurrentUserProfile 
} from './services/auth.js';
import { 
    saveNote, 
    getSavedNotes, 
    deleteNote,
    addToHistory, 
    getSearchHistory 
} from './services/storage.js';
import { isSupabaseConfigured } from './services/supabase.js';

// ============= COMPONENTS =============
// Common Components
import { LoadingSpinner } from './components/common/LoadingSpinner.js';
import { ErrorMessage, showError } from './components/common/ErrorMessage.js';
import { Header, setupHeader } from './components/common/Header.js';
import { Footer } from './components/common/Footer.js';

// Layout Components
import { Navbar, setupNavbar } from './components/layout/Navbar.js';
import { Sidebar, setupSidebar } from './components/layout/Sidebar.js';

// Auth Components
import { LoginForm, setupLoginForm } from './components/auth/LoginForm.js';
import { RegistrationForm, setupRegistrationForm } from './components/auth/RegistrationForm.js';
import { OTPVerification, setupOTPVerification } from './components/auth/OTPVerification.js';

// Main Components
import { StorageArea, setupStorageEvents } from './components/main/StorageArea.js';
import { HistoryList, setupHistoryEvents } from './components/main/HistoryList.js';
import { QACard, setupQACardEvents } from './components/main/QACard.js';

// ============= PAGE COMPONENTS =============

/**
 * Welcome/Landing Page
 */
function WelcomePage() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    return `
        <div class="min-h-screen flex flex-col">
            ${Navbar()}
            
            <!-- Hero Section with Animated Background -->
            <div class="flex-1 animated-bg">
                <div class="container mx-auto px-4 py-20">
                    <div class="max-w-4xl mx-auto text-center">
                        <!-- Logo Animation -->
                        <div class="mb-8 animate-bounce">
                            <div class="w-24 h-24 mx-auto bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform">
                                <span class="text-white text-4xl font-bold">F</span>
                            </div>
                        </div>
                        
                        <!-- Main Heading -->
                        <h1 class="text-6xl md:text-7xl font-bold mb-6">
                            <span class="bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">
                                Flashnotes
                            </span>
                        </h1>
                        
                        <p class="text-2xl text-[#60A5FA] mb-6">Your AI-Powered Learning Companion</p>
                        
                        <p class="text-xl text-[#E5E7EB] mb-12 max-w-2xl mx-auto">
                            Generate instant questions and answers for any topic. Save, organize, and review your learning materials effortlessly.
                        </p>
                        
                        <!-- CTA Buttons -->
                        <div class="flex gap-4 justify-center">
                            ${!isAuthenticated ? `
                                <a href="#/register" 
                                   class="bg-[#3B82F6] hover:bg-[#60A5FA] text-white px-8 py-4 rounded-lg transition-all transform hover:scale-105 shadow-lg text-lg font-semibold">
                                    Get Started Free
                                </a>
                                <a href="#/login" 
                                   class="border-2 border-[#3B82F6] text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white px-8 py-4 rounded-lg transition-all text-lg font-semibold">
                                    Sign In
                                </a>
                            ` : `
                                <a href="#/dashboard" 
                                   class="bg-[#3B82F6] hover:bg-[#60A5FA] text-white px-8 py-4 rounded-lg transition-all transform hover:scale-105 shadow-lg text-lg font-semibold">
                                    Go to Dashboard
                                </a>
                            `}
                        </div>
                        
                        <!-- Loading Animation -->
                        <div class="mt-16">
                            ${LoadingSpinner()}
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Features Section -->
            <div id="features" class="bg-[#1F2937] py-20">
                <div class="container mx-auto px-4">
                    <h2 class="text-4xl font-bold text-center mb-12 text-[#3B82F6]">Why Choose Flashnotes?</h2>
                    
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <!-- Feature 1: AI-Powered -->
                        <div class="text-center p-6 hover:transform hover:scale-105 transition-transform">
                            <div class="w-16 h-16 bg-[#3B82F6] rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                </svg>
                            </div>
                            <h3 class="text-xl font-bold text-[#E5E7EB] mb-2">AI-Powered</h3>
                            <p class="text-[#9CA3AF]">Get intelligent questions and answers generated instantly for any topic using advanced AI.</p>
                        </div>
                        
                        <!-- Feature 2: Save & Organize -->
                        <div class="text-center p-6 hover:transform hover:scale-105 transition-transform">
                            <div class="w-16 h-16 bg-[#3B82F6] rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                                </svg>
                            </div>
                            <h3 class="text-xl font-bold text-[#E5E7EB] mb-2">Save & Organize</h3>
                            <p class="text-[#9CA3AF]">Store your favorite Q&A pairs and access them anytime, anywhere across all devices.</p>
                        </div>
                        
                        <!-- Feature 3: Track Progress -->
                        <div class="text-center p-6 hover:transform hover:scale-105 transition-transform">
                            <div class="w-16 h-16 bg-[#3B82F6] rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <h3 class="text-xl font-bold text-[#E5E7EB] mb-2">Track History</h3>
                            <p class="text-[#9CA3AF]">Never lose your learning trail with automatic search history tracking and progress monitoring.</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- How It Works Section -->
            <div class="py-20 bg-[#111827]">
                <div class="container mx-auto px-4">
                    <h2 class="text-4xl font-bold text-center mb-12 text-[#3B82F6]">How It Works</h2>
                    
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div class="text-center">
                            <div class="w-12 h-12 bg-[#3B82F6] rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
                            <h3 class="font-bold mb-2">Enter Topic</h3>
                            <p class="text-[#9CA3AF] text-sm">Type any subject you want to learn about</p>
                        </div>
                        <div class="text-center">
                            <div class="w-12 h-12 bg-[#3B82F6] rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
                            <h3 class="font-bold mb-2">AI Generates</h3>
                            <p class="text-[#9CA3AF] text-sm">Our AI creates relevant questions and answers</p>
                        </div>
                        <div class="text-center">
                            <div class="w-12 h-12 bg-[#3B82F6] rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
                            <h3 class="font-bold mb-2">Save & Review</h3>
                            <p class="text-[#9CA3AF] text-sm">Save important Q&As for later review</p>
                        </div>
                        <div class="text-center">
                            <div class="w-12 h-12 bg-[#3B82F6] rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">4</div>
                            <h3 class="font-bold mb-2">Track Progress</h3>
                            <p class="text-[#9CA3AF] text-sm">Monitor your learning journey over time</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Future Vision Section -->
            <div class="py-20 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA]">
                <div class="container mx-auto px-4 text-center">
                    <h2 class="text-4xl font-bold text-white mb-6">The Future of Learning</h2>
                    <p class="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                        We're building the ultimate AI learning companion. Coming soon: voice input, multiple languages, collaborative learning, and personalized study plans.
                    </p>
                    
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8">
                        <div class="bg-white/10 p-4 rounded-lg">
                            <span class="text-2xl block mb-2">🎤</span>
                            <span class="text-white font-semibold">Voice Input</span>
                        </div>
                        <div class="bg-white/10 p-4 rounded-lg">
                            <span class="text-2xl block mb-2">🌐</span>
                            <span class="text-white font-semibold">Multiple Languages</span>
                        </div>
                        <div class="bg-white/10 p-4 rounded-lg">
                            <span class="text-2xl block mb-2">👥</span>
                            <span class="text-white font-semibold">Collaborative</span>
                        </div>
                        <div class="bg-white/10 p-4 rounded-lg">
                            <span class="text-2xl block mb-2">📊</span>
                            <span class="text-white font-semibold">Study Plans</span>
                        </div>
                    </div>
                    
                    <a href="#/register" 
                       class="inline-block bg-white text-[#3B82F6] px-8 py-4 rounded-lg font-semibold hover:shadow-xl transition-all transform hover:scale-105">
                        Join the Waitlist
                    </a>
                </div>
            </div>
            
            <!-- Stats Section -->
            <div class="bg-[#1F2937] py-16">
                <div class="container mx-auto px-4">
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div class="text-3xl font-bold text-[#3B82F6]">10K+</div>
                            <div class="text-[#9CA3AF] mt-2">Active Users</div>
                        </div>
                        <div>
                            <div class="text-3xl font-bold text-[#3B82F6]">50K+</div>
                            <div class="text-[#9CA3AF] mt-2">Questions Generated</div>
                        </div>
                        <div>
                            <div class="text-3xl font-bold text-[#3B82F6]">100+</div>
                            <div class="text-[#9CA3AF] mt-2">Topics Covered</div>
                        </div>
                        <div>
                            <div class="text-3xl font-bold text-[#3B82F6]">4.8</div>
                            <div class="text-[#9CA3AF] mt-2">User Rating</div>
                        </div>
                    </div>
                </div>
            </div>
            
            ${Footer()}
        </div>
    `;
}

/**
 * Registration Page
 */
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

/**
 * Login Page
 */
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

/**
 * OTP Verification Page
 */
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

/**
 * Dashboard Page
 */
async function DashboardPage() {
    const userProfile = await getCurrentUserProfile();
    const notes = await getSavedNotes();
    const history = await getSearchHistory();
    const userName = localStorage.getItem('userName') || userProfile?.name || 'Learner';
    
    return `
        <div class="min-h-screen bg-[#111827] flex">
            ${Sidebar()}
            
            <div class="flex-1 main-content">
                ${Header({ title: 'Dashboard', userName })}
                
                <main class="container mx-auto px-4 py-8">
                    <!-- Welcome Message -->
                    <div class="mb-8 animate-fadeIn">
                        <h1 class="text-3xl font-bold text-[#E5E7EB]">
                            Welcome back, <span class="text-[#3B82F6]">${userName}!</span>
                        </h1>
                        <p class="text-[#9CA3AF] mt-2">Ready to learn something new today?</p>
                    </div>
                    
                    <!-- Quick Stats -->
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
                    
                    <!-- Topic Input Section -->
                    <div class="bg-[#1F2937] p-8 rounded-xl shadow-lg mb-8 hover:shadow-2xl transition-shadow">
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
                        
                        <!-- Quick Topics -->
                        <div class="flex flex-wrap gap-2 mt-4">
                            <span class="text-[#9CA3AF] text-sm">Popular:</span>
                            ${QUICK_TOPICS.slice(0, 6).map(topic => `
                                <button class="quick-topic text-sm text-[#60A5FA] hover:text-[#3B82F6] px-3 py-1 bg-[#111827] rounded-full transition-colors">
                                    ${topic}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- Q&A Display Section -->
                    <div id="qaDisplay" class="space-y-4 mb-8">
                        <!-- Welcome message when no Q&A -->
                        <div class="text-center py-12 bg-[#1F2937] rounded-xl">
                            <svg class="w-20 h-20 mx-auto text-[#4B5563] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <p class="text-[#9CA3AF] text-lg">Enter a topic above to generate questions and answers</p>
                            <p class="text-sm text-[#6B7280] mt-2">Try "Operating System" or "Machine Learning" to get started</p>
                        </div>
                    </div>
                    
                    <!-- Storage and History Section -->
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div class="storage-section">
                            ${StorageArea()}
                        </div>
                        <div class="history-section">
                            ${HistoryList()}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    `;
}

/**
 * History Page
 */
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
                        <!-- Saved Notes Section -->
                        <div class="bg-[#1F2937] rounded-xl shadow-lg p-6">
                            <h2 class="text-2xl font-bold mb-4 text-[#3B82F6] flex items-center gap-2">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                                </svg>
                                Saved Notes (${notes.length})
                            </h2>
                            
                            <div class="space-y-4 max-h-[600px] overflow-y-auto pr-2" id="savedNotesContainer">
                                ${notes.length > 0 ? notes.map(note => `
                                    <div class="bg-[#111827] p-4 rounded-lg hover:shadow-lg transition-all" data-note-id="${note.id}">
                                        <div class="flex justify-between items-start mb-2">
                                            <span class="bg-[#3B82F6] text-white text-xs px-2 py-1 rounded">${note.topic}</span>
                                            <span class="text-[#9CA3AF] text-xs">${formatDate(note.savedAt)}</span>
                                        </div>
                                        <p class="text-[#3B82F6] font-semibold mb-2">Q: ${truncateText(note.question, 80)}</p>
                                        <p class="text-[#E5E7EB] text-sm">${truncateText(note.answer, 150)}</p>
                                        <div class="flex justify-end mt-3">
                                            <button class="delete-note text-red-400 hover:text-red-500 text-sm flex items-center gap-1" data-id="${note.id}">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                </svg>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                `).join('') : `
                                    <div class="text-center py-12">
                                        <svg class="w-20 h-20 mx-auto text-[#4B5563] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                                        </svg>
                                        <p class="text-[#9CA3AF]">No saved notes yet</p>
                                        <p class="text-sm text-[#6B7280] mt-2">Generate Q&A and save them to see them here</p>
                                        <a href="#/dashboard" class="inline-block mt-4 bg-[#3B82F6] text-white px-4 py-2 rounded-lg hover:bg-[#60A5FA] transition-colors">
                                            Go to Dashboard
                                        </a>
                                    </div>
                                `}
                            </div>
                        </div>
                        
                        <!-- Search History Section -->
                        <div class="bg-[#1F2937] rounded-xl shadow-lg p-6">
                            <h2 class="text-2xl font-bold mb-4 text-[#3B82F6] flex items-center gap-2">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                Search History (${history.length})
                            </h2>
                            
                            <div class="space-y-2 max-h-[600px] overflow-y-auto" id="historyContainer">
                                ${history.length > 0 ? history.map(entry => `
                                    <div class="bg-[#111827] p-3 rounded-lg flex justify-between items-center hover:bg-[#1F2937] transition-all cursor-pointer history-item" data-topic="${entry.topic}">
                                        <div class="flex items-center gap-2">
                                            <svg class="w-4 h-4 text-[#60A5FA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                            </svg>
                                            <span class="text-[#E5E7EB]">${entry.topic}</span>
                                        </div>
                                        <span class="text-[#9CA3AF] text-sm">${formatDate(entry.searchedAt)}</span>
                                    </div>
                                `).join('') : `
                                    <div class="text-center py-12">
                                        <svg class="w-20 h-20 mx-auto text-[#4B5563] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                        <p class="text-[#9CA3AF]">No search history yet</p>
                                        <p class="text-sm text-[#6B7280] mt-2">Your searched topics will appear here</p>
                                    </div>
                                `}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    `;
}

// ============= ROUTES CONFIGURATION =============
const routes = {
    [ROUTES.HOME]: WelcomePage,
    [ROUTES.WELCOME]: WelcomePage,
    [ROUTES.REGISTER]: RegisterPage,
    [ROUTES.LOGIN]: LoginPage,
    [ROUTES.VERIFY_OTP]: VerifyOTPPage,
    [ROUTES.DASHBOARD]: DashboardPage,
    [ROUTES.HISTORY]: HistoryPage
};

// ============= GLOBAL STATE =============
let isGenerating = false;

// ============= DASHBOARD HANDLERS =============
async function handleGenerate() {
    if (isGenerating) return;
    
    const topicInput = document.getElementById('topicInput');
    const topic = topicInput.value.trim();
    
    // Validate topic
    const validation = validateTopic(topic);
    if (!validation.isValid) {
        showError(validation.errors.topic, 'warning');
        topicInput.focus();
        return;
    }
    
    const generateBtn = document.getElementById('generateBtn');
    const qaDisplay = document.getElementById('qaDisplay');
    
    isGenerating = true;
    
    // Show loading state
    generateBtn.disabled = true;
    generateBtn.innerHTML = '<span>Generating...</span> <div class="loading-spinner-small"></div>';
    
    // Show loading in display
    qaDisplay.innerHTML = `
        <div class="text-center py-12 bg-[#1F2937] rounded-xl">
            <div class="loading-spinner mx-auto"></div>
            <p class="text-[#9CA3AF] mt-4">Generating questions for "${topic}"...</p>
            <p class="text-sm text-[#6B7280] mt-2">This may take a few seconds</p>
        </div>
    `;
    
    try {
        // Add to history
        await addToHistory(topic);
        
        // Generate Q&A
        const qaList = await generateQA(topic);
        
        // Display results
        if (qaList.length > 0) {
            qaDisplay.innerHTML = qaList.map((qa, index) => 
                QACard(qa.question, qa.answer, topic, index)
            ).join('');
            
            // Setup card events
            setupQACardEvents();
            
            showError(SUCCESS_MESSAGES.NOTE_SAVED.replace('Note', 'Questions'), 'success');
        } else {
            qaDisplay.innerHTML = `
                <div class="text-center py-12 bg-[#1F2937] rounded-xl">
                    <p class="text-[#9CA3AF]">No questions generated. Try another topic.</p>
                </div>
            `;
        }
        
        // Update history display
        await refreshHistoryDisplay();
        
        // Update storage display
        await refreshStorageDisplay();
        
    } catch (error) {
        console.error('Generation error:', error);
        qaDisplay.innerHTML = `
            <div class="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg text-center">
                ${ERROR_MESSAGES.GENERIC}
            </div>
        `;
        showError(error.message || ERROR_MESSAGES.GENERIC, 'error');
    } finally {
        // Reset button
        generateBtn.disabled = false;
        generateBtn.innerHTML = '<span>Generate</span> <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>';
        isGenerating = false;
    }
}

// Refresh history display
async function refreshHistoryDisplay() {
    const historySection = document.querySelector('.history-section');
    if (historySection) {
        const historyList = await HistoryList();
        historySection.innerHTML = historyList;
        setupHistoryEvents();
    }
}

// Refresh storage display
async function refreshStorageDisplay() {
    const storageSection = document.querySelector('.storage-section');
    if (storageSection) {
        const storageArea = await StorageArea();
        storageSection.innerHTML = storageArea;
        setupStorageEvents();
    }
}

// Setup dashboard event listeners
async function setupDashboard() {
    console.log('Setting up dashboard');
    
    // Check authentication
    if (!localStorage.getItem('isAuthenticated')) {
        window.location.hash = ROUTES.LOGIN;
        return;
    }
    
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
    
    // Quick topic buttons
    const quickTopics = document.querySelectorAll('.quick-topic');
    quickTopics.forEach(btn => {
        btn.addEventListener('click', () => {
            if (topicInput) {
                topicInput.value = btn.textContent;
                handleGenerate();
            }
        });
    });
    
    // Setup storage and history events
    setupStorageEvents();
    setupHistoryEvents();
}

// ============= HASH-BASED ROUTER FUNCTION =============
async function router() {
    // Get the hash or default to '/'
    let path = window.location.hash.slice(1) || '/';
    
    // Remove trailing slash
    if (path.endsWith('/') && path.length > 1) {
        path = path.slice(0, -1);
    }
    
    console.log('Current hash path:', path);
    console.log('Supabase configured:', isSupabaseConfigured());
    
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
        } else {
            app.innerHTML = `
                <div class="min-h-screen flex items-center justify-center bg-[#111827]">
                    <div class="bg-[#1F2937] p-8 rounded-xl shadow-2xl text-center max-w-md">
                        <h1 class="text-2xl font-bold text-red-500 mb-4">Error</h1>
                        <p class="text-[#E5E7EB] mb-4">${error.message || 'Something went wrong'}</p>
                        <a href="#/" class="bg-[#3B82F6] hover:bg-[#60A5FA] text-white px-6 py-3 rounded-lg transition-all">
                            Go Home
                        </a>
                    </div>
                </div>
            `;
        }
    }
    
    // Setup navigation and component events
    setupNavigation();
    
    setTimeout(() => {
        // Global components
        setupNavbar();
        setupSidebar();
        setupHeader();
        
        // Page-specific components
        if (path === ROUTES.REGISTER) {
            setupRegistrationForm();
        } else if (path === ROUTES.LOGIN) {
            setupLoginForm();
        } else if (path === ROUTES.VERIFY_OTP) {
            setupOTPVerification();
        } else if (path === ROUTES.DASHBOARD) {
            setupDashboard();
        } else if (path === ROUTES.HISTORY) {
            setupHistoryEvents();
        }
    }, 100);
}

// ============= ADD ANY ADDITIONAL STYLES =============
const style = document.createElement('style');
style.textContent = `
    /* Additional animations */
    .fade-enter {
        opacity: 0;
        transform: translateY(10px);
    }
    
    .fade-enter-active {
        opacity: 1;
        transform: translateY(0);
        transition: opacity 300ms, transform 300ms;
    }
    
    /* Hover lift effect */
    .hover-lift {
        transition: transform 0.2s;
    }
    
    .hover-lift:hover {
        transform: translateY(-2px);
    }
    
    /* Gradient animation */
    @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
    
    .gradient-bg {
        background: linear-gradient(-45deg, #3B82F6, #60A5FA, #A78BFA, #8B5CF6);
        background-size: 400% 400%;
        animation: gradientShift 15s ease infinite;
    }
`;
document.head.appendChild(style);

// ============= INITIALIZE APP =============
// Listen for hash changes
window.addEventListener('hashchange', router);

// Initial route when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Log Supabase status
    console.log('Supabase configured:', isSupabaseConfigured());
    
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
export { router };