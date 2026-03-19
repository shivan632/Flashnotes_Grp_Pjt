// backend/src/routes/quiz.js
import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
    getAllQuizzes,
    getQuizById,
    getQuizQuestions,
    startQuiz,
    submitQuiz,
    getQuizAttempts,
    getQuizAttemptById
} from '../controllers/quizController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all available quizzes
router.get('/', getAllQuizzes);

// Get single quiz by ID
router.get('/:id', getQuizById);

// Get questions for a specific quiz
router.get('/:id/questions', getQuizQuestions);

// Start a new quiz attempt
router.post('/:id/start', startQuiz);

// Submit quiz answers
router.post('/:id/submit', submitQuiz);

// Get user's quiz attempts
router.get('/attempts/all', getQuizAttempts);

// Get specific quiz attempt
router.get('/attempt/:attemptId', getQuizAttemptById);

export default router;