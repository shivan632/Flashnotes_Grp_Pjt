// frontend/src/components/welcome/FutureVision.js
// Future Vision Section - Enhanced UI with modern design

export function FutureVision() {
    const features = [
        {
            icon: '🎤',
            title: 'Voice Input',
            description: 'Ask questions naturally with voice commands. Simply speak your query and our AI will understand and respond. Perfect for hands-free learning while multitasking. Supports multiple accents and languages for seamless interaction.',
            gradient: 'from-[#3B82F6] to-[#60A5FA]',
            status: 'Coming Soon'
        },
        {
            icon: '👥',
            title: 'Collaborative Learning',
            description: 'Online network where friends share their notes and study together. Create study groups, share resources, collaborate on projects, and learn collectively. Real-time updates keep everyone synchronized.',
            gradient: 'from-[#10B981] to-[#34D399]',
            status: 'Coming Soon'
        },
        {
            icon: '🌍',
            title: 'Global Posts',
            description: 'Share your knowledge with the world - access educational posts from everyone globally. Discover insights from learners worldwide, get diverse perspectives, and contribute your expertise to the global learning community.',
            gradient: 'from-[#F59E0B] to-[#FBBF24]',
            status: 'Coming Soon'
        },
        {
            icon: '🎬',
            title: 'Video Library',
            description: 'Curated video content for better visual learning and understanding. Access thousands of educational videos, tutorials, and lectures. Learn complex topics through visual demonstrations and expert explanations.',
            gradient: 'from-[#EF4444] to-[#F87171]',
            status: 'Coming Soon'
        },
        {
            icon: '🪙',
            title: 'Coin System',
            description: 'Earn coins by sharing notes, exchange for downloading other users\' premium notes. Build your reputation, unlock exclusive content, and create a thriving knowledge economy within our learning community.',
            gradient: 'from-[#A78BFA] to-[#C084FC]',
            status: 'Coming Soon'
        },
        {
            icon: '📞',
            title: 'FlashConnect',
            description: 'Video calls, voice calls, and real-time messaging - learn together like WhatsApp. Connect instantly with study partners, host virtual study sessions, share screens, and collaborate in real-time with crystal clear audio and video.',
            gradient: 'from-[#EC4899] to-[#F472B6]',
            status: 'Coming Soon'
        }
    ];
    
    return `
        <section class="relative py-24 overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A]">
            <!-- Animated Background Elements -->
            <div class="absolute inset-0 overflow-hidden">
                <div class="absolute top-0 left-0 w-96 h-96 bg-[#3B82F6] rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
                <div class="absolute bottom-0 right-0 w-96 h-96 bg-[#A78BFA] rounded-full filter blur-3xl opacity-20 animate-pulse" style="animation-delay: 1s"></div>
                <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full filter blur-3xl opacity-10 animate-spin-slow"></div>
            </div>
            
            <div class="container mx-auto px-4 relative z-10">
                <!-- Section Header -->
                <div class="text-center mb-12 animate-fadeInUp">
                    <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-4 backdrop-blur-sm">
                        <span class="w-2 h-2 bg-[#3B82F6] rounded-full animate-pulse"></span>
                        <span class="text-sm text-white/80 font-medium">Coming Soon</span>
                    </div>
                    <h2 class="text-4xl md:text-5xl font-bold text-white mb-4">
                        The Future of Learning
                    </h2>
                    <p class="text-xl text-white/80 max-w-2xl mx-auto">
                        We're building the ultimate AI learning companion with cutting-edge features
                    </p>
                </div>
                
                <!-- Features Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    ${features.map((feature, index) => `
                        <div class="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-[#3B82F6] transition-all duration-300 hover:-translate-y-2 animate-fadeInUp" style="animation-delay: ${index * 0.1}s">
                            <!-- Glow Effect -->
                            <div class="absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300"></div>
                            
                            <!-- Icon -->
                            <div class="relative w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                <span class="text-3xl">${feature.icon}</span>
                            </div>
                            
                            <!-- Content -->
                            <h3 class="text-xl font-bold text-white mb-2 group-hover:text-[#3B82F6] transition-colors">
                                ${feature.title}
                            </h3>
                            <p class="text-white/60">
                                ${feature.description}
                            </p>
                            
                            <!-- Coming Soon Badge -->
                            <div class="mt-4">
                                <span class="text-xs px-2 py-1 bg-white/10 rounded-full text-white/50">${feature.status}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <!-- Timeline Preview -->
                <div class="bg-white/5 backdrop-blur-sm rounded-2xl p-8 mb-16 border border-white/10">
                    <h3 class="text-2xl font-bold text-white text-center mb-8">Our Roadmap</h3>
                    <div class="relative">
                        <!-- Timeline Line -->
                        <div class="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-[#3B82F6] to-[#A78BFA] hidden md:block"></div>
                        
                        <div class="space-y-8">
                            <div class="flex flex-col md:flex-row items-center gap-6 animate-fadeInUp" style="animation-delay: 0.4s">
                                <div class="md:w-1/2 text-right md:pr-8">
                                    <div class="bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] inline-block px-4 py-1 rounded-full text-white text-sm font-semibold mb-2">Q3 2024</div>
                                    <h4 class="text-xl font-bold text-white">Voice Input</h4>
                                    <p class="text-white/60">Natural voice commands for hands-free learning</p>
                                </div>
                                <div class="md:w-1/2 md:pl-8">
                                    <div class="w-4 h-4 bg-[#3B82F6] rounded-full border-2 border-white"></div>
                                </div>
                            </div>
                            
                            <div class="flex flex-col md:flex-row items-center gap-6 animate-fadeInUp" style="animation-delay: 0.5s">
                                <div class="md:w-1/2 text-right md:pr-8">
                                    <div class="bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] inline-block px-4 py-1 rounded-full text-white text-sm font-semibold mb-2">Q4 2024</div>
                                    <h4 class="text-xl font-bold text-white">Collaborative Learning</h4>
                                    <p class="text-white/60">Online network where friends share their notes</p>
                                </div>
                                <div class="md:w-1/2 md:pl-8">
                                    <div class="w-4 h-4 bg-[#3B82F6] rounded-full border-2 border-white"></div>
                                </div>
                            </div>
                            
                            <div class="flex flex-col md:flex-row items-center gap-6 animate-fadeInUp" style="animation-delay: 0.6s">
                                <div class="md:w-1/2 text-right md:pr-8">
                                    <div class="bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] inline-block px-4 py-1 rounded-full text-white text-sm font-semibold mb-2">Q1 2025</div>
                                    <h4 class="text-xl font-bold text-white">Global Posts & Video Library</h4>
                                    <p class="text-white/60">Worldwide knowledge sharing and curated video content</p>
                                </div>
                                <div class="md:w-1/2 md:pl-8">
                                    <div class="w-4 h-4 bg-[#3B82F6] rounded-full border-2 border-white"></div>
                                </div>
                            </div>
                            
                            <div class="flex flex-col md:flex-row items-center gap-6 animate-fadeInUp" style="animation-delay: 0.7s">
                                <div class="md:w-1/2 text-right md:pr-8">
                                    <div class="bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] inline-block px-4 py-1 rounded-full text-white text-sm font-semibold mb-2">Q2 2025</div>
                                    <h4 class="text-xl font-bold text-white">Coin System & FlashConnect</h4>
                                    <p class="text-white/60">Earn coins, exchange notes, video/voice calls & messaging</p>
                                </div>
                                <div class="md:w-1/2 md:pl-8">
                                    <div class="w-4 h-4 bg-[#3B82F6] rounded-full border-2 border-white"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Feature Highlight Cards -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                    <!-- Coin System Highlight -->
                    <div class="bg-gradient-to-br from-[#1E293B] to-[#0F172A] rounded-2xl p-6 border border-[#A78BFA]/30 hover:border-[#A78BFA] transition-all duration-300">
                        <div class="flex items-center gap-4 mb-4">
                            <div class="w-14 h-14 bg-gradient-to-r from-[#A78BFA] to-[#C084FC] rounded-xl flex items-center justify-center">
                                <span class="text-2xl">🪙</span>
                            </div>
                            <div>
                                <h3 class="text-xl font-bold text-white">Coin System Explained</h3>
                                <p class="text-white/60 text-sm">How it works</p>
                            </div>
                        </div>
                        <div class="space-y-3">
                            <div class="flex items-center gap-3 text-white/70">
                                <span class="w-2 h-2 bg-[#A78BFA] rounded-full"></span>
                                <span>📝 Share notes → Earn coins</span>
                            </div>
                            <div class="flex items-center gap-3 text-white/70">
                                <span class="w-2 h-2 bg-[#A78BFA] rounded-full"></span>
                                <span>🪙 Spend coins → Download premium notes</span>
                            </div>
                            <div class="flex items-center gap-3 text-white/70">
                                <span class="w-2 h-2 bg-[#A78BFA] rounded-full"></span>
                                <span>🏆 Top contributors → Bonus coins & badges</span>
                            </div>
                            <div class="flex items-center gap-3 text-white/70">
                                <span class="w-2 h-2 bg-[#A78BFA] rounded-full"></span>
                                <span>🎁 Daily login rewards → Free coins</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- FlashConnect Highlight -->
                    <div class="bg-gradient-to-br from-[#1E293B] to-[#0F172A] rounded-2xl p-6 border border-[#EC4899]/30 hover:border-[#EC4899] transition-all duration-300">
                        <div class="flex items-center gap-4 mb-4">
                            <div class="w-14 h-14 bg-gradient-to-r from-[#EC4899] to-[#F472B6] rounded-xl flex items-center justify-center">
                                <span class="text-2xl">📞</span>
                            </div>
                            <div>
                                <h3 class="text-xl font-bold text-white">FlashConnect</h3>
                                <p class="text-white/60 text-sm">Real-time communication</p>
                            </div>
                        </div>
                        <div class="space-y-3">
                            <div class="flex items-center gap-3 text-white/70">
                                <span class="w-2 h-2 bg-[#EC4899] rounded-full"></span>
                                <span>🎥 Video Calls - Face-to-face learning sessions</span>
                            </div>
                            <div class="flex items-center gap-3 text-white/70">
                                <span class="w-2 h-2 bg-[#EC4899] rounded-full"></span>
                                <span>🎙️ Voice Calls - Study together remotely</span>
                            </div>
                            <div class="flex items-center gap-3 text-white/70">
                                <span class="w-2 h-2 bg-[#EC4899] rounded-full"></span>
                                <span>💬 Real-time Messaging - Instant doubt solving</span>
                            </div>
                            <div class="flex items-center gap-3 text-white/70">
                                <span class="w-2 h-2 bg-[#EC4899] rounded-full"></span>
                                <span>👥 Group Chats - Study groups and communities</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Call to Action -->
                <div class="text-center">
                    <div class="inline-flex flex-col sm:flex-row gap-4">
                        <a href="#/register" 
                           class="group relative overflow-hidden bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] hover:from-[#60A5FA] hover:to-[#8B5CF6] text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl">
                            <span class="relative z-10 flex items-center gap-2">
                                Join the Waitlist
                                <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                                </svg>
                            </span>
                            <div class="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </a>
                        <a href="#features" 
                           class="group relative overflow-hidden border-2 border-white/30 hover:border-white text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105">
                            <span class="relative z-10 flex items-center gap-2">
                                Learn More
                                <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                                </svg>
                            </span>
                        </a>
                    </div>
                </div>
                
                <!-- Stats Preview -->
                <div class="mt-16 pt-8 border-t border-white/10">
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div class="text-center group animate-fadeInUp" style="animation-delay: 0.8s">
                            <div class="text-3xl font-bold text-white group-hover:scale-110 transition-transform inline-block">
                                10K+
                            </div>
                            <div class="text-white/60 text-sm mt-1">Active Users</div>
                        </div>
                        <div class="text-center group animate-fadeInUp" style="animation-delay: 0.9s">
                            <div class="text-3xl font-bold text-white group-hover:scale-110 transition-transform inline-block">
                                50K+
                            </div>
                            <div class="text-white/60 text-sm mt-1">Questions Generated</div>
                        </div>
                        <div class="text-center group animate-fadeInUp" style="animation-delay: 1s">
                            <div class="text-3xl font-bold text-white group-hover:scale-110 transition-transform inline-block">
                                100+
                            </div>
                            <div class="text-white/60 text-sm mt-1">Topics Covered</div>
                        </div>
                        <div class="text-center group animate-fadeInUp" style="animation-delay: 1.1s">
                            <div class="text-3xl font-bold text-white group-hover:scale-110 transition-transform inline-block">
                                4.8
                            </div>
                            <div class="text-white/60 text-sm mt-1">User Rating</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
}

// Add CSS animations
const futureVisionStyles = `
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
    
    .future-vision-card {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
`;

if (!document.querySelector('#future-vision-styles')) {
    const style = document.createElement('style');
    style.id = 'future-vision-styles';
    style.textContent = futureVisionStyles;
    document.head.appendChild(style);
}