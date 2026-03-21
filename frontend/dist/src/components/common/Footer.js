// frontend/src/components/common/Footer.js
// Footer Component - Enhanced with animations and modern design

export function Footer() {
    const currentYear = new Date().getFullYear();
    
    return `
        <footer class="bg-gradient-to-b from-[#1F2937] to-[#111827] border-t border-[#374151] py-12 mt-auto">
            <div class="container mx-auto px-4 sm:px-6 lg:px-8">
                <!-- Main Footer Content -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    
                    <!-- Brand Section -->
                    <div class="col-span-1 space-y-4">
                        <div class="flex items-center space-x-2">
                            <div class="w-10 h-10 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
                                <span class="text-white font-bold text-xl">F</span>
                            </div>
                            <span class="text-2xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">
                                Flashnotes
                            </span>
                        </div>
                        <p class="text-[#9CA3AF] text-sm leading-relaxed">
                            Your AI-powered learning companion. Generate questions and answers instantly, save your favorites, and track your progress.
                        </p>
                        <div class="flex space-x-3 pt-2">
                            <div class="w-8 h-8 bg-[#111827] rounded-full flex items-center justify-center">
                                <span class="text-xs text-[#60A5FA]">✓</span>
                            </div>
                            <div class="w-8 h-8 bg-[#111827] rounded-full flex items-center justify-center">
                                <span class="text-xs text-[#60A5FA]">✓</span>
                            </div>
                            <div class="w-8 h-8 bg-[#111827] rounded-full flex items-center justify-center">
                                <span class="text-xs text-[#60A5FA]">✓</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Quick Links -->
                    <div>
                        <h4 class="text-[#E5E7EB] font-semibold mb-4 flex items-center gap-2">
                            <svg class="w-4 h-4 text-[#3B82F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            Quick Links
                        </h4>
                        <ul class="space-y-3">
                            <li class="group">
                                <a href="#/" class="text-[#9CA3AF] hover:text-[#3B82F6] transition-all duration-300 text-sm flex items-center gap-2 group-hover:translate-x-1 transform">
                                    <span class="w-0 group-hover:w-2 transition-all duration-300">→</span>
                                    <span>Home</span>
                                </a>
                            </li>
                            <li class="group">
                                <a href="#/dashboard" class="text-[#9CA3AF] hover:text-[#3B82F6] transition-all duration-300 text-sm flex items-center gap-2 group-hover:translate-x-1 transform">
                                    <span class="w-0 group-hover:w-2 transition-all duration-300">→</span>
                                    <span>Dashboard</span>
                                </a>
                            </li>
                            <li class="group">
                                <a href="#/history" class="text-[#9CA3AF] hover:text-[#3B82F6] transition-all duration-300 text-sm flex items-center gap-2 group-hover:translate-x-1 transform">
                                    <span class="w-0 group-hover:w-2 transition-all duration-300">→</span>
                                    <span>History</span>
                                </a>
                            </li>
                            <li class="group">
                                <a href="#/saved" class="text-[#9CA3AF] hover:text-[#3B82F6] transition-all duration-300 text-sm flex items-center gap-2 group-hover:translate-x-1 transform">
                                    <span class="w-0 group-hover:w-2 transition-all duration-300">→</span>
                                    <span>Saved Notes</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                    
                    <!-- Support -->
                    <div>
                        <h4 class="text-[#E5E7EB] font-semibold mb-4 flex items-center gap-2">
                            <svg class="w-4 h-4 text-[#3B82F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path>
                            </svg>
                            Support
                        </h4>
                        <ul class="space-y-3">
                            <li class="group">
                                <a href="#" class="text-[#9CA3AF] hover:text-[#3B82F6] transition-all duration-300 text-sm flex items-center gap-2 group-hover:translate-x-1 transform">
                                    <span class="w-0 group-hover:w-2 transition-all duration-300">→</span>
                                    <span>FAQ</span>
                                </a>
                            </li>
                            <li class="group">
                                <a href="#" class="text-[#9CA3AF] hover:text-[#3B82F6] transition-all duration-300 text-sm flex items-center gap-2 group-hover:translate-x-1 transform">
                                    <span class="w-0 group-hover:w-2 transition-all duration-300">→</span>
                                    <span>Help Center</span>
                                </a>
                            </li>
                            <li class="group">
                                <a href="#" class="text-[#9CA3AF] hover:text-[#3B82F6] transition-all duration-300 text-sm flex items-center gap-2 group-hover:translate-x-1 transform">
                                    <span class="w-0 group-hover:w-2 transition-all duration-300">→</span>
                                    <span>Contact Us</span>
                                </a>
                            </li>
                            <li class="group">
                                <a href="#" class="text-[#9CA3AF] hover:text-[#3B82F6] transition-all duration-300 text-sm flex items-center gap-2 group-hover:translate-x-1 transform">
                                    <span class="w-0 group-hover:w-2 transition-all duration-300">→</span>
                                    <span>Privacy Policy</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                    
                    <!-- Connect & Newsletter -->
                    <div>
                        <h4 class="text-[#E5E7EB] font-semibold mb-4 flex items-center gap-2">
                            <svg class="w-4 h-4 text-[#3B82F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                            </svg>
                            Connect
                        </h4>
                        
                        <!-- Social Links -->
                        <div class="flex space-x-3 mb-6">
                            <a href="#" class="group relative w-10 h-10 bg-[#111827] rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-[#3B82F6] hover:to-[#A78BFA] transition-all duration-300 hover:scale-110">
                                <svg class="w-5 h-5 text-[#9CA3AF] group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                                <span class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#111827] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Facebook</span>
                            </a>
                            <a href="#" class="group relative w-10 h-10 bg-[#111827] rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-[#3B82F6] hover:to-[#A78BFA] transition-all duration-300 hover:scale-110">
                                <svg class="w-5 h-5 text-[#9CA3AF] group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.104c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0021.533-3.668 13.5 13.5 0 001.277-5.556c0-.207 0-.414-.015-.62A9.935 9.935 0 0024 4.59z"/>
                                </svg>
                                <span class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#111827] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Twitter</span>
                            </a>
                            <a href="#" class="group relative w-10 h-10 bg-[#111827] rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-[#3B82F6] hover:to-[#A78BFA] transition-all duration-300 hover:scale-110">
                                <svg class="w-5 h-5 text-[#9CA3AF] group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                                <span class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#111827] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">LinkedIn</span>
                            </a>
                            <a href="#" class="group relative w-10 h-10 bg-[#111827] rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-[#3B82F6] hover:to-[#A78BFA] transition-all duration-300 hover:scale-110">
                                <svg class="w-5 h-5 text-[#9CA3AF] group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
                                </svg>
                                <span class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#111827] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Instagram</span>
                            </a>
                        </div>
                        
                        <!-- Newsletter Signup -->
                        <div class="mt-4">
                            <p class="text-sm text-[#9CA3AF] mb-3">Subscribe to our newsletter</p>
                            <form id="newsletterForm" class="flex gap-2" onsubmit="return false;">
                                <input type="email" 
                                       placeholder="Your email" 
                                       class="flex-1 bg-[#111827] border border-[#374151] rounded-lg px-3 py-2 text-sm text-[#E5E7EB] focus:outline-none focus:border-[#3B82F6] transition-colors">
                                <button type="submit" class="bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] hover:from-[#60A5FA] hover:to-[#8B5CF6] text-white px-3 py-2 rounded-lg text-sm transition-all transform hover:scale-105">
                                    Subscribe
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                
                <!-- Divider with gradient -->
                <div class="relative my-8">
                    <div class="absolute inset-0 flex items-center">
                        <div class="w-full border-t border-[#374151]"></div>
                    </div>
                    <div class="relative flex justify-center">
                        <div class="bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] w-12 h-0.5 rounded-full"></div>
                    </div>
                </div>
                
                <!-- Bottom Bar -->
                <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <!-- Copyright -->
                    <p class="text-[#9CA3AF] text-sm">
                        © ${currentYear} Flashnotes. All rights reserved.
                    </p>
                    
                    <!-- Language Selector -->
                    <div class="flex items-center gap-4">
                        <div class="relative group">
                            <button class="flex items-center gap-1 text-[#9CA3AF] hover:text-[#3B82F6] text-sm transition-colors">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12h.01M7 12h.01M11 12h.01M15 12h.01M19 12h.01M21 12h.01M12 3v.01M12 7v.01M12 11v.01M12 15v.01M12 19v.01M12 21v.01"></path>
                                </svg>
                                <span>English</span>
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </button>
                            <div class="absolute bottom-full mb-2 right-0 w-32 bg-[#1F2937] border border-[#374151] rounded-lg shadow-xl hidden group-hover:block">
                                <a href="#" class="block px-4 py-2 text-sm text-[#E5E7EB] hover:bg-[#374151]">English</a>
                                <a href="#" class="block px-4 py-2 text-sm text-[#E5E7EB] hover:bg-[#374151]">हिंदी</a>
                                <a href="#" class="block px-4 py-2 text-sm text-[#E5E7EB] hover:bg-[#374151]">Español</a>
                            </div>
                        </div>
                        
                        <!-- Back to Top Button -->
                        <button id="backToTop" class="bg-[#374151] hover:bg-[#3B82F6] text-[#9CA3AF] hover:text-white p-2 rounded-lg transition-all duration-300 transform hover:scale-110">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    `;
}

// Setup footer events (add this to your main.js or component initialization)
export function setupFooter() {
    // Back to Top functionality
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.remove('opacity-0', 'invisible');
                backToTopBtn.classList.add('opacity-100', 'visible');
            } else {
                backToTopBtn.classList.add('opacity-0', 'invisible');
                backToTopBtn.classList.remove('opacity-100', 'visible');
            }
        });
    }
    
    // Newsletter form submission
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email) {
                // Here you would call your newsletter API
                alert(`Thank you for subscribing with: ${email}`);
                emailInput.value = '';
            } else {
                alert('Please enter a valid email address');
            }
        });
    }
}