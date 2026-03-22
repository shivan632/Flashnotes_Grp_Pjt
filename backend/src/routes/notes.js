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

router.use(authenticateToken);

router.get('/', getAllNotes);
router.get('/:id', getNoteById);
router.post('/save', saveNote);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

export default router;