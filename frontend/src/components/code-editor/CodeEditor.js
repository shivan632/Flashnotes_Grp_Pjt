// frontend/src/components/code-editor/CodeEditor.js

export function CodeEditor() {
    const uniqueId = Date.now();
    
    return `
        <div class="relative group">
            <!-- Animated gradient border on hover -->
            <div class="absolute -inset-0.5 bg-gradient-to-r from-[#3B82F6] via-[#A78BFA] to-[#3B82F6] rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-all duration-500 animate-pulse"></div>
            
            <div class="relative bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl overflow-hidden border border-[#374151] shadow-xl transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-[#3B82F6]/10">
                <!-- Toolbar with gradient border bottom -->
                <div class="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-[#1F2937] to-[#111827] border-b border-[#374151] relative">
                    <div class="absolute inset-0 bg-gradient-to-r from-[#3B82F6]/5 to-[#A78BFA]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
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
                    
                    <div class="flex items-center gap-3 relative z-10">
                        <div class="relative">
                            <select id="langSelect_${uniqueId}" class="appearance-none px-4 py-2 pr-8 bg-[#111827] text-white text-sm rounded-xl border border-[#374151] focus:border-[#3B82F6] focus:outline-none transition-all duration-300 cursor-pointer hover:bg-[#1F2937] hover:border-[#3B82F6]">
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
                        
                        <button id="runBtn_${uniqueId}" class="relative overflow-hidden group/btn px-5 py-2 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] hover:from-[#60A5FA] hover:to-[#8B5CF6] text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg">
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
                    <textarea id="codeEditor_${uniqueId}" 
                        class="w-full bg-[#0F172A] text-[#E5E7EB] font-mono text-sm pl-16 pr-5 py-5 focus:outline-none resize-none transition-all duration-300"
                        style="height: 400px; font-family: 'Consolas', 'Monaco', 'Courier New', monospace; line-height: 1.6;"
                        spellcheck="false">print("Hello, Flashnotes!")</textarea>
                </div>
                
                <!-- Output Panel -->
                <div class="border-t border-[#374151]">
                    <div class="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-[#1F2937] to-[#111827] border-b border-[#374151]">
                        <div class="flex items-center gap-2">
                            <div class="w-2 h-2 bg-[#10B981] rounded-full animate-pulse"></div>
                            <span class="text-sm font-medium text-white">Output</span>
                        </div>
                        <button id="clearBtn_${uniqueId}" class="text-xs text-[#6B7280] hover:text-[#3B82F6] transition-all duration-200 flex items-center gap-1 hover:scale-105">
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                            Clear
                        </button>
                    </div>
                    <div id="output_${uniqueId}" class="p-5 bg-[#111827] font-mono text-sm text-[#E5E7EB] min-h-[150px] max-h-[250px] overflow-auto whitespace-pre-wrap custom-scrollbar">
                        <span class="text-[#6B7280]">✨ Click "Run Code" to see output...</span>
                    </div>
                </div>
            </div>
        </div>
        
        <style>
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
            @keyframes pulse {
                0%, 100% { opacity: 0.4; }
                50% { opacity: 0.7; }
            }
            .animate-pulse {
                animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            }
        </style>
        
        <script>
            (function() {
                const editor = document.getElementById('codeEditor_' + '${uniqueId}');
                const output = document.getElementById('output_' + '${uniqueId}');
                const runBtn = document.getElementById('runBtn_' + '${uniqueId}');
                const clearBtn = document.getElementById('clearBtn_' + '${uniqueId}');
                const langSelect = document.getElementById('langSelect_' + '${uniqueId}');
                
                const API_URL = window.API_URL || 'http://localhost:10000/api';
                
                if (runBtn) {
                    runBtn.addEventListener('click', function(e) {
                        e.preventDefault();
                        const code = editor ? editor.value : '';
                        const language = langSelect ? langSelect.value : 'python';
                        
                        output.innerHTML = '<div class="flex items-center gap-2"><div class="w-5 h-5 border-2 border-[#3B82F6] border-t-transparent rounded-full animate-spin"></div><span class="text-[#9CA3AF]">Executing code...</span></div>';
                        runBtn.disabled = true;
                        runBtn.style.opacity = '0.5';
                        
                        const token = localStorage.getItem('token');
                        const url = API_URL + '/code/execute';
                        
                        fetch(url, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': token ? 'Bearer ' + token : ''
                            },
                            body: JSON.stringify({ code, language })
                        })
                        .then(function(res) { return res.json(); })
                        .then(function(data) {
                            if (data.success) {
                                if (data.output) {
                                    output.innerHTML = '<div class="text-[#10B981] mb-2 flex items-center gap-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg><span>Output:</span></div><pre class="bg-[#1F2937] p-3 rounded-xl mt-2 overflow-x-auto border border-[#374151]">' + escapeHtml(data.output) + '</pre>';
                                } else {
                                    output.innerHTML = '<span class="text-[#6B7280]">✓ Code executed successfully (no output)</span>';
                                }
                            } else {
                                output.innerHTML = '<div class="text-[#EF4444] mb-2 flex items-center gap-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><span>Error:</span></div><pre class="bg-[#1F2937] p-3 rounded-xl text-[#EF4444] overflow-x-auto">' + escapeHtml(data.message || data.error) + '</pre>';
                            }
                        })
                        .catch(function(err) {
                            console.error('Fetch error:', err);
                            output.innerHTML = '<div class="text-[#EF4444] flex items-center gap-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><span>Connection error: ' + err.message + '</span></div>';
                        })
                        .finally(function() {
                            runBtn.disabled = false;
                            runBtn.style.opacity = '1';
                        });
                    });
                }
                
                if (clearBtn) {
                    clearBtn.addEventListener('click', function() {
                        output.innerHTML = '<span class="text-[#6B7280]">✨ Output cleared. Click "Run Code" to execute again.</span>';
                    });
                }
                
                function escapeHtml(str) {
                    if (!str) return '';
                    return str.replace(/[&<>]/g, function(m) {
                        if (m === '&') return '&amp;';
                        if (m === '<') return '&lt;';
                        if (m === '>') return '&gt;';
                        return m;
                    });
                }
            })();
        </script>
    `;
}