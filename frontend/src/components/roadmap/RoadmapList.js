// frontend/src/components/roadmap/RoadmapList.js
// Grid/List view of roadmaps - Enhanced UI

import { RoadmapCard, setupRoadmapCardEvents } from './RoadmapCard.js';

export function RoadmapList({ roadmaps, isLoading = false, onViewRoadmap }) {
    if (isLoading) {
        return `
            <div class="text-center py-20">
                <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#3B82F6] border-t-transparent mb-4"></div>
                <p class="text-[#9CA3AF]">Loading your roadmaps...</p>
                <div class="mt-2 flex justify-center gap-2">
                    <div class="w-1.5 h-1.5 bg-[#3B82F6] rounded-full animate-pulse"></div>
                    <div class="w-1.5 h-1.5 bg-[#60A5FA] rounded-full animate-pulse delay-100"></div>
                    <div class="w-1.5 h-1.5 bg-[#A78BFA] rounded-full animate-pulse delay-200"></div>
                </div>
            </div>
        `;
    }
    
    if (!roadmaps || roadmaps.length === 0) {
        return `
            <div class="text-center py-16 bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl border border-[#374151] shadow-lg">
                <div class="relative">
                    <div class="absolute inset-0 flex items-center justify-center">
                        <div class="w-28 h-28 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full opacity-10 blur-2xl"></div>
                    </div>
                    <svg class="w-24 h-24 mx-auto mb-5 text-[#4B5563] relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                    </svg>
                    <p class="text-[#9CA3AF] text-xl mb-2">✨ No roadmaps yet</p>
                    <p class="text-sm text-[#6B7280] max-w-sm mx-auto">Generate your first AI-powered learning roadmap to get started!</p>
                    <div class="mt-6 flex justify-center gap-2">
                        <div class="w-1.5 h-1.5 bg-[#3B82F6] rounded-full animate-pulse"></div>
                        <div class="w-1.5 h-1.5 bg-[#60A5FA] rounded-full animate-pulse delay-100"></div>
                        <div class="w-1.5 h-1.5 bg-[#A78BFA] rounded-full animate-pulse delay-200"></div>
                    </div>
                    <a href="#/roadmap" class="inline-block mt-6 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] text-white px-6 py-2.5 rounded-xl hover:from-[#60A5FA] hover:to-[#8B5CF6] transition-all duration-300 transform hover:scale-105 shadow-lg">
                        🚀 Create Roadmap
                    </a>
                </div>
            </div>
        `;
    }
    
    return `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeInUp">
            ${roadmaps.map(roadmap => RoadmapCard({ roadmap })).join('')}
        </div>
    `;
}

export function setupRoadmapListEvents(onViewRoadmap) {
    setupRoadmapCardEvents(
        (id) => onViewRoadmap(id),
        null // Delete handled separately in parent
    );
}