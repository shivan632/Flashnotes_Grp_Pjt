import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { 
    submitFeedback, 
    getFeedbacks, 
    getFeedbackStats,
    getUserFeedback,
    deleteFeedback
} from '../controllers/feedbackController.js';

const router = express.Router();

// Public routes
router.post('/', submitFeedback);
router.get('/', getFeedbacks);
router.get('/stats', getFeedbackStats);

// Protected routes (require authentication)
router.get('/my-feedback', authenticateToken, getUserFeedback);
router.delete('/:id', authenticateToken, deleteFeedback);

export default router;