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
import {
    generateAIQuiz,
    submitAIQuiz
} from '../controllers/quizGeneratorController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// ============= PRE-MADE QUIZZES =============
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

// ============= AI-GENERATED QUIZZES =============
// Generate AI quiz on the fly
router.get('/ai/generate', generateAIQuiz);

// Submit AI-generated quiz
router.post('/ai/submit', submitAIQuiz);

export default router;