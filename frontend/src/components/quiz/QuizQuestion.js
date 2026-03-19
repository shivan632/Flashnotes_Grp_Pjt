// frontend/src/components/quiz/QuizQuestion.js

export function QuizQuestion({ question, index, total, selectedOption, onSelect }) {
    return `
        <div class="quiz-question bg-[#1F2937] rounded-xl p-6 mb-4">
            <div class="flex justify-between items-center mb-4">
                <span class="text-sm text-[#9CA3AF]">Question ${index + 1} of ${total}</span>
                <span class="text-xs px-2 py-1 bg-[#374151] rounded-full text-[#60A5FA]">${question.points || 1} point${question.points > 1 ? 's' : ''}</span>
            </div>
            
            <h3 class="text-xl text-[#E5E7EB] mb-6">${question.question}</h3>
            
            <div class="options space-y-3">
                ${question.options.map((option, optIndex) => `
                    <div class="option-item">
                        <label class="flex items-center p-3 bg-[#111827] rounded-lg cursor-pointer hover:bg-[#374151] transition-colors ${selectedOption === optIndex ? 'border-2 border-[#3B82F6]' : ''}">
                            <input type="radio" 
                                   name="question-${question.id}" 
                                   value="${optIndex}"
                                   ${selectedOption === optIndex ? 'checked' : ''}
                                   class="w-4 h-4 text-[#3B82F6] bg-[#1F2937] border-[#374151] focus:ring-[#3B82F6] focus:ring-2">
                            <span class="ml-3 text-[#E5E7EB]">${option}</span>
                        </label>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}