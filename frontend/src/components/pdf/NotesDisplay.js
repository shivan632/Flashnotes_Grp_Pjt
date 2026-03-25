// frontend/src/components/pdf/NotesDisplay.js

export function NotesDisplay(summary = '', onDownload = null, onReadAloud = null) {
    // Parse summary into sections
    const sections = parseSummary(summary);
    
    return `
        <div class="notes-display-container">
            <div class="notes-header">
                <h3 class="notes-title">📝 AI Generated Notes</h3>
                <div class="notes-actions">
                    <button id="downloadNotesBtn" class="notes-action-btn download-btn">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        Download PDF
                    </button>
                    <button id="readAloudBtn" class="notes-action-btn read-btn">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>
                        </svg>
                        Read Aloud
                    </button>
                </div>
            </div>
            
            <div class="notes-content">
                ${sections.map(section => `
                    <div class="notes-section">
                        <div class="section-header">
                            <span class="section-icon">${section.icon}</span>
                            <h4 class="section-title">${section.title}</h4>
                            <button class="copy-section-btn" data-content="${escapeHtml(section.content)}">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                                </svg>
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
        '📝 SUMMARY:': { icon: '📝', title: 'Summary' },
        '🎯 KEY POINTS:': { icon: '🎯', title: 'Key Points' },
        '📌 IMPORTANT NOTES:': { icon: '📌', title: 'Important Notes' },
        '📚 QUICK REFERENCE:': { icon: '📚', title: 'Quick Reference' }
    };
    
    for (const line of lines) {
        const trimmed = line.trim();
        
        // Check if this is a section header
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
    
    // Add last section
    if (currentSection && currentContent.length > 0) {
        sections.push({
            ...currentSection,
            content: currentContent.join('\n').trim()
        });
    }
    
    return sections;
}

function formatContent(content) {
    // Convert bullet points to HTML
    const lines = content.split('\n');
    let html = '';
    
    for (const line of lines) {
        if (line.startsWith('-') || line.startsWith('•')) {
            html += `<div class="bullet-point">${line}</div>`;
        } else if (line.match(/^\d+\./)) {
            html += `<div class="numbered-point">${line}</div>`;
        } else if (line.includes(':')) {
            const [term, definition] = line.split(':');
            html += `<div class="term-definition"><strong>${term.trim()}:</strong> ${definition.trim()}</div>`;
        } else {
            html += `<p class="content-paragraph">${line}</p>`;
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
        downloadBtn.addEventListener('click', () => {
            if (onDownload) onDownload();
        });
    }
    
    if (readAloudBtn) {
        readAloudBtn.addEventListener('click', () => {
            if (onReadAloud) onReadAloud();
        });
    }
    
    copyBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            const content = btn.dataset.content;
            if (content) {
                await navigator.clipboard.writeText(content);
                const originalHTML = btn.innerHTML;
                btn.innerHTML = '<svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';
                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                }, 2000);
            }
        });
    });
}

// Add CSS styles
const notesDisplayStyles = `
    .notes-display-container {
        background: linear-gradient(135deg, #1F2937, #111827);
        border-radius: 20px;
        padding: 24px;
        margin-top: 24px;
        border: 1px solid #374151;
    }
    
    .notes-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        padding-bottom: 16px;
        border-bottom: 1px solid #374151;
    }
    
    .notes-title {
        font-size: 20px;
        font-weight: bold;
        color: white;
        margin: 0;
    }
    
    .notes-actions {
        display: flex;
        gap: 12px;
    }
    
    .notes-action-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        border-radius: 10px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        border: none;
    }
    
    .download-btn {
        background: linear-gradient(135deg, #3B82F6, #A78BFA);
        color: white;
    }
    
    .download-btn:hover {
        transform: scale(1.05);
        box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
    }
    
    .read-btn {
        background: #374151;
        color: #E5E7EB;
    }
    
    .read-btn:hover {
        background: #4B5563;
        transform: scale(1.05);
    }
    
    .notes-section {
        margin-bottom: 24px;
        background: #111827;
        border-radius: 16px;
        padding: 16px;
        border: 1px solid #374151;
        transition: all 0.3s ease;
    }
    
    .notes-section:hover {
        border-color: #3B82F6;
        transform: translateX(4px);
    }
    
    .section-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;
        cursor: pointer;
    }
    
    .section-icon {
        font-size: 24px;
    }
    
    .section-title {
        font-size: 18px;
        font-weight: 600;
        color: #3B82F6;
        margin: 0;
        flex: 1;
    }
    
    .copy-section-btn {
        background: none;
        border: none;
        color: #9CA3AF;
        cursor: pointer;
        padding: 4px;
        border-radius: 6px;
        transition: all 0.3s ease;
    }
    
    .copy-section-btn:hover {
        color: #3B82F6;
        background: rgba(59, 130, 246, 0.1);
    }
    
    .section-content {
        padding-left: 36px;
        color: #E5E7EB;
        font-size: 14px;
        line-height: 1.6;
    }
    
    .bullet-point, .numbered-point {
        margin-bottom: 8px;
        padding-left: 20px;
        position: relative;
    }
    
    .bullet-point::before {
        content: "•";
        color: #3B82F6;
        position: absolute;
        left: 0;
    }
    
    .numbered-point {
        list-style-type: none;
    }
    
    .term-definition {
        margin-bottom: 8px;
        padding: 8px 12px;
        background: #1F2937;
        border-radius: 8px;
        border-left: 3px solid #3B82F6;
    }
    
    .term-definition strong {
        color: #60A5FA;
    }
    
    .content-paragraph {
        margin-bottom: 12px;
        line-height: 1.6;
    }
`;

if (!document.querySelector('#notes-display-styles')) {
    const style = document.createElement('style');
    style.id = 'notes-display-styles';
    style.textContent = notesDisplayStyles;
    document.head.appendChild(style);
}