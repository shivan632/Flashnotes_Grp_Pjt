// backend/src/controllers/pdfController.js
import { generatePDFSummary } from '../services/openrouterService.js';
import { extractTextFromPDFBuffer } from '../services/pdfService.js';
import PDFDocument from 'pdfkit';

// Upload PDF and generate notes
export const processPDF = async (req, res) => {
    try {
        const userId = req.user.id;
        
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }
        
        // Check file type
        if (req.file.mimetype !== 'application/pdf') {
            return res.status(400).json({
                success: false,
                message: 'Only PDF files are allowed'
            });
        }
        
        // Check file size (max 10MB)
        const maxSize = 10 * 1024 * 1024;
        if (req.file.size > maxSize) {
            return res.status(400).json({
                success: false,
                message: 'File size exceeds 10MB limit'
            });
        }
        
        console.log(`📄 Processing PDF: ${req.file.originalname} (${req.file.size} bytes)`);
        
        // Extract text directly from buffer
        console.log('📖 Extracting text from PDF...');
        const extraction = await extractTextFromPDFBuffer(req.file.buffer);
        
        if (!extraction.success) {
            return res.status(500).json({
                success: false,
                message: extraction.error || 'Failed to extract text from PDF'
            });
        }
        
        console.log(`✅ Text extracted: ${extraction.text.length} characters, ${extraction.pageCount} pages`);
        
        // Check if text is empty
        if (!extraction.text || extraction.text.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Could not extract text from PDF. The file might be image-based or corrupted.'
            });
        }
        
        // Generate summary with Gemini
        console.log('🤖 Sending to Gemini for summarization...');
        const summary = await generatePDFSummary(extraction.text);
        
        if (!summary.success) {
            return res.status(500).json({
                success: false,
                message: summary.error || 'Failed to generate summary'
            });
        }
        
        console.log('✅ Summary generated successfully');
        
        res.json({
            success: true,
            message: 'PDF processed successfully',
            data: {
                filename: req.file.originalname,
                originalName: req.file.originalname,
                pageCount: extraction.pageCount,
                textLength: extraction.text.length,
                summary: summary.summary,
                rawText: extraction.text.substring(0, 2000)
            }
        });
        
    } catch (error) {
        console.error('Process PDF error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to process PDF'
        });
    }
};

// Generate PDF notes from summary
export const downloadNotesAsPDF = async (req, res) => {
    try {
        const { summary, title, topic } = req.body;
        
        if (!summary) {
            return res.status(400).json({
                success: false,
                message: 'Summary content is required'
            });
        }
        
        // Create PDF document
        const doc = new PDFDocument({
            size: 'A4',
            margin: 50,
            info: {
                Title: title || 'Flashnotes - PDF Summary',
                Author: 'Flashnotes AI',
                Subject: topic || 'PDF Notes',
                Keywords: 'notes, summary, flashnotes'
            }
        });
        
        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="flashnotes_notes_${Date.now()}.pdf"`);
        
        // Pipe PDF to response
        doc.pipe(res);
        
        // Add header
        doc.fontSize(24)
           .font('Helvetica-Bold')
           .fillColor('#3B82F6')
           .text(title || 'Flashnotes Summary', { align: 'center' });
        
        doc.moveDown(0.5);
        
        // Add date
        doc.fontSize(10)
           .font('Helvetica')
           .fillColor('#6B7280')
           .text(`Generated on ${new Date().toLocaleDateString()}`, { align: 'center' });
        
        doc.moveDown(1);
        
        // Add content
        doc.fontSize(12)
           .font('Helvetica')
           .fillColor('#1F2937');
        
        // Split summary into sections and format
        const lines = summary.split('\n');
        for (const line of lines) {
            if (line.startsWith('📝') || line.startsWith('🎯') || line.startsWith('📌') || line.startsWith('📚')) {
                doc.fontSize(14)
                   .font('Helvetica-Bold')
                   .fillColor('#3B82F6')
                   .text(line)
                   .moveDown(0.5);
                doc.fontSize(12).font('Helvetica').fillColor('#1F2937');
            } else if (line.trim().startsWith('-') || line.trim().startsWith('•')) {
                doc.text(line, { indent: 20 })
                   .moveDown(0.3);
            } else if (line.trim()) {
                doc.text(line)
                   .moveDown(0.5);
            }
        }
        
        // Add footer
        const pageCount = doc.bufferedPageRange().count;
        for (let i = 0; i < pageCount; i++) {
            doc.switchToPage(i);
            doc.fontSize(8)
               .fillColor('#9CA3AF')
               .text(`Flashnotes - AI Powered Learning • Page ${i + 1} of ${pageCount}`, 50, doc.page.height - 50, { align: 'center' });
        }
        
        doc.end();
        
    } catch (error) {
        console.error('Download PDF error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get clean text for voice
export const getTextForVoice = async (req, res) => {
    try {
        const { text } = req.body;
        
        if (!text) {
            return res.status(400).json({
                success: false,
                message: 'Text is required'
            });
        }
        
        // Clean text for voice (remove markdown, emojis, etc.)
        const cleanText = text
            .replace(/[📝🎯📌📚🔊✨⭐💡]/g, '')
            .replace(/\*\*/g, '')
            .replace(/\n/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
        
        res.json({
            success: true,
            text: cleanText,
            originalLength: text.length,
            cleanLength: cleanText.length
        });
        
    } catch (error) {
        console.error('Text for voice error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};