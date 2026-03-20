// frontend/src/components/layout/AIChatSidebar.js
// AI Chatbot Sidebar - Right side - FIXED POSITIONING (No cutting/moving)

export function AIChatSidebar() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    if (!isAuthenticated) return '';
    
    // Check if sidebar is open from localStorage
    const isOpen = localStorage.getItem('aiChatOpen') !== 'false'; // Default to true
    
    return `
        <!-- Floating Toggle Button (Always visible when sidebar is closed) -->
        <button id="openAIChatBtn" 
                class="fixed right-0 top-1/2 transform -translate-y-1/2 bg-[#3B82F6] text-white p-3 rounded-l-lg shadow-lg hover:bg-[#60A5FA] transition-all z-[1001] ${isOpen ? 'hidden' : 'block'}"
                title="Open AI Assistant"
                style="right: 0; top: 50%; transform: translateY(-50%);">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
            </svg>
            <span class="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        </button>
        
        <!-- Main Sidebar -->
        <div id="aiChatSidebar" 
             class="fixed right-0 top-0 h-full w-96 bg-[#1F2937] shadow-2xl z-[1000] border-l border-[#374151] flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}"
             style="right: 0; top: 0; height: 100vh; width: 384px;">
            
            <!-- Header -->
            <div class="flex items-center justify-between p-4 border-b border-[#374151] bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] flex-shrink-0">
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
                <button id="closeAIChat" class="text-white hover:text-[#E5E7EB] transition-colors p-1 hover:bg-white/10 rounded flex-shrink-0">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            
            <!-- Chat Messages Area -->
            <div id="aiChatMessages" class="flex-1 overflow-y-auto p-4 space-y-4 bg-[#111827] min-h-0">
                <!-- Welcome Message -->
                <div class="flex items-start space-x-2">
                    <div class="w-8 h-8 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full flex items-center justify-center flex-shrink-0">
                        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                        </svg>
                    </div>
                    <div class="flex-1 bg-[#1F2937] rounded-lg p-3">
                        <p class="text-sm text-[#E5E7EB]">Hello! I'm your AI learning assistant. Ask me anything about your current topic!</p>
                        <p class="text-xs text-[#9CA3AF] mt-1">Just now</p>
                    </div>
                </div>
            </div>
            
            <!-- Input Area -->
            <div class="p-4 border-t border-[#374151] bg-[#1F2937] flex-shrink-0">
                <div class="flex items-center space-x-2">
                    <input type="text" 
                           id="aiChatInput"
                           placeholder="Ask AI Assistant..." 
                           class="flex-1 bg-[#111827] border border-[#374151] rounded-lg px-4 py-2 text-[#E5E7EB] text-sm focus:outline-none focus:border-[#3B82F6] transition-colors"
                           autocomplete="off">
                    <button id="sendAIMessage" 
                            class="bg-[#3B82F6] hover:bg-[#60A5FA] text-white p-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                            disabled>
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `;
}

export function setupAIChat() {
    console.log('Setting up AI Chat with sliding toggle...');
    
    const sidebar = document.getElementById('aiChatSidebar');
    const closeBtn = document.getElementById('closeAIChat');
    const openBtn = document.getElementById('openAIChatBtn');
    const input = document.getElementById('aiChatInput');
    const sendBtn = document.getElementById('sendAIMessage');
    const toggleBtn = document.getElementById('aiChatToggle'); // From navbar
    const mainContent = document.getElementById('mainContent');
    
    // Function to toggle sidebar
    function toggleSidebar(open) {
        if (!sidebar) return;
        
        if (open === true) {
            sidebar.classList.remove('translate-x-full');
            sidebar.classList.add('translate-x-0');
            if (openBtn) {
                openBtn.classList.add('hidden');
                openBtn.style.display = 'none';
            }
            localStorage.setItem('aiChatOpen', 'true');
            
            // Adjust main content
            if (mainContent) {
                mainContent.style.marginRight = '384px';
                mainContent.style.width = 'calc(100% - 640px)';
            }
        } else if (open === false) {
            sidebar.classList.add('translate-x-full');
            sidebar.classList.remove('translate-x-0');
            if (openBtn) {
                openBtn.classList.remove('hidden');
                openBtn.style.display = 'block';
            }
            localStorage.setItem('aiChatOpen', 'false');
            
            // Adjust main content
            if (mainContent) {
                mainContent.style.marginRight = '0';
                mainContent.style.width = 'calc(100% - 256px)';
            }
        } else {
            // Toggle
            const isOpen = sidebar.classList.contains('translate-x-0');
            toggleSidebar(!isOpen);
        }
    }
    
    // Close button
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleSidebar(false);
        });
    }
    
    // Open button (floating)
    if (openBtn) {
        openBtn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleSidebar(true);
        });
    }
    
    // Navbar toggle button
    if (toggleBtn) {
        toggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleSidebar();
        });
    }
    
    // Make toggle globally available
    window.toggleAIChat = toggleSidebar;
    
    // Input handling
    if (input && sendBtn) {
        input.addEventListener('input', () => {
            sendBtn.disabled = !input.value.trim();
        });
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && input.value.trim()) {
                e.preventDefault();
                sendMessage(input.value.trim());
            }
        });
        
        sendBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (input.value.trim()) {
                sendMessage(input.value.trim());
            }
        });
    }
    
    // Initial adjustment
    const isOpen = localStorage.getItem('aiChatOpen') !== 'false';
    if (!isOpen && openBtn) {
        openBtn.classList.remove('hidden');
        openBtn.style.display = 'block';
    }
    
    // Ensure main content has initial correct margins
    if (mainContent) {
        if (isOpen) {
            mainContent.style.marginRight = '384px';
            mainContent.style.width = 'calc(100% - 640px)';
        } else {
            mainContent.style.marginRight = '0';
            mainContent.style.width = 'calc(100% - 256px)';
        }
    }
}

// Send message function
async function sendMessage(message) {
    const input = document.getElementById('aiChatInput');
    const sendBtn = document.getElementById('sendAIMessage');
    const container = document.getElementById('aiChatMessages');
    
    if (!container) return;
    
    // Add user message
    addUserMessage(message);
    
    // Clear input and disable button
    if (input) {
        input.value = '';
        input.disabled = true;
    }
    if (sendBtn) sendBtn.disabled = true;
    
    // Show typing indicator
    const typingId = showTypingIndicator();
    
    try {
        // Get current topic
        const topicInput = document.getElementById('topicInput');
        const currentTopic = topicInput ? topicInput.value : 'general';
        
        // Get auth token
        const token = localStorage.getItem('authToken');
        
        // Call backend API
        const response = await fetch('https://flashnotes-grp-pjt.onrender.com/api/ai/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                message: message,
                context: currentTopic,
                history: getChatHistory()
            })
        });
        
        const data = await response.json();
        
        // Remove typing indicator
        removeTypingIndicator(typingId);
        
        if (response.ok && data.success) {
            addAIMessage(data.message);
        } else {
            addAIMessage(`❌ Error: ${data.message || 'Failed to get response'}`);
        }
        
    } catch (error) {
        console.error('AI Chat error:', error);
        removeTypingIndicator(typingId);
        addAIMessage(`I understand you're asking about "${message}". How can I help you learn more about this topic?`);
    } finally {
        if (input) {
            input.disabled = false;
            input.focus();
        }
    }
}

// Get chat history
function getChatHistory() {
    const container = document.getElementById('aiChatMessages');
    if (!container) return [];
    
    const messages = container.querySelectorAll('.user-message, .ai-message');
    const history = [];
    
    messages.forEach(msg => {
        const role = msg.classList.contains('user-message') ? 'user' : 'assistant';
        const content = msg.querySelector('p')?.textContent || '';
        if (content) {
            history.push({ role, content });
        }
    });
    
    return history.slice(-10);
}

// Add user message
function addUserMessage(message) {
    const container = document.getElementById('aiChatMessages');
    if (!container) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'flex items-start space-x-2 justify-end user-message';
    messageDiv.innerHTML = `
        <div class="flex-1 bg-[#3B82F6] rounded-lg p-3 max-w-[80%] break-words">
            <p class="text-sm text-white">${escapeHtml(message)}</p>
            <p class="text-xs text-white/70 text-right mt-1">Just now</p>
        </div>
        <div class="w-8 h-8 bg-[#374151] rounded-full flex items-center justify-center flex-shrink-0">
            <span class="text-white text-sm font-semibold">${getUserInitials()}</span>
        </div>
    `;
    
    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;
}

// Add AI message
function addAIMessage(message) {
    const container = document.getElementById('aiChatMessages');
    if (!container) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'flex items-start space-x-2 ai-message';
    messageDiv.innerHTML = `
        <div class="w-8 h-8 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full flex items-center justify-center flex-shrink-0">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
        </div>
        <div class="flex-1 bg-[#1F2937] rounded-lg p-3 break-words">
            <p class="text-sm text-[#E5E7EB]">${escapeHtml(message)}</p>
            <p class="text-xs text-[#9CA3AF] mt-1">Just now</p>
        </div>
    `;
    
    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;
}

// Show typing indicator
function showTypingIndicator() {
    const container = document.getElementById('aiChatMessages');
    if (!container) return null;
    
    const id = 'typing-' + Date.now();
    const typingDiv = document.createElement('div');
    typingDiv.id = id;
    typingDiv.className = 'flex items-start space-x-2 typing-indicator';
    typingDiv.innerHTML = `
        <div class="w-8 h-8 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full flex items-center justify-center flex-shrink-0">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
        </div>
        <div class="flex-1 bg-[#1F2937] rounded-lg p-4">
            <div class="flex space-x-1">
                <div class="w-2 h-2 bg-[#3B82F6] rounded-full animate-bounce" style="animation-delay: 0s"></div>
                <div class="w-2 h-2 bg-[#60A5FA] rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                <div class="w-2 h-2 bg-[#A78BFA] rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
            </div>
            <p class="text-xs text-[#9CA3AF] mt-2">AI is thinking...</p>
        </div>
    `;
    
    container.appendChild(typingDiv);
    container.scrollTop = container.scrollHeight;
    return id;
}

// Remove typing indicator
function removeTypingIndicator(id) {
    if (id) {
        const indicator = document.getElementById(id);
        if (indicator) indicator.remove();
    }
}

// Helper functions
function getUserInitials() {
    const name = localStorage.getItem('userName') || 'User';
    return name.charAt(0).toUpperCase();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}