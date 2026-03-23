// frontend/src/pages/VerifyOTPPage.js
import { authAPI } from '../services/auth.js';
import { showError, showSuccess } from '../components/common/ErrorMessage.js';

export function VerifyOTPPage() {
    const email = localStorage.getItem('pendingVerification') || '';
    
    return `
        <div class="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#111827] to-[#0F172A] py-12 px-4">
            <div class="max-w-md w-full relative">
                <!-- Header -->
                <div class="text-center mb-8">
                    <div class="mx-auto w-16 h-16 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-2xl flex items-center justify-center mb-4 animate-pulse-glow">
                        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h2 class="text-2xl font-bold text-white">Verify Your Email</h2>
                    <p class="text-gray-400 mt-2">We've sent a 6-digit verification code to</p>
                    <p class="text-[#60A5FA] font-medium">${email}</p>
                </div>

                <!-- OTP 3D BOX - Premium Design with Image -->
                <div id="otpDisplayBox" class="otp-3d-box">
                    <div class="otp-3d-inner">
                        <!-- Custom Image Section -->
                        <div class="otp-3d-image-container">
                            <div class="otp-3d-image-wrapper">
                                <img id="otpCustomImage" 
                                     src="public/favicon.ico" 
                                     alt="OTP Icon" 
                                     class="otp-3d-image"
                                     onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%2386efac\'%3E%3Cpath d=\'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15h-2v-2h2v2zm0-4h-2V7h2v6z\'/%3E%3C/svg%3E'">
                            </div>
                            <div class="otp-3d-glow"></div>
                        </div>
                        
                        <div class="otp-3d-content">
                            <div class="otp-3d-label">
                                <span class="otp-3d-label-text">VERIFICATION CODE</span>
                                <div class="otp-3d-label-line"></div>
                            </div>
                            <div class="otp-3d-code" id="otpCodeValue">
                                <span class="otp-code-digit">•</span>
                                <span class="otp-code-digit">•</span>
                                <span class="otp-code-digit">•</span>
                                <span class="otp-code-digit">•</span>
                                <span class="otp-code-digit">•</span>
                                <span class="otp-code-digit">•</span>
                            </div>
                            <div class="otp-3d-timer">
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Valid for <span id="premiumTimer">05:00</span></span>
                            </div>
                        </div>
                        
                        <button class="otp-3d-copy-btn" id="copyOtpBtn" title="Copy code">
                            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <span class="copy-tooltip">Copy</span>
                        </button>
                    </div>
                    <div class="otp-3d-shine"></div>
                </div>

                <!-- Error Message -->
                <div id="errorMessage" class="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm text-center hidden"></div>

                <!-- Success Message -->
                <div id="successMessage" class="mb-4 p-3 bg-green-500/20 border border-green-500 rounded-lg text-green-400 text-sm text-center hidden"></div>

                <!-- OTP Input Form -->
                <form id="otpForm" onsubmit="return false;">
                    <div class="flex justify-center gap-2 mb-6" id="otpInputsContainer">
                        ${Array(6).fill(0).map((_, i) => `
                            <input type="text" 
                                   maxlength="1" 
                                   id="otp-${i}"
                                   class="otp-digit-input"
                                   autocomplete="off"
                                   inputmode="numeric">
                        `).join('')}
                    </div>

                    <button type="submit" 
                            id="verifyBtn"
                            class="w-full bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] hover:from-[#60A5FA] hover:to-[#8B5CF6] text-white py-3 rounded-xl font-medium transition-all transform hover:scale-105 hover:shadow-xl">
                        Verify Email
                    </button>
                </form>

                <!-- Resend Section -->
                <div class="text-center mt-6">
                    <p class="text-gray-400 text-sm">Didn't receive the code?</p>
                    <div class="flex justify-center gap-4 mt-2">
                        <button id="resendBtn" class="text-[#60A5FA] hover:text-[#3B82F6] text-sm transition-all hover:scale-105">
                            Resend Code
                        </button>
                        <span class="text-gray-600">|</span>
                        <a href="#/register" class="text-[#A78BFA] hover:text-[#3B82F6] text-sm transition-all hover:scale-105">
                            Change Email
                        </a>
                    </div>
                </div>

                <!-- Timer Display -->
                <div class="text-center mt-6">
                    <div class="inline-flex items-center gap-2 text-sm text-gray-400 bg-[#1F2937] px-4 py-2 rounded-lg">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Code expires in <span id="timerValue" class="font-mono text-[#60A5FA]">05:00</span></span>
                    </div>
                </div>

                <!-- Back to Login -->
                <div class="text-center mt-6">
                    <a href="#/login" class="text-[#60A5FA] hover:text-[#3B82F6] text-sm inline-flex items-center gap-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Login
                    </a>
                </div>
            </div>
        </div>
    `;
}

export function setupVerifyOTP() {
    const form = document.getElementById('otpForm');
    if (!form) return;
    
    const verifyBtn = document.getElementById('verifyBtn');
    const resendBtn = document.getElementById('resendBtn');
    const errorDiv = document.getElementById('errorMessage');
    const successDiv = document.getElementById('successMessage');
    const timerDisplay = document.getElementById('timerValue');
    const premiumTimerDisplay = document.getElementById('premiumTimer');
    const otpCodeDisplay = document.getElementById('otpCodeValue');
    
    if (!form) return;
    
    const email = localStorage.getItem('pendingVerification');
    let currentOTP = '';
    let isResending = false;
    let resendCooldown = 0;
    let resendInterval;
    let otpFetched = false;
    
    if (!email) {
        window.location.hash = '#/register';
        return;
    }
    
    let timeLeft = 300;
    let timerInterval;
    
    function updateTimer() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (timerDisplay) timerDisplay.textContent = timeString;
        if (premiumTimerDisplay) premiumTimerDisplay.textContent = timeString;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            if (verifyBtn) verifyBtn.disabled = true;
            showErrorMessage('OTP has expired. Please request a new one.');
            if (otpCodeDisplay) {
                otpCodeDisplay.innerHTML = '<span class="otp-expired-digit">EXPIRED</span>';
            }
        }
    }
    
    function startTimer() {
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateTimer();
            } else {
                clearInterval(timerInterval);
            }
        }, 1000);
    }
    
    startTimer();
    updateTimer();
    
    function showErrorMessage(message) {
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.classList.remove('hidden');
            setTimeout(() => {
                errorDiv.classList.add('hidden');
            }, 5000);
        }
        showError(message, 'error');
    }
    
    function showSuccessMessage(message) {
        if (successDiv) {
            successDiv.textContent = message;
            successDiv.classList.remove('hidden');
            setTimeout(() => {
                successDiv.classList.add('hidden');
            }, 3000);
        }
        showSuccess(message, 'success');
    }
    
    function updateOTPDisplay(otp) {
        if (!otpCodeDisplay) return;
        
        const digits = otp.toString().split('');
        otpCodeDisplay.innerHTML = digits.map(d => `<span class="otp-code-digit animate-pop-digit">${d}</span>`).join('');
    }
    
    function setupOTPInputs() {
        const inputs = document.querySelectorAll('.otp-digit-input');
        if (inputs.length === 0) return;
        
        inputs[0].focus();
        
        inputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
                
                // Add animation
                e.target.classList.add('animate-pulse-border');
                setTimeout(() => {
                    e.target.classList.remove('animate-pulse-border');
                }, 200);
                
                if (e.target.value.length === 1 && index < inputs.length - 1) {
                    inputs[index + 1].focus();
                }
                
                const allFilled = Array.from(inputs).every(inp => inp.value.length === 1);
                if (allFilled) {
                    verifyOTP();
                }
            });
            
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace') {
                    if (!e.target.value && index > 0) {
                        inputs[index - 1].focus();
                        inputs[index - 1].select();
                        e.preventDefault();
                    } else if (e.target.value) {
                        e.target.value = '';
                        e.preventDefault();
                    }
                }
            });
            
            input.addEventListener('paste', (e) => {
                if (index === 0) {
                    e.preventDefault();
                    const pasteData = e.clipboardData.getData('text').replace(/[^0-9]/g, '');
                    
                    if (pasteData.length === 6) {
                        pasteData.split('').forEach((char, i) => {
                            if (inputs[i]) inputs[i].value = char;
                        });
                        inputs[5].focus();
                        verifyOTP();
                    }
                }
            });
        });
    }
    
    function getOTPValue() {
        const inputs = document.querySelectorAll('.otp-digit-input');
        return Array.from(inputs).map(input => input.value).join('');
    }
    
    function clearOTPInputs() {
        const inputs = document.querySelectorAll('.otp-digit-input');
        inputs.forEach(input => { input.value = ''; });
        if (inputs[0]) inputs[0].focus();
    }
    
    async function verifyOTP() {
        const otp = getOTPValue();
        
        if (otp.length !== 6) {
            showErrorMessage('Please enter complete 6-digit OTP');
            return;
        }
        
        if (verifyBtn) {
            verifyBtn.disabled = true;
            verifyBtn.innerHTML = '<div class="loading-spinner-small mx-auto"></div> Verifying...';
        }
        
        try {
            const result = await authAPI.verifyOTP(email, otp);
            
            if (result.success && result.token) {
                const userName = localStorage.getItem('pendingUserName') || result.user?.name || email.split('@')[0];
                
                localStorage.setItem('token', result.token);
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('userName', userName);
                localStorage.setItem('userEmail', email);
                localStorage.setItem('user', JSON.stringify({
                    id: result.user?.id,
                    name: userName,
                    email: email
                }));
                
                localStorage.removeItem('pendingVerification');
                localStorage.removeItem('pendingUserName');
                localStorage.removeItem('devOTP');
                
                clearInterval(timerInterval);
                showSuccessMessage('Email verified successfully! Redirecting...');
                
                setTimeout(() => {
                    window.location.hash = '#/dashboard';
                }, 1500);
            } else {
                throw new Error(result.error || 'Verification failed');
            }
            
        } catch (err) {
            console.error('Verification failed:', err);
            showErrorMessage(err.message || 'Invalid OTP. Please try again.');
            clearOTPInputs();
        } finally {
            if (verifyBtn) {
                verifyBtn.disabled = false;
                verifyBtn.innerHTML = 'Verify Email';
            }
        }
    }
    
    async function resendOTP() {
        if (resendCooldown > 0) {
            showErrorMessage(`Please wait ${resendCooldown} seconds before resending`);
            return;
        }
        
        if (isResending) return;
        isResending = true;
        
        if (resendBtn) {
            resendBtn.disabled = true;
            resendBtn.innerHTML = '<div class="loading-spinner-small inline-block mr-1"></div> Sending...';
        }
        
        try {
            const result = await authAPI.resendOTP(email);
            
            if (result && result.success) {
                if (result.otp) {
                    currentOTP = result.otp;
                    localStorage.setItem('devOTP', result.otp);
                    otpFetched = true;
                    updateOTPDisplay(result.otp);
                }
                
                showSuccessMessage(result.message || 'New OTP sent to your email!');
                
                timeLeft = 300;
                startTimer();
                updateTimer();
                
                resendCooldown = 60;
                if (resendBtn) resendBtn.textContent = `Resend in ${resendCooldown}s`;
                
                if (resendInterval) clearInterval(resendInterval);
                resendInterval = setInterval(() => {
                    resendCooldown--;
                    if (resendCooldown <= 0) {
                        clearInterval(resendInterval);
                        if (resendBtn) {
                            resendBtn.disabled = false;
                            resendBtn.innerHTML = 'Resend Code';
                        }
                        isResending = false;
                    } else if (resendBtn) {
                        resendBtn.textContent = `Resend in ${resendCooldown}s`;
                    }
                }, 1000);
                
                clearOTPInputs();
            } else {
                throw new Error(result?.error || 'Failed to resend OTP');
            }
            
        } catch (err) {
            console.error('Resend OTP error:', err);
            showErrorMessage(err.message || 'Failed to resend OTP');
            if (resendBtn) {
                resendBtn.disabled = false;
                resendBtn.innerHTML = 'Resend Code';
            }
            isResending = false;
        }
    }
    
    const copyBtn = document.getElementById('copyOtpBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            let otpCode = currentOTP;
            
            if (!otpCode) {
                const otpDigits = document.querySelectorAll('.otp-code-digit');
                if (otpDigits.length === 6) {
                    otpCode = Array.from(otpDigits).map(d => d.textContent).join('');
                }
            }
            
            if (otpCode && otpCode.match(/^\d{6}$/)) {
                navigator.clipboard.writeText(otpCode).then(() => {
                    const tooltip = copyBtn.querySelector('.copy-tooltip');
                    const originalText = tooltip?.textContent;
                    if (tooltip) {
                        tooltip.textContent = 'Copied!';
                        tooltip.classList.add('copy-success');
                        setTimeout(() => {
                            tooltip.textContent = originalText;
                            tooltip.classList.remove('copy-success');
                        }, 1500);
                    }
                    showSuccessMessage('OTP copied to clipboard!');
                }).catch(() => {
                    showErrorMessage('Failed to copy OTP');
                });
            } else {
                showErrorMessage('No OTP available. Click "Resend Code" first.');
            }
        });
    }
    
    async function autoFetchOTP() {
        if (otpFetched) return;
        
        try {
            const result = await authAPI.resendOTP(email);
            
            if (result && result.success && result.otp) {
                currentOTP = result.otp;
                localStorage.setItem('devOTP', result.otp);
                otpFetched = true;
                updateOTPDisplay(result.otp);
            }
        } catch (error) {
            console.log('Auto-fetch failed');
        }
    }
    
    autoFetchOTP();
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        verifyOTP();
    });
    
    if (resendBtn) {
        const newResendBtn = resendBtn.cloneNode(true);
        resendBtn.parentNode.replaceChild(newResendBtn, resendBtn);
        newResendBtn.addEventListener('click', resendOTP);
    }
    
    setupOTPInputs();
}