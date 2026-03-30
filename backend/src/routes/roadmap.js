// backend/src/routes/roadmap.js
import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
    generateRoadmap,
    getUserRoadmaps,
    getRoadmap,
    deleteRoadmap,
    saveRoadmap,
    updateProgress
} from '../controllers/roadmapController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Generate new roadmap
router.post('/generate', generateRoadmap);

// Get user's all roadmaps
router.get('/user/all', getUserRoadmaps);

// Get specific roadmap
router.get('/:id', getRoadmap);

// Delete roadmap
router.delete('/:id', deleteRoadmap);

// Save roadmap to collection
router.post('/:id/save', saveRoadmap);

// Update user progress
router.post('/:id/progress', updateProgress);

export default router;