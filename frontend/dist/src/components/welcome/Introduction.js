// frontend/src/components/welcome/Introduction.js

export function Introduction() {
    return `
        <section class="py-20 bg-[#111827]">
            <div class="container mx-auto px-4">
                <div class="max-w-4xl mx-auto">
                    <div class="text-center mb-12">
                        <h2 class="text-4xl font-bold text-[#3B82F6] mb-4">Welcome to Flashnotes</h2>
                        <div class="w-24 h-1 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] mx-auto"></div>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <!-- Left Column - Video/Image Placeholder -->
                        <div class="relative">
                            <div class="bg-[#1F2937] rounded-2xl p-8 shadow-2xl">
                                <div class="aspect-video bg-gradient-to-br from-[#3B82F6]/20 to-[#A78BFA]/20 rounded-lg flex items-center justify-center">
                                    <svg class="w-20 h-20 text-[#3B82F6] opacity-50" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
                                    </svg>
                                </div>
                                <p class="text-[#9CA3AF] text-sm text-center mt-4">Interactive Learning Dashboard</p>
                            </div>
                            
                            <!-- Floating Stats -->
                            <div class="absolute -top-4 -right-4 bg-[#3B82F6] text-white p-3 rounded-lg shadow-xl">
                                <div class="text-2xl font-bold">99%</div>
                                <div class="text-xs">Satisfaction</div>
                            </div>
                        </div>
                        
                        <!-- Right Column - Text Content -->
                        <div class="space-y-6">
                            <div class="flex items-start gap-4">
                                <div class="bg-[#3B82F6] rounded-full p-2 flex-shrink-0">
                                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h3 class="text-xl font-semibold text-[#E5E7EB] mb-1">Smart Learning</h3>
                                    <p class="text-[#9CA3AF]">Our AI analyzes your topics and generates the most relevant questions and answers to enhance your understanding.</p>
                                </div>
                            </div>
                            
                            <div class="flex items-start gap-4">
                                <div class="bg-[#3B82F6] rounded-full p-2 flex-shrink-0">
                                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h3 class="text-xl font-semibold text-[#E5E7EB] mb-1">Personalized Experience</h3>
                                    <p class="text-[#9CA3AF]">Save your favorite Q&As, track your learning history, and get personalized recommendations based on your interests.</p>
                                </div>
                            </div>
                            
                            <div class="flex items-start gap-4">
                                <div class="bg-[#3B82F6] rounded-full p-2 flex-shrink-0">
                                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h3 class="text-xl font-semibold text-[#E5E7EB] mb-1">Track Progress</h3>
                                    <p class="text-[#9CA3AF]">Monitor your learning journey with detailed history and analytics. See how your knowledge grows over time.</p>
                                </div>
                            </div>
                            
                            <div class="mt-8">
                                <a href="#/register" 
                                   class="inline-block bg-[#3B82F6] hover:bg-[#60A5FA] text-white px-6 py-3 rounded-lg transition-all transform hover:scale-105 font-semibold">
                                    Start Learning Now →
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
}