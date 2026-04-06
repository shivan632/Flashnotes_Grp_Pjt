// frontend/src/components/welcome/WelcomeHero.js
// Welcome Hero Section - Enhanced UI with modern design + Video Background

export function WelcomeHero() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    return `
        <section class="hero-with-bg relative min-h-screen flex items-center justify-center overflow-hidden">
            <!-- Video Background Layer -->
            <video autoplay muted loop playsinline class="absolute inset-0 w-full h-full object-cover z-0">
                <source src="/public/Intro-Background.mp4" type="video/mp4">
                Your browser does not support the video tag.
            </video>
            
            <!-- Dark Overlay for text readability -->
            <div class="absolute inset-0 bg-black/50 z-10"></div>
            
            <!-- Animated Gradient Background -->
            <div class="absolute inset-0 animated-bg opacity-30 z-0"></div>
            
            <!-- Animated Particles -->
            <div class="absolute inset-0 overflow-hidden z-20">
                <div class="particles-container">
                    ${Array(20).fill(0).map((_, i) => `
                        <div class="absolute rounded-full bg-white/15 animate-float" 
                             style="
                                width: ${Math.random() * 4 + 2}px;
                                height: ${Math.random() * 4 + 2}px;
                                left: ${Math.random() * 100}%;
                                top: ${Math.random() * 100}%;
                                animation-delay: ${Math.random() * 5}s;
                                animation-duration: ${Math.random() * 5 + 3}s;
                             "></div>
                    `).join('')}
                </div>
            </div>
            
            <!-- Gradient Orbs -->
            <div class="absolute inset-0 overflow-hidden z-20">
                <div class="absolute -top-40 -right-40 w-96 h-96 bg-[#3B82F6] rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
                <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-[#A78BFA] rounded-full filter blur-3xl opacity-20 animate-pulse" style="animation-delay: 1s"></div>
                <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full filter blur-3xl opacity-10 animate-spin-slow"></div>
            </div>
            
            <div class="container mx-auto px-4 relative z-30">
                <div class="max-w-5xl mx-auto text-center">
                    <!-- Floating Logo with Animation -->
                    <div class="relative mb-8 group">
                        <div class="absolute inset-0 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                        <div class="relative w-32 h-32 mx-auto bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-500 animate-float-slow">
                            <span class="text-white text-6xl font-bold">F</span>
                        </div>
                        <div class="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full animate-ping"></div>
                    </div>
                    
                    <!-- Main Heading with Typewriter Effect -->
                    <h1 class="text-5xl md:text-7xl lg:text-8xl font-bold mb-6">
                        <span class="bg-gradient-to-r from-[#3B82F6] via-[#60A5FA] to-[#A78BFA] bg-clip-text text-transparent animate-gradient">
                            Flashnotes
                        </span>
                    </h1>
                    
                    <p class="text-xl md:text-2xl text-[#60A5FA] mb-4 font-light animate-fadeInUp">
                        Your AI-Powered Learning Companion
                    </p>
                    
                    <div class="h-1 w-24 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] mx-auto rounded-full mb-8"></div>
                    
                    <p class="text-lg md:text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed animate-fadeInUp" style="animation-delay: 0.2s">
                        Transform the way you learn. Generate instant questions and answers for any topic, 
                        save your favorites, and track your progress - all powered by cutting-edge AI.
                    </p>
                    
                    <!-- CTA Buttons with Hover Effects -->
                    <div class="flex flex-col sm:flex-row gap-5 justify-center animate-fadeInUp" style="animation-delay: 0.4s">
                        ${!isAuthenticated ? `
                            <a href="#/register" 
                               class="group relative overflow-hidden bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] hover:from-[#60A5FA] hover:to-[#8B5CF6] text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl text-lg">
                                <span class="relative z-10 flex items-center justify-center gap-2">
                                    Get Started Free
                                    <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                                    </svg>
                                </span>
                                <div class="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </a>
                            <a href="#/login" 
                               class="group relative overflow-hidden border-2 border-white/30 hover:border-white text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 text-lg">
                                <span class="relative z-10 flex items-center justify-center gap-2">
                                    Sign In
                                    <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14"></path>
                                    </svg>
                                </span>
                            </a>
                        ` : `
                            <a href="#/dashboard" 
                               class="group relative overflow-hidden bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] hover:from-[#60A5FA] hover:to-[#8B5CF6] text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl text-lg">
                                <span class="relative z-10 flex items-center justify-center gap-2">
                                    Go to Dashboard
                                    <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                                    </svg>
                                </span>
                            </a>
                        `}
                    </div>
                    
                    <!-- Stats Bar with Icons -->
                    <div class="mt-20 pt-8 border-t border-white/10 animate-fadeInUp" style="animation-delay: 0.6s">
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-8">
                            <div class="group">
                                <div class="flex items-center justify-center gap-2 mb-2">
                                    <div class="w-10 h-10 bg-gradient-to-r from-[#032151] to-[#378ffb] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                                        </svg>
                                    </div>
                                    <div class="text-3xl font-bold text-[#3B82F6] group-hover:scale-110 transition-transform">10K+</div>
                                </div>
                                <div class="text-sm text-white/70">Active Learners</div>
                            </div>
                            <div class="group">
                                <div class="flex items-center justify-center gap-2 mb-2">
                                    <div class="w-10 h-10 bg-gradient-to-r from-[#032151] to-[#378ffb] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                    </div>
                                    <div class="text-3xl font-bold text-[#3B82F6] group-hover:scale-110 transition-transform">50K+</div>
                                </div>
                                <div class="text-sm text-white/70">Q&A Generated</div>
                            </div>
                            <div class="group">
                                <div class="flex items-center justify-center gap-2 mb-2">
                                    <div class="w-10 h-10 bg-gradient-to-r from-[#032151] to-[#378ffb] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                                        </svg>
                                    </div>
                                    <div class="text-3xl font-bold text-[#3B82F6] group-hover:scale-110 transition-transform">100+</div>
                                </div>
                                <div class="text-sm text-white/70">Topics Covered</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Scroll Indicator with Animation -->
            <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-slow z-30">
                <div class="w-6 h-10 border-2 border-[#3B82F6] rounded-full flex justify-center">
                    <div class="w-1 h-2 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full mt-2 animate-scroll"></div>
                </div>
            </div>
        </section>
    `;
}

// Add CSS animations
const welcomeHeroStyles = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes float {
        0%, 100% {
            transform: translateY(0) translateX(0);
        }
        50% {
            transform: translateY(-20px) translateX(10px);
        }
    }
    
    @keyframes float-slow {
        0%, 100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-15px);
        }
    }
    
    @keyframes spin-slow {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
    
    @keyframes scroll {
        0% {
            transform: translateY(0);
            opacity: 1;
        }
        100% {
            transform: translateY(10px);
            opacity: 0;
        }
    }
    
    @keyframes gradient {
        0%, 100% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
    }
    
    .animate-fadeInUp {
        animation: fadeInUp 0.8s ease-out forwards;
        opacity: 0;
    }
    
    .animate-float {
        animation: float 8s ease-in-out infinite;
    }
    
    .animate-float-slow {
        animation: float-slow 4s ease-in-out infinite;
    }
    
    .animate-spin-slow {
        animation: spin-slow 20s linear infinite;
    }
    
    .animate-scroll {
        animation: scroll 1.5s ease-in-out infinite;
    }
    
    .animate-bounce-slow {
        animation: bounce 2s ease-in-out infinite;
    }
    
    .animate-gradient {
        background-size: 200% 200%;
        animation: gradient 3s ease infinite;
    }
    
    @keyframes bounce {
        0%, 100% {
            transform: translateX(-50%) translateY(0);
        }
        50% {
            transform: translateX(-50%) translateY(-10px);
        }
    }
    
    .particles-container {
        position: absolute;
        inset: 0;
        pointer-events: none;
    }
    
    /* Animated Gradient Background */
    .animated-bg {
        background: linear-gradient(-45deg, #111827, #1F2937, #3B82F6, #A78BFA);
        background-size: 400% 400%;
        animation: gradient 15s ease infinite;
    }
    
    /* Hero section base */
    .hero-with-bg {
        position: relative;
    }
    
    /* Video styling */
    .hero-with-bg video {
        object-fit: cover;
    }
`;

if (!document.querySelector('#welcome-hero-styles')) {
    const style = document.createElement('style');
    style.id = 'welcome-hero-styles';
    style.textContent = welcomeHeroStyles;
    document.head.appendChild(style);
}