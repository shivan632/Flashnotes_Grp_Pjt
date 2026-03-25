// frontend/src/services/pdfService.js

const API_URL = window.API_URL || 'http://localhost:10000/api';

// Process PDF upload and get summary
export async function processPDF(file, onProgress = null) {
    try {
        const token = localStorage.getItem('token');
        
        const formData = new FormData();
        formData.append('pdf', file);
        
        const response = await fetch(`${API_URL}/pdf/process`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Failed to process PDF');
        }
        
        return data;
    } catch (error) {
        console.error('Process PDF error:', error);
        throw error;
    }
}

// Download notes as PDF
export async function downloadNotesAsPDF(summary, title = 'PDF Summary', topic = '') {
    try {
        const token = localStorage.getItem('token');
        
        const response = await fetch(`${API_URL}/pdf/download`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ summary, title, topic })
        });
        
        if (!response.ok) {
            throw new Error('Failed to generate PDF');
        }
        
        // Create blob and download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `flashnotes_notes_${Date.now()}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        return { success: true };
    } catch (error) {
        console.error('Download PDF error:', error);
        throw error;
    }
}

// Get clean text for voice
export async function getTextForVoice(text) {
    try {
        const token = localStorage.getItem('token');
        
        const response = await fetch(`${API_URL}/pdf/voice-text`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ text })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Failed to process text');
        }
        
        return data;
    } catch (error) {
        console.error('Get text for voice error:', error);
        return { success: false, text: text };
    }
}