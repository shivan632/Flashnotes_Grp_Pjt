// frontend/src/components/welcome/FutureVision.js

export function FutureVision() {
    return `
        <section class="py-20 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA]">
            <div class="container mx-auto px-4 text-center">
                <h2 class="text-4xl font-bold text-white mb-6">The Future of Learning</h2>
                <p class="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                    We're building the ultimate AI learning companion. Coming soon: voice input, multiple languages, 
                    collaborative learning, and personalized study plans.
                </p>
                
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8">
                    <div class="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                        <span class="text-3xl block mb-2">🎤</span>
                        <span class="text-white font-semibold">Voice Input</span>
                        <p class="text-white/70 text-xs mt-1">Ask questions naturally</p>
                    </div>
                    <div class="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                        <span class="text-3xl block mb-2">🌐</span>
                        <span class="text-white font-semibold">10+ Languages</span>
                        <p class="text-white/70 text-xs mt-1">Learn in your language</p>
                    </div>
                    <div class="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                        <span class="text-3xl block mb-2">👥</span>
                        <span class="text-white font-semibold">Collaborative</span>
                        <p class="text-white/70 text-xs mt-1">Study with friends</p>
                    </div>
                    <div class="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                        <span class="text-3xl block mb-2">📊</span>
                        <span class="text-white font-semibold">Smart Analytics</span>
                        <p class="text-white/70 text-xs mt-1">Track your progress</p>
                    </div>
                </div>
                
                <div class="flex gap-4 justify-center">
                    <a href="#/register" 
                       class="bg-white text-[#3B82F6] px-8 py-4 rounded-lg font-semibold hover:shadow-xl transition-all transform hover:scale-105">
                        Join the Waitlist
                    </a>
                    <a href="#features" 
                       class="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-[#3B82F6] transition-all">
                        Learn More
                    </a>
                </div>
                
                <!-- Stats Preview -->
                <div class="mt-12 pt-8 border-t border-white/20">
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-white">
                        <div>
                            <div class="text-3xl font-bold">10K+</div>
                            <div class="text-white/80 text-sm">Active Users</div>
                        </div>
                        <div>
                            <div class="text-3xl font-bold">50K+</div>
                            <div class="text-white/80 text-sm">Questions Generated</div>
                        </div>
                        <div>
                            <div class="text-3xl font-bold">100+</div>
                            <div class="text-white/80 text-sm">Topics Covered</div>
                        </div>
                        <div>
                            <div class="text-3xl font-bold">4.8</div>
                            <div class="text-white/80 text-sm">User Rating</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
}