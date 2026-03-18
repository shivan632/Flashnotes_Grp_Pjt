// backend/src/routes/history.js
import express from 'express';
import { 
    getHistory,
    addToHistory,
    clearHistory,
    deleteHistoryItem
} from '../controllers/historyController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

router.get('/', getHistory);
router.post('/', addToHistory);
router.delete('/', clearHistory);
router.delete('/:id', deleteHistoryItem);

export default router;