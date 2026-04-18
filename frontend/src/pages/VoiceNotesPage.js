// frontend/src/pages/VoiceNotesPage.js
import { Sidebar } from '../components/layout/Sidebar.js';
import { AIChatSidebar } from '../components/layout/AIChatSidebar.js';
import { Header } from '../components/common/Header.js';
import { showSuccess, showError } from '../components/common/ErrorMessage.js';
import { getVoiceNotes, deleteVoiceNote, saveVoiceNote } from '../services/voiceNotesService.js';

// Helper function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Generate note card HTML with enhanced styling
function generateNoteCardHTML(note) {
    const previewText = note.text.length > 150 ? note.text.substring(0, 150) + '...' : note.text;
    const formattedDate = formatDate(note.created_at);
    const noteId = note.id;
    const wordCount = note.text.split(/\s+/).length;
    
    return `
        <div class="group relative bg-gradient-to-br from-[#1F2937] via-[#1A2436] to-[#111827] rounded-xl border border-[#374151] p-5 hover:border-pink-500/50 hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-300 hover:-translate-y-1" data-note-id="${noteId}">
            <!-- Animated gradient overlay on hover -->
            <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-pink-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-500 pointer-events-none"></div>
            
            <div class="flex items-start justify-between relative z-10">
                <div class="flex items-center gap-3">
                    <div class="w-11 h-11 bg-gradient-to-br from-pink-500/25 to-purple-500/25 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 group-hover:shadow-lg group-hover:shadow-pink-500/20">
                        <svg class="w-5 h-5 text-pink-400 group-hover:text-pink-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                        </svg>
                    </div>
                    <div>
                        <div class="text-white text-sm font-semibold tracking-wide">Voice Note</div>
                        <div class="text-gray-500 text-xs flex items-center gap-1 mt-0.5">
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            ${formattedDate}
                        </div>
                    </div>
                </div>
                <button class="delete-note-btn p-2.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 hover:scale-110" data-id="${noteId}" title="Delete note">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                </button>
            </div>
            
            <div class="mt-4">
                <p class="text-gray-300 text-sm leading-relaxed line-clamp-3">${escapeHtml(previewText)}</p>
            </div>
            
            <div class="mt-4 pt-3 border-t border-[#374151]/50 flex items-center justify-between text-gray-500 text-xs">
                <div class="flex items-center gap-3">
                    <div class="flex items-center gap-1.5">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path>
                        </svg>
                        <span>${wordCount} words</span>
                    </div>
                    <div class="w-1 h-1 bg-gray-600 rounded-full"></div>
                    <div class="flex items-center gap-1.5">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <span>${note.text.length} chars</span>
                    </div>
                </div>
                <div class="h-1 w-12 bg-gradient-to-r from-pink-500/0 via-pink-500/40 to-pink-500/0 rounded-full"></div>
            </div>
        </div>
    `;
}

// Helper to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Voice Recorder Modal HTML with enhanced design
function getVoiceRecorderModalHTML() {
    const uniqueId = Date.now();
    
    return `
        <div class="relative bg-gradient-to-br from-[#1F2937] via-[#1A2436] to-[#111827] rounded-2xl p-6 border border-[#374151] w-full max-w-2xl shadow-2xl shadow-black/40 animate-modalIn">
            <!-- Animated border glow -->
            <div class="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-pink-500/20 opacity-0 animate-borderPulse pointer-events-none"></div>
            
            <div class="flex items-center justify-between mb-6 pb-2 border-b border-[#374151]/50">
                <div class="flex items-center gap-3">
                    <div class="relative">
                        <div class="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl blur-md opacity-60"></div>
                        <div class="relative w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                            <svg class="w-6 h-6 text-white drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                            </svg>
                        </div>
                    </div>
                    <div>
                        <h3 class="text-white font-bold text-lg tracking-wide">Create Voice Note</h3>
                        <p class="text-xs text-gray-400 mt-0.5">Speak your thoughts, AI converts to text</p>
                    </div>
                </div>
                <button id="closeModalBtn" class="w-8 h-8 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200 hover:scale-110 flex items-center justify-center">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            
            <div id="recordingStatus" class="hidden mb-5 p-4 bg-gradient-to-r from-pink-500/15 to-purple-500/15 rounded-xl border border-pink-500/40 backdrop-blur-sm">
                <div class="flex items-center gap-3">
                    <div class="relative">
                        <div class="w-4 h-4 bg-gradient-to-r from-pink-500 to-red-500 rounded-full animate-pulse"></div>
                        <div class="absolute inset-0 w-4 h-4 bg-pink-500 rounded-full animate-ping opacity-75"></div>
                    </div>
                    <span class="text-sm font-medium bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">Recording... Speak now</span>
                    <span id="timer" class="text-sm font-mono text-white ml-auto bg-black/30 px-3 py-1 rounded-full shadow-inner">0:00</span>
                </div>
            </div>
            
            <div class="flex gap-3 mb-5">
                <button id="startRecordBtn" class="flex-1 py-3.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-pink-500/30">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                    </svg>
                    Start Recording
                </button>
                <button id="stopRecordBtn" class="flex-1 py-3.5 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105" disabled>
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"></path>
                    </svg>
                    Stop Recording
                </button>
            </div>
            
            <div class="mb-5">
                <label class="block text-sm font-medium text-gray-300 mb-2">Voice to Text</label>
                <textarea id="textArea" rows="6" class="w-full bg-[#0F172A] border-2 border-[#374151] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all duration-200 resize-none placeholder:text-gray-500" placeholder="Click 'Start Recording' and speak... Your words will appear here ✨"></textarea>
            </div>
            
            <div class="flex gap-3">
                <button id="clearBtn" class="flex-1 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    Clear
                </button>
                <button id="copyBtn" class="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
                    </svg>
                    Copy
                </button>
                <button id="saveNoteBtn" class="save-btn flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 shadow-lg shadow-green-500/20">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Save Note
                </button>
            </div>
            
            <div class="mt-4 p-2 text-center">
                <p class="text-xs text-gray-500">🎤 Works best in Chrome/Edge • Click Start Recording to begin</p>
            </div>
        </div>
    `;
}

// Function to setup modal events
function setupModalEvents(modal, container, onSaveCallback, onCloseCallback) {
    const closeBtn = document.getElementById('closeModalBtn');
    const startBtn = document.getElementById('startRecordBtn');
    const stopBtn = document.getElementById('stopRecordBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');
    const saveBtn = document.getElementById('saveNoteBtn');
    const textArea = document.getElementById('textArea');
    const recordingStatus = document.getElementById('recordingStatus');
    const timerSpan = document.getElementById('timer');
    
    let isRecording = false;
    let timerInterval = null;
    let startTime = null;
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
            if (recordingStatus) recordingStatus.classList.remove('hidden');
            if (startBtn) {
                startBtn.disabled = true;
                startBtn.classList.add('opacity-50', 'cursor-not-allowed');
            }
            if (stopBtn) {
                stopBtn.disabled = false;
                stopBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            }
        };
        
        recognition.onend = () => {
            isRecording = false;
            stopTimer();
            if (recordingStatus) recordingStatus.classList.add('hidden');
            if (startBtn) {
                startBtn.disabled = false;
                startBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            }
            if (stopBtn) {
                stopBtn.disabled = true;
                stopBtn.classList.add('opacity-50', 'cursor-not-allowed');
            }
        };
        
        recognition.onresult = (event) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                }
            }
            if (finalTranscript && textArea) {
                const current = textArea.value;
                textArea.value = current + (current ? ' ' : '') + finalTranscript;
                textArea.scrollTop = textArea.scrollHeight;
            }
        };
        
        recognition.onerror = (event) => {
            console.error('Recognition error:', event.error);
            if (event.error === 'not-allowed') {
                alert('🎤 Please allow microphone access to use voice recording');
            }
            if (recognition) recognition.stop();
        };
    } else if (textArea) {
        textArea.placeholder = '❌ Speech recognition not supported. Please use Chrome or Edge.';
        if (startBtn) startBtn.disabled = true;
    }
    
    function updateTimer() {
        if (!startTime) return;
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const mins = Math.floor(elapsed / 60);
        const secs = elapsed % 60;
        if (timerSpan) timerSpan.textContent = mins + ':' + (secs < 10 ? '0' + secs : secs);
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
        if (timerSpan) timerSpan.textContent = '0:00';
        startTime = null;
    }
    
    if (startBtn) {
        startBtn.onclick = () => {
            if (recognition && !isRecording) {
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
    }
    
    if (stopBtn) {
        stopBtn.onclick = () => {
            if (recognition && isRecording) {
                stopBtn.style.transform = 'scale(0.98)';
                setTimeout(() => { if(stopBtn) stopBtn.style.transform = ''; }, 150);
                recognition.stop();
            }
        };
    }
    
    if (clearBtn) {
        clearBtn.onclick = () => { 
            if (textArea) textArea.value = '';
            clearBtn.style.transform = 'scale(0.95)';
            setTimeout(() => { if(clearBtn) clearBtn.style.transform = ''; }, 150);
        };
    }
    
    if (copyBtn) {
        copyBtn.onclick = () => {
            if (textArea && textArea.value) {
                navigator.clipboard.writeText(textArea.value);
                const original = copyBtn.innerHTML;
                copyBtn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Copied!';
                copyBtn.style.transform = 'scale(0.95)';
                setTimeout(() => { 
                    if(copyBtn) copyBtn.innerHTML = original;
                    if(copyBtn) copyBtn.style.transform = '';
                }, 2000);
            }
        };
    }
    
    if (saveBtn) {
        saveBtn.onclick = () => {
            const text = textArea ? textArea.value.trim() : '';
            if (!text) {
                alert('📝 No text to save. Please record something first.');
                return;
            }
            if (onSaveCallback) onSaveCallback(text);
        };
    }
    
    if (closeBtn) {
        closeBtn.onclick = () => {
            if (onCloseCallback) onCloseCallback();
        };
    }
}

// Main Page Component
export async function VoiceNotesPage() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) {
        window.location.hash = '#/login';
        return '';
    }
    
    // Load existing voice notes
    let existingNotes = [];
    try {
        const result = await getVoiceNotes({ limit: 50 });
        if (result.success) {
            existingNotes = result.notes || [];
        }
    } catch (error) {
        console.error('Failed to load notes:', error);
    }
    
    return `
        <div class="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#0B1120] to-[#0F172A] relative">
            ${Sidebar()}
            ${AIChatSidebar()}
            
            <div id="mainContent" class="min-h-screen transition-all duration-300" style="margin-left: 256px; margin-right: 384px; width: calc(100% - 640px);">
                ${Header({ title: 'Voice Notes' })}
                
                <main class="container mx-auto px-4 py-8">
                    <div class="max-w-4xl mx-auto">
                        <!-- Enhanced Header Section -->
                        <div class="mb-8 animate-fadeInUp">
                            <div class="flex items-center gap-3 mb-2">
                                <div class="relative">
                                    <div class="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl blur-xl opacity-60 animate-pulse"></div>
                                    <div class="relative w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                                        <svg class="w-8 h-8 text-white drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                                        </svg>
                                    </div>
                                </div>
                                <div>
                                    <h1 class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">Voice Notes</h1>
                                    <p class="text-[#9CA3AF] mt-1">Record, transcribe, and save your thoughts with AI</p>
                                </div>
                            </div>
                            <div class="w-28 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 rounded-full mt-4 animate-gradientShift"></div>
                        </div>
                        
                        <!-- Enhanced Create New Voice Note Button -->
                        <button id="createVoiceNoteBtn" class="group relative w-full mb-8 p-5 bg-gradient-to-r from-[#1F2937] via-[#1A2436] to-[#1F2937] border-2 border-dashed border-[#374151] rounded-xl hover:border-pink-500/50 hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-300 overflow-hidden">
                            <div class="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-pink-500/5 to-pink-500/0 group-hover:translate-x-full transition-transform duration-700"></div>
                            <div class="flex items-center justify-center gap-3 relative z-10">
                                <div class="w-12 h-12 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 group-hover:shadow-lg group-hover:shadow-pink-500/20">
                                    <svg class="w-6 h-6 text-pink-400 group-hover:text-pink-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                                    </svg>
                                </div>
                                <span class="text-white font-semibold text-lg tracking-wide">Create New Voice Note</span>
                                <svg class="w-5 h-5 text-gray-400 group-hover:text-pink-400 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                                </svg>
                            </div>
                        </button>
                        
                        <!-- Voice Notes List with Animation -->
                        <div id="voiceNotesList" class="space-y-4">
                            ${existingNotes.length === 0 ? `
                                <div class="text-center py-16 animate-fadeInUp">
                                    <div class="w-24 h-24 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
                                        <svg class="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                                        </svg>
                                    </div>
                                    <p class="text-gray-400 font-medium">No voice notes yet</p>
                                    <p class="text-gray-500 text-sm mt-2">Click the button above to create your first voice note</p>
                                    <p class="text-gray-600 text-xs mt-4">🎤 Your recorded notes will appear here</p>
                                </div>
                            ` : `
                                ${existingNotes.map((note, index) => `
                                    <div class="animate-slideInUp" style="animation-delay: ${index * 0.05}s">
                                        ${generateNoteCardHTML(note)}
                                    </div>
                                `).join('')}
                            `}
                        </div>
                    </div>
                </main>
            </div>
        </div>
        
        <!-- Modal Container -->
        <div id="voiceNotesModal" class="fixed inset-0 bg-black/80 backdrop-blur-md z-50 hidden flex items-center justify-center p-4 animate-fadeIn">
            <div id="voiceNotesContainer" class="max-w-2xl w-full"></div>
        </div>
        
        <style>
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes slideInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes fadeIn {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }
            
            @keyframes gradientShift {
                0%, 100% {
                    background-position: 0% 50%;
                }
                50% {
                    background-position: 100% 50%;
                }
            }
            
            @keyframes modalIn {
                from {
                    opacity: 0;
                    transform: scale(0.95) translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
            }
            
            @keyframes borderPulse {
                0%, 100% {
                    opacity: 0;
                }
                50% {
                    opacity: 0.5;
                }
            }
            
            .animate-fadeInUp {
                animation: fadeInUp 0.6s cubic-bezier(0.34, 1.2, 0.64, 1) forwards;
            }
            
            .animate-slideInUp {
                animation: slideInUp 0.4s ease-out forwards;
                opacity: 0;
            }
            
            .animate-fadeIn {
                animation: fadeIn 0.3s ease-out forwards;
            }
            
            .animate-modalIn {
                animation: modalIn 0.3s cubic-bezier(0.34, 1.2, 0.64, 1) forwards;
            }
            
            .animate-borderPulse {
                animation: borderPulse 2s ease-in-out infinite;
            }
            
            .animate-gradient {
                background-size: 200% auto;
                animation: gradientShift 3s ease infinite;
            }
            
            .animate-gradientShift {
                background-size: 200% auto;
                animation: gradientShift 4s ease infinite;
            }
            
            .line-clamp-3 {
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }
        </style>
    `;
}

// Setup function that will be called after page loads
export function setupVoiceNotesPage() {
    console.log('Setting up Voice Notes page...');
    
    setTimeout(() => {
        const createBtn = document.getElementById('createVoiceNoteBtn');
        const modal = document.getElementById('voiceNotesModal');
        const container = document.getElementById('voiceNotesContainer');
        
        if (!createBtn) {
            console.error('Create button not found!');
            return;
        }
        
        async function refreshNotesList() {
            try {
                const result = await getVoiceNotes({ limit: 50 });
                const notesList = document.getElementById('voiceNotesList');
                
                if (result.success && result.notes && result.notes.length > 0 && notesList) {
                    notesList.innerHTML = result.notes.map((note, index) => `
                        <div class="animate-slideInUp" style="animation-delay: ${index * 0.05}s">
                            ${generateNoteCardHTML(note)}
                        </div>
                    `).join('');
                    attachDeleteEvents();
                } else if (notesList) {
                    notesList.innerHTML = `
                        <div class="text-center py-16 animate-fadeInUp">
                            <div class="w-24 h-24 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
                                <svg class="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                                </svg>
                            </div>
                            <p class="text-gray-400 font-medium">No voice notes yet</p>
                            <p class="text-gray-500 text-sm mt-2">Click the button above to create your first voice note</p>
                            <p class="text-gray-600 text-xs mt-4">🎤 Your recorded notes will appear here</p>
                        </div>
                    `;
                }
            } catch (err) {
                console.error('Refresh error:', err);
            }
        }
        
        async function attachDeleteEvents() {
            document.querySelectorAll('.delete-note-btn').forEach(btn => {
                btn.removeEventListener('click', handleDelete);
                btn.addEventListener('click', handleDelete);
            });
        }
        
        async function handleDelete(e) {
            const id = e.currentTarget.dataset.id;
            if (confirm('🗑️ Delete this voice note? This action cannot be undone.')) {
                const btn = e.currentTarget;
                btn.style.transform = 'scale(0.9)';
                const result = await deleteVoiceNote(id);
                if (result.success) {
                    showSuccess('✨ Voice note deleted successfully');
                    await refreshNotesList();
                } else {
                    showError('❌ Failed to delete');
                    btn.style.transform = '';
                }
            }
        }
        
        async function handleSaveNote(text) {
            const saveBtn = document.querySelector('#saveNoteBtn');
            if (saveBtn) {
                const originalText = saveBtn.innerHTML;
                saveBtn.innerHTML = '<svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Saving...';
                saveBtn.disabled = true;
                
                const result = await saveVoiceNote({ text: text, source: 'voice' });
                
                if (result.success) {
                    saveBtn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Saved!';
                    saveBtn.classList.add('bg-green-600');
                    showSuccess('✨ Voice note saved successfully!');
                    
                    setTimeout(() => {
                        if (modal) {
                            modal.classList.add('hidden');
                            modal.classList.remove('flex');
                        }
                        if (container) container.innerHTML = '';
                        refreshNotesList();
                    }, 800);
                } else {
                    saveBtn.innerHTML = originalText;
                    saveBtn.disabled = false;
                    showError('❌ Failed to save: ' + result.error);
                }
            }
        }
        
        function handleCloseModal() {
            if (modal) {
                modal.style.animation = 'fadeOut 0.2s ease-out forwards';
                setTimeout(() => {
                    modal.classList.add('hidden');
                    modal.classList.remove('flex');
                    if (container) container.innerHTML = '';
                    modal.style.animation = '';
                }, 200);
            }
        }
        
        createBtn.onclick = () => {
            if (modal) {
                modal.classList.remove('hidden');
                modal.classList.add('flex');
            }
            if (container) {
                container.innerHTML = getVoiceRecorderModalHTML();
                setupModalEvents(modal, container, handleSaveNote, handleCloseModal);
            }
        };
        
        if (modal) {
            modal.onclick = (e) => {
                if (e.target === modal) {
                    handleCloseModal();
                }
            };
        }
        
        attachDeleteEvents();
        
    }, 100);
}