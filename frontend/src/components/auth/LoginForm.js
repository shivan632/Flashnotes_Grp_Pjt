// frontend/src/components/auth/LoginForm.js
import { authAPI } from '../../services/api.js';
import { showError } from '../common/ErrorMessage.js';

export function LoginForm() {
    return `
        <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0F172A] via-[#111827] to-[#0F172A] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <!-- Animated Background Elements -->
            <div class="absolute inset-0 overflow-hidden">
                <div class="absolute -top-40 -right-40 w-80 h-80 bg-[#3B82F6] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
                <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-[#A78BFA] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-1000"></div>
            </div>
            
            <div class="max-w-md w-full space-y-8 animate-fadeInUp relative z-10">
                <!-- Logo and Header -->
                <div class="text-center">
                    <div class="relative mx-auto w-24 h-24 group">
                        <div class="absolute inset-0 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
                        <div class="relative w-24 h-24 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-all duration-500">
                            <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                            </svg>
                        </div>
                    </div>
                    <h2 class="mt-6 text-4xl font-extrabold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">
                        Welcome Back
                    </h2>
                    <p class="mt-2 text-sm text-[#9CA3AF] flex items-center justify-center gap-2">
                        <span class="w-1.5 h-1.5 bg-[#3B82F6] rounded-full animate-pulse"></span>
                        Sign in to continue your learning journey
                    </p>
                </div>
                
                <!-- Login Form -->
                <form id="loginForm" class="mt-8 space-y-6" onsubmit="return false;">
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
                                   id="loginEmail" 
                                   name="email"
                                   class="w-full bg-[#111827] border-2 border-[#374151] rounded-xl pl-16 pr-4 py-3.5 text-[#E5E7EB] 
                                          focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/30 
                                          transition-all duration-300 hover:border-[#4B5563]"
                                   placeholder="john@example.com"
                                   autocomplete="email"
                                   required>
                            <div class="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-0 group-focus-within:opacity-100 transition-opacity">
                                <svg class="w-4 h-4 text-[#3B82F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
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
                                   id="loginPassword" 
                                   name="password"
                                   class="w-full bg-[#111827] border-2 border-[#374151] rounded-xl pl-16 pr-12 py-3.5 text-[#E5E7EB] 
                                          focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/30 
                                          transition-all duration-300 hover:border-[#4B5563]"
                                   placeholder="••••••••"
                                   autocomplete="current-password"
                                   required>
                            <button type="button" class="toggle-password absolute inset-y-0 right-0 pr-4 flex items-center group/btn">
                                <svg class="h-5 w-5 text-[#9CA3AF] group-hover/btn:text-[#3B82F6] transition-all duration-300 group-hover/btn:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                    
                    <!-- Remember Me & Forgot Password -->
                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <input type="checkbox" 
                                   id="rememberMe" 
                                   class="w-4 h-4 text-[#3B82F6] bg-[#111827] border-[#374151] rounded focus:ring-[#3B82F6] focus:ring-2 focus:ring-offset-0">
                            <label for="rememberMe" class="ml-2 text-sm text-[#9CA3AF] hover:text-[#E5E7EB] transition-colors cursor-pointer">
                                Remember me
                            </label>
                        </div>
                        <a href="#/forgot-password" class="text-sm text-[#60A5FA] hover:text-[#3B82F6] transition-all duration-300 hover:scale-105 inline-block">
                            Forgot password?
                        </a>
                    </div>
                    
                    <!-- Submit Button -->
                    <button type="submit" 
                            id="loginSubmitBtn"
                            class="group relative w-full bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] hover:from-[#60A5FA] hover:to-[#8B5CF6] 
                                   text-white py-3.5 rounded-xl font-semibold transition-all duration-300 
                                   transform hover:scale-[1.02] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#A78BFA]/50
                                   disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden">
                        <div class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        <span class="relative z-10 flex items-center justify-center gap-2">
                            <svg class="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                            </svg>
                            Sign In
                        </span>
                    </button>
                </form>
                
                <!-- Divider -->
                <div class="relative">
                    <div class="absolute inset-0 flex items-center">
                        <div class="w-full border-t border-[#374151]"></div>
                    </div>
                    <div class="relative flex justify-center text-sm">
                        <span class="px-3 bg-[#1F2937] text-[#9CA3AF]">or continue with</span>
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
                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        <span class="relative">Continue with Google</span>
                    </button>
                </div>
                
                <!-- Register Link -->
                <p class="text-center text-sm text-[#9CA3AF]">
                    Don't have an account? 
                    <a href="#/register" class="text-[#60A5FA] hover:text-[#3B82F6] transition-all duration-300 font-semibold hover:scale-105 inline-block">
                        Sign up →
                    </a>
                </p>
            </div>
        </div>
    `;
}

// Setup login form events
export function setupLoginForm() {
    const form = document.getElementById('loginForm');
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
        
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe')?.checked || false;
        
        console.log('Login attempt:', { email, passwordLength: password?.length, rememberMe });
        
        if (!email) {
            showError('Please enter your email address', 'warning');
            document.getElementById('loginEmail').focus();
            return;
        }
        
        if (!password) {
            showError('Please enter your password', 'warning');
            document.getElementById('loginPassword').focus();
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError('Please enter a valid email address', 'warning');
            document.getElementById('loginEmail').focus();
            return;
        }
        
        const submitBtn = document.getElementById('loginSubmitBtn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<div class="loading-spinner-small mx-auto"></div> Signing in...';
        submitBtn.disabled = true;
        
        try {
            const result = await authAPI.login(email, password);
            
            console.log('Login result:', result);
            
            if (result.success && result.token) {
                localStorage.setItem('token', result.token);
                localStorage.setItem('user', JSON.stringify(result.user));
                localStorage.setItem('isAuthenticated', 'true');
                
                if (rememberMe) {
                    localStorage.setItem('rememberedEmail', email);
                } else {
                    localStorage.removeItem('rememberedEmail');
                }
                
                showError('Login successful! Redirecting...', 'success');
                
                setTimeout(() => {
                    window.location.hash = '#/dashboard';
                }, 1500);
            } else if (result.requiresVerification) {
                localStorage.setItem('pendingVerification', result.email);
                showError('Please verify your email first. OTP sent again.', 'warning');
                setTimeout(() => {
                    window.location.hash = '#/verify-otp';
                }, 2000);
            } else {
                throw new Error(result.error || 'Login failed');
            }
            
        } catch (error) {
            console.error('Login failed:', error);
            showError(error.message || 'Invalid email or password', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
    
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
        const emailInput = document.getElementById('loginEmail');
        if (emailInput) {
            emailInput.value = rememberedEmail;
            const rememberCheckbox = document.getElementById('rememberMe');
            if (rememberCheckbox) rememberCheckbox.checked = true;
        }
    }
}

// Add CSS animations
const loginStyles = `
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
    
    .animate-fadeInUp {
        animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        opacity: 0;
    }
    
    .loading-spinner-small {
        width: 18px;
        height: 18px;
        border: 2px solid rgba(255,255,255,0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
        display: inline-block;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;

if (!document.querySelector('#login-styles')) {
    const style = document.createElement('style');
    style.id = 'login-styles';
    style.textContent = loginStyles;
    document.head.appendChild(style);
}