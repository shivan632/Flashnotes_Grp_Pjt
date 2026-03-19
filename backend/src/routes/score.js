// backend/src/routes/score.js
import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
    getUserScores,
    getLeaderboard,
    getUserAchievements,
    getStats
} from '../controllers/scoreController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get user's scores and statistics
router.get('/', getUserScores);

// Get global leaderboard
router.get('/leaderboard', getLeaderboard);

// Get user's achievements
router.get('/achievements', getUserAchievements);

// Get quick stats for dashboard
router.get('/stats', getStats);

export default router;