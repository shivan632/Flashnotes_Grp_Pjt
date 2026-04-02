// frontend/src/components/welcome/FeaturesSection.js
// Features Section Component - Enhanced UI with modern design

export function FeaturesSection() {
    const features = [
        {
            icon: '🤖',
            title: 'AI Question-Answer Generator',
            description: 'Get intelligent questions and answers generated instantly for any topic using advanced AI technology. Simply enter your topic and receive comprehensive Q&A pairs.',
            gradient: 'from-[#3B82F6] to-[#60A5FA]',
            longDescription: 'Powered by Google Gemini AI, our system generates contextual questions and accurate answers. Perfect for exam preparation, self-assessment, and deepening your understanding of any subject.'
        },
        {
            icon: '📝',
            title: 'Quiz for Multiple Subjects',
            description: 'Test your knowledge with AI-generated quizzes tailored to your learning needs. Choose from various subjects and difficulty levels to challenge yourself.',
            gradient: 'from-[#A78BFA] to-[#8B5CF6]',
            longDescription: 'Create custom quizzes on any topic - from programming languages to history, science to mathematics. Track your scores, review mistakes, and improve over time.'
        },
        {
            icon: '📄',
            title: 'PDF Summarizer',
            description: 'Upload any PDF document and get instant AI-powered summaries. Extract key insights, main points, and important information without reading entire documents.',
            gradient: 'from-[#10B981] to-[#34D399]',
            longDescription: 'Save hours of reading time. Our OpenRouter AI analyzes your PDFs and generates concise, structured summaries with key takeaways, bullet points, and quick reference notes.'
        },
        {
            icon: '📓',
            title: 'AI Notes Generator',
            description: 'Generate comprehensive, structured notes on any topic. Get organized content with overview, key concepts, code examples, best practices, and common mistakes.',
            gradient: 'from-[#F59E0B] to-[#FBBF24]',
            longDescription: 'Stop wasting time on manual note-taking. Our AI creates detailed, well-structured notes perfect for studying, teaching, or quick revision. Save, organize, and access anytime.'
        },
        {
            icon: '🗺️',
            title: 'AI Roadmap Generator',
            description: 'Create personalized learning paths and roadmaps for any skill or subject. Step-by-step guidance from beginner to advanced levels.',
            gradient: 'from-[#EF4444] to-[#F87171]',
            longDescription: 'Planning to learn a new skill? Our AI generates custom roadmaps with clear milestones, recommended resources, estimated timelines, and progress tracking.'
        },
        {
            icon: '🔊',
            title: 'AI Voice Speaker',
            description: 'Listen to your notes and study materials with natural AI voice. Perfect for auditory learners and hands-free studying on the go.',
            gradient: 'from-[#EC4899] to-[#F472B6]',
            longDescription: 'Convert any text to speech with multiple voice options. Adjust speed, pitch, and language. Learn while commuting, exercising, or multitasking.'
        }
    ];
    
    const steps = [
        {
            number: '01',
            title: 'Enter Topic / Upload PDF',
            description: 'Type any subject or upload your document',
            icon: '⌨️'
        },
        {
            number: '02',
            title: 'AI Processes',
            description: 'Our AI analyzes and generates content',
            icon: '🤖'
        },
        {
            number: '03',
            title: 'Get Results',
            description: 'Receive notes, quizzes, summaries, or roadmaps',
            icon: '📊'
        },
        {
            number: '04',
            title: 'Save & Share',
            description: 'Save your learning materials for later',
            icon: '💾'
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
            <!-- Animated Background Pattern -->
            <div class="absolute inset-0 opacity-30">
                <div class="absolute top-0 left-0 w-96 h-96 bg-[#3B82F6] rounded-full filter blur-3xl animate-pulse"></div>
                <div class="absolute bottom-0 right-0 w-96 h-96 bg-[#A78BFA] rounded-full filter blur-3xl animate-pulse" style="animation-delay: 1s"></div>
                <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full filter blur-3xl opacity-20 animate-spin-slow"></div>
            </div>
            
            <div class="container mx-auto px-4 relative z-10">
                <!-- Section Header -->
                <div class="text-center mb-16 animate-fadeInUp">
                    <div class="inline-flex items-center gap-2 px-4 py-2 bg-[#3B82F6]/10 rounded-full mb-4 backdrop-blur-sm">
                        <span class="w-2 h-2 bg-[#3B82F6] rounded-full animate-pulse"></span>
                        <span class="text-sm text-[#60A5FA] font-medium">Core Features</span>
                    </div>
                    <h2 class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#3B82F6] via-[#60A5FA] to-[#A78BFA] bg-clip-text text-transparent mb-4">
                        Everything You Need to Learn
                    </h2>
                    <p class="text-[#9CA3AF] max-w-2xl mx-auto text-lg">
                        Six powerful AI tools in one platform - your complete learning companion
                    </p>
                </div>
                
                <!-- Features Grid - 6 Cards -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
                    ${features.map((feature, index) => `
                        <div class="feature-card group relative bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-6 border border-[#374151] hover:border-[#3B82F6] transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#3B82F6]/10 animate-fadeInUp" style="animation-delay: ${index * 0.1}s">
                            <!-- Glow Effect -->
                            <div class="absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300"></div>
                            
                            <!-- Icon with Floating Animation -->
                            <div class="relative w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                                <span class="text-3xl">${feature.icon}</span>
                            </div>
                            
                            <!-- Content -->
                            <h3 class="text-xl font-bold text-[#E5E7EB] mb-3 group-hover:text-[#3B82F6] transition-colors">
                                ${feature.title}
                            </h3>
                            <p class="text-[#9CA3AF] leading-relaxed">
                                ${feature.description}
                            </p>
                            
                            <!-- Tooltip on Hover -->
                            <div class="absolute left-1/2 transform -translate-x-1/2 -top-12 bg-[#1F2937] text-[#E5E7EB] text-xs rounded-lg px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap border border-[#3B82F6] shadow-lg">
                                ${feature.title.split(' ')[0]} ${feature.title.split(' ')[1]}
                            </div>
                            
                            <!-- Hover Border Animation -->
                            <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${feature.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                        </div>
                    `).join('')}
                </div>
                
                <!-- How It Works Section -->
                <div class="mb-24">
                    <div class="text-center mb-12">
                        <div class="inline-flex items-center gap-2 px-4 py-2 bg-[#3B82F6]/10 rounded-full mb-4 backdrop-blur-sm">
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
                        <div class="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-[#3B82F6] via-[#60A5FA] to-[#A78BFA] transform -translate-y-1/2 rounded-full"></div>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                            ${steps.map((step, index) => `
                                <div class="group relative bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-6 text-center border border-[#374151] hover:border-[#3B82F6] transition-all duration-300 hover:-translate-y-2 animate-fadeInUp" style="animation-delay: ${index * 0.1 + 0.3}s">
                                    <!-- Step Number with Pulse Effect -->
                                    <div class="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg animate-pulse">
                                        ${index + 1}
                                    </div>
                                    
                                    <!-- Icon -->
                                    <div class="w-16 h-16 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                                        <span class="text-2xl">${step.icon}</span>
                                    </div>
                                    
                                    <!-- Content -->
                                    <h4 class="font-bold text-[#E5E7EB] mb-2 group-hover:text-[#3B82F6] transition-colors text-lg">
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
                
                <!-- Stats Section with Gradient Border -->
                <div class="bg-gradient-to-r from-[#1F2937] to-[#111827] rounded-2xl p-8 border border-[#374151] hover:border-[#3B82F6] transition-all duration-300 relative overflow-hidden">
                    <!-- Animated Border Glow -->
                    <div class="absolute inset-0 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
                        ${stats.map((stat, index) => `
                            <div class="text-center group animate-fadeInUp" style="animation-delay: ${index * 0.1 + 0.6}s">
                                <div class="w-14 h-14 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                                    <span class="text-2xl">${stat.icon}</span>
                                </div>
                                <div class="text-3xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent group-hover:scale-105 transition-transform">
                                    ${stat.value}
                                </div>
                                <div class="text-sm text-[#9CA3AF] mt-1 font-medium">${stat.label}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Call to Action with Ripple Effect -->
                <div class="mt-16 text-center">
                    <a href="#/register" 
                       class="group relative overflow-hidden inline-flex items-center gap-2 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] hover:from-[#60A5FA] hover:to-[#8B5CF6] text-white px-10 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg">
                        <span class="relative z-10">✨ Start Learning Now ✨</span>
                        <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                        </svg>
                        <!-- Ripple Effect -->
                        <span class="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
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
    
    @keyframes spin-slow {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
    
    .animate-fadeInUp {
        animation: fadeInUp 0.6s ease-out forwards;
        opacity: 0;
    }
    
    .animate-spin-slow {
        animation: spin-slow 20s linear infinite;
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