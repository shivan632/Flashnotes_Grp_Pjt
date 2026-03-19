// frontend/src/utils/constants.js
// Application constants with all routes

// App information
export const APP_NAME = 'Flashnotes';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'AI-Powered Learning Companion';

// Color scheme (matching Tailwind config)
export const COLORS = {
    background: '#111827',
    card: '#1F2937',
    primary: '#3B82F6',
    secondary: '#60A5FA',
    text: '#E5E7EB',
    accent: '#A78BFA',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444'
};

// Routes - COMPLETE WITH ALL NEW ROUTES
export const ROUTES = {
    HOME: '/',
    WELCOME: '/welcome',
    REGISTER: '/register',
    LOGIN: '/login',
    VERIFY_OTP: '/verify-otp',
    DASHBOARD: '/dashboard',
    HISTORY: '/history',
    SAVED: '/saved',
    QUIZ: '/quiz',
    QUIZ_ATTEMPT: '/quiz/:id/attempt',  // NEW
    QUIZ_RESULT: '/quiz/result/:id',     // NEW
    SCORE: '/score',
    PROFILE: '/profile',
    SETTINGS: '/settings',
    NOTIFICATIONS: '/notifications'
};

// Local storage keys
export const STORAGE_KEYS = {
    AUTH: 'flashnotes_auth',
    USER: 'flashnotes_user',
    PENDING_USER: 'pendingUser',
    NOTES: 'flashnotes_notes',
    HISTORY: 'flashnotes_history',
    THEME: 'flashnotes_theme',
    SIDEBAR: 'sidebarCollapsed',
    NOTIFICATION_COUNT: 'notificationCount'
};

// API endpoints (for future backend)
export const API_ENDPOINTS = {
    AUTH: {
        REGISTER: '/auth/register',
        LOGIN: '/auth/login',
        VERIFY: '/auth/verify',
        RESEND_OTP: '/auth/resend-otp',
        LOGOUT: '/auth/logout',
        REFRESH: '/auth/refresh'
    },
    USER: {
        PROFILE: '/user/profile',
        UPDATE: '/user/update',
        DELETE: '/user/delete'
    },
    NOTES: {
        GET_ALL: '/notes',
        SAVE: '/notes/save',
        DELETE: '/notes/delete',
        UPDATE: '/notes/update'
    },
    HISTORY: {
        GET_ALL: '/history',
        CLEAR: '/history/clear'
    },
    AI: {
        GENERATE: '/ai/generate',
        SUGGEST: '/ai/suggest',
        CHAT: '/ai/chat'
    },
    QUIZ: {
        GET_ALL: '/quiz',
        START: '/quiz/start',
        SUBMIT: '/quiz/submit',
        RESULTS: '/quiz/results'
    },
    SCORE: {
        GET: '/score',
        LEADERBOARD: '/score/leaderboard'
    },
    NOTIFICATIONS: {
        GET_ALL: '/notifications',
        MARK_READ: '/notifications/read',
        MARK_ALL_READ: '/notifications/read-all'
    }
};

// Default topics for quick suggestions
export const QUICK_TOPICS = [
    'Operating System',
    'Database',
    'Python',
    'JavaScript',
    'Machine Learning',
    'Artificial Intelligence',
    'Data Structures',
    'Algorithms',
    'Computer Networks',
    'Web Development'
];

// OTP configuration
export const OTP_CONFIG = {
    LENGTH: 6,
    EXPIRY_MINUTES: 10,
    RESEND_COOLDOWN: 30 // seconds
};

// Error messages
export const ERROR_MESSAGES = {
    GENERIC: 'Something went wrong. Please try again.',
    NETWORK: 'Network error. Please check your connection.',
    UNAUTHORIZED: 'Please log in to continue.',
    NOT_FOUND: 'The requested resource was not found.',
    VALIDATION: 'Please check your input and try again.',
    REGISTRATION_FAILED: 'Registration failed. Please try again.',
    LOGIN_FAILED: 'Invalid email or password.',
    OTP_INVALID: 'Invalid OTP. Please try again.',
    OTP_EXPIRED: 'OTP has expired. Please request a new one.',
    EMAIL_IN_USE: 'This email is already registered.',
    WEAK_PASSWORD: 'Password must be at least 8 characters long.'
};

// Success messages
export const SUCCESS_MESSAGES = {
    REGISTERED: 'Registration successful! Please check your email for OTP.',
    VERIFIED: 'Email verified successfully!',
    LOGGED_IN: 'Login successful!',
    LOGGED_OUT: 'Logged out successfully.',
    NOTE_SAVED: 'Note saved successfully!',
    NOTE_DELETED: 'Note deleted successfully.',
    PROFILE_UPDATED: 'Profile updated successfully.',
    QUIZ_COMPLETED: 'Quiz completed! Check your score.',
    NOTIFICATIONS_CLEARED: 'All notifications marked as read.'
};