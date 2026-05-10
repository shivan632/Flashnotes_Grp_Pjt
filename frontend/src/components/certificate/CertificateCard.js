// frontend/src/components/certificate/CertificateCard.js
export function CertificateCard({ certificate }) {
    const earnedDate = new Date(certificate.earned_at);
    const formattedDate = earnedDate.toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
    });
    
    const typeStyles = {
        quiz_master: { icon: '🎯', gradient: 'from-purple-500 to-pink-500', badge: '🏆 Quiz Master' },
        perfect_score: { icon: '⭐', gradient: 'from-yellow-500 to-orange-500', badge: '⭐ Perfect Score' },
        roadmap_completer: { icon: '🗺️', gradient: 'from-emerald-500 to-teal-500', badge: '🗺️ Roadmap Master' },
        points_milestone: { icon: '🏆', gradient: 'from-amber-500 to-yellow-500', badge: '🏆 Points Champion' },
        voice_note_master: { icon: '🎤', gradient: 'from-blue-500 to-cyan-500', badge: '🎤 Voice Master' },
        achievement_hunter: { icon: '🏅', gradient: 'from-red-500 to-orange-500', badge: '🏅 Achievement Hunter' }
    };
    
    const style = typeStyles[certificate.type] || typeStyles.quiz_master;
    const certificateId = certificate.id;
    const certificateNumber = certificate.certificate_number || certificate.id.substring(0, 12);
    
    return `
        <div class="group relative bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl border border-purple-500/30">
            <div class="relative h-24 bg-gradient-to-r ${style.gradient} flex items-center justify-center">
                <span class="text-5xl relative z-10">${style.icon}</span>
            </div>
            <div class="p-5">
                <div class="inline-flex px-3 py-1 bg-[#374151] rounded-full mb-3">
                    <span class="text-xs text-gray-300">${style.badge}</span>
                </div>
                <h3 class="text-lg font-bold text-white mb-1">${escapeHtml(certificate.title)}</h3>
                <p class="text-sm text-gray-400 mb-3">${escapeHtml(certificate.description)}</p>
                <div class="flex items-center gap-3 text-xs text-gray-500 mb-4">
                    <span>📅 ${formattedDate}</span>
                    <span>🔑 ID: ${certificateNumber}</span>
                </div>
                <div class="flex gap-2">
                    <button class="view-cert-btn flex-1 py-2.5 bg-gradient-to-r ${style.gradient} hover:opacity-90 text-white rounded-lg font-medium transition-all duration-200" data-id="${certificateId}">
                        👁️ View Certificate
                    </button>
                    <button class="download-cert-btn w-12 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-all duration-200" data-id="${certificateId}">
                        📥
                    </button>
                </div>
            </div>
        </div>
    `;
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}