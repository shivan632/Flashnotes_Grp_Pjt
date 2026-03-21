// frontend/src/utils/helpers.js
// Helper utility functions - Enhanced version

// ============= DATE FORMATTING =============

// Format date with multiple options
export function formatDate(date, format = 'short') {
    const d = new Date(date);
    
    if (isNaN(d.getTime())) {
        console.warn('Invalid date:', date);
        return 'Invalid date';
    }
    
    const formats = {
        short: () => d.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        }),
        long: () => d.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }),
        time: () => d.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        }),
        full: () => d.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }),
        relative: () => getRelativeTime(d),
        iso: () => d.toISOString(),
        timestamp: () => d.getTime()
    };
    
    return formats[format] ? formats[format]() : formats.short();
}

// Get relative time (e.g., "5 minutes ago")
export function getRelativeTime(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    const diffWeek = Math.floor(diffDay / 7);
    const diffMonth = Math.floor(diffDay / 30);
    const diffYear = Math.floor(diffDay / 365);
    
    if (diffSec < 60) return 'just now';
    if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
    if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
    if (diffWeek < 4) return `${diffWeek} week${diffWeek > 1 ? 's' : ''} ago`;
    if (diffMonth < 12) return `${diffMonth} month${diffMonth > 1 ? 's' : ''} ago`;
    return `${diffYear} year${diffYear > 1 ? 's' : ''} ago`;
}

// Format time duration (seconds to mm:ss)
export function formatDuration(seconds) {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Format number with K, M, B suffixes
export function formatNumber(num) {
    if (num === undefined || num === null) return '0';
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toString();
}

// ============= TEXT MANIPULATION =============

// Truncate text with ellipsis
export function truncateText(text, maxLength = 100, ellipsis = '...') {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + ellipsis;
}

// Capitalize first letter of each word
export function capitalizeWords(str) {
    if (!str) return '';
    return str.replace(/\b\w/g, char => char.toUpperCase());
}

// Convert to camel case
export function toCamelCase(str) {
    return str.replace(/([-_][a-z])/g, group => group.toUpperCase().replace('-', '').replace('_', ''));
}

// Convert to kebab case
export function toKebabCase(str) {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

// Escape HTML special characters
export function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Unescape HTML
export function unescapeHtml(html) {
    if (!html) return '';
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent;
}

// ============= STRING UTILITIES =============

// Generate unique ID
export function generateId(prefix = 'id') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Generate random string
export function randomString(length = 8) {
    return Math.random().toString(36).substring(2, 2 + length);
}

// Check if string is empty or whitespace
export function isEmpty(str) {
    return !str || /^\s*$/.test(str);
}

// ============= VALIDATION =============

// Validate email
export function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

// Validate password strength
export function isStrongPassword(password) {
    if (!password || password.length < 8) return false;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return hasUpperCase && hasLowerCase && hasNumbers && hasSpecial;
}

// Validate URL
export function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

// Validate phone number
export function isValidPhone(phone) {
    const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return re.test(phone);
}

// ============= NAME UTILITIES =============

// Get initials from name
export function getInitials(name, maxLength = 2) {
    if (!name) return 'U';
    const words = name.trim().split(/\s+/);
    let initials = words.map(word => word[0]).join('').toUpperCase();
    return initials.substring(0, maxLength);
}

// Get random color from name (for avatars)
export function getColorFromName(name) {
    if (!name) return '#3B82F6';
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = ['#3B82F6', '#60A5FA', '#A78BFA', '#10B981', '#F59E0B', '#EF4444'];
    return colors[Math.abs(hash) % colors.length];
}

// ============= CLIPBOARD & DOWNLOAD =============

// Copy to clipboard with fallback
export async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Failed to copy:', err);
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textarea);
        return success;
    }
}

// Download as file
export function downloadAsFile(content, filename, type = 'text/plain') {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Download as JSON
export function downloadAsJSON(data, filename) {
    const json = JSON.stringify(data, null, 2);
    downloadAsFile(json, filename, 'application/json');
}

// ============= URL & ROUTING =============

// Parse query parameters
export function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    for (const [key, value] of params) {
        result[key] = value;
    }
    return result;
}

// Build query string from object
export function buildQueryString(params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, value);
        }
    });
    return searchParams.toString();
}

// Update URL without reload
export function updateUrlParams(params) {
    const url = new URL(window.location.href);
    Object.entries(params).forEach(([key, value]) => {
        if (value) {
            url.searchParams.set(key, value);
        } else {
            url.searchParams.delete(key);
        }
    });
    window.history.pushState({}, '', url);
}

// ============= SCROLL & VIEWPORT =============

// Scroll to element smoothly
export function scrollToElement(elementId, offset = 0, behavior = 'smooth') {
    const element = document.getElementById(elementId);
    if (element) {
        const y = element.getBoundingClientRect().top + window.pageYOffset + offset;
        window.scrollTo({ top: y, behavior });
        return true;
    }
    return false;
}

// Check if element is in viewport
export function isInViewport(element, offset = 0) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top + offset >= 0 &&
        rect.left >= 0 &&
        rect.bottom - offset <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ============= DEVICE & BROWSER =============

// Detect mobile device
export function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Detect touch device
export function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

// Get browser name
export function getBrowserName() {
    const ua = navigator.userAgent;
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    return 'Unknown';
}

// ============= THEME & STORAGE =============

// Get theme from localStorage
export function getTheme() {
    return localStorage.getItem('theme') || 'dark';
}

// Set theme
export function setTheme(theme) {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

// Get language
export function getLanguage() {
    return localStorage.getItem('language') || 'en';
}

// ============= PERFORMANCE =============

// Debounce function
export function debounce(func, wait, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
        const context = this;
        const later = () => {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Throttle function
export function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Sleep/delay function
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ============= OBJECT & ARRAY =============

// Deep clone object
export function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

// Check if object is empty
export function isEmptyObject(obj) {
    return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
}

// Group array by key
export function groupBy(array, key) {
    return array.reduce((result, item) => {
        const groupKey = item[key];
        if (!result[groupKey]) result[groupKey] = [];
        result[groupKey].push(item);
        return result;
    }, {});
}

// Sort array by key
export function sortBy(array, key, order = 'asc') {
    return [...array].sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];
        if (order === 'asc') return aVal > bVal ? 1 : -1;
        return aVal < bVal ? 1 : -1;
    });
}

// ============= COLOR UTILITIES =============

// Lighten color
export function lightenColor(color, percent) {
    // Simple implementation - can be expanded
    return color;
}

// Darken color
export function darkenColor(color, percent) {
    return color;
}

// ============= EXPORT =============
export default {
    formatDate,
    getRelativeTime,
    formatDuration,
    formatNumber,
    truncateText,
    capitalizeWords,
    toCamelCase,
    toKebabCase,
    escapeHtml,
    unescapeHtml,
    generateId,
    randomString,
    isEmpty,
    isValidEmail,
    isStrongPassword,
    isValidUrl,
    isValidPhone,
    getInitials,
    getColorFromName,
    copyToClipboard,
    downloadAsFile,
    downloadAsJSON,
    getQueryParams,
    buildQueryString,
    updateUrlParams,
    scrollToElement,
    isInViewport,
    isMobileDevice,
    isTouchDevice,
    getBrowserName,
    getTheme,
    setTheme,
    getLanguage,
    debounce,
    throttle,
    sleep,
    deepClone,
    isEmptyObject,
    groupBy,
    sortBy
};