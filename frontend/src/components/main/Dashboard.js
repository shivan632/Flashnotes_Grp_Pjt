// frontend/src/components/main/Dashboard.js - Complete Redesign

import { StorageArea } from './StorageArea.js';
import { HistoryList } from './HistoryList.js';
import { TopicInput } from './TopicInput.js';
import { QACard } from './QACard.js';
import { UserFeedbackCard, setupUserFeedback } from '../feedback/UserFeedbackCard.js';
import { getSavedNotes, getSearchHistory } from '../../services/storage.js';
import { getUserStats, getUserScores, getLeaderboard } from '../../services/scoreService.js';
import { getUserRoadmaps } from '../../services/roadmapService.js';
import { showError, showSuccess } from '../common/ErrorMessage.js';

export async function Dashboard() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userName = user.name || localStorage.getItem('userName') || 'Learner';
    const userId = localStorage.getItem('userId') || user.id;
    
    let notes = [];
    let history = [];
    let stats = {};
    let recentAttempts = [];
    let recentRoadmaps = [];
    let leaderboardData = [];
    
    try {
        // Fetch all data in parallel
        notes = await getSavedNotes() || [];
        history = await getSearchHistory() || [];
        
        // Fetch user stats from backend
        const statsData = await getUserStats();
        stats = statsData || {};
        
        // Fetch recent quiz attempts
        const scoresData = await getUserScores();
        recentAttempts = scoresData?.recentAttempts || [];
        
        // Fetch user roadmaps
        const roadmapsData = await getUserRoadmaps(5, 0);
        recentRoadmaps = roadmapsData?.roadmaps || [];
        
        // Fetch leaderboard for motivation
        const leaderboard = await getLeaderboard('all', 5);
        leaderboardData = leaderboard || [];
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
    
    const notesCount = notes.length;
    const historyCount = history.length;
    const quizzesTaken = stats.totalQuizzes || 0;
    const averageScore = Math.round(stats.averageScore || 0);
    const perfectScores = stats.perfectScores || 0;
    const currentStreak = stats.currentStreak || 0;
    const roadmapsCount = recentRoadmaps.length;
    
    // Calculate progress percentages
    const quizProgress = quizzesTaken > 0 ? Math.min(averageScore, 100) : 0;
    const roadmapProgress = roadmapsCount > 0 ? Math.min((roadmapsCount / 10) * 100, 100) : 0;
    
    // Get recent activities (combine quizzes, roadmaps, notes)
    const recentActivities = [];
    
    // Add recent quiz attempts
    recentAttempts.slice(0, 3).forEach(attempt => {
        recentActivities.push({
            type: 'quiz',
            title: attempt.quizzes?.title || 'Quiz',
            score: Math.round(attempt.percentage || 0),
            date: attempt.completed_at,
            icon: '🧪',
            color: 'from-blue-500 to-cyan-500'
        });
    });
    
    // Add recent roadmaps
    recentRoadmaps.slice(0, 2).forEach(roadmap => {
        recentActivities.push({
            type: 'roadmap',
            title: roadmap.topic,
            date: roadmap.created_at,
            icon: '🗺️',
            color: 'from-purple-500 to-pink-500'
        });
    });
    
    // Add recent notes
    notes.slice(0, 2).forEach(note => {
        recentActivities.push({
            type: 'note',
            title: note.topic,
            date: note.savedAt,
            icon: '📝',
            color: 'from-green-500 to-emerald-500'
        });
    });
    
    // Sort by date (most recent first)
    recentActivities.sort((a, b) => new Date(b.date) - new Date(a.date));
    const topActivities = recentActivities.slice(0, 5);
    
    // Get top learners for motivation
    const topLearners = leaderboardData.slice(0, 3);
    
    return `
        <div class="min-h-screen">
            <main class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
                
                <!-- ========== WELCOME SECTION ========== -->
                <div class="mb-8 animate-fadeIn">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 class="text-3xl sm:text-4xl font-bold">
                                <span class="text-white">Welcome back, </span>
                                <span class="bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">${userName}</span>
                                <span class="text-white">! 👋</span>
                            </h1>
                            <p class="text-[#9CA3AF] mt-2 flex items-center gap-2">
                                <span class="w-1.5 h-1.5 bg-[#3B82F6] rounded-full animate-pulse"></span>
                                Ready to continue your learning journey today?
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
                
                <!-- ========== STATS CARDS ========== -->
                <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    <!-- Notes Card -->
                    <div class="group bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-4 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1 border border-[#374151] hover:border-blue-500/50">
                        <div class="flex items-center justify-between mb-2">
                            <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                                </svg>
                            </div>
                            <div class="text-2xl font-bold text-blue-400 group-hover:scale-110 transition-transform">${notesCount}</div>
                        </div>
                        <div class="text-sm text-[#9CA3AF]">Saved Notes</div>
                        <div class="text-xs text-[#6B7280] mt-1">📚 Your collection</div>
                    </div>
                    
                    <!-- Quizzes Card -->
                    <div class="group bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-4 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1 border border-[#374151] hover:border-purple-500/50">
                        <div class="flex items-center justify-between mb-2">
                            <div class="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <div class="text-2xl font-bold text-purple-400 group-hover:scale-110 transition-transform">${quizzesTaken}</div>
                        </div>
                        <div class="text-sm text-[#9CA3AF]">Quizzes Taken</div>
                        <div class="text-xs text-[#6B7280] mt-1">🎯 ${perfectScores} perfect scores</div>
                    </div>
                    
                    <!-- Roadmaps Card -->
                    <div class="group bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-4 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 hover:-translate-y-1 border border-[#374151] hover:border-emerald-500/50">
                        <div class="flex items-center justify-between mb-2">
                            <div class="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                                </svg>
                            </div>
                            <div class="text-2xl font-bold text-emerald-400 group-hover:scale-110 transition-transform">${roadmapsCount}</div>
                        </div>
                        <div class="text-sm text-[#9CA3AF]">Roadmaps</div>
                        <div class="text-xs text-[#6B7280] mt-1">🗺️ Learning paths</div>
                    </div>
                    
                    <!-- Avg Score Card -->
                    <div class="group bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-4 hover:shadow-2xl hover:shadow-yellow-500/10 transition-all duration-300 hover:-translate-y-1 border border-[#374151] hover:border-yellow-500/50">
                        <div class="flex items-center justify-between mb-2">
                            <div class="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                                </svg>
                            </div>
                            <div class="text-2xl font-bold text-yellow-400 group-hover:scale-110 transition-transform">${averageScore}%</div>
                        </div>
                        <div class="text-sm text-[#9CA3AF]">Avg Score</div>
                        <div class="text-xs text-[#6B7280] mt-1">⭐ Overall performance</div>
                    </div>
                    
                    <!-- Streak Card -->
                    <div class="group bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-4 hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-300 hover:-translate-y-1 border border-[#374151] hover:border-red-500/50">
                        <div class="flex items-center justify-between mb-2">
                            <div class="w-10 h-10 bg-gradient-to-r from-red-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg">
                                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path>
                                </svg>
                            </div>
                            <div class="text-2xl font-bold text-red-400 group-hover:scale-110 transition-transform">${currentStreak}</div>
                        </div>
                        <div class="text-sm text-[#9CA3AF]">Day Streak</div>
                        <div class="text-xs text-[#6B7280] mt-1">🔥 Keep it up!</div>
                    </div>
                </div>
                
                <!-- ========== QUICK ACTIONS ========== -->
                <div class="mb-8">
                    <h2 class="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                        <span class="w-1 h-5 bg-gradient-to-b from-[#3B82F6] to-[#A78BFA] rounded-full"></span>
                        🚀 Quick Actions
                    </h2>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <a href="#/dashboard" class="group flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-blue-600/20 to-blue-600/5 border border-blue-500/30 rounded-xl hover:bg-blue-600/30 transition-all duration-300 hover:scale-105">
                            <span class="text-xl">✨</span>
                            <span class="text-sm text-blue-300">Generate Notes</span>
                        </a>
                        <a href="#/quiz" class="group flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-purple-600/20 to-purple-600/5 border border-purple-500/30 rounded-xl hover:bg-purple-600/30 transition-all duration-300 hover:scale-105">
                            <span class="text-xl">🎯</span>
                            <span class="text-sm text-purple-300">Start Quiz</span>
                        </a>
                        <a href="#/roadmap" class="group flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-emerald-600/20 to-emerald-600/5 border border-emerald-500/30 rounded-xl hover:bg-emerald-600/30 transition-all duration-300 hover:scale-105">
                            <span class="text-xl">🗺️</span>
                            <span class="text-sm text-emerald-300">Create Roadmap</span>
                        </a>
                        <a href="#/pdf-reader" class="group flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-amber-600/20 to-amber-600/5 border border-amber-500/30 rounded-xl hover:bg-amber-600/30 transition-all duration-300 hover:scale-105">
                            <span class="text-xl">📄</span>
                            <span class="text-sm text-amber-300">Upload PDF</span>
                        </a>
                    </div>
                </div>
                
                <!-- ========== PROGRESS SECTION ========== -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-5 border border-[#374151]">
                        <h3 class="text-md font-semibold text-white mb-3 flex items-center gap-2">
                            <span>📊</span> Quiz Performance
                        </h3>
                        <div class="mb-3">
                            <div class="flex justify-between text-sm text-[#9CA3AF] mb-1">
                                <span>Average Score</span>
                                <span class="text-blue-400 font-semibold">${quizProgress}%</span>
                            </div>
                            <div class="w-full bg-[#374151] rounded-full h-2">
                                <div class="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500" style="width: ${quizProgress}%"></div>
                            </div>
                        </div>
                        <div class="flex justify-between text-xs text-[#6B7280]">
                            <span>📝 ${quizzesTaken} quizzes taken</span>
                            <span>⭐ ${perfectScores} perfect scores</span>
                        </div>
                    </div>
                    
                    <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-5 border border-[#374151]">
                        <h3 class="text-md font-semibold text-white mb-3 flex items-center gap-2">
                            <span>🗺️</span> Roadmap Progress
                        </h3>
                        <div class="mb-3">
                            <div class="flex justify-between text-sm text-[#9CA3AF] mb-1">
                                <span>Roadmaps Created</span>
                                <span class="text-emerald-400 font-semibold">${roadmapsCount} / 10</span>
                            </div>
                            <div class="w-full bg-[#374151] rounded-full h-2">
                                <div class="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-500" style="width: ${roadmapProgress}%"></div>
                            </div>
                        </div>
                        <div class="flex justify-between text-xs text-[#6B7280]">
                            <span>🎯 Keep creating!</span>
                            <span>🏆 ${10 - roadmapsCount} more to goal</span>
                        </div>
                    </div>
                </div>
                
                <!-- ========== RECENT ACTIVITY ========== -->
                <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-5 mb-8 border border-[#374151]">
                    <h3 class="text-md font-semibold text-white mb-3 flex items-center gap-2">
                        <span>📋</span> Recent Activity
                    </h3>
                    ${topActivities.length > 0 ? `
                        <div class="space-y-3">
                            ${topActivities.map(activity => `
                                <div class="flex items-center gap-3 p-3 bg-[#111827] rounded-xl hover:bg-[#1F2937] transition-all duration-300">
                                    <div class="w-8 h-8 bg-gradient-to-r ${activity.color} rounded-lg flex items-center justify-center">
                                        <span class="text-sm">${activity.icon}</span>
                                    </div>
                                    <div class="flex-1">
                                        <p class="text-sm text-white">${activity.type === 'quiz' ? `Took quiz: ${activity.title}` : activity.type === 'roadmap' ? `Created roadmap: ${activity.title}` : `Saved note: ${activity.title}`}</p>
                                        <p class="text-xs text-[#6B7280]">${formatDate(activity.date)}</p>
                                    </div>
                                    ${activity.score ? `<div class="text-sm font-bold text-blue-400">${activity.score}%</div>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    ` : `
                        <div class="text-center py-8 text-[#6B7280]">
                            <p>No recent activity yet</p>
                            <p class="text-xs mt-1">Start learning to see your progress!</p>
                        </div>
                    `}
                </div>
                
                <!-- ========== TOP LEARNERS (Motivation) ========== -->
                ${topLearners.length > 0 ? `
                <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-5 mb-8 border border-[#374151]">
                    <h3 class="text-md font-semibold text-white mb-3 flex items-center gap-2">
                        <span>🏆</span> Top Learners This Week
                    </h3>
                    <div class="space-y-2">
                        ${topLearners.map((learner, idx) => `
                            <div class="flex items-center gap-3 p-2">
                                <div class="w-8 text-center">
                                    ${idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                                </div>
                                <div class="flex-1">
                                    <p class="text-sm text-white">${learner.name || 'Anonymous'}</p>
                                </div>
                                <div class="text-sm font-bold text-yellow-400">${learner.total_points || 0} pts</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
                
                <!-- ========== TOPIC INPUT & Q&A (EXISTING) ========== -->
                <div class="mb-8">
                    ${TopicInput()}
                </div>
                
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
                
                <!-- ========== STORAGE & HISTORY (EXISTING) ========== -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div class="storage-section transform transition-all duration-300 hover:-translate-y-1">
                        ${await StorageArea()}
                    </div>
                    <div class="history-section transform transition-all duration-300 hover:-translate-y-1">
                        ${await HistoryList()}
                    </div>
                </div>
                
                <!-- ========== USER FEEDBACK (EXISTING) ========== */
                <div class="mt-8">
                    ${UserFeedbackCard()}
                </div>
            </main>
        </div>
    `;
}

// Helper function to format date
function formatDate(dateString) {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
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