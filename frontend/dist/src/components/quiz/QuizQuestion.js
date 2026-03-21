// frontend/src/components/quiz/QuizQuestion.js
// Quiz Question Component - Enhanced UI with modern design

export function QuizQuestion({ question, index, total, selectedOption, onSelect }) {
    return `
        <div class="quiz-question bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-6 mb-5 border border-[#374151] transition-all duration-300 hover:border-[#3B82F6]">
            <!-- Header -->
            <div class="flex justify-between items-center mb-5 pb-3 border-b border-[#374151]">
                <div class="flex items-center gap-2">
                    <div class="w-8 h-8 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-lg flex items-center justify-center">
                        <span class="text-white text-sm font-bold">${index + 1}</span>
                    </div>
                    <span class="text-sm text-[#9CA3AF]">of ${total}</span>
                </div>
                <div class="flex items-center gap-2 px-3 py-1.5 bg-[#111827] rounded-full">
                    <svg class="w-4 h-4 text-[#60A5FA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                    </svg>
                    <span class="text-xs text-[#60A5FA] font-medium">${question.points || 1} point${question.points > 1 ? 's' : ''}</span>
                </div>
            </div>
            
            <!-- Question Text -->
            <h3 class="text-xl font-semibold text-[#E5E7EB] mb-6 leading-relaxed">${escapeHtml(question.question)}</h3>
            
            <!-- Options -->
            <div class="options space-y-3">
                ${question.options.map((option, optIndex) => {
                    const isSelected = selectedOption === optIndex;
                    const letter = String.fromCharCode(65 + optIndex); // A, B, C, D
                    
                    return `
                        <div class="option-item group">
                            <label class="option-label flex items-center p-4 bg-[#111827] rounded-xl cursor-pointer transition-all duration-300 hover:bg-[#1F2937] ${isSelected ? 'ring-2 ring-[#3B82F6] bg-[#1F2937]' : 'border border-[#374151]'}" 
                                   data-option-index="${optIndex}">
                                <div class="flex items-center flex-1">
                                    <div class="flex-shrink-0">
                                        <div class="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${isSelected ? 'bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] text-white' : 'bg-[#374151] text-[#9CA3AF] group-hover:bg-[#4B5563]'}">
                                            <span class="text-sm font-semibold">${letter}</span>
                                        </div>
                                    </div>
                                    <div class="ml-4 flex-1">
                                        <span class="text-[#E5E7EB] group-hover:text-white transition-colors">${escapeHtml(option)}</span>
                                    </div>
                                    <div class="flex-shrink-0 ml-2">
                                        <div class="w-5 h-5 rounded-full border-2 transition-all duration-300 ${isSelected ? 'border-[#3B82F6] bg-[#3B82F6]' : 'border-[#374151] group-hover:border-[#3B82F6]'}">
                                            ${isSelected ? '<div class="w-2 h-2 bg-white rounded-full m-auto mt-1.5"></div>' : ''}
                                        </div>
                                    </div>
                                </div>
                                <input type="radio" 
                                       name="question-${question.id}" 
                                       value="${optIndex}"
                                       ${isSelected ? 'checked' : ''}
                                       class="hidden option-input"
                                       data-question-id="${question.id}"
                                       data-option-index="${optIndex}">
                            </label>
                        </div>
                    `;
                }).join('')}
            </div>
            
            <!-- Progress Indicator (Optional) -->
            <div class="mt-6 pt-4 border-t border-[#374151] flex justify-between items-center">
                <div class="flex items-center gap-2">
                    <div class="flex gap-1">
                        ${Array(total).fill(0).map((_, i) => `
                            <div class="w-1.5 h-1.5 rounded-full ${i === index ? 'bg-[#3B82F6]' : i < index ? 'bg-[#60A5FA]' : 'bg-[#374151]'} transition-all duration-300"></div>
                        `).join('')}
                    </div>
                    <span class="text-xs text-[#6B7280]">Question ${index + 1} of ${total}</span>
                </div>
                ${question.explanation ? `
                    <div class="relative group/help">
                        <svg class="w-4 h-4 text-[#6B7280] cursor-help hover:text-[#3B82F6] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <div class="absolute bottom-full right-0 mb-2 w-64 p-2 bg-[#1F2937] border border-[#374151] rounded-lg text-xs text-[#9CA3AF] opacity-0 group-hover/help:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                            ${escapeHtml(question.explanation)}
                        </div>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Setup quiz question events
export function setupQuizQuestionEvents() {
    const options = document.querySelectorAll('.option-label');
    
    options.forEach(option => {
        option.addEventListener('click', (e) => {
            const radio = option.querySelector('.option-input');
            const questionContainer = option.closest('.quiz-question');
            const allOptions = questionContainer.querySelectorAll('.option-label');
            
            // Remove selected styles from all options in this question
            allOptions.forEach(opt => {
                opt.classList.remove('ring-2', 'ring-[#3B82F6]', 'bg-[#1F2937]');
                const letterBox = opt.querySelector('.w-8.h-8');
                if (letterBox) {
                    letterBox.classList.remove('bg-gradient-to-r', 'from-[#3B82F6]', 'to-[#A78BFA]', 'text-white');
                    letterBox.classList.add('bg-[#374151]', 'text-[#9CA3AF]');
                }
                const checkCircle = opt.querySelector('.w-5.h-5');
                if (checkCircle) {
                    checkCircle.classList.remove('border-[#3B82F6]', 'bg-[#3B82F6]');
                    checkCircle.classList.add('border-[#374151]');
                    const innerDot = checkCircle.querySelector('div');
                    if (innerDot) innerDot.remove();
                }
            });
            
            // Add selected styles to clicked option
            option.classList.add('ring-2', 'ring-[#3B82F6]', 'bg-[#1F2937]');
            const letterBox = option.querySelector('.w-8.h-8');
            if (letterBox) {
                letterBox.classList.add('bg-gradient-to-r', 'from-[#3B82F6]', 'to-[#A78BFA]', 'text-white');
                letterBox.classList.remove('bg-[#374151]', 'text-[#9CA3AF]');
            }
            const checkCircle = option.querySelector('.w-5.h-5');
            if (checkCircle) {
                checkCircle.classList.add('border-[#3B82F6]', 'bg-[#3B82F6]');
                checkCircle.classList.remove('border-[#374151]');
                if (!checkCircle.querySelector('div')) {
                    checkCircle.innerHTML = '<div class="w-2 h-2 bg-white rounded-full m-auto mt-1.5"></div>';
                }
            }
            
            // Check the radio
            if (radio) {
                radio.checked = true;
                radio.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
    });
}

// Add CSS animations
const quizQuestionStyles = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .quiz-question {
        animation: slideInRight 0.4s ease-out forwards;
    }
    
    .option-item {
        animation: fadeInUp 0.3s ease-out forwards;
        opacity: 0;
    }
    
    .option-item:nth-child(1) { animation-delay: 0.05s; }
    .option-item:nth-child(2) { animation-delay: 0.1s; }
    .option-item:nth-child(3) { animation-delay: 0.15s; }
    .option-item:nth-child(4) { animation-delay: 0.2s; }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .option-label {
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
`;

if (!document.querySelector('#quiz-question-styles')) {
    const style = document.createElement('style');
    style.id = 'quiz-question-styles';
    style.textContent = quizQuestionStyles;
    document.head.appendChild(style);
}