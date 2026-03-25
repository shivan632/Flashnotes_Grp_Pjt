// frontend/src/components/pdf/TextReader.js

export function TextReader() {
    return `
        <div id="textReaderModal" class="text-reader-modal hidden">
            <div class="text-reader-container">
                <div class="reader-header">
                    <h3>🔊 Text Reader</h3>
                    <button id="closeReaderBtn" class="close-reader">&times;</button>
                </div>
                
                <div class="waveform-container">
                    <div class="waveform" id="waveform">
                        <div class="wave-bar"></div><div class="wave-bar"></div><div class="wave-bar"></div>
                        <div class="wave-bar"></div><div class="wave-bar"></div><div class="wave-bar"></div>
                        <div class="wave-bar"></div><div class="wave-bar"></div><div class="wave-bar"></div>
                        <div class="wave-bar"></div><div class="wave-bar"></div><div class="wave-bar"></div>
                    </div>
                </div>
                
                <div class="reader-controls">
                    <button id="playPauseBtn" class="control-btn play-btn">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </button>
                    <button id="stopBtn" class="control-btn stop-btn">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 10h6v4H9z"></path>
                        </svg>
                    </button>
                </div>
                
                <div class="reader-settings">
                    <div class="setting-group">
                        <label>Voice</label>
                        <select id="voiceSelect">
                            <option value="en">English (US) - Female</option>
                            <option value="hi">Hindi (India) - Female</option>
                            <option value="en-male">English (US) - Male</option>
                        </select>
                    </div>
                    <div class="setting-group">
                        <label>Speed</label>
                        <select id="speedSelect">
                            <option value="0.8">Slow</option>
                            <option value="1.0" selected>Normal</option>
                            <option value="1.2">Fast</option>
                        </select>
                    </div>
                </div>
                
                <div class="reader-text" id="readerText"></div>
            </div>
        </div>
    `;
}

export function setupTextReader() {
    const modal = document.getElementById('textReaderModal');
    const closeBtn = document.getElementById('closeReaderBtn');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const stopBtn = document.getElementById('stopBtn');
    const voiceSelect = document.getElementById('voiceSelect');
    const speedSelect = document.getElementById('speedSelect');
    const readerText = document.getElementById('readerText');
    const waveform = document.getElementById('waveform');
    
    let currentUtterance = null;
    let isPlaying = false;
    let currentText = '';
    let voices = [];
    
    // Load available voices
    function loadVoices() {
        voices = window.speechSynthesis.getVoices();
        
        // Update voice select options
        if (voiceSelect && voices.length) {
            const englishVoices = voices.filter(v => v.lang.startsWith('en'));
            const hindiVoices = voices.filter(v => v.lang.startsWith('hi'));
            
            // Add custom options based on available voices
            const options = [
                { value: 'en', label: 'English (US) - Female', voice: englishVoices.find(v => v.name.includes('Samantha') || v.name.includes('Google US English')) },
                { value: 'hi', label: 'Hindi (India) - Female', voice: hindiVoices.find(v => v.name.includes('Lekha') || v.name.includes('Google हिन्दी')) },
                { value: 'en-male', label: 'English (US) - Male', voice: englishVoices.find(v => v.name.includes('Alex') || v.name.includes('Google UK English Male')) }
            ];
            
            // Update select options
            voiceSelect.innerHTML = options.map(opt => 
                `<option value="${opt.value}" ${opt.voice ? '' : 'disabled'}>${opt.label} ${!opt.voice ? '(not available)' : ''}</option>`
            ).join('');
        }
    }
    
    // Speak text
    function speak(text, voiceType = 'en', rate = 1.0) {
        if (!text) return;
        
        // Stop current speech
        if (currentUtterance) {
            window.speechSynthesis.cancel();
        }
        
        currentUtterance = new SpeechSynthesisUtterance(text);
        
        // Set voice
        const allVoices = window.speechSynthesis.getVoices();
        let selectedVoice = null;
        
        if (voiceType === 'hi') {
            selectedVoice = allVoices.find(v => v.lang === 'hi-IN' || v.lang.startsWith('hi'));
        } else if (voiceType === 'en-male') {
            selectedVoice = allVoices.find(v => v.lang === 'en-US' && v.name.includes('Male')) || 
                           allVoices.find(v => v.lang === 'en-GB' && v.name.includes('Male'));
        } else {
            selectedVoice = allVoices.find(v => v.lang === 'en-US' && (v.name.includes('Samantha') || v.name.includes('Female'))) ||
                           allVoices.find(v => v.lang === 'en-US');
        }
        
        if (selectedVoice) {
            currentUtterance.voice = selectedVoice;
        }
        
        currentUtterance.rate = rate;
        currentUtterance.pitch = 1.0;
        currentUtterance.volume = 1.0;
        
        // Animate waveform
        currentUtterance.onstart = () => {
            isPlaying = true;
            updatePlayPauseIcon(true);
            startWaveformAnimation();
        };
        
        currentUtterance.onend = () => {
            isPlaying = false;
            updatePlayPauseIcon(false);
            stopWaveformAnimation();
        };
        
        currentUtterance.onerror = () => {
            isPlaying = false;
            updatePlayPauseIcon(false);
            stopWaveformAnimation();
        };
        
        window.speechSynthesis.speak(currentUtterance);
    }
    
    function startWaveformAnimation() {
        if (waveform) {
            waveform.classList.add('playing');
        }
    }
    
    function stopWaveformAnimation() {
        if (waveform) {
            waveform.classList.remove('playing');
        }
    }
    
    function updatePlayPauseIcon(playing) {
        if (playPauseBtn) {
            if (playing) {
                playPauseBtn.innerHTML = `
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                `;
            } else {
                playPauseBtn.innerHTML = `
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                `;
            }
        }
    }
    
    // Event listeners
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', () => {
            if (isPlaying) {
                window.speechSynthesis.pause();
                isPlaying = false;
                updatePlayPauseIcon(false);
                stopWaveformAnimation();
            } else if (currentUtterance) {
                window.speechSynthesis.resume();
                isPlaying = true;
                updatePlayPauseIcon(true);
                startWaveformAnimation();
            } else if (currentText) {
                const voiceType = voiceSelect?.value || 'en';
                const speed = parseFloat(speedSelect?.value || 1.0);
                speak(currentText, voiceType, speed);
            }
        });
    }
    
    if (stopBtn) {
        stopBtn.addEventListener('click', () => {
            window.speechSynthesis.cancel();
            isPlaying = false;
            currentUtterance = null;
            updatePlayPauseIcon(false);
            stopWaveformAnimation();
        });
    }
    
    if (voiceSelect) {
        voiceSelect.addEventListener('change', () => {
            if (currentText && !isPlaying) {
                const voiceType = voiceSelect.value;
                const speed = parseFloat(speedSelect?.value || 1.0);
                speak(currentText, voiceType, speed);
            }
        });
    }
    
    if (speedSelect) {
        speedSelect.addEventListener('change', () => {
            if (currentUtterance && !isPlaying) {
                const voiceType = voiceSelect?.value || 'en';
                const speed = parseFloat(speedSelect.value);
                speak(currentText, voiceType, speed);
            }
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            window.speechSynthesis.cancel();
            modal.classList.add('hidden');
        });
    }
    
    // Load voices
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
    
    // Open reader function
    window.openTextReader = (text) => {
        currentText = text;
        if (readerText) {
            readerText.textContent = text.length > 500 ? text.substring(0, 500) + '...' : text;
        }
        modal.classList.remove('hidden');
        
        // Auto speak
        const voiceType = voiceSelect?.value || 'en';
        const speed = parseFloat(speedSelect?.value || 1.0);
        speak(currentText, voiceType, speed);
    };
    
    return {
        open: (text) => window.openTextReader(text),
        close: () => modal.classList.add('hidden')
    };
}

// Add CSS styles
const textReaderStyles = `
    .text-reader-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
    }
    
    .text-reader-container {
        background: linear-gradient(135deg, #1F2937, #111827);
        border-radius: 24px;
        width: 90%;
        max-width: 500px;
        padding: 24px;
        border: 1px solid #374151;
        animation: fadeInUp 0.3s ease-out;
    }
    
    .reader-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }
    
    .reader-header h3 {
        font-size: 20px;
        font-weight: bold;
        color: white;
        margin: 0;
    }
    
    .close-reader {
        background: none;
        border: none;
        color: #9CA3AF;
        font-size: 28px;
        cursor: pointer;
        transition: color 0.3s;
    }
    
    .close-reader:hover {
        color: white;
    }
    
    .waveform-container {
        margin-bottom: 24px;
    }
    
    .waveform {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        height: 60px;
    }
    
    .wave-bar {
        width: 4px;
        height: 20px;
        background: #3B82F6;
        border-radius: 2px;
        transition: height 0.1s;
    }
    
    .waveform.playing .wave-bar {
        animation: wave 0.5s ease-in-out infinite;
    }
    
    .waveform.playing .wave-bar:nth-child(1) { animation-delay: 0s; height: 30px; }
    .waveform.playing .wave-bar:nth-child(2) { animation-delay: 0.1s; height: 40px; }
    .waveform.playing .wave-bar:nth-child(3) { animation-delay: 0.2s; height: 25px; }
    .waveform.playing .wave-bar:nth-child(4) { animation-delay: 0.3s; height: 45px; }
    .waveform.playing .wave-bar:nth-child(5) { animation-delay: 0.4s; height: 35px; }
    .waveform.playing .wave-bar:nth-child(6) { animation-delay: 0.5s; height: 50px; }
    
    @keyframes wave {
        0%, 100% { height: 20px; }
        50% { height: 50px; }
    }
    
    .reader-controls {
        display: flex;
        justify-content: center;
        gap: 20px;
        margin-bottom: 24px;
    }
    
    .control-btn {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        border: none;
    }
    
    .play-btn {
        background: linear-gradient(135deg, #3B82F6, #A78BFA);
        color: white;
    }
    
    .play-btn:hover {
        transform: scale(1.1);
        box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
    }
    
    .stop-btn {
        background: #374151;
        color: #E5E7EB;
    }
    
    .stop-btn:hover {
        background: #4B5563;
        transform: scale(1.05);
    }
    
    .reader-settings {
        display: flex;
        gap: 16px;
        margin-bottom: 20px;
        padding: 16px;
        background: #111827;
        border-radius: 12px;
    }
    
    .setting-group {
        flex: 1;
    }
    
    .setting-group label {
        display: block;
        font-size: 12px;
        color: #9CA3AF;
        margin-bottom: 4px;
    }
    
    .setting-group select {
        width: 100%;
        background: #1F2937;
        border: 1px solid #374151;
        border-radius: 8px;
        padding: 8px;
        color: white;
        cursor: pointer;
    }
    
    .reader-text {
        background: #111827;
        border-radius: 12px;
        padding: 16px;
        font-size: 14px;
        line-height: 1.6;
        color: #E5E7EB;
        max-height: 200px;
        overflow-y: auto;
    }
`;

if (!document.querySelector('#text-reader-styles')) {
    const style = document.createElement('style');
    style.id = 'text-reader-styles';
    style.textContent = textReaderStyles;
    document.head.appendChild(style);
}