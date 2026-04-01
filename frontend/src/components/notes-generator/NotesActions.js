// Notes Actions Component - For copy, download, save buttons

export function NotesActions({ notes, topic, notesId, onCopy, onDownload, onSave }) {
    const viewerId = `notes-actions-${Date.now()}`;
    
    return `
        <div id="${viewerId}" class="flex gap-2">
            <button id="copyNotesBtn-${viewerId}" class="copy-notes-btn p-2 bg-[#111827] rounded-lg hover:bg-[#1F2937] transition-all duration-300 group" title="Copy Notes">
                <svg class="w-5 h-5 text-[#9CA3AF] group-hover:text-[#3B82F6] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
            </button>
            <button id="downloadNotesBtn-${viewerId}" class="download-notes-btn p-2 bg-[#111827] rounded-lg hover:bg-[#1F2937] transition-all duration-300 group" title="Download as Markdown">
                <svg class="w-5 h-5 text-[#9CA3AF] group-hover:text-[#3B82F6] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
            </button>
            <button id="saveNotesBtn-${viewerId}" class="save-notes-btn p-2 bg-[#111827] rounded-lg hover:bg-[#1F2937] transition-all duration-300 group" title="Save to Collection">
                <svg class="w-5 h-5 text-[#9CA3AF] group-hover:text-[#3B82F6] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                </svg>
            </button>
        </div>
        
        <script>
            (function() {
                const copyBtn = document.getElementById('copyNotesBtn-${viewerId}');
                const downloadBtn = document.getElementById('downloadNotesBtn-${viewerId}');
                const saveBtn = document.getElementById('saveNotesBtn-${viewerId}');
                
                if (copyBtn) {
                    copyBtn.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        if (window.handleCopyNotes) window.handleCopyNotes();
                    });
                }
                
                if (downloadBtn) {
                    downloadBtn.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        if (window.handleDownloadNotes) window.handleDownloadNotes();
                    });
                }
                
                if (saveBtn) {
                    saveBtn.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        if (window.handleSaveNotes) window.handleSaveNotes();
                    });
                }
            })();
        </script>
    `;
}

export function setupNotesActions() {
    // This function can be used to set up any additional action handlers
    console.log('🎯 Notes actions initialized');
}

export default {
    NotesActions,
    setupNotesActions
};