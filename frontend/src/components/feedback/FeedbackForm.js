// frontend/src/components/feedback/FeedbackForm.js

export function FeedbackForm() {
    return `
        <div class="feedback-form bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-6 border border-[#374151]">
            <div class="text-center mb-6">
                <div class="w-16 h-16 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                    </svg>
                </div>
                <h3 class="text-xl font-bold text-white">Share Your Feedback</h3>
                <p class="text-sm text-gray-400 mt-1">Help us improve Flashnotes</p>
            </div>

            <form id="feedbackForm" onsubmit="return false;">
                <!-- Name Field -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-300 mb-2">Your Name</label>
                    <input type="text" 
                           id="feedbackName"
                           class="w-full bg-[#111827] border-2 border-[#374151] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#3B82F6] transition-all"
                           placeholder="Enter your name"
                           required>
                </div>

                <!-- Email Field -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                    <input type="email" 
                           id="feedbackEmail"
                           class="w-full bg-[#111827] border-2 border-[#374151] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#3B82F6] transition-all"
                           placeholder="your@email.com"
                           required>
                </div>

                <!-- Rating Stars (5 Stars) -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-300 mb-2">Rating</label>
                    <div class="flex gap-2 rating-stars" id="ratingStars">
                        ${[1, 2, 3, 4, 5].map(star => `
                            <button type="button" 
                                    class="rating-star w-12 h-12 rounded-xl bg-[#111827] border-2 border-[#374151] hover:border-[#F59E0B] transition-all flex items-center justify-center group"
                                    data-rating="${star}">
                                <svg class="w-6 h-6 text-gray-500 group-hover:text-[#F59E0B] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                                </svg>
                            </button>
                        `).join('')}
                    </div>
                    <p class="text-xs text-gray-500 mt-2" id="ratingText">Click to rate</p>
                </div>

                <!-- Feedback Message -->
                <div class="mb-5">
                    <label class="block text-sm font-medium text-gray-300 mb-2">Your Feedback</label>
                    <textarea id="feedbackMessage"
                              rows="4"
                              class="w-full bg-[#111827] border-2 border-[#374151] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#3B82F6] transition-all resize-none"
                              placeholder="Tell us what you think..."></textarea>
                </div>

                <!-- Submit Button -->
                <button type="submit"
                        id="submitFeedbackBtn"
                        class="w-full bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] hover:from-[#60A5FA] hover:to-[#8B5CF6] text-white py-3 rounded-xl font-medium transition-all transform hover:scale-105">
                    Submit Feedback
                </button>
            </form>

            <!-- Success/Error Messages -->
            <div id="feedbackMessageDiv" class="mt-4 text-center hidden"></div>
        </div>
    `;
}

export function setupFeedbackForm() {
    const form = document.getElementById('feedbackForm');
    if (!form) return;
    
    let selectedRating = 0;
    
    // Setup star rating
    const stars = document.querySelectorAll('.rating-star');
    const ratingText = document.getElementById('ratingText');
    
    const ratingMessages = {
        1: '😞 Poor - Needs improvement',
        2: '🙁 Fair - Could be better',
        3: '😐 Good - Satisfactory',
        4: '😊 Very Good - Impressed',
        5: '🤩 Excellent - Love it!'
    };
    
    stars.forEach(star => {
        star.addEventListener('click', () => {
            const rating = parseInt(star.dataset.rating);
            selectedRating = rating;
            
            // Update star colors
            stars.forEach((s, index) => {
                const svg = s.querySelector('svg');
                if (index < rating) {
                    svg.classList.add('text-[#F59E0B]');
                    svg.classList.remove('text-gray-500');
                    s.classList.add('border-[#F59E0B]');
                } else {
                    svg.classList.remove('text-[#F59E0B]');
                    svg.classList.add('text-gray-500');
                    s.classList.remove('border-[#F59E0B]');
                }
            });
            
            ratingText.textContent = ratingMessages[rating];
            ratingText.classList.add('text-[#F59E0B]');
        });
        
        // Hover effect
        star.addEventListener('mouseenter', () => {
            const rating = parseInt(star.dataset.rating);
            stars.forEach((s, index) => {
                const svg = s.querySelector('svg');
                if (index < rating) {
                    svg.classList.add('text-[#F59E0B]');
                }
            });
        });
        
        star.addEventListener('mouseleave', () => {
            stars.forEach((s, index) => {
                const svg = s.querySelector('svg');
                if (index >= selectedRating) {
                    svg.classList.remove('text-[#F59E0B]');
                    svg.classList.add('text-gray-500');
                }
            });
        });
    });
    
    // Handle form submission
    const submitBtn = document.getElementById('submitFeedbackBtn');
    const messageDiv = document.getElementById('feedbackMessageDiv');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('feedbackName').value.trim();
        const email = document.getElementById('feedbackEmail').value.trim();
        const feedback = document.getElementById('feedbackMessage').value.trim();
        
        // Validation
        if (!name) {
            showMessage('Please enter your name', 'error');
            return;
        }
        
        if (!email) {
            showMessage('Please enter your email', 'error');
            return;
        }
        
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showMessage('Please enter a valid email address', 'error');
            return;
        }
        
        if (selectedRating === 0) {
            showMessage('Please select a rating', 'error');
            return;
        }
        
        if (!feedback || feedback.length < 5) {
            showMessage('Please enter feedback (minimum 5 characters)', 'error');
            return;
        }
        
        // Disable button and show loading
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<div class="loading-spinner-small mx-auto"></div> Submitting...';
        
        try {
            const API_URL = window.API_URL || 'http://localhost:10000/api';
            const response = await fetch(`${API_URL}/feedback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    email,
                    rating: selectedRating,
                    feedback
                })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to submit feedback');
            }
            
            // Success
            showMessage('Thank you for your feedback! 🎉', 'success');
            form.reset();
            selectedRating = 0;
            
            // Reset stars
            stars.forEach(star => {
                const svg = star.querySelector('svg');
                svg.classList.remove('text-[#F59E0B]');
                svg.classList.add('text-gray-500');
                star.classList.remove('border-[#F59E0B]');
            });
            ratingText.textContent = 'Click to rate';
            ratingText.classList.remove('text-[#F59E0B]');
            
            // Refresh feedback list
            const refreshEvent = new CustomEvent('feedbackSubmitted');
            window.dispatchEvent(refreshEvent);
            
        } catch (error) {
            showMessage(error.message || 'Failed to submit feedback', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Submit Feedback';
        }
    });
    
    function showMessage(message, type) {
        messageDiv.textContent = message;
        messageDiv.className = `mt-4 p-3 rounded-lg text-sm text-center ${type === 'success' ? 'bg-green-500/20 border border-green-500 text-green-400' : 'bg-red-500/20 border border-red-500 text-red-400'}`;
        messageDiv.classList.remove('hidden');
        
        setTimeout(() => {
            messageDiv.classList.add('hidden');
        }, 5000);
    }
}