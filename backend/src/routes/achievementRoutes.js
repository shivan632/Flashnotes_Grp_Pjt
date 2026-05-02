// backend/src/routes/achievementRoutes.js
import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import achievementService from '../services/achievementService.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all achievements for current user
router.get('/', async (req, res) => {
    try {
        const result = await achievementService.getUserAchievements(req.user.id);
        
        res.json({
            success: true,
            achievements: result.achievements,
            stats: result.stats
        });
        
    } catch (error) {
        console.error('Get achievements error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get recently earned achievements
router.get('/recent', async (req, res) => {
    try {
        const result = await achievementService.getUserAchievements(req.user.id);
        
        // Get only earned achievements, sorted by most recent
        const recentEarned = result.achievements
            .filter(a => a.earned)
            .sort((a, b) => new Date(b.earnedAt) - new Date(a.earnedAt))
            .slice(0, 5);
        
        res.json({
            success: true,
            recent: recentEarned
        });
        
    } catch (error) {
        console.error('Get recent achievements error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get achievement progress for specific type
router.get('/progress/:type', async (req, res) => {
    try {
        const { type } = req.params;
        const result = await achievementService.getUserAchievements(req.user.id);
        
        const achievements = result.achievements.filter(a => {
            try {
                const criteria = a.criteria;
                return criteria?.type === type;
            } catch {
                return false;
            }
        });
        
        res.json({
            success: true,
            achievements: achievements
        });
        
    } catch (error) {
        console.error('Get achievement progress error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export default router;