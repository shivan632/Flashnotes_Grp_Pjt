// frontend/src/components/welcome/Introduction.js
// Introduction Section - Enhanced UI with modern design

export function Introduction() {
    const features = [
        {
            icon: '🧠',
            title: 'Smart Learning',
            description: 'Our AI analyzes your topics and generates the most relevant questions and answers to enhance your understanding.',
            gradient: 'from-[#3B82F6] to-[#60A5FA]'
        },
        {
            icon: '🎯',
            title: 'Personalized Experience',
            description: 'Save your favorite Q&As, track your learning history, and get personalized recommendations based on your interests.',
            gradient: 'from-[#A78BFA] to-[#8B5CF6]'
        },
        {
            icon: '📈',
            title: 'Track Progress',
            description: 'Monitor your learning journey with detailed history and analytics. See how your knowledge grows over time.',
            gradient: 'from-[#10B981] to-[#34D399]'
        }
    ];
    
    return `
        <section class="relative py-24 overflow-hidden bg-gradient-to-b from-[#111827] to-[#0F172A]">
            <!-- Animated Background Elements -->
            <div class="absolute inset-0 overflow-hidden">
                <div class="absolute top-20 left-10 w-72 h-72 bg-[#3B82F6] rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
                <div class="absolute bottom-20 right-10 w-96 h-96 bg-[#A78BFA] rounded-full filter blur-3xl opacity-10 animate-pulse" style="animation-delay: 1s"></div>
            </div>
            
            <div class="container mx-auto px-4 relative z-10">
                <div class="max-w-6xl mx-auto">
                    <!-- Section Header -->
                    <div class="text-center mb-16 animate-fadeInUp">
                        <div class="inline-flex items-center gap-2 px-4 py-2 bg-[#3B82F6]/10 rounded-full mb-4">
                            <span class="w-2 h-2 bg-[#3B82F6] rounded-full animate-pulse"></span>
                            <span class="text-sm text-[#60A5FA] font-medium">Welcome to the Future</span>
                        </div>
                        <h2 class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent mb-4">
                            Welcome to Flashnotes
                        </h2>
                        <div class="w-24 h-1 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] mx-auto rounded-full"></div>
                        <p class="text-[#9CA3AF] max-w-2xl mx-auto mt-4">
                            Your AI-powered learning companion for the modern age
                        </p>
                    </div>
                    
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <!-- Left Column - Interactive Demo -->
                        <div class="relative group animate-fadeInLeft" style="animation-delay: 0.2s">
                            <div class="relative bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-6 shadow-2xl border border-[#374151] group-hover:border-[#3B82F6] transition-all duration-300">
                                <!-- Animated Border Effect -->
                                <div class="absolute inset-0 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                                
                                <!-- Demo Content -->
                                <div class="relative z-10">
                                    <div class="flex items-center gap-2 mb-4">
                                        <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                                        <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                        <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <div class="flex-1"></div>
                                        <div class="text-xs text-[#9CA3AF]">Flashnotes Demo</div>
                                    </div>
                                    
                                    <div class="bg-[#111827] rounded-xl p-4 mb-4">
                                        <div class="flex items-center gap-2 mb-3">
                                            <div class="w-8 h-8 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-lg flex items-center justify-center">
                                                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                </svg>
                                            </div>
                                            <span class="text-sm font-medium text-[#3B82F6]">AI Assistant</span>
                                        </div>
                                        <div class="flex items-start gap-2">
                                            <div class="w-8 h-8 bg-[#374151] rounded-full flex items-center justify-center flex-shrink-0">
                                                <span class="text-xs text-white">You</span>
                                            </div>
                                            <div class="flex-1 bg-[#1F2937] rounded-lg p-3">
                                                <p class="text-sm text-[#E5E7EB]">What is machine learning?</p>
                                            </div>
                                        </div>
                                        <div class="flex items-start gap-2 mt-3">
                                            <div class="w-8 h-8 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full flex items-center justify-center flex-shrink-0">
                                                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                                                </svg>
                                            </div>
                                            <div class="flex-1 bg-[#1F2937] rounded-lg p-3">
                                                <p class="text-sm text-[#E5E7EB]">Machine learning is a subset of AI that enables systems to learn and improve from experience without being explicitly programmed...</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="flex items-center gap-2">
                                        <input type="text" placeholder="Ask AI anything..." class="flex-1 bg-[#111827] border border-[#374151] rounded-lg px-3 py-2 text-sm text-[#E5E7EB] placeholder:text-[#6B7280] focus:outline-none focus:border-[#3B82F6]">
                                        <button class="bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] text-white px-4 py-2 rounded-lg text-sm hover:scale-105 transition-transform">
                                            Send
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Floating Stats -->
                            <div class="absolute -top-4 -right-4 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] text-white p-4 rounded-xl shadow-2xl animate-float">
                                <div class="text-2xl font-bold">99%</div>
                                <div class="text-xs opacity-90">Satisfaction Rate</div>
                                <div class="mt-1 flex gap-0.5">
                                    <svg class="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                                    <svg class="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                                    <svg class="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                                    <svg class="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                                    <svg class="w-3 h-3 text-yellow-400/50" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                                </div>
                            </div>
                            
                            <!-- Animated Pulse Ring -->
                            <div class="absolute -bottom-2 -left-2 w-20 h-20 bg-[#3B82F6] rounded-full opacity-20 animate-ping"></div>
                        </div>
                        
                        <!-- Right Column - Features List -->
                        <div class="space-y-6">
                            ${features.map((feature, index) => `
                                <div class="group relative bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-6 border border-[#374151] hover:border-[#3B82F6] transition-all duration-300 hover:-translate-x-1 animate-fadeInRight" style="animation-delay: ${0.3 + index * 0.1}s">
                                    <div class="flex items-start gap-4">
                                        <div class="relative">
                                            <div class="absolute inset-0 bg-gradient-to-r ${feature.gradient} rounded-xl blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                                            <div class="relative w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                <span class="text-xl">${feature.icon}</span>
                                            </div>
                                        </div>
                                        <div class="flex-1">
                                            <h3 class="text-xl font-semibold text-[#E5E7EB] mb-2 group-hover:text-[#3B82F6] transition-colors">
                                                ${feature.title}
                                            </h3>
                                            <p class="text-[#9CA3AF] leading-relaxed">
                                                ${feature.description}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <!-- Hover Border Animation -->
                                    <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${feature.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                                </div>
                            `).join('')}
                            
                            <!-- CTA Button -->
                            <div class="mt-8 text-center md:text-left animate-fadeInUp" style="animation-delay: 0.6s">
                                <a href="#/register" 
                                   class="inline-flex items-center gap-2 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] hover:from-[#60A5FA] hover:to-[#8B5CF6] text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg group">
                                    <span>Start Learning Now</span>
                                    <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
}

// Add CSS animations
const introductionStyles = `
    @keyframes fadeInLeft {
        from {
            opacity: 0;
            transform: translateX(-30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes fadeInRight {
        from {
            opacity: 0;
            transform: translateX(30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes float {
        0%, 100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-10px);
        }
    }
    
    .animate-fadeInLeft {
        animation: fadeInLeft 0.6s ease-out forwards;
        opacity: 0;
    }
    
    .animate-fadeInRight {
        animation: fadeInRight 0.6s ease-out forwards;
        opacity: 0;
    }
    
    .animate-float {
        animation: float 3s ease-in-out infinite;
    }
`;

if (!document.querySelector('#introduction-styles')) {
    const style = document.createElement('style');
    style.id = 'introduction-styles';
    style.textContent = introductionStyles;
    document.head.appendChild(style);
}