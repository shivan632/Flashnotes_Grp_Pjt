// frontend/src/components/quiz/QuizQuestion.js
// Quiz Question Component - Enhanced UI with modern design

export function QuizQuestion({ question, index, total, selectedOption, onSelect }) {
    return `
        <div class="quiz-question bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-6 mb-5 border border-[#374151] transition-all duration-300 hover:border-[#3B82F6] shadow-lg hover:shadow-xl">
            <!-- Header -->
            <div class="flex justify-between items-center mb-5 pb-3 border-b border-[#374151]">
                <div class="flex items-center gap-3">
                    <div class="relative">
                        <div class="absolute inset-0 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-lg blur-md opacity-0 group-hover:opacity-50 transition-opacity"></div>
                        <div class="relative w-9 h-9 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-xl flex items-center justify-center shadow-md">
                            <span class="text-white text-sm font-bold">${index + 1}</span>
                        </div>
                    </div>
                    <div class="flex items-center gap-1">
                        <span class="text-sm text-[#9CA3AF]">of ${total}</span>
                        <span class="w-1 h-1 bg-[#4B5563] rounded-full"></span>
                        <span class="text-xs text-[#6B7280]">Question</span>
                    </div>
                </div>
                <div class="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#111827] to-[#0F172A] rounded-full border border-[#374151]">
                    <svg class="w-4 h-4 text-[#60A5FA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span class="text-xs text-[#60A5FA] font-medium">${question.points || 1} point${question.points > 1 ? 's' : ''}</span>
                </div>
            </div>
            
            <!-- Question Text -->
            <div class="flex items-start gap-3 mb-6">
                <div class="w-6 h-6 rounded-full bg-[#3B82F6]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg class="w-3 h-3 text-[#3B82F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <h3 class="text-lg font-semibold text-[#E5E7EB] leading-relaxed flex-1">${escapeHtml(question.question)}</h3>
            </div>
            
            <!-- Options -->
            <div class="options space-y-3 ml-9">
                ${question.options.map((option, optIndex) => {
                    const isSelected = selectedOption === optIndex;
                    const letter = String.fromCharCode(65 + optIndex); // A, B, C, D
                    const letterColors = ['text-[#3B82F6]', 'text-[#60A5FA]', 'text-[#A78BFA]', 'text-[#8B5CF6]'];
                    
                    return `
                        <div class="option-item group">
                            <label class="option-label flex items-center p-3 bg-[#111827] rounded-xl cursor-pointer transition-all duration-300 hover:bg-[#1F2937] ${isSelected ? 'ring-2 ring-[#3B82F6] bg-[#1F2937]' : 'border border-[#374151]'}" 
                                   data-option-index="${optIndex}">
                                <div class="flex items-center flex-1">
                                    <div class="flex-shrink-0">
                                        <div class="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${isSelected ? 'bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] text-white' : 'bg-[#374151] text-[#9CA3AF] group-hover:bg-[#4B5563]'}">
                                            <span class="text-sm font-semibold ${isSelected ? 'text-white' : letterColors[optIndex % 4]}">${letter}</span>
                                        </div>
                                    </div>
                                    <div class="ml-3 flex-1">
                                        <span class="text-[#E5E7EB] text-sm group-hover:text-white transition-colors">${escapeHtml(option)}</span>
                                    </div>
                                    <div class="flex-shrink-0 ml-2">
                                        <div class="w-5 h-5 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${isSelected ? 'border-[#3B82F6] bg-[#3B82F6]' : 'border-[#374151] group-hover:border-[#3B82F6]'}">
                                            ${isSelected ? '<div class="w-2 h-2 bg-white rounded-full"></div>' : ''}
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
            
            <!-- Progress Indicator -->
            <div class="mt-6 pt-4 border-t border-[#374151] flex justify-between items-center">
                <div class="flex items-center gap-3">
                    <div class="flex gap-1.5">
                        ${Array(total).fill(0).map((_, i) => `
                            <div class="w-2 h-2 rounded-full ${i === index ? 'bg-[#3B82F6] scale-125' : i < index ? 'bg-[#60A5FA]' : 'bg-[#374151]'} transition-all duration-300"></div>
                        `).join('')}
                    </div>
                    <span class="text-xs text-[#6B7280]">Question ${index + 1} of ${total}</span>
                </div>
                ${question.explanation ? `
                    <div class="relative group/help">
                        <div class="flex items-center gap-1 cursor-help">
                            <svg class="w-4 h-4 text-[#6B7280] hover:text-[#3B82F6] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span class="text-xs text-[#6B7280] hover:text-[#3B82F6] transition-colors">Explanation</span>
                        </div>
                        <div class="absolute bottom-full right-0 mb-2 w-72 p-3 bg-[#1F2937] border border-[#374151] rounded-xl text-xs text-[#9CA3AF] opacity-0 group-hover/help:opacity-100 transition-all duration-300 pointer-events-none z-10 shadow-lg">
                            <div class="flex items-start gap-2">
                                <svg class="w-3 h-3 text-[#3B82F6] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span>${escapeHtml(question.explanation)}</span>
                            </div>
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
        // Remove existing listener to avoid duplicates
        const newOption = option.cloneNode(true);
        option.parentNode.replaceChild(newOption, option);
        
        newOption.addEventListener('click', (e) => {
            const radio = newOption.querySelector('.option-input');
            const questionContainer = newOption.closest('.quiz-question');
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
            newOption.classList.add('ring-2', 'ring-[#3B82F6]', 'bg-[#1F2937]');
            const letterBox = newOption.querySelector('.w-8.h-8');
            if (letterBox) {
                letterBox.classList.add('bg-gradient-to-r', 'from-[#3B82F6]', 'to-[#A78BFA]', 'text-white');
                letterBox.classList.remove('bg-[#374151]', 'text-[#9CA3AF]');
            }
            const checkCircle = newOption.querySelector('.w-5.h-5');
            if (checkCircle) {
                checkCircle.classList.add('border-[#3B82F6]', 'bg-[#3B82F6]');
                checkCircle.classList.remove('border-[#374151]');
                if (!checkCircle.querySelector('div')) {
                    checkCircle.innerHTML = '<div class="w-2 h-2 bg-white rounded-full"></div>';
                }
            }
            
            // Check the radio
            if (radio) {
                radio.checked = true;
                radio.dispatchEvent(new Event('change', { bubbles: true }));
                
                // Call onSelect callback if provided
                const questionId = parseInt(radio.getAttribute('data-question-id'));
                const optionIndex = parseInt(radio.getAttribute('data-option-index'));
                if (window.onQuestionSelect && typeof window.onQuestionSelect === 'function') {
                    window.onQuestionSelect(questionId, optionIndex);
                }
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