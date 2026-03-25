// frontend/src/components/feedback/FeedbackList.js

export function FeedbackList() {
    return `
        <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-6 border border-[#374151] w-full">
            <div class="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div>
                    <h3 class="text-2xl font-bold text-white">User Reviews</h3>
                    <p class="text-base text-gray-400 mt-1">What our learners say</p>
                </div>
                <div class="flex items-center gap-3">
                    <div class="w-12 h-12 bg-gradient-to-r from-[#F59E0B] to-[#F59E0B]/50 rounded-xl flex items-center justify-center">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                        </svg>
                    </div>
                    <div>
                        <div class="text-3xl font-bold text-white" id="avgRating">--</div>
                        <div class="text-sm text-gray-400">Average Rating</div>
                    </div>
                </div>
            </div>
            
            <!-- Full Width Grid Layout - Auto fit columns with larger cards -->
            <div id="feedbackListContainer" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-h-[700px] overflow-y-auto custom-scrollbar p-1">
                <div class="col-span-full text-center py-8">
                    <div class="loading-spinner-small mx-auto mb-3"></div>
                    <p class="text-gray-400">Loading feedback...</p>
                </div>
            </div>
            
            <div id="loadMoreBtn" class="mt-6 text-center hidden">
                <button class="text-[#60A5FA] hover:text-[#3B82F6] text-base transition-colors">
                    Load More Reviews
                </button>
            </div>
        </div>
    `;
}

export function setupFeedbackList() {
    console.log('📋 Setting up Feedback List');
    
    let currentOffset = 0;
    const limit = 12;
    let isLoading = false;
    let hasMore = true;
    
    const API_URL = window.API_URL || 'http://localhost:10000/api';
    
    async function loadFeedbackStats() {
        try {
            const response = await fetch(`${API_URL}/feedback/stats`);
            const data = await response.json();
            if (data.success && data.stats) {
                const avgRatingElem = document.getElementById('avgRating');
                if (avgRatingElem) {
                    avgRatingElem.textContent = data.stats.averageRating || '0.0';
                }
            }
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    }
    
    async function loadFeedbacks(reset = true) {
        if (isLoading) return;
        
        if (reset) {
            currentOffset = 0;
            hasMore = true;
            const container = document.getElementById('feedbackListContainer');
            if (container) {
                container.innerHTML = `
                    <div class="col-span-full text-center py-8">
                        <div class="loading-spinner-small mx-auto mb-3"></div>
                        <p class="text-gray-400">Loading feedback...</p>
                    </div>
                `;
            }
        }
        
        isLoading = true;
        
        try {
            const response = await fetch(`${API_URL}/feedback?limit=${limit}&offset=${currentOffset}`);
            const data = await response.json();
            
            if (!response.ok) throw new Error(data.message);
            
            const container = document.getElementById('feedbackListContainer');
            if (!container) return;
            
            if (reset) {
                container.innerHTML = '';
            }
            
            if (!data.feedbacks || data.feedbacks.length === 0) {
                if (currentOffset === 0) {
                    container.innerHTML = `
                        <div class="col-span-full text-center py-12">
                            <svg class="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                            </svg>
                            <p class="text-gray-400 text-lg">No feedback yet</p>
                            <p class="text-sm text-gray-500 mt-2">Be the first to share your experience!</p>
                        </div>
                    `;
                }
                hasMore = false;
                const loadMoreBtn = document.getElementById('loadMoreBtn');
                if (loadMoreBtn) loadMoreBtn.classList.add('hidden');
                isLoading = false;
                return;
            }
            
            data.feedbacks.forEach(feedback => {
                const card = createFeedbackCard(feedback);
                container.appendChild(card);
            });
            
            hasMore = data.feedbacks.length === limit;
            const loadMoreBtn = document.getElementById('loadMoreBtn');
            if (loadMoreBtn) {
                if (hasMore) {
                    loadMoreBtn.classList.remove('hidden');
                } else {
                    loadMoreBtn.classList.add('hidden');
                }
            }
            
            currentOffset += data.feedbacks.length;
            
        } catch (error) {
            console.error('Error loading feedbacks:', error);
            const container = document.getElementById('feedbackListContainer');
            if (container && currentOffset === 0) {
                container.innerHTML = `
                    <div class="col-span-full text-center py-12">
                        <p class="text-red-400">Failed to load feedbacks</p>
                        <button onclick="location.reload()" class="mt-4 text-[#60A5FA] hover:text-[#3B82F6]">Try Again</button>
                    </div>
                `;
            }
        } finally {
            isLoading = false;
        }
    }
    
    function createFeedbackCard(feedback) {
        const card = document.createElement('div');
        card.className = 'bg-[#111827] rounded-xl p-5 hover:bg-[#1F2937] transition-all border border-[#374151] hover:border-[#3B82F6]';
        
        const initials = feedback.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= feedback.rating) {
                stars.push(`<svg class="w-5 h-5 text-[#F59E0B] inline" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>`);
            } else {
                stars.push(`<svg class="w-5 h-5 text-gray-600 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>`);
            }
        }
        
        const date = new Date(feedback.created_at);
        const formattedDate = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
        
        card.innerHTML = `
            <div class="flex flex-col h-full">
                <div class="flex items-start gap-4 mb-3">
                    <div class="w-12 h-12 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-xl flex items-center justify-center flex-shrink-0">
                        <span class="text-white font-bold text-lg">${escapeHtml(initials)}</span>
                    </div>
                    <div class="flex-1">
                        <div class="flex items-center justify-between flex-wrap gap-2">
                            <h4 class="font-semibold text-white text-base">${escapeHtml(feedback.name)}</h4>
                            <div class="flex gap-1">
                                ${stars.join('')}
                            </div>
                        </div>
                        <p class="text-gray-500 text-sm mt-1">${formattedDate}</p>
                    </div>
                </div>
                <p class="text-gray-300 text-base leading-relaxed flex-1">${escapeHtml(feedback.feedback)}</p>
            </div>
        `;
        
        return card;
    }
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    loadFeedbackStats();
    loadFeedbacks(true);
    
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        const btn = loadMoreBtn.querySelector('button');
        if (btn) {
            btn.addEventListener('click', () => loadFeedbacks(false));
        }
    }
    
    window.addEventListener('feedbackSubmitted', () => {
        loadFeedbacks(true);
        loadFeedbackStats();
    });
}