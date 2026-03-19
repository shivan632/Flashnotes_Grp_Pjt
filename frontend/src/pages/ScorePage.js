// frontend/src/pages/ScorePage.js
// Score Page - View quiz scores and progress

import { Sidebar } from '../components/layout/Sidebar.js';
import { AIChatSidebar } from '../components/layout/AIChatSidebar.js';
import { Header } from '../components/common/Header.js';
import { ScoreCard } from '../components/score/ScoreCard.js';
import { Leaderboard } from '../components/score/Leaderboard.js';
import { ProgressChart } from '../components/score/ProgressChart.js';
import { AchievementCard } from '../components/score/AchievementCard.js';
import { LoadingSpinner } from '../components/common/LoadingSpinner.js';
import { getUserScores, getLeaderboard, getUserAchievements } from '../services/scoreService.js';
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
        const [scoresData, leaderboardData, achievementsData] = await Promise.all([
            getUserScores(),
            getLeaderboard('all', 10),
            getUserAchievements()
        ]);
        
        const { stats, recentAttempts } = scoresData;
        
        // Prepare chart data
        const chartData = recentAttempts.slice(0, 7).map(attempt => ({
            label: attempt.quizzes?.title?.substring(0, 10) + '...' || 'Quiz',
            score: Math.round(attempt.percentage || 0)
        })).reverse();
        
        // If no attempts, show sample data
        if (chartData.length === 0) {
            chartData.push(
                { label: 'No data', score: 0 },
                { label: 'Take a', score: 0 },
                { label: 'quiz to', score: 0 },
                { label: 'see', score: 0 },
                { label: 'progress', score: 0 }
            );
        }
        
        return `
            <div class="min-h-screen bg-[#111827] relative">
                ${Sidebar()}
                ${AIChatSidebar()}
                <div id="mainContent" class="min-h-screen transition-all duration-300" 
                     style="margin-left: 256px; margin-right: 384px; width: calc(100% - 640px);">
                    ${Header({ title: 'My Scores' })}
                    <main class="container mx-auto px-4 py-8">
                        <div class="mb-8">
                            <h1 class="text-3xl font-bold text-[#E5E7EB]">Your Performance</h1>
                            <p class="text-[#9CA3AF] mt-2">Track your quiz scores and learning progress</p>
                        </div>
                        
                        <!-- Stats Cards -->
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            ${ScoreCard({ 
                                title: 'Average Score', 
                                value: `${stats.averageScore || 0}%`, 
                                icon: '📊',
                                color: 'blue'
                            })}
                            ${ScoreCard({ 
                                title: 'Quizzes Taken', 
                                value: stats.totalQuizzes || 0, 
                                icon: '📝',
                                color: 'green'
                            })}
                            ${ScoreCard({ 
                                title: 'Perfect Scores', 
                                value: stats.perfectScores || 0, 
                                icon: '⭐',
                                color: 'yellow'
                            })}
                            ${ScoreCard({ 
                                title: 'Current Streak', 
                                value: `${stats.currentStreak || 0} days`, 
                                icon: '🔥',
                                color: 'purple'
                            })}
                        </div>
                        
                        <!-- Progress Chart and Leaderboard -->
                        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                            <div class="lg:col-span-2">
                                ${ProgressChart({ data: chartData })}
                            </div>
                            <div class="lg:col-span-1">
                                ${Leaderboard({ 
                                    entries: leaderboardData,
                                    period: 'all'
                                })}
                            </div>
                        </div>
                        
                        <!-- Recent Attempts -->
                        <div class="bg-[#1F2937] rounded-xl shadow-lg p-6 mb-8">
                            <h3 class="text-xl font-bold text-[#E5E7EB] mb-6">Recent Quiz Attempts</h3>
                            ${recentAttempts.length > 0 ? `
                                <div class="space-y-4">
                                    ${recentAttempts.map(attempt => `
                                        <div class="flex items-center justify-between p-4 bg-[#111827] rounded-lg hover:bg-[#1F2937] transition-colors cursor-pointer" data-attempt-id="${attempt.id}">
                                            <div>
                                                <p class="font-medium text-[#E5E7EB]">${attempt.quizzes?.title || 'Quiz'}</p>
                                                <p class="text-xs text-[#9CA3AF] mt-1">${formatDate(attempt.completed_at)}</p>
                                            </div>
                                            <div class="text-right">
                                                <p class="text-lg font-bold text-[#3B82F6]">${Math.round(attempt.percentage || 0)}%</p>
                                                <p class="text-xs text-[#9CA3AF]">${attempt.correct_count}/${attempt.total_questions}</p>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            ` : `
                                <div class="text-center py-8">
                                    <p class="text-[#9CA3AF]">No quiz attempts yet</p>
                                    <p class="text-sm text-[#6B7280] mt-2">Take your first quiz to see results here!</p>
                                    <a href="#/quiz" class="inline-block mt-4 bg-[#3B82F6] text-white px-6 py-2 rounded-lg hover:bg-[#60A5FA]">
                                        Go to Quizzes
                                    </a>
                                </div>
                            `}
                        </div>
                        
                        <!-- Achievements -->
                        <div class="bg-[#1F2937] rounded-xl shadow-lg p-6">
                            <div class="flex justify-between items-center mb-6">
                                <h3 class="text-xl font-bold text-[#E5E7EB]">Achievements</h3>
                                <span class="text-sm text-[#60A5FA]">${achievementsData.totalEarned}/${achievementsData.totalAvailable} earned</span>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                ${achievementsData.achievements.map(achievement => 
                                    AchievementCard({ achievement })
                                ).join('')}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        `;
        
    } catch (error) {
        console.error('Error loading score page:', error);
        showError('Failed to load scores', 'error');
        
        // Return fallback UI
        return `
            <div class="min-h-screen bg-[#111827] relative">
                ${Sidebar()}
                ${AIChatSidebar()}
                <div id="mainContent" class="min-h-screen transition-all duration-300" 
                     style="margin-left: 256px; margin-right: 384px; width: calc(100% - 640px);">
                    ${Header({ title: 'My Scores' })}
                    <main class="container mx-auto px-4 py-8">
                        <div class="text-center py-12">
                            <p class="text-[#9CA3AF]">Failed to load scores. Please try again later.</p>
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
            
            // Update active state
            document.querySelectorAll('.period-btn').forEach(b => {
                b.classList.remove('bg-[#3B82F6]', 'text-white');
                b.classList.add('bg-[#374151]', 'text-[#9CA3AF]');
            });
            btn.classList.add('bg-[#3B82F6]', 'text-white');
            btn.classList.remove('bg-[#374151]', 'text-[#9CA3AF]');
            
            // Fetch and update leaderboard
            try {
                const leaderboardData = await getLeaderboard(period, 10);
                // In a real app, you'd update the leaderboard section here
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