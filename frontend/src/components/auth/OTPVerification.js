// frontend/src/components/auth/OTPVerification.js
import { OTPInput, setupOTPInputs, getOTPValue, clearOTPInputs, showOTPError, showOTPSuccess } from './OTPInput.js';
import { authAPI } from '../../services/api.js';
import { showError } from '../common/ErrorMessage.js';

export function OTPVerification() {
    const email = localStorage.getItem('pendingVerification') || 'your email';
    const devOTP = localStorage.getItem('devOTP') || '';
    
    return `
        <div class="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#111827] to-[#0F172A] py-12 px-4">
            <div class="max-w-md w-full relative">
                <!-- Header -->
                <div class="text-center mb-8">
                    <div class="mx-auto w-16 h-16 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-2xl flex items-center justify-center mb-4">
                        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                    </div>
                    <h2 class="text-2xl font-bold text-white">Verify Your Email</h2>
                    <p class="text-gray-400 mt-2">We've sent a 6-digit verification code to</p>
                    <p class="text-[#60A5FA] font-medium">${email}</p>
                </div>
                
                <!-- OTP Box - Right Side Position -->
                ${devOTP ? `
                <div class="otp-side-box" id="otpSideBox">
                    <div class="otp-side-content">
                        <div class="otp-side-code" id="otpCodeDisplay">${devOTP}</div>
                        <button class="otp-side-copy" id="copySideOtpBtn" title="Copy code">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                            </svg>
                        </button>
                    </div>
                    <div class="otp-side-timer">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span>Expires in <span id="sideTimer">05:00</span></span>
                    </div>
                </div>
                ` : ''}
                
                <!-- OTP Input Form -->
                <form id="otpForm" onsubmit="return false;">
                    <div class="flex justify-center gap-2 mb-6">
                        ${Array(6).fill(0).map((_, i) => OTPInput(i)).join('')}
                    </div>
                    
                    <button type="submit" 
                            id="verifyOtpBtn"
                            class="w-full bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] hover:from-[#60A5FA] hover:to-[#8B5CF6] text-white py-3 rounded-xl font-medium transition-all">
                        Verify Email
                    </button>
                </form>
                
                <!-- Resend Section -->
                <div class="text-center mt-6">
                    <p class="text-gray-400 text-sm">Didn't receive the code?</p>
                    <div class="flex justify-center gap-4 mt-2">
                        <button id="resendOtp" class="text-[#60A5FA] hover:text-[#3B82F6] text-sm">Resend Code</button>
                        <span class="text-gray-600">|</span>
                        <a href="#/register" class="text-[#A78BFA] hover:text-[#3B82F6] text-sm">Change Email</a>
                    </div>
                </div>
                
                <!-- Timer -->
                <div class="text-center mt-6">
                    <div class="inline-flex items-center gap-2 text-sm text-gray-400 bg-[#1F2937] px-4 py-2 rounded-lg">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span>Code expires in <span id="timerValue" class="font-mono text-[#60A5FA]">05:00</span></span>
                    </div>
                </div>
                
                <!-- Back to Login -->
                <div class="text-center mt-6">
                    <a href="#/login" class="text-[#60A5FA] hover:text-[#3B82F6] text-sm inline-flex items-center gap-1">
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
    
    // Setup OTP inputs
    setupOTPInputs();
    
    // Timer
    let timeLeft = 300;
    const timerDisplay = document.getElementById('timerValue');
    const sideTimerDisplay = document.getElementById('sideTimer');
    let timerInterval;
    
    function startTimer() {
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                const timerContainer = document.getElementById('timerValue')?.parentElement?.parentElement;
                if (timerContainer) {
                    timerContainer.innerHTML = `
                        <div class="flex items-center justify-center gap-2 text-red-500">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span>Code expired</span>
                        </div>
                    `;
                }
                const sideBox = document.getElementById('otpSideBox');
                if (sideBox) sideBox.style.opacity = '0.5';
                return;
            }
            
            timeLeft--;
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            if (timerDisplay) timerDisplay.textContent = timeString;
            if (sideTimerDisplay) sideTimerDisplay.textContent = timeString;
        }, 1000);
    }
    
    startTimer();
    
    // Copy OTP from side box
    const copyBtn = document.getElementById('copySideOtpBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const otpCode = document.getElementById('otpCodeDisplay')?.innerText;
            if (otpCode) {
                navigator.clipboard.writeText(otpCode);
                const originalHTML = copyBtn.innerHTML;
                copyBtn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';
                setTimeout(() => {
                    copyBtn.innerHTML = originalHTML;
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
            
            clearInterval(timerInterval);
            showOTPSuccess();
            showError('Email verified successfully!', 'success');
            
            setTimeout(() => {
                window.location.hash = '#/dashboard';
            }, 1500);
            
        } catch (error) {
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
            
            try {
                const result = await authAPI.resendOTP(email);
                
                if (result.otp) {
                    localStorage.setItem('devOTP', result.otp);
                    window.location.reload();
                }
                
                showError('New OTP sent! Check the side box.', 'success');
                
            } catch (error) {
                showError(error.message || 'Failed to resend OTP', 'error');
            } finally {
                resendBtn.disabled = false;
                resendBtn.innerHTML = originalText;
            }
        });
    }
}

// Add CSS
const styles = `
    /* Side OTP Box - Positioned on Right */
    .otp-side-box {
        position: absolute;
        top: 20px;
        right: -120px;
        background: linear-gradient(135deg, #14532d 0%, #166534 100%);
        border: 1px solid #22c55e;
        border-radius: 12px;
        padding: 12px 16px;
        min-width: 140px;
        box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3);
        animation: slideInRight 0.3s ease-out;
    }
    
    .otp-side-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
    }
    
    .otp-side-code {
        font-size: 28px;
        font-family: monospace;
        font-weight: bold;
        letter-spacing: 4px;
        color: #86efac;
    }
    
    .otp-side-copy {
        background: rgba(255, 255, 255, 0.1);
        border: none;
        border-radius: 8px;
        padding: 6px;
        cursor: pointer;
        color: #bbf7d0;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .otp-side-copy:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: scale(1.05);
    }
    
    .otp-side-timer {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 10px;
        color: #86efac;
        margin-top: 8px;
        justify-content: center;
    }
    
    .otp-side-timer span {
        font-family: monospace;
        font-weight: 600;
        color: #facc15;
    }
    
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
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
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    
    .otp-digit {
        width: 52px;
        height: 52px;
        text-align: center;
        font-size: 24px;
        font-weight: bold;
        background: #111827;
        border: 2px solid #3B82F6;
        border-radius: 12px;
        color: #E5E7EB;
        transition: all 0.2s;
    }
    
    .otp-digit:focus {
        outline: none;
        border-color: #A78BFA;
        transform: scale(1.02);
    }
    
    /* Responsive */
    @media (max-width: 768px) {
        .otp-side-box {
            position: static;
            margin-bottom: 20px;
            max-width: 200px;
            margin-left: auto;
            margin-right: auto;
        }
    }
`;

if (!document.querySelector('#flashnotes-styles')) {
    const style = document.createElement('style');
    style.id = 'flashnotes-styles';
    style.textContent = styles;
    document.head.appendChild(style);
}