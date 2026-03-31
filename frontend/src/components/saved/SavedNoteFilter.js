// frontend/src/components/saved/SavedNoteFilter.js
// Saved Note Filter Component - Enhanced UI

export function SavedNoteFilter({ topics, onFilterChange, onSortChange, onSearch }) {
    const sortOptions = [
        { value: 'newest', label: 'Newest First', icon: '📅' },
        { value: 'oldest', label: 'Oldest First', icon: '📆' },
        { value: 'topic', label: 'By Topic', icon: '📚' },
        { value: 'question', label: 'By Question', icon: '❓' }
    ];
    
    return `
        <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-5 border border-[#374151] mb-6 shadow-lg">
            <div class="flex flex-col md:flex-row gap-4">
                <!-- Search Input -->
                <div class="flex-1">
                    <div class="relative group">
                        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <div class="w-8 h-8 rounded-lg bg-[#1F2937] flex items-center justify-center transition-all group-focus-within:bg-[#3B82F6]/20">
                                <svg class="w-4 h-4 text-[#9CA3AF] group-focus-within:text-[#3B82F6] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                            </div>
                        </div>
                        <input type="text" 
                               id="searchNotesInput"
                               placeholder="Search by topic or question..." 
                               class="w-full bg-[#111827] border-2 border-[#374151] rounded-xl pl-14 pr-4 py-2.5 text-[#E5E7EB] placeholder:text-[#6B7280] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/30 transition-all duration-300 hover:border-[#4B5563]">
                    </div>
                </div>
                
                <!-- Topic Filter Dropdown -->
                <div class="w-full md:w-52">
                    <div class="relative group">
                        <select id="topicFilterSelect" 
                                class="w-full bg-[#111827] border-2 border-[#374151] rounded-xl px-4 py-2.5 text-[#E5E7EB] appearance-none cursor-pointer focus:outline-none focus:border-[#3B82F6] transition-all duration-300 hover:border-[#4B5563]">
                            <option value="all">📚 All Topics</option>
                            ${topics.map(topic => `
                                <option value="${escapeHtml(topic)}">📌 ${escapeHtml(topic)}</option>
                            `).join('')}
                        </select>
                        <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <svg class="w-4 h-4 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </div>
                    </div>
                </div>
                
                <!-- Sort Dropdown -->
                <div class="w-full md:w-44">
                    <div class="relative group">
                        <select id="sortFilterSelect" 
                                class="w-full bg-[#111827] border-2 border-[#374151] rounded-xl px-4 py-2.5 text-[#E5E7EB] appearance-none cursor-pointer focus:outline-none focus:border-[#3B82F6] transition-all duration-300 hover:border-[#4B5563]">
                            ${sortOptions.map(option => `
                                <option value="${option.value}">${option.icon} ${option.label}</option>
                            `).join('')}
                        </select>
                        <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <svg class="w-4 h-4 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </div>
                    </div>
                </div>
                
                <!-- Active Filters Display -->
                <div class="flex items-center gap-2">
                    <div id="activeFilters" class="flex flex-wrap gap-2"></div>
                    <button id="clearFiltersBtn" class="text-xs text-red-400 hover:text-red-500 transition-colors hidden px-2 py-1 rounded-lg hover:bg-red-500/10">
                        ✕ Clear all
                    </button>
                </div>
            </div>
            
            <!-- Filter Stats -->
            <div class="mt-4 pt-3 border-t border-[#374151] text-xs text-[#6B7280] flex justify-between items-center">
                <div class="flex items-center gap-2">
                    <span class="w-1.5 h-1.5 bg-[#3B82F6] rounded-full animate-pulse"></span>
                    <span id="resultCount">0</span>
                    <span>notes found</span>
                </div>
                <div class="flex gap-3">
                    <button id="selectAllBtn" class="hover:text-[#3B82F6] transition-colors px-2 py-1 rounded-lg hover:bg-[#3B82F6]/10">✓ Select All</button>
                    <button id="bulkDeleteBtn" class="text-red-400 hover:text-red-500 transition-colors hidden px-2 py-1 rounded-lg hover:bg-red-500/10">🗑️ Delete Selected</button>
                </div>
            </div>
        </div>
    `;
}

export function setupSavedNoteFilter(notes, onFilterChange, onSortChange, onSearch, onBulkDelete) {
    const searchInput = document.getElementById('searchNotesInput');
    const topicFilter = document.getElementById('topicFilterSelect');
    const sortFilter = document.getElementById('sortFilterSelect');
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');
    const selectAllBtn = document.getElementById('selectAllBtn');
    const bulkDeleteBtn = document.getElementById('bulkDeleteBtn');
    const resultCount = document.getElementById('resultCount');
    
    let selectedNotes = new Set();
    
    function updateResultCount() {
        const visibleNotes = document.querySelectorAll('.saved-note-card:not([style*="display: none"])');
        if (resultCount) resultCount.textContent = visibleNotes.length;
    }
    
    function updateActiveFilters() {
        const filters = [];
        if (topicFilter && topicFilter.value !== 'all') filters.push(`📌 Topic: ${topicFilter.value}`);
        if (searchInput && searchInput.value) filters.push(`🔍 Search: "${searchInput.value}"`);
        
        const activeFiltersContainer = document.getElementById('activeFilters');
        if (activeFiltersContainer) {
            if (filters.length > 0) {
                clearFiltersBtn?.classList.remove('hidden');
                activeFiltersContainer.innerHTML = filters.map(filter => `
                    <span class="text-xs px-2 py-1 bg-[#3B82F6]/20 text-[#60A5FA] rounded-full">${filter}</span>
                `).join('');
            } else {
                clearFiltersBtn?.classList.add('hidden');
                activeFiltersContainer.innerHTML = '';
            }
        }
        updateResultCount();
    }
    
    // Search handler
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            if (onSearch) onSearch(e.target.value);
            updateActiveFilters();
        });
    }
    
    // Topic filter handler
    if (topicFilter) {
        topicFilter.addEventListener('change', (e) => {
            if (onFilterChange) onFilterChange('topic', e.target.value);
            updateActiveFilters();
        });
    }
    
    // Sort handler
    if (sortFilter) {
        sortFilter.addEventListener('change', (e) => {
            if (onSortChange) onSortChange(e.target.value);
        });
    }
    
    // Clear filters
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            if (topicFilter) topicFilter.value = 'all';
            if (onFilterChange) onFilterChange('topic', 'all');
            if (onSearch) onSearch('');
            clearFiltersBtn.classList.add('hidden');
            updateActiveFilters();
        });
    }
    
    // Select all
    if (selectAllBtn) {
        selectAllBtn.addEventListener('click', () => {
            const noteCards = document.querySelectorAll('.saved-note-card:not([style*="display: none"])');
            noteCards.forEach(card => {
                const id = parseInt(card.dataset.noteId);
                if (id && !selectedNotes.has(id)) {
                    selectedNotes.add(id);
                    card.classList.add('ring-2', 'ring-[#3B82F6]', 'bg-[#1F2937]/50', 'scale-[1.01]');
                }
            });
            if (bulkDeleteBtn && selectedNotes.size > 0) bulkDeleteBtn.classList.remove('hidden');
            updateSelectionCount();
        });
    }
    
    // Bulk delete
    if (bulkDeleteBtn && onBulkDelete) {
        bulkDeleteBtn.addEventListener('click', async () => {
            if (selectedNotes.size > 0 && confirm(`Delete ${selectedNotes.size} selected note(s)? This action cannot be undone.`)) {
                await onBulkDelete(Array.from(selectedNotes));
                selectedNotes.clear();
                bulkDeleteBtn.classList.add('hidden');
                updateResultCount();
            }
        });
    }
    
    function updateSelectionCount() {
        if (bulkDeleteBtn) {
            bulkDeleteBtn.innerHTML = `🗑️ Delete Selected (${selectedNotes.size})`;
        }
    }
    
    // Remove selection when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.saved-note-card') && !e.target.closest('#selectAllBtn')) {
            if (selectedNotes.size > 0) {
                document.querySelectorAll('.saved-note-card').forEach(card => {
                    card.classList.remove('ring-2', 'ring-[#3B82F6]', 'bg-[#1F2937]/50', 'scale-[1.01]');
                });
                selectedNotes.clear();
                if (bulkDeleteBtn) bulkDeleteBtn.classList.add('hidden');
            }
        }
    });
    
    updateActiveFilters();
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}