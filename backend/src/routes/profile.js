// backend/src/routes/profile.js
import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { 
    getProfile, 
    updateProfile, 
    getUserStats,
    getUserAchievements 
} from '../controllers/profileController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Profile routes
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/stats', getUserStats);
router.get('/achievements', getUserAchievements);

export default router;