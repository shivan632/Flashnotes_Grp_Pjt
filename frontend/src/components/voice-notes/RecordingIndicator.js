// frontend/src/components/voice-notes/RecordingIndicator.js

export function RecordingIndicator({ isRecording, duration = '0:00', onStop }) {
    const uniqueId = Date.now();
    
    if (!isRecording) return '';
    
    return `
        <div id="recordingIndicator-${uniqueId}" class="fixed bottom-24 right-6 z-50 animate-slideInRight">
            <div class="bg-gradient-to-br from-[#DC2626] via-[#E11D48] to-[#BE185D] rounded-2xl p-5 shadow-2xl shadow-red-500/30 border border-red-400/40 backdrop-blur-md">
                <div class="flex items-center gap-4">
                    <!-- Pulsing Mic Icon with Glow Effect -->
                    <div class="relative">
                        <div class="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-ping opacity-60"></div>
                        <div class="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse opacity-40"></div>
                        <div class="absolute inset-0 bg-red-500 rounded-full blur-md opacity-50"></div>
                        <div class="relative w-14 h-14 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg shadow-red-500/50">
                            <svg class="w-7 h-7 text-white drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                            </svg>
                        </div>
                    </div>
                    
                    <!-- Recording Info with Gradient Text -->
                    <div>
                        <div class="text-white font-bold text-sm tracking-wide flex items-center gap-2">
                            <span class="relative flex h-2 w-2">
                                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span class="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                            RECORDING
                        </div>
                        <div class="text-red-200/90 text-xs mt-0.5">Speak clearly into microphone</div>
                        <div class="text-white text-2xl font-mono font-bold tracking-wider mt-1 drop-shadow-lg" id="recordingDuration-${uniqueId}">${duration}</div>
                    </div>
                    
                    <!-- Stop Button with Hover Glow -->
                    <button id="stopRecordingBtn-${uniqueId}" class="ml-2 w-12 h-12 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-red-500/30 group">
                        <svg class="w-6 h-6 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"></path>
                        </svg>
                    </button>
                </div>
                
                <!-- Enhanced Wave Animation with Gradient -->
                <div class="flex items-center justify-center gap-1.5 mt-4">
                    <div class="w-1.5 bg-gradient-to-t from-red-400 to-pink-400 rounded-full animate-wave" style="animation-delay: 0s; height: 12px;"></div>
                    <div class="w-1.5 bg-gradient-to-t from-red-400 to-pink-400 rounded-full animate-wave" style="animation-delay: 0.15s; height: 20px;"></div>
                    <div class="w-1.5 bg-gradient-to-t from-red-400 to-pink-400 rounded-full animate-wave" style="animation-delay: 0.3s; height: 28px;"></div>
                    <div class="w-1.5 bg-gradient-to-t from-red-400 to-pink-400 rounded-full animate-wave" style="animation-delay: 0.45s; height: 36px;"></div>
                    <div class="w-1.5 bg-gradient-to-t from-red-400 to-pink-400 rounded-full animate-wave" style="animation-delay: 0.6s; height: 28px;"></div>
                    <div class="w-1.5 bg-gradient-to-t from-red-400 to-pink-400 rounded-full animate-wave" style="animation-delay: 0.75s; height: 20px;"></div>
                    <div class="w-1.5 bg-gradient-to-t from-red-400 to-pink-400 rounded-full animate-wave" style="animation-delay: 0.9s; height: 12px;"></div>
                </div>
                
                <!-- Animated Border Glow -->
                <div class="absolute inset-0 rounded-2xl pointer-events-none" style="background: linear-gradient(90deg, transparent, rgba(244, 63, 94, 0.4), transparent); animation: borderGlow 2s ease-in-out infinite;"></div>
            </div>
        </div>
        
        <style>
            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(120px) scale(0.9);
                }
                to {
                    opacity: 1;
                    transform: translateX(0) scale(1);
                }
            }
            
            @keyframes wave {
                0%, 100% {
                    height: 8px;
                    opacity: 0.5;
                }
                50% {
                    height: 32px;
                    opacity: 1;
                }
            }
            
            @keyframes borderGlow {
                0%, 100% {
                    opacity: 0;
                }
                50% {
                    opacity: 1;
                }
            }
            
            @keyframes pulse-ring {
                0% {
                    transform: scale(0.95);
                    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
                }
                70% {
                    transform: scale(1);
                    box-shadow: 0 0 0 15px rgba(239, 68, 68, 0);
                }
                100% {
                    transform: scale(0.95);
                    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
                }
            }
            
            .animate-slideInRight {
                animation: slideInRight 0.4s cubic-bezier(0.34, 1.2, 0.64, 1) forwards;
            }
            
            .animate-wave {
                animation: wave 1s ease-in-out infinite;
                transition: height 0.2s ease;
            }
            
            .animate-wave:hover {
                filter: brightness(1.2);
            }
        </style>
        
        <script>
            (function() {
                const id = '${uniqueId}';
                let durationInterval = null;
                let seconds = 0;
                
                const durationSpan = document.getElementById('recordingDuration-' + id);
                const stopBtn = document.getElementById('stopRecordingBtn-' + id);
                
                // Format time with leading zeros
                function formatTime(secs) {
                    const mins = Math.floor(secs / 60);
                    const remainingSecs = secs % 60;
                    return mins + ':' + (remainingSecs < 10 ? '0' + remainingSecs : remainingSecs);
                }
                
                // Update timer every second
                function updateTimer() {
                    seconds++;
                    if (durationSpan) {
                        durationSpan.textContent = formatTime(seconds);
                    }
                }
                
                durationInterval = setInterval(updateTimer, 1000);
                
                // Add ripple effect on stop button click
                if (stopBtn) {
                    stopBtn.onclick = () => {
                        if (durationInterval) clearInterval(durationInterval);
                        
                        // Add click animation
                        stopBtn.style.transform = 'scale(0.95)';
                        setTimeout(() => {
                            stopBtn.style.transform = '';
                        }, 150);
                        
                        if (window.onStopRecording) {
                            window.onStopRecording();
                        }
                    };
                    
                    // Add hover ripple effect
                    stopBtn.addEventListener('mouseenter', () => {
                        stopBtn.style.animation = 'pulse-ring 0.5s ease-out';
                        setTimeout(() => {
                            stopBtn.style.animation = '';
                        }, 500);
                    });
                }
                
                // Cleanup on component removal
                window.cleanupRecordingIndicator = () => {
                    if (durationInterval) clearInterval(durationInterval);
                };
            })();
        </script>
    `;
}