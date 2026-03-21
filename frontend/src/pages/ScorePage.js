// frontend/src/pages/ScorePage.js
// Score Page - View quiz scores and progress with enhanced UI

import { Sidebar } from '../components/layout/Sidebar.js';
import { AIChatSidebar } from '../components/layout/AIChatSidebar.js';
import { Header } from '../components/common/Header.js';
import { ScoreCard, CircularProgressCard, MiniScoreCard } from '../components/score/ScoreCard.js';
import { Leaderboard, MiniLeaderboard } from '../components/score/Leaderboard.js';
import { ProgressChart, LineProgressChart } from '../components/score/ProgressChart.js';
import { AchievementCard, AchievementGrid } from '../components/score/AchievementCard.js';
import { LoadingSpinner } from '../components/common/LoadingSpinner.js';
import { getUserScores, getLeaderboard, getUserAchievements, getUserStats } from '../services/scoreService.js';
import { formatDate } from '../utils/helpers.js';
import { showError } from '../components/common/ErrorMessage.js';

export async function ScorePage() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    if (!isAuthenticated) {
        window.location.hash = '#/login';
        return '';
    }
    
    try {
        // Fetch all data in parallel
        const [scoresData, leaderboardData, achievementsData, userStats] = await Promise.all([
            getUserScores(),
            getLeaderboard('all', 10),
            getUserAchievements(),
            getUserStats()
        ]);
        
        const { stats, recentAttempts } = scoresData || { stats: {}, recentAttempts: [] };
        
        // Prepare chart data
        let chartData = (recentAttempts || []).slice(0, 7).map(attempt => ({
            label: attempt.quizzes?.title?.substring(0, 12) || 'Quiz',
            score: Math.round(attempt.percentage || 0)
        })).reverse();
        
        // If no attempts, show placeholder
        if (chartData.length === 0) {
            chartData = [
                { label: 'Week 1', score: 0 },
                { label: 'Week 2', score: 0 },
                { label: 'Week 3', score: 0 },
                { label: 'Week 4', score: 0 }
            ];
        }
        
        const accuracy = (stats?.totalQuestionsAnswered || 0) > 0 
            ? Math.round(((stats?.correctAnswers || 0) / (stats?.totalQuestionsAnswered || 1)) * 100) 
            : 0;
        
        return `
            <div class="min-h-screen bg-gradient-to-b from-[#111827] to-[#0F172A] relative">
                ${Sidebar()}
                ${AIChatSidebar()}
                <div id="mainContent" class="min-h-screen transition-all duration-300" 
                     style="margin-left: 256px; margin-right: 384px; width: calc(100% - 640px);">
                    ${Header({ title: 'My Scores' })}
                    <main class="container mx-auto px-4 py-8">
                        <!-- Header with Stats Overview -->
                        <div class="mb-8 animate-fadeInUp">
                            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <div class="flex items-center gap-2 mb-2">
                                        <div class="w-10 h-10 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-xl flex items-center justify-center">
                                            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                                            </svg>
                                        </div>
                                        <h1 class="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">
                                            Your Performance
                                        </h1>
                                    </div>
                                    <p class="text-[#9CA3AF] mt-2">Track your quiz scores and learning progress</p>
                                </div>
                                
                                <!-- Overall Rating -->
                                <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl px-6 py-3 border border-[#374151]">
                                    <div class="flex items-center gap-2">
                                        <div class="text-2xl font-bold text-[#3B82F6]">${Math.round(userStats?.averageScore || stats?.averageScore || 0)}%</div>
                                        <div class="text-xs text-[#9CA3AF]">Overall Score</div>
                                    </div>
                                </div>
                            </div>
                            <div class="w-24 h-1 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full mt-4"></div>
                        </div>
                        
                        <!-- Stats Cards -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                            ${ScoreCard({ 
                                title: 'Average Score', 
                                value: `${Math.round(stats?.averageScore || userStats?.averageScore || 0)}%`, 
                                icon: '📊',
                                color: 'blue',
                                subtitle: 'Overall performance',
                                change: (stats?.averageScore || 0) > 70 ? 5 : -2
                            })}
                            ${ScoreCard({ 
                                title: 'Quizzes Taken', 
                                value: stats?.totalQuizzes || userStats?.quizzesTaken || 0, 
                                icon: '📝',
                                color: 'green',
                                subtitle: 'Completed quizzes',
                                change: (stats?.totalQuizzes || 0) > 0 ? 12 : 0
                            })}
                            ${ScoreCard({ 
                                title: 'Perfect Scores', 
                                value: stats?.perfectScores || 0, 
                                icon: '⭐',
                                color: 'yellow',
                                subtitle: '100% achievements'
                            })}
                            ${ScoreCard({ 
                                title: 'Current Streak', 
                                value: `${stats?.currentStreak || 0} days`, 
                                icon: '🔥',
                                color: 'purple',
                                subtitle: 'Learning consistency'
                            })}
                        </div>
                        
                        <!-- Additional Stats Row -->
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fadeInUp" style="animation-delay: 0.1s">
                            <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-xl p-4 text-center border border-[#374151]">
                                <div class="text-sm text-[#9CA3AF]">Questions Answered</div>
                                <div class="text-2xl font-bold text-[#3B82F6]">${stats?.totalQuestionsAnswered || 0}</div>
                            </div>
                            <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-xl p-4 text-center border border-[#374151]">
                                <div class="text-sm text-[#9CA3AF]">Correct Answers</div>
                                <div class="text-2xl font-bold text-[#3B82F6]">${stats?.correctAnswers || 0}</div>
                            </div>
                            <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-xl p-4 text-center border border-[#374151]">
                                <div class="text-sm text-[#9CA3AF]">Accuracy</div>
                                <div class="text-2xl font-bold text-[#3B82F6]">${accuracy}%</div>
                            </div>
                            <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-xl p-4 text-center border border-[#374151]">
                                <div class="text-sm text-[#9CA3AF]">Total Points</div>
                                <div class="text-2xl font-bold text-[#3B82F6]">${stats?.totalPoints || 0}</div>
                            </div>
                        </div>
                        
                        <!-- Progress Chart and Leaderboard -->
                        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 animate-fadeInUp" style="animation-delay: 0.2s">
                            <div class="lg:col-span-2">
                                ${ProgressChart({ data: chartData, title: 'Score Progression' })}
                            </div>
                            <div class="lg:col-span-1">
                                ${Leaderboard({ 
                                    entries: leaderboardData || [],
                                    period: 'all',
                                    currentUserId: localStorage.getItem('userId')
                                })}
                            </div>
                        </div>
                        
                        <!-- Recent Attempts Section -->
                        <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl shadow-xl p-6 mb-8 border border-[#374151] animate-fadeInUp" style="animation-delay: 0.3s">
                            <div class="flex items-center justify-between mb-6">
                                <div class="flex items-center gap-3">
                                    <div class="w-10 h-10 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-xl flex items-center justify-center">
                                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                    </div>
                                    <h3 class="text-xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">Recent Quiz Attempts</h3>
                                </div>
                                ${(recentAttempts?.length || 0) > 0 ? `
                                    <span class="text-xs text-[#9CA3AF]">Last ${Math.min(recentAttempts.length, 10)} attempts</span>
                                ` : ''}
                            </div>
                            
                            ${(recentAttempts?.length || 0) > 0 ? `
                                <div class="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                                    ${recentAttempts.map((attempt, index) => `
                                        <div class="group flex items-center justify-between p-4 bg-[#111827] rounded-xl hover:bg-[#1F2937] transition-all duration-300 cursor-pointer hover:translate-x-1 border border-[#374151] hover:border-[#3B82F6]" 
                                             data-attempt-id="${attempt.id}"
                                             style="animation: slideInRight 0.3s ease-out ${index * 0.05}s forwards">
                                            <div class="flex items-center gap-3">
                                                <div class="w-10 h-10 bg-gradient-to-r ${attempt.percentage >= 70 ? 'from-green-500 to-green-400' : 'from-yellow-500 to-yellow-400'} rounded-xl flex items-center justify-center">
                                                    <span class="text-white text-sm font-bold">${Math.round(attempt.percentage)}%</span>
                                                </div>
                                                <div>
                                                    <p class="font-medium text-[#E5E7EB] group-hover:text-[#3B82F6] transition-colors">${attempt.quizzes?.title || 'Quiz'}</p>
                                                    <p class="text-xs text-[#9CA3AF] mt-1 flex items-center gap-1">
                                                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                        </svg>
                                                        ${formatDate(attempt.completed_at)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div class="text-right">
                                                <p class="text-lg font-bold text-[#3B82F6]">${attempt.correct_count}/${attempt.total_questions}</p>
                                                <p class="text-xs text-[#9CA3AF]">correct</p>
                                            </div>
                                            <div class="opacity-0 group-hover:opacity-100 transition-opacity ml-3">
                                                <svg class="w-4 h-4 text-[#60A5FA] group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                                                </svg>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                                <div class="mt-4 pt-3 border-t border-[#374151] text-center">
                                    <a href="#/quiz" class="text-sm text-[#60A5FA] hover:text-[#3B82F6] transition-colors inline-flex items-center gap-1">
                                        Take more quizzes
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                                        </svg>
                                    </a>
                                </div>
                            ` : `
                                <div class="text-center py-12">
                                    <div class="relative">
                                        <div class="absolute inset-0 flex items-center justify-center">
                                            <div class="w-20 h-20 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full opacity-10 blur-xl"></div>
                                        </div>
                                        <svg class="w-16 h-16 mx-auto mb-3 text-[#4B5563] relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                        <p class="text-[#9CA3AF]">No quiz attempts yet</p>
                                        <p class="text-sm text-[#6B7280] mt-2">Take your first quiz to see results here!</p>
                                        <a href="#/quiz" class="inline-block mt-4 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] hover:from-[#60A5FA] hover:to-[#8B5CF6] text-white px-6 py-2.5 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
                                            Start a Quiz
                                        </a>
                                    </div>
                                </div>
                            `}
                        </div>
                        
                        <!-- Achievements Section -->
                        <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl shadow-xl p-6 border border-[#374151] animate-fadeInUp" style="animation-delay: 0.4s">
                            <div class="flex items-center justify-between mb-6">
                                <div class="flex items-center gap-3">
                                    <div class="w-10 h-10 bg-gradient-to-r from-[#F59E0B] to-[#EF4444] rounded-xl flex items-center justify-center">
                                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                                        </svg>
                                    </div>
                                    <h3 class="text-xl font-bold bg-gradient-to-r from-[#F59E0B] to-[#EF4444] bg-clip-text text-transparent">Achievements</h3>
                                </div>
                                <div class="bg-[#111827] px-3 py-1.5 rounded-full">
                                    <span class="text-sm text-[#60A5FA] font-medium">${achievementsData?.totalEarned || 0}/${achievementsData?.totalAvailable || 0} earned</span>
                                </div>
                            </div>
                            
                            ${AchievementGrid({ achievements: achievementsData?.achievements || [] })}
                        </div>
                    </main>
                </div>
            </div>
        `;
        
    } catch (error) {
        console.error('Error loading score page:', error);
        showError('Failed to load scores', 'error');
        
        return `
            <div class="min-h-screen bg-gradient-to-b from-[#111827] to-[#0F172A] relative">
                ${Sidebar()}
                ${AIChatSidebar()}
                <div id="mainContent" class="min-h-screen transition-all duration-300" 
                     style="margin-left: 256px; margin-right: 384px; width: calc(100% - 640px);">
                    ${Header({ title: 'My Scores' })}
                    <main class="container mx-auto px-4 py-8">
                        <div class="text-center py-16 bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl border border-[#374151]">
                            <div class="relative">
                                <div class="absolute inset-0 flex items-center justify-center">
                                    <div class="w-24 h-24 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full opacity-10 blur-xl"></div>
                                </div>
                                <svg class="w-20 h-20 mx-auto mb-4 text-[#4B5563] relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                                </svg>
                                <p class="text-[#9CA3AF] text-lg mb-2">Failed to load scores</p>
                                <p class="text-sm text-[#6B7280]">Please try again later</p>
                                <a href="#/dashboard" class="inline-block mt-4 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] text-white px-6 py-2 rounded-xl hover:from-[#60A5FA] hover:to-[#8B5CF6] transition-all duration-300 transform hover:scale-105">
                                    Back to Dashboard
                                </a>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        `;
    }
}

// Setup score page events
export function setupScorePage() {
    // Period buttons for leaderboard
    document.querySelectorAll('.period-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            const period = btn.dataset.period;
            
            document.querySelectorAll('.period-btn').forEach(b => {
                b.classList.remove('bg-gradient-to-r', 'from-[#3B82F6]', 'to-[#A78BFA]', 'text-white', 'shadow-lg');
                b.classList.add('bg-[#374151]', 'text-[#9CA3AF]');
            });
            btn.classList.add('bg-gradient-to-r', 'from-[#3B82F6]', 'to-[#A78BFA]', 'text-white', 'shadow-lg');
            btn.classList.remove('bg-[#374151]', 'text-[#9CA3AF]');
            
            try {
                const leaderboardData = await getLeaderboard(period, 10);
                console.log('Leaderboard updated:', leaderboardData);
            } catch (error) {
                showError('Failed to update leaderboard', 'error');
            }
        });
    });
    
    // Click on recent attempts
    document.querySelectorAll('[data-attempt-id]').forEach(item => {
        item.addEventListener('click', () => {
            const attemptId = item.dataset.attemptId;
            if (attemptId) {
                window.location.hash = `#/quiz/attempt/${attemptId}`;
            }
        });
    });
}

// Add CSS animations
const scorePageStyles = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-track {
        background: #1F2937;
        border-radius: 10px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #3B82F6;
        border-radius: 10px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #60A5FA;
    }
`;

if (!document.querySelector('#score-page-styles')) {
    const style = document.createElement('style');
    style.id = 'score-page-styles';
    style.textContent = scorePageStyles;
    document.head.appendChild(style);
}