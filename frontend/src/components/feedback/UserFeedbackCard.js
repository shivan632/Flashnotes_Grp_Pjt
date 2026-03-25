// frontend/src/components/feedback/UserFeedbackCard.js

export function UserFeedbackCard() {
    return `
        <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-6 border border-[#374151]">
            <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 bg-gradient-to-r from-[#F59E0B] to-[#F59E0B]/50 rounded-xl flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                    </svg>
                </div>
                <h3 class="text-xl font-bold text-white">Your Feedback</h3>
            </div>
            
            <div id="userFeedbackContainer" class="text-center py-8">
                <div class="loading-spinner-small mx-auto mb-3"></div>
                <p class="text-gray-400">Loading your feedback...</p>
            </div>
            
            <div id="editFeedbackBtn" class="mt-4 hidden">
                <button class="w-full bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] hover:from-[#60A5FA] hover:to-[#8B5CF6] text-white py-2 rounded-xl font-medium transition-all">
                    Edit Your Feedback
                </button>
            </div>
        </div>
    `;
}

export function setupUserFeedback() {
    const container = document.getElementById('userFeedbackContainer');
    const editBtn = document.getElementById('editFeedbackBtn');
    
    if (!container) return;
    
    const API_URL = window.API_URL || 'http://localhost:10000/api';
    const token = localStorage.getItem('token');
    
    async function loadUserFeedback() {
        if (!token) {
            container.innerHTML = `
                <div class="text-center py-8">
                    <p class="text-gray-400">Please login to share your feedback</p>
                    <a href="#/login" class="mt-3 inline-block text-[#60A5FA] hover:text-[#3B82F6] text-sm">Login</a>
                </div>
            `;
            return;
        }
        
        try {
            const response = await fetch(`${API_URL}/feedback/my-feedback`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            
            if (!response.ok) throw new Error(data.message);
            
            if (data.feedback) {
                const fb = data.feedback;
                const stars = generateStars(fb.rating);
                const date = new Date(fb.created_at);
                const formattedDate = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
                
                container.innerHTML = `
                    <div class="bg-[#111827] rounded-xl p-4 border border-[#374151]">
                        <div class="flex items-center justify-between mb-3">
                            <div class="flex gap-1">
                                ${stars}
                            </div>
                            <span class="text-xs text-gray-500">${formattedDate}</span>
                        </div>
                        <p class="text-gray-300 text-sm">${escapeHtml(fb.feedback)}</p>
                        ${fb.editable ? '<p class="text-xs text-green-500 mt-2">✨ You can edit this feedback once</p>' : '<p class="text-xs text-gray-500 mt-2">✓ Feedback submitted</p>'}
                    </div>
                `;
                
                if (editBtn && fb.editable) {
                    editBtn.classList.remove('hidden');
                    const editButton = editBtn.querySelector('button');
                    if (editButton) {
                        editButton.onclick = () => {
                            openFeedbackModalForEdit(fb);
                        };
                    }
                } else if (editBtn) {
                    editBtn.classList.add('hidden');
                }
            } else {
                container.innerHTML = `
                    <div class="text-center py-8">
                        <svg class="w-12 h-12 mx-auto text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                        </svg>
                        <p class="text-gray-400">You haven't shared any feedback yet</p>
                        <button onclick="openFeedbackModal()" class="mt-3 text-[#60A5FA] hover:text-[#3B82F6] text-sm transition-colors">
                            Give Feedback
                        </button>
                    </div>
                `;
                if (editBtn) editBtn.classList.add('hidden');
            }
            
        } catch (error) {
            console.error('Error loading user feedback:', error);
            container.innerHTML = `
                <div class="text-center py-8">
                    <p class="text-red-400">Failed to load your feedback</p>
                    <button onclick="openFeedbackModal()" class="mt-3 text-[#60A5FA] hover:text-[#3B82F6] text-sm">Try Again</button>
                </div>
            `;
        }
    }
    
    function generateStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += `<svg class="w-4 h-4 text-[#F59E0B] inline" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>`;
            } else {
                stars += `<svg class="w-4 h-4 text-gray-600 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>`;
            }
        }
        return stars;
    }
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    loadUserFeedback();
    
    window.addEventListener('feedbackSubmitted', () => {
        loadUserFeedback();
        window.dispatchEvent(new CustomEvent('refreshFeedbackList'));
    });
}

// Global function to open modal for editing
window.openFeedbackModalForEdit = (feedback) => {
    const modal = document.getElementById('feedbackModal');
    if (modal) {
        modal.classList.remove('hidden');
        document.getElementById('modalFeedbackName').value = feedback.name;
        document.getElementById('modalFeedbackEmail').value = feedback.email;
        document.getElementById('modalFeedbackMessage').value = feedback.feedback;
        
        const stars = document.querySelectorAll('.modal-star');
        stars.forEach((star, index) => {
            const rating = parseInt(star.dataset.rating);
            const svg = star.querySelector('svg');
            if (index < feedback.rating) {
                svg.classList.add('text-[#F59E0B]');
                svg.classList.remove('text-gray-500');
                star.classList.add('border-[#F59E0B]');
            } else {
                svg.classList.remove('text-[#F59E0B]');
                svg.classList.add('text-gray-500');
                star.classList.remove('border-[#F59E0B]');
            }
        });
        
        window.selectedRating = feedback.rating;
        const ratingText = document.getElementById('modalRatingText');
        const ratingMessages = {
            1: '😞 Poor - Needs improvement',
            2: '🙁 Fair - Could be better',
            3: '😐 Good - Satisfactory',
            4: '😊 Very Good - Impressed',
            5: '🤩 Excellent - Love it!'
        };
        ratingText.textContent = ratingMessages[feedback.rating];
        ratingText.classList.add('text-[#F59E0B]');
    }
};