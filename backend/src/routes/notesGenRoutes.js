// backend/src/routes/notesGenRoutes.js
import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { 
    generateNotesAPI, 
    getUserNotes, 
    getNoteById, 
    deleteNote, 
    toggleFavorite,
    downloadNotes,
    getUserNotesStats
} from '../controllers/notesGenController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Generate new notes
router.post('/generate', generateNotesAPI);

// Get user's notes (both routes point to same function)
router.get('/my-notes', getUserNotes);
router.get('/user/all', getUserNotes);  // ✅ ADD THIS LINE - for frontend compatibility

// Get user stats
router.get('/stats', getUserNotesStats);

// Get single note
router.get('/:id', getNoteById);

// Delete note
router.delete('/:id', deleteNote);

// Toggle favorite
router.patch('/:id/favorite', toggleFavorite);

// Download as markdown
router.get('/:id/download', downloadNotes);

export default router;