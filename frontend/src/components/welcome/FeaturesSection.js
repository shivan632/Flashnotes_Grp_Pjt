// frontend/src/components/welcome/FeaturesSection.js
// Features Section Component - Enhanced UI with modern design

export function FeaturesSection() {
    const features = [
        {
            icon: '⚡',
            title: 'AI-Powered',
            description: 'Get intelligent questions and answers generated instantly for any topic using advanced AI technology.',
            gradient: 'from-[#3B82F6] to-[#60A5FA]'
        },
        {
            icon: '💾',
            title: 'Save & Organize',
            description: 'Store your favorite Q&A pairs and access them anytime, anywhere across all your devices.',
            gradient: 'from-[#A78BFA] to-[#8B5CF6]'
        },
        {
            icon: '📈',
            title: 'Track Progress',
            description: 'Never lose your learning trail with automatic search history tracking and progress monitoring.',
            gradient: 'from-[#10B981] to-[#34D399]'
        },
        {
            icon: '🤖',
            title: 'AI Assistant',
            description: 'Chat with our AI assistant to get detailed explanations and personalized learning support.',
            gradient: 'from-[#F59E0B] to-[#FBBF24]'
        },
        {
            icon: '📱',
            title: 'Cross-Platform',
            description: 'Access your notes and quizzes on any device - desktop, tablet, or mobile.',
            gradient: 'from-[#EF4444] to-[#F87171]'
        },
        {
            icon: '🎯',
            title: 'Smart Quizzes',
            description: 'Test your knowledge with AI-generated quizzes tailored to your learning needs.',
            gradient: 'from-[#EC4899] to-[#F472B6]'
        }
    ];
    
    const steps = [
        {
            number: '01',
            title: 'Enter Topic',
            description: 'Type any subject you want to learn about',
            icon: '⌨️'
        },
        {
            number: '02',
            title: 'AI Generates',
            description: 'Our AI creates relevant questions and answers',
            icon: '🤖'
        },
        {
            number: '03',
            title: 'Save & Review',
            description: 'Save important Q&As for later review',
            icon: '💾'
        },
        {
            number: '04',
            title: 'Track Progress',
            description: 'Monitor your learning journey over time',
            icon: '📊'
        }
    ];
    
    const stats = [
        { value: '10K+', label: 'Active Users', icon: '👥' },
        { value: '50K+', label: 'Questions Generated', icon: '❓' },
        { value: '100+', label: 'Topics Covered', icon: '📚' },
        { value: '4.8', label: 'User Rating', icon: '⭐' }
    ];
    
    return `
        <section id="features" class="relative bg-gradient-to-b from-[#1F2937] to-[#111827] py-24 overflow-hidden">
            <!-- Background Pattern -->
            <div class="absolute inset-0 opacity-5">
                <div class="absolute top-0 left-0 w-64 h-64 bg-[#3B82F6] rounded-full filter blur-3xl"></div>
                <div class="absolute bottom-0 right-0 w-96 h-96 bg-[#A78BFA] rounded-full filter blur-3xl"></div>
            </div>
            
            <div class="container mx-auto px-4 relative z-10">
                <!-- Section Header -->
                <div class="text-center mb-16 animate-fadeInUp">
                    <div class="inline-flex items-center gap-2 px-4 py-2 bg-[#3B82F6]/10 rounded-full mb-4">
                        <span class="w-2 h-2 bg-[#3B82F6] rounded-full animate-pulse"></span>
                        <span class="text-sm text-[#60A5FA] font-medium">Why Choose Us</span>
                    </div>
                    <h2 class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent mb-4">
                        Why Choose Flashnotes?
                    </h2>
                    <p class="text-[#9CA3AF] max-w-2xl mx-auto">
                        Experience the future of learning with our AI-powered platform
                    </p>
                </div>
                
                <!-- Features Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
                    ${features.map((feature, index) => `
                        <div class="group relative bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-6 border border-[#374151] hover:border-[#3B82F6] transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#3B82F6]/10 animate-fadeInUp" style="animation-delay: ${index * 0.1}s">
                            <!-- Glow Effect -->
                            <div class="absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300"></div>
                            
                            <!-- Icon -->
                            <div class="relative w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                <span class="text-2xl">${feature.icon}</span>
                            </div>
                            
                            <!-- Content -->
                            <h3 class="text-xl font-bold text-[#E5E7EB] mb-3 group-hover:text-[#3B82F6] transition-colors">
                                ${feature.title}
                            </h3>
                            <p class="text-[#9CA3AF] leading-relaxed">
                                ${feature.description}
                            </p>
                            
                            <!-- Learn More Link -->
                            <div class="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <a href="#features" class="text-sm text-[#60A5FA] hover:text-[#3B82F6] inline-flex items-center gap-1">
                                    Learn more 
                                    <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                                    </svg>
                                </a>
                            </div>
                            
                            <!-- Hover Border Animation -->
                            <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${feature.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                        </div>
                    `).join('')}
                </div>
                
                <!-- How It Works Section -->
                <div class="mb-24">
                    <div class="text-center mb-12">
                        <div class="inline-flex items-center gap-2 px-4 py-2 bg-[#3B82F6]/10 rounded-full mb-4">
                            <span class="w-2 h-2 bg-[#3B82F6] rounded-full animate-pulse"></span>
                            <span class="text-sm text-[#60A5FA] font-medium">Simple Process</span>
                        </div>
                        <h3 class="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">
                            How It Works
                        </h3>
                        <p class="text-[#9CA3AF] mt-2">Get started in just 4 simple steps</p>
                    </div>
                    
                    <div class="relative">
                        <!-- Connecting Line (Desktop) -->
                        <div class="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] transform -translate-y-1/2"></div>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                            ${steps.map((step, index) => `
                                <div class="group relative bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-6 text-center border border-[#374151] hover:border-[#3B82F6] transition-all duration-300 hover:-translate-y-2 animate-fadeInUp" style="animation-delay: ${index * 0.1 + 0.3}s">
                                    <!-- Step Number -->
                                    <div class="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                                        ${index + 1}
                                    </div>
                                    
                                    <!-- Icon -->
                                    <div class="w-16 h-16 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        <span class="text-2xl">${step.icon}</span>
                                    </div>
                                    
                                    <!-- Content -->
                                    <h4 class="font-bold text-[#E5E7EB] mb-2 group-hover:text-[#3B82F6] transition-colors">
                                        ${step.title}
                                    </h4>
                                    <p class="text-[#9CA3AF] text-sm">
                                        ${step.description}
                                    </p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
                
                <!-- Stats Section -->
                <div class="bg-gradient-to-r from-[#1F2937] to-[#111827] rounded-2xl p-8 border border-[#374151]">
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
                        ${stats.map((stat, index) => `
                            <div class="text-center group animate-fadeInUp" style="animation-delay: ${index * 0.1 + 0.6}s">
                                <div class="w-12 h-12 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                                    <span class="text-xl">${stat.icon}</span>
                                </div>
                                <div class="text-3xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent group-hover:scale-105 transition-transform">
                                    ${stat.value}
                                </div>
                                <div class="text-sm text-[#9CA3AF] mt-1">${stat.label}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Call to Action -->
                <div class="mt-16 text-center">
                    <a href="#/register" 
                       class="inline-flex items-center gap-2 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] hover:from-[#60A5FA] hover:to-[#8B5CF6] text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl group">
                        <span>Start Learning Now</span>
                        <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    `;
}

// Add CSS animations
const featuresStyles = `
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
    
    .animate-fadeInUp {
        animation: fadeInUp 0.6s ease-out forwards;
        opacity: 0;
    }
    
    .feature-card {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
`;

if (!document.querySelector('#features-styles')) {
    const style = document.createElement('style');
    style.id = 'features-styles';
    style.textContent = featuresStyles;
    document.head.appendChild(style);
}