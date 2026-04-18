// frontend/src/components/voice-notes/VoiceNotesWidget.js
import { VoiceRecorder } from './VoiceRecorder.js';
import { saveVoiceNote } from '../../services/voiceNotesService.js';
import { showSuccess, showError } from '../common/ErrorMessage.js';

export function VoiceNotesWidget({ onClose, onNoteSaved }) {
    const uniqueId = Date.now();
    
    const handleSave = async (text) => {
        // Show saving indicator
        const saveBtn = document.querySelector('#voiceRecorderContainer .save-btn');
        if (saveBtn) {
            const originalText = saveBtn.innerHTML;
            saveBtn.innerHTML = `
                <svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
            `;
            saveBtn.disabled = true;
            
            try {
                const result = await saveVoiceNote({
                    text: text,
                    source: 'voice',
                    created_at: new Date().toISOString()
                });
                
                if (result.success) {
                    // Success animation
                    saveBtn.innerHTML = `
                        <svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Saved!
                    `;
                    saveBtn.classList.add('bg-green-600', 'hover:bg-green-500');
                    
                    showSuccess('✨ Voice note saved successfully!');
                    
                    setTimeout(() => {
                        if (onNoteSaved) onNoteSaved(result.note);
                        if (onClose) onClose();
                    }, 800);
                } else {
                    saveBtn.innerHTML = originalText;
                    saveBtn.disabled = false;
                    showError('❌ Failed to save: ' + result.error);
                }
            } catch (error) {
                saveBtn.innerHTML = originalText;
                saveBtn.disabled = false;
                showError('❌ Error saving note: ' + error.message);
            }
        } else {
            // Fallback if button not found
            try {
                const result = await saveVoiceNote({
                    text: text,
                    source: 'voice',
                    created_at: new Date().toISOString()
                });
                
                if (result.success) {
                    showSuccess('✨ Voice note saved successfully!');
                    if (onNoteSaved) onNoteSaved(result.note);
                    if (onClose) onClose();
                } else {
                    showError('❌ Failed to save: ' + result.error);
                }
            } catch (error) {
                showError('❌ Error saving note: ' + error.message);
            }
        }
    };
    
    const handleCancel = () => {
        // Add cancel animation
        const modal = document.querySelector('#voiceNotesModal');
        if (modal) {
            modal.style.animation = 'fadeOut 0.2s ease-out forwards';
            setTimeout(() => {
                if (onClose) onClose();
            }, 200);
        } else {
            if (onClose) onClose();
        }
    };
    
    // Setup global callbacks
    window.onVoiceNoteSave = handleSave;
    window.onVoiceNoteCancel = handleCancel;
    
    // Return enhanced VoiceRecorder with wrapper
    return `
        <div id="voiceRecorderContainer" class="animate-modalIn">
            ${VoiceRecorder({ onSave: handleSave, onCancel: handleCancel })}
        </div>
        
        <style>
            @keyframes modalIn {
                from {
                    opacity: 0;
                    transform: scale(0.95) translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
            }
            
            @keyframes fadeOut {
                from {
                    opacity: 1;
                    transform: scale(1);
                }
                to {
                    opacity: 0;
                    transform: scale(0.95);
                }
            }
            
            .animate-modalIn {
                animation: modalIn 0.3s cubic-bezier(0.34, 1.2, 0.64, 1) forwards;
            }
        </style>
    `;
}