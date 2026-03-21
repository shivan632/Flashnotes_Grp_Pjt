// frontend/src/components/auth/LoginForm.js
import { authAPI } from '../../services/api.js';
import { showError } from '../common/ErrorMessage.js';

export function LoginForm() {
    return `
        <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#111827] via-[#1F2937] to-[#111827] py-12 px-4 sm:px-6 lg:px-8">
            <div class="max-w-md w-full space-y-8 animate-fadeIn">
                <!-- Logo and Header -->
                <div class="text-center">
                    <div class="mx-auto w-20 h-20 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-105 transition-transform duration-300">
                        <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                    </div>
                    <h2 class="mt-6 text-4xl font-extrabold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">
                        Welcome Back
                    </h2>
                    <p class="mt-2 text-sm text-[#9CA3AF]">
                        Sign in to continue your learning journey
                    </p>
                </div>
                
                <!-- Login Form -->
                <form id="loginForm" class="mt-8 space-y-6" onsubmit="return false;">
                    <!-- Email Field -->
                    <div class="group">
                        <label class="block text-sm font-medium text-[#E5E7EB] mb-2 transition-colors group-focus-within:text-[#3B82F6]">
                            Email Address
                        </label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="h-5 w-5 text-[#9CA3AF] group-focus-within:text-[#3B82F6] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                </svg>
                            </div>
                            <input type="email" 
                                   id="loginEmail" 
                                   class="w-full bg-[#111827] border-2 border-[#374151] rounded-xl pl-10 pr-4 py-3 text-[#E5E7EB] 
                                          focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/50 
                                          transition-all duration-300 hover:border-[#60A5FA]"
                                   placeholder="john@example.com"
                                   required>
                        </div>
                    </div>
                    
                    <!-- Password Field -->
                    <div class="group">
                        <label class="block text-sm font-medium text-[#E5E7EB] mb-2 transition-colors group-focus-within:text-[#3B82F6]">
                            Password
                        </label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="h-5 w-5 text-[#9CA3AF] group-focus-within:text-[#3B82F6] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6-4h12a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2zm10-4V6a4 4 0 00-8 0v4h8z"></path>
                                </svg>
                            </div>
                            <input type="password" 
                                   id="loginPassword" 
                                   class="w-full bg-[#111827] border-2 border-[#374151] rounded-xl pl-10 pr-4 py-3 text-[#E5E7EB] 
                                          focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/50 
                                          transition-all duration-300 hover:border-[#60A5FA]"
                                   placeholder="••••••••"
                                   required>
                            <button type="button" class="toggle-password absolute inset-y-0 right-0 pr-3 flex items-center">
                                <svg class="h-5 w-5 text-[#9CA3AF] hover:text-[#3B82F6] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                    
                    <!-- Remember Me & Forgot Password -->
                    <div class="flex items-center justify-between">
                        <label class="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" 
                                   id="rememberMe" 
                                   class="w-4 h-4 text-[#3B82F6] bg-[#111827] border-[#374151] rounded focus:ring-[#3B82F6] focus:ring-2">
                            <span class="text-sm text-[#9CA3AF]">Remember me</span>
                        </label>
                        <a href="#/forgot-password" 
                           class="text-sm text-[#60A5FA] hover:text-[#3B82F6] transition-colors hover:underline">
                            Forgot Password?
                        </a>
                    </div>
                    
                    <!-- Login Button -->
                    <button type="submit" 
                            id="loginSubmitBtn"
                            class="w-full bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] hover:from-[#60A5FA] hover:to-[#8B5CF6] 
                                   text-white py-3 rounded-xl font-semibold transition-all duration-300 
                                   transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#A78BFA]/50
                                   disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                        Sign In
                    </button>
                </form>
                
                <!-- Divider -->
                <div class="relative">
                    <div class="absolute inset-0 flex items-center">
                        <div class="w-full border-t border-[#374151]"></div>
                    </div>
                    <div class="relative flex justify-center text-sm">
                        <span class="px-2 bg-[#1F2937] text-[#9CA3AF]">or continue with</span>
                    </div>
                </div>
                
                <!-- Social Login Buttons -->
                <div class="space-y-3">
                    <button class="w-full bg-[#374151] hover:bg-[#4B5563] text-white py-3 rounded-xl font-medium 
                                   transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-3">
                        <svg class="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Continue with Google
                    </button>
                    <button class="w-full bg-[#374151] hover:bg-[#4B5563] text-white py-3 rounded-xl font-medium 
                                   transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-3">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        Continue with GitHub
                    </button>
                </div>
                
                <!-- Register Link -->
                <p class="text-center text-sm text-[#9CA3AF]">
                    Don't have an account? 
                    <a href="#/register" class="text-[#60A5FA] hover:text-[#3B82F6] transition-colors font-semibold hover:underline">
                        Create one now
                    </a>
                </p>
                
                <!-- Demo Account Info (Optional) -->
                <div class="bg-[#111827]/50 rounded-lg p-3 text-center">
                    <p class="text-xs text-[#9CA3AF]">
                        <span class="text-[#60A5FA]">Demo:</span> demo@flashnotes.com / demo123
                    </p>
                </div>
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
    const toggleButton = document.querySelector('.toggle-password');
    if (toggleButton) {
        toggleButton.addEventListener('click', () => {
            const passwordInput = document.getElementById('loginPassword');
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                toggleButton.innerHTML = `
                    <svg class="h-5 w-5 text-[#3B82F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                    </svg>
                `;
            } else {
                passwordInput.type = 'password';
                toggleButton.innerHTML = `
                    <svg class="h-5 w-5 text-[#9CA3AF] hover:text-[#3B82F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                `;
            }
        });
    }

    newForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe')?.checked || false;
        
        // Validation
        if (!email || !password) {
            showError('Please fill in all fields', 'warning');
            if (!email) document.getElementById('loginEmail').focus();
            else document.getElementById('loginPassword').focus();
            return;
        }
        
        // Email format validation
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
            const result = await authAPI.login({ email, password });
            
            // Store auth data
            localStorage.setItem('authToken', result.token);
            localStorage.setItem('user', JSON.stringify(result.user));
            localStorage.setItem('userName', result.user.name);
            localStorage.setItem('userEmail', result.user.email);
            localStorage.setItem('isAuthenticated', 'true');
            
            // Store remember me preference
            if (rememberMe) {
                localStorage.setItem('rememberedEmail', email);
            } else {
                localStorage.removeItem('rememberedEmail');
            }
            
            showError('Login successful! Redirecting...', 'success');
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.hash = '#/dashboard';
            }, 1500);
            
        } catch (error) {
            console.error('Login failed:', error);
            showError(error.message || 'Invalid email or password. Please try again.', 'error');
            
            // Clear password field on error
            document.getElementById('loginPassword').value = '';
            document.getElementById('loginPassword').focus();
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
    
    // Auto-fill remembered email
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
        const emailInput = document.getElementById('loginEmail');
        if (emailInput) {
            emailInput.value = rememberedEmail;
            const rememberCheckbox = document.getElementById('rememberMe');
            if (rememberCheckbox) rememberCheckbox.checked = true;
        }
    }
    
    // Enter key support
    const inputs = ['loginEmail', 'loginPassword'];
    inputs.forEach((id, index) => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    if (index === inputs.length - 1) {
                        // Last input, submit form
                        const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
                        newForm.dispatchEvent(submitEvent);
                    } else {
                        // Move to next input
                        const nextInput = document.getElementById(inputs[index + 1]);
                        if (nextInput) nextInput.focus();
                    }
                }
            });
        }
    });
}