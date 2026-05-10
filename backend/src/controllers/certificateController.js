// backend/src/controllers/certificateController.js
import certificateService from '../services/certificateService.js';

// Get all certificates for current user
export const getUserCertificates = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await certificateService.getUserCertificates(userId);
        
        if (result.success) {
            res.json({ success: true, certificates: result.certificates });
        } else {
            res.json({ success: false, certificates: [], message: result.error });
        }
    } catch (error) {
        console.error('Get user certificates error:', error);
        res.json({ success: false, certificates: [] });
    }
};

// Get single certificate by ID
export const getCertificateById = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const result = await certificateService.getCertificateById(id, userId);
        
        if (result.success) {
            res.json({ success: true, certificate: result.certificate });
        } else {
            res.status(404).json({ success: false, message: 'Certificate not found' });
        }
    } catch (error) {
        console.error('Get certificate error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get certificate HTML (for viewing/downloading)
export const getCertificateHTML = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        
        // Increment download count
        await certificateService.incrementDownloadCount(id, userId);
        
        const result = await certificateService.getCertificateById(id, userId);
        
        if (!result.success) {
            return res.status(404).send('Certificate not found');
        }
        
        const userName = req.user.name || 'Learner';
        const html = certificateService.generateCertificateHTML(result.certificate, userName);
        
        res.setHeader('Content-Type', 'text/html');
        res.send(html);
    } catch (error) {
        console.error('Get certificate HTML error:', error);
        res.status(500).send('Error generating certificate');
    }
};

// Check for newly earned certificates
export const checkNewCertificates = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await certificateService.checkAndAwardCertificates(userId);
        
        res.json({ 
            success: true, 
            newCertificates: result.newCertificates || [],
            message: result.newCertificates?.length > 0 ? `${result.newCertificates.length} new certificate(s) earned!` : 'No new certificates'
        });
    } catch (error) {
        console.error('Check new certificates error:', error);
        res.json({ success: false, newCertificates: [] });
    }
};

// Share certificate (increment share count)
export const shareCertificate = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        
        const result = await certificateService.incrementShareCount(id, userId);
        
        if (result.success) {
            res.json({ success: true, message: 'Certificate shared successfully' });
        } else {
            res.json({ success: false, message: result.error });
        }
    } catch (error) {
        console.error('Share certificate error:', error);
        res.json({ success: false, message: error.message });
    }
};

// Download certificate (alias for getCertificateHTML with download header)
export const downloadCertificate = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        
        // Increment download count
        await certificateService.incrementDownloadCount(id, userId);
        
        const result = await certificateService.getCertificateById(id, userId);
        
        if (!result.success) {
            return res.status(404).send('Certificate not found');
        }
        
        const userName = req.user.name || 'Learner';
        const html = certificateService.generateCertificateHTML(result.certificate, userName);
        
        res.setHeader('Content-Type', 'text/html');
        res.setHeader('Content-Disposition', `attachment; filename="certificate_${result.certificate.certificate_number || id}.html"`);
        res.send(html);
    } catch (error) {
        console.error('Download certificate error:', error);
        res.status(500).send('Error downloading certificate');
    }
};