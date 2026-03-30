// frontend/src/utils/roadmapHelpers.js
// Helper functions for roadmap feature

/**
 * Format date for display
 * @param {string} dateString - ISO date string
 */
export function formatRoadmapDate(dateString) {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

/**
 * Get difficulty badge class
 * @param {string} difficulty - beginner, intermediate, advanced
 */
export function getDifficultyClass(difficulty) {
    switch (difficulty?.toLowerCase()) {
        case 'beginner':
            return 'bg-green-500/20 text-green-400 border-green-500/30';
        case 'intermediate':
            return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
        case 'advanced':
            return 'bg-red-500/20 text-red-400 border-red-500/30';
        default:
            return 'bg-[#374151] text-[#9CA3AF] border-[#374151]';
    }
}

/**
 * Get difficulty icon
 * @param {string} difficulty - beginner, intermediate, advanced
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
 * Get difficulty text
 * @param {string} difficulty - beginner, intermediate, advanced
 */
export function getDifficultyText(difficulty) {
    switch (difficulty?.toLowerCase()) {
        case 'beginner':
            return 'Beginner';
        case 'intermediate':
            return 'Intermediate';
        case 'advanced':
            return 'Advanced';
        default:
            return difficulty || 'Standard';
    }
}

/**
 * Truncate text
 * @param {string} text - Text to truncate
 * @param {number} length - Max length
 */
export function truncateText(text, length = 100) {
    if (!text) return '';
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
}

/**
 * Download image from URL
 * @param {string} url - Image URL
 * @param {string} filename - Download filename
 */
export function downloadImage(url, filename) {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 */
export async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        console.error('Copy failed:', error);
        return false;
    }
}

export default {
    formatRoadmapDate,
    getDifficultyClass,
    getDifficultyIcon,
    getDifficultyText,
    truncateText,
    downloadImage,
    copyToClipboard
};