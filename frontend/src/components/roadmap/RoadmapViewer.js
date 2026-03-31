// frontend/src/components/roadmap/RoadmapViewer.js
// Roadmap Viewer Component - Enhanced UI

export function RoadmapViewer({ htmlContent, roadmapId, topic, onSave, onShare, onDownload }) {
    return `
        <div class="bg-gradient-to-br from-[#1F2937] via-[#1A2436] to-[#111827] rounded-2xl p-6 border border-[#374151] shadow-xl hover:shadow-2xl transition-all duration-300">
            <!-- Header -->
            <div class="flex items-center justify-between mb-6 pb-3 border-b border-[#374151]">
                <div class="flex items-center gap-3">
                    <div class="relative">
                        <div class="absolute inset-0 bg-gradient-to-r from-[#10B981] to-[#059669] rounded-xl blur-md opacity-0 group-hover:opacity-50 transition-opacity"></div>
                        <div class="relative w-11 h-11 bg-gradient-to-r from-[#10B981] to-[#059669] rounded-xl flex items-center justify-center shadow-lg">
                            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                            </svg>
                        </div>
                    </div>
                    <div>
                        <h3 class="text-lg font-bold bg-gradient-to-r from-white to-[#9CA3AF] bg-clip-text text-transparent">${escapeHtml(topic)} Roadmap</h3>
                        <p class="text-xs text-[#6B7280]">AI-generated learning path</p>
                    </div>
                </div>
                
                <div class="flex gap-2">
                    <button id="saveBtn-${roadmapId}" class="group p-2 bg-[#111827] rounded-lg hover:bg-gradient-to-r hover:from-[#3B82F6] hover:to-[#A78BFA] transition-all duration-300 hover:scale-105" title="Save to Collection">
                        <svg class="w-5 h-5 text-[#9CA3AF] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                        </svg>
                    </button>
                    <button id="shareBtn-${roadmapId}" class="group p-2 bg-[#111827] rounded-lg hover:bg-gradient-to-r hover:from-[#3B82F6] hover:to-[#A78BFA] transition-all duration-300 hover:scale-105" title="Share Link">
                        <svg class="w-5 h-5 text-[#9CA3AF] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                        </svg>
                    </button>
                </div>
            </div>
            
            <!-- Roadmap Content -->
            <div class="bg-gradient-to-br from-[#0F172A] to-[#111827] rounded-xl p-6 border border-[#374151] text-center">
                <div class="mb-6">
                    <div class="relative inline-block">
                        <div class="absolute inset-0 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-2xl blur-2xl opacity-50 animate-pulse"></div>
                        <div class="relative w-20 h-20 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-2xl flex items-center justify-center shadow-lg mb-4 mx-auto">
                            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                            </svg>
                        </div>
                    </div>
                    <h2 class="text-2xl font-bold bg-gradient-to-r from-white to-[#9CA3AF] bg-clip-text text-transparent mb-2">${escapeHtml(topic)} Learning Path</h2>
                    <p class="text-[#9CA3AF]">Personalized roadmap to master ${escapeHtml(topic)}</p>
                </div>
                
                <!-- Topics List -->
                <div class="text-left space-y-3 max-h-96 overflow-y-auto custom-scrollbar pr-2">
                    <div class="group p-3 bg-gradient-to-r from-[#1F2937] to-[#1A2436] rounded-xl border border-[#374151] hover:border-[#3B82F6] transition-all duration-300 hover:translate-x-1">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                <span class="text-white text-xs font-bold">1</span>
                            </div>
                            <div>
                                <p class="font-medium text-white group-hover:text-[#3B82F6] transition-colors">Introduction to ${escapeHtml(topic)}</p>
                                <p class="text-xs text-[#9CA3AF]">Get started with fundamentals</p>
                            </div>
                        </div>
                    </div>
                    <div class="group p-3 bg-gradient-to-r from-[#1F2937] to-[#1A2436] rounded-xl border border-[#374151] hover:border-[#3B82F6] transition-all duration-300 hover:translate-x-1">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                <span class="text-white text-xs font-bold">2</span>
                            </div>
                            <div>
                                <p class="font-medium text-white group-hover:text-[#3B82F6] transition-colors">Core Concepts &amp; Theory</p>
                                <p class="text-xs text-[#9CA3AF]">Understand key principles</p>
                            </div>
                        </div>
                    </div>
                    <div class="group p-3 bg-gradient-to-r from-[#1F2937] to-[#1A2436] rounded-xl border border-[#374151] hover:border-[#3B82F6] transition-all duration-300 hover:translate-x-1">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                <span class="text-white text-xs font-bold">3</span>
                            </div>
                            <div>
                                <p class="font-medium text-white group-hover:text-[#3B82F6] transition-colors">Hands-on Practice</p>
                                <p class="text-xs text-[#9CA3AF]">Build real projects</p>
                            </div>
                        </div>
                    </div>
                    <div class="group p-3 bg-gradient-to-r from-[#1F2937] to-[#1A2436] rounded-xl border border-[#374151] hover:border-[#3B82F6] transition-all duration-300 hover:translate-x-1">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                <span class="text-white text-xs font-bold">4</span>
                            </div>
                            <div>
                                <p class="font-medium text-white group-hover:text-[#3B82F6] transition-colors">Advanced Topics</p>
                                <p class="text-xs text-[#9CA3AF]">Take skills to next level</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="mt-6 pt-4 border-t border-[#374151]">
                    <p class="text-sm text-[#6B7280] flex items-center justify-center gap-2">
                        <span class="w-1.5 h-1.5 bg-[#3B82F6] rounded-full animate-pulse"></span>
                        ✨ Roadmap generated with AI assistance
                    </p>
                </div>
            </div>
            
            <div class="mt-4 pt-3 border-t border-[#374151] flex justify-between items-center text-xs text-[#6B7280]">
                <span class="flex items-center gap-1">💡 Click "Save" to add to your collection</span>
                <span class="font-mono">ID: #${roadmapId}</span>
            </div>
        </div>
        
        <script>
            (function() {
                const saveBtn = document.getElementById('saveBtn-${roadmapId}');
                if (saveBtn && window.handleSaveRoadmap) {
                    const newSaveBtn = saveBtn.cloneNode(true);
                    saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);
                    newSaveBtn.addEventListener('click', () => window.handleSaveRoadmap(${roadmapId}));
                }
                
                const shareBtn = document.getElementById('shareBtn-${roadmapId}');
                if (shareBtn && window.handleShareRoadmap) {
                    const newShareBtn = shareBtn.cloneNode(true);
                    shareBtn.parentNode.replaceChild(newShareBtn, shareBtn);
                    newShareBtn.addEventListener('click', () => window.handleShareRoadmap(${roadmapId}));
                }
            })();
        </script>
    `;
}

export function setupRoadmapViewer({ onSave, onShare, onDownload }) {
    console.log('RoadmapViewer setup complete');
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add CSS animations
const roadmapViewerStyles = `
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
    
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(-15px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .animate-fadeInUp {
        animation: fadeInUp 0.5s ease-out forwards;
    }
    
    .custom-scrollbar::-webkit-scrollbar {
        width: 5px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-track {
        background: #1F2937;
        border-radius: 10px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: linear-gradient(135deg, #3B82F6, #A78BFA);
        border-radius: 10px;
    }
`;

if (!document.querySelector('#roadmap-viewer-styles')) {
    const style = document.createElement('style');
    style.id = 'roadmap-viewer-styles';
    style.textContent = roadmapViewerStyles;
    document.head.appendChild(style);
}