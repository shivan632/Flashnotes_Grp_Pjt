// Footer Component

export function Footer() {
    const currentYear = new Date().getFullYear();
    
    return `
        <footer class="bg-[#1F2937] border-t border-[#374151] py-8">
            <div class="container mx-auto px-4">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <!-- Brand Section -->
                    <div class="col-span-1 md:col-span-1">
                        <h3 class="text-xl font-bold text-[#3B82F6] mb-4">Flashnotes</h3>
                        <p class="text-[#9CA3AF] text-sm">
                            Your AI-powered learning companion. Generate questions and answers instantly.
                        </p>
                    </div>
                    
                    <!-- Quick Links -->
                    <div>
                        <h4 class="text-[#E5E7EB] font-semibold mb-4">Quick Links</h4>
                        <ul class="space-y-2">
                            <li><a href="#/" class="text-[#9CA3AF] hover:text-[#3B82F6] transition-colors text-sm">Home</a></li>
                            <li><a href="#/dashboard" class="text-[#9CA3AF] hover:text-[#3B82F6] transition-colors text-sm">Dashboard</a></li>
                            <li><a href="#/history" class="text-[#9CA3AF] hover:text-[#3B82F6] transition-colors text-sm">History</a></li>
                        </ul>
                    </div>
                    
                    <!-- Support -->
                    <div>
                        <h4 class="text-[#E5E7EB] font-semibold mb-4">Support</h4>
                        <ul class="space-y-2">
                            <li><a href="#" class="text-[#9CA3AF] hover:text-[#3B82F6] transition-colors text-sm">FAQ</a></li>
                            <li><a href="#" class="text-[#9CA3AF] hover:text-[#3B82F6] transition-colors text-sm">Privacy Policy</a></li>
                            <li><a href="#" class="text-[#9CA3AF] hover:text-[#3B82F6] transition-colors text-sm">Terms of Service</a></li>
                        </ul>
                    </div>
                    
                    <!-- Connect -->
                    <div>
                        <h4 class="text-[#E5E7EB] font-semibold mb-4">Connect</h4>
                        <div class="flex space-x-4">
                            <a href="#" class="text-[#9CA3AF] hover:text-[#3B82F6] transition-colors">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                            </a>
                            <a href="#" class="text-[#9CA3AF] hover:text-[#3B82F6] transition-colors">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.104c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0021.533-3.668 13.5 13.5 0 001.277-5.556c0-.207 0-.414-.015-.62A9.935 9.935 0 0024 4.59z"/>
                                </svg>
                            </a>
                            <a href="#" class="text-[#9CA3AF] hover:text-[#3B82F6] transition-colors">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
                
                <!-- Copyright -->
                <div class="border-t border-[#374151] mt-8 pt-6 text-center">
                    <p class="text-[#9CA3AF] text-sm">
                        © ${currentYear} Flashnotes. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    `;
}