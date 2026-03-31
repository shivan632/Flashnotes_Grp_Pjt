// frontend/src/components/pdf/NotesDisplay.js

export function NotesDisplay(summary = '', onDownload = null, onReadAloud = null) {
    // Parse summary into sections
    const sections = parseSummary(summary);
    
    return `
        <div class="notes-display-container animate-fadeInUp">
            <div class="notes-header">
                <div class="notes-title-wrapper">
                    <div class="notes-icon-glow">
                        <svg class="notes-main-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                    </div>
                    <div>
                        <h3 class="notes-title">✨ AI Generated Notes</h3>
                        <p class="notes-subtitle">Smart summaries from your PDF content</p>
                    </div>
                </div>
                <div class="notes-actions">
                    <button id="downloadNotesBtn" class="notes-action-btn download-btn group">
                        <svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <span>Download PDF</span>
                    </button>
                    <button id="readAloudBtn" class="notes-action-btn read-btn group">
                        <svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>
                        </svg>
                        <span>Read Aloud</span>
                    </button>
                </div>
            </div>
            
            <div class="notes-content">
                ${sections.map((section, idx) => `
                    <div class="notes-section animate-slideInRight" style="animation-delay: ${idx * 0.08}s">
                        <div class="section-header">
                            <div class="section-icon-wrapper">
                                <span class="section-icon">${section.icon}</span>
                            </div>
                            <h4 class="section-title">${section.title}</h4>
                            <button class="copy-section-btn" data-content="${escapeHtml(section.content)}">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                                </svg>
                                <span class="copy-tooltip">Copy section</span>
                            </button>
                        </div>
                        <div class="section-content">
                            ${formatContent(section.content)}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function parseSummary(summary) {
    const sections = [];
    const lines = summary.split('\n');
    let currentSection = null;
    let currentContent = [];
    
    const sectionConfig = {
        '📝 SUMMARY:': { icon: '📝', title: 'Summary', gradient: 'from-blue-500 to-cyan-500' },
        '🎯 KEY POINTS:': { icon: '🎯', title: 'Key Points', gradient: 'from-purple-500 to-pink-500' },
        '📌 IMPORTANT NOTES:': { icon: '📌', title: 'Important Notes', gradient: 'from-yellow-500 to-orange-500' },
        '📚 QUICK REFERENCE:': { icon: '📚', title: 'Quick Reference', gradient: 'from-green-500 to-emerald-500' }
    };
    
    for (const line of lines) {
        const trimmed = line.trim();
        
        let isHeader = false;
        for (const [header, config] of Object.entries(sectionConfig)) {
            if (trimmed.includes(header)) {
                if (currentSection) {
                    sections.push({
                        ...currentSection,
                        content: currentContent.join('\n').trim()
                    });
                }
                currentSection = config;
                currentContent = [];
                isHeader = true;
                break;
            }
        }
        
        if (!isHeader && currentSection) {
            if (trimmed) {
                currentContent.push(trimmed);
            }
        }
    }
    
    if (currentSection && currentContent.length > 0) {
        sections.push({
            ...currentSection,
            content: currentContent.join('\n').trim()
        });
    }
    
    return sections;
}

function formatContent(content) {
    const lines = content.split('\n');
    let html = '';
    
    for (const line of lines) {
        if (line.startsWith('-') || line.startsWith('•')) {
            html += `<div class="bullet-point"><span class="bullet-dot"></span><span>${escapeHtml(line.substring(1).trim())}</span></div>`;
        } else if (line.match(/^\d+\./)) {
            const match = line.match(/^(\d+)\.\s*(.*)/);
            if (match) {
                html += `<div class="numbered-point"><span class="number-badge">${match[1]}</span><span>${escapeHtml(match[2])}</span></div>`;
            }
        } else if (line.includes(':')) {
            const colonIndex = line.indexOf(':');
            const term = line.substring(0, colonIndex);
            const definition = line.substring(colonIndex + 1);
            html += `<div class="term-definition"><strong class="term-highlight">${escapeHtml(term)}:</strong> <span>${escapeHtml(definition)}</span></div>`;
        } else if (line.trim()) {
            html += `<p class="content-paragraph">${escapeHtml(line)}</p>`;
        }
    }
    
    return html;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

export function setupNotesDisplay(onDownload, onReadAloud) {
    const downloadBtn = document.getElementById('downloadNotesBtn');
    const readAloudBtn = document.getElementById('readAloudBtn');
    const copyBtns = document.querySelectorAll('.copy-section-btn');
    
    if (downloadBtn) {
        const newBtn = downloadBtn.cloneNode(true);
        downloadBtn.parentNode.replaceChild(newBtn, downloadBtn);
        newBtn.addEventListener('click', () => {
            if (onDownload) onDownload();
            newBtn.classList.add('btn-clicked');
            setTimeout(() => newBtn.classList.remove('btn-clicked'), 300);
        });
    }
    
    if (readAloudBtn) {
        const newBtn = readAloudBtn.cloneNode(true);
        readAloudBtn.parentNode.replaceChild(newBtn, readAloudBtn);
        newBtn.addEventListener('click', () => {
            if (onReadAloud) onReadAloud();
            newBtn.classList.add('btn-clicked');
            setTimeout(() => newBtn.classList.remove('btn-clicked'), 300);
        });
    }
    
    copyBtns.forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        newBtn.addEventListener('click', async () => {
            const content = newBtn.dataset.content;
            if (content) {
                await navigator.clipboard.writeText(content);
                const tooltip = newBtn.querySelector('.copy-tooltip');
                if (tooltip) {
                    const originalText = tooltip.textContent;
                    tooltip.textContent = '✓ Copied!';
                    tooltip.classList.add('tooltip-success');
                    setTimeout(() => {
                        tooltip.textContent = originalText;
                        tooltip.classList.remove('tooltip-success');
                    }, 1500);
                }
                newBtn.classList.add('copied');
                setTimeout(() => newBtn.classList.remove('copied'), 1000);
            }
        });
    });
}

// Enhanced CSS styles
const notesDisplayStyles = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
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
    
    @keyframes glowPulse {
        0%, 100% {
            box-shadow: 0 0 5px rgba(59, 130, 246, 0.3);
        }
        50% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.6);
        }
    }
    
    .animate-fadeInUp {
        animation: fadeInUp 0.5s ease-out forwards;
    }
    
    .animate-slideInRight {
        animation: slideInRight 0.4s ease-out forwards;
        opacity: 0;
    }
    
    .notes-display-container {
        background: linear-gradient(135deg, #1F2937 0%, #111827 100%);
        border-radius: 24px;
        padding: 28px;
        margin-top: 24px;
        border: 1px solid #374151;
        box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.3);
        position: relative;
        overflow: hidden;
    }
    
    .notes-display-container::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, #3B82F6, #A78BFA, #3B82F6);
        background-size: 200% 100%;
        animation: gradientMove 3s ease infinite;
    }
    
    @keyframes gradientMove {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
    }
    
    .notes-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 28px;
        padding-bottom: 20px;
        border-bottom: 2px solid #374151;
        flex-wrap: wrap;
        gap: 16px;
    }
    
    .notes-title-wrapper {
        display: flex;
        align-items: center;
        gap: 14px;
    }
    
    .notes-icon-glow {
        width: 48px;
        height: 48px;
        background: linear-gradient(135deg, #3B82F6, #A78BFA);
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        animation: glowPulse 2s infinite;
    }
    
    .notes-main-icon {
        width: 24px;
        height: 24px;
        color: white;
    }
    
    .notes-title {
        font-size: 22px;
        font-weight: 700;
        background: linear-gradient(135deg, #F9FAFB, #9CA3AF);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        margin: 0;
    }
    
    .notes-subtitle {
        font-size: 12px;
        color: #6B7280;
        margin: 4px 0 0 0;
    }
    
    .notes-actions {
        display: flex;
        gap: 12px;
    }
    
    .notes-action-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 20px;
        border-radius: 12px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border: none;
        position: relative;
        overflow: hidden;
    }
    
    .notes-action-btn::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.2);
        transform: translate(-50%, -50%);
        transition: width 0.6s, height 0.6s;
    }
    
    .notes-action-btn:hover::before {
        width: 300px;
        height: 300px;
    }
    
    .btn-clicked {
        transform: scale(0.95);
    }
    
    .download-btn {
        background: linear-gradient(135deg, #3B82F6, #A78BFA);
        color: white;
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }
    
    .download-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
    }
    
    .read-btn {
        background: #374151;
        color: #E5E7EB;
        border: 1px solid #4B5563;
    }
    
    .read-btn:hover {
        background: #4B5563;
        transform: translateY(-2px);
        border-color: #3B82F6;
    }
    
    .notes-section {
        margin-bottom: 24px;
        background: linear-gradient(135deg, #111827, #0F172A);
        border-radius: 20px;
        padding: 20px;
        border: 1px solid #374151;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
    }
    
    .notes-section::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 4px;
        height: 100%;
        background: linear-gradient(180deg, #3B82F6, #A78BFA);
        opacity: 0;
        transition: opacity 0.3s;
    }
    
    .notes-section:hover {
        border-color: #3B82F6;
        transform: translateX(6px);
        box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
    }
    
    .notes-section:hover::after {
        opacity: 1;
    }
    
    .section-header {
        display: flex;
        align-items: center;
        gap: 14px;
        margin-bottom: 16px;
        cursor: pointer;
        position: relative;
    }
    
    .section-icon-wrapper {
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, #1F2937, #111827);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #374151;
        transition: all 0.3s;
    }
    
    .notes-section:hover .section-icon-wrapper {
        border-color: #3B82F6;
        transform: scale(1.05);
    }
    
    .section-icon {
        font-size: 22px;
    }
    
    .section-title {
        font-size: 18px;
        font-weight: 600;
        background: linear-gradient(135deg, #60A5FA, #A78BFA);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        margin: 0;
        flex: 1;
    }
    
    .copy-section-btn {
        background: none;
        border: none;
        color: #9CA3AF;
        cursor: pointer;
        padding: 8px;
        border-radius: 10px;
        transition: all 0.3s;
        position: relative;
        display: flex;
        align-items: center;
        gap: 6px;
    }
    
    .copy-tooltip {
        position: absolute;
        bottom: -30px;
        right: 0;
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
    
    .copy-section-btn:hover .copy-tooltip {
        opacity: 1;
    }
    
    .tooltip-success {
        background: #10B981;
        color: white;
    }
    
    .copy-section-btn:hover {
        color: #3B82F6;
        background: rgba(59, 130, 246, 0.1);
        transform: scale(1.05);
    }
    
    .copied {
        color: #10B981 !important;
    }
    
    .section-content {
        padding-left: 54px;
        color: #D1D5DB;
        font-size: 14px;
        line-height: 1.7;
    }
    
    .bullet-point {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        margin-bottom: 10px;
        padding: 6px 0;
    }
    
    .bullet-dot {
        width: 6px;
        height: 6px;
        background: linear-gradient(135deg, #3B82F6, #A78BFA);
        border-radius: 50%;
        margin-top: 8px;
        flex-shrink: 0;
    }
    
    .numbered-point {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        margin-bottom: 10px;
        padding: 6px 0;
    }
    
    .number-badge {
        width: 22px;
        height: 22px;
        background: linear-gradient(135deg, #3B82F6, #A78BFA);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: bold;
        color: white;
        flex-shrink: 0;
    }
    
    .term-definition {
        margin-bottom: 12px;
        padding: 12px 16px;
        background: linear-gradient(135deg, #1F2937, #1A2436);
        border-radius: 12px;
        border-left: 3px solid #3B82F6;
        transition: all 0.3s;
    }
    
    .term-definition:hover {
        transform: translateX(4px);
        border-left-color: #A78BFA;
    }
    
    .term-highlight {
        color: #60A5FA;
        font-weight: 600;
    }
    
    .content-paragraph {
        margin-bottom: 12px;
        line-height: 1.7;
        padding: 4px 0;
    }
    
    /* Custom scrollbar */
    .notes-content {
        max-height: 600px;
        overflow-y: auto;
        padding-right: 8px;
    }
    
    .notes-content::-webkit-scrollbar {
        width: 5px;
    }
    
    .notes-content::-webkit-scrollbar-track {
        background: #1F2937;
        border-radius: 10px;
    }
    
    .notes-content::-webkit-scrollbar-thumb {
        background: linear-gradient(135deg, #3B82F6, #A78BFA);
        border-radius: 10px;
    }
    
    .notes-content::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(135deg, #60A5FA, #8B5CF6);
    }
`;

if (!document.querySelector('#notes-display-styles')) {
    const style = document.createElement('style');
    style.id = 'notes-display-styles';
    style.textContent = notesDisplayStyles;
    document.head.appendChild(style);
}