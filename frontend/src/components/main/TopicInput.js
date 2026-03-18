export function TopicInput() {
    return `
        <div class="bg-card p-6 rounded-xl shadow-lg">
            <h3 class="text-2xl font-bold mb-4 text-primary">Generate Questions & Answers</h3>
            <div class="flex gap-4">
                <input type="text" 
                       id="topicInput"
                       placeholder="Enter a topic (e.g., Operating System, Quantum Physics...)" 
                       class="flex-1 bg-background border-2 border-primary rounded-lg px-4 py-3 text-text focus:outline-none focus:border-accent">
                <button id="generateBtn" class="bg-primary hover:bg-secondary text-white px-8 py-3 rounded-lg transition-all transform hover:scale-105 flex items-center gap-2">
                    <span>Generate</span>
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                </button>
            </div>
        </div>
    `;
}