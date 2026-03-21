// frontend/src/components/auth/OTPVerification.js
import { OTPInput, setupOTPInputs, getOTPValue, clearOTPInputs, showOTPError, showOTPSuccess } from './OTPInput.js';
import { authAPI } from '../../services/api.js';
import { showError } from '../common/ErrorMessage.js';

export function OTPVerification() {
    const email = localStorage.getItem('pendingVerification') || 'your email';
    const devOTP = localStorage.getItem('devOTP') || '';
    const isSending = localStorage.getItem('otpSending') === 'true';
    
    return `
        <div class="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#111827] to-[#0F172A] py-12 px-4 sm:px-6 lg:px-8">
            <div class="otp-container max-w-md w-full space-y-8">
                <!-- Logo and Header -->
                <div class="text-center">
                    <div class="mx-auto w-16 h-16 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-2xl flex items-center justify-center shadow-lg">
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
                    <p class="text-sm font-medium text-[#60A5FA] mt-1">${email}</p>
                </div>
                
                <!-- OTP DISPLAY BOX - As shown in your image -->
                <div class="otp-display-box" id="otpDisplayBox">
                    <div class="otp-box-left">
                        <div class="otp-box-icon">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                        </div>
                        <div class="otp-box-text">
                            ${!devOTP && isSending ? `
                                <div class="otp-sending">
                                    <div class="loading-spinner-small"></div>
                                    <span>Sending...</span>
                                </div>
                            ` : devOTP ? `
                                <div class="otp-code-label">Your verification code</div>
                                <div class="otp-code-value" id="otpCodeValue">${devOTP}</div>
                                <div class="otp-code-timer">
                                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    <span>Valid for <span id="boxTimerCount">05:00</span></span>
                                </div>
                            ` : `
                                <div class="otp-waiting">
                                    <span>Waiting for code...</span>
                                </div>
                            `}
                        </div>
                    </div>
                    ${devOTP ? `
                        <button class="otp-copy-btn" id="copyOtpBtn" title="Copy code">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                            </svg>
                        </button>
                    ` : ''}
                </div>
                
                <!-- OTP Input Form -->
                <form id="otpForm" class="mt-6 space-y-6" onsubmit="return false;">
                    <div class="flex justify-center gap-2 sm:gap-3 otp-inputs-container">
                        ${Array(6).fill(0).map((_, i) => OTPInput(i)).join('')}
                    </div>
                    
                    <div class="flex gap-3">
                        <button type="submit" 
                                id="verifyOtpBtn"
                                class="flex-1 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] hover:from-[#60A5FA] hover:to-[#8B5CF6] text-white py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                            Verify Email
                        </button>
                        <button type="button" 
                                id="clearOtpBtn"
                                class="px-4 bg-[#374151] hover:bg-[#4B5563] text-white rounded-xl transition-all duration-300">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                        </button>
                    </div>
                </form>
                
                <!-- Resend Section -->
                <div class="text-center space-y-3 mt-4">
                    <p class="text-sm text-[#9CA3AF]">Didn't receive the code?</p>
                    <button id="resendOtp" 
                            class="text-[#60A5FA] hover:text-[#3B82F6] transition-all duration-300 font-medium text-sm hover:underline flex items-center justify-center gap-1 mx-auto">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                        </svg>
                        Resend Code
                    </button>
                </div>
                
                <!-- Timer Display -->
                <div id="otpTimer" class="text-center text-sm bg-[#111827] py-2 px-4 rounded-lg">
                    <div class="flex items-center justify-center gap-2">
                        <svg class="w-4 h-4 text-[#60A5FA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span>Code expires in <span id="timerValue" class="font-mono font-bold text-[#60A5FA]">05:00</span></span>
                    </div>
                </div>
                
                <!-- Back to Login Link -->
                <div class="text-center">
                    <a href="#/login" class="text-sm text-[#60A5FA] hover:text-[#3B82F6] transition-all duration-300 inline-flex items-center gap-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                        </svg>
                        Back to Login
                    </a>
                </div>
            </div>
        </div>
    `;
}

// Setup OTP verification events
export function setupOTPVerification() {
    const form = document.getElementById('otpForm');
    if (!form) return;
    
    // Setup OTP inputs with auto-focus
    setupOTPInputs();
    
    // Timer
    let timeLeft = 300;
    const timerDisplay = document.getElementById('timerValue');
    const boxTimerDisplay = document.getElementById('boxTimerCount');
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
                }
                return;
            }
            
            timeLeft--;
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            if (timerDisplay) timerDisplay.textContent = timeString;
            if (boxTimerDisplay) boxTimerDisplay.textContent = timeString;
        }, 1000);
    }
    
    startTimer();
    
    // Copy OTP button
    const copyBtn = document.getElementById('copyOtpBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const otpCode = document.getElementById('otpCodeValue')?.innerText;
            if (otpCode) {
                navigator.clipboard.writeText(otpCode);
                copyBtn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';
                setTimeout(() => {
                    copyBtn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>';
                }, 2000);
            }
        });
    }
    
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
            
            if (result.token) localStorage.setItem('authToken', result.token);
            if (result.user) {
                localStorage.setItem('user', JSON.stringify(result.user));
                localStorage.setItem('userName', result.user.name);
                localStorage.setItem('userEmail', result.user.email);
            }
            
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.removeItem('pendingVerification');
            localStorage.removeItem('devOTP');
            localStorage.removeItem('otpSending');
            
            clearInterval(timerInterval);
            showOTPSuccess();
            showError('Email verified successfully!', 'success');
            
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
    
    // Clear button
    const clearBtn = document.getElementById('clearOtpBtn');
    clearBtn?.addEventListener('click', () => clearOTPInputs());
    
    // Resend OTP
    const resendBtn = document.getElementById('resendOtp');
    if (resendBtn) {
        resendBtn.addEventListener('click', async () => {
            const email = localStorage.getItem('pendingVerification');
            if (!email) return;
            
            resendBtn.disabled = true;
            const originalText = resendBtn.innerHTML;
            resendBtn.innerHTML = '<div class="loading-spinner-small inline-block mr-1"></div> Sending...';
            
            // Show sending state in OTP box
            localStorage.setItem('otpSending', 'true');
            const otpBox = document.getElementById('otpDisplayBox');
            if (otpBox) {
                otpBox.innerHTML = `
                    <div class="otp-box-left">
                        <div class="otp-box-icon">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                        </div>
                        <div class="otp-box-text">
                            <div class="otp-sending">
                                <div class="loading-spinner-small"></div>
                                <span>Sending...</span>
                            </div>
                        </div>
                    </div>
                `;
            }
            
            try {
                const result = await authAPI.resendOTP(email);
                
                if (result.otp) {
                    localStorage.setItem('devOTP', result.otp);
                    localStorage.removeItem('otpSending');
                    
                    // Update OTP box with new code
                    if (otpBox) {
                        otpBox.innerHTML = `
                            <div class="otp-box-left">
                                <div class="otp-box-icon">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                    </svg>
                                </div>
                                <div class="otp-box-text">
                                    <div class="otp-code-label">Your verification code</div>
                                    <div class="otp-code-value" id="otpCodeValue">${result.otp}</div>
                                    <div class="otp-code-timer">
                                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                        <span>Valid for <span id="boxTimerCount">05:00</span></span>
                                    </div>
                                </div>
                            </div>
                            <button class="otp-copy-btn" id="copyOtpBtn" title="Copy code">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                                </svg>
                            </button>
                        `;
                        
                        // Re-attach copy button event
                        const newCopyBtn = document.getElementById('copyOtpBtn');
                        if (newCopyBtn) {
                            newCopyBtn.addEventListener('click', () => {
                                const otpCode = document.getElementById('otpCodeValue')?.innerText;
                                if (otpCode) {
                                    navigator.clipboard.writeText(otpCode);
                                    newCopyBtn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';
                                    setTimeout(() => {
                                        newCopyBtn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>';
                                    }, 2000);
                                }
                            });
                        }
                    }
                }
                
                showError('New OTP sent!', 'success');
                
                // Reset timer
                timeLeft = 300;
                startTimer();
                
                const timerContainer = document.getElementById('otpTimer');
                if (timerContainer) {
                    timerContainer.innerHTML = `
                        <div class="flex items-center justify-center gap-2">
                            <svg class="w-4 h-4 text-[#60A5FA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span>Code expires in <span id="timerValue" class="font-mono font-bold text-[#60A5FA]">05:00</span></span>
                        </div>
                    `;
                }
                
                clearOTPInputs();
                
            } catch (error) {
                showError(error.message || 'Failed to resend OTP', 'error');
                // Restore previous OTP box if exists
                const existingOTP = localStorage.getItem('devOTP');
                if (existingOTP && otpBox) {
                    otpBox.innerHTML = `
                        <div class="otp-box-left">
                            <div class="otp-box-icon">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                </svg>
                            </div>
                            <div class="otp-box-text">
                                <div class="otp-code-label">Your verification code</div>
                                <div class="otp-code-value" id="otpCodeValue">${existingOTP}</div>
                                <div class="otp-code-timer">
                                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    <span>Valid for <span id="boxTimerCount">05:00</span></span>
                                </div>
                            </div>
                        </div>
                        <button class="otp-copy-btn" id="copyOtpBtn" title="Copy code">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                            </svg>
                        </button>
                    `;
                }
            } finally {
                resendBtn.disabled = false;
                resendBtn.innerHTML = originalText;
            }
        });
    }
}

// Add CSS for OTP Display Box
const otpBoxStyles = `
    /* OTP Display Box */
    .otp-display-box {
        background: linear-gradient(135deg, #14532d 0%, #166534 100%);
        border: 1px solid #22c55e;
        border-radius: 16px;
        padding: 16px 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 20px 0;
        box-shadow: 0 4px 15px rgba(34, 197, 94, 0.2);
    }
    
    .otp-box-left {
        display: flex;
        align-items: center;
        gap: 14px;
        flex: 1;
    }
    
    .otp-box-icon {
        background: rgba(34, 197, 94, 0.2);
        border-radius: 12px;
        padding: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #86efac;
    }
    
    .otp-box-text {
        flex: 1;
    }
    
    .otp-code-label {
        font-size: 12px;
        color: #bbf7d0;
        margin-bottom: 4px;
        letter-spacing: 0.5px;
    }
    
    .otp-code-value {
        font-size: 28px;
        font-family: monospace;
        font-weight: bold;
        letter-spacing: 4px;
        color: #86efac;
        background: rgba(0, 0, 0, 0.2);
        display: inline-block;
        padding: 2px 12px;
        border-radius: 10px;
    }
    
    .otp-code-timer {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 11px;
        color: #86efac;
        margin-top: 6px;
    }
    
    .otp-code-timer span {
        font-family: monospace;
        font-weight: 600;
        color: #facc15;
    }
    
    .otp-sending {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #bbf7d0;
        font-size: 14px;
    }
    
    .otp-waiting {
        color: #86efac;
        font-size: 14px;
    }
    
    .otp-copy-btn {
        background: rgba(255, 255, 255, 0.1);
        border: none;
        border-radius: 10px;
        padding: 8px;
        cursor: pointer;
        color: #bbf7d0;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .otp-copy-btn:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: scale(1.05);
    }
    
    /* Loading Spinner */
    .loading-spinner-small {
        width: 18px;
        height: 18px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
        display: inline-block;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    
    /* OTP Input Styles */
    .otp-digit {
        transition: all 0.2s;
        width: 52px;
        height: 52px;
        text-align: center;
        font-size: 24px;
        font-weight: bold;
        background: #111827;
        border: 2px solid #3B82F6;
        border-radius: 12px;
        color: #E5E7EB;
    }
    
    .otp-digit:focus {
        outline: none;
        border-color: #A78BFA;
        box-shadow: 0 0 0 2px rgba(167, 139, 250, 0.3);
        transform: scale(1.02);
    }
    
    .scale-105 {
        transform: scale(1.05);
    }
    
    .animate-shake {
        animation: shake 0.5s ease-in-out;
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;

if (!document.querySelector('#otp-box-styles')) {
    const style = document.createElement('style');
    style.id = 'otp-box-styles';
    style.textContent = otpBoxStyles;
    document.head.appendChild(style);
}