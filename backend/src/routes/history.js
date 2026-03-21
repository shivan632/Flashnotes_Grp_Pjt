// backend/src/routes/history.js
import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
    getAllHistory,
    addToHistory,
    deleteHistory,
    clearHistory
} from '../controllers/historyController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Routes
router.get('/', getAllHistory);
router.post('/', addToHistory);
router.delete('/clear', clearHistory);
router.delete('/:id', deleteHistory);

export default router;