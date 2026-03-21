// frontend/src/services/storage.js - Enhanced with caching, sync, and offline support
import { notesAPI, historyAPI } from './api.js';

// ============= CONFIGURATION =============
const STORAGE_KEYS = {
    NOTES: 'flashnotes_saved',
    HISTORY: 'flashnotes_history',
    PENDING_NOTES: 'flashnotes_pending_notes',
    PENDING_HISTORY: 'flashnotes_pending_history',
    SYNC_QUEUE: 'flashnotes_sync_queue',
    LAST_SYNC: 'flashnotes_last_sync'
};

// Cache for faster access
let notesCache = null;
let historyCache = null;
let cacheTimestamp = { notes: 0, history: 0 };
const CACHE_DURATION = 30000; // 30 seconds

// Sync status
let isSyncing = false;
let syncQueue = [];

// ============= LOCAL STORAGE HELPERS =============
function getLocalNotes() {
    const notes = localStorage.getItem(STORAGE_KEYS.NOTES);
    return notes ? JSON.parse(notes) : [];
}

function getLocalHistory() {
    const history = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return history ? JSON.parse(history) : [];
}

function getPendingNotes() {
    const pending = localStorage.getItem(STORAGE_KEYS.PENDING_NOTES);
    return pending ? JSON.parse(pending) : [];
}

function getPendingHistory() {
    const pending = localStorage.getItem(STORAGE_KEYS.PENDING_HISTORY);
    return pending ? JSON.parse(pending) : [];
}

function saveToLocal(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function addToSyncQueue(action, data) {
    const queue = JSON.parse(localStorage.getItem(STORAGE_KEYS.SYNC_QUEUE) || '[]');
    queue.push({
        id: Date.now(),
        action,
        data,
        timestamp: new Date().toISOString(),
        retries: 0
    });
    saveToLocal(STORAGE_KEYS.SYNC_QUEUE, queue);
}

// ============= CACHE MANAGEMENT =============
function isCacheValid(cacheType) {
    return cacheType === 'notes' 
        ? (notesCache && (Date.now() - cacheTimestamp.notes) < CACHE_DURATION)
        : (historyCache && (Date.now() - cacheTimestamp.history) < CACHE_DURATION);
}

function updateNotesCache(notes) {
    notesCache = notes;
    cacheTimestamp.notes = Date.now();
}

function updateHistoryCache(history) {
    historyCache = history;
    cacheTimestamp.history = Date.now();
}

// ============= SAVED NOTES =============
export async function getSavedNotes(forceRefresh = false) {
    // Check cache first
    if (!forceRefresh && isCacheValid('notes') && notesCache) {
        console.log('Returning cached notes');
        return notesCache;
    }
    
    try {
        const result = await notesAPI.getAll();
        console.log('API notes response:', result);
        if (result && result.notes) {
            updateNotesCache(result.notes);
            return result.notes;
        }
    } catch (error) {
        console.warn('API fetch failed, using localStorage:', error);
        
        // Check if we have pending sync items
        const pendingNotes = getPendingNotes();
        if (pendingNotes.length > 0) {
            console.log(`Found ${pendingNotes.length} pending notes to sync`);
        }
    }
    
    // Fallback to localStorage
    const localNotes = getLocalNotes();
    updateNotesCache(localNotes);
    return localNotes;
}

export async function saveNote(topic, question, answer, options = {}) {
    const { offline = false, sync = true } = options;
    const note = { 
        topic, 
        question, 
        answer, 
        savedAt: new Date().toISOString(),
        localId: Date.now() 
    };
    
    // Update cache immediately for better UX
    if (notesCache) {
        notesCache.unshift({ ...note, id: note.localId });
        updateNotesCache(notesCache);
    }
    
    // Save to localStorage immediately
    const localNotes = getLocalNotes();
    const newNote = {
        id: note.localId,
        ...note
    };
    localNotes.unshift(newNote);
    saveToLocal(STORAGE_KEYS.NOTES, localNotes);
    
    if (offline) {
        // Store in pending queue
        const pendingNotes = getPendingNotes();
        pendingNotes.push(note);
        saveToLocal(STORAGE_KEYS.PENDING_NOTES, pendingNotes);
        
        // Add to sync queue
        if (sync) {
            addToSyncQueue('save_note', note);
        }
        
        return { ...newNote, pending: true };
    }
    
    try {
        const result = await notesAPI.save(note);
        console.log('Save successful:', result);
        
        // Remove from pending if exists
        const pendingNotes = getPendingNotes();
        const filteredPending = pendingNotes.filter(p => p.localId !== note.localId);
        saveToLocal(STORAGE_KEYS.PENDING_NOTES, filteredPending);
        
        // Update local note with server ID
        if (result.note && result.note.id) {
            const updatedLocalNotes = getLocalNotes().map(n => 
                n.id === note.localId ? { ...result.note, localId: note.localId } : n
            );
            saveToLocal(STORAGE_KEYS.NOTES, updatedLocalNotes);
            updateNotesCache(updatedLocalNotes);
        }
        
        return result.note || newNote;
    } catch (error) {
        console.warn('API save failed, added to queue:', error);
        
        // Add to pending queue for later sync
        const pendingNotes = getPendingNotes();
        if (!pendingNotes.some(p => p.localId === note.localId)) {
            pendingNotes.push(note);
            saveToLocal(STORAGE_KEYS.PENDING_NOTES, pendingNotes);
            addToSyncQueue('save_note', note);
        }
        
        return { ...newNote, pending: true };
    }
}

export async function deleteNote(noteId, options = {}) {
    const { offline = false } = options;
    
    // Update cache immediately
    if (notesCache) {
        const updatedCache = notesCache.filter(n => n.id !== noteId && n.localId !== noteId);
        updateNotesCache(updatedCache);
    }
    
    // Update localStorage
    const localNotes = getLocalNotes();
    const filteredNotes = localNotes.filter(n => n.id !== noteId && n.localId !== noteId);
    saveToLocal(STORAGE_KEYS.NOTES, filteredNotes);
    
    if (offline) {
        addToSyncQueue('delete_note', { id: noteId });
        return true;
    }
    
    try {
        await notesAPI.delete(noteId);
        
        // Remove from pending queue if exists
        const pendingNotes = getPendingNotes();
        const filteredPending = pendingNotes.filter(p => p.id !== noteId && p.localId !== noteId);
        saveToLocal(STORAGE_KEYS.PENDING_NOTES, filteredPending);
        
        return true;
    } catch (error) {
        console.warn('API delete failed, added to queue:', error);
        addToSyncQueue('delete_note', { id: noteId });
        return true;
    }
}

// ============= SEARCH HISTORY =============
export async function getSearchHistory(forceRefresh = false) {
    // Check cache first
    if (!forceRefresh && isCacheValid('history') && historyCache) {
        console.log('Returning cached history');
        return historyCache;
    }
    
    try {
        const result = await historyAPI.getAll();
        console.log('API history response:', result);
        if (result && result.history) {
            updateHistoryCache(result.history);
            return result.history;
        }
    } catch (error) {
        console.warn('API history fetch failed, using localStorage:', error);
        
        const pendingHistory = getPendingHistory();
        if (pendingHistory.length > 0) {
            console.log(`Found ${pendingHistory.length} pending history items to sync`);
        }
    }
    
    // Fallback to localStorage
    const localHistory = getLocalHistory();
    updateHistoryCache(localHistory);
    return localHistory;
}

export async function addToHistory(topic, options = {}) {
    const { offline = false, sync = true } = options;
    const entry = {
        topic,
        searchedAt: new Date().toISOString(),
        localId: Date.now()
    };
    
    // Update cache immediately
    if (historyCache) {
        historyCache.unshift({ ...entry, id: entry.localId });
        updateHistoryCache(historyCache);
    }
    
    // Save to localStorage immediately
    const localHistory = getLocalHistory();
    const newEntry = {
        id: entry.localId,
        ...entry
    };
    localHistory.unshift(newEntry);
    // Keep only last 50 history items
    if (localHistory.length > 50) localHistory.pop();
    saveToLocal(STORAGE_KEYS.HISTORY, localHistory);
    
    if (offline) {
        const pendingHistory = getPendingHistory();
        pendingHistory.push(entry);
        saveToLocal(STORAGE_KEYS.PENDING_HISTORY, pendingHistory);
        
        if (sync) {
            addToSyncQueue('add_history', { topic });
        }
        
        return { ...newEntry, pending: true };
    }
    
    try {
        const result = await historyAPI.add(topic);
        console.log('History add successful:', result);
        
        // Remove from pending
        const pendingHistory = getPendingHistory();
        const filteredPending = pendingHistory.filter(p => p.localId !== entry.localId);
        saveToLocal(STORAGE_KEYS.PENDING_HISTORY, filteredPending);
        
        // Update local with server ID
        if (result.history && result.history.id) {
            const updatedLocalHistory = getLocalHistory().map(h => 
                h.id === entry.localId ? { ...result.history, localId: entry.localId } : h
            );
            saveToLocal(STORAGE_KEYS.HISTORY, updatedLocalHistory);
            updateHistoryCache(updatedLocalHistory);
        }
        
        return result;
    } catch (error) {
        console.warn('API history add failed, added to queue:', error);
        
        const pendingHistory = getPendingHistory();
        if (!pendingHistory.some(p => p.localId === entry.localId)) {
            pendingHistory.push(entry);
            saveToLocal(STORAGE_KEYS.PENDING_HISTORY, pendingHistory);
            addToSyncQueue('add_history', { topic });
        }
        
        return { ...newEntry, pending: true };
    }
}

export async function clearHistory() {
    // Clear cache
    historyCache = [];
    updateHistoryCache([]);
    
    // Clear localStorage
    saveToLocal(STORAGE_KEYS.HISTORY, []);
    
    try {
        await historyAPI.clear();
        return true;
    } catch (error) {
        console.warn('API clear failed, added to queue:', error);
        addToSyncQueue('clear_history', {});
        return true;
    }
}

// ============= SYNC FUNCTIONS =============
export async function syncPendingData() {
    if (isSyncing) {
        console.log('Sync already in progress');
        return false;
    }
    
    isSyncing = true;
    console.log('Starting sync with server...');
    
    const syncResults = {
        notes: { success: 0, failed: 0 },
        history: { success: 0, failed: 0 },
        errors: []
    };
    
    try {
        // Sync pending notes
        const pendingNotes = getPendingNotes();
        for (const note of pendingNotes) {
            try {
                await notesAPI.save(note);
                syncResults.notes.success++;
            } catch (error) {
                console.error('Failed to sync note:', error);
                syncResults.notes.failed++;
                syncResults.errors.push({ type: 'note', data: note, error: error.message });
            }
        }
        
        // Sync pending history
        const pendingHistory = getPendingHistory();
        for (const entry of pendingHistory) {
            try {
                await historyAPI.add(entry.topic);
                syncResults.history.success++;
            } catch (error) {
                console.error('Failed to sync history:', error);
                syncResults.history.failed++;
                syncResults.errors.push({ type: 'history', data: entry, error: error.message });
            }
        }
        
        // Clear successful pending items
        saveToLocal(STORAGE_KEYS.PENDING_NOTES, []);
        saveToLocal(STORAGE_KEYS.PENDING_HISTORY, []);
        
        // Process sync queue
        const queue = JSON.parse(localStorage.getItem(STORAGE_KEYS.SYNC_QUEUE) || '[]');
        const successfulQueue = [];
        
        for (const item of queue) {
            try {
                if (item.action === 'save_note') {
                    await notesAPI.save(item.data);
                } else if (item.action === 'delete_note') {
                    await notesAPI.delete(item.data.id);
                } else if (item.action === 'add_history') {
                    await historyAPI.add(item.data.topic);
                } else if (item.action === 'clear_history') {
                    await historyAPI.clear();
                }
                successfulQueue.push(item);
            } catch (error) {
                item.retries++;
                console.error(`Failed to sync ${item.action} (retry ${item.retries}):`, error);
            }
        }
        
        // Update queue with failed items
        const remainingQueue = queue.filter(item => !successfulQueue.includes(item));
        saveToLocal(STORAGE_KEYS.SYNC_QUEUE, remainingQueue);
        
        // Update last sync time
        saveToLocal(STORAGE_KEYS.LAST_SYNC, Date.now());
        
        console.log('Sync completed:', syncResults);
        
        // Refresh caches after sync
        await getSavedNotes(true);
        await getSearchHistory(true);
        
        return syncResults;
        
    } catch (error) {
        console.error('Sync failed:', error);
        return null;
    } finally {
        isSyncing = false;
    }
}

// ============= DATA MANAGEMENT =============
export async function clearAllData() {
    notesCache = null;
    historyCache = null;
    cacheTimestamp = { notes: 0, history: 0 };
    
    localStorage.removeItem(STORAGE_KEYS.NOTES);
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
    localStorage.removeItem(STORAGE_KEYS.PENDING_NOTES);
    localStorage.removeItem(STORAGE_KEYS.PENDING_HISTORY);
    localStorage.removeItem(STORAGE_KEYS.SYNC_QUEUE);
    localStorage.removeItem(STORAGE_KEYS.LAST_SYNC);
    
    try {
        await notesAPI.delete();
        await historyAPI.clear();
    } catch (error) {
        console.warn('API clear failed:', error);
    }
}

export async function exportData() {
    const notes = await getSavedNotes();
    const history = await getSearchHistory();
    
    const exportData = {
        exportedAt: new Date().toISOString(),
        version: '1.0',
        user: {
            name: localStorage.getItem('userName'),
            email: localStorage.getItem('userEmail')
        },
        data: {
            notes,
            history
        },
        stats: {
            totalNotes: notes.length,
            totalHistory: history.length
        }
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `flashnotes-backup-${Date.now()}.json`);
    linkElement.click();
}

export async function importData(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = async (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (data.data && data.data.notes) {
                    // Clear existing data
                    await clearAllData();
                    
                    // Import notes
                    for (const note of data.data.notes) {
                        await saveNote(note.topic, note.question, note.answer, { offline: true });
                    }
                    
                    // Import history
                    for (const item of data.data.history) {
                        await addToHistory(item.topic, { offline: true });
                    }
                    
                    // Sync with server
                    await syncPendingData();
                    
                    resolve({ success: true, message: `Imported ${data.data.notes.length} notes and ${data.data.history.length} history items` });
                } else {
                    reject(new Error('Invalid file format'));
                }
            } catch (error) {
                reject(error);
            }
        };
        
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
    });
}

// Auto-sync when online
if (typeof window !== 'undefined') {
    window.addEventListener('online', () => {
        console.log('Back online, syncing data...');
        syncPendingData();
    });
}

// Export for debugging
if (typeof window !== 'undefined') {
    window.storage = {
        syncPendingData,
        clearAllData,
        exportData,
        getStats: async () => ({
            notes: (await getSavedNotes()).length,
            history: (await getSearchHistory()).length,
            pendingNotes: getPendingNotes().length,
            pendingHistory: getPendingHistory().length,
            syncQueue: JSON.parse(localStorage.getItem(STORAGE_KEYS.SYNC_QUEUE) || '[]').length,
            lastSync: localStorage.getItem(STORAGE_KEYS.LAST_SYNC)
        })
    };
}