// frontend/src/utils/constants.js
// Application constants with all routes and configurations

// ============= APP INFORMATION =============
export const APP_NAME = 'Flashnotes';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'AI-Powered Learning Companion';
export const APP_URL = 'https://flashnotes.app';
export const APP_SUPPORT_EMAIL = 'support@flashnotes.app';

// ============= COLOR SCHEME =============
export const COLORS = {
    background: '#111827',
    card: '#1F2937',
    primary: '#3B82F6',
    primaryDark: '#2563EB',
    primaryLight: '#60A5FA',
    secondary: '#60A5FA',
    text: '#E5E7EB',
    textMuted: '#9CA3AF',
    accent: '#A78BFA',
    accentDark: '#8B5CF6',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6'
};

// ============= ROUTES - COMPLETE =============
export const ROUTES = {
    // Public Routes
    HOME: '/',
    WELCOME: '/welcome',
    REGISTER: '/register',
    LOGIN: '/login',
    VERIFY_OTP: '/verify-otp',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    
    // Protected Routes
    DASHBOARD: '/dashboard',
    HISTORY: '/history',
    SAVED: '/saved',
    QUIZ: '/quiz',
    QUIZ_ATTEMPT: '/quiz/:id/attempt',
    QUIZ_RESULT: '/quiz/result/:id',
    SCORE: '/score',
    PROFILE: '/profile',
    SETTINGS: '/settings',
    NOTIFICATIONS: '/notifications',
    
    // Admin Routes
    ADMIN: '/admin',
    ADMIN_USERS: '/admin/users',
    ADMIN_QUIZZES: '/admin/quizzes',
    ADMIN_ANALYTICS: '/admin/analytics'
};

// ============= API ENDPOINTS =============
export const API_ENDPOINTS = {
    AUTH: {
        REGISTER: '/auth/register',
        LOGIN: '/auth/login',
        VERIFY: '/auth/verify-otp',
        RESEND_OTP: '/auth/resend-otp',
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password',
        LOGOUT: '/auth/logout',
        REFRESH: '/auth/refresh',
        SOCIAL_LOGIN: '/auth/social'
    },
    USER: {
        PROFILE: '/user/profile',
        UPDATE: '/user/update',
        DELETE: '/user/delete',
        STATS: '/user/stats',
        SETTINGS: '/user/settings'
    },
    NOTES: {
        GET_ALL: '/notes',
        GET_BY_ID: '/notes/:id',
        SAVE: '/notes',
        UPDATE: '/notes/:id',
        DELETE: '/notes/:id',
        BULK_DELETE: '/notes/bulk'
    },
    HISTORY: {
        GET_ALL: '/history',
        ADD: '/history',
        CLEAR: '/history',
        DELETE: '/history/:id'
    },
    AI: {
        GENERATE: '/ai/generate',
        SUGGEST: '/ai/suggest',
        CHAT: '/ai/chat',
        EXPLAIN: '/ai/explain',
        SUMMARIZE: '/ai/summarize'
    },
    QUIZ: {
        GET_ALL: '/quiz',
        GET_BY_ID: '/quiz/:id',
        GET_QUESTIONS: '/quiz/:id/questions',
        START: '/quiz/:id/start',
        SUBMIT: '/quiz/:id/submit',
        RESULTS: '/quiz/results/:id',
        ATTEMPTS: '/quiz/attempts',
        LEADERBOARD: '/quiz/leaderboard',
        RECOMMENDATIONS: '/quiz/recommendations'
    },
    SCORE: {
        GET: '/score',
        STATS: '/score/stats',
        HISTORY: '/score/history',
        ACHIEVEMENTS: '/score/achievements',
        LEADERBOARD: '/score/leaderboard',
        RANKING: '/score/ranking'
    },
    NOTIFICATIONS: {
        GET_ALL: '/notifications',
        MARK_READ: '/notifications/read/:id',
        MARK_ALL_READ: '/notifications/read-all',
        DELETE: '/notifications/:id',
        CLEAR_ALL: '/notifications/clear',
        SETTINGS: '/notifications/settings'
    },
    ACHIEVEMENTS: {
        GET_ALL: '/achievements',
        GET_USER: '/achievements/user',
        CLAIM: '/achievements/claim/:id'
    }
};

// ============= STORAGE KEYS =============
export const STORAGE_KEYS = {
    // Auth
    AUTH_TOKEN: 'authToken',
    USER: 'user',
    USER_ID: 'userId',
    USER_NAME: 'userName',
    USER_EMAIL: 'userEmail',
    USER_AVATAR: 'userAvatar',
    USER_BIO: 'userBio',
    USER_LOCATION: 'userLocation',
    USER_WEBSITE: 'userWebsite',
    IS_AUTHENTICATED: 'isAuthenticated',
    
    // Data
    NOTES: 'flashnotes_notes',
    HISTORY: 'flashnotes_history',
    NOTIFICATIONS: 'flashnotes_notifications',
    NOTIFICATION_COUNT: 'notificationCount',
    
    // Pending & Sync
    PENDING_NOTES: 'flashnotes_pending_notes',
    PENDING_HISTORY: 'flashnotes_pending_history',
    SYNC_QUEUE: 'flashnotes_sync_queue',
    LAST_SYNC: 'flashnotes_last_sync',
    
    // User Preferences
    THEME: 'flashnotes_theme',
    LANGUAGE: 'flashnotes_language',
    TIMEZONE: 'flashnotes_timezone',
    SIDEBAR_COLLAPSED: 'sidebarCollapsed',
    DARK_MODE: 'darkMode',
    EMAIL_NOTIFICATIONS: 'emailNotifications',
    SOUND_EFFECTS: 'soundEffects',
    
    // Quiz
    QUIZ_CACHE: 'quiz_cache',
    QUESTIONS_CACHE: 'questions_cache',
    ATTEMPTS_CACHE: 'attempts_cache',
    PENDING_QUIZ_SUBMISSIONS: 'pendingQuizSubmissions',
    OFFLINE_QUIZ_ATTEMPTS: 'offlineQuizAttempts',
    
    // Misc
    PENDING_USER: 'pendingUser',
    REMEMBERED_EMAIL: 'rememberedEmail',
    MEMBER_SINCE: 'memberSince',
    NOTIFICATION_PERMISSION: 'notificationPermission',
    
    // Chat
    AI_CHAT_OPEN: 'aiChatOpen',
    AI_CHAT_HISTORY: 'aiChatHistory'
};

// ============= QUIZ CONFIGURATION =============
export const QUIZ_CONFIG = {
    DEFAULT_TIME_LIMIT: 15, // minutes
    DEFAULT_QUESTIONS: 10,
    PASSING_SCORE: 70,
    MAX_RETRIES: 3,
    TIME_WARNING: 60, // seconds before warning
    AUTO_SUBMIT: true,
    SHOW_ANSWERS: true,
    ENABLE_REVIEW: true
};

// ============= ACHIEVEMENTS =============
export const ACHIEVEMENTS = [
    {
        id: 'first_quiz',
        name: 'First Steps',
        description: 'Complete your first quiz',
        icon: '🎯',
        points: 10,
        condition: { type: 'quizzes_completed', count: 1 }
    },
    {
        id: 'quiz_master',
        name: 'Quiz Master',
        description: 'Complete 10 quizzes',
        icon: '🏆',
        points: 50,
        condition: { type: 'quizzes_completed', count: 10 }
    },
    {
        id: 'perfect_score',
        name: 'Perfect Score',
        description: 'Get 100% on any quiz',
        icon: '⭐',
        points: 100,
        condition: { type: 'perfect_score', count: 1 }
    },
    {
        id: 'streak_7',
        name: '7 Day Streak',
        description: 'Maintain a 7-day learning streak',
        icon: '🔥',
        points: 75,
        condition: { type: 'streak', days: 7 }
    },
    {
        id: 'speed_demon',
        name: 'Speed Demon',
        description: 'Complete a quiz in under 5 minutes',
        icon: '⚡',
        points: 40,
        condition: { type: 'speed_run', minutes: 5 }
    },
    {
        id: 'topic_expert',
        name: 'Topic Expert',
        description: 'Score 90%+ on 5 different topics',
        icon: '📚',
        points: 80,
        condition: { type: 'topics_mastered', count: 5 }
    },
    {
        id: 'note_keeper',
        name: 'Note Keeper',
        description: 'Save 20 notes',
        icon: '📝',
        points: 30,
        condition: { type: 'notes_saved', count: 20 }
    },
    {
        id: 'ai_chatter',
        name: 'AI Chatter',
        description: 'Have 50 conversations with AI assistant',
        icon: '🤖',
        points: 60,
        condition: { type: 'ai_chats', count: 50 }
    }
];

// ============= DEFAULT TOPICS =============
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
    'Web Development',
    'Cloud Computing',
    'Cybersecurity',
    'Blockchain',
    'DevOps',
    'React',
    'Node.js',
    'Docker',
    'Kubernetes'
];

// ============= OTP CONFIGURATION =============
export const OTP_CONFIG = {
    LENGTH: 6,
    EXPIRY_MINUTES: 10,
    RESEND_COOLDOWN: 30, // seconds
    MAX_ATTEMPTS: 5
};

// ============= ERROR MESSAGES =============
export const ERROR_MESSAGES = {
    // General
    GENERIC: 'Something went wrong. Please try again.',
    NETWORK: 'Network error. Please check your connection.',
    TIMEOUT: 'Request timed out. Please try again.',
    UNAUTHORIZED: 'Please log in to continue.',
    FORBIDDEN: 'You do not have permission to access this resource.',
    NOT_FOUND: 'The requested resource was not found.',
    
    // Validation
    VALIDATION: 'Please check your input and try again.',
    INVALID_EMAIL: 'Please enter a valid email address.',
    INVALID_PASSWORD: 'Password must be at least 8 characters with uppercase, lowercase, and numbers.',
    PASSWORDS_DO_NOT_MATCH: 'Passwords do not match.',
    REQUIRED_FIELD: 'This field is required.',
    
    // Auth
    REGISTRATION_FAILED: 'Registration failed. Please try again.',
    LOGIN_FAILED: 'Invalid email or password.',
    OTP_INVALID: 'Invalid OTP. Please try again.',
    OTP_EXPIRED: 'OTP has expired. Please request a new one.',
    EMAIL_IN_USE: 'This email is already registered.',
    WEAK_PASSWORD: 'Password must be at least 8 characters long.',
    
    // Quiz
    QUIZ_NOT_FOUND: 'Quiz not found.',
    QUIZ_ALREADY_SUBMITTED: 'This quiz has already been submitted.',
    QUIZ_EXPIRED: 'Quiz time has expired.',
    NO_QUESTIONS: 'No questions found for this quiz.',
    QUIZ_SUBMIT_FAILED: 'Failed to submit quiz. Please try again.',
    
    // Notes
    NOTE_NOT_FOUND: 'Note not found.',
    NOTE_SAVE_FAILED: 'Failed to save note.',
    NOTE_DELETE_FAILED: 'Failed to delete note.',
    
    // AI
    AI_RESPONSE_FAILED: 'Failed to get AI response. Please try again.',
    AI_TIMEOUT: 'AI is taking too long. Please try again.',
    
    // Offline
    OFFLINE_MODE: 'You are offline. Changes will sync when back online.',
    SYNC_FAILED: 'Failed to sync data. Will retry later.'
};

// ============= SUCCESS MESSAGES =============
export const SUCCESS_MESSAGES = {
    // Auth
    REGISTERED: 'Registration successful! Please check your email for OTP.',
    VERIFIED: 'Email verified successfully!',
    LOGGED_IN: 'Login successful!',
    LOGGED_OUT: 'Logged out successfully.',
    PASSWORD_RESET: 'Password reset successful!',
    
    // Notes
    NOTE_SAVED: 'Note saved successfully!',
    NOTE_DELETED: 'Note deleted successfully!',
    NOTES_CLEARED: 'All notes cleared successfully!',
    
    // Quiz
    QUIZ_STARTED: 'Quiz started! Good luck!',
    QUIZ_SUBMITTED: 'Quiz submitted successfully!',
    QUIZ_COMPLETED: 'Quiz completed! Check your score.',
    
    // Profile
    PROFILE_UPDATED: 'Profile updated successfully!',
    AVATAR_UPLOADED: 'Avatar uploaded successfully!',
    
    // Settings
    SETTINGS_SAVED: 'Settings saved successfully!',
    NOTIFICATIONS_CLEARED: 'All notifications marked as read.',
    
    // Data
    DATA_EXPORTED: 'Data exported successfully!',
    DATA_IMPORTED: 'Data imported successfully!',
    DATA_SYNCED: 'Data synced successfully!',
    
    // Achievements
    ACHIEVEMENT_EARNED: 'Achievement unlocked! 🎉',
    ACHIEVEMENT_CLAIMED: 'Achievement reward claimed!'
};

// ============= CONFIGURATION =============
export const APP_CONFIG = {
    // Features
    ENABLE_OFFLINE_MODE: true,
    ENABLE_PUSH_NOTIFICATIONS: true,
    ENABLE_SOUND_EFFECTS: true,
    ENABLE_ANIMATIONS: true,
    ENABLE_AI_CHAT: true,
    ENABLE_SOCIAL_LOGIN: false,
    
    // Limits
    MAX_NOTES: 1000,
    MAX_HISTORY: 100,
    MAX_QUIZ_ATTEMPTS: 10,
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    
    // Cache
    CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
    SYNC_INTERVAL: 60 * 1000, // 1 minute
    
    // Pagination
    PAGE_SIZE: 20,
    INFINITE_SCROLL_THRESHOLD: 200, // pixels
    
    // Animation
    ANIMATION_DURATION: 300, // milliseconds
    TRANSITION_TIMING: 'cubic-bezier(0.4, 0, 0.2, 1)'
};

// ============= LOCALIZATION =============
export const LANGUAGES = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
    { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
    { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' }
];

export const DEFAULT_LANGUAGE = 'en';

// ============= THEMES =============
export const THEMES = {
    DARK: 'dark',
    LIGHT: 'light',
    SYSTEM: 'system'
};

// ============= TIMEZONES =============
export const TIMEZONES = [
    { value: 'IST', label: 'IST (UTC+5:30)', offset: '+5:30' },
    { value: 'EST', label: 'EST (UTC-5)', offset: '-5:00' },
    { value: 'PST', label: 'PST (UTC-8)', offset: '-8:00' },
    { value: 'GMT', label: 'GMT (UTC+0)', offset: '+0:00' },
    { value: 'CET', label: 'CET (UTC+1)', offset: '+1:00' },
    { value: 'JST', label: 'JST (UTC+9)', offset: '+9:00' },
    { value: 'AEST', label: 'AEST (UTC+10)', offset: '+10:00' }
];

// ============= REGEX PATTERNS =============
export const REGEX = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
    USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
    URL: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
    PHONE: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
};

// ============= EXPORT CONSTANTS =============
export default {
    APP_NAME,
    APP_VERSION,
    APP_DESCRIPTION,
    COLORS,
    ROUTES,
    API_ENDPOINTS,
    STORAGE_KEYS,
    QUIZ_CONFIG,
    ACHIEVEMENTS,
    QUICK_TOPICS,
    OTP_CONFIG,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
    APP_CONFIG,
    LANGUAGES,
    THEMES,
    TIMEZONES,
    REGEX
};