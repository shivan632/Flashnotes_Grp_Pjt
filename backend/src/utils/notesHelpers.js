/**
 * Format notes content for display
 * @param {Object} notes - Notes object from Gemini
 * @returns {string} Formatted HTML content
 */
export function formatNotesToHTML(notes) {
    let html = '';
    
    // Overview section
    if (notes.overview) {
        html += `
            <div class="notes-section">
                <div class="section-header">
                    <span class="section-icon">📌</span>
                    <h3 class="section-title">Overview</h3>
                </div>
                <div class="section-content">
                    <p>${escapeHtml(notes.overview)}</p>
                </div>
            </div>
        `;
    }
    
    // Key Concepts section
    if (notes.key_concepts && notes.key_concepts.length > 0) {
        html += `
            <div class="notes-section">
                <div class="section-header">
                    <span class="section-icon">🎯</span>
                    <h3 class="section-title">Key Concepts</h3>
                </div>
                <div class="section-content">
                    <ul class="key-concepts-list">
                        ${notes.key_concepts.map(concept => `
                            <li>${escapeHtml(concept)}</li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        `;
    }
    
    // Code Examples section
    if (notes.code_examples && notes.code_examples.length > 0) {
        html += `
            <div class="notes-section">
                <div class="section-header">
                    <span class="section-icon">💻</span>
                    <h3 class="section-title">Code Examples</h3>
                </div>
                <div class="section-content">
                    ${notes.code_examples.map((example, idx) => `
                        <div class="code-example">
                            <div class="code-header">
                                <span class="code-title">${escapeHtml(example.title)}</span>
                                <button class="copy-code-btn" data-code="${escapeHtml(example.code)}">
                                    📋 Copy
                                </button>
                            </div>
                            <pre class="code-block"><code class="language-javascript">${escapeHtml(example.code)}</code></pre>
                            ${example.output ? `
                                <div class="code-output">
                                    <strong>Output:</strong>
                                    <pre>${escapeHtml(example.output)}</pre>
                                </div>
                            ` : ''}
                            ${example.explanation ? `
                                <p class="code-explanation">💡 ${escapeHtml(example.explanation)}</p>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    // Best Practices section
    if (notes.best_practices && notes.best_practices.length > 0) {
        html += `
            <div class="notes-section">
                <div class="section-header">
                    <span class="section-icon">✅</span>
                    <h3 class="section-title">Best Practices</h3>
                </div>
                <div class="section-content">
                    <ul class="best-practices-list">
                        ${notes.best_practices.map(practice => `
                            <li>${escapeHtml(practice)}</li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        `;
    }
    
    // Common Mistakes section
    if (notes.common_mistakes && notes.common_mistakes.length > 0) {
        html += `
            <div class="notes-section">
                <div class="section-header">
                    <span class="section-icon">⚠️</span>
                    <h3 class="section-title">Common Mistakes to Avoid</h3>
                </div>
                <div class="section-content">
                    <ul class="common-mistakes-list">
                        ${notes.common_mistakes.map(mistake => `
                            <li>${escapeHtml(mistake)}</li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        `;
    }
    
    return html;
}

/**
 * Convert notes to Markdown format for download
 * @param {Object} notes - Notes object
 * @param {string} topic - Topic name
 * @returns {string} Markdown formatted notes
 */
export function notesToMarkdown(notes, topic) {
    let markdown = `# ${notes.title || `${topic} Notes`}\n\n`;
    markdown += `*Generated on: ${new Date().toLocaleString()}*\n\n`;
    markdown += `---\n\n`;
    
    // Overview
    if (notes.overview) {
        markdown += `## 📌 Overview\n\n`;
        markdown += `${notes.overview}\n\n`;
    }
    
    // Key Concepts
    if (notes.key_concepts && notes.key_concepts.length > 0) {
        markdown += `## 🎯 Key Concepts\n\n`;
        notes.key_concepts.forEach(concept => {
            markdown += `- ${concept}\n`;
        });
        markdown += `\n`;
    }
    
    // Code Examples
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
    
    // Best Practices
    if (notes.best_practices && notes.best_practices.length > 0) {
        markdown += `## ✅ Best Practices\n\n`;
        notes.best_practices.forEach(practice => {
            markdown += `- ${practice}\n`;
        });
        markdown += `\n`;
    }
    
    // Common Mistakes
    if (notes.common_mistakes && notes.common_mistakes.length > 0) {
        markdown += `## ⚠️ Common Mistakes to Avoid\n\n`;
        notes.common_mistakes.forEach(mistake => {
            markdown += `- ${mistake}\n`;
        });
        markdown += `\n`;
    }
    
    markdown += `---\n`;
    markdown += `*Generated by Flashnotes AI*\n`;
    
    return markdown;
}

/**
 * Validate notes data structure
 * @param {Object} notes - Notes object to validate
 * @returns {boolean} Is valid
 */
export function validateNotesData(notes) {
    if (!notes) return false;
    if (!notes.title && !notes.overview) return false;
    return true;
}

/**
 * Get difficulty color class
 * @param {string} difficulty - beginner, intermediate, advanced
 * @returns {string} CSS class
 */
export function getDifficultyColor(difficulty) {
    switch (difficulty?.toLowerCase()) {
        case 'beginner':
            return 'text-green-400 bg-green-500/20';
        case 'intermediate':
            return 'text-yellow-400 bg-yellow-500/20';
        case 'advanced':
            return 'text-red-400 bg-red-500/20';
        default:
            return 'text-blue-400 bg-blue-500/20';
    }
}

/**
 * Get difficulty icon
 * @param {string} difficulty - beginner, intermediate, advanced
 * @returns {string} Emoji icon
 */
export function getDifficultyIcon(difficulty) {
    switch (difficulty?.toLowerCase()) {
        case 'beginner':
            return '🌱';
        case 'intermediate':
            return '⚡';
        case 'advanced':
            return '🚀';
        default:
            return '📚';
    }
}

/**
 * Escape HTML special characters
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Generate plain text summary of notes
 * @param {Object} notes - Notes object
 * @param {number} maxLength - Maximum length
 * @returns {string} Plain text summary
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

export default {
    formatNotesToHTML,
    notesToMarkdown,
    validateNotesData,
    getDifficultyColor,
    getDifficultyIcon,
    getNotesSummary
};