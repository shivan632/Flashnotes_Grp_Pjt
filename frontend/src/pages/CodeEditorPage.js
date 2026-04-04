// frontend/src/pages/CodeEditorPage.js
import { Sidebar } from '../components/layout/Sidebar.js';
import { AIChatSidebar } from '../components/layout/AIChatSidebar.js';
import { Header } from '../components/common/Header.js';

export async function CodeEditorPage() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    if (!isAuthenticated) {
        window.location.hash = '#/login';
        return '';
    }
    
    return `
        <div class="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#111827] to-[#0F172A] relative overflow-x-hidden">
            <!-- Animated Background Orbs -->
            <div class="absolute inset-0 overflow-hidden pointer-events-none">
                <div class="absolute -top-40 -right-40 w-96 h-96 bg-[#3B82F6] rounded-full filter blur-3xl opacity-20 animate-pulse-slow"></div>
                <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-[#A78BFA] rounded-full filter blur-3xl opacity-20 animate-pulse-slow" style="animation-delay: 2s"></div>
                <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full filter blur-3xl opacity-5 animate-spin-slow"></div>
            </div>
            
            ${Sidebar()}
            ${AIChatSidebar()}
            
            <div id="mainContent" class="min-h-screen transition-all duration-300 relative z-10" 
                 style="margin-left: 256px; margin-right: 384px; width: calc(100% - 640px);">
                ${Header({ title: 'Code Editor' })}
                
                <main class="container mx-auto px-4 py-8">
                    <div class="max-w-5xl mx-auto">
                        <!-- Hero Section with Enhanced Animation -->
                        <div class="mb-8 text-center md:text-left animate-fadeInUp">
                            <div class="relative inline-block">
                                <div class="absolute inset-0 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-2xl blur-xl opacity-40"></div>
                                <div class="relative flex items-center gap-3 mb-2">
                                    <div class="relative group">
                                        <div class="absolute inset-0 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-2xl blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                                        <div class="relative w-14 h-14 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-300">
                                            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                                            </svg>
                                        </div>
                                    </div>
                                    <div>
                                        <h1 class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#3B82F6] via-[#60A5FA] to-[#A78BFA] bg-clip-text text-transparent animate-gradient">
                                            Code Editor
                                        </h1>
                                        <p class="text-[#9CA3AF] mt-1">Write, save, and execute code online with AI assistance</p>
                                    </div>
                                </div>
                            </div>
                            <div class="w-24 h-1 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full mx-auto md:mx-0 mt-4"></div>
                        </div>
                        
                        <!-- Main Editor Card with Enhanced Border -->
                        <div class="relative group/card animate-fadeInUp" style="animation-delay: 0.1s">
                            <div class="absolute -inset-0.5 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-2xl blur-xl opacity-0 group-hover/card:opacity-30 transition-opacity duration-500"></div>
                            
                            <div class="relative bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl overflow-hidden border border-[#374151] shadow-xl transition-all duration-300 group-hover/card:shadow-2xl group-hover/card:shadow-[#3B82F6]/10">
                                <!-- Toolbar with Gradient -->
                                <div class="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-[#1F2937] to-[#111827] border-b border-[#374151] relative">
                                    <div class="absolute inset-0 bg-gradient-to-r from-[#3B82F6]/5 to-[#A78BFA]/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>
                                    
                                    <div class="flex items-center gap-3 relative z-10">
                                        <div class="relative group/icon">
                                            <div class="absolute inset-0 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-xl blur-md opacity-0 group-hover/icon:opacity-60 transition-all duration-300"></div>
                                            <div class="relative w-10 h-10 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-xl flex items-center justify-center shadow-lg transform group-hover/icon:scale-110 transition-all duration-300">
                                                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                                                </svg>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 class="text-base font-semibold bg-gradient-to-r from-white to-[#9CA3AF] bg-clip-text text-transparent">Code Editor</h3>
                                            <p class="text-xs text-[#6B7280]">Write and execute code online</p>
                                        </div>
                                    </div>
                                    
                                    <div class="flex items-center gap-2 relative z-10">
                                        <!-- Save Button with Gradient -->
                                        <button id="saveCodeButton" class="group/btn relative overflow-hidden px-3 py-2 bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#34D399] hover:to-[#10B981] text-white text-sm rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-1 shadow-lg">
                                            <div class="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                                            <svg class="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                                            </svg>
                                            <span class="relative z-10">Save</span>
                                        </button>
                                        
                                        <!-- Load Button with Gradient -->
                                        <button id="loadCodeButton" class="group/btn relative overflow-hidden px-3 py-2 bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:from-[#FBBF24] hover:to-[#F59E0B] text-white text-sm rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-1 shadow-lg">
                                            <div class="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                                            <svg class="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                                            </svg>
                                            <span class="relative z-10">Load</span>
                                        </button>
                                        
                                        <!-- Language Selector with Gradient Focus -->
                                        <div class="relative">
                                            <select id="codeLanguage" class="appearance-none px-3 py-2 pr-8 bg-[#111827] text-white text-sm rounded-xl border border-[#374151] focus:border-[#3B82F6] focus:outline-none transition-all duration-300 cursor-pointer hover:bg-[#1F2937] hover:border-[#3B82F6]">
                                                <option value="python">🐍 Python</option>
                                                <option value="javascript">📜 JavaScript</option>
                                                <option value="cpp">⚙️ C++</option>
                                                <option value="java">☕ Java</option>
                                            </select>
                                            <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                                <svg class="w-4 h-4 text-[#6B7280] transition-colors group-hover:text-[#3B82F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                                </svg>
                                            </div>
                                        </div>
                                        
                                        <!-- Run Button with Gradient -->
                                        <button id="runCodeButton" class="group/btn relative overflow-hidden px-4 py-2 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] hover:from-[#60A5FA] hover:to-[#8B5CF6] text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg">
                                            <div class="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                                            <span class="relative z-10 flex items-center gap-2">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                </svg>
                                                Run Code
                                            </span>
                                        </button>
                                    </div>
                                </div>
                                
                                <!-- Editor Area with Line Numbers -->
                                <div class="relative">
                                    <div class="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#0F172A] to-transparent border-r border-[#1F2937] pointer-events-none z-10"></div>
                                    <textarea id="codeEditor" 
                                        class="w-full bg-[#0F172A] text-[#E5E7EB] font-mono text-sm pl-16 pr-5 py-5 focus:outline-none resize-none transition-all duration-300"
                                        style="height: 400px; font-family: 'Consolas', 'Monaco', 'Courier New', monospace; line-height: 1.6;"
                                        spellcheck="false">print("Hello, Flashnotes!")</textarea>
                                </div>
                                
                                <!-- Output Panel with Gradient Header -->
                                <div class="border-t border-[#374151]">
                                    <div class="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-[#1F2937] to-[#111827] border-b border-[#374151]">
                                        <div class="flex items-center gap-2">
                                            <div class="w-2 h-2 bg-[#10B981] rounded-full animate-pulse"></div>
                                            <span class="text-sm font-medium text-white">Output</span>
                                        </div>
                                        <button id="clearOutputButton" class="text-xs text-[#6B7280] hover:text-[#3B82F6] transition-all duration-200 flex items-center gap-1 hover:scale-105">
                                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                            </svg>
                                            Clear
                                        </button>
                                    </div>
                                    <div id="outputPanel" class="p-5 bg-[#111827] font-mono text-sm text-[#E5E7EB] min-h-[150px] max-h-[250px] overflow-auto whitespace-pre-wrap custom-scrollbar">
                                        <span class="text-[#6B7280]">✨ Click "Run Code" to see output...</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Stats Cards with Gradient -->
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 animate-fadeInUp" style="animation-delay: 0.2s">
                            <div class="group/stats relative overflow-hidden bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-xl p-4 border border-[#374151] hover:border-[#3B82F6] transition-all duration-300 hover:-translate-y-1">
                                <div class="absolute inset-0 bg-gradient-to-r from-[#3B82F6]/10 to-[#A78BFA]/10 opacity-0 group-hover/stats:opacity-100 transition-opacity duration-500"></div>
                                <div class="flex items-center gap-3 relative z-10">
                                    <div class="w-10 h-10 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] rounded-lg flex items-center justify-center group-hover/stats:scale-110 transition-transform duration-300">
                                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <div class="text-2xl font-bold text-white">10+</div>
                                        <div class="text-xs text-[#6B7280]">Languages Supported</div>
                                    </div>
                                </div>
                            </div>
                            <div class="group/stats relative overflow-hidden bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-xl p-4 border border-[#374151] hover:border-[#3B82F6] transition-all duration-300 hover:-translate-y-1">
                                <div class="absolute inset-0 bg-gradient-to-r from-[#10B981]/10 to-[#34D399]/10 opacity-0 group-hover/stats:opacity-100 transition-opacity duration-500"></div>
                                <div class="flex items-center gap-3 relative z-10">
                                    <div class="w-10 h-10 bg-gradient-to-r from-[#10B981] to-[#34D399] rounded-lg flex items-center justify-center group-hover/stats:scale-110 transition-transform duration-300">
                                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <div class="text-2xl font-bold text-white">Instant</div>
                                        <div class="text-xs text-[#6B7280]">Code Execution</div>
                                    </div>
                                </div>
                            </div>
                            <div class="group/stats relative overflow-hidden bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-xl p-4 border border-[#374151] hover:border-[#3B82F6] transition-all duration-300 hover:-translate-y-1">
                                <div class="absolute inset-0 bg-gradient-to-r from-[#A78BFA]/10 to-[#C084FC]/10 opacity-0 group-hover/stats:opacity-100 transition-opacity duration-500"></div>
                                <div class="flex items-center gap-3 relative z-10">
                                    <div class="w-10 h-10 bg-gradient-to-r from-[#A78BFA] to-[#C084FC] rounded-lg flex items-center justify-center group-hover/stats:scale-110 transition-transform duration-300">
                                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <div class="text-2xl font-bold text-white">Secure</div>
                                        <div class="text-xs text-[#6B7280]">Sandbox Environment</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Saved Files Section with Gradient Border -->
                        <div class="mt-8 animate-fadeInUp" style="animation-delay: 0.3s">
                            <div class="flex items-center gap-2 mb-3">
                                <div class="w-8 h-8 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-lg flex items-center justify-center">
                                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                                    </svg>
                                </div>
                                <span class="text-sm font-medium text-white">Saved Code Files</span>
                                <span id="fileCount" class="text-xs text-[#6B7280]">(0 files)</span>
                            </div>
                            <div id="savedFilesList" class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-xl border border-[#374151] p-3 max-h-[150px] overflow-y-auto custom-scrollbar transition-all duration-300 hover:border-[#3B82F6]">
                                <div class="text-center text-[#6B7280] text-sm py-4">📁 No saved files. Click "Save" to save your code.</div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
        
        <style>
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            .animate-fadeInUp {
                animation: fadeInUp 0.6s ease-out forwards;
            }
            @keyframes gradient {
                0%, 100% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
            }
            .animate-gradient {
                background-size: 200% 200%;
                animation: gradient 3s ease infinite;
            }
            @keyframes pulse-slow {
                0%, 100% { opacity: 0.2; transform: scale(1); }
                50% { opacity: 0.35; transform: scale(1.05); }
            }
            .animate-pulse-slow {
                animation: pulse-slow 4s ease-in-out infinite;
            }
            @keyframes spin-slow {
                from { transform: translate(-50%, -50%) rotate(0deg); }
                to { transform: translate(-50%, -50%) rotate(360deg); }
            }
            .animate-spin-slow {
                animation: spin-slow 25s linear infinite;
            }
            .custom-scrollbar::-webkit-scrollbar {
                width: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
                background: #1F2937;
                border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
                background: #3B82F6;
                border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: #60A5FA;
            }
        </style>
    `;
}

// setupCodeEditorPage function remains exactly the same (no changes)
export function setupCodeEditorPage() {
    console.log('🎯 Setting up Code Editor page...');
    
    const runBtn = document.getElementById('runCodeButton');
    const clearBtn = document.getElementById('clearOutputButton');
    const saveBtn = document.getElementById('saveCodeButton');
    const loadBtn = document.getElementById('loadCodeButton');
    const editor = document.getElementById('codeEditor');
    const output = document.getElementById('outputPanel');
    const langSelect = document.getElementById('codeLanguage');
    const savedFilesList = document.getElementById('savedFilesList');
    
    function loadSavedFilesList() {
        const savedFiles = JSON.parse(localStorage.getItem('savedCodeFiles') || '[]');
        
        if (savedFiles.length === 0) {
            savedFilesList.innerHTML = '<div class="text-center text-[#6B7280] text-sm py-4">📁 No saved files. Click "Save" to save your code.</div>';
            return;
        }
        
        savedFilesList.innerHTML = savedFiles.map((file, index) => `
            <div class="flex items-center justify-between p-2 hover:bg-[#1F2937] rounded-lg cursor-pointer group transition-all duration-200" data-file-index="${index}">
                <div class="flex items-center gap-3">
                    <svg class="w-4 h-4 text-[#3B82F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                    </svg>
                    <div>
                        <div class="text-sm text-white">${escapeHtml(file.name)}</div>
                        <div class="text-xs text-[#6B7280]">${file.language} • ${new Date(file.savedAt).toLocaleString()}</div>
                    </div>
                </div>
                <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button class="load-file-btn text-[#3B82F6] hover:text-[#60A5FA] text-xs px-2 py-1 rounded transition-all" data-index="${index}">Load</button>
                    <button class="delete-file-btn text-[#EF4444] hover:text-[#F87171] text-xs px-2 py-1 rounded transition-all" data-index="${index}">Delete</button>
                </div>
            </div>
        `).join('');
        
        document.querySelectorAll('.load-file-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(btn.dataset.index);
                const savedFiles = JSON.parse(localStorage.getItem('savedCodeFiles') || '[]');
                if (savedFiles[index]) {
                    editor.value = savedFiles[index].code;
                    langSelect.value = savedFiles[index].language;
                    const changeEvent = new Event('change');
                    langSelect.dispatchEvent(changeEvent);
                    showToast('success', `✅ Loaded: ${savedFiles[index].name}`);
                }
            });
        });
        
        document.querySelectorAll('.delete-file-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(btn.dataset.index);
                const savedFiles = JSON.parse(localStorage.getItem('savedCodeFiles') || '[]');
                const fileName = savedFiles[index]?.name;
                savedFiles.splice(index, 1);
                localStorage.setItem('savedCodeFiles', JSON.stringify(savedFiles));
                loadSavedFilesList();
                showToast('info', `🗑️ Deleted: ${fileName}`);
            });
        });
    }
    
    function showToast(type, message) {
        const toast = document.createElement('div');
        toast.className = `fixed bottom-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg ${
            type === 'success' ? 'bg-[#10B981]' : type === 'error' ? 'bg-[#EF4444]' : 'bg-[#3B82F6]'
        } text-white text-sm animate-fadeInUp`;
        toast.innerText = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
    
    if (saveBtn) {
        saveBtn.onclick = () => {
            const code = editor?.value || '';
            const language = langSelect?.value || 'python';
            const fileName = prompt('📝 Enter file name (without extension):', `code_${Date.now()}`);
            if (!fileName) return;
            const savedFiles = JSON.parse(localStorage.getItem('savedCodeFiles') || '[]');
            savedFiles.push({
                name: fileName,
                code: code,
                language: language,
                savedAt: new Date().toISOString()
            });
            localStorage.setItem('savedCodeFiles', JSON.stringify(savedFiles));
            loadSavedFilesList();
            showToast('success', `💾 Saved: ${fileName}`);
        };
    }
    
    if (loadBtn) {
        loadBtn.onclick = () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.py,.js,.cpp,.java,.txt';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (event) => {
                    editor.value = event.target.result;
                    const ext = file.name.split('.').pop();
                    const langMap = { 'py': 'python', 'js': 'javascript', 'cpp': 'cpp', 'java': 'java' };
                    if (langMap[ext]) langSelect.value = langMap[ext];
                    showToast('success', `📂 Loaded: ${file.name}`);
                };
                reader.readAsText(file);
            };
            input.click();
        };
    }
    
    if (runBtn) {
        runBtn.onclick = async function() {
            if (!editor) return;
            const code = editor.value;
            const language = langSelect ? langSelect.value : 'python';
            if (output) output.innerHTML = '<div class="flex items-center gap-2"><div class="w-5 h-5 border-2 border-[#3B82F6] border-t-transparent rounded-full animate-spin"></div><span class="text-[#9CA3AF]">Executing code...</span></div>';
            runBtn.disabled = true;
            runBtn.style.opacity = '0.5';
            try {
                const token = localStorage.getItem('token');
                const apiUrl = window.API_URL || 'http://localhost:10000/api';
                const url = `${apiUrl}/code/execute`;
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': token ? 'Bearer ' + token : '' },
                    body: JSON.stringify({ code, language })
                });
                const result = await response.json();
                if (output) {
                    if (result.success) {
                        if (result.output) {
                            output.innerHTML = '<div class="text-[#10B981]">✓ Output:</div><pre class="bg-[#1F2937] p-3 rounded-xl mt-2 overflow-x-auto">' + escapeHtml(result.output) + '</pre>';
                        } else {
                            output.innerHTML = '<span class="text-[#6B7280]">✓ Code executed successfully (no output)</span>';
                        }
                    } else {
                        output.innerHTML = '<div class="text-[#EF4444]">❌ Error: ' + escapeHtml(result.message || result.error) + '</div>';
                    }
                }
            } catch (error) {
                console.error('Error:', error);
                if (output) output.innerHTML = '<div class="text-[#EF4444]">❌ Connection error: ' + error.message + '</div>';
            } finally {
                runBtn.disabled = false;
                runBtn.style.opacity = '1';
            }
        };
    }
    
    if (clearBtn) {
        clearBtn.onclick = function() {
            if (output) output.innerHTML = 'Output cleared. Click "Run Code" to execute again.';
        };
    }
    
    loadSavedFilesList();
    
    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }
}