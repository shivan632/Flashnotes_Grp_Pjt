// frontend/src/components/feedback/FeedbackModal.js
import { submitFeedback } from '../../services/feedbackService.js';

// Flag to prevent duplicate submissions
let isSubmitting = false;

export function FeedbackModal() {
    return `
        <div id="feedbackModal" class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[2000] hidden">
            <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl w-full max-w-md mx-4 p-6 border border-[#374151] animate-fadeInUp">
                <!-- Header -->
                <div class="flex justify-between items-center mb-4">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-xl flex items-center justify-center">
                            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                            </svg>
                        </div>
                        <h3 class="text-xl font-bold text-white">Share Your Feedback</h3>
                    </div>
                    <button id="closeFeedbackModal" class="text-gray-400 hover:text-white transition-colors">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                
                <p class="text-sm text-gray-400 mb-5">Help us improve Flashnotes with your valuable feedback</p>
                
                <form id="feedbackModalForm" onsubmit="return false;">
                    <div class="mb-4">
                        <input type="text" 
                               id="modalFeedbackName"
                               class="w-full bg-[#111827] border-2 border-[#374151] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#3B82F6] transition-all"
                               placeholder="Your Name"
                               required>
                    </div>
                    
                    <div class="mb-4">
                        <input type="email" 
                               id="modalFeedbackEmail"
                               class="w-full bg-[#111827] border-2 border-[#374151] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#3B82F6] transition-all"
                               placeholder="Your Email"
                               required>
                    </div>
                    
                    <div class="mb-4">
                        <label class="block text-sm text-gray-400 mb-2">Rating</label>
                        <div class="flex gap-2" id="modalRatingStars">
                            ${[1, 2, 3, 4, 5].map(star => `
                                <button type="button" 
                                        class="modal-star w-10 h-10 rounded-xl bg-[#111827] border-2 border-[#374151] hover:border-[#F59E0B] transition-all flex items-center justify-center"
                                        data-rating="${star}">
                                    <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                                    </svg>
                                </button>
                            `).join('')}
                        </div>
                        <p class="text-xs text-gray-500 mt-2" id="modalRatingText">Click to rate</p>
                    </div>
                    
                    <div class="mb-5">
                        <textarea id="modalFeedbackMessage"
                                  rows="4"
                                  class="w-full bg-[#111827] border-2 border-[#374151] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#3B82F6] transition-all resize-none"
                                  placeholder="Tell us what you think..."></textarea>
                    </div>
                    
                    <button type="submit"
                            id="modalSubmitBtn"
                            class="w-full bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] hover:from-[#60A5FA] hover:to-[#8B5CF6] text-white py-3 rounded-xl font-medium transition-all transform hover:scale-105">
                        Submit Feedback
                    </button>
                </form>
                
                <div id="modalMessageDiv" class="mt-4 text-center hidden"></div>
            </div>
        </div>
    `;
}

export function setupFeedbackModal() {
    const modal = document.getElementById('feedbackModal');
    if (!modal) return;
    
    const closeBtn = document.getElementById('closeFeedbackModal');
    const form = document.getElementById('feedbackModalForm');
    
    if (!form) return;
    
    let selectedRating = 0;
    
    const stars = document.querySelectorAll('.modal-star');
    const ratingText = document.getElementById('modalRatingText');
    
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
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
            // Reset form when closing
            form.reset();
            selectedRating = 0;
            stars.forEach(star => {
                const svg = star.querySelector('svg');
                svg.classList.remove('text-[#F59E0B]');
                svg.classList.add('text-gray-500');
                star.classList.remove('border-[#F59E0B]');
            });
            ratingText.textContent = 'Click to rate';
            ratingText.classList.remove('text-[#F59E0B]');
            isSubmitting = false;
        });
    }
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
            form.reset();
            selectedRating = 0;
            stars.forEach(star => {
                const svg = star.querySelector('svg');
                svg.classList.remove('text-[#F59E0B]');
                svg.classList.add('text-gray-500');
                star.classList.remove('border-[#F59E0B]');
            });
            ratingText.textContent = 'Click to rate';
            ratingText.classList.remove('text-[#F59E0B]');
            isSubmitting = false;
        }
    });
    
    const submitBtn = document.getElementById('modalSubmitBtn');
    const messageDiv = document.getElementById('modalMessageDiv');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Prevent duplicate submissions
        if (isSubmitting) {
            console.log('Already submitting, please wait...');
            return;
        }
        
        const name = document.getElementById('modalFeedbackName').value.trim();
        const email = document.getElementById('modalFeedbackEmail').value.trim();
        const feedback = document.getElementById('modalFeedbackMessage').value.trim();
        
        if (!name) { showMessage('Please enter your name', 'error'); return; }
        if (!email) { showMessage('Please enter your email', 'error'); return; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showMessage('Please enter a valid email', 'error'); return; }
        if (selectedRating === 0) { showMessage('Please select a rating', 'error'); return; }
        if (!feedback || feedback.length < 5) { showMessage('Please enter feedback (min 5 characters)', 'error'); return; }
        
        isSubmitting = true;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<div class="loading-spinner-small mx-auto"></div> Submitting...';
        
        try {
            const result = await submitFeedback({ name, email, rating: selectedRating, feedback });
            
            showMessage('Thank you for your feedback! 🎉', 'success');
            
            // Reset form
            form.reset();
            selectedRating = 0;
            stars.forEach(star => {
                const svg = star.querySelector('svg');
                svg.classList.remove('text-[#F59E0B]');
                svg.classList.add('text-gray-500');
                star.classList.remove('border-[#F59E0B]');
            });
            ratingText.textContent = 'Click to rate';
            ratingText.classList.remove('text-[#F59E0B]');
            
            // Close modal after 2 seconds
            setTimeout(() => {
                modal.classList.add('hidden');
                isSubmitting = false;
            }, 2000);
            
        } catch (error) {
            showMessage(error.message || 'Failed to submit feedback', 'error');
            isSubmitting = false;
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Submit Feedback';
        }
        // After successful submission
        window.dispatchEvent(new CustomEvent('feedbackSubmitted'));
    });
    
    function showMessage(message, type) {
        messageDiv.textContent = message;
        messageDiv.className = `mt-4 p-3 rounded-lg text-sm text-center ${type === 'success' ? 'bg-green-500/20 border border-green-500 text-green-400' : 'bg-red-500/20 border border-red-500 text-red-400'}`;
        messageDiv.classList.remove('hidden');
        setTimeout(() => messageDiv.classList.add('hidden'), 5000);
    }
}

export function openFeedbackModal() {
    const modal = document.getElementById('feedbackModal');
    if (modal) {
        modal.classList.remove('hidden');
        // Pre-fill with user data if available
        const userName = localStorage.getItem('userName');
        const userEmail = localStorage.getItem('userEmail');
        if (userName) document.getElementById('modalFeedbackName').value = userName;
        if (userEmail) document.getElementById('modalFeedbackEmail').value = userEmail;
        
        // Reset submission flag
        isSubmitting = false;
        
        // Clear any previous messages
        const messageDiv = document.getElementById('modalMessageDiv');
        if (messageDiv) messageDiv.classList.add('hidden');
    }
}