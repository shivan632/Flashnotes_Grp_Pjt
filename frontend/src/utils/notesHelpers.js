// Notes helper functions for formatting and display

/**
 * Format notes content to HTML
 */
export function formatNotesToHTML(notes) {
    let html = '';
    
    // Overview
    if (notes.overview) {
        html += `
            <div class="mb-6">
                <div class="flex items-center gap-2 mb-3">
                    <span class="text-xl">📌</span>
                    <h3 class="text-lg font-semibold text-white">Overview</h3>
                </div>
                <p class="text-[#E5E7EB] leading-relaxed pl-4 border-l-4 border-[#3B82F6]">${escapeHtml(notes.overview)}</p>
            </div>
        `;
    }
    
    // Key Concepts
    if (notes.key_concepts && notes.key_concepts.length > 0) {
        html += `
            <div class="mb-6">
                <div class="flex items-center gap-2 mb-3">
                    <span class="text-xl">🎯</span>
                    <h3 class="text-lg font-semibold text-white">Key Concepts</h3>
                </div>
                <ul class="space-y-2 pl-4">
                    ${notes.key_concepts.map(concept => `
                        <li class="flex items-start gap-2">
                            <span class="text-[#3B82F6] mt-1">•</span>
                            <span class="text-[#E5E7EB]">${escapeHtml(concept)}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
    }
    
    // Code Examples
    if (notes.code_examples && notes.code_examples.length > 0) {
        html += `
            <div class="mb-6">
                <div class="flex items-center gap-2 mb-3">
                    <span class="text-xl">💻</span>
                    <h3 class="text-lg font-semibold text-white">Code Examples</h3>
                </div>
                <div class="space-y-4">
                    ${notes.code_examples.map((example, idx) => `
                        <div class="bg-[#111827] rounded-xl overflow-hidden border border-[#374151]">
                            <div class="flex justify-between items-center px-4 py-2 bg-[#1F2937] border-b border-[#374151]">
                                <span class="text-sm font-medium text-[#3B82F6]">${escapeHtml(example.title)}</span>
                                <button class="copy-code-btn text-xs text-[#9CA3AF] hover:text-[#3B82F6] transition-colors" data-code="${escapeHtml(example.code)}">
                                    📋 Copy
                                </button>
                            </div>
                            <pre class="p-4 overflow-x-auto"><code class="text-sm text-[#E5E7EB]">${escapeHtml(example.code)}</code></pre>
                            ${example.output ? `
                                <div class="px-4 py-2 bg-[#0F172A] border-t border-[#374151]">
                                    <span class="text-xs text-[#9CA3AF]">Output:</span>
                                    <pre class="text-sm text-[#10B981] mt-1">${escapeHtml(example.output)}</pre>
                                </div>
                            ` : ''}
                            ${example.explanation ? `
                                <div class="px-4 py-2 bg-[#1F2937]/50 text-xs text-[#9CA3AF]">
                                    💡 ${escapeHtml(example.explanation)}
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    // Best Practices
    if (notes.best_practices && notes.best_practices.length > 0) {
        html += `
            <div class="mb-6">
                <div class="flex items-center gap-2 mb-3">
                    <span class="text-xl">✅</span>
                    <h3 class="text-lg font-semibold text-white">Best Practices</h3>
                </div>
                <ul class="space-y-2 pl-4">
                    ${notes.best_practices.map(practice => `
                        <li class="flex items-start gap-2">
                            <span class="text-[#10B981] mt-1">✓</span>
                            <span class="text-[#E5E7EB]">${escapeHtml(practice)}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
    }
    
    // Common Mistakes
    if (notes.common_mistakes && notes.common_mistakes.length > 0) {
        html += `
            <div class="mb-6">
                <div class="flex items-center gap-2 mb-3">
                    <span class="text-xl">⚠️</span>
                    <h3 class="text-lg font-semibold text-white">Common Mistakes to Avoid</h3>
                </div>
                <ul class="space-y-2 pl-4">
                    ${notes.common_mistakes.map(mistake => `
                        <li class="flex items-start gap-2">
                            <span class="text-[#EF4444] mt-1">⚠</span>
                            <span class="text-[#E5E7EB]">${escapeHtml(mistake)}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
    }
    
    return html;
}

/**
 * Convert notes to Markdown for download
 */
export function notesToMarkdown(notes, topic) {
    let markdown = `# ${notes.title || `${topic} Notes`}\n\n`;
    markdown += `*Generated on: ${new Date().toLocaleString()}*\n\n`;
    markdown += `---\n\n`;
    
    if (notes.overview) {
        markdown += `## 📌 Overview\n\n${notes.overview}\n\n`;
    }
    
    if (notes.key_concepts && notes.key_concepts.length > 0) {
        markdown += `## 🎯 Key Concepts\n\n`;
        notes.key_concepts.forEach(concept => {
            markdown += `- ${concept}\n`;
        });
        markdown += `\n`;
    }
    
    if (notes.code_examples && notes.code_examples.length > 0) {
        markdown += `## 💻 Code Examples\n\n`;
        notes.code_examples.forEach((example, idx) => {
            markdown += `### ${idx + 1}. ${example.title}\n\n`;
            markdown += `\`\`\`javascript\n${example.code}\n\`\`\`\n\n`;
            if (example.output) {
                markdown += `**Output:**\n\`\`\`\n${example.output}\n\`\`\`\n\n`;
            }
            if (example.explanation) {
                markdown += `💡 ${example.explanation}\n\n`;
            }
        });
    }
    
    if (notes.best_practices && notes.best_practices.length > 0) {
        markdown += `## ✅ Best Practices\n\n`;
        notes.best_practices.forEach(practice => {
            markdown += `- ${practice}\n`;
        });
        markdown += `\n`;
    }
    
    if (notes.common_mistakes && notes.common_mistakes.length > 0) {
        markdown += `## ⚠️ Common Mistakes to Avoid\n\n`;
        notes.common_mistakes.forEach(mistake => {
            markdown += `- ${mistake}\n`;
        });
        markdown += `\n`;
    }
    
    return markdown;
}

/**
 * Get difficulty color class
 */
export function getDifficultyColor(difficulty) {
    switch (difficulty?.toLowerCase()) {
        case 'beginner': return 'bg-green-500/20 text-green-400 border-green-500/30';
        case 'intermediate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
        case 'advanced': return 'bg-red-500/20 text-red-400 border-red-500/30';
        default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
}

/**
 * Get difficulty icon
 */
export function getDifficultyIcon(difficulty) {
    switch (difficulty?.toLowerCase()) {
        case 'beginner': return '🌱';
        case 'intermediate': return '⚡';
        case 'advanced': return '🚀';
        default: return '📚';
    }
}

/**
 * Get notes summary (short preview)
 */
export function getNotesSummary(notes, maxLength = 100) {
    if (!notes) return 'No content available';
    if (notes.overview) {
        let summary = notes.overview;
        if (summary.length > maxLength) {
            summary = summary.substring(0, maxLength) + '...';
        }
        return summary;
    }
    if (notes.key_concepts && notes.key_concepts.length > 0) {
        return notes.key_concepts[0];
    }
    return `${notes.title || 'Notes'} - ${notes.key_concepts?.length || 0} concepts`;
}

/**
 * Escape HTML
 */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

export default {
    formatNotesToHTML,
    notesToMarkdown,
    getDifficultyColor,
    getDifficultyIcon,
    getNotesSummary
};