// frontend/src/components/main/QACard.js
// QA Card Component - Enhanced UI with modern design

import { saveNote } from '../../services/storage.js';
import { showError } from '../common/ErrorMessage.js';

export function QACard(question, answer, topic, index) {
    const cardId = `qa-card-${Date.now()}-${index}`;
    
    return `
        <div id="${cardId}" class="qa-card group bg-gradient-to-br from-[#1F2937] to-[#111827] p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-[#374151] hover:border-[#3B82F6] animate-fadeInUp" style="animation-delay: ${index * 0.1}s">
            <div class="flex items-start gap-4">
                <div class="relative">
                    <div class="absolute inset-0 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div class="w-12 h-12 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300 relative z-10">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                </div>
                <div class="flex-1">
                    <div class="flex items-start justify-between gap-4 mb-3">
                        <h4 class="text-xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] bg-clip-text text-transparent leading-relaxed">
                            Q: ${escapeHtml(question)}
                        </h4>
                        <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div class="w-1 h-1 bg-[#3B82F6] rounded-full"></div>
                            <div class="w-1 h-1 bg-[#60A5FA] rounded-full"></div>
                            <div class="w-1 h-1 bg-[#A78BFA] rounded-full"></div>
                        </div>
                    </div>
                    <div class="bg-[#111827]/50 rounded-xl p-4 mb-4 border-l-4 border-[#3B82F6]">
                        <p class="text-[#E5E7EB] leading-relaxed">A: ${escapeHtml(answer)}</p>
                    </div>
                    <div class="flex gap-3">
                        <button class="save-note-btn group/btn bg-[#374151] hover:bg-gradient-to-r hover:from-[#3B82F6] hover:to-[#A78BFA] text-[#9CA3AF] hover:text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2"
                                data-topic="${escapeHtml(topic)}"
                                data-question="${escapeHtml(question)}"
                                data-answer="${escapeHtml(answer)}">
                            <svg class="w-4 h-4 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                            </svg>
                            <span>Save Note</span>
                        </button>
                        <button class="share-btn group/btn bg-[#374151] hover:bg-gradient-to-r hover:from-[#3B82F6] hover:to-[#A78BFA] text-[#9CA3AF] hover:text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2">
                            <svg class="w-4 h-4 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                            </svg>
                            <span>Share</span>
                        </button>
                        <button class="ai-explain-btn group/btn bg-[#374151] hover:bg-gradient-to-r hover:from-[#A78BFA] hover:to-[#3B82F6] text-[#9CA3AF] hover:text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2"
                                data-question="${escapeHtml(question)}">
                            <svg class="w-4 h-4 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                            </svg>
                            <span>Ask AI</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Setup QA card events
export function setupQACardEvents() {
    // Save note buttons
    const saveButtons = document.querySelectorAll('.save-note-btn');
    saveButtons.forEach(btn => {
        btn.addEventListener('click', async () => {
            const topic = btn.dataset.topic;
            const question = btn.dataset.question;
            const answer = btn.dataset.answer;
            
            btn.disabled = true;
            const originalText = btn.innerHTML;
            btn.innerHTML = '<div class="loading-spinner-small"></div> Saving...';
            
            try {
                await saveNote(topic, question, answer);
                showError('Note saved successfully!', 'success');
                
                // Update button to show success
                btn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Saved!';
                btn.classList.add('bg-green-600', 'hover:bg-green-700');
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.classList.remove('bg-green-600', 'hover:bg-green-700');
                    btn.disabled = false;
                }, 2000);
                
                // Refresh storage section
                const storageSection = document.querySelector('.storage-section');
                if (storageSection) {
                    const { StorageArea } = await import('./StorageArea.js');
                    storageSection.innerHTML = await StorageArea();
                    const { setupStorageEvents } = await import('./StorageArea.js');
                    setupStorageEvents();
                }
                
            } catch (error) {
                console.error('Save error:', error);
                showError('Failed to save note', 'error');
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        });
    });
    
    // Share buttons
    const shareButtons = document.querySelectorAll('.share-btn');
    shareButtons.forEach(btn => {
        btn.addEventListener('click', async () => {
            const card = btn.closest('.qa-card');
            const questionElement = card.querySelector('h4');
            const answerElement = card.querySelector('.bg-\\[\\#111827\\]\\/50 p');
            
            const question = questionElement?.textContent?.replace('Q: ', '') || '';
            const answer = answerElement?.textContent?.replace('A: ', '') || '';
            
            const shareText = `📚 Flashnotes Learning\n\n${question}\n\n${answer}\n\n---\nShared from Flashnotes App`;
            
            try {
                await navigator.clipboard.writeText(shareText);
                
                // Show success feedback on button
                const originalText = btn.innerHTML;
                btn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Copied!';
                btn.classList.add('bg-green-600', 'hover:bg-green-700');
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.classList.remove('bg-green-600', 'hover:bg-green-700');
                }, 2000);
                
            } catch (err) {
                showError('Failed to copy to clipboard', 'error');
            }
        });
    });
    
    // AI Explain buttons
    const aiExplainBtns = document.querySelectorAll('.ai-explain-btn');
    aiExplainBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            const question = btn.dataset.question;
            
            // Open AI chat sidebar
            const aiSidebar = document.getElementById('aiChatSidebar');
            if (aiSidebar) {
                aiSidebar.classList.remove('translate-x-full');
                aiSidebar.classList.add('translate-x-0');
            }
            
            // Set the input value
            const aiInput = document.getElementById('aiChatInput');
            if (aiInput) {
                aiInput.value = `Can you explain this in more detail: ${question}`;
                aiInput.dispatchEvent(new Event('input'));
                
                // Trigger send message after a short delay
                setTimeout(() => {
                    const sendBtn = document.getElementById('sendAIMessage');
                    if (sendBtn && !sendBtn.disabled) {
                        sendBtn.click();
                    }
                }, 500);
            }
            
            // Scroll to AI chat
            setTimeout(() => {
                const aiChatSidebar = document.getElementById('aiChatSidebar');
                if (aiChatSidebar) {
                    aiChatSidebar.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 300);
        });
    });
}

// Helper function to escape HTML
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add CSS animations
const qaCardStyles = `
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
    
    .animate-fadeInUp {
        animation: fadeInUp 0.5s ease-out forwards;
        opacity: 0;
    }
    
    .qa-card {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .qa-card:hover {
        transform: translateY(-4px);
    }
`;

if (!document.querySelector('#qa-card-styles')) {
    const style = document.createElement('style');
    style.id = 'qa-card-styles';
    style.textContent = qaCardStyles;
    document.head.appendChild(style);
}