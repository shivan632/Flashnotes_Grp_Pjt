// frontend/src/components/layout/AIChatSidebar.js
// AI Chatbot Sidebar - Enhanced UI with modern design

export function AIChatSidebar() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    if (!isAuthenticated) return '';
    
    // Check if sidebar is open from localStorage
    const isOpen = localStorage.getItem('aiChatOpen') !== 'false'; // Default to true
    
    return `
        <!-- Floating Toggle Button (Always visible when sidebar is closed) -->
        <button id="openAIChatBtn" 
                class="fixed right-0 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] text-white p-3 rounded-l-xl shadow-2xl hover:shadow-[#3B82F6]/30 transition-all duration-300 z-[1001] group ${isOpen ? 'hidden' : 'block'}"
                title="Open AI Assistant"
                style="right: 0; top: 50%; transform: translateY(-50%);">
            <svg class="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
            </svg>
            <span class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-lg"></span>
            <span class="absolute hidden group-hover:block bg-[#111827] text-white text-xs px-2 py-1 rounded -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap shadow-lg">
                Open AI Assistant
            </span>
        </button>
        
        <!-- Main Sidebar -->
        <div id="aiChatSidebar" 
             class="fixed right-0 top-0 h-full w-96 bg-gradient-to-b from-[#1F2937] to-[#111827] shadow-2xl z-[1000] border-l border-[#374151] flex flex-col transition-all duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}"
             style="right: 0; top: 0; height: 100vh; width: 384px;">
            
            <!-- Header with gradient -->
            <div class="relative flex items-center justify-between p-5 border-b border-[#374151] bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] flex-shrink-0">
                <div class="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                <div class="flex items-center space-x-3 relative z-10">
                    <div class="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                        </svg>
                    </div>
                    <div>
                        <h3 class="font-bold text-white text-lg">AI Assistant</h3>
                        <p class="text-xs text-white/80">Powered by Gemini AI</p>
                    </div>
                </div>
                <button id="closeAIChat" class="relative z-10 text-white hover:text-[#E5E7EB] transition-all duration-300 p-2 hover:bg-white/10 rounded-xl group">
                    <svg class="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    <span class="absolute hidden group-hover:block bg-[#111827] text-white text-xs px-2 py-1 rounded -top-8 right-0 whitespace-nowrap shadow-lg">
                        Close
                    </span>
                </button>
            </div>
            
            <!-- Chat Messages Area with custom scrollbar -->
            <div id="aiChatMessages" class="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-[#111827] to-[#0F172A] scrollbar-thin scrollbar-thumb-[#3B82F6] scrollbar-track-[#1F2937]">
                <!-- Welcome Message with animation -->
                <div class="flex items-start space-x-3 animate-fadeInUp">
                    <div class="w-9 h-9 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                        </svg>
                    </div>
                    <div class="flex-1 bg-[#1F2937]/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-[#374151]">
                        <p class="text-sm text-[#E5E7EB] leading-relaxed">Hello! I'm your AI learning assistant. Ask me anything about your current topic!</p>
                        <p class="text-xs text-[#60A5FA] mt-2 flex items-center gap-1">
                            <span class="w-1.5 h-1.5 bg-[#3B82F6] rounded-full animate-pulse"></span>
                            Ready to help
                        </p>
                    </div>
                </div>
                
                <!-- Quick Suggestions -->
                <div class="mt-6">
                    <p class="text-xs text-[#9CA3AF] mb-3 flex items-center gap-2">
                        <span class="w-1 h-1 bg-[#3B82F6] rounded-full"></span>
                        Try asking:
                    </p>
                    <div class="grid grid-cols-1 gap-2">
                        <button class="suggestion-btn text-left text-sm bg-[#1F2937]/60 hover:bg-[#374151] text-[#E5E7EB] p-3 rounded-xl transition-all duration-300 border border-[#374151] hover:border-[#3B82F6] group">
                            <span class="flex items-center gap-2">
                                <span class="text-[#60A5FA] group-hover:translate-x-1 transition-transform inline-block">→</span>
                                Can you explain this topic in simpler terms?
                            </span>
                        </button>
                        <button class="suggestion-btn text-left text-sm bg-[#1F2937]/60 hover:bg-[#374151] text-[#E5E7EB] p-3 rounded-xl transition-all duration-300 border border-[#374151] hover:border-[#3B82F6] group">
                            <span class="flex items-center gap-2">
                                <span class="text-[#60A5FA] group-hover:translate-x-1 transition-transform inline-block">→</span>
                                Give me more examples about this
                            </span>
                        </button>
                        <button class="suggestion-btn text-left text-sm bg-[#1F2937]/60 hover:bg-[#374151] text-[#E5E7EB] p-3 rounded-xl transition-all duration-300 border border-[#374151] hover:border-[#3B82F6] group">
                            <span class="flex items-center gap-2">
                                <span class="text-[#60A5FA] group-hover:translate-x-1 transition-transform inline-block">→</span>
                                What are the key points I should remember?
                            </span>
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- Input Area with glass effect -->
            <div class="p-5 border-t border-[#374151] bg-gradient-to-t from-[#1F2937] to-[#111827] flex-shrink-0">
                <div class="relative flex items-center space-x-2">
                    <input type="text" 
                           id="aiChatInput"
                           placeholder="Ask AI Assistant..." 
                           class="flex-1 bg-[#111827] border-2 border-[#374151] rounded-xl px-4 py-3 text-[#E5E7EB] text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/30 transition-all duration-300 placeholder:text-[#6B7280]"
                           autocomplete="off">
                    <button id="sendAIMessage" 
                            class="bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] hover:from-[#60A5FA] hover:to-[#8B5CF6] text-white p-3 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-[#3B82F6]/30 flex-shrink-0 group"
                            disabled>
                        <svg class="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                        </svg>
                    </button>
                </div>
                <p class="text-xs text-[#6B7280] mt-3 text-center flex items-center justify-center gap-1">
                    <span class="w-1 h-1 bg-[#3B82F6] rounded-full"></span>
                    Powered by Gemini AI
                    <span class="w-1 h-1 bg-[#3B82F6] rounded-full"></span>
                </p>
            </div>
        </div>
    `;
}

export function setupAIChat() {
    console.log('🎨 Setting up AI Chat with enhanced UI...');
    
    const sidebar = document.getElementById('aiChatSidebar');
    const closeBtn = document.getElementById('closeAIChat');
    const openBtn = document.getElementById('openAIChatBtn');
    const input = document.getElementById('aiChatInput');
    const sendBtn = document.getElementById('sendAIMessage');
    const toggleBtn = document.getElementById('aiChatToggle'); // From navbar
    const mainContent = document.getElementById('mainContent');
    
    // Function to toggle sidebar with animation
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
            
            // Add entrance animation to messages
            const messages = document.querySelectorAll('#aiChatMessages > div');
            messages.forEach((msg, index) => {
                msg.style.animation = `fadeInUp 0.3s ease-out ${index * 0.05}s forwards`;
                msg.style.opacity = '0';
            });
            
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
            
            if (mainContent) {
                mainContent.style.marginRight = '0';
                mainContent.style.width = 'calc(100% - 256px)';
            }
        } else {
            const isOpen = sidebar.classList.contains('translate-x-0');
            toggleSidebar(!isOpen);
        }
    }
    
    // Close button with animation
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleSidebar(false);
        });
    }
    
    // Open button with animation
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
    
    window.toggleAIChat = toggleSidebar;
    
    // Input handling with visual feedback
    if (input && sendBtn) {
        input.addEventListener('input', () => {
            sendBtn.disabled = !input.value.trim();
            if (input.value.trim()) {
                input.classList.add('border-[#3B82F6]', 'shadow-lg');
            } else {
                input.classList.remove('border-[#3B82F6]', 'shadow-lg');
            }
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
    
    // Suggestion buttons
    const suggestionBtns = document.querySelectorAll('.suggestion-btn');
    suggestionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (input) {
                input.value = btn.textContent.trim().replace('→', '').trim();
                input.dispatchEvent(new Event('input'));
                sendMessage(input.value);
            }
        });
    });
    
    const isOpen = localStorage.getItem('aiChatOpen') !== 'false';
    if (!isOpen && openBtn) {
        openBtn.classList.remove('hidden');
        openBtn.style.display = 'block';
    }
    
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

// Add these CSS animations to your style.css
const aiChatStyles = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .animate-fadeInUp {
        animation: fadeInUp 0.3s ease-out;
    }
    
    /* Custom scrollbar for chat */
    #aiChatMessages::-webkit-scrollbar {
        width: 4px;
    }
    
    #aiChatMessages::-webkit-scrollbar-track {
        background: #1F2937;
        border-radius: 10px;
    }
    
    #aiChatMessages::-webkit-scrollbar-thumb {
        background: #3B82F6;
        border-radius: 10px;
    }
    
    #aiChatMessages::-webkit-scrollbar-thumb:hover {
        background: #60A5FA;
    }
    
    /* Message animations */
    .user-message, .ai-message {
        animation: fadeInUp 0.3s ease-out;
    }
    
    /* Typing indicator animation */
    .typing-indicator .animate-bounce {
        animation: bounce 1.4s infinite;
    }
`;

if (!document.querySelector('#ai-chat-styles')) {
    const style = document.createElement('style');
    style.id = 'ai-chat-styles';
    style.textContent = aiChatStyles;
    document.head.appendChild(style);
}

// Send message function (unchanged - only UI)
async function sendMessage(message) {
    const input = document.getElementById('aiChatInput');
    const sendBtn = document.getElementById('sendAIMessage');
    const container = document.getElementById('aiChatMessages');
    
    if (!container) return;
    
    addUserMessage(message);
    
    if (input) {
        input.value = '';
        input.disabled = true;
    }
    if (sendBtn) sendBtn.disabled = true;
    
    const typingId = showTypingIndicator();
    
    try {
        const topicInput = document.getElementById('topicInput');
        const currentTopic = topicInput ? topicInput.value : 'general';
        const token = localStorage.getItem('authToken');
        
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
        removeTypingIndicator(typingId);
        
        if (response.ok && data.success) {
            addAIMessage(data.message);
        } else {
            addAIMessage(`❌ Error: ${data.message || 'Failed to get response'}`);
        }
        
    } catch (error) {
        console.error('AI Chat error:', error);
        removeTypingIndicator(typingId);
        addAIMessage(`💡 I understand you're asking about "${message}". How can I help you learn more about this topic?`);
    } finally {
        if (input) {
            input.disabled = false;
            input.focus();
        }
    }
}

// Rest of the helper functions remain the same...
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

function addUserMessage(message) {
    const container = document.getElementById('aiChatMessages');
    if (!container) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'flex items-start space-x-2 justify-end user-message';
    messageDiv.innerHTML = `
        <div class="flex-1 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] rounded-2xl p-3 max-w-[80%] break-words shadow-lg">
            <p class="text-sm text-white">${escapeHtml(message)}</p>
            <p class="text-xs text-white/70 text-right mt-1">Just now</p>
        </div>
        <div class="w-8 h-8 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
            <span class="text-white text-sm font-semibold">${getUserInitials()}</span>
        </div>
    `;
    
    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;
}

function addAIMessage(message) {
    const container = document.getElementById('aiChatMessages');
    if (!container) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'flex items-start space-x-2 ai-message';
    messageDiv.innerHTML = `
        <div class="w-8 h-8 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
        </div>
        <div class="flex-1 bg-[#1F2937]/80 backdrop-blur-sm rounded-2xl p-3 break-words border border-[#374151] shadow-lg">
            <p class="text-sm text-[#E5E7EB] leading-relaxed">${escapeHtml(message)}</p>
            <p class="text-xs text-[#60A5FA] mt-2 flex items-center gap-1">
                <span class="w-1 h-1 bg-[#3B82F6] rounded-full animate-pulse"></span>
                AI Assistant
            </p>
        </div>
    `;
    
    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;
}

function showTypingIndicator() {
    const container = document.getElementById('aiChatMessages');
    if (!container) return null;
    
    const id = 'typing-' + Date.now();
    const typingDiv = document.createElement('div');
    typingDiv.id = id;
    typingDiv.className = 'flex items-start space-x-2 typing-indicator';
    typingDiv.innerHTML = `
        <div class="w-8 h-8 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
        </div>
        <div class="flex-1 bg-[#1F2937]/80 backdrop-blur-sm rounded-2xl p-4 border border-[#374151]">
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

function removeTypingIndicator(id) {
    if (id) {
        const indicator = document.getElementById(id);
        if (indicator) indicator.remove();
    }
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