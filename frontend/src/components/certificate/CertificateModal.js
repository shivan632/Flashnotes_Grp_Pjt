// frontend/src/components/certificate/CertificateModal.js

export function CertificateModal({ certificate, onClose, onView }) {
    const earnedDate = certificate?.earned_at ? new Date(certificate.earned_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }) : '';
    
    const typeStyles = {
        quiz_master: { icon: '🎯', gradient: 'from-purple-500 to-pink-500', title: 'Quiz Master Certificate' },
        perfect_score: { icon: '⭐', gradient: 'from-yellow-500 to-orange-500', title: 'Perfect Score Certificate' },
        roadmap_completer: { icon: '🗺️', gradient: 'from-emerald-500 to-teal-500', title: 'Roadmap Master Certificate' },
        points_milestone: { icon: '🏆', gradient: 'from-amber-500 to-yellow-500', title: 'Points Champion Certificate' },
        voice_note_master: { icon: '🎤', gradient: 'from-blue-500 to-cyan-500', title: 'Voice Note Master Certificate' },
        achievement_hunter: { icon: '🏅', gradient: 'from-red-500 to-orange-500', title: 'Achievement Hunter Certificate' }
    };
    
    const style = typeStyles[certificate?.type] || typeStyles.quiz_master;
    const userName = localStorage.getItem('userName') || 'Learner';
    
    return `
        <div id="certificateModal" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div class="relative max-w-md w-full bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl border border-[#374151] overflow-hidden animate-modalIn">
                
                <!-- Confetti Effect Placeholder -->
                <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${style.gradient}"></div>
                
                <!-- Header -->
                <div class="relative p-6 text-center">
                    <div class="w-20 h-20 mx-auto mb-4 bg-gradient-to-r ${style.gradient} rounded-full flex items-center justify-center shadow-xl animate-bounce">
                        <span class="text-4xl">${style.icon}</span>
                    </div>
                    
                    <div class="absolute top-4 right-4">
                        <button id="closeModalBtn" class="text-gray-400 hover:text-white transition-colors">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                    
                    <h2 class="text-2xl font-bold bg-gradient-to-r ${style.gradient} bg-clip-text text-transparent mb-2">
                        🎉 New Certificate Unlocked! 🎉
                    </h2>
                    
                    <p class="text-gray-400 text-sm">Congratulations, ${escapeHtml(userName)}!</p>
                </div>
                
                <!-- Certificate Preview -->
                <div class="p-6 border-t border-b border-[#374151] bg-[#111827]/50">
                    <div class="text-center">
                        <div class="w-16 h-16 mx-auto mb-3 bg-gradient-to-r ${style.gradient} rounded-xl flex items-center justify-center">
                            <span class="text-2xl">${style.icon}</span>
                        </div>
                        <h3 class="text-lg font-bold text-white mb-1">${style.title}</h3>
                        <p class="text-sm text-gray-400 mb-3">${escapeHtml(certificate?.description || '')}</p>
                        <div class="text-xs text-gray-500">
                            <span>Earned on ${earnedDate}</span>
                        </div>
                    </div>
                </div>
                
                <!-- Actions -->
                <div class="p-6 flex gap-3">
                    <button id="viewCertificateBtn" class="flex-1 py-3 bg-gradient-to-r ${style.gradient} hover:opacity-90 text-white rounded-xl font-semibold transition-all duration-200" data-id="${certificate?.id}">
                        View Full Certificate
                    </button>
                    <button id="closeModalBtn2" class="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold transition-all duration-200">
                        Later
                    </button>
                </div>
            </div>
        </div>
        
        <style>
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes modalIn {
                from {
                    opacity: 0;
                    transform: scale(0.9) translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
            }
            .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
            .animate-modalIn { animation: modalIn 0.3s cubic-bezier(0.34, 1.2, 0.64, 1) forwards; }
            .animate-bounce {
                animation: bounce 0.5s ease-out 3;
            }
            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }
        </style>
        
        <script>
            (function() {
                const modal = document.getElementById('certificateModal');
                const closeBtn = document.getElementById('closeModalBtn');
                const closeBtn2 = document.getElementById('closeModalBtn2');
                const viewBtn = document.getElementById('viewCertificateBtn');
                
                if (closeBtn) {
                    closeBtn.onclick = () => {
                        if (modal) modal.remove();
                        if (window.onModalClose) window.onModalClose();
                    };
                }
                
                if (closeBtn2) {
                    closeBtn2.onclick = () => {
                        if (modal) modal.remove();
                        if (window.onModalClose) window.onModalClose();
                    };
                }
                
                if (viewBtn && viewBtn.dataset.id) {
                    viewBtn.onclick = () => {
                        const id = viewBtn.dataset.id;
                        if (window.onViewCertificate) window.onViewCertificate(id);
                        if (modal) modal.remove();
                    };
                }
                
                // Close on background click
                if (modal) {
                    modal.onclick = (e) => {
                        if (e.target === modal) {
                            modal.remove();
                            if (window.onModalClose) window.onModalClose();
                        }
                    };
                }
            })();
        </script>
    `;
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}