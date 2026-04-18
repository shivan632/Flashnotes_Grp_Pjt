// backend/src/routes/voiceNotesRoutes.js
import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
    saveVoiceNote,
    getVoiceNotes,
    getVoiceNoteById,
    updateVoiceNote,
    deleteVoiceNote,
    toggleFavorite,
    getVoiceNotesStats
} from '../controllers/voiceNotesController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Save new voice note
router.post('/save', saveVoiceNote);

// Get all voice notes
router.get('/', getVoiceNotes);

// Get stats
router.get('/stats', getVoiceNotesStats);

// Get single note
router.get('/:id', getVoiceNoteById);

// Update note
router.put('/:id', updateVoiceNote);

// Delete note
router.delete('/:id', deleteVoiceNote);

// Toggle favorite
router.patch('/:id/favorite', toggleFavorite);

export default router;