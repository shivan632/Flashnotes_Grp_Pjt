// src/utils/navigation.js
export function setupNavigation() {
    // Handle all internal navigation links with hash
    document.querySelectorAll('a[href^="#/"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            window.location.hash = href;
        });
    });
}

// Helper function to navigate programmatically
export function navigateTo(path) {
    window.location.hash = path;
}