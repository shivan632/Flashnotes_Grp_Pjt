// frontend/src/components/auth/LoginForm.js
import { authAPI } from '../../services/api.js';
import { showError } from '../common/ErrorMessage.js';

export function LoginForm() {
    return `
        <div class="min-h-screen flex items-center justify-center bg-[#111827]">
            <div class="bg-[#1F2937] p-8 rounded-xl shadow-2xl w-96">
                <h2 class="text-3xl font-bold text-center mb-6 text-[#3B82F6]">Welcome Back</h2>
                <form id="loginForm" class="space-y-4" onsubmit="return false;">
                    <div>
                        <label class="block text-[#E5E7EB] mb-2">Email</label>
                        <input type="email" 
                               id="loginEmail" 
                               class="w-full bg-[#111827] border-2 border-[#3B82F6] rounded-lg px-4 py-2 text-[#E5E7EB] focus:outline-none focus:border-[#A78BFA] transition-colors" 
                               placeholder="Enter your email"
                               required>
                    </div>
                    <div>
                        <label class="block text-[#E5E7EB] mb-2">Password</label>
                        <input type="password" 
                               id="loginPassword" 
                               class="w-full bg-[#111827] border-2 border-[#3B82F6] rounded-lg px-4 py-2 text-[#E5E7EB] focus:outline-none focus:border-[#A78BFA] transition-colors" 
                               placeholder="Enter your password"
                               required>
                    </div>
                    <div class="flex items-center justify-between text-sm">
                        <label class="flex items-center text-[#E5E7EB]">
                            <input type="checkbox" class="mr-2 accent-[#3B82F6]"> Remember me
                        </label>
                        <a href="#/forgot-password" class="text-[#60A5FA] hover:text-[#3B82F6] transition-colors">Forgot Password?</a>
                    </div>
                    <button type="submit" 
                            class="w-full bg-[#3B82F6] hover:bg-[#60A5FA] text-white py-2 rounded-lg transition-all transform hover:scale-105 font-medium">
                        Login
                    </button>
                </form>
                <p class="text-center mt-4 text-[#E5E7EB]">
                    Don't have an account? 
                    <a href="#/register" class="text-[#A78BFA] hover:text-[#3B82F6] transition-colors font-semibold">Register</a>
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

    newForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        if (!email || !password) {
            showError('Please fill in all fields', 'warning');
            return;
        }
        
        const submitBtn = newForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Logging in...';
        submitBtn.disabled = true;
        
        try {
            // Call backend API
            const result = await authAPI.login({ email, password });
            
            // Store auth data
            localStorage.setItem('authToken', result.token);
            localStorage.setItem('user', JSON.stringify(result.user));
            localStorage.setItem('userName', result.user.name);
            localStorage.setItem('userEmail', result.user.email);
            localStorage.setItem('isAuthenticated', 'true');
            
            showError('Login successful!', 'success');
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.hash = '#/dashboard';
            }, 1500);
            
        } catch (error) {
            console.error('Login failed:', error);
            showError(error.message || 'Login failed. Please check your credentials.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}