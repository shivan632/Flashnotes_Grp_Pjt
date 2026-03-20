// QA Card Component - Displays individual Q&A pairs

import { saveNote } from '../../services/storage.js';

export function QACard(question, answer, topic, index) {
    const cardId = `qa-card-${Date.now()}-${index}`;
    
    return `
        <div id="${cardId}" class="bg-[#1F2937] p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-[1.02]">
            <div class="flex items-start gap-4">
                <div class="bg-[#3B82F6] rounded-full p-3 flex-shrink-0">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <div class="flex-1">
                    <h4 class="text-xl font-bold text-[#3B82F6] mb-2">Q: ${question}</h4>
                    <p class="text-[#E5E7EB] leading-relaxed">A: ${answer}</p>
                    <div class="flex gap-4 mt-4">
                        <button class="save-note-btn text-[#60A5FA] hover:text-[#3B82F6] text-sm flex items-center gap-1 transition-all" 
                                data-topic="${topic}"
                                data-question="${question}"
                                data-answer="${answer}">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                            </svg>
                            Save Note
                        </button>
                        <button class="share-btn text-[#60A5FA] hover:text-[#3B82F6] text-sm flex items-center gap-1 transition-all">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                            </svg>
                            Share
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
        btn.addEventListener('click', () => {
            const topic = btn.dataset.topic;
            const question = btn.dataset.question;
            const answer = btn.dataset.answer;
            
            const savedNote = saveNote(topic, question, answer);
            
            // Show success message
            alert('Note saved successfully!');
            
            // Update button text temporarily
            const originalText = btn.innerHTML;
            btn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Saved!';
            setTimeout(() => {
                btn.innerHTML = originalText;
            }, 2000);
        });
    });
    
    // Share buttons
    const shareButtons = document.querySelectorAll('.share-btn');
    shareButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.bg-\\[\\#1F2937\\]');
            const question = card.querySelector('h4').textContent;
            const answer = card.querySelector('p').textContent;
            
            // Copy to clipboard
            navigator.clipboard.writeText(`${question}\n\n${answer}`).then(() => {
                alert('Copied to clipboard!');
            }).catch(() => {
                alert('Failed to copy');
            });
        });
    });
}