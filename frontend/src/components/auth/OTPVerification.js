// frontend/src/components/auth/OTPVerification.js
import { authAPI } from '../../services/api.js';
import { OTPInput, setupOTPInputs, getOTPValue, clearOTPInputs } from './OTPInput.js';
import { showError } from '../common/ErrorMessage.js';

export function OTPVerification() {
    const email = localStorage.getItem('pendingVerification') || 'your email';
    
    return `
        <div class="min-h-screen flex items-center justify-center bg-[#111827]">
            <div class="bg-[#1F2937] p-8 rounded-xl shadow-2xl max-w-md w-full">
                <div class="text-center mb-6">
                    <div class="bg-[#3B82F6] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                    </div>
                    <h2 class="text-3xl font-bold text-[#3B82F6]">Verify Your Email</h2>
                    <p class="text-[#E5E7EB] mt-2">We've sent a 6-digit code to</p>
                    <p class="text-[#60A5FA] font-semibold">${email}</p>
                </div>
                
                <form id="otpForm" class="space-y-6" onsubmit="return false;">
                    <div class="flex justify-center gap-2">
                        ${Array(6).fill(0).map((_, i) => OTPInput(i)).join('')}
                    </div>
                    
                    <div class="flex gap-3">
                        <button type="submit" 
                                class="flex-1 bg-[#3B82F6] hover:bg-[#60A5FA] text-white py-3 rounded-lg transition-all transform hover:scale-105 font-medium">
                            Verify Email
                        </button>
                        <button type="button" 
                                id="clearOtpBtn"
                                class="px-4 bg-[#374151] hover:bg-[#4B5563] text-white rounded-lg transition-all">
                            Clear
                        </button>
                    </div>
                </form>
                
                <div class="text-center mt-6">
                    <p class="text-[#E5E7EB] mb-2">Didn't receive the code?</p>
                    <button id="resendOtp" class="text-[#60A5FA] hover:text-[#3B82F6] transition-colors">
                        Resend Code
                    </button>
                </div>
                
                <div id="otpTimer" class="text-center mt-4 text-sm text-[#9CA3AF]">
                    Code expires in 05:00
                </div>
            </div>
        </div>
    `;
}

// Setup OTP verification events
export function setupOTPVerification() {
    const form = document.getElementById('otpForm');
    if (!form) return;
    
    // Setup OTP inputs behavior
    setupOTPInputs();
    
    // Setup timer
    let timeLeft = 300; // 5 minutes in seconds
    const timerDisplay = document.getElementById('otpTimer');
    const timerInterval = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            if (timerDisplay) {
                timerDisplay.innerHTML = 'Code expired. Please request a new one.';
                timerDisplay.classList.add('text-red-500');
            }
            return;
        }
        
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        if (timerDisplay) {
            timerDisplay.textContent = `Code expires in ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }, 1000);
    
    // Handle form submission
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    
    newForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const otp = getOTPValue();
        const email = localStorage.getItem('pendingVerification');
        
        if (!email) {
            showError('No pending verification found', 'error');
            window.location.hash = '#/register';
            return;
        }
        
        if (otp.length !== 6) {
            showError('Please enter complete 6-digit OTP', 'warning');
            return;
        }
        
        const submitBtn = newForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Verifying...';
        submitBtn.disabled = true;
        
        try {
            // Call backend API
            const result = await authAPI.verifyOTP(email, otp);
            
            // Store auth data
            if (result.token) {
                localStorage.setItem('authToken', result.token);
            }
            if (result.user) {
                localStorage.setItem('user', JSON.stringify(result.user));
                localStorage.setItem('userName', result.user.name);
                localStorage.setItem('userEmail', result.user.email);
            }
            
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.removeItem('pendingVerification');
            
            // Clear timer
            clearInterval(timerInterval);
            
            showError(result.message || 'Email verified successfully!', 'success');
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.hash = '#/dashboard';
            }, 1500);
            
        } catch (error) {
            console.error('Verification failed:', error);
            showError(error.message || 'Invalid OTP. Please try again.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
    
    // Handle clear button
    const clearBtn = document.getElementById('clearOtpBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            clearOTPInputs();
        });
    }
    
    // Handle resend button
    const resendBtn = document.getElementById('resendOtp');
    if (resendBtn) {
        resendBtn.addEventListener('click', async () => {
            const email = localStorage.getItem('pendingVerification');
            if (!email) return;
            
            resendBtn.disabled = true;
            resendBtn.textContent = 'Sending...';
            
            try {
                const result = await authAPI.resendOTP(email);
                showError(result.message || 'New OTP sent to your email!', 'success');
                
                // Reset timer
                timeLeft = 300;
                timerDisplay.classList.remove('text-red-500');
                
                // Clear inputs
                clearOTPInputs();
                
            } catch (error) {
                showError(error.message || 'Failed to resend OTP', 'error');
            } finally {
                resendBtn.disabled = false;
                resendBtn.textContent = 'Resend Code';
            }
        });
    }
}