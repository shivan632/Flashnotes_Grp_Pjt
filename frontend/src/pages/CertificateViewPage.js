// frontend/src/components/certificate/CertificateViewer.js
export function CertificateViewer({ certificate, userName, onClose }) {
    const API_URL = window.API_URL || 'http://localhost:10000/api';
    const token = localStorage.getItem('token');
    
    // Directly fetch HTML from backend and open in new window
    fetch(API_URL + '/certificates/' + certificate.id + '/html', {
        headers: { 'Authorization': 'Bearer ' + token }
    })
    .then(response => response.text())
    .then(html => {
        const newWindow = window.open();
        if (newWindow) {
            newWindow.document.write(html);
            newWindow.document.close();
        } else {
            alert('Please allow popups to view certificate');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to load certificate');
    });
    
    // Return empty div (no modal)
    return '<div style="display: none;"></div>';
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}