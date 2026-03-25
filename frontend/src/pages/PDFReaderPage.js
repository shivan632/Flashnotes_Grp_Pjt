// frontend/src/pages/PDFReaderPage.js
import { Sidebar } from '../components/layout/Sidebar.js';
import { AIChatSidebar } from '../components/layout/AIChatSidebar.js';
import { Header } from '../components/common/Header.js';
import { PDFUploader, setupPDFUploader } from '../components/pdf/PDFUploader.js';
import { NotesDisplay, setupNotesDisplay } from '../components/pdf/NotesDisplay.js';
import { TextReader, setupTextReader } from '../components/pdf/TextReader.js';
import { downloadNotesAsPDF, getTextForVoice } from '../services/pdfService.js';
import { showError, showSuccess } from '../components/common/ErrorMessage.js';

export async function PDFReaderPage() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    if (!isAuthenticated) {
        window.location.hash = '#/login';
        return '';
    }
    
    return `
        <div class="min-h-screen bg-gradient-to-b from-[#111827] to-[#0F172A] relative">
            ${Sidebar()}
            ${AIChatSidebar()}
            ${TextReader()}
            <div id="mainContent" class="min-h-screen transition-all duration-300" 
                 style="margin-left: 256px; margin-right: 384px; width: calc(100% - 640px);">
                ${Header({ title: 'PDF Reader' })}
                <main class="container mx-auto px-4 py-8 max-w-4xl">
                    <div class="mb-8">
                        <h1 class="text-3xl font-bold text-white mb-2">📄 PDF to Smart Notes</h1>
                        <p class="text-gray-400">Upload any PDF and let AI generate study notes, key points, and summaries</p>
                    </div>
                    
                    <div class="pdf-reader-container">
                        ${PDFUploader()}
                        <div id="notesContainer"></div>
                    </div>
                </main>
            </div>
        </div>
    `;
}

export function setupPDFReaderPage() {
    let currentSummary = '';
    let currentCleanText = '';
    let textReader = null;
    
    // Setup uploader with callback
    setupPDFUploader(async (result) => {
        if (result && result.success && result.data) {
            currentSummary = result.data.summary;
            
            // Display notes
            const notesContainer = document.getElementById('notesContainer');
            if (notesContainer) {
                notesContainer.innerHTML = NotesDisplay(currentSummary);
                setupNotesDisplay(
                    () => downloadNotesHandler(currentSummary),
                    () => readAloudHandler(currentSummary)
                );
                notesContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            
            showSuccess('PDF processed successfully! Notes generated.');
        } else {
            showError(result?.message || 'Failed to process PDF');
        }
    });
    
    // Setup text reader
    textReader = setupTextReader();
    
    // Download handler
    async function downloadNotesHandler(summary) {
        try {
            await downloadNotesAsPDF(summary, 'Flashnotes Summary', 'PDF Notes');
            showSuccess('Notes downloaded as PDF!');
        } catch (error) {
            showError(error.message || 'Failed to download PDF');
        }
    }
    
    // Read aloud handler
    async function readAloudHandler(summary) {
        try {
            // Get clean text for voice
            const result = await getTextForVoice(summary);
            const cleanText = result.success ? result.text : summary;
            currentCleanText = cleanText;
            
            // Open text reader
            if (textReader && textReader.open) {
                textReader.open(cleanText);
            }
        } catch (error) {
            console.error('Read aloud error:', error);
            // Fallback: use the summary directly
            if (textReader && textReader.open) {
                textReader.open(summary);
            }
        }
    }
}

// Add CSS styles
const pdfReaderStyles = `
    .pdf-reader-container {
        animation: fadeInUp 0.5s ease-out;
    }
`;

if (!document.querySelector('#pdf-reader-styles')) {
    const style = document.createElement('style');
    style.id = 'pdf-reader-styles';
    style.textContent = pdfReaderStyles;
    document.head.appendChild(style);
}