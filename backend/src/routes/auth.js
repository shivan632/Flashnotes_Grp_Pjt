// backend/src/routes/auth.js
import express from 'express';
import { 
    register, 
    login, 
    verifyOTP, 
    resendOTP,
    forgotPassword,
    resetPassword,
    logout
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes
router.post('/logout', authenticateToken, logout);

export default router;