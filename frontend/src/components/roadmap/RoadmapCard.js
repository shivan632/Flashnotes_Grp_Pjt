// frontend/src/components/roadmap/RoadmapCard.js
// Card component for saved roadmaps - Enhanced UI

import { getDifficultyClass, getDifficultyIcon, getDifficultyText, formatRoadmapDate, truncateText } from '../../utils/roadmapHelpers.js';

export function RoadmapCard({ roadmap }) {
    const difficultyClass = getDifficultyClass(roadmap.difficulty);
    const difficultyIcon = getDifficultyIcon(roadmap.difficulty);
    const difficultyText = getDifficultyText(roadmap.difficulty);
    const formattedDate = formatRoadmapDate(roadmap.created_at);
    const totalNodes = roadmap.roadmap_data?.nodes?.length || 0;
    
    return `
        <div class="group relative bg-gradient-to-br from-[#1F2937] via-[#1A2436] to-[#111827] rounded-2xl overflow-hidden border border-[#374151] hover:border-[#3B82F6] transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer shadow-lg" data-roadmap-id="${roadmap.id}">
            <!-- Animated Background Glow -->
            <div class="absolute inset-0 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
            <div class="absolute -inset-1 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] blur-2xl opacity-0 group-hover:opacity-15 transition-opacity duration-700"></div>
            
            <!-- Delete Button -->
            <button class="delete-roadmap-btn absolute top-3 right-3 z-20 p-2 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110 shadow-lg" data-id="${roadmap.id}" title="Delete Roadmap">
                <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
            </button>
            
            <!-- Thumbnail Area -->
            <div class="relative h-40 bg-gradient-to-br from-[#111827] to-[#1F2937] overflow-hidden">
                <div class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#1F2937] to-[#111827] group-hover:scale-105 transition-transform duration-500">
                    <div class="relative">
                        <div class="absolute inset-0 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                        <svg class="w-14 h-14 text-[#3B82F6]/50 mb-2 relative group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                        </svg>
                        <span class="text-xs text-[#4B5563] group-hover:text-[#6B7280] transition-colors">${totalNodes} Topics</span>
                    </div>
                </div>
                
                <!-- Difficulty Badge -->
                <div class="absolute top-3 left-3">
                    <span class="px-2.5 py-1 text-xs rounded-full ${difficultyClass} flex items-center gap-1 shadow-lg backdrop-blur-sm group-hover:scale-105 transition-transform">
                        <span class="text-sm">${difficultyIcon}</span>
                        <span>${difficultyText}</span>
                    </span>
                </div>
            </div>
            
            <!-- Content Area -->
            <div class="p-4">
                <h3 class="text-lg font-bold text-white group-hover:text-[#3B82F6] transition-colors line-clamp-1 mb-2 flex items-center gap-2">
                    <span class="text-xl">🗺️</span>
                    ${escapeHtml(roadmap.topic)}
                </h3>
                
                <p class="text-sm text-[#9CA3AF] line-clamp-2 mb-3 group-hover:text-[#D1D5DB] transition-colors">
                    ${escapeHtml(truncateText(roadmap.description || `A ${difficultyText} level roadmap to master ${roadmap.topic}`, 80))}
                </p>
                
                <div class="flex items-center justify-between text-xs text-[#6B7280] pt-2 border-t border-[#374151] group-hover:border-[#4B5563] transition-colors">
                    <span class="flex items-center gap-1 group-hover:text-[#9CA3AF] transition-colors">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        ${formattedDate}
                    </span>
                    <button class="view-roadmap-btn px-3 py-1.5 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] text-white rounded-lg text-xs font-medium hover:shadow-lg transition-all transform hover:scale-105 flex items-center gap-1">
                        <span>View Roadmap</span>
                        <svg class="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </button>
                </div>
            </div>
            
            <!-- Hover Border Animation -->
            <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
        </div>
    `;
}

export function setupRoadmapCardEvents(onView, onDelete) {
    // Card click - view roadmap
    document.querySelectorAll('.group[data-roadmap-id]').forEach(card => {
        const roadmapId = card.dataset.roadmapId;
        const newCard = card.cloneNode(true);
        card.parentNode.replaceChild(newCard, card);
        
        newCard.addEventListener('click', (e) => {
            if (e.target.closest('.delete-roadmap-btn') || e.target.closest('.view-roadmap-btn')) return;
            if (onView) onView(roadmapId);
        });
        
        // View button click
        const viewBtn = newCard.querySelector('.view-roadmap-btn');
        if (viewBtn) {
            viewBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (onView) onView(roadmapId);
            });
        }
    });
    
    // Delete button click
    document.querySelectorAll('.delete-roadmap-btn').forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        newBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            const roadmapId = newBtn.dataset.id;
            if (onDelete) onDelete(roadmapId);
        });
    });
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}