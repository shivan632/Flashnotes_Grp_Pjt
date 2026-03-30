// frontend/src/pages/RoadmapDetailPage.js
// View single roadmap with details and progress tracking

import { Sidebar } from '../components/layout/Sidebar.js';
import { AIChatSidebar } from '../components/layout/AIChatSidebar.js';
import { Header } from '../components/common/Header.js';
import { RoadmapViewer, setupRoadmapViewer } from '../components/roadmap/RoadmapViewer.js';
import { ProgressTracker, setupProgressTracker } from '../components/roadmap/ProgressTracker.js';
import { getRoadmapById, updateProgress, saveRoadmap } from '../services/roadmapService.js';
import { showError, showSuccess } from '../components/common/ErrorMessage.js';
import { 
    downloadImage, 
    copyToClipboard, 
    getDifficultyClass, 
    getDifficultyIcon, 
    getDifficultyText, 
    formatRoadmapDate 
} from '../utils/roadmapHelpers.js';

let currentRoadmap = null;
let currentRoadmapId = null;

export async function RoadmapDetailPage() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    if (!isAuthenticated) {
        window.location.hash = '#/login';
        return '';
    }
    
    // Get roadmap ID from URL
    const hash = window.location.hash;
    const match = hash.match(/\/roadmap\/(\d+)/);
    const roadmapId = match ? match[1] : null;
    
    if (!roadmapId) {
        window.location.hash = '#/my-roadmaps';
        return '';
    }
    
    currentRoadmapId = roadmapId;
    
    return `
        <div class="min-h-screen bg-gradient-to-b from-[#111827] to-[#0F172A] relative">
            ${Sidebar()}
            ${AIChatSidebar()}
            <div id="mainContent" class="min-h-screen transition-all duration-300" 
                 style="margin-left: 256px; margin-right: 384px; width: calc(100% - 640px);">
                ${Header({ title: 'Roadmap Details' })}
                <main class="container mx-auto px-4 py-8">
                    <div class="max-w-6xl mx-auto">
                        <!-- Loading State -->
                        <div id="loadingState" class="text-center py-16">
                            <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#3B82F6] border-t-transparent mb-4"></div>
                            <p class="text-[#9CA3AF]">Loading roadmap...</p>
                        </div>
                        
                        <!-- Content Container -->
                        <div id="roadmapContent" style="display: none;"></div>
                    </div>
                </main>
            </div>
        </div>
    `;
}

export async function setupRoadmapDetailPage(roadmapId) {
    const loadingDiv = document.getElementById('loadingState');
    const contentDiv = document.getElementById('roadmapContent');
    
    loadingDiv.style.display = 'block';
    contentDiv.style.display = 'none';
    
    try {
        const result = await getRoadmapById(roadmapId);
        
        if (!result.success || !result.roadmap) {
            throw new Error('Roadmap not found');
        }
        
        currentRoadmap = result.roadmap;
        currentRoadmapId = roadmapId;
        
        // Render the page content
        contentDiv.innerHTML = renderRoadmapDetail(currentRoadmap);
        contentDiv.style.display = 'block';
        loadingDiv.style.display = 'none';
        
        // Setup event listeners after DOM is ready
        setTimeout(() => {
            setupPageEvents(currentRoadmap);
        }, 100);
        
    } catch (error) {
        console.error('Error loading roadmap:', error);
        loadingDiv.style.display = 'none';
        contentDiv.innerHTML = `
            <div class="text-center py-16 bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl border border-[#374151]">
                <svg class="w-20 h-20 mx-auto mb-4 text-red-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
                <p class="text-red-400 text-lg mb-2">Failed to load roadmap</p>
                <p class="text-sm text-[#9CA3AF] mb-4">${error.message}</p>
                <a href="#/my-roadmaps" class="inline-block px-6 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors">
                    Back to My Roadmaps
                </a>
            </div>
        `;
        contentDiv.style.display = 'block';
    }
}

function renderRoadmapDetail(roadmap) {
    const difficultyClass = getDifficultyClass(roadmap.difficulty);
    const difficultyIcon = getDifficultyIcon(roadmap.difficulty);
    const difficultyText = getDifficultyText(roadmap.difficulty);
    const formattedDate = formatRoadmapDate(roadmap.created_at);
    const isSaved = roadmap.is_saved || false;
    const progress = roadmap.user_progress || null;
    const totalNodes = roadmap.roadmap_data?.nodes?.length || 0;
    const percentage = progress?.percentage_complete || 0;
    
    // Generate HTML content from roadmap_data if image_url not available
    let htmlContent = null;
    if (roadmap.roadmap_data) {
        const mermaidCode = generateMermaidCodeFromData(roadmap.roadmap_data);
        htmlContent = generateSimpleMermaidHTML(mermaidCode, roadmap.topic, roadmap.difficulty, roadmap.depth_level);
    }
    
    return `
        <!-- Back Button -->
        <div class="mb-4">
            <a href="#/my-roadmaps" class="inline-flex items-center gap-2 text-[#9CA3AF] hover:text-[#3B82F6] transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 17l-5-5m0 0l5-5m-5 5h12"></path>
                </svg>
                Back to My Roadmaps
            </a>
        </div>
        
        <!-- Header Info -->
        <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-6 mb-6 border border-[#374151] shadow-xl">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                        <div class="w-12 h-12 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-2xl flex items-center justify-center shadow-lg">
                            <span class="text-2xl">${difficultyIcon}</span>
                        </div>
                        <div>
                            <h1 class="text-2xl font-bold text-white">${escapeHtml(roadmap.topic)}</h1>
                            <p class="text-sm text-[#9CA3AF]">${escapeHtml(roadmap.title || `Complete ${roadmap.topic} Roadmap`)}</p>
                        </div>
                    </div>
                    <p class="text-[#9CA3AF] mt-2 ml-16">${escapeHtml(roadmap.description || `A ${difficultyText} level roadmap to master ${roadmap.topic}`)}</p>
                </div>
                
                <div class="flex flex-col items-end gap-2">
                    <div class="flex gap-2">
                        <span class="px-3 py-1 rounded-full text-xs font-medium ${difficultyClass} flex items-center gap-1">
                            <span>${difficultyIcon}</span>
                            <span>${difficultyText}</span>
                        </span>
                        <span class="px-3 py-1 bg-[#374151] rounded-full text-xs text-[#9CA3AF]">
                            📏 Depth ${roadmap.depth_level || 3}
                        </span>
                    </div>
                    <div class="text-right text-xs text-[#6B7280]">
                        <div>📅 Created: ${formattedDate}</div>
                        ${roadmap.view_count ? `<div>👁️ ${roadmap.view_count} views</div>` : ''}
                    </div>
                </div>
            </div>
            
            <!-- Progress Bar -->
            <div class="mt-4 pt-4 border-t border-[#374151]">
                <div class="flex justify-between text-sm mb-2">
                    <span class="text-[#9CA3AF]">Overall Progress</span>
                    <span class="text-[#3B82F6] font-semibold">${Math.round(percentage)}%</span>
                </div>
                <div class="w-full bg-[#374151] rounded-full h-2">
                    <div class="bg-gradient-to-r from-[#3B82F6] to-[#10B981] h-2 rounded-full transition-all duration-500" style="width: ${percentage}%"></div>
                </div>
                <div class="flex justify-between text-xs text-[#6B7280] mt-2">
                    <span>${progress?.completed_nodes || 0}/${totalNodes} topics completed</span>
                    <span>${percentage === 100 ? '🎉 Completed!' : 'Keep going!'}</span>
                </div>
            </div>
        </div>
        
        <!-- Main Content: 2 Columns -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Left: Roadmap Viewer -->
            <div class="lg:col-span-2">
                ${RoadmapViewer({
                    htmlContent: htmlContent,
                    roadmapId: roadmap.id,
                    topic: roadmap.topic,
                    onSave: () => handleSaveRoadmap(roadmap.id),
                    onShare: () => handleShareRoadmap(roadmap.id),
                    onDownload: () => handleDownloadRoadmapHTML(htmlContent, roadmap.topic)
                })}
            </div>
            
            <!-- Right: Sidebar -->
            <div class="space-y-6">
                <!-- Progress Tracker -->
                ${ProgressTracker({
                    progress: progress,
                    totalNodes: totalNodes,
                    onUpdate: (newCompleted) => handleUpdateProgress(roadmap.id, newCompleted)
                })}
                
                <!-- Topics List -->
                <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-5 border border-[#374151]">
                    <div class="flex items-center gap-2 mb-4">
                        <div class="w-8 h-8 bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] rounded-lg flex items-center justify-center">
                            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                            </svg>
                        </div>
                        <h4 class="text-md font-semibold text-white">Topics in this Roadmap</h4>
                    </div>
                    
                    <div class="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
                        ${renderTopicsList(roadmap.roadmap_data?.nodes || [], progress?.completed_nodes || 0)}
                    </div>
                </div>
                
                <!-- Actions -->
                <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-5 border border-[#374151]">
                    <div class="flex items-center gap-2 mb-4">
                        <div class="w-8 h-8 bg-gradient-to-r from-[#F59E0B] to-[#EF4444] rounded-lg flex items-center justify-center">
                            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0L8 8m4-4v12"></path>
                            </svg>
                        </div>
                        <h4 class="text-md font-semibold text-white">Actions</h4>
                    </div>
                    
                    <div class="space-y-2">
                        <button id="downloadRoadmapBtn" class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#111827] hover:bg-[#1F2937] text-[#9CA3AF] hover:text-white rounded-xl transition-all">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                            </svg>
                            Download HTML
                        </button>
                        <button id="shareRoadmapBtn" class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#111827] hover:bg-[#1F2937] text-[#9CA3AF] hover:text-white rounded-xl transition-all">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                            </svg>
                            Share Link
                        </button>
                        ${!isSaved ? `
                            <button id="saveToCollectionBtn" class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#111827] hover:bg-[#1F2937] text-[#9CA3AF] hover:text-white rounded-xl transition-all">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                                </svg>
                                Save to Collection
                            </button>
                        ` : `
                            <div class="text-center text-green-500 text-sm py-2">
                                ✅ Saved to your collection
                            </div>
                        `}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderTopicsList(nodes, completedCount) {
    if (!nodes || nodes.length === 0) {
        return '<div class="text-center text-[#9CA3AF] py-4">No topics available</div>';
    }
    
    const sortedNodes = [...nodes].sort((a, b) => {
        if (a.level !== b.level) return a.level - b.level;
        return a.id.localeCompare(b.id);
    });
    
    return sortedNodes.map(node => {
        const indent = node.level * 16;
        const isCompleted = false; // You can add completion tracking per node if needed
        
        return `
            <div class="flex items-center gap-2 p-2 rounded-lg hover:bg-[#111827] transition-colors" style="margin-left: ${indent}px;">
                <div class="w-6 h-6 rounded-full flex items-center justify-center ${isCompleted ? 'bg-green-500' : 'bg-[#374151]'}">
                    ${isCompleted ? 
                        '<svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>' :
                        `<span class="text-xs text-[#9CA3AF]">${node.level + 1}</span>`
                    }
                </div>
                <span class="text-sm text-[#E5E7EB] flex-1">${escapeHtml(node.name)}</span>
                ${node.estimated_time ? `<span class="text-xs text-[#6B7280]">⏱️ ${node.estimated_time}</span>` : ''}
            </div>
        `;
    }).join('');
}

// Helper function to generate mermaid code from roadmap data
function generateMermaidCodeFromData(roadmapData) {
    const { nodes, edges } = roadmapData;
    
    let mermaid = `graph TD\n`;
    mermaid += `    %% Styles\n`;
    mermaid += `    classDef root fill:#3B82F6,stroke:#60A5FA,stroke-width:2px,color:#fff,rx:10,ry:10\n`;
    mermaid += `    classDef level1 fill:#1F2937,stroke:#3B82F6,stroke-width:2px,color:#E5E7EB,rx:8,ry:8\n`;
    mermaid += `    classDef level2 fill:#111827,stroke:#60A5FA,stroke-width:1px,color:#9CA3AF,rx:6,ry:6\n\n`;
    
    nodes.forEach(node => {
        const nodeId = node.id.replace(/[.-]/g, '_');
        const nodeLabel = node.name.replace(/[^a-zA-Z0-9 ]/g, '').substring(0, 50);
        const icon = getIconForNode(node.name);
        
        mermaid += `    ${nodeId}["${icon} ${nodeLabel}"]\n`;
        
        if (node.level === 0) {
            mermaid += `    class ${nodeId} root\n`;
        } else if (node.level === 1) {
            mermaid += `    class ${nodeId} level1\n`;
        } else {
            mermaid += `    class ${nodeId} level2\n`;
        }
    });
    
    mermaid += `\n`;
    
    edges.forEach(edge => {
        const fromId = edge.from.replace(/[.-]/g, '_');
        const toId = edge.to.replace(/[.-]/g, '_');
        mermaid += `    ${fromId} --> ${toId}\n`;
    });
    
    return mermaid;
}

function getIconForNode(name) {
    const nameLower = name.toLowerCase();
    if (nameLower.includes('intro') || nameLower.includes('introduction')) return '📖';
    if (nameLower.includes('basic') || nameLower.includes('fundamental')) return '📘';
    if (nameLower.includes('advanced')) return '🚀';
    if (nameLower.includes('practice') || nameLower.includes('project')) return '💻';
    if (nameLower.includes('tool') || nameLower.includes('framework')) return '🛠️';
    if (nameLower.includes('concept')) return '🧠';
    if (nameLower.includes('data')) return '📊';
    if (nameLower.includes('function')) return '⚡';
    if (nameLower.includes('array') || nameLower.includes('list')) return '📋';
    if (nameLower.includes('object')) return '🎯';
    if (nameLower.includes('class') || nameLower.includes('oop')) return '🏗️';
    return '📌';
}

// Helper function to generate simple HTML with mermaid
function generateSimpleMermaidHTML(mermaidCode, topic, difficulty, depth) {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${topic} Roadmap</title>
    <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
    <style>
        body { background: #0F172A; font-family: 'Segoe UI', sans-serif; padding: 20px; margin: 0; }
        .container { max-width: 1200px; margin: 0 auto; background: #1F2937; border-radius: 16px; padding: 24px; }
        h1 { color: #F9FAFB; text-align: center; margin-bottom: 8px; font-size: 28px; }
        .subtitle { text-align: center; color: #9CA3AF; margin-bottom: 32px; }
        .mermaid { background: #111827; padding: 20px; border-radius: 12px; overflow-x: auto; text-align: center; }
        .footer { text-align: center; color: #6B7280; font-size: 12px; margin-top: 24px; padding-top: 16px; border-top: 1px solid #374151; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🗺️ ${topic} Roadmap</h1>
        <div class="subtitle">A ${difficulty} level roadmap to master ${topic}</div>
        <div class="mermaid">
${mermaidCode}
        </div>
        <div class="footer">Generated by Flashnotes AI Roadmap Generator</div>
    </div>
    <script>
        mermaid.initialize({ 
            startOnLoad: true, 
            theme: 'dark',
            themeVariables: {
                background: '#111827',
                primaryColor: '#3B82F6',
                primaryBorderColor: '#60A5FA',
                primaryTextColor: '#F9FAFB',
                lineColor: '#3B82F6',
                secondaryColor: '#1F2937',
                tertiaryColor: '#374151'
            }
        });
    </script>
</body>
</html>`;
}

async function handleSaveRoadmap(roadmapId) {
    try {
        const result = await saveRoadmap(roadmapId);
        if (result.success) {
            showSuccess('Roadmap saved to your collection!', 'success');
            setTimeout(() => {
                window.location.reload();
            }, 1500);
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

function handleDownloadRoadmapHTML(htmlContent, topic) {
    if (!htmlContent) {
        showError('No content to download', 'error');
        return;
    }
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${topic.replace(/\s/g, '_')}_roadmap.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showSuccess('Download started!', 'success');
}

async function handleUpdateProgress(roadmapId, completedNodes) {
    try {
        const result = await updateProgress(roadmapId, completedNodes);
        if (result.success) {
            showSuccess('Progress updated!', 'success');
            setTimeout(() => {
                window.location.reload();
            }, 500);
        }
    } catch (error) {
        console.error('Update progress error:', error);
        showError('Failed to update progress', 'error');
    }
}

function setupPageEvents(roadmap) {
    // Setup viewer events
    setupRoadmapViewer({
        onSave: () => handleSaveRoadmap(roadmap.id),
        onShare: () => handleShareRoadmap(roadmap.id),
        onDownload: () => handleDownloadRoadmapHTML(
            generateSimpleMermaidHTML(
                generateMermaidCodeFromData(roadmap.roadmap_data), 
                roadmap.topic, 
                roadmap.difficulty, 
                roadmap.depth_level
            ), 
            roadmap.topic
        )
    });
    
    // Setup progress tracker
    const totalNodes = roadmap.roadmap_data?.nodes?.length || 0;
    const currentProgress = roadmap.user_progress?.completed_nodes || 0;
    
    setupProgressTracker({
        onUpdate: (newCompleted) => handleUpdateProgress(roadmap.id, newCompleted),
        currentProgress: { completed_nodes: currentProgress },
        totalNodes: totalNodes
    });
    
    // Setup action buttons
    const downloadBtn = document.getElementById('downloadRoadmapBtn');
    const shareBtn = document.getElementById('shareRoadmapBtn');
    const saveBtn = document.getElementById('saveToCollectionBtn');
    
    if (downloadBtn && roadmap.roadmap_data) {
        const htmlContent = generateSimpleMermaidHTML(
            generateMermaidCodeFromData(roadmap.roadmap_data), 
            roadmap.topic, 
            roadmap.difficulty, 
            roadmap.depth_level
        );
        downloadBtn.addEventListener('click', () => handleDownloadRoadmapHTML(htmlContent, roadmap.topic));
    }
    if (shareBtn) {
        shareBtn.addEventListener('click', () => handleShareRoadmap(roadmap.id));
    }
    if (saveBtn) {
        saveBtn.addEventListener('click', () => handleSaveRoadmap(roadmap.id));
    }
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}