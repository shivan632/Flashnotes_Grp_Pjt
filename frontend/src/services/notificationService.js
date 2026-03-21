// frontend/src/services/notificationService.js
// Notification Service - Complete notification management system


// Notification types
export const NOTIFICATION_TYPES = {
    QUIZ_COMPLETED: 'quiz',
    ACHIEVEMENT_EARNED: 'achievement',
    STUDY_REMINDER: 'reminder',
    AI_RESPONSE: 'ai',
    NEW_FEATURE: 'feature',
    SYSTEM_ALERT: 'system',
    STREAK_MILESTONE: 'streak',
    NOTE_SAVED: 'note',
    QUIZ_STARTED: 'quiz_start',
    PERFECT_SCORE: 'perfect'
};

// Notification priorities
export const NOTIFICATION_PRIORITIES = {
    LOW: 1,
    MEDIUM: 2,
    HIGH: 3,
    URGENT: 4
};

// Default notifications for new users
const DEFAULT_NOTIFICATIONS = [
    {
        id: 1,
        title: 'Welcome to Flashnotes!',
        message: 'Start your learning journey by generating your first Q&A',
        time: new Date().toISOString(),
        read: false,
        icon: '🎉',
        type: NOTIFICATION_TYPES.SYSTEM_ALERT,
        priority: NOTIFICATION_PRIORITIES.HIGH,
        action: '/dashboard',
        metadata: { welcome: true }
    },
    {
        id: 2,
        title: 'Take Your First Quiz',
        message: 'Test your knowledge with our interactive quizzes',
        time: new Date().toISOString(),
        read: false,
        icon: '📝',
        type: NOTIFICATION_TYPES.STUDY_REMINDER,
        priority: NOTIFICATION_PRIORITIES.MEDIUM,
        action: '/quiz',
        metadata: { suggested: true }
    },
    {
        id: 3,
        title: 'AI Assistant Ready',
        message: 'Chat with our AI to get personalized learning help',
        time: new Date().toISOString(),
        read: false,
        icon: '🤖',
        type: NOTIFICATION_TYPES.AI_RESPONSE,
        priority: NOTIFICATION_PRIORITIES.MEDIUM,
        action: '/dashboard',
        metadata: { feature: 'ai_chat' }
    }
];

// In-memory notification store
let notifications = [];
let listeners = [];
let unreadCount = 0;
let lastNotificationId = 0;

// Initialize notifications from localStorage
export function initNotifications() {
    try {
        const saved = localStorage.getItem('flashnotes_notifications');
        if (saved) {
            notifications = JSON.parse(saved);
            lastNotificationId = Math.max(...notifications.map(n => n.id), 0);
        } else {
            notifications = [...DEFAULT_NOTIFICATIONS];
            lastNotificationId = DEFAULT_NOTIFICATIONS.length;
            saveToLocalStorage();
        }
        updateUnreadCount();
    } catch (error) {
        console.error('Error initializing notifications:', error);
        notifications = [...DEFAULT_NOTIFICATIONS];
        lastNotificationId = DEFAULT_NOTIFICATIONS.length;
    }
}

// Save notifications to localStorage
function saveToLocalStorage() {
    try {
        localStorage.setItem('flashnotes_notifications', JSON.stringify(notifications));
        localStorage.setItem('notificationCount', unreadCount.toString());
    } catch (error) {
        console.error('Error saving notifications:', error);
    }
}

// Update unread count
function updateUnreadCount() {
    unreadCount = notifications.filter(n => !n.read).length;
    localStorage.setItem('notificationCount', unreadCount.toString());
    notifyListeners();
}

// Notify all listeners of changes
function notifyListeners() {
    listeners.forEach(listener => {
        try {
            listener(notifications, unreadCount);
        } catch (error) {
            console.error('Error in notification listener:', error);
        }
    });
}

// Add notification listener
export function addNotificationListener(callback) {
    listeners.push(callback);
    // Immediately call with current state
    callback(notifications, unreadCount);
    
    // Return unsubscribe function
    return () => {
        listeners = listeners.filter(l => l !== callback);
    };
}

// Create a new notification
export function createNotification(title, message, type, options = {}) {
    const {
        icon = getDefaultIcon(type),
        priority = NOTIFICATION_PRIORITIES.MEDIUM,
        action = null,
        metadata = {},
        duration = 5000,
        sound = true
    } = options;
    
    const notification = {
        id: ++lastNotificationId,
        title,
        message,
        time: new Date().toISOString(),
        read: false,
        icon,
        type,
        priority,
        action,
        metadata,
        duration,
        sound
    };
    
    notifications.unshift(notification);
    
    // Keep only last 100 notifications
    if (notifications.length > 100) {
        notifications = notifications.slice(0, 100);
    }
    
    saveToLocalStorage();
    updateUnreadCount();
    
    // Show toast notification if enabled
    if (options.showToast !== false) {
        showToastNotification(notification);
    }
    
    // Play sound if enabled
    if (sound && localStorage.getItem('soundEffects') !== 'false') {
        playNotificationSound();
    }
    
    return notification;
}

// Get default icon for notification type
function getDefaultIcon(type) {
    const icons = {
        [NOTIFICATION_TYPES.QUIZ_COMPLETED]: '📊',
        [NOTIFICATION_TYPES.ACHIEVEMENT_EARNED]: '🏆',
        [NOTIFICATION_TYPES.STUDY_REMINDER]: '⏰',
        [NOTIFICATION_TYPES.AI_RESPONSE]: '🤖',
        [NOTIFICATION_TYPES.NEW_FEATURE]: '✨',
        [NOTIFICATION_TYPES.SYSTEM_ALERT]: '⚠️',
        [NOTIFICATION_TYPES.STREAK_MILESTONE]: '🔥',
        [NOTIFICATION_TYPES.NOTE_SAVED]: '💾',
        [NOTIFICATION_TYPES.QUIZ_STARTED]: '🎯',
        [NOTIFICATION_TYPES.PERFECT_SCORE]: '⭐'
    };
    return icons[type] || '📬';
}

// Show toast notification (browser notification)
function showToastNotification(notification) {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `fixed bottom-4 right-4 bg-gradient-to-r from-[#1F2937] to-[#111827] border-l-4 border-[#3B82F6] rounded-lg shadow-2xl p-4 max-w-sm z-50 animate-slideInRight`;
    toast.innerHTML = `
        <div class="flex items-start gap-3">
            <div class="text-2xl">${notification.icon}</div>
            <div class="flex-1">
                <h4 class="font-semibold text-[#E5E7EB]">${escapeHtml(notification.title)}</h4>
                <p class="text-sm text-[#9CA3AF] mt-1">${escapeHtml(notification.message)}</p>
            </div>
            <button class="toast-close text-[#9CA3AF] hover:text-[#E5E7EB]">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Auto remove after duration
    const timeout = setTimeout(() => {
        toast.remove();
    }, notification.duration);
    
    // Close button
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        clearTimeout(timeout);
        toast.remove();
    });
    
    // Click to open action
    if (notification.action) {
        toast.style.cursor = 'pointer';
        toast.addEventListener('click', () => {
            window.location.hash = notification.action;
            toast.remove();
        });
    }
}

// Play notification sound
function playNotificationSound() {
    try {
        const audio = new Audio('/assets/sounds/notification.mp3');
        audio.volume = 0.3;
        audio.play().catch(e => console.log('Sound play failed:', e));
    } catch (error) {
        console.log('Sound not supported');
    }
}

// Get all notifications
export function getNotifications(filters = {}) {
    let filtered = [...notifications];
    
    if (filters.type) {
        filtered = filtered.filter(n => n.type === filters.type);
    }
    if (filters.read !== undefined) {
        filtered = filtered.filter(n => n.read === filters.read);
    }
    if (filters.minPriority) {
        filtered = filtered.filter(n => n.priority >= filters.minPriority);
    }
    
    return filtered;
}

// Get unread count
export function getUnreadCount() {
    return unreadCount;
}

// Mark notification as read
export function markAsRead(notificationId) {
    const notification = notifications.find(n => n.id === notificationId);
    if (notification && !notification.read) {
        notification.read = true;
        saveToLocalStorage();
        updateUnreadCount();
        return true;
    }
    return false;
}

// Mark all notifications as read
export function markAllAsRead() {
    notifications.forEach(n => {
        n.read = true;
    });
    saveToLocalStorage();
    updateUnreadCount();
}

// Delete notification
export function deleteNotification(notificationId) {
    const index = notifications.findIndex(n => n.id === notificationId);
    if (index !== -1) {
        notifications.splice(index, 1);
        saveToLocalStorage();
        updateUnreadCount();
        return true;
    }
    return false;
}

// Clear all notifications
export function clearAllNotifications() {
    notifications = [];
    saveToLocalStorage();
    updateUnreadCount();
}

// Create quiz completion notification
export function notifyQuizCompleted(quizTitle, score, percentage, correctCount, totalQuestions) {
    const passed = percentage >= 70;
    const icon = passed ? '🎉' : '📚';
    const message = passed 
        ? `You scored ${Math.round(percentage)}% on ${quizTitle}! Great job!`
        : `You scored ${Math.round(percentage)}% on ${quizTitle}. Keep practicing!`;
    
    return createNotification(
        `Quiz Completed: ${quizTitle}`,
        message,
        NOTIFICATION_TYPES.QUIZ_COMPLETED,
        {
            icon,
            priority: passed ? NOTIFICATION_PRIORITIES.HIGH : NOTIFICATION_PRIORITIES.MEDIUM,
            action: `/quiz/results`,
            metadata: { quizTitle, score, percentage, correctCount, totalQuestions, passed },
            sound: passed
        }
    );
}

// Create achievement notification
export function notifyAchievementEarned(achievementName, achievementPoints, achievementIcon) {
    return createNotification(
        `Achievement Unlocked! 🏆`,
        `You earned the "${achievementName}" achievement! +${achievementPoints} points`,
        NOTIFICATION_TYPES.ACHIEVEMENT_EARNED,
        {
            icon: achievementIcon || '🏆',
            priority: NOTIFICATION_PRIORITIES.HIGH,
            action: '/score',
            metadata: { achievementName, achievementPoints },
            sound: true
        }
    );
}

// Create streak milestone notification
export function notifyStreakMilestone(streakDays) {
    const messages = {
        3: 'You\'re on a roll! 3-day streak!',
        7: '🔥 Amazing! 7-day learning streak!',
        14: '🎯 14 days strong! You\'re unstoppable!',
        30: '🏆 LEGENDARY! 30-day streak!'
    };
    
    const message = messages[streakDays] || `${streakDays} day streak! Keep going!`;
    
    return createNotification(
        `${streakDays} Day Streak! 🔥`,
        message,
        NOTIFICATION_TYPES.STREAK_MILESTONE,
        {
            icon: '🔥',
            priority: streakDays >= 7 ? NOTIFICATION_PRIORITIES.HIGH : NOTIFICATION_PRIORITIES.MEDIUM,
            action: '/score',
            metadata: { streakDays }
        }
    );
}

// Create study reminder
export function createStudyReminder(topic, time) {
    return createNotification(
        'Study Reminder 📚',
        `Time to review your notes on "${topic}"`,
        NOTIFICATION_TYPES.STUDY_REMINDER,
        {
            icon: '⏰',
            priority: NOTIFICATION_PRIORITIES.MEDIUM,
            action: `/dashboard?topic=${encodeURIComponent(topic)}`,
            metadata: { topic, reminderTime: time },
            duration: 10000
        }
    );
}

// Create AI response notification
export function notifyAIResponseReady(topic) {
    return createNotification(
        'AI Response Ready 🤖',
        `Your questions about "${topic}" are ready!`,
        NOTIFICATION_TYPES.AI_RESPONSE,
        {
            icon: '🤖',
            priority: NOTIFICATION_PRIORITIES.MEDIUM,
            action: '/dashboard',
            metadata: { topic }
        }
    );
}

// Create perfect score notification
export function notifyPerfectScore(quizTitle) {
    return createNotification(
        'Perfect Score! ⭐',
        `Congratulations! You scored 100% on ${quizTitle}!`,
        NOTIFICATION_TYPES.PERFECT_SCORE,
        {
            icon: '⭐',
            priority: NOTIFICATION_PRIORITIES.HIGH,
            action: `/quiz/results`,
            metadata: { quizTitle },
            sound: true
        }
    );
}

// Create note saved notification
export function notifyNoteSaved(topic) {
    return createNotification(
        'Note Saved 💾',
        `Your Q&A about "${topic}" has been saved`,
        NOTIFICATION_TYPES.NOTE_SAVED,
        {
            icon: '💾',
            priority: NOTIFICATION_PRIORITIES.LOW,
            action: '/saved',
            metadata: { topic },
            duration: 3000
        }
    );
}

// Create new feature notification
export function notifyNewFeature(featureName, description) {
    return createNotification(
        `New Feature: ${featureName} ✨`,
        description,
        NOTIFICATION_TYPES.NEW_FEATURE,
        {
            icon: '✨',
            priority: NOTIFICATION_PRIORITIES.HIGH,
            action: '/dashboard',
            metadata: { featureName },
            duration: 8000
        }
    );
}

// Schedule daily study reminder
export function scheduleDailyReminder(time = '19:00') {
    const [hours, minutes] = time.split(':');
    const now = new Date();
    const scheduled = new Date();
    scheduled.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    if (scheduled <= now) {
        scheduled.setDate(scheduled.getDate() + 1);
    }
    
    const delay = scheduled - now;
    
    setTimeout(() => {
        createStudyReminder('your recent topics', time);
        scheduleDailyReminder(time);
    }, delay);
    
    return { scheduled, delay };
}

// Request browser notification permission
export async function requestNotificationPermission() {
    if (!('Notification' in window)) {
        console.log('This browser does not support notifications');
        return false;
    }
    
    if (Notification.permission === 'granted') {
        return true;
    }
    
    if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }
    
    return false;
}

// Send browser notification (desktop)
export function sendBrowserNotification(title, body, icon = '/favicon.ico') {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
        return false;
    }
    
    try {
        const notification = new Notification(title, {
            body,
            icon,
            badge: icon,
            silent: false
        });
        
        notification.onclick = () => {
            window.focus();
            notification.close();
        };
        
        setTimeout(() => notification.close(), 5000);
        return true;
    } catch (error) {
        console.error('Error sending browser notification:', error);
        return false;
    }
}

// Get notification statistics
export function getNotificationStats() {
    const total = notifications.length;
    const read = notifications.filter(n => n.read).length;
    const unread = total - read;
    
    const byType = {};
    notifications.forEach(n => {
        byType[n.type] = (byType[n.type] || 0) + 1;
    });
    
    const recent = notifications.slice(0, 5);
    
    return {
        total,
        read,
        unread,
        byType,
        recent,
        lastNotification: notifications[0] || null
    };
}

// Export notifications as JSON
export function exportNotifications() {
    const exportData = {
        exportedAt: new Date().toISOString(),
        notifications: notifications,
        stats: getNotificationStats(),
        version: '1.0'
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `flashnotes-notifications-${Date.now()}.json`);
    linkElement.click();
}

// Import notifications from JSON
export function importNotifications(jsonData) {
    try {
        const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
        
        if (data.notifications && Array.isArray(data.notifications)) {
            notifications = data.notifications;
            lastNotificationId = Math.max(...notifications.map(n => n.id), 0);
            saveToLocalStorage();
            updateUnreadCount();
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error importing notifications:', error);
        return false;
    }
}

// Helper function to escape HTML
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add CSS animations
const notificationStyles = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .animate-slideInRight {
        animation: slideInRight 0.3s ease-out;
    }
`;

if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = notificationStyles;
    document.head.appendChild(style);
}

// Initialize on load
initNotifications();