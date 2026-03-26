// backend/src/routes/score.js
import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
    getUserScores,
    getLeaderboard,
    getUserStats,
    getUserAchievements,
    getScoreProgression,
    debugUserScores
} from '../controllers/scoreController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get user's scores
router.get('/', getUserScores);

// Get user stats
router.get('/stats', getUserStats);

// Get leaderboard
router.get('/leaderboard', getLeaderboard);

// Get user achievements
router.get('/achievements', getUserAchievements);

// Get score progression for graph
router.get('/progression', getScoreProgression);

// Debug endpoint
router.get('/debug', debugUserScores);

export default router;