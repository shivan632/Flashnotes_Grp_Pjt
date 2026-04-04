import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { runCode } from '../controllers/codeController.js';

const router = express.Router();

router.use(authenticateToken);
router.post('/execute', runCode);

export default router;