// frontend/src/components/main/Dashboard.js - Enhanced UI with modern design

import { StorageArea } from './StorageArea.js';
import { HistoryList } from './HistoryList.js';
import { TopicInput } from './TopicInput.js';
import { QACard } from './QACard.js';
import { UserFeedbackCard, setupUserFeedback } from '../feedback/UserFeedbackCard.js';
import { getSavedNotes, getSearchHistory } from '../../services/storage.js';
import { showError } from '../common/ErrorMessage.js';

export async function Dashboard() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userName = user.name || localStorage.getItem('userName') || 'Learner';
    
    let notes = [];
    let history = [];
    
    try {
        notes = await getSavedNotes() || [];
        history = await getSearchHistory() || [];
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
    
    const notesCount = Array.isArray(notes) ? notes.length : 0;
    const historyCount = Array.isArray(history) ? history.length : 0;
    
    return `
        <div class="min-h-screen bg-gradient-to-b from-[#111827] to-[#0F172A]">
            <main class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
                <!-- Welcome Message with Gradient -->
                <div class="mb-10 animate-fadeIn">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 class="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#E5E7EB] to-[#9CA3AF] bg-clip-text text-transparent">
                                Welcome back, <span class="bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">${userName}</span>
                            </h1>
                            <p class="text-[#9CA3AF] mt-2 flex items-center gap-2">
                                <span class="w-1.5 h-1.5 bg-[#3B82F6] rounded-full animate-pulse"></span>
                                Ready to learn something new today?
                            </p>
                        </div>
                        
                        <!-- Mobile AI Chat Button -->
                        <button id="mobileAIChatBtn" 
                                class="mt-4 sm:mt-0 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] hover:from-[#60A5FA] hover:to-[#8B5CF6] text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg md:hidden">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                            </svg>
                            <span>AI Assistant</span>
                        </button>
                    </div>
                </div>
                
                <!-- Quick Stats Cards with Gradient Hover -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
                    <div class="group bg-gradient-to-br from-[#1F2937] to-[#111827] p-5 rounded-2xl hover:shadow-2xl hover:shadow-[#3B82F6]/10 transition-all duration-300 hover:-translate-y-1 border border-[#374151]">
                        <div class="flex items-center justify-between mb-3">
                            <div class="w-10 h-10 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] rounded-xl flex items-center justify-center">
                                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                                </svg>
                            </div>
                            <div class="text-3xl font-bold text-[#3B82F6] group-hover:scale-110 transition-transform">${notesCount}</div>
                        </div>
                        <div class="text-sm text-[#9CA3AF]">Saved Notes</div>
                        <div class="text-xs text-[#6B7280] mt-1">Your collection</div>
                    </div>
                    
                    <div class="group bg-gradient-to-br from-[#1F2937] to-[#111827] p-5 rounded-2xl hover:shadow-2xl hover:shadow-[#3B82F6]/10 transition-all duration-300 hover:-translate-y-1 border border-[#374151]">
                        <div class="flex items-center justify-between mb-3">
                            <div class="w-10 h-10 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] rounded-xl flex items-center justify-center">
                                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <div class="text-3xl font-bold text-[#3B82F6] group-hover:scale-110 transition-transform">${historyCount}</div>
                        </div>
                        <div class="text-sm text-[#9CA3AF]">Topics Searched</div>
                        <div class="text-xs text-[#6B7280] mt-1">Learning journey</div>
                    </div>
                    
                    <div class="group bg-gradient-to-br from-[#1F2937] to-[#111827] p-5 rounded-2xl hover:shadow-2xl hover:shadow-[#3B82F6]/10 transition-all duration-300 hover:-translate-y-1 border border-[#374151]">
                        <div class="flex items-center justify-between mb-3">
                            <div class="w-10 h-10 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] rounded-xl flex items-center justify-center">
                                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                </svg>
                            </div>
                            <div class="text-3xl font-bold text-[#3B82F6] group-hover:scale-110 transition-transform">${Math.floor(Math.random() * 10) + 1}</div>
                        </div>
                        <div class="text-sm text-[#9CA3AF]">Study Streak</div>
                        <div class="text-xs text-[#6B7280] mt-1">🔥 Keep going!</div>
                    </div>
                    
                    <div class="group bg-gradient-to-br from-[#1F2937] to-[#111827] p-5 rounded-2xl hover:shadow-2xl hover:shadow-[#3B82F6]/10 transition-all duration-300 hover:-translate-y-1 border border-[#374151]">
                        <div class="flex items-center justify-between mb-3">
                            <div class="w-10 h-10 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] rounded-xl flex items-center justify-center">
                                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                            </div>
                            <div class="text-3xl font-bold text-[#3B82F6] group-hover:scale-110 transition-transform">${new Date().toLocaleDateString()}</div>
                        </div>
                        <div class="text-sm text-[#9CA3AF]">Last Active</div>
                        <div class="text-xs text-[#6B7280] mt-1">Today's date</div>
                    </div>
                </div>
                
                <!-- Topic Input Section -->
                ${TopicInput()}
                
                <!-- Q&A Display Section -->
                <div id="qaDisplay" class="space-y-5 mb-10">
                    <!-- Welcome message with gradient -->
                    <div class="text-center py-16 bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl border border-[#374151]">
                        <div class="relative">
                            <div class="absolute inset-0 flex items-center justify-center">
                                <div class="w-32 h-32 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full opacity-10 blur-2xl"></div>
                            </div>
                            <svg class="w-24 h-24 mx-auto text-[#4B5563] mb-5 relative z-10 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <p class="text-[#9CA3AF] text-lg mb-2">Enter a topic above to generate questions and answers</p>
                            <p class="text-sm text-[#6B7280]">Try "Operating System" or "Machine Learning" to get started</p>
                        </div>
                    </div>
                </div>
                
                <!-- Storage and History Section -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div class="storage-section transform transition-all duration-300 hover:-translate-y-1">
                        ${await StorageArea()}
                    </div>
                    <div class="history-section transform transition-all duration-300 hover:-translate-y-1">
                        ${await HistoryList()}
                    </div>
                </div>
                
                <!-- User Feedback Section -->
                <div class="mt-8">
                    ${UserFeedbackCard()}
                </div>
            </main>
        </div>
    `;
}

// Setup dashboard event listeners
export function setupDashboard() {
    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn) {
        const newBtn = generateBtn.cloneNode(true);
        generateBtn.parentNode.replaceChild(newBtn, generateBtn);
        newBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleGenerate();
        });
    }
    
    const topicInput = document.getElementById('topicInput');
    if (topicInput) {
        topicInput.removeEventListener('keypress', handleKeyPress);
        topicInput.addEventListener('keypress', handleKeyPress);
    }
    
    const mobileAIChatBtn = document.getElementById('mobileAIChatBtn');
    if (mobileAIChatBtn) {
        mobileAIChatBtn.addEventListener('click', () => {
            toggleAIChat();
        });
    }
    
    // Setup User Feedback
    setupUserFeedback();
    
    // Add floating animation to stats cards
    const statsCards = document.querySelectorAll('.group');
    statsCards.forEach((card, index) => {
        card.style.animation = `fadeInUp 0.5s ease-out ${index * 0.1}s forwards`;
        card.style.opacity = '0';
    });
}

function handleKeyPress(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        handleGenerate();
    }
}

function toggleAIChat() {
    const aiSidebar = document.getElementById('aiChatSidebar');
    if (aiSidebar) {
        aiSidebar.classList.toggle('translate-x-full');
        aiSidebar.classList.toggle('translate-x-0');
    }
}

let isGenerating = false;
async function handleGenerate() {
    if (isGenerating) return;
    
    const input = document.getElementById('topicInput');
    if (!input) return;
    
    const topic = input.value.trim();
    
    if (!topic) {
        showError('Please enter a topic', 'warning');
        input.focus();
        return;
    }
    
    isGenerating = true;
    const btn = document.getElementById('generateBtn');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<div class="loading-spinner-small mx-auto"></div> Generating...';
    btn.classList.add('opacity-70');
    
    try {
        const { generateQA } = await import('../../services/ai.js');
        const { addToHistory } = await import('../../services/storage.js');
        
        await addToHistory(topic);
        const qaList = await generateQA(topic);
        
        const qaDisplay = document.getElementById('qaDisplay');
        
        if (qaList && qaList.length > 0) {
            qaDisplay.innerHTML = qaList.map((qa, index) => 
                QACard(qa.question, qa.answer, topic, index)
            ).join('');
            
            const { setupQACardEvents } = await import('./QACard.js');
            setupQACardEvents();
            
            // Scroll to first Q&A
            const firstQA = document.querySelector('.qa-card');
            if (firstQA) {
                firstQA.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            
            showError('Questions generated successfully!', 'success');
        } else {
            qaDisplay.innerHTML = `
                <div class="text-center py-12 bg-[#1F2937] rounded-xl border border-[#374151]">
                    <svg class="w-16 h-16 mx-auto text-[#4B5563] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                    </svg>
                    <p class="text-[#9CA3AF]">No questions generated. Try another topic.</p>
                </div>
            `;
        }
        
        await updateSections();
        
    } catch (error) {
        console.error('Generation error:', error);
        showError('Failed to generate questions. Please try again.', 'error');
        
        const qaDisplay = document.getElementById('qaDisplay');
        if (qaDisplay) {
            qaDisplay.innerHTML = `
                <div class="bg-red-500/10 border border-red-500/30 text-red-400 p-6 rounded-xl text-center">
                    <svg class="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Failed to generate questions. Please try again.
                </div>
            `;
        }
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
        btn.classList.remove('opacity-70');
        isGenerating = false;
    }
}

async function updateSections() {
    const storageSection = document.querySelector('.storage-section');
    if (storageSection) {
        const { StorageArea } = await import('./StorageArea.js');
        storageSection.innerHTML = await StorageArea();
        const { setupStorageEvents } = await import('./StorageArea.js');
        setupStorageEvents();
    }
    
    const historySection = document.querySelector('.history-section');
    if (historySection) {
        const { HistoryList } = await import('./HistoryList.js');
        historySection.innerHTML = await HistoryList();
        const { setupHistoryEvents } = await import('./HistoryList.js');
        setupHistoryEvents();
    }
}

// Add CSS animations
const dashboardStyles = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .animate-fadeIn {
        animation: fadeInUp 0.5s ease-out;
    }
`;

if (!document.querySelector('#dashboard-styles')) {
    const style = document.createElement('style');
    style.id = 'dashboard-styles';
    style.textContent = dashboardStyles;
    document.head.appendChild(style);
}