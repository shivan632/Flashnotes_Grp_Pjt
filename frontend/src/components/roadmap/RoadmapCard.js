// frontend/src/components/roadmap/RoadmapCard.js
// Card component for saved roadmaps with delete functionality

import { getDifficultyClass, getDifficultyIcon, getDifficultyText, formatRoadmapDate, truncateText } from '../../utils/roadmapHelpers.js';

export function RoadmapCard({ roadmap, onDelete }) {
    const difficultyClass = getDifficultyClass(roadmap.difficulty);
    const difficultyIcon = getDifficultyIcon(roadmap.difficulty);
    const difficultyText = getDifficultyText(roadmap.difficulty);
    const formattedDate = formatRoadmapDate(roadmap.created_at);
    const totalNodes = roadmap.roadmap_data?.nodes?.length || 0;
    
    return `
        <div class="group relative bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl overflow-hidden border border-[#374151] hover:border-[#3B82F6] transition-all duration-300 hover:-translate-y-1 cursor-pointer shadow-lg" data-roadmap-id="${roadmap.id}">
            
            <!-- Delete Button (Appears on Hover) -->
            <button class="delete-roadmap-btn absolute top-3 right-3 z-20 p-2 bg-red-500/90 hover:bg-red-600 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110 shadow-lg" data-id="${roadmap.id}" title="Delete Roadmap">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
            </button>
            
            <!-- Thumbnail Area -->
            <div class="relative h-40 bg-gradient-to-br from-[#111827] to-[#1F2937] overflow-hidden">
                ${roadmap.image_url ? 
                    `<img src="${roadmap.image_url}" alt="${escapeHtml(roadmap.topic)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">` :
                    `<div class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#1F2937] to-[#111827]">
                        <svg class="w-12 h-12 text-[#3B82F6]/50 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                        </svg>
                        <span class="text-xs text-[#4B5563]">Roadmap Preview</span>
                    </div>`
                }
                
                <!-- Difficulty Badge -->
                <div class="absolute top-3 left-3">
                    <span class="px-2.5 py-1 text-xs rounded-full ${difficultyClass} flex items-center gap-1 shadow-lg backdrop-blur-sm">
                        <span>${difficultyIcon}</span>
                        <span>${difficultyText}</span>
                    </span>
                </div>
                
                <!-- Topics Count Badge -->
                <div class="absolute bottom-3 right-3">
                    <span class="px-2 py-1 text-xs rounded-full bg-[#111827]/90 text-[#9CA3AF] backdrop-blur-sm flex items-center gap-1">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                        </svg>
                        ${totalNodes} topics
                    </span>
                </div>
            </div>
            
            <!-- Content Area -->
            <div class="p-4">
                <div class="flex items-start justify-between mb-2">
                    <h3 class="text-lg font-bold text-white group-hover:text-[#3B82F6] transition-colors line-clamp-1 flex items-center gap-2">
                        <span>🗺️</span>
                        ${escapeHtml(roadmap.topic)}
                    </h3>
                    ${roadmap.depth_level ? `
                        <span class="text-xs px-2 py-0.5 bg-[#374151] rounded-full text-[#9CA3AF]">L${roadmap.depth_level}</span>
                    ` : ''}
                </div>
                
                <p class="text-sm text-[#9CA3AF] line-clamp-2 mb-3">
                    ${escapeHtml(truncateText(roadmap.description || `A ${difficultyText} level roadmap to master ${roadmap.topic}`, 80))}
                </p>
                
                <div class="flex items-center justify-between text-xs text-[#6B7280] pt-2 border-t border-[#374151]">
                    <div class="flex items-center gap-3">
                        <span class="flex items-center gap-1">
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            ${formattedDate}
                        </span>
                        ${roadmap.view_count ? `
                            <span class="flex items-center gap-1">
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                </svg>
                                ${roadmap.view_count}
                            </span>
                        ` : ''}
                    </div>
                    <button class="view-roadmap-btn px-3 py-1.5 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] text-white rounded-lg text-xs font-medium hover:shadow-lg transition-all transform hover:scale-105">
                        View Roadmap
                    </button>
                </div>
            </div>
        </div>
    `;
}

export function setupRoadmapCardEvents(onView, onDelete) {
    // Card click - view roadmap
    document.querySelectorAll('.group[data-roadmap-id]').forEach(card => {
        const roadmapId = card.dataset.roadmapId;
        
        // Remove existing listener to avoid duplicates
        const newCard = card.cloneNode(true);
        card.parentNode.replaceChild(newCard, card);
        
        newCard.addEventListener('click', (e) => {
            // Don't trigger if clicking delete button
            if (e.target.closest('.delete-roadmap-btn')) return;
            
            if (onView) onView(roadmapId);
        });
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