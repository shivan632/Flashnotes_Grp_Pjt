// frontend/src/pages/ScorePage.js
// Score Page - View quiz scores and progress

import { Sidebar } from '../components/layout/Sidebar.js';
import { AIChatSidebar } from '../components/layout/AIChatSidebar.js';
import { Header } from '../components/common/Header.js';

export function ScorePage() {
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
                ${Header({ title: 'My Scores' })}
                <main class="container mx-auto px-4 py-8">
                    <div class="mb-8">
                        <h1 class="text-3xl font-bold text-[#E5E7EB]">Your Performance</h1>
                        <p class="text-[#9CA3AF] mt-2">Track your quiz scores and learning progress</p>
                    </div>
                    
                    <!-- Stats Cards -->
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div class="bg-[#1F2937] rounded-xl shadow-lg p-6">
                            <div class="text-3xl font-bold text-[#3B82F6]">85%</div>
                            <div class="text-sm text-[#9CA3AF] mt-1">Average Score</div>
                            <div class="mt-2 text-xs text-green-500">↑ 5% from last week</div>
                        </div>
                        <div class="bg-[#1F2937] rounded-xl shadow-lg p-6">
                            <div class="text-3xl font-bold text-[#3B82F6]">24</div>
                            <div class="text-sm text-[#9CA3AF] mt-1">Quizzes Taken</div>
                            <div class="mt-2 text-xs text-green-500">+3 this week</div>
                        </div>
                        <div class="bg-[#1F2937] rounded-xl shadow-lg p-6">
                            <div class="text-3xl font-bold text-[#3B82F6]">18</div>
                            <div class="text-sm text-[#9CA3AF] mt-1">Perfect Scores</div>
                            <div class="mt-2 text-xs text-[#60A5FA]">75% success rate</div>
                        </div>
                        <div class="bg-[#1F2937] rounded-xl shadow-lg p-6">
                            <div class="text-3xl font-bold text-[#3B82F6]">7</div>
                            <div class="text-sm text-[#9CA3AF] mt-1">Day Streak</div>
                            <div class="mt-2 text-xs text-yellow-500">Keep it up!</div>
                        </div>
                    </div>
                    
                    <!-- Score Chart -->
                    <div class="bg-[#1F2937] rounded-xl shadow-lg p-6 mb-8">
                        <h2 class="text-xl font-bold text-[#E5E7EB] mb-4">Score History</h2>
                        <div class="h-64 flex items-end justify-between space-x-2">
                            <div class="w-12 bg-gradient-to-t from-[#3B82F6] to-[#60A5FA] rounded-t-lg" style="height: 85%"></div>
                            <div class="w-12 bg-gradient-to-t from-[#3B82F6] to-[#60A5FA] rounded-t-lg" style="height: 92%"></div>
                            <div class="w-12 bg-gradient-to-t from-[#3B82F6] to-[#60A5FA] rounded-t-lg" style="height: 78%"></div>
                            <div class="w-12 bg-gradient-to-t from-[#3B82F6] to-[#60A5FA] rounded-t-lg" style="height: 88%"></div>
                            <div class="w-12 bg-gradient-to-t from-[#3B82F6] to-[#60A5FA] rounded-t-lg" style="height: 95%"></div>
                            <div class="w-12 bg-gradient-to-t from-[#3B82F6] to-[#60A5FA] rounded-t-lg" style="height: 82%"></div>
                        </div>
                        <div class="flex justify-between mt-2 text-xs text-[#9CA3AF]">
                            <span>OS</span>
                            <span>DB</span>
                            <span>Py</span>
                            <span>JS</span>
                            <span>ML</span>
                            <span>Net</span>
                        </div>
                    </div>
                    
                    <!-- Recent Scores Table -->
                    <div class="bg-[#1F2937] rounded-xl shadow-lg p-6">
                        <h2 class="text-xl font-bold text-[#E5E7EB] mb-4">Recent Scores</h2>
                        <table class="w-full">
                            <thead>
                                <tr class="border-b border-[#374151]">
                                    <th class="text-left py-3 text-[#9CA3AF]">Quiz</th>
                                    <th class="text-left py-3 text-[#9CA3AF]">Score</th>
                                    <th class="text-left py-3 text-[#9CA3AF]">Date</th>
                                    <th class="text-left py-3 text-[#9CA3AF]">Rank</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="border-b border-[#374151]">
                                    <td class="py-3">Operating System</td>
                                    <td class="py-3"><span class="text-[#3B82F6]">85%</span> (8.5/10)</td>
                                    <td class="py-3 text-[#9CA3AF]">Mar 18, 2026</td>
                                    <td class="py-3">🥉 3rd</td>
                                </tr>
                                <tr class="border-b border-[#374151]">
                                    <td class="py-3">Database</td>
                                    <td class="py-3"><span class="text-[#3B82F6]">92%</span> (11/12)</td>
                                    <td class="py-3 text-[#9CA3AF]">Mar 17, 2026</td>
                                    <td class="py-3">🥈 2nd</td>
                                </tr>
                                <tr>
                                    <td class="py-3">Python</td>
                                    <td class="py-3"><span class="text-[#3B82F6]">78%</span> (7.8/10)</td>
                                    <td class="py-3 text-[#9CA3AF]">Mar 15, 2026</td>
                                    <td class="py-3">4th</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>
    `;
}