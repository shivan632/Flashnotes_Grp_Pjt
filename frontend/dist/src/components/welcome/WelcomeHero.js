// frontend/src/components/welcome/WelcomeHero.js

export function WelcomeHero() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    return `
        <section class="min-h-screen animated-bg flex items-center justify-center relative overflow-hidden">
            <!-- Animated background elements -->
            <div class="absolute inset-0 overflow-hidden">
                <div class="absolute -top-40 -right-40 w-80 h-80 bg-[#3B82F6] rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
                <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-[#A78BFA] rounded-full filter blur-3xl opacity-20 animate-pulse" style="animation-delay: 1s;"></div>
            </div>
            
            <div class="container mx-auto px-4 relative z-10">
                <div class="max-w-4xl mx-auto text-center">
                    <!-- Logo Animation -->
                    <div class="mb-8 animate-bounce">
                        <div class="w-28 h-28 mx-auto bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300">
                            <span class="text-white text-5xl font-bold">F</span>
                        </div>
                    </div>
                    
                    <!-- Main Heading with Gradient -->
                    <h1 class="text-6xl md:text-7xl font-bold mb-6">
                        <span class="bg-gradient-to-r from-[#3B82F6] via-[#60A5FA] to-[#A78BFA] bg-clip-text text-transparent">
                            Flashnotes
                        </span>
                    </h1>
                    
                    <p class="text-2xl text-[#60A5FA] mb-6 font-light">Your AI-Powered Learning Companion</p>
                    
                    <p class="text-xl text-[#E5E7EB] mb-12 max-w-2xl mx-auto leading-relaxed">
                        Transform the way you learn. Generate instant questions and answers for any topic, 
                        save your favorites, and track your progress - all powered by cutting-edge AI.
                    </p>
                    
                    <!-- CTA Buttons -->
                    <div class="flex flex-col sm:flex-row gap-4 justify-center">
                        ${!isAuthenticated ? `
                            <a href="#/register" 
                               class="group bg-[#3B82F6] hover:bg-[#60A5FA] text-white px-8 py-4 rounded-lg transition-all transform hover:scale-105 shadow-lg text-lg font-semibold flex items-center justify-center gap-2">
                                <span>Get Started Free</span>
                                <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                                </svg>
                            </a>
                            <a href="#/login" 
                               class="border-2 border-[#3B82F6] text-[white] hover:bg-[#3B82F6] hover:text-white px-8 py-4 rounded-lg transition-all text-lg font-semibold">
                                Sign In
                            </a>
                        ` : `
                            <a href="#/dashboard" 
                               class="bg-[#3B82F6] hover:bg-[#60A5FA] text-white px-8 py-4 rounded-lg transition-all transform hover:scale-105 shadow-lg text-lg font-semibold">
                                Go to Dashboard
                            </a>
                        `}
                    </div>
                    
                    <!-- Stats Bar -->
                    <div class="mt-16 pt-8 border-t border-[#374151]">
                        <div class="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <div class="text-2xl font-bold text-[#3B82F6]">10K+</div>
                                <div class="text-sm text-[#9CA3AF]">Active Learners</div>
                            </div>
                            <div>
                                <div class="text-2xl font-bold text-[#3B82F6]">50K+</div>
                                <div class="text-sm text-[#9CA3AF]">Q&A Generated</div>
                            </div>
                            <div>
                                <div class="text-2xl font-bold text-[#3B82F6]">100+</div>
                                <div class="text-sm text-[#9CA3AF]">Topics</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Scroll Indicator -->
            <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                <div class="w-6 h-10 border-2 border-[#3B82F6] rounded-full flex justify-center">
                    <div class="w-1 h-3 bg-[#3B82F6] rounded-full mt-2 animate-pulse"></div>
                </div>
            </div>
        </section>
    `;
}