// frontend/src/pages/RoadmapPage.js
// Main Roadmap Generator Page

import { Sidebar } from '../components/layout/Sidebar.js';
import { AIChatSidebar } from '../components/layout/AIChatSidebar.js';
import { Header } from '../components/common/Header.js';
import { RoadmapInput, setupRoadmapInput } from '../components/roadmap/RoadmapInput.js';
import { RoadmapViewer, setupRoadmapViewer } from '../components/roadmap/RoadmapViewer.js';
import { generateRoadmap, saveRoadmap } from '../services/roadmapService.js';
import { showError, showSuccess } from '../components/common/ErrorMessage.js';
import { downloadImage, copyToClipboard } from '../utils/roadmapHelpers.js';

let currentRoadmapId = null;
let currentImageUrl = null;
let currentTopic = null;

export async function RoadmapPage() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    if (!isAuthenticated) {
        window.location.hash = '#/login';
        return '';
    }
    
    return `
        <div class="min-h-screen bg-gradient-to-b from-[#111827] to-[#0F172A] relative">
            ${Sidebar()}
            ${AIChatSidebar()}
            <div id="mainContent" class="min-h-screen transition-all duration-300" 
                 style="margin-left: 256px; margin-right: 384px; width: calc(100% - 640px);">
                ${Header({ title: 'AI Roadmap Generator' })}
                <main class="container mx-auto px-4 py-8">
                    <div class="max-w-6xl mx-auto">
                        <!-- Header Section -->
                        <div class="mb-8">
                            <div class="flex items-center gap-3 mb-2">
                                <div class="w-12 h-12 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-2xl flex items-center justify-center shadow-lg">
                                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                                    </svg>
                                </div>
                                <h1 class="text-3xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">
                                    AI Roadmap Generator
                                </h1>
                            </div>
                            <p class="text-[#9CA3AF] ml-16">Generate personalized learning paths with AI</p>
                            <div class="w-24 h-1 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full mt-4 ml-16"></div>
                        </div>
                        
                        <!-- Input Section -->
                        <div id="roadmapInputContainer" class="mb-8"></div>
                        
                        <!-- Generated Roadmap Section -->
                        <div id="roadmapViewerContainer" style="display: none;"></div>
                        
                        <!-- Loading State -->
                        <div id="loadingState" class="text-center py-16" style="display: none;">
                            <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#3B82F6] border-t-transparent mb-4"></div>
                            <p class="text-[#9CA3AF]">Generating your roadmap with AI...</p>
                            <p class="text-sm text-[#6B7280] mt-2">This may take a few seconds</p>
                        </div>
                        
                        <!-- My Roadmaps Link -->
                        <div class="mt-8 text-center">
                            <a href="#/my-roadmaps" class="inline-flex items-center gap-2 text-[#9CA3AF] hover:text-[#3B82F6] transition-colors">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                                </svg>
                                View My Saved Roadmaps
                            </a>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    `;
}

export async function setupRoadmapPage() {
    // Setup input component
    const inputContainer = document.getElementById('roadmapInputContainer');
    if (inputContainer) {
        inputContainer.innerHTML = RoadmapInput({ onGenerate: null, isLoading: false });
        setupRoadmapInput(async (topic, difficulty, depth) => {
            await handleGenerate(topic, difficulty, depth);
        });
    }
}

async function handleGenerate(topic, difficulty, depth) {
    const loadingDiv = document.getElementById('loadingState');
    const viewerDiv = document.getElementById('roadmapViewerContainer');
    const inputDiv = document.getElementById('roadmapInputContainer');
    
    loadingDiv.style.display = 'block';
    viewerDiv.style.display = 'none';
    
    try {
        const result = await generateRoadmap(topic, difficulty, depth);
        
        if (result.success) {
    currentRoadmapId = result.roadmapId;
    
    // Use htmlContent from response
    const htmlContent = result.htmlContent || result.roadmap?.roadmap_html;
    
    viewerDiv.innerHTML = RoadmapViewer({
        htmlContent: htmlContent,
        roadmapId: result.roadmapId,
        topic: topic,
        onSave: () => handleSaveRoadmap(result.roadmapId),
        onShare: () => handleShareRoadmap(result.roadmapId),
        onDownload: () => handleDownloadRoadmapHTML(htmlContent, topic)
    });
    
    viewerDiv.style.display = 'block';
    showSuccess(`Roadmap for "${topic}" generated successfully!`, 'success');
}
        
    } catch (error) {
        console.error('Generation error:', error);
        showError(error.message || 'Failed to generate roadmap', 'error');
    } finally {
        loadingDiv.style.display = 'none';
    }
}

async function handleSaveRoadmap(roadmapId) {
    try {
        const result = await saveRoadmap(roadmapId);
        if (result.success) {
            showSuccess('Roadmap saved to your collection!', 'success');
        }
    } catch (error) {
        showError('Failed to save roadmap', 'error');
    }
}

async function handleShareRoadmap(roadmapId) {
    const url = `${window.location.origin}/#/roadmap/${roadmapId}`;
    const success = await copyToClipboard(url);
    if (success) {
        showSuccess('Link copied to clipboard!', 'success');
    } else {
        showError('Failed to copy link', 'error');
    }
}

function handleDownloadRoadmap(imageUrl, topic) {
    const filename = `${topic.replace(/\s/g, '_')}_roadmap.png`;
    downloadImage(imageUrl, filename);
    showSuccess('Download started!', 'success');
}

// Add these inside setupRoadmapPage function or at the end of RoadmapPage.js

window.handleSaveRoadmap = async (roadmapId) => {
    try {
        const { saveRoadmap } = await import('../services/roadmapService.js');
        const result = await saveRoadmap(roadmapId);
        if (result.success) {
            showSuccess('Roadmap saved to your collection!', 'success');
        }
    } catch (error) {
        showError('Failed to save roadmap', 'error');
    }
};

window.handleShareRoadmap = async (roadmapId) => {
    const url = `${window.location.origin}/#/roadmap/${roadmapId}`;
    try {
        await navigator.clipboard.writeText(url);
        showSuccess('Link copied to clipboard!', 'success');
    } catch (error) {
        showError('Failed to copy link', 'error');
    }
};

// Add this to RoadmapPage.js

window.handleDownloadRoadmap = (htmlContent, topic) => {
    try {
        // Parse the escaped HTML content
        let content = htmlContent;
        if (typeof htmlContent === 'string' && htmlContent.startsWith('"')) {
            content = JSON.parse(htmlContent);
        }
        const blob = new Blob([content], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${topic.replace(/\s/g, '_')}_roadmap.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showSuccess('Download started!', 'success');
    } catch (error) {
        console.error('Download error:', error);
        showError('Failed to download roadmap', 'error');
    }
};