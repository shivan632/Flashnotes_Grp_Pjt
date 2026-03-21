// frontend/src/pages/VerifyOTPPage.js
// OTP Verification Page - Enhanced UI

import { Sidebar } from '../components/layout/Sidebar.js';
import { AIChatSidebar } from '../components/layout/AIChatSidebar.js';
import { Header } from '../components/common/Header.js';
import { OTPInput, setupOTPInputs, getOTPValue, clearOTPInputs, showOTPError, showOTPSuccess } from '../components/auth/OTPInput.js';
import { authAPI } from '../services/api.js';
import { showError } from '../components/common/ErrorMessage.js';
import { LoadingSpinner } from '../components/common/LoadingSpinner.js';

export function VerifyOTPPage() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const email = localStorage.getItem('pendingVerification') || 'your email';
    
    if (isAuthenticated) {
        window.location.hash = '#/dashboard';
        return '';
    }
    
    if (!email) {
        window.location.hash = '#/register';
        return '';
    }
    
    return `
        <div class="min-h-screen bg-gradient-to-b from-[#111827] to-[#0F172A] relative flex items-center justify-center">
            <!-- Animated Background Elements -->
            <div class="absolute inset-0 overflow-hidden">
                <div class="absolute top-20 left-10 w-72 h-72 bg-[#3B82F6] rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
                <div class="absolute bottom-20 right-10 w-96 h-96 bg-[#A78BFA] rounded-full filter blur-3xl opacity-10 animate-pulse" style="animation-delay: 1s"></div>
            </div>
            
            <div class="relative z-10 w-full max-w-md mx-auto px-4 py-8">
                <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl shadow-2xl p-8 border border-[#374151] animate-fadeInUp">
                    <!-- Logo and Header -->
                    <div class="text-center mb-8">
                        <div class="mx-auto w-16 h-16 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-2xl flex items-center justify-center shadow-lg animate-float">
                            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                        </div>
                        <h2 class="mt-6 text-3xl font-extrabold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">
                            Verify Your Email
                        </h2>
                        <p class="mt-2 text-sm text-[#9CA3AF]">
                            We've sent a 6-digit verification code to
                        </p>
                        <p class="text-sm font-medium text-[#60A5FA] mt-1 flex items-center justify-center gap-1">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                            ${escapeHtml(email)}
                        </p>
                    </div>
                    
                    <!-- OTP Input Form -->
                    <form id="otpForm" class="mt-8 space-y-6" onsubmit="return false;">
                        <div class="flex justify-center gap-2 sm:gap-3 otp-inputs-container">
                            ${Array(6).fill(0).map((_, i) => OTPInput(i)).join('')}
                        </div>
                        
                        <div class="flex gap-3">
                            <button type="submit" 
                                    id="verifyOtpBtn"
                                    class="flex-1 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] hover:from-[#60A5FA] hover:to-[#8B5CF6] text-white py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#A78BFA]/50">
                                Verify Email
                            </button>
                            <button type="button" 
                                    id="clearOtpBtn"
                                    class="px-4 bg-[#374151] hover:bg-[#4B5563] text-white rounded-xl transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#4B5563] group">
                                <svg class="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                            </button>
                        </div>
                    </form>
                    
                    <!-- Resend Section -->
                    <div class="text-center space-y-3 mt-6">
                        <p class="text-sm text-[#9CA3AF]">Didn't receive the code?</p>
                        <div class="flex justify-center gap-4">
                            <button id="resendOtp" 
                                    class="text-[#60A5FA] hover:text-[#3B82F6] transition-all duration-300 font-medium text-sm hover:underline flex items-center gap-1">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                </svg>
                                Resend Code
                            </button>
                            <span class="text-[#4B5563]">|</span>
                            <a href="#/register" 
                               class="text-[#A78BFA] hover:text-[#3B82F6] transition-all duration-300 text-sm hover:underline flex items-center gap-1">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                                </svg>
                                Change Email
                            </a>
                        </div>
                    </div>
                    
                    <!-- Timer Display -->
                    <div id="otpTimer" class="text-center mt-6 text-sm bg-[#111827] py-2 px-4 rounded-lg inline-block w-full">
                        <div class="flex items-center justify-center gap-2">
                            <svg class="w-4 h-4 text-[#60A5FA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span>Code expires in <span id="timerValue" class="font-mono font-bold text-[#60A5FA]">05:00</span></span>
                        </div>
                    </div>
                    
                    <!-- Back to Login Link -->
                    <div class="text-center mt-6">
                        <a href="#/login" class="text-sm text-[#60A5FA] hover:text-[#3B82F6] transition-all duration-300 inline-flex items-center gap-1 group">
                            <svg class="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                            </svg>
                            Back to Login
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Setup OTP verification events
export function setupVerifyOTP() {
    const form = document.getElementById('otpForm');
    if (!form) return;
    
    // Setup OTP inputs behavior
    setupOTPInputs();
    
    // Setup timer
    let timeLeft = 300; // 5 minutes in seconds
    const timerDisplay = document.getElementById('timerValue');
    let timerInterval;
    
    function startTimer() {
        if (timerInterval) clearInterval(timerInterval);
        
        timerInterval = setInterval(() => {
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                const timerContainer = document.getElementById('otpTimer');
                if (timerContainer) {
                    timerContainer.innerHTML = `
                        <div class="flex items-center justify-center gap-2 text-red-500">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span>Code expired. Please request a new one.</span>
                        </div>
                    `;
                    timerContainer.classList.add('bg-red-500/10', 'border', 'border-red-500/30');
                }
                return;
            }
            
            timeLeft--;
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            if (timerDisplay) {
                timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
        }, 1000);
    }
    
    startTimer();
    
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
            showOTPError();
            showError('Please enter complete 6-digit OTP', 'warning');
            return;
        }
        
        const submitBtn = document.getElementById('verifyOtpBtn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<div class="loading-spinner-small mx-auto"></div> Verifying...';
        submitBtn.disabled = true;
        
        try {
            const result = await authAPI.verifyOTP(email, otp);
            
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
            
            clearInterval(timerInterval);
            showOTPSuccess();
            showError(result.message || 'Email verified successfully!', 'success');
            
            setTimeout(() => {
                window.location.hash = '#/dashboard';
            }, 1500);
            
        } catch (error) {
            console.error('Verification failed:', error);
            showOTPError();
            showError(error.message || 'Invalid OTP. Please try again.', 'error');
            clearOTPInputs();
        } finally {
            submitBtn.innerHTML = originalText;
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
            const originalText = resendBtn.innerHTML;
            resendBtn.innerHTML = '<div class="loading-spinner-small inline-block"></div> Sending...';
            
            try {
                const result = await authAPI.resendOTP(email);
                showError(result.message || 'New OTP sent to your email!', 'success');
                
                // Reset timer
                timeLeft = 300;
                startTimer();
                const timerContainer = document.getElementById('otpTimer');
                if (timerContainer) {
                    timerContainer.classList.remove('bg-red-500/10', 'border', 'border-red-500/30');
                    timerContainer.innerHTML = `
                        <div class="flex items-center justify-center gap-2">
                            <svg class="w-4 h-4 text-[#60A5FA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span>Code expires in <span id="timerValue" class="font-mono font-bold text-[#60A5FA]">05:00</span></span>
                        </div>
                    `;
                }
                
                // Clear inputs
                clearOTPInputs();
                
            } catch (error) {
                showError(error.message || 'Failed to resend OTP', 'error');
            } finally {
                resendBtn.disabled = false;
                resendBtn.innerHTML = originalText;
            }
        });
    }
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add CSS animations
const verifyStyles = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes float {
        0%, 100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-5px);
        }
    }
    
    .animate-fadeInUp {
        animation: fadeInUp 0.5s ease-out forwards;
    }
    
    .animate-float {
        animation: float 3s ease-in-out infinite;
    }
`;

if (!document.querySelector('#verify-styles')) {
    const style = document.createElement('style');
    style.id = 'verify-styles';
    style.textContent = verifyStyles;
    document.head.appendChild(style);
}