// backend/src/routes/notes.js
import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
    getAllNotes,
    getNoteById,
    saveNote,
    updateNote,
    deleteNote
} from '../controllers/notesController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Routes
router.get('/', getAllNotes);
router.get('/:id', getNoteById);
router.post('/save', saveNote);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

export default router;