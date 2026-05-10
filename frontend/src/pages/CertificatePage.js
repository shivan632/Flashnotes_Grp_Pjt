// frontend/src/pages/CertificatePage.js
import { Sidebar } from '../components/layout/Sidebar.js';
import { AIChatSidebar } from '../components/layout/AIChatSidebar.js';
import { Header } from '../components/common/Header.js';
import { CertificateCard } from '../components/certificate/CertificateCard.js';
import { CertificateViewer } from '../components/certificate/CertificateViewer.js';
import { getUserCertificates } from '../services/certificateService.js';

export async function CertificatePage() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) {
        window.location.hash = '#/login';
        return '';
    }
    
    let certificates = [];
    
    try {
        const result = await getUserCertificates();
        if (result.success) {
            certificates = result.certificates || [];
        }
    } catch (error) {
        console.error('Failed to load certificates:', error);
    }
    
    return `
        <div class="min-h-screen bg-gradient-to-b from-[#0F172A] via-[#111827] to-[#0F172A] relative">
            ${Sidebar()}
            ${AIChatSidebar()}
            <div id="mainContent" class="min-h-screen transition-all duration-300" style="margin-left: 256px; margin-right: 384px; width: calc(100% - 640px);">
                ${Header({ title: 'My Certificates' })}
                <main class="container mx-auto px-4 py-8">
                    <div class="max-w-4xl mx-auto">
                        <div class="mb-8">
                            <div class="flex items-center gap-3 mb-2">
                                <div class="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                                    <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h1 class="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">My Certificates</h1>
                                    <p class="text-[#9CA3AF] mt-1">Your earned achievements and certificates</p>
                                </div>
                            </div>
                            <div class="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-4"></div>
                        </div>
                        
                        <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-6 border border-[#374151] mb-6">
                            <div class="flex items-center justify-between">
                                <div>
                                    <div class="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">${certificates.length}</div>
                                    <div class="text-sm text-gray-400 mt-1">Certificates Earned</div>
                                </div>
                                <div class="flex gap-2">
                                    <div class="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center"><span class="text-lg">🎯</span></div>
                                    <div class="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center"><span class="text-lg">⭐</span></div>
                                    <div class="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center"><span class="text-lg">🏆</span></div>
                                </div>
                            </div>
                        </div>
                        
                        <div id="certificatesGrid" class="grid grid-cols-1 md:grid-cols-2 gap-5">
                            ${certificates.length === 0 ? `
                                <div class="col-span-2 text-center py-12">
                                    <div class="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg class="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                                        </svg>
                                    </div>
                                    <p class="text-gray-400">No certificates yet</p>
                                    <p class="text-gray-500 text-sm mt-1">Complete quizzes to earn certificates!</p>
                                    <a href="#/quiz" class="inline-block mt-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2.5 rounded-xl hover:opacity-90 transition-all duration-300 transform hover:scale-105">Start Learning</a>
                                </div>
                            ` : certificates.map(cert => CertificateCard({ certificate: cert })).join('')}
                        </div>
                    </div>
                </main>
            </div>
        </div>
        
        <div id="certificateModalContainer"></div>
        
        <style>
            @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-fadeInUp { animation: fadeInUp 0.5s ease-out forwards; opacity: 0; }
        </style>
        
        <script>
            (function() {
                const API_URL = window.API_URL || 'http://localhost:10000/api';
                const token = localStorage.getItem('token');
                
                function handleViewCertificate(certificateId) {
                    fetch(API_URL + '/certificates/' + certificateId + '/html', {
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
                }
                
                function handleDownloadCertificate(certificateId) {
                    fetch(API_URL + '/certificates/' + certificateId + '/html', {
                        headers: { 'Authorization': 'Bearer ' + token }
                    })
                    .then(response => response.text())
                    .then(html => {
                        const blob = new Blob([html], { type: 'text/html' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'certificate_' + certificateId + '.html';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert('Failed to download certificate');
                    });
                }
                
                function attachEvents() {
                    document.querySelectorAll('.view-cert-btn').forEach(function(btn) {
                        btn.addEventListener('click', function(e) {
                            var id = e.currentTarget.dataset.id;
                            if (id) handleViewCertificate(id);
                        });
                    });
                    document.querySelectorAll('.download-cert-btn').forEach(function(btn) {
                        btn.addEventListener('click', function(e) {
                            var id = e.currentTarget.dataset.id;
                            if (id) handleDownloadCertificate(id);
                        });
                    });
                }
                
                attachEvents();
            })();
        </script>
    `;
}

export function setupCertificatePage() {
    console.log('Certificate page initialized');
}