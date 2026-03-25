// backend/src/routes/pdf.js
import express from 'express';
import multer from 'multer';
import { authenticateToken } from '../middleware/auth.js';
import {
    processPDF,
    downloadNotesAsPDF,
    getTextForVoice
} from '../controllers/pdfController.js';

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'), false);
        }
    }
});

// All routes require authentication
router.use(authenticateToken);

// Process PDF upload
router.post('/process', upload.single('pdf'), processPDF);

// Download notes as PDF
router.post('/download', downloadNotesAsPDF);

// Get clean text for voice
router.post('/voice-text', getTextForVoice);

export default router;