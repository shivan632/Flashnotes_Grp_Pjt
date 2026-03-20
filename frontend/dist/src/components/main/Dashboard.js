// frontend/src/components/main/Dashboard.js - FIXED (No page refresh)
import { StorageArea } from './StorageArea.js';
import { HistoryList } from './HistoryList.js';
import { TopicInput } from './TopicInput.js';
import { QACard } from './QACard.js';
import { getSavedNotes, getSearchHistory } from '../../services/storage.js';
import { showError } from '../common/ErrorMessage.js';

export async function Dashboard() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userName = user.name || localStorage.getItem('userName') || 'Learner';
    
    // Get data with proper error handling
    let notes = [];
    let history = [];
    
    try {
        notes = await getSavedNotes() || [];
        history = await getSearchHistory() || [];
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
    
    // Ensure we have numbers, not undefined
    const notesCount = Array.isArray(notes) ? notes.length : 0;
    const historyCount = Array.isArray(history) ? history.length : 0;
    
    return `
        <div class="min-h-screen bg-[#111827]">
            <!-- Main Content -->
            <main class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl transition-all duration-300 main-content-adjust">
                <!-- Welcome Message -->
                <div class="mb-8 animate-fadeIn">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 class="text-2xl sm:text-3xl font-bold text-[#E5E7EB]">
                                Welcome back, <span class="text-[#3B82F6]">${userName}!</span>
                            </h1>
                            <p class="text-[#9CA3AF] mt-2">Ready to learn something new today?</p>
                        </div>
                        
                        <!-- Mobile AI Chat Button -->
                        <button id="mobileAIChatBtn" 
                                class="mt-4 sm:mt-0 bg-[#3B82F6] hover:bg-[#60A5FA] text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all md:hidden">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                            </svg>
                            <span>AI Assistant</span>
                        </button>
                    </div>
                </div>
                
                <!-- Quick Stats -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div class="bg-[#1F2937] p-4 rounded-lg hover:shadow-lg transition-shadow">
                        <div class="text-2xl font-bold text-[#3B82F6]">${notesCount}</div>
                        <div class="text-sm text-[#9CA3AF]">Saved Notes</div>
                    </div>
                    <div class="bg-[#1F2937] p-4 rounded-lg hover:shadow-lg transition-shadow">
                        <div class="text-2xl font-bold text-[#3B82F6]">${historyCount}</div>
                        <div class="text-sm text-[#9CA3AF]">Topics Searched</div>
                    </div>
                    <div class="bg-[#1F2937] p-4 rounded-lg hover:shadow-lg transition-shadow">
                        <div class="text-2xl font-bold text-[#3B82F6]">${Math.floor(Math.random() * 10) + 1}</div>
                        <div class="text-sm text-[#9CA3AF]">Study Streak</div>
                    </div>
                    <div class="bg-[#1F2937] p-4 rounded-lg hover:shadow-lg transition-shadow">
                        <div class="text-2xl font-bold text-[#3B82F6]">${new Date().toLocaleDateString()}</div>
                        <div class="text-sm text-[#9CA3AF]">Last Active</div>
                    </div>
                </div>
                
                <!-- Topic Input Section -->
                ${TopicInput()}
                
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
                        ${await StorageArea()}
                    </div>
                    <div class="history-section">
                        ${await HistoryList()}
                    </div>
                </div>
            </main>
        </div>
    `;
}

// Setup dashboard event listeners
export function setupDashboard() {
    // Remove any existing event listeners by cloning and replacing
    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn) {
        const newBtn = generateBtn.cloneNode(true);
        generateBtn.parentNode.replaceChild(newBtn, generateBtn);
        newBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleGenerate();
        });
    }
    
    // Enter key in input
    const topicInput = document.getElementById('topicInput');
    if (topicInput) {
        topicInput.removeEventListener('keypress', handleKeyPress);
        topicInput.addEventListener('keypress', handleKeyPress);
    }
    
    // Mobile AI Chat button
    const mobileAIChatBtn = document.getElementById('mobileAIChatBtn');
    if (mobileAIChatBtn) {
        mobileAIChatBtn.addEventListener('click', () => {
            toggleAIChat();
        });
    }
}

// Handle key press separately
function handleKeyPress(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        handleGenerate();
    }
}

// Toggle AI Chat function
function toggleAIChat() {
    const aiSidebar = document.getElementById('aiChatSidebar');
    if (aiSidebar) {
        aiSidebar.classList.toggle('translate-x-full');
        aiSidebar.classList.toggle('translate-x-0');
    }
}

// Handle generate function - NO PAGE REFRESH
let isGenerating = false;
async function handleGenerate() {
    if (isGenerating) return;
    
    const input = document.getElementById('topicInput');
    if (!input) return;
    
    const topic = input.value.trim();
    
    if (!topic) {
        alert('Please enter a topic');
        return;
    }
    
    isGenerating = true;
    const btn = document.getElementById('generateBtn');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span>Generating...</span> <div class="loading-spinner-small"></div>';
    
    try {
        const { generateQA } = await import('../../services/ai.js');
        const { addToHistory } = await import('../../services/storage.js');
        
        await addToHistory(topic);
        const qaList = await generateQA(topic);
        
        const qaDisplay = document.getElementById('qaDisplay');
        qaDisplay.innerHTML = qaList.map((qa, index) => 
            QACard(qa.question, qa.answer, topic, index)
        ).join('');
        
        const { setupQACardEvents } = await import('./QACard.js');
        setupQACardEvents();
        
        // Update stats without refresh - just update the sections
        await updateSections();
        
        showError('Questions generated successfully!', 'success');
        
    } catch (error) {
        console.error('Generation error:', error);
        alert('Failed to generate questions');
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
        isGenerating = false;
    }
}

// Update sections without page refresh
async function updateSections() {
    // Update storage section
    const storageSection = document.querySelector('.storage-section');
    if (storageSection) {
        const { StorageArea } = await import('./StorageArea.js');
        storageSection.innerHTML = await StorageArea();
        const { setupStorageEvents } = await import('./StorageArea.js');
        setupStorageEvents();
    }
    
    // Update history section
    const historySection = document.querySelector('.history-section');
    if (historySection) {
        const { HistoryList } = await import('./HistoryList.js');
        historySection.innerHTML = await HistoryList();
        const { setupHistoryEvents } = await import('./HistoryList.js');
        setupHistoryEvents();
    }
}