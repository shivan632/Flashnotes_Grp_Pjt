// frontend/src/pages/WelcomePage.js
import { Navbar } from '../components/layout/Navbar.js';
import { Footer } from '../components/common/Footer.js';
import { WelcomeHero } from '../components/welcome/WelcomeHero.js';
import { FeaturesSection } from '../components/welcome/FeaturesSection.js';
import { Introduction } from '../components/welcome/Introduction.js';
import { FutureVision } from '../components/welcome/FutureVision.js';
import { FeedbackList, setupFeedbackList } from '../components/feedback/FeedbackList.js';

export function WelcomePage() {
    return `
        <div class="min-h-screen flex flex-col">
            ${Navbar()}
            ${WelcomeHero()}
            ${Introduction()}
            ${FeaturesSection()}
            
            <!-- Feedback Section - Full Width with Larger Text -->
            <section class="py-20 bg-gradient-to-b from-[#111827] to-[#0F172A] w-full">
                <div class="w-full px-4 sm:px-6 lg:px-8">
                    <div class="text-center mb-12">
                        <div class="inline-flex items-center gap-2 px-3 py-1 bg-[#3B82F6]/20 rounded-full mb-4">
                            <svg class="w-4 h-4 text-[#3B82F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                            </svg>
                            <span class="text-sm text-[#3B82F6] font-medium">Your Voice Matters</span>
                        </div>
                        <h2 class="text-4xl font-bold text-white mb-4">What Our Users Say</h2>
                        <p class="text-gray-400 max-w-2xl mx-auto">Real feedback from real learners</p>
                    </div>
                    
                    <!-- Full Width Feedback Container -->
                    <div class="w-full">
                        ${FeedbackList()}
                    </div>
                </div>
            </section>
            
            ${FutureVision()}
            ${Footer()}
        </div>
    `;
}

// Setup function for welcome page
export function setupWelcomePage() {
    setupFeedbackList();
}