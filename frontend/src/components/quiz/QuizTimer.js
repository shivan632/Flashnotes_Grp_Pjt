// frontend/src/components/quiz/QuizTimer.js
// Quiz Timer Component - Enhanced UI with modern design

export function QuizTimer({ seconds, totalSeconds, onTimeUp }) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const percentage = (seconds / totalSeconds) * 100;
    
    const getTimerColor = () => {
        if (percentage < 20) return { text: 'text-red-500', bg: 'bg-red-500', ring: 'ring-red-500/30', border: 'border-red-500' };
        if (percentage < 50) return { text: 'text-yellow-500', bg: 'bg-yellow-500', ring: 'ring-yellow-500/30', border: 'border-yellow-500' };
        return { text: 'text-[#3B82F6]', bg: 'bg-[#3B82F6]', ring: 'ring-[#3B82F6]/30', border: 'border-[#3B82F6]' };
    };
    
    const timerColor = getTimerColor();
    const isWarning = percentage < 20;
    const isCritical = percentage < 10;
    
    return `
        <div class="quiz-timer relative group">
            <!-- Timer Card -->
            <div class="flex items-center gap-3 bg-gradient-to-r from-[#1F2937] to-[#111827] px-5 py-3 rounded-xl shadow-lg border border-[#374151] ${isWarning ? 'animate-pulse' : ''}">
                <!-- Icon with Pulse Effect -->
                <div class="relative">
                    <div class="absolute inset-0 bg-gradient-to-r ${timerColor.text.replace('text', 'from')} to-transparent rounded-full blur-md opacity-50 animate-ping"></div>
                    <svg class="w-6 h-6 ${timerColor.text} relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                
                <!-- Time Display -->
                <div class="text-center">
                    <span class="font-mono text-2xl font-bold ${timerColor.text} tracking-wider">
                        ${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}
                    </span>
                    <div class="text-xs text-[#6B7280] mt-0.5">Time Remaining</div>
                </div>
            </div>
            
            <!-- Progress Ring (Circular) -->
            <div class="absolute -top-2 -right-2">
                <svg class="w-12 h-12 transform -rotate-90">
                    <!-- Background Circle -->
                    <circle cx="24" cy="24" r="20" stroke="#374151" stroke-width="3" fill="none"/>
                    <!-- Progress Circle -->
                    <circle cx="24" cy="24" r="20" stroke="${timerColor.text === 'text-red-500' ? '#EF4444' : timerColor.text === 'text-yellow-500' ? '#F59E0B' : '#3B82F6'}" 
                            stroke-width="3" fill="none" 
                            stroke-dasharray="${2 * Math.PI * 20}" 
                            stroke-dashoffset="${2 * Math.PI * 20 * (1 - seconds / totalSeconds)}"
                            stroke-linecap="round"
                            class="transition-all duration-1000 ease-linear"/>
                </svg>
            </div>
            
            <!-- Warning Animation -->
            ${isCritical ? `
                <div class="absolute inset-0 bg-red-500/10 rounded-xl animate-pulse"></div>
            ` : isWarning ? `
                <div class="absolute inset-0 bg-yellow-500/10 rounded-xl animate-pulse"></div>
            ` : ''}
            
            <!-- Time Up Notification (Hidden by default, shown when time's up) -->
            <div id="timeUpNotification" class="hidden absolute -top-12 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-3 py-1 rounded-full text-xs whitespace-nowrap shadow-lg animate-bounce">
                ⏰ Time's up!
            </div>
        </div>
    `;
}

// Timer bar component for horizontal display
export function TimerBar({ seconds, totalSeconds }) {
    const percentage = (seconds / totalSeconds) * 100;
    const isWarning = percentage < 20;
    const isCritical = percentage < 10;
    
    return `
        <div class="w-full">
            <div class="flex justify-between text-xs mb-1">
                <span class="text-[#9CA3AF]">Time Remaining</span>
                <span class="font-mono ${isWarning ? 'text-red-500' : 'text-[#3B82F6]'}">
                    ${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}
                </span>
            </div>
            <div class="w-full bg-[#374151] rounded-full h-2 overflow-hidden">
                <div class="h-2 rounded-full transition-all duration-1000 ease-linear ${isCritical ? 'bg-red-500' : isWarning ? 'bg-yellow-500' : 'bg-gradient-to-r from-[#3B82F6] to-[#A78BFA]'}" 
                     style="width: ${percentage}%"></div>
            </div>
        </div>
    `;
}

// Digital timer component (large display)
export function DigitalTimer({ seconds, totalSeconds }) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const percentage = (seconds / totalSeconds) * 100;
    const isWarning = percentage < 20;
    
    return `
        <div class="text-center">
            <div class="relative inline-block">
                <div class="bg-[#111827] rounded-2xl p-6 shadow-2xl border border-[#374151]">
                    <div class="flex items-center justify-center gap-2">
                        <div class="bg-[#1F2937] rounded-xl px-4 py-3">
                            <span class="font-mono text-5xl font-bold ${isWarning ? 'text-red-500' : 'text-[#3B82F6]'}">${minutes.toString().padStart(2, '0')}</span>
                            <span class="text-sm text-[#9CA3AF] ml-1">min</span>
                        </div>
                        <span class="text-4xl font-bold text-[#9CA3AF]">:</span>
                        <div class="bg-[#1F2937] rounded-xl px-4 py-3">
                            <span class="font-mono text-5xl font-bold ${isWarning ? 'text-red-500' : 'text-[#3B82F6]'}">${remainingSeconds.toString().padStart(2, '0')}</span>
                            <span class="text-sm text-[#9CA3AF] ml-1">sec</span>
                        </div>
                    </div>
                </div>
                <div class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32">
                    <div class="w-full bg-[#374151] rounded-full h-1">
                        <div class="bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] h-1 rounded-full transition-all duration-1000" style="width: ${percentage}%"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Compact timer for mobile view
export function CompactTimer({ seconds, totalSeconds }) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const percentage = (seconds / totalSeconds) * 100;
    const isWarning = percentage < 20;
    
    return `
        <div class="flex items-center gap-2 bg-[#1F2937] px-3 py-1.5 rounded-full">
            <svg class="w-4 h-4 ${isWarning ? 'text-red-500' : 'text-[#3B82F6]'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="font-mono text-sm ${isWarning ? 'text-red-500' : 'text-[#3B82F6]'}">
                ${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}
            </span>
        </div>
    `;
}

// Setup timer events
export function setupTimer(onTimeUp) {
    let timerInterval = null;
    
    const checkTimeUp = () => {
        if (onTimeUp && typeof onTimeUp === 'function') {
            onTimeUp();
        }
        
        // Show notification
        const notification = document.getElementById('timeUpNotification');
        if (notification) {
            notification.classList.remove('hidden');
            setTimeout(() => {
                notification.classList.add('hidden');
            }, 3000);
        }
    };
    
    return {
        start: (seconds, onTick) => {
            if (timerInterval) clearInterval(timerInterval);
            let currentSeconds = seconds;
            
            timerInterval = setInterval(() => {
                currentSeconds--;
                if (onTick) onTick(currentSeconds);
                
                if (currentSeconds <= 0) {
                    clearInterval(timerInterval);
                    checkTimeUp();
                }
            }, 1000);
            
            return () => {
                if (timerInterval) clearInterval(timerInterval);
            };
        },
        stop: () => {
            if (timerInterval) clearInterval(timerInterval);
        }
    };
}

// Add CSS animations
const timerStyles = `
    @keyframes timerPulse {
        0%, 100% {
            transform: scale(1);
            opacity: 1;
        }
        50% {
            transform: scale(1.05);
            opacity: 0.8;
        }
    }
    
    .quiz-timer {
        transition: all 0.3s ease;
    }
    
    @keyframes timerWarning {
        0%, 100% {
            border-color: rgba(239, 68, 68, 0.3);
        }
        50% {
            border-color: rgba(239, 68, 68, 0.8);
        }
    }
    
    .timer-warning {
        animation: timerWarning 0.5s ease-in-out infinite;
    }
`;

if (!document.querySelector('#timer-styles')) {
    const style = document.createElement('style');
    style.id = 'timer-styles';
    style.textContent = timerStyles;
    document.head.appendChild(style);
}