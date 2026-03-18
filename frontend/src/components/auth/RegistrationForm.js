// frontend/src/components/auth/RegistrationForm.js
import { authAPI } from '../../services/api.js';
import { showError } from '../common/ErrorMessage.js';

export function RegistrationForm() {
    return `
        <div class="min-h-screen flex items-center justify-center bg-[#111827]">
            <div class="bg-[#1F2937] p-8 rounded-xl shadow-2xl w-96">
                <div class="text-center mb-6">
                    <h2 class="text-3xl font-bold text-[#3B82F6]">Create Account</h2>
                    <p class="text-[#E5E7EB] text-sm mt-2">Join Flashnotes today</p>
                </div>
                
                <form id="registerForm" class="space-y-4" onsubmit="return false;">
                    <div>
                        <label class="block text-[#E5E7EB] mb-2 text-sm">Full Name</label>
                        <input type="text" 
                               id="regName" 
                               class="w-full bg-[#111827] border-2 border-[#3B82F6] rounded-lg px-4 py-2 text-[#E5E7EB] focus:outline-none focus:border-[#A78BFA] transition-colors" 
                               placeholder="John Doe"
                               required>
                    </div>
                    
                    <div>
                        <label class="block text-[#E5E7EB] mb-2 text-sm">Email Address</label>
                        <input type="email" 
                               id="regEmail" 
                               class="w-full bg-[#111827] border-2 border-[#3B82F6] rounded-lg px-4 py-2 text-[#E5E7EB] focus:outline-none focus:border-[#A78BFA] transition-colors" 
                               placeholder="john@example.com"
                               required>
                    </div>
                    
                    <div>
                        <label class="block text-[#E5E7EB] mb-2 text-sm">Password</label>
                        <input type="password" 
                               id="regPassword" 
                               class="w-full bg-[#111827] border-2 border-[#3B82F6] rounded-lg px-4 py-2 text-[#E5E7EB] focus:outline-none focus:border-[#A78BFA] transition-colors" 
                               placeholder="••••••••"
                               required>
                        <p class="text-[#9CA3AF] text-xs mt-1">Must be at least 8 characters</p>
                    </div>
                    
                    <div>
                        <label class="block text-[#E5E7EB] mb-2 text-sm">Confirm Password</label>
                        <input type="password" 
                               id="regConfirmPassword" 
                               class="w-full bg-[#111827] border-2 border-[#3B82F6] rounded-lg px-4 py-2 text-[#E5E7EB] focus:outline-none focus:border-[#A78BFA] transition-colors" 
                               placeholder="••••••••"
                               required>
                    </div>
                    
                    <div class="flex items-center text-sm">
                        <input type="checkbox" id="termsCheckbox" class="mr-2 accent-[#3B82F6]" required>
                        <label for="termsCheckbox" class="text-[#E5E7EB]">
                            I agree to the 
                            <a href="#" class="text-[#60A5FA] hover:text-[#3B82F6]">Terms</a> and 
                            <a href="#" class="text-[#60A5FA] hover:text-[#3B82F6]">Privacy Policy</a>
                        </label>
                    </div>
                    
                    <button type="submit" 
                            class="w-full bg-[#3B82F6] hover:bg-[#60A5FA] text-white py-2 rounded-lg transition-all transform hover:scale-105 font-medium">
                        Create Account
                    </button>
                </form>
                
                <p class="text-center mt-4 text-[#E5E7EB] text-sm">
                    Already have an account? 
                    <a href="#/login" class="text-[#A78BFA] hover:text-[#3B82F6] transition-colors font-semibold">Sign in</a>
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
    
    newForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;
        const termsChecked = document.getElementById('termsCheckbox').checked;
        
        // Validation
        if (!name || !email || !password || !confirmPassword) {
            showError('Please fill in all fields', 'warning');
            return;
        }
        
        if (password.length < 8) {
            showError('Password must be at least 8 characters long', 'warning');
            return;
        }
        
        if (password !== confirmPassword) {
            showError('Passwords do not match', 'warning');
            return;
        }
        
        if (!termsChecked) {
            showError('Please agree to the Terms and Privacy Policy', 'warning');
            return;
        }
        
        const submitBtn = newForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Creating Account...';
        submitBtn.disabled = true;
        
        try {
            // Call backend API
            const result = await authAPI.register({ name, email, password });
            
            // Store email for OTP verification
            localStorage.setItem('pendingVerification', email);
            
            // Show success message
            showError(result.message || 'Registration successful! Please check your email for OTP.', 'success');
            
            // Redirect to OTP verification
            setTimeout(() => {
                window.location.hash = '#/verify-otp';
            }, 2000);
            
        } catch (error) {
            console.error('Registration failed:', error);
            showError(error.message || 'Registration failed. Please try again.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}