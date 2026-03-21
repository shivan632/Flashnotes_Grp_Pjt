// frontend/src/components/auth/OTPInput.js
// OTP Input Component - Improved UI with animations

export function OTPInput(index, value = '') {
    return `
        <input type="text" 
               maxlength="1" 
               id="otp-input-${index}"
               class="otp-digit w-12 h-12 sm:w-14 sm:h-14 text-center text-2xl sm:text-3xl font-bold 
                      bg-[#111827] border-2 border-[#3B82F6] rounded-xl 
                      focus:outline-none focus:border-[#A78BFA] focus:ring-2 focus:ring-[#A78BFA]/50 
                      text-[#E5E7EB] transition-all duration-200 
                      hover:border-[#60A5FA] hover:shadow-lg hover:shadow-[#3B82F6]/20
                      disabled:opacity-50 disabled:cursor-not-allowed" 
               data-index="${index}"
               value="${value}"
               autocomplete="off"
               inputmode="numeric"
               pattern="[0-9]*">
    `;
}

// Setup OTP input behavior with enhanced UX
export function setupOTPInputs() {
    const inputs = document.querySelectorAll('.otp-digit');
    
    if (inputs.length === 0) return;
    
    // Focus first input on load
    inputs[0].focus();
    
    inputs.forEach((input, index) => {
        // Handle input - only numbers
        input.addEventListener('input', (e) => {
            // Allow only numbers
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
            
            // Add animation class
            e.target.classList.add('scale-105', 'border-[#A78BFA]');
            setTimeout(() => {
                e.target.classList.remove('scale-105', 'border-[#A78BFA]');
            }, 150);
            
            // Auto-advance to next input
            if (e.target.value.length === 1 && index < inputs.length - 1) {
                inputs[index + 1].focus();
                inputs[index + 1].select();
            }
            
            // Auto-submit when all digits filled
            const allFilled = Array.from(inputs).every(inp => inp.value.length === 1);
            if (allFilled) {
                // Trigger submit event
                const form = document.getElementById('otpForm');
                if (form) {
                    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
                    form.dispatchEvent(submitEvent);
                }
            }
        });
        
        // Handle backspace
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace') {
                if (!e.target.value && index > 0) {
                    // Move to previous input
                    inputs[index - 1].focus();
                    inputs[index - 1].select();
                    e.preventDefault();
                } else if (e.target.value) {
                    // Clear current input
                    e.target.value = '';
                    e.preventDefault();
                }
            }
            
            // Handle left arrow key
            if (e.key === 'ArrowLeft' && index > 0) {
                inputs[index - 1].focus();
                inputs[index - 1].select();
                e.preventDefault();
            }
            
            // Handle right arrow key
            if (e.key === 'ArrowRight' && index < inputs.length - 1) {
                inputs[index + 1].focus();
                inputs[index + 1].select();
                e.preventDefault();
            }
        });
        
        // Handle paste
        input.addEventListener('paste', (e) => {
            e.preventDefault();
            const pasteData = e.clipboardData.getData('text').replace(/[^0-9]/g, '');
            
            if (pasteData.length === 6) {
                // Fill all inputs with pasted OTP
                inputs.forEach((inp, i) => {
                    if (i < pasteData.length) {
                        inp.value = pasteData[i];
                        // Add animation to each filled input
                        inp.classList.add('scale-105', 'border-[#A78BFA]');
                        setTimeout(() => {
                            inp.classList.remove('scale-105', 'border-[#A78BFA]');
                        }, 150);
                    }
                });
                inputs[5].focus();
                inputs[5].select();
                
                // Auto-submit after paste
                setTimeout(() => {
                    const form = document.getElementById('otpForm');
                    if (form) {
                        const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
                        form.dispatchEvent(submitEvent);
                    }
                }, 100);
            }
        });
        
        // Handle focus - select all text
        input.addEventListener('focus', () => {
            input.select();
        });
        
        // Add hover effect
        input.addEventListener('mouseenter', () => {
            if (!input.value) {
                input.classList.add('border-[#60A5FA]', 'shadow-lg');
            }
        });
        
        input.addEventListener('mouseleave', () => {
            if (!input.value) {
                input.classList.remove('border-[#60A5FA]', 'shadow-lg');
            }
        });
    });
}

// Get OTP value from inputs
export function getOTPValue() {
    const inputs = document.querySelectorAll('.otp-digit');
    return Array.from(inputs).map(input => input.value).join('');
}

// Clear OTP inputs
export function clearOTPInputs() {
    const inputs = document.querySelectorAll('.otp-digit');
    inputs.forEach(input => {
        input.value = '';
        input.classList.remove('border-[#A78BFA]', 'scale-105');
    });
    if (inputs.length > 0) {
        inputs[0].focus();
    }
}

// Set OTP value (for testing)
export function setOTPValue(otp) {
    const digits = otp.toString().split('');
    const inputs = document.querySelectorAll('.otp-digit');
    
    inputs.forEach((input, index) => {
        if (digits[index]) {
            input.value = digits[index];
            input.classList.add('scale-105', 'border-[#A78BFA]');
            setTimeout(() => {
                input.classList.remove('scale-105', 'border-[#A78BFA]');
            }, 150);
        } else {
            input.value = '';
        }
    });
}

// Show error state on inputs
export function showOTPError() {
    const inputs = document.querySelectorAll('.otp-digit');
    inputs.forEach(input => {
        input.classList.add('border-red-500', 'animate-shake');
        setTimeout(() => {
            input.classList.remove('border-red-500', 'animate-shake');
        }, 500);
    });
}

// Show success state on inputs
export function showOTPSuccess() {
    const inputs = document.querySelectorAll('.otp-digit');
    inputs.forEach(input => {
        input.classList.add('border-green-500');
        setTimeout(() => {
            input.classList.remove('border-green-500');
        }, 1000);
    });
}