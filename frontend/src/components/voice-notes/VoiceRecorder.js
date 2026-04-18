// frontend/src/components/voice-notes/VoiceRecorder.js
import speechRecognition from '../../utils/speechRecognition.js';
import { showError } from '../common/ErrorMessage.js';

export function VoiceRecorder({ onTextChange, onSave, onCancel }) {
    const uniqueId = Date.now();
    const [isRecording, setIsRecording] = useState(false);
    const [text, setText] = useState('');
    const [recordingTime, setRecordingTime] = useState(0);
    
    useEffect(() => {
        speechRecognition.onResult = (transcript) => {
            setText(prev => prev + ' ' + transcript);
            if (onTextChange) onTextChange(transcript);
        };
        
        speechRecognition.onError = (error) => {
            console.error('Recognition error:', error);
            setIsRecording(false);
            showError('🎤 Microphone error: ' + error);
        };
        
        speechRecognition.onEnd = () => {
            setIsRecording(false);
        };
        
        return () => {
            if (isRecording) speechRecognition.stop();
        };
    }, []);
    
    const startRecording = async () => {
        const permission = await navigator.mediaDevices.getUserMedia({ audio: true });
        permission.getTracks().forEach(track => track.stop());
        
        const started = speechRecognition.start();
        if (started) {
            setIsRecording(true);
            startTimer();
        }
    };
    
    const stopRecording = () => {
        speechRecognition.stop();
        setIsRecording(false);
        stopTimer();
    };
    
    const saveNote = () => {
        if (text.trim()) {
            onSave(text);
        }
    };
    
    return `
        <div class="bg-gradient-to-br from-[#1F2937] via-[#1A2436] to-[#111827] rounded-2xl p-6 border border-[#374151] shadow-2xl shadow-black/20">
            
            <!-- Animated Gradient Background Effect -->
            <div class="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500/0 via-purple-500/0 to-pink-500/0 pointer-events-none"></div>
            
            <!-- Header with Enhanced Gradient -->
            <div class="flex items-center justify-between mb-6 pb-2 border-b border-[#374151]/50">
                <div class="flex items-center gap-3">
                    <div class="relative">
                        <div class="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl blur-md opacity-50"></div>
                        <div class="relative w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                            <svg class="w-6 h-6 text-white drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                            </svg>
                        </div>
                    </div>
                    <div>
                        <h3 class="text-white font-bold text-lg tracking-wide">Voice Notes</h3>
                        <p class="text-xs text-gray-400 mt-0.5">Speak your thoughts, AI converts to text</p>
                    </div>
                </div>
                <button id="cancelBtn-${uniqueId}" class="w-8 h-8 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200 hover:scale-110 flex items-center justify-center">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            
            <!-- Enhanced Recording Status -->
            <div id="recordingStatus-${uniqueId}" class="hidden mb-5 p-4 bg-gradient-to-r from-pink-500/15 to-purple-500/15 rounded-xl border border-pink-500/40 backdrop-blur-sm">
                <div class="flex items-center gap-3">
                    <div class="relative">
                        <div class="w-4 h-4 bg-gradient-to-r from-pink-500 to-red-500 rounded-full animate-pulse"></div>
                        <div class="absolute inset-0 w-4 h-4 bg-pink-500 rounded-full animate-ping opacity-75"></div>
                    </div>
                    <span class="text-sm font-medium bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">Recording... Speak now</span>
                    <span id="timer-${uniqueId}" class="text-sm font-mono text-white ml-auto bg-black/30 px-3 py-1 rounded-full">0:00</span>
                </div>
            </div>
            
            <!-- Enhanced Control Buttons -->
            <div class="flex gap-3 mb-5">
                <button id="startBtn-${uniqueId}" class="flex-1 py-3.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-pink-500/30">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                    </svg>
                    Start Recording
                </button>
                <button id="stopBtn-${uniqueId}" class="flex-1 py-3.5 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105" disabled>
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"></path>
                    </svg>
                    Stop Recording
                </button>
            </div>
            
            <!-- Enhanced Text Area -->
            <div class="mb-5">
                <label class="block text-sm font-medium text-gray-300 mb-2">Voice to Text</label>
                <textarea id="textArea-${uniqueId}" rows="6" class="w-full bg-[#0F172A] border-2 border-[#374151] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all duration-200 resize-none placeholder:text-gray-500" placeholder="Click 'Start Recording' and speak... Your words will appear here ✨"></textarea>
            </div>
            
            <!-- Enhanced Action Buttons -->
            <div class="flex gap-3">
                <button id="clearBtn-${uniqueId}" class="flex-1 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    Clear
                </button>
                <button id="copyBtn-${uniqueId}" class="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
                    </svg>
                    Copy
                </button>
                <button id="saveBtn-${uniqueId}" class="save-btn flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 shadow-lg shadow-green-500/20">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Save Note
                </button>
            </div>
            
            <!-- Info Tip -->
            <div class="mt-4 p-2 text-center">
                <p class="text-xs text-gray-500">🎤 Works best in Chrome/Edge • Click Start Recording to begin</p>
            </div>
        </div>
        
        <style>
            @keyframes pulse-ring {
                0% {
                    box-shadow: 0 0 0 0 rgba(236, 72, 153, 0.4);
                }
                70% {
                    box-shadow: 0 0 0 10px rgba(236, 72, 153, 0);
                }
                100% {
                    box-shadow: 0 0 0 0 rgba(236, 72, 153, 0);
                }
            }
            
            textarea:focus {
                animation: pulse-ring 1.5s infinite;
            }
        </style>
        
        <script>
            (function() {
                const id = '${uniqueId}';
                let isRecording = false;
                let timerInterval = null;
                let startTime = null;
                
                const startBtn = document.getElementById('startBtn-' + id);
                const stopBtn = document.getElementById('stopBtn-' + id);
                const clearBtn = document.getElementById('clearBtn-' + id);
                const copyBtn = document.getElementById('copyBtn-' + id);
                const saveBtn = document.getElementById('saveBtn-' + id);
                const cancelBtn = document.getElementById('cancelBtn-' + id);
                const textArea = document.getElementById('textArea-' + id);
                const recordingStatus = document.getElementById('recordingStatus-' + id);
                const timerSpan = document.getElementById('timer-' + id);
                
                let recognition = null;
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                
                if (SpeechRecognition) {
                    recognition = new SpeechRecognition();
                    recognition.continuous = true;
                    recognition.interimResults = true;
                    recognition.lang = 'en-US';
                    
                    recognition.onstart = () => {
                        isRecording = true;
                        startTimer();
                        recordingStatus.classList.remove('hidden');
                        startBtn.disabled = true;
                        startBtn.classList.add('opacity-50', 'cursor-not-allowed');
                        stopBtn.disabled = false;
                        stopBtn.classList.remove('opacity-50', 'cursor-not-allowed');
                        
                        // Add ripple effect on start
                        startBtn.style.transform = 'scale(0.98)';
                        setTimeout(() => { startBtn.style.transform = ''; }, 150);
                    };
                    
                    recognition.onend = () => {
                        isRecording = false;
                        stopTimer();
                        recordingStatus.classList.add('hidden');
                        startBtn.disabled = false;
                        startBtn.classList.remove('opacity-50', 'cursor-not-allowed');
                        stopBtn.disabled = true;
                        stopBtn.classList.add('opacity-50', 'cursor-not-allowed');
                    };
                    
                    recognition.onresult = (event) => {
                        let finalTranscript = '';
                        for (let i = event.resultIndex; i < event.results.length; i++) {
                            if (event.results[i].isFinal) {
                                finalTranscript += event.results[i][0].transcript;
                            }
                        }
                        if (finalTranscript) {
                            const current = textArea.value;
                            textArea.value = current + (current ? ' ' : '') + finalTranscript;
                            // Auto-scroll to bottom
                            textArea.scrollTop = textArea.scrollHeight;
                        }
                    };
                    
                    recognition.onerror = (event) => {
                        console.error('Error:', event.error);
                        if (event.error === 'not-allowed') {
                            alert('🎤 Please allow microphone access to use voice recording');
                        }
                        if (recognition) recognition.stop();
                    };
                } else {
                    textArea.placeholder = '❌ Speech recognition not supported. Please use Chrome or Edge browser.';
                    startBtn.disabled = true;
                    startBtn.classList.add('opacity-50', 'cursor-not-allowed');
                }
                
                function updateTimer() {
                    if (!startTime) return;
                    const elapsed = Math.floor((Date.now() - startTime) / 1000);
                    const mins = Math.floor(elapsed / 60);
                    const secs = elapsed % 60;
                    timerSpan.textContent = mins + ':' + (secs < 10 ? '0' + secs : secs);
                }
                
                function startTimer() {
                    startTime = Date.now();
                    if (timerInterval) clearInterval(timerInterval);
                    timerInterval = setInterval(updateTimer, 1000);
                }
                
                function stopTimer() {
                    if (timerInterval) {
                        clearInterval(timerInterval);
                        timerInterval = null;
                    }
                    timerSpan.textContent = '0:00';
                    startTime = null;
                }
                
                startBtn.onclick = () => {
                    if (recognition && !isRecording) {
                        // Request microphone permission with better UX
                        navigator.mediaDevices.getUserMedia({ audio: true })
                            .then(stream => {
                                stream.getTracks().forEach(track => track.stop());
                                recognition.start();
                            })
                            .catch(err => {
                                alert('🎤 Microphone access denied. Please allow microphone access in your browser settings.');
                            });
                    }
                };
                
                stopBtn.onclick = () => {
                    if (recognition && isRecording) {
                        // Add haptic feedback on stop
                        stopBtn.style.transform = 'scale(0.98)';
                        setTimeout(() => { stopBtn.style.transform = ''; }, 150);
                        recognition.stop();
                    }
                };
                
                clearBtn.onclick = () => { 
                    textArea.value = '';
                    // Add feedback
                    clearBtn.style.transform = 'scale(0.95)';
                    setTimeout(() => { clearBtn.style.transform = ''; }, 150);
                };
                
                copyBtn.onclick = () => {
                    if (textArea.value) {
                        navigator.clipboard.writeText(textArea.value);
                        const original = copyBtn.innerHTML;
                        copyBtn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Copied!';
                        copyBtn.style.transform = 'scale(0.95)';
                        setTimeout(() => { 
                            copyBtn.innerHTML = original;
                            copyBtn.style.transform = '';
                        }, 2000);
                    }
                };
                
                saveBtn.onclick = () => {
                    const text = textArea.value.trim();
                    if (!text) {
                        alert('📝 No text to save. Please record something first.');
                        return;
                    }
                    if (window.onVoiceNoteSave) {
                        window.onVoiceNoteSave(text);
                    }
                };
                
                cancelBtn.onclick = () => {
                    if (window.onVoiceNoteCancel) {
                        window.onVoiceNoteCancel();
                    }
                };
            })();
        </script>
    `;
}