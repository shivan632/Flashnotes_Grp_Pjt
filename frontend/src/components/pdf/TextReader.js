// frontend/src/components/pdf/TextReader.js

export function TextReader() {
    return `
        <div id="textReaderModal" class="text-reader-modal hidden">
            <div class="text-reader-container">
                <div class="reader-header">
                    <div class="header-glow"></div>
                    <div class="header-icon">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>
                        </svg>
                    </div>
                    <h3>AI Voice Reader</h3>
                    <button id="closeReaderBtn" class="close-reader">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
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
                    <button id="playPauseBtn" class="control-btn play-btn group">
                        <svg class="w-7 h-7 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span class="btn-tooltip">Play / Pause</span>
                    </button>
                    <button id="stopBtn" class="control-btn stop-btn group">
                        <svg class="w-7 h-7 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 10h6v4H9z"></path>
                        </svg>
                        <span class="btn-tooltip">Stop</span>
                    </button>
                </div>
                
                <div class="reader-settings">
                    <div class="setting-group">
                        <label>🎙️ Voice</label>
                        <select id="voiceSelect" class="voice-select">
                            <option value="en">🇺🇸 English (US) - Female</option>
                            <option value="hi">🇮🇳 Hindi (India) - Female</option>
                            <option value="en-male">🇬🇧 English (UK) - Male</option>
                        </select>
                    </div>
                    <div class="setting-group">
                        <label>⚡ Speed</label>
                        <div class="speed-control">
                            <span class="speed-value" id="speedValue">1.0x</span>
                            <input type="range" id="speedRange" min="0.5" max="2" step="0.1" value="1.0" class="speed-slider">
                        </div>
                    </div>
                </div>
                
                <div class="reader-text-container">
                    <div class="text-header">
                        <span>📖 Reading Text</span>
                        <button id="copyTextBtn" class="copy-text-btn">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                            </svg>
                            Copy
                        </button>
                    </div>
                    <div class="reader-text" id="readerText"></div>
                </div>
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
    const speedRange = document.getElementById('speedRange');
    const speedValue = document.getElementById('speedValue');
    const copyTextBtn = document.getElementById('copyTextBtn');
    const readerText = document.getElementById('readerText');
    const waveform = document.getElementById('waveform');
    
    let currentUtterance = null;
    let isPlaying = false;
    let currentText = '';
    let voices = [];
    
    // Load available voices
    function loadVoices() {
        voices = window.speechSynthesis.getVoices();
        
        if (voiceSelect && voices.length) {
            const englishFemale = voices.find(v => (v.lang === 'en-US' || v.lang.startsWith('en')) && (v.name.includes('Samantha') || v.name.includes('Google US English') || v.name.includes('Female')));
            const hindiVoice = voices.find(v => v.lang === 'hi-IN' || v.lang.startsWith('hi'));
            const englishMale = voices.find(v => (v.lang === 'en-GB' || v.lang === 'en-US') && (v.name.includes('Male') || v.name.includes('Alex')));
            
            const options = [
                { value: 'en', label: '🇺🇸 English (US) - Female', voice: englishFemale },
                { value: 'hi', label: '🇮🇳 Hindi (India) - Female', voice: hindiVoice },
                { value: 'en-male', label: '🇬🇧 English (UK) - Male', voice: englishMale }
            ];
            
            voiceSelect.innerHTML = options.map(opt => 
                `<option value="${opt.value}" ${opt.voice ? '' : 'disabled'}>${opt.label} ${!opt.voice ? '(not available)' : ''}</option>`
            ).join('');
        }
    }
    
    // Speak text
    function speak(text, voiceType = 'en', rate = 1.0) {
        if (!text) return;
        
        if (currentUtterance) {
            window.speechSynthesis.cancel();
        }
        
        currentUtterance = new SpeechSynthesisUtterance(text);
        
        const allVoices = window.speechSynthesis.getVoices();
        let selectedVoice = null;
        
        if (voiceType === 'hi') {
            selectedVoice = allVoices.find(v => v.lang === 'hi-IN' || v.lang.startsWith('hi'));
        } else if (voiceType === 'en-male') {
            selectedVoice = allVoices.find(v => (v.lang === 'en-GB' || v.lang === 'en-US') && (v.name.includes('Male') || v.name.includes('Alex'))) ||
                           allVoices.find(v => v.lang === 'en-GB');
        } else {
            selectedVoice = allVoices.find(v => (v.lang === 'en-US' || v.lang.startsWith('en')) && 
                           (v.name.includes('Samantha') || v.name.includes('Female') || v.name.includes('Google US English'))) ||
                           allVoices.find(v => v.lang === 'en-US');
        }
        
        if (selectedVoice) {
            currentUtterance.voice = selectedVoice;
        }
        
        currentUtterance.rate = rate;
        currentUtterance.pitch = 1.0;
        currentUtterance.volume = 1.0;
        
        currentUtterance.onstart = () => {
            isPlaying = true;
            updatePlayPauseIcon(true);
            startWaveformAnimation();
            modal?.classList.add('speaking');
        };
        
        currentUtterance.onend = () => {
            isPlaying = false;
            updatePlayPauseIcon(false);
            stopWaveformAnimation();
            modal?.classList.remove('speaking');
        };
        
        currentUtterance.onerror = () => {
            isPlaying = false;
            updatePlayPauseIcon(false);
            stopWaveformAnimation();
            modal?.classList.remove('speaking');
        };
        
        window.speechSynthesis.speak(currentUtterance);
    }
    
    function startWaveformAnimation() {
        if (waveform) {
            waveform.classList.add('playing');
            const bars = waveform.querySelectorAll('.wave-bar');
            bars.forEach((bar, i) => {
                bar.style.animation = `wave 0.8s ease-in-out infinite ${i * 0.05}s`;
            });
        }
    }
    
    function stopWaveformAnimation() {
        if (waveform) {
            waveform.classList.remove('playing');
            const bars = waveform.querySelectorAll('.wave-bar');
            bars.forEach(bar => {
                bar.style.animation = 'none';
                bar.style.height = '20px';
            });
        }
    }
    
    function updatePlayPauseIcon(playing) {
        if (playPauseBtn) {
            if (playing) {
                playPauseBtn.innerHTML = `
                    <svg class="w-7 h-7 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                `;
                playPauseBtn.classList.add('playing');
            } else {
                playPauseBtn.innerHTML = `
                    <svg class="w-7 h-7 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                `;
                playPauseBtn.classList.remove('playing');
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
            } else if (currentUtterance && window.speechSynthesis.speaking) {
                window.speechSynthesis.resume();
                isPlaying = true;
                updatePlayPauseIcon(true);
                startWaveformAnimation();
            } else if (currentText) {
                const voiceType = voiceSelect?.value || 'en';
                const speed = parseFloat(speedRange?.value || 1.0);
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
                const speed = parseFloat(speedRange?.value || 1.0);
                speak(currentText, voiceType, speed);
            }
        });
    }
    
    if (speedRange && speedValue) {
        speedRange.addEventListener('input', (e) => {
            const speed = parseFloat(e.target.value);
            speedValue.textContent = `${speed.toFixed(1)}x`;
            
            if (currentUtterance && !isPlaying) {
                const voiceType = voiceSelect?.value || 'en';
                speak(currentText, voiceType, speed);
            }
        });
    }
    
    if (copyTextBtn && readerText) {
        copyTextBtn.addEventListener('click', async () => {
            const text = readerText.textContent || '';
            if (text) {
                await navigator.clipboard.writeText(text);
                copyTextBtn.classList.add('copied');
                copyTextBtn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Copied!';
                setTimeout(() => {
                    copyTextBtn.classList.remove('copied');
                    copyTextBtn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg> Copy';
                }, 2000);
            }
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            window.speechSynthesis.cancel();
            modal?.classList.add('hidden');
            modal?.classList.remove('speaking');
            isPlaying = false;
            currentUtterance = null;
            updatePlayPauseIcon(false);
            stopWaveformAnimation();
        });
    }
    
    // Click outside to close
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                window.speechSynthesis.cancel();
                modal.classList.add('hidden');
                modal.classList.remove('speaking');
                isPlaying = false;
                currentUtterance = null;
                updatePlayPauseIcon(false);
                stopWaveformAnimation();
            }
        });
    }
    
    // Load voices
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
    
    // Open reader function
    window.openTextReader = (text) => {
        currentText = text;
        if (readerText) {
            const truncatedText = text.length > 800 ? text.substring(0, 800) + '...' : text;
            readerText.textContent = truncatedText;
        }
        modal?.classList.remove('hidden');
        
        const voiceType = voiceSelect?.value || 'en';
        const speed = parseFloat(speedRange?.value || 1.0);
        speak(currentText, voiceType, speed);
    };
    
    return {
        open: (text) => window.openTextReader(text),
        close: () => {
            window.speechSynthesis.cancel();
            modal?.classList.add('hidden');
            modal?.classList.remove('speaking');
            isPlaying = false;
            currentUtterance = null;
            updatePlayPauseIcon(false);
            stopWaveformAnimation();
        }
    };
}

// Enhanced CSS styles
const textReaderStyles = `
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px) scale(0.95); }
        to { opacity: 1; transform: translateY(0) scale(1); }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0) scale(1); }
        to { opacity: 0; transform: translateY(20px) scale(0.95); }
    }
    
    @keyframes wave {
        0%, 100% { height: 20px; background: #3B82F6; }
        50% { height: 50px; background: #A78BFA; }
    }
    
    @keyframes glowPulse {
        0%, 100% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.3); }
        50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.6); }
    }
    
    .text-reader-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(12px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        transition: all 0.3s;
    }
    
    .text-reader-modal.hidden {
        display: none;
    }
    
    .text-reader-container {
        background: linear-gradient(135deg, #1F2937 0%, #111827 100%);
        border-radius: 28px;
        width: 90%;
        max-width: 520px;
        padding: 28px;
        border: 1px solid #374151;
        animation: fadeInUp 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        position: relative;
        overflow: hidden;
    }
    
    .text-reader-modal.speaking .text-reader-container {
        border-color: #3B82F6;
        box-shadow: 0 0 30px rgba(59, 130, 246, 0.3);
    }
    
    .reader-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 24px;
        position: relative;
    }
    
    .header-glow {
        position: absolute;
        top: -20px;
        left: -20px;
        right: -20px;
        height: 80px;
        background: radial-gradient(ellipse at center, rgba(59, 130, 246, 0.15), transparent);
        opacity: 0;
        transition: opacity 0.3s;
    }
    
    .text-reader-modal.speaking .header-glow {
        opacity: 1;
    }
    
    .header-icon {
        width: 44px;
        height: 44px;
        background: linear-gradient(135deg, #3B82F6, #A78BFA);
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
    }
    
    .reader-header h3 {
        flex: 1;
        font-size: 20px;
        font-weight: 700;
        background: linear-gradient(135deg, #F9FAFB, #9CA3AF);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        margin: 0;
    }
    
    .close-reader {
        width: 36px;
        height: 36px;
        background: #374151;
        border: none;
        border-radius: 10px;
        color: #9CA3AF;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s;
    }
    
    .close-reader:hover {
        background: #EF4444;
        color: white;
        transform: rotate(90deg);
    }
    
    .waveform-container {
        margin-bottom: 28px;
        background: #0F172A;
        border-radius: 60px;
        padding: 12px;
    }
    
    .waveform {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        height: 70px;
    }
    
    .wave-bar {
        width: 5px;
        height: 20px;
        background: #3B82F6;
        border-radius: 4px;
        transition: all 0.1s ease;
    }
    
    .waveform.playing .wave-bar {
        animation: wave 0.6s ease-in-out infinite;
    }
    
    .waveform.playing .wave-bar:nth-child(1) { animation-delay: 0.00s; }
    .waveform.playing .wave-bar:nth-child(2) { animation-delay: 0.08s; }
    .waveform.playing .wave-bar:nth-child(3) { animation-delay: 0.16s; }
    .waveform.playing .wave-bar:nth-child(4) { animation-delay: 0.24s; }
    .waveform.playing .wave-bar:nth-child(5) { animation-delay: 0.32s; }
    .waveform.playing .wave-bar:nth-child(6) { animation-delay: 0.40s; }
    .waveform.playing .wave-bar:nth-child(7) { animation-delay: 0.48s; }
    .waveform.playing .wave-bar:nth-child(8) { animation-delay: 0.56s; }
    .waveform.playing .wave-bar:nth-child(9) { animation-delay: 0.64s; }
    .waveform.playing .wave-bar:nth-child(10) { animation-delay: 0.72s; }
    .waveform.playing .wave-bar:nth-child(11) { animation-delay: 0.80s; }
    .waveform.playing .wave-bar:nth-child(12) { animation-delay: 0.88s; }
    
    .reader-controls {
        display: flex;
        justify-content: center;
        gap: 24px;
        margin-bottom: 28px;
    }
    
    .control-btn {
        position: relative;
        width: 64px;
        height: 64px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border: none;
    }
    
    .btn-tooltip {
        position: absolute;
        bottom: -30px;
        left: 50%;
        transform: translateX(-50%);
        background: #1F2937;
        color: #9CA3AF;
        font-size: 10px;
        padding: 4px 8px;
        border-radius: 6px;
        white-space: nowrap;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s;
        border: 1px solid #374151;
    }
    
    .control-btn:hover .btn-tooltip {
        opacity: 1;
    }
    
    .play-btn {
        background: linear-gradient(135deg, #3B82F6, #A78BFA);
        color: white;
        box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
    }
    
    .play-btn:hover {
        transform: scale(1.12);
        box-shadow: 0 8px 25px rgba(59, 130, 246, 0.5);
    }
    
    .play-btn.playing {
        animation: glowPulse 1.5s infinite;
    }
    
    .stop-btn {
        background: #374151;
        color: #E5E7EB;
    }
    
    .stop-btn:hover {
        background: #EF4444;
        transform: scale(1.08);
    }
    
    .reader-settings {
        display: flex;
        gap: 20px;
        margin-bottom: 24px;
        padding: 18px;
        background: linear-gradient(135deg, #111827, #0F172A);
        border-radius: 18px;
        border: 1px solid #374151;
    }
    
    .setting-group {
        flex: 1;
    }
    
    .setting-group label {
        display: block;
        font-size: 12px;
        font-weight: 500;
        color: #9CA3AF;
        margin-bottom: 8px;
    }
    
    .voice-select {
        width: 100%;
        background: #1F2937;
        border: 1px solid #374151;
        border-radius: 10px;
        padding: 10px 12px;
        color: white;
        cursor: pointer;
        font-size: 13px;
        transition: all 0.3s;
    }
    
    .voice-select:hover {
        border-color: #3B82F6;
    }
    
    .speed-control {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    
    .speed-value {
        font-size: 14px;
        font-weight: 600;
        color: #3B82F6;
        min-width: 45px;
    }
    
    .speed-slider {
        flex: 1;
        height: 4px;
        -webkit-appearance: none;
        background: #374151;
        border-radius: 4px;
        outline: none;
    }
    
    .speed-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 16px;
        height: 16px;
        background: linear-gradient(135deg, #3B82F6, #A78BFA);
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 0 5px rgba(59, 130, 246, 0.5);
    }
    
    .reader-text-container {
        background: #0F172A;
        border-radius: 16px;
        overflow: hidden;
        border: 1px solid #374151;
    }
    
    .text-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        background: #1F2937;
        border-bottom: 1px solid #374151;
        font-size: 12px;
        color: #9CA3AF;
    }
    
    .copy-text-btn {
        display: flex;
        align-items: center;
        gap: 6px;
        background: none;
        border: none;
        color: #60A5FA;
        cursor: pointer;
        padding: 4px 10px;
        border-radius: 8px;
        font-size: 12px;
        transition: all 0.3s;
    }
    
    .copy-text-btn:hover {
        background: rgba(59, 130, 246, 0.2);
        transform: scale(1.05);
    }
    
    .copy-text-btn.copied {
        color: #10B981;
    }
    
    .reader-text {
        padding: 16px;
        font-size: 14px;
        line-height: 1.7;
        color: #E5E7EB;
        max-height: 200px;
        overflow-y: auto;
        scrollbar-width: thin;
    }
    
    .reader-text::-webkit-scrollbar {
        width: 4px;
    }
    
    .reader-text::-webkit-scrollbar-track {
        background: #1F2937;
        border-radius: 10px;
    }
    
    .reader-text::-webkit-scrollbar-thumb {
        background: linear-gradient(135deg, #3B82F6, #A78BFA);
        border-radius: 10px;
    }
`;

if (!document.querySelector('#text-reader-styles')) {
    const style = document.createElement('style');
    style.id = 'text-reader-styles';
    style.textContent = textReaderStyles;
    document.head.appendChild(style);
}