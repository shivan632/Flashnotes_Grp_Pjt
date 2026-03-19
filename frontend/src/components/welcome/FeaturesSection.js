// frontend/src/components/welcome/FeaturesSection.js

export function FeaturesSection() {
    return `
        <section id="features" class="bg-[#1F2937] py-20">
            <div class="container mx-auto px-4">
                <h2 class="text-4xl font-bold text-center mb-12 text-[#3B82F6]">Why Choose Flashnotes?</h2>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <!-- Feature 1: AI-Powered -->
                    <div class="text-center p-6 hover:transform hover:scale-105 transition-transform">
                        <div class="w-16 h-16 bg-[#3B82F6] rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                            </svg>
                        </div>
                        <h3 class="text-xl font-bold text-[#E5E7EB] mb-2">AI-Powered</h3>
                        <p class="text-[#9CA3AF]">Get intelligent questions and answers generated instantly for any topic using advanced AI.</p>
                    </div>
                    
                    <!-- Feature 2: Save & Organize -->
                    <div class="text-center p-6 hover:transform hover:scale-105 transition-transform">
                        <div class="w-16 h-16 bg-[#3B82F6] rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                            </svg>
                        </div>
                        <h3 class="text-xl font-bold text-[#E5E7EB] mb-2">Save & Organize</h3>
                        <p class="text-[#9CA3AF]">Store your favorite Q&A pairs and access them anytime, anywhere across all devices.</p>
                    </div>
                    
                    <!-- Feature 3: Track Progress -->
                    <div class="text-center p-6 hover:transform hover:scale-105 transition-transform">
                        <div class="w-16 h-16 bg-[#3B82F6] rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <h3 class="text-xl font-bold text-[#E5E7EB] mb-2">Track History</h3>
                        <p class="text-[#9CA3AF]">Never lose your learning trail with automatic search history tracking and progress monitoring.</p>
                    </div>
                </div>
                
                <!-- How It Works (Additional) -->
                <div class="mt-20">
                    <h3 class="text-3xl font-bold text-center mb-10 text-[#3B82F6]">How It Works</h3>
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div class="text-center">
                            <div class="w-12 h-12 bg-[#3B82F6] rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold text-white">1</div>
                            <h4 class="font-bold text-[#E5E7EB] mb-2">Enter Topic</h4>
                            <p class="text-[#9CA3AF] text-sm">Type any subject you want to learn about</p>
                        </div>
                        <div class="text-center">
                            <div class="w-12 h-12 bg-[#3B82F6] rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold text-white">2</div>
                            <h4 class="font-bold text-[#E5E7EB] mb-2">AI Generates</h4>
                            <p class="text-[#9CA3AF] text-sm">Our AI creates relevant questions and answers</p>
                        </div>
                        <div class="text-center">
                            <div class="w-12 h-12 bg-[#3B82F6] rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold text-white">3</div>
                            <h4 class="font-bold text-[#E5E7EB] mb-2">Save & Review</h4>
                            <p class="text-[#9CA3AF] text-sm">Save important Q&As for later review</p>
                        </div>
                        <div class="text-center">
                            <div class="w-12 h-12 bg-[#3B82F6] rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold text-white">4</div>
                            <h4 class="font-bold text-[#E5E7EB] mb-2">Track Progress</h4>
                            <p class="text-[#9CA3AF] text-sm">Monitor your learning journey over time</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
}