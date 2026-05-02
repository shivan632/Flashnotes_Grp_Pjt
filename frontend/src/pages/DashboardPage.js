// frontend/src/pages/DashboardPage.js
import { Sidebar } from '../components/layout/Sidebar.js';
import { AIChatSidebar } from '../components/layout/AIChatSidebar.js';
import { Dashboard, setupDashboard } from '../components/main/Dashboard.js';
import { getUserAchievements } from '../services/scoreService.js';
import { AchievementCard } from '../components/score/AchievementCard.js';

export async function DashboardPage() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    if (!isAuthenticated) {
        window.location.hash = '#/login';
        return '';
    }
    
    // Fetch recent achievements
    let recentAchievements = [];
    let achievementsStats = { earned: 0, total: 0, totalPoints: 0 };
    
    try {
        const achievementsData = await getUserAchievements();
        if (achievementsData.success && achievementsData.achievements) {
            // Get only earned achievements, sorted by most recent
            recentAchievements = achievementsData.achievements
                .filter(a => a.earned)
                .sort((a, b) => new Date(b.earnedAt) - new Date(a.earnedAt))
                .slice(0, 3);
            
            achievementsStats = {
                earned: achievementsData.achievements.filter(a => a.earned).length,
                total: achievementsData.achievements.length,
                totalPoints: achievementsData.achievements
                    .filter(a => a.earned)
                    .reduce((sum, a) => sum + (a.points || 0), 0)
            };
        }
    } catch (error) {
        console.error('Error fetching achievements:', error);
    }
    
    return `
        <div class="min-h-screen bg-gradient-to-b from-[#111827] to-[#0F172A] relative">
            ${Sidebar()}
            ${AIChatSidebar()}
            <div id="mainContent" class="min-h-screen transition-all duration-300" 
                 style="margin-left: 256px; margin-right: 384px; width: calc(100% - 640px);">
                <main class="container mx-auto px-4 py-8">
                    ${await Dashboard()}
                    
                    <!-- Recent Achievements Section -->
                    <div class="mt-8 mb-6 animate-fadeInUp">
                        <div class="flex items-center justify-between mb-4">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
                                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h2 class="text-xl font-bold bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">Recent Achievements</h2>
                                    <p class="text-xs text-[#9CA3AF]">🏆 ${achievementsStats.earned}/${achievementsStats.total} earned • ${achievementsStats.totalPoints} total points</p>
                                </div>
                            </div>
                            <a href="#/score" class="text-sm text-[#60A5FA] hover:text-[#3B82F6] transition-colors flex items-center gap-1">
                                View all
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                                </svg>
                            </a>
                        </div>
                        
                        ${recentAchievements.length > 0 ? `
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                ${recentAchievements.map(achievement => `
                                    <div class="animate-slideInUp" style="animation-delay: ${recentAchievements.indexOf(achievement) * 0.1}s">
                                        ${AchievementCard({ achievement })}
                                    </div>
                                `).join('')}
                            </div>
                        ` : `
                            <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-8 text-center border border-[#374151]">
                                <div class="relative">
                                    <div class="absolute inset-0 flex items-center justify-center">
                                        <div class="w-20 h-20 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full opacity-10 blur-xl"></div>
                                    </div>
                                    <svg class="w-16 h-16 mx-auto mb-4 text-[#4B5563] relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                                    </svg>
                                    <p class="text-[#9CA3AF] text-lg mb-2">No achievements yet</p>
                                    <p class="text-sm text-[#6B7280] max-w-xs mx-auto">Complete quizzes, save notes, and use voice features to earn achievements!</p>
                                    <div class="mt-4 flex justify-center gap-2">
                                        <div class="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
                                        <div class="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse delay-100"></div>
                                        <div class="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse delay-200"></div>
                                    </div>
                                    <a href="#/quiz" class="inline-block mt-6 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] text-white px-6 py-2.5 rounded-xl hover:from-[#60A5FA] hover:to-[#8B5CF6] transition-all duration-300 transform hover:scale-105 shadow-lg">
                                        🎯 Start Your First Quiz
                                    </a>
                                </div>
                            </div>
                        `}
                    </div>
                </main>
            </div>
        </div>
        
        <style>
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
            
            @keyframes slideInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .animate-fadeInUp {
                animation: fadeInUp 0.5s ease-out forwards;
            }
            
            .animate-slideInUp {
                animation: slideInUp 0.4s ease-out forwards;
            }
        </style>
    `;
}

export function setupDashboardPage() {
    setupDashboard();
}