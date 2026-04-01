import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
    generateNotesAPI,
    getUserNotes,
    getNoteById,
    downloadNotes,
    deleteNote,
    toggleFavorite,
    getUserNotesStats
} from '../controllers/notesGenController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// ============= ORDER MATTERS! =============
// POST routes
router.post('/generate', generateNotesAPI);

// GET routes - SPECIFIC PATHS (must come before dynamic)
router.get('/user/all', getUserNotes);
router.get('/stats', getUserNotesStats);
router.get('/:id/download', downloadNotes);

// GET routes - DYNAMIC (must be LAST)
router.get('/:id', getNoteById);

// DELETE and PATCH routes
router.delete('/:id', deleteNote);
router.patch('/:id/favorite', toggleFavorite);

export default router;