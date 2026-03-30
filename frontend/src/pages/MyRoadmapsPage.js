// frontend/src/pages/MyRoadmapsPage.js

import { Sidebar } from '../components/layout/Sidebar.js';
import { AIChatSidebar } from '../components/layout/AIChatSidebar.js';
import { Header } from '../components/common/Header.js';
import { RoadmapCard, setupRoadmapCardEvents } from '../components/roadmap/RoadmapCard.js';
import { getUserRoadmaps, deleteRoadmap } from '../services/roadmapService.js';
import { showError, showSuccess } from '../components/common/ErrorMessage.js';

export async function MyRoadmapsPage() {
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
                ${Header({ title: 'My Roadmaps' })}
                <main class="container mx-auto px-4 py-8">
                    <div class="max-w-6xl mx-auto">
                        <!-- Header -->
                        <div class="mb-8">
                            <div class="flex items-center gap-3 mb-2">
                                <div class="w-12 h-12 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-2xl flex items-center justify-center shadow-lg">
                                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                                    </svg>
                                </div>
                                <h1 class="text-3xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">
                                    My Roadmaps
                                </h1>
                            </div>
                            <p class="text-[#9CA3AF] ml-16">All your generated learning paths in one place</p>
                            <div class="w-24 h-1 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full mt-4 ml-16"></div>
                        </div>
                        
                        <!-- Roadmaps Grid -->
                        <div id="roadmapsGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
                        
                        <!-- Back Link -->
                        <div class="mt-8 text-center">
                            <a href="#/roadmap" class="inline-flex items-center gap-2 text-[#9CA3AF] hover:text-[#3B82F6] transition-colors">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                </svg>
                                Generate New Roadmap
                            </a>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    `;
}

export async function setupMyRoadmapsPage() {
    // Get grid container - FIXED: Define inside function
    const gridContainer = document.getElementById('roadmapsGrid');
    
    if (!gridContainer) {
        console.error('Roadmaps grid container not found');
        return;
    }
    
    // Show loading
    gridContainer.innerHTML = `
        <div class="col-span-full text-center py-16">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#3B82F6] border-t-transparent mb-4"></div>
            <p class="text-[#9CA3AF]">Loading your roadmaps...</p>
        </div>
    `;
    
    try {
        const result = await getUserRoadmaps(50, 0);
        const roadmaps = result.roadmaps || [];
        
        if (roadmaps.length === 0) {
            gridContainer.innerHTML = `
                <div class="col-span-full text-center py-16 bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl border border-[#374151]">
                    <svg class="w-20 h-20 mx-auto mb-4 text-[#4B5563]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                    </svg>
                    <p class="text-[#9CA3AF] text-lg mb-2">No roadmaps yet</p>
                    <p class="text-sm text-[#6B7280]">Generate your first AI-powered learning roadmap!</p>
                    <a href="#/roadmap" class="inline-block mt-6 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] text-white px-6 py-2.5 rounded-xl hover:shadow-lg transition-all">
                        Create Roadmap
                    </a>
                </div>
            `;
            return;
        }
        
        // Render roadmaps
        gridContainer.innerHTML = roadmaps.map(roadmap => 
            RoadmapCard({ roadmap })
        ).join('');
        
        // Setup events
        setupRoadmapCardEvents(
            (id) => { 
                window.location.hash = `#/roadmap/${id}`; 
            },
            async (id) => {
                if (confirm('Are you sure you want to delete this roadmap? This action cannot be undone.')) {
                    try {
                        const result = await deleteRoadmap(id);
                        if (result.success) {
                            showSuccess('Roadmap deleted successfully!', 'success');
                            // Refresh the list
                            setupMyRoadmapsPage();
                        } else {
                            showError('Failed to delete roadmap', 'error');
                        }
                    } catch (error) {
                        console.error('Delete error:', error);
                        showError('Failed to delete roadmap', 'error');
                    }
                }
            }
        );
        
    } catch (error) {
        console.error('Error loading roadmaps:', error);
        gridContainer.innerHTML = `
            <div class="col-span-full text-center py-16 bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl border border-[#374151]">
                <p class="text-red-400 mb-2">Failed to load roadmaps</p>
                <button onclick="location.reload()" class="mt-4 px-4 py-2 bg-[#3B82F6] text-white rounded-lg">Retry</button>
            </div>
        `;
    }
}