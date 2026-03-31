// frontend/src/components/auth/RegistrationForm.js
import { authAPI } from '../../services/api.js';
import { showError } from '../common/ErrorMessage.js';

export function RegistrationForm() {
    return `
        <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0F172A] via-[#111827] to-[#0F172A] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <!-- Animated Background Elements -->
            <div class="absolute inset-0 overflow-hidden">
                <div class="absolute -top-40 -right-40 w-80 h-80 bg-[#3B82F6] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
                <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-[#A78BFA] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-1000"></div>
                <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#10B981] rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse delay-2000"></div>
            </div>
            
            <div class="max-w-md w-full space-y-8 animate-fadeInUp relative z-10">
                <!-- Logo and Header -->
                <div class="text-center">
                    <div class="relative mx-auto w-24 h-24 group">
                        <div class="absolute inset-0 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
                        <div class="relative w-24 h-24 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-all duration-500">
                            <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                        </div>
                    </div>
                    <h2 class="mt-6 text-4xl font-extrabold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">
                        Create Account
                    </h2>
                    <p class="mt-2 text-sm text-[#9CA3AF] flex items-center justify-center gap-2">
                        <span class="w-1.5 h-1.5 bg-[#10B981] rounded-full animate-pulse"></span>
                        Join Flashnotes and start your learning journey
                    </p>
                </div>
                
                <!-- Registration Form -->
                <form id="registerForm" class="mt-8 space-y-5" onsubmit="return false;">
                    <!-- Name Field -->
                    <div class="group">
                        <label class="block text-sm font-medium text-[#E5E7EB] mb-2 transition-all duration-300 group-focus-within:text-[#3B82F6]">
                            Full Name
                        </label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <div class="w-8 h-8 rounded-lg bg-[#1F2937] flex items-center justify-center transition-all group-focus-within:bg-[#3B82F6]/20">
                                    <svg class="h-4 w-4 text-[#9CA3AF] group-focus-within:text-[#3B82F6] transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                    </svg>
                                </div>
                            </div>
                            <input type="text" 
                                   id="regName" 
                                   class="w-full bg-[#111827] border-2 border-[#374151] rounded-xl pl-16 pr-4 py-3.5 text-[#E5E7EB] 
                                          focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/30 
                                          transition-all duration-300 hover:border-[#4B5563]"
                                   placeholder="John Doe"
                                   autocomplete="name"
                                   required>
                            <div class="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-0 group-focus-within:opacity-100 transition-opacity">
                                <svg class="w-4 h-4 text-[#3B82F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Email Field -->
                    <div class="group">
                        <label class="block text-sm font-medium text-[#E5E7EB] mb-2 transition-all duration-300 group-focus-within:text-[#3B82F6]">
                            Email Address
                        </label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <div class="w-8 h-8 rounded-lg bg-[#1F2937] flex items-center justify-center transition-all group-focus-within:bg-[#3B82F6]/20">
                                    <svg class="h-4 w-4 text-[#9CA3AF] group-focus-within:text-[#3B82F6] transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                    </svg>
                                </div>
                            </div>
                            <input type="email" 
                                   id="regEmail" 
                                   class="w-full bg-[#111827] border-2 border-[#374151] rounded-xl pl-16 pr-4 py-3.5 text-[#E5E7EB] 
                                          focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/30 
                                          transition-all duration-300 hover:border-[#4B5563]"
                                   placeholder="john@example.com"
                                   autocomplete="email"
                                   required>
                        </div>
                    </div>
                    
                    <!-- Password Field -->
                    <div class="group">
                        <label class="block text-sm font-medium text-[#E5E7EB] mb-2 transition-all duration-300 group-focus-within:text-[#3B82F6]">
                            Password
                        </label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <div class="w-8 h-8 rounded-lg bg-[#1F2937] flex items-center justify-center transition-all group-focus-within:bg-[#3B82F6]/20">
                                    <svg class="h-4 w-4 text-[#9CA3AF] group-focus-within:text-[#3B82F6] transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6-4h12a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2zm10-4V6a4 4 0 00-8 0v4h8z"></path>
                                    </svg>
                                </div>
                            </div>
                            <input type="password" 
                                   id="regPassword" 
                                   class="w-full bg-[#111827] border-2 border-[#374151] rounded-xl pl-16 pr-12 py-3.5 text-[#E5E7EB] 
                                          focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/30 
                                          transition-all duration-300 hover:border-[#4B5563]"
                                   placeholder="••••••••"
                                   autocomplete="new-password"
                                   required>
                            <button type="button" class="toggle-password absolute inset-y-0 right-0 pr-4 flex items-center group/btn">
                                <svg class="h-5 w-5 text-[#9CA3AF] group-hover/btn:text-[#3B82F6] transition-all duration-300 group-hover/btn:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                </svg>
                            </button>
                        </div>
                        <p class="text-[#9CA3AF] text-xs mt-2 flex items-center gap-1">
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            Must be at least 8 characters with uppercase, lowercase and numbers
                        </p>
                    </div>
                    
                    <!-- Confirm Password Field -->
                    <div class="group">
                        <label class="block text-sm font-medium text-[#E5E7EB] mb-2 transition-all duration-300 group-focus-within:text-[#3B82F6]">
                            Confirm Password
                        </label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <div class="w-8 h-8 rounded-lg bg-[#1F2937] flex items-center justify-center transition-all group-focus-within:bg-[#3B82F6]/20">
                                    <svg class="h-4 w-4 text-[#9CA3AF] group-focus-within:text-[#3B82F6] transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                                    </svg>
                                </div>
                            </div>
                            <input type="password" 
                                   id="regConfirmPassword" 
                                   class="w-full bg-[#111827] border-2 border-[#374151] rounded-xl pl-16 pr-12 py-3.5 text-[#E5E7EB] 
                                          focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/30 
                                          transition-all duration-300 hover:border-[#4B5563]"
                                   placeholder="••••••••"
                                   autocomplete="new-password"
                                   required>
                        </div>
                    </div>
                    
                    <!-- Terms and Conditions -->
                    <div class="flex items-center space-x-3 py-2">
                        <input type="checkbox" 
                               id="termsCheckbox" 
                               class="w-4 h-4 text-[#3B82F6] bg-[#111827] border-[#374151] rounded focus:ring-[#3B82F6] focus:ring-2 focus:ring-offset-0 cursor-pointer"
                               required>
                        <label for="termsCheckbox" class="text-sm text-[#9CA3AF] cursor-pointer hover:text-[#E5E7EB] transition-colors">
                            I agree to the 
                            <a href="#" class="text-[#60A5FA] hover:text-[#3B82F6] transition-colors font-medium hover:underline">Terms of Service</a> 
                            and 
                            <a href="#" class="text-[#60A5FA] hover:text-[#3B82F6] transition-colors font-medium hover:underline">Privacy Policy</a>
                        </label>
                    </div>
                    
                    <!-- Submit Button -->
                    <button type="submit" 
                            id="registerSubmitBtn"
                            class="group relative w-full bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] hover:from-[#60A5FA] hover:to-[#8B5CF6] 
                                   text-white py-3.5 rounded-xl font-semibold transition-all duration-300 
                                   transform hover:scale-[1.02] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#A78BFA]/50
                                   disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden">
                        <div class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        <span class="relative z-10 flex items-center justify-center gap-2">
                            <svg class="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                            Create Account
                        </span>
                    </button>
                </form>
                
                <!-- Divider -->
                <div class="relative">
                    <div class="absolute inset-0 flex items-center">
                        <div class="w-full border-t border-[#374151]"></div>
                    </div>
                    <div class="relative flex justify-center text-sm">
                        <span class="px-3 bg-[#1F2937] text-[#9CA3AF]">or</span>
                    </div>
                </div>
                
                <!-- Social Login Buttons -->
                <div class="space-y-3">
                    <button class="group relative w-full bg-[#374151] hover:bg-[#4B5563] text-white py-3 rounded-xl font-medium 
                                   transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-3 overflow-hidden">
                        <div class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        <svg class="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-2.09-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        <span class="relative">Continue with Google</span>
                    </button>
                    <button class="group relative w-full bg-[#374151] hover:bg-[#4B5563] text-white py-3 rounded-xl font-medium 
                                   transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-3 overflow-hidden">
                        <div class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        <span class="relative">Continue with GitHub</span>
                    </button>
                </div>
                
                <!-- Login Link -->
                <p class="text-center text-sm text-[#9CA3AF]">
                    Already have an account? 
                    <a href="#/login" class="text-[#60A5FA] hover:text-[#3B82F6] transition-all duration-300 font-semibold hover:scale-105 inline-block">
                        Sign in →
                    </a>
                </p>
            </div>
        </div>
    `;
}

// Setup registration form events
export function setupRegistrationForm() {
    const form = document.getElementById('registerForm');
    if (!form) return;
    
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    
    // Password visibility toggle
    const toggleButtons = document.querySelectorAll('.toggle-password');
    toggleButtons.forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        newBtn.addEventListener('click', () => {
            const input = newBtn.previousElementSibling;
            if (input.type === 'password') {
                input.type = 'text';
                newBtn.innerHTML = `
                    <svg class="h-5 w-5 text-[#3B82F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                    </svg>
                `;
            } else {
                input.type = 'password';
                newBtn.innerHTML = `
                    <svg class="h-5 w-5 text-[#9CA3AF] hover:text-[#3B82F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                `;
            }
        });
    });
    
    newForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('regName').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;
        const termsChecked = document.getElementById('termsCheckbox').checked;
        
        if (!name || !email || !password || !confirmPassword) {
            showError('Please fill in all fields', 'warning');
            document.getElementById('regName').focus();
            return;
        }
        
        if (name.length < 2) {
            showError('Name must be at least 2 characters', 'warning');
            document.getElementById('regName').focus();
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError('Please enter a valid email address', 'warning');
            document.getElementById('regEmail').focus();
            return;
        }
        
        if (password.length < 8) {
            showError('Password must be at least 8 characters long', 'warning');
            document.getElementById('regPassword').focus();
            return;
        }
        
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        
        if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
            showError('Password must contain uppercase, lowercase and numbers', 'warning');
            document.getElementById('regPassword').focus();
            return;
        }
        
        if (password !== confirmPassword) {
            showError('Passwords do not match', 'warning');
            document.getElementById('regConfirmPassword').focus();
            return;
        }
        
        if (!termsChecked) {
            showError('Please agree to the Terms and Privacy Policy', 'warning');
            return;
        }
        
        const submitBtn = document.getElementById('registerSubmitBtn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<div class="loading-spinner-small mx-auto"></div> Creating Account...';
        submitBtn.disabled = true;
        
        try {
            const result = await authAPI.register({ name, email, password });
            
            localStorage.setItem('pendingVerification', email);
            localStorage.setItem('pendingUserName', name);
            
            if (result.otp) {
                localStorage.setItem('devOTP', result.otp);
                showError(`Your OTP is: ${result.otp}`, 'success');
            }
            
            showError(result.message || 'Registration successful! Please verify your email.', 'success');
            
            setTimeout(() => {
                window.location.hash = '#/verify-otp';
            }, 2000);
            
        } catch (error) {
            console.error('Registration failed:', error);
            showError(error.message || 'Registration failed. Please try again.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Add CSS animations (add this at the end of RegistrationForm.js file)

// Add CSS animations
const registerStyles = `
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
    
    @keyframes pulse-glow {
        0%, 100% {
            opacity: 0.1;
            transform: scale(1);
        }
        50% {
            opacity: 0.2;
            transform: scale(1.05);
        }
    }
    
    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
    
    .animate-fadeInUp {
        animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        opacity: 0;
    }
    
    .loading-spinner-small {
        width: 18px;
        height: 18px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
        display: inline-block;
    }
    
    /* Input focus effects */
    .group:focus-within label {
        color: #3B82F6;
    }
    
    /* Smooth transitions */
    input, button, svg {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    /* Custom checkbox styling */
    input[type="checkbox"] {
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    input[type="checkbox"]:checked {
        background-color: #3B82F6;
        border-color: #3B82F6;
    }
    
    input[type="checkbox"]:focus {
        ring: 2px solid #3B82F6;
    }
`;

if (!document.querySelector('#register-styles')) {
    const style = document.createElement('style');
    style.id = 'register-styles';
    style.textContent = registerStyles;
    document.head.appendChild(style);
}