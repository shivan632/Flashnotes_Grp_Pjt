import { Sidebar } from '../components/layout/Sidebar.js';
import { AIChatSidebar } from '../components/layout/AIChatSidebar.js';
import { Header } from '../components/common/Header.js';
import { NotesInput, setupNotesInput } from '../components/notes-generator/NotesInput.js';
import { NotesViewer } from '../components/notes-generator/NotesViewer.js';
import { NotesCard } from '../components/notes-generator/NotesCard.js';
import { NotesSkeleton } from '../components/notes-generator/NotesSkeleton.js';
import { generateNotes, getUserNotes, deleteNote, getNoteById } from '../services/notesService.js';
import { notesToMarkdown } from '../utils/notesHelpers.js';
import { showError, showSuccess } from '../components/common/ErrorMessage.js';

let currentNotes = null;
let currentTopic = null;
let currentDifficulty = null;
let currentNotesId = null;

export async function NotesGeneratorPage() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    if (!isAuthenticated) {
        window.location.hash = '#/login';
        return '';
    }
    
    let savedNotes = [];
    try {
        const result = await getUserNotes(10, 0);
        savedNotes = result.notes || [];
        console.log('📊 Saved notes loaded:', savedNotes.length);
    } catch (error) {
        console.error('Error loading saved notes:', error);
    }
    
    return `
        <div class="min-h-screen bg-gradient-to-b from-[#0F172A] via-[#111827] to-[#0F172A] relative">
            ${Sidebar()}
            ${AIChatSidebar()}
            <div id="mainContent" class="min-h-screen transition-all duration-300" 
                 style="margin-left: 256px; margin-right: 384px; width: calc(100% - 640px);">
                ${Header({ title: 'AI Notes Generator' })}
                <main class="container mx-auto px-4 py-8">
                    <div class="max-w-6xl mx-auto">
                        <!-- Header -->
                        <div class="mb-8">
                            <div class="relative">
                                <div class="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div>
                                        <div class="flex items-center gap-3 mb-2">
                                            <div class="relative">
                                                <div class="absolute inset-0 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-xl blur-md opacity-0 group-hover:opacity-50 transition-opacity"></div>
                                                <div class="relative w-12 h-12 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-300">
                                                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"></path>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div>
                                                <h1 class="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">
                                                    AI Notes Generator
                                                </h1>
                                                <p class="text-[#9CA3AF] mt-1">Generate structured notes with code examples using AI</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl px-6 py-3 border border-[#374151]">
                                        <div class="text-center">
                                            <div class="text-2xl font-bold text-[#3B82F6]">${savedNotes.length}</div>
                                            <div class="text-xs text-[#9CA3AF]">Saved Notes</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="w-24 h-1 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full mt-4"></div>
                        </div>
                        
                        <!-- Input Section -->
                        <div id="notesInputContainer" class="mb-8"></div>
                        
                        <!-- Generated Notes Section -->
                        <div id="notesViewerContainer" class="mb-8" style="display: none;"></div>
                        
                        <!-- Loading State -->
                        <div id="loadingState" class="mb-8" style="display: none;">
                            ${NotesSkeleton()}
                        </div>
                        
                        <!-- Saved Notes Section -->
                        <div class="mt-8">
                            <div class="flex items-center gap-3 mb-4">
                                <div class="w-8 h-8 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-lg flex items-center justify-center">
                                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                                    </svg>
                                </div>
                                <h2 class="text-xl font-bold text-white">Your Saved Notes</h2>
                            </div>
                            <div id="savedNotesGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                ${savedNotes.map(note => NotesCard({ note })).join('')}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    `;
}

export async function setupNotesGeneratorPage() {
    console.log('🎯 Setting up Notes Generator Page...');
    
    // Setup input component
    const inputContainer = document.getElementById('notesInputContainer');
    if (inputContainer) {
        inputContainer.innerHTML = NotesInput({ onGenerate: null, isLoading: false });
        setupNotesInput(async (topic, difficulty, style) => {
            await handleGenerate(topic, difficulty, style);
        });
    }
    
    // Setup saved notes click events
    setupSavedNotesEvents();
    
    // Setup global functions for notes actions
    setupGlobalFunctions();
}

function setupGlobalFunctions() {
    // Copy notes handler
    window.handleCopyNotes = () => {
        if (!currentNotes) {
            showError('No notes to copy', 'warning');
            return;
        }
        
        try {
            const markdown = notesToMarkdown(currentNotes, currentTopic);
            navigator.clipboard.writeText(markdown);
            showSuccess('Notes copied to clipboard!', 'success');
        } catch (error) {
            console.error('Copy error:', error);
            showError('Failed to copy notes', 'error');
        }
    };
    
    // Download notes handler
    window.handleDownloadNotes = () => {
        if (!currentNotes) {
            showError('No notes to download', 'warning');
            return;
        }
        
        try {
            const markdown = notesToMarkdown(currentNotes, currentTopic);
            const blob = new Blob([markdown], { type: 'text/markdown' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${currentTopic.replace(/\s/g, '_')}_notes.md`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showSuccess('Download started!', 'success');
        } catch (error) {
            console.error('Download error:', error);
            showError('Failed to download notes', 'error');
        }
    };
    
    // Save notes handler
    window.handleSaveNotes = () => {
        if (!currentNotes) {
            showError('No notes to save', 'warning');
            return;
        }
        showSuccess('Notes already saved to your collection!', 'success');
    };
}

async function handleGenerate(topic, difficulty, style) {
    const loadingDiv = document.getElementById('loadingState');
    const viewerDiv = document.getElementById('notesViewerContainer');
    
    loadingDiv.style.display = 'block';
    viewerDiv.style.display = 'none';
    
    try {
        const result = await generateNotes(topic, difficulty, style);
        
        if (result.success) {
            currentNotes = result.notes;
            currentTopic = topic;
            currentDifficulty = difficulty;
            currentNotesId = result.savedId;
            
            viewerDiv.innerHTML = NotesViewer({
                notes: result.notes,
                topic: topic,
                difficulty: difficulty,
                notesId: result.savedId
            });
            
            viewerDiv.style.display = 'block';
            showSuccess(`Notes for "${topic}" generated successfully!`, 'success');
            
            // Refresh saved notes grid
            const savedNotesResult = await getUserNotes(10, 0);
            const savedNotesGrid = document.getElementById('savedNotesGrid');
            if (savedNotesGrid && savedNotesResult.notes) {
                savedNotesGrid.innerHTML = savedNotesResult.notes.map(note => NotesCard({ note })).join('');
                setupSavedNotesEvents();
            }
            
            // Scroll to viewer
            viewerDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        
    } catch (error) {
        console.error('Generation error:', error);
        showError(error.message || 'Failed to generate notes', 'error');
    } finally {
        loadingDiv.style.display = 'none';
    }
}

function setupSavedNotesEvents() {
    console.log('🎯 Setting up saved notes events...');
    
    // View note buttons
    const viewButtons = document.querySelectorAll('.view-note-btn');
    console.log('📊 Found view buttons:', viewButtons.length);
    
    viewButtons.forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        newBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const noteId = newBtn.getAttribute('data-id');
            console.log('📖 View button clicked, noteId:', noteId);
            
            if (!noteId) {
                showError('Invalid note ID', 'error');
                return;
            }
            
            try {
                const result = await getNoteById(noteId);
                
                if (result.success && result.note) {
                    console.log('✅ Note loaded:', result.note.topic);
                    
                    let notesContent = result.note.content;
                    if (typeof notesContent === 'string') {
                        try {
                            notesContent = JSON.parse(notesContent);
                        } catch (e) {
                            console.error('Parse error:', e);
                            notesContent = { overview: 'Error loading content' };
                        }
                    }
                    
                    currentNotes = notesContent;
                    currentTopic = result.note.topic;
                    currentDifficulty = result.note.difficulty;
                    currentNotesId = result.note.id;
                    
                    const viewerDiv = document.getElementById('notesViewerContainer');
                    if (viewerDiv) {
                        viewerDiv.innerHTML = NotesViewer({
                            notes: notesContent,
                            topic: result.note.topic,
                            difficulty: result.note.difficulty,
                            notesId: result.note.id
                        });
                        viewerDiv.style.display = 'block';
                        viewerDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        showSuccess('Note loaded successfully!', 'success');
                    }
                } else {
                    showError(result.error || 'Failed to load note', 'error');
                }
            } catch (error) {
                console.error('Error loading note:', error);
                showError('Failed to load note: ' + error.message, 'error');
            }
        });
    });
    
    // Delete note buttons
    const deleteButtons = document.querySelectorAll('.delete-note-btn');
    console.log('🗑️ Found delete buttons:', deleteButtons.length);
    
    deleteButtons.forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        newBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const noteId = newBtn.getAttribute('data-id');
            console.log('🗑️ Delete button clicked, noteId:', noteId);
            
            if (!noteId) {
                showError('Invalid note ID', 'error');
                return;
            }
            
            if (confirm('Are you sure you want to delete this note?')) {
                try {
                    await deleteNote(noteId);
                    showSuccess('Note deleted successfully!', 'success');
                    setTimeout(() => window.location.reload(), 500);
                } catch (error) {
                    console.error('Delete error:', error);
                    showError('Failed to delete note', 'error');
                }
            }
        });
    });
}