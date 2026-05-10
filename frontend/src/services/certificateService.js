// frontend/src/services/certificateService.js
const API_BASE_URL = window.API_URL || 'http://localhost:10000/api';

export async function getUserCertificates() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/certificates`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Get certificates error:', error);
        return { success: false, certificates: [] };
    }
}

export async function getCertificateById(id) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/certificates/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Get certificate error:', error);
        return { success: false, certificate: null };
    }
}

export async function checkNewCertificates() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/certificates/check-new`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Check certificates error:', error);
        return { success: false, newCertificates: [] };
    }
}