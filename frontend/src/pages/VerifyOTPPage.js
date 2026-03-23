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
                    <div class="mx-auto w-16 h-16 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-2xl flex items-center justify-center mb-4">
                        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h2 class="text-2xl font-bold text-white">Verify Your Email</h2>
                    <p class="text-gray-400 mt-2">We've sent a 6-digit verification code to</p>
                    <p class="text-[#60A5FA] font-medium">${email}</p>
                </div>

                <!-- OTP DISPLAY BOX -->
                <div id="otpDisplayBox" class="otp-display-box-final">
                    <div class="otp-display-content-final">
                        <div class="otp-display-icon-final">
                            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div class="otp-display-text-final">
                            <div class="otp-display-label-final">YOUR VERIFICATION CODE</div>
                            <div class="otp-display-code-final" id="otpCodeValue">
                                <span class="otp-loading">Loading...</span>
                            </div>
                            <div class="otp-display-timer-final">
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Valid for <span id="boxTimer">05:00</span></span>
                            </div>
                        </div>
                        <button class="otp-display-copy-final" id="copyOtpBtn" title="Copy code">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </button>
                    </div>
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
                                   class="otp-digit w-12 h-12 sm:w-14 sm:h-14 text-center text-2xl font-bold bg-[#111827] border-2 border-[#3B82F6] rounded-xl focus:outline-none focus:border-[#A78BFA] focus:ring-2 focus:ring-[#A78BFA]/50 text-white transition-all"
                                   autocomplete="off"
                                   inputmode="numeric">
                        `).join('')}
                    </div>

                    <button type="submit" 
                            id="verifyBtn"
                            class="w-full bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] hover:from-[#60A5FA] hover:to-[#8B5CF6] text-white py-3 rounded-xl font-medium transition-all">
                        Verify Email
                    </button>
                </form>

                <!-- Resend Section -->
                <div class="text-center mt-6">
                    <p class="text-gray-400 text-sm">Didn't receive the code?</p>
                    <div class="flex justify-center gap-4 mt-2">
                        <button id="resendBtn" class="text-[#60A5FA] hover:text-[#3B82F6] text-sm">
                            Resend Code
                        </button>
                        <span class="text-gray-600">|</span>
                        <a href="#/register" class="text-[#A78BFA] hover:text-[#3B82F6] text-sm">
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
    const boxTimerDisplay = document.getElementById('boxTimer');
    const otpCodeDisplay = document.getElementById('otpCodeValue');
    
    if (!form) return;
    
    const email = localStorage.getItem('pendingVerification');
    let currentOTP = localStorage.getItem('devOTP') || '';
    let isFetching = false;
    let isResending = false;
    let otpFetched = false;
    
    if (!email) {
        window.location.hash = '#/register';
        return;
    }
    
    // Display OTP from localStorage if available
    if (currentOTP && otpCodeDisplay) {
        const formattedOTP = currentOTP.split('').join(' ');
        otpCodeDisplay.innerHTML = `<span class="otp-digits" data-otp="${currentOTP}">${formattedOTP}</span>`;
        otpFetched = true;
        console.log('✅ OTP loaded from localStorage:', currentOTP);
    }
    
    // Fetch OTP from backend using resend API
    async function fetchOTPFromBackend() {
        if (isFetching || otpFetched) {
            console.log('⚠️ Already fetching or OTP already fetched');
            return false;
        }
        
        isFetching = true;
        
        try {
            console.log('📡 Fetching OTP from backend for:', email);
            
            if (otpCodeDisplay) {
                otpCodeDisplay.innerHTML = '<span class="otp-loading">Fetching...</span>';
            }
            
            const result = await authAPI.resendOTP(email);
            
            console.log('📡 Fetch OTP result:', result);
            
            if (result && result.success && result.otp) {
                currentOTP = result.otp;
                localStorage.setItem('devOTP', result.otp);
                otpFetched = true;
                
                if (otpCodeDisplay) {
                    const formattedOTP = result.otp.split('').join(' ');
                    otpCodeDisplay.innerHTML = `<span class="otp-digits" data-otp="${result.otp}">${formattedOTP}</span>`;
                    otpCodeDisplay.classList.add('animate-pop');
                    setTimeout(() => {
                        otpCodeDisplay.classList.remove('animate-pop');
                    }, 500);
                }
                
                console.log('✅ OTP fetched successfully:', result.otp);
                return true;
            } else {
                console.error('Failed to fetch OTP:', result?.error);
                if (otpCodeDisplay) {
                    otpCodeDisplay.innerHTML = '<span class="otp-error">Click "Resend Code"</span>';
                }
                return false;
            }
        } catch (error) {
            console.error('Error fetching OTP:', error);
            if (otpCodeDisplay) {
                otpCodeDisplay.innerHTML = '<span class="otp-error">Click "Resend Code"</span>';
            }
            return false;
        } finally {
            isFetching = false;
        }
    }
    
    // Try to fetch OTP if not already available
    if (!currentOTP && !otpFetched) {
        fetchOTPFromBackend();
    }
    
    let timeLeft = 300;
    let timerInterval;
    let resendCooldown = 0;
    let resendInterval;
    
    function updateTimer() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (timerDisplay) timerDisplay.textContent = timeString;
        if (boxTimerDisplay) boxTimerDisplay.textContent = timeString;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            if (verifyBtn) verifyBtn.disabled = true;
            showErrorMessage('OTP has expired. Please request a new one.');
            if (otpCodeDisplay) otpCodeDisplay.innerHTML = '<span class="otp-expired">EXPIRED</span>';
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
    
    function setupOTPInputs() {
        const inputs = document.querySelectorAll('.otp-digit');
        if (inputs.length === 0) return;
        
        inputs[0].focus();
        
        inputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
                
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
        const inputs = document.querySelectorAll('.otp-digit');
        return Array.from(inputs).map(input => input.value).join('');
    }
    
    function clearOTPInputs() {
        const inputs = document.querySelectorAll('.otp-digit');
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
        // Prevent multiple resend requests
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
            
            console.log('📡 Resend OTP result:', result);
            
            if (result && result.success) {
                if (result.otp) {
                    currentOTP = result.otp;
                    localStorage.setItem('devOTP', result.otp);
                    otpFetched = true;
                    
                    if (otpCodeDisplay) {
                        const formattedOTP = result.otp.split('').join(' ');
                        otpCodeDisplay.innerHTML = `<span class="otp-digits" data-otp="${result.otp}">${formattedOTP}</span>`;
                        otpCodeDisplay.classList.add('animate-pop');
                        setTimeout(() => {
                            otpCodeDisplay.classList.remove('animate-pop');
                        }, 500);
                    }
                }
                
                showSuccessMessage(result.message || 'New OTP sent to your email!');
                
                // Reset timer
                timeLeft = 300;
                startTimer();
                updateTimer();
                
                // Set cooldown (60 seconds)
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
    
    // Copy OTP button - FIXED
    const copyBtn = document.getElementById('copyOtpBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            let otpCode = currentOTP;
            
            // Try to get from data attribute
            if (!otpCode) {
                const otpSpan = document.querySelector('.otp-digits');
                if (otpSpan) {
                    otpCode = otpSpan.getAttribute('data-otp');
                }
            }
            
            // Try to get from text content
            if (!otpCode) {
                const otpSpan = document.querySelector('.otp-digits');
                if (otpSpan) {
                    const text = otpSpan.textContent;
                    otpCode = text.replace(/\s/g, '');
                }
            }
            
            if (otpCode && otpCode !== 'Loading...' && otpCode !== 'Fetching...' && 
                otpCode !== 'Click "Resend Code"' && otpCode !== 'EXPIRED' && 
                otpCode !== 'Retry' && otpCode.match(/^\d{6}$/)) {
                
                navigator.clipboard.writeText(otpCode).then(() => {
                    const originalHTML = copyBtn.innerHTML;
                    copyBtn.innerHTML = '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';
                    copyBtn.classList.add('text-green-400');
                    
                    setTimeout(() => {
                        copyBtn.innerHTML = originalHTML;
                        copyBtn.classList.remove('text-green-400');
                    }, 2000);
                    
                    showSuccessMessage('OTP copied to clipboard!');
                }).catch(() => {
                    showErrorMessage('Failed to copy OTP');
                });
            } else {
                showErrorMessage('No OTP available to copy. Please click "Resend Code" first.');
            }
        });
    }
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        verifyOTP();
    });
    
    if (resendBtn) {
        resendBtn.addEventListener('click', resendOTP);
    }
    
    setupOTPInputs();
}