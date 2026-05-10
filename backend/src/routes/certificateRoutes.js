// backend/src/routes/certificateRoutes.js
import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
    getUserCertificates,
    getCertificateById,
    getCertificateHTML,
    checkNewCertificates,
    shareCertificate,
    downloadCertificate
} from '../controllers/certificateController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all certificates
router.get('/', getUserCertificates);

// Check for new certificates
router.get('/check-new', checkNewCertificates);

// Get certificate HTML (view in browser)
router.get('/:id/html', getCertificateHTML);

// Download certificate as HTML file
router.get('/:id/download', downloadCertificate);

// Share certificate (increment share count)
router.post('/:id/share', shareCertificate);

// Get certificate by ID (JSON)
router.get('/:id', getCertificateById);

export default router;