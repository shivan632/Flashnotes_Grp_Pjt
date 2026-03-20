// OTP Input Component - Reusable OTP input field

export function OTPInput(index, value = '') {
    return `
        <input type="text" 
               maxlength="1" 
               class="w-12 h-12 text-center text-2xl bg-[#111827] border-2 border-[#3B82F6] rounded-lg focus:outline-none focus:border-[#A78BFA] text-[#E5E7EB] otp-input" 
               data-index="${index}"
               value="${value}"
               autocomplete="off"
               inputmode="numeric"
               pattern="[0-9]*">
    `;
}

// Setup OTP input behavior
export function setupOTPInputs() {
    const inputs = document.querySelectorAll('.otp-input');
    
    inputs.forEach((input, index) => {
        // Handle input
        input.addEventListener('input', (e) => {
            // Allow only numbers
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
            
            if (e.target.value.length === 1 && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
        });
        
        // Handle backspace
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                inputs[index - 1].focus();
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
                    }
                });
                inputs[5].focus();
            }
        });
        
        // Focus on first input when container is clicked
        if (index === 0) {
            input.addEventListener('focus', () => {
                input.select();
            });
        }
    });
}

// Get OTP value from inputs
export function getOTPValue() {
    const inputs = document.querySelectorAll('.otp-input');
    return Array.from(inputs).map(input => input.value).join('');
}

// Clear OTP inputs
export function clearOTPInputs() {
    const inputs = document.querySelectorAll('.otp-input');
    inputs.forEach(input => {
        input.value = '';
    });
    if (inputs.length > 0) {
        inputs[0].focus();
    }
}