// frontend/src/components/layout/AIChatSidebar.js
// AI Chatbot Sidebar - Right side - ADJUSTABLE with toggle

// Make toggle function globally available
window.toggleAIChat = function() {
    const sidebar = document.getElementById('aiChatSidebar');
    if (sidebar) {
        sidebar.classList.toggle('translate-x-full');
        sidebar.classList.toggle('translate-x-0');
        
        // Save state
        const isOpen = !sidebar.classList.contains('translate-x-full');
        localStorage.setItem('aiChatOpen', isOpen);
    }
};

export function AIChatSidebar() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    if (!isAuthenticated) return '';
    
    // Check if sidebar was previously open
    const isOpen = localStorage.getItem('aiChatOpen') === 'true';
    
    return `
        <div id="aiChatSidebar" 
             class="fixed right-0 top-0 h-full w-80 bg-[#1F2937] shadow-2xl z-50 border-l border-[#374151] flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}">
            
            <!-- Header -->
            <div class="flex items-center justify-between p-4 border-b border-[#374151] bg-gradient-to-r from-[#3B82F6] to-[#A78BFA]">
                <div class="flex items-center space-x-2">
                    <div class="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                        <svg class="w-5 h-5 text-[#3B82F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                        </svg>
                    </div>
                    <div>
                        <h3 class="font-bold text-white">AI Assistant</h3>
                        <p class="text-xs text-white/80">Powered by DeepSeek</p>
                    </div>
                </div>
                <button id="closeAIChat" class="text-white hover:text-[#E5E7EB] transition-colors p-1 hover:bg-white/10 rounded">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            
            <!-- Chat Messages Area -->
            <div id="aiChatMessages" class="flex-1 overflow-y-auto p-4 space-y-4">
                <div class="flex items-start space-x-2">
                    <div class="w-8 h-8 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full flex items-center justify-center flex-shrink-0">
                        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                        </svg>
                    </div>
                    <div class="flex-1 bg-[#111827] rounded-lg p-3">
                        <p class="text-sm text-[#E5E7EB]">Hello! I'm your AI learning assistant. Ask me anything about your current topic!</p>
                        <p class="text-xs text-[#9CA3AF] mt-1">Just now</p>
                    </div>
                </div>
            </div>
            
            <!-- Input Area -->
            <div class="p-4 border-t border-[#374151] bg-[#111827]">
                <div class="flex items-center space-x-2">
                    <input type="text" 
                           id="aiChatInput"
                           placeholder="Ask AI Assistant..." 
                           class="flex-1 bg-[#1F2937] border border-[#374151] rounded-lg px-4 py-2 text-[#E5E7EB] text-sm focus:outline-none focus:border-[#3B82F6] transition-colors"
                           autocomplete="off">
                    <button id="sendAIMessage" 
                            class="bg-[#3B82F6] hover:bg-[#60A5FA] text-white p-2 rounded-lg transition-all disabled:opacity-50"
                            disabled>
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                        </svg>
                    </button>
                </div>
            </div>
            
            <!-- Resize Handle -->
            <div id="aiChatResize" class="absolute left-0 top-0 w-1 h-full cursor-ew-resize hover:bg-[#3B82F6] transition-colors"></div>
        </div>
    `;
}

export function setupAIChat() {
    const aiChatSidebar = document.getElementById('aiChatSidebar');
    const closeBtn = document.getElementById('closeAIChat');
    const aiChatToggle = document.getElementById('aiChatToggle');
    const input = document.getElementById('aiChatInput');
    const sendBtn = document.getElementById('sendAIMessage');
    const resizeHandle = document.getElementById('aiChatResize');
    
    // Toggle function
    function toggleAIChat(open) {
        if (!aiChatSidebar) return;
        
        if (open === true) {
            aiChatSidebar.classList.remove('translate-x-full');
            aiChatSidebar.classList.add('translate-x-0');
            localStorage.setItem('aiChatOpen', 'true');
        } else if (open === false) {
            aiChatSidebar.classList.add('translate-x-full');
            aiChatSidebar.classList.remove('translate-x-0');
            localStorage.setItem('aiChatOpen', 'false');
        } else {
            // Toggle
            const isOpen = aiChatSidebar.classList.contains('translate-x-0');
            if (isOpen) {
                aiChatSidebar.classList.add('translate-x-full');
                aiChatSidebar.classList.remove('translate-x-0');
                localStorage.setItem('aiChatOpen', 'false');
            } else {
                aiChatSidebar.classList.remove('translate-x-full');
                aiChatSidebar.classList.add('translate-x-0');
                localStorage.setItem('aiChatOpen', 'true');
            }
        }
    }
    
    // Close button
    if (closeBtn) {
        closeBtn.addEventListener('click', () => toggleAIChat(false));
    }
    
    // AI Chat Toggle in Navbar
    if (aiChatToggle) {
        aiChatToggle.addEventListener('click', () => toggleAIChat());
    }
    
    // Make toggle globally available
    window.toggleAIChat = toggleAIChat;
    
    // Input handling
    if (input && sendBtn) {
        input.addEventListener('input', () => {
            sendBtn.disabled = !input.value.trim();
        });
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && input.value.trim()) {
                sendMessage(input.value.trim());
            }
        });
        
        sendBtn.addEventListener('click', () => {
            if (input.value.trim()) {
                sendMessage(input.value.trim());
            }
        });
    }
    
    // Resize functionality
    if (resizeHandle && aiChatSidebar) {
        let isResizing = false;
        let startX, startWidth;
        
        resizeHandle.addEventListener('mousedown', (e) => {
            isResizing = true;
            startX = e.clientX;
            startWidth = parseInt(getComputedStyle(aiChatSidebar).width, 10);
            
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
            
            // Prevent text selection while resizing
            e.preventDefault();
        });
        
        function onMouseMove(e) {
            if (!isResizing) return;
            
            const dx = startX - e.clientX; // Negative for right side
            const newWidth = Math.min(Math.max(startWidth + dx, 300), 600); // Min 300px, Max 600px
            
            aiChatSidebar.style.width = newWidth + 'px';
        }
        
        function onMouseUp() {
            isResizing = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }
    }
}

// Send message function
async function sendMessage(message) {
    const input = document.getElementById('aiChatInput');
    const sendBtn = document.getElementById('sendAIMessage');
    
    // Clear input
    if (input) {
        input.value = '';
        input.disabled = true;
    }
    if (sendBtn) sendBtn.disabled = true;
    
    // Add user message
    addUserMessage(message);
    
    // Simulate AI response
    setTimeout(() => {
        addAIMessage(`I understand you're asking about "${message}". How can I help you learn more about this topic?`);
        if (input) {
            input.disabled = false;
            input.focus();
        }
    }, 1000);
}

function addUserMessage(message) {
    const container = document.getElementById('aiChatMessages');
    if (!container) return;
    
    const html = `
        <div class="flex items-start space-x-2 justify-end">
            <div class="flex-1 bg-[#3B82F6] rounded-lg p-3 max-w-[80%]">
                <p class="text-sm text-white">${escapeHtml(message)}</p>
                <p class="text-xs text-white/70 text-right mt-1">Just now</p>
            </div>
            <div class="w-8 h-8 bg-[#374151] rounded-full flex items-center justify-center">
                <span class="text-white text-sm font-semibold">${getUserInitials()}</span>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', html);
    container.scrollTop = container.scrollHeight;
}

function addAIMessage(message) {
    const container = document.getElementById('aiChatMessages');
    if (!container) return;
    
    const html = `
        <div class="flex items-start space-x-2">
            <div class="w-8 h-8 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
            </div>
            <div class="flex-1 bg-[#111827] rounded-lg p-3">
                <p class="text-sm text-[#E5E7EB]">${escapeHtml(message)}</p>
                <p class="text-xs text-[#9CA3AF] mt-1">Just now</p>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', html);
    container.scrollTop = container.scrollHeight;
}

function getUserInitials() {
    const name = localStorage.getItem('userName') || 'User';
    return name.charAt(0).toUpperCase();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}