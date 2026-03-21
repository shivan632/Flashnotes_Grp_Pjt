// src/utils/navigation.js
// Navigation utility with enhanced features

// ============= NAVIGATION SETUP =============

export function setupNavigation() {
    // Handle all internal navigation links with hash
    document.querySelectorAll('a[href^="#/"]').forEach(link => {
        // Remove existing listeners to prevent duplicates
        const newLink = link.cloneNode(true);
        link.parentNode.replaceChild(newLink, link);
        
        newLink.addEventListener('click', (e) => {
            e.preventDefault();
            const href = newLink.getAttribute('href');
            navigateTo(href);
            
            // Add click animation to the link
            newLink.classList.add('scale-95');
            setTimeout(() => {
                newLink.classList.remove('scale-95');
            }, 150);
        });
    });
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
        handleRouteChange();
    });
    
    // Initial route handling
    handleRouteChange();
}

// ============= CORE NAVIGATION FUNCTIONS =============

// Helper function to navigate programmatically
export function navigateTo(path, options = {}) {
    const { replace = false, state = {} } = options;
    
    if (replace) {
        window.location.replace(path);
    } else {
        window.location.hash = path;
    }
    
    // Scroll to top on navigation (optional)
    if (options.scrollToTop !== false) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Dispatch custom event for other parts of the app
    const navigationEvent = new CustomEvent('navigation', {
        detail: { path, replace, state }
    });
    window.dispatchEvent(navigationEvent);
}

// Get current route path
export function getCurrentPath() {
    let path = window.location.hash.slice(1) || '/';
    if (path.endsWith('/') && path.length > 1) {
        path = path.slice(0, -1);
    }
    return path;
}

// Check if current path matches given path
export function isActivePath(path) {
    return getCurrentPath() === path;
}

// Get route parameters from pattern
export function getRouteParams(pattern, path) {
    const patternParts = pattern.split('/');
    const pathParts = path.split('/');
    const params = {};
    
    for (let i = 0; i < patternParts.length; i++) {
        if (patternParts[i].startsWith(':')) {
            const paramName = patternParts[i].slice(1);
            params[paramName] = pathParts[i];
        }
    }
    
    return params;
}

// ============= ROUTE HANDLERS =============

// Handle route change
function handleRouteChange() {
    const path = getCurrentPath();
    
    // Update active navigation links
    updateActiveLinks(path);
    
    // Dispatch route change event
    const routeEvent = new CustomEvent('routechange', {
        detail: { path }
    });
    window.dispatchEvent(routeEvent);
}

// Update active state of navigation links
function updateActiveLinks(currentPath) {
    document.querySelectorAll('.nav-link, .sidebar-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href) {
            const linkPath = href.replace('#', '');
            if (linkPath === currentPath || 
                (currentPath === '/' && linkPath === '') ||
                (linkPath === currentPath + '/')) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            } else {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
            }
        }
    });
}

// ============= ROUTE GUARDS =============

// Check if route requires authentication
export function requiresAuth(path) {
    const protectedRoutes = [
        '/dashboard',
        '/history',
        '/saved',
        '/quiz',
        '/score',
        '/profile',
        '/settings',
        '/notifications'
    ];
    
    return protectedRoutes.some(route => path.startsWith(route));
}

// Check if route is public
export function isPublicRoute(path) {
    const publicRoutes = [
        '/',
        '/welcome',
        '/login',
        '/register',
        '/verify-otp',
        '/forgot-password',
        '/reset-password'
    ];
    
    return publicRoutes.includes(path);
}

// Redirect if not authenticated
export function redirectIfNotAuthenticated() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const currentPath = getCurrentPath();
    
    if (!isAuthenticated && requiresAuth(currentPath)) {
        navigateTo('/login');
        return false;
    }
    return true;
}

// Redirect if already authenticated
export function redirectIfAuthenticated() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const currentPath = getCurrentPath();
    
    if (isAuthenticated && !requiresAuth(currentPath) && currentPath !== '/') {
        navigateTo('/dashboard');
        return true;
    }
    return false;
}

// ============= HISTORY MANAGEMENT =============

// Navigation history stack
let historyStack = [];
let currentIndex = -1;

// Initialize history
export function initHistory() {
    const initialPath = getCurrentPath();
    historyStack = [initialPath];
    currentIndex = 0;
}

// Add to history
export function pushToHistory(path) {
    // Remove forward history if we navigated back
    if (currentIndex < historyStack.length - 1) {
        historyStack = historyStack.slice(0, currentIndex + 1);
    }
    
    historyStack.push(path);
    currentIndex++;
}

// Go back
export function goBack() {
    if (currentIndex > 0) {
        currentIndex--;
        const previousPath = historyStack[currentIndex];
        navigateTo(previousPath, { replace: true });
    } else {
        // Fallback to browser back
        window.history.back();
    }
}

// Go forward
export function goForward() {
    if (currentIndex < historyStack.length - 1) {
        currentIndex++;
        const nextPath = historyStack[currentIndex];
        navigateTo(nextPath, { replace: true });
    } else {
        window.history.forward();
    }
}

// Get navigation history
export function getHistory() {
    return [...historyStack];
}

// ============= QUERY PARAMETERS =============

// Get query parameters from current URL
export function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    for (const [key, value] of params) {
        result[key] = value;
    }
    return result;
}

// Set query parameters without reload
export function setQueryParams(params, replace = false) {
    const url = new URL(window.location.href);
    
    Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === undefined) {
            url.searchParams.delete(key);
        } else {
            url.searchParams.set(key, value);
        }
    });
    
    if (replace) {
        window.history.replaceState({}, '', url);
    } else {
        window.history.pushState({}, '', url);
    }
}

// ============= UTILITY FUNCTIONS =============

// Reload current page
export function reloadPage() {
    window.location.reload();
}

// Replace current URL (no history entry)
export function replaceUrl(path) {
    window.location.replace(path);
}

// Scroll to hash element
export function scrollToHash() {
    const hash = window.location.hash;
    if (hash && hash !== '#') {
        const element = document.querySelector(hash);
        if (element) {
            setTimeout(() => {
                element.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }
}

// ============= EVENT LISTENERS =============

// Add navigation listener
export function addNavigationListener(callback) {
    window.addEventListener('navigation', (e) => {
        callback(e.detail);
    });
}

// Add route change listener
export function addRouteChangeListener(callback) {
    window.addEventListener('routechange', (e) => {
        callback(e.detail);
    });
}

// ============= EXPORTS =============
export default {
    setupNavigation,
    navigateTo,
    getCurrentPath,
    isActivePath,
    getRouteParams,
    requiresAuth,
    isPublicRoute,
    redirectIfNotAuthenticated,
    redirectIfAuthenticated,
    initHistory,
    pushToHistory,
    goBack,
    goForward,
    getHistory,
    getQueryParams,
    setQueryParams,
    reloadPage,
    replaceUrl,
    scrollToHash,
    addNavigationListener,
    addRouteChangeListener
};