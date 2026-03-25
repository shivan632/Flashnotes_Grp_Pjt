// backend/src/services/pdfService.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// PDF parsing function using pdf-parse
export async function extractTextFromPDFBuffer(fileBuffer) {
    try {
        // Dynamic import to avoid module loading issues
        const pdfParse = (await import('pdf-parse')).default;
        
        // Parse the PDF buffer
        const data = await pdfParse(fileBuffer);
        
        return {
            success: true,
            text: data.text || '',
            pageCount: data.numpages || 1,
            info: data.info || {},
            metadata: data.metadata || {}
        };
    } catch (error) {
        console.error('PDF Extraction Error:', error);
        
        // Fallback: try to extract text using simple method
        try {
            const text = fileBuffer.toString('utf8').replace(/[^\x20-\x7E\n]/g, '');
            if (text && text.length > 100) {
                return {
                    success: true,
                    text: text.substring(0, 10000),
                    pageCount: 1,
                    info: {},
                    metadata: {},
                    warning: 'Used fallback extraction'
                };
            }
        } catch (fallbackError) {
            console.error('Fallback extraction failed:', fallbackError);
        }
        
        return {
            success: false,
            error: error.message || 'Failed to extract text from PDF'
        };
    }
}

// Save uploaded file temporarily
export async function saveUploadedFile(file, userId) {
    try {
        const timestamp = Date.now();
        const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filename = `${userId}_${timestamp}_${safeName}`;
        const filePath = path.join(uploadsDir, filename);
        
        fs.writeFileSync(filePath, file.buffer);
        
        return {
            success: true,
            filename,
            path: filePath,
            size: file.size,
            originalName: file.originalname
        };
    } catch (error) {
        console.error('File Save Error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Delete uploaded file
export async function deleteFile(filePath) {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            return { success: true };
        }
        return { success: false, error: 'File not found' };
    } catch (error) {
        console.error('File Delete Error:', error);
        return { success: false, error: error.message };
    }
}

// Export all functions
export default {
    extractTextFromPDFBuffer,
    saveUploadedFile,
    deleteFile
};