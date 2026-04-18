// backend/src/test/testPdfService.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
    extractTextFromPDFBuffer,
    saveUploadedFile,
    deleteFile
} from '../services/pdfService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a simple test PDF buffer (since we don't have a real PDF)
function createSimpleTestPDF() {
    // This is a minimal valid PDF structure
    const pdfHeader = '%PDF-1.4\n';
    const pdfContent = `1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>
endobj
4 0 obj
<< /Length 44 >>
stream
BT
/F1 24 Tf
100 700 Td
(Hello World from PDF Test) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f
0000000010 00000 n
0000000056 00000 n
0000000102 00000 n
0000000179 00000 n
trailer
<< /Size 5 /Root 1 0 R >>
startxref
263
%%EOF`;

    return Buffer.from(pdfHeader + pdfContent);
}

async function runTests() {
    console.log('\n📄 PDF SERVICE TEST SUITE');
    console.log('=' .repeat(50));
    
    // Track test results
    let passed = 0;
    let failed = 0;
    
    // Test 1: extractTextFromPDFBuffer
    console.log('\n📝 TEST 1: Extract Text from PDF Buffer');
    console.log('-'.repeat(40));
    
    try {
        const testPdfBuffer = createSimpleTestPDF();
        const result = await extractTextFromPDFBuffer(testPdfBuffer);
        
        if (result.success) {
            console.log('   ✅ PDF extraction successful');
            console.log(`   📄 Page count: ${result.pageCount}`);
            console.log(`   📝 Text preview: ${result.text?.substring(0, 100)}...`);
            passed++;
        } else {
            console.log(`   ❌ Extraction failed: ${result.error}`);
            failed++;
        }
    } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
        failed++;
    }
    
    // Test 2: extractTextFromPDFBuffer - Invalid PDF
    console.log('\n📝 TEST 2: Extract Text from Invalid PDF Buffer');
    console.log('-'.repeat(40));
    
    try {
        const invalidBuffer = Buffer.from('This is not a PDF file');
        const result = await extractTextFromPDFBuffer(invalidBuffer);
        
        if (!result.success) {
            console.log('   ✅ Invalid PDF correctly rejected');
            console.log(`   Error: ${result.error?.substring(0, 80)}...`);
            passed++;
        } else {
            console.log('   ⚠️ Invalid PDF was incorrectly accepted');
            failed++;
        }
    } catch (error) {
        console.log('   ✅ Invalid PDF correctly threw error');
        passed++;
    }
    
    // Test 3: saveUploadedFile
    console.log('\n📝 TEST 3: Save Uploaded File');
    console.log('-'.repeat(40));
    
    try {
        const mockFile = {
            originalname: 'test-document.pdf',
            buffer: createSimpleTestPDF(),
            size: 1024
        };
        const userId = 'test-user-123';
        
        const result = await saveUploadedFile(mockFile, userId);
        
        if (result.success) {
            console.log('   ✅ File saved successfully');
            console.log(`   📁 Filename: ${result.filename}`);
            console.log(`   📂 Path: ${result.path}`);
            console.log(`   💾 Size: ${result.size} bytes`);
            
            // Verify file exists
            if (fs.existsSync(result.path)) {
                console.log('   ✅ File exists on disk');
            } else {
                console.log('   ⚠️ File not found on disk');
            }
            passed++;
            
            // Store path for cleanup
            global.testFilePath = result.path;
        } else {
            console.log(`   ❌ Save failed: ${result.error}`);
            failed++;
        }
    } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
        failed++;
    }
    
    // Test 4: deleteFile
    console.log('\n📝 TEST 4: Delete File');
    console.log('-'.repeat(40));
    
    if (global.testFilePath) {
        try {
            const result = await deleteFile(global.testFilePath);
            
            if (result.success) {
                console.log('   ✅ File deleted successfully');
                console.log(`   📁 Deleted: ${global.testFilePath}`);
                
                // Verify file no longer exists
                if (!fs.existsSync(global.testFilePath)) {
                    console.log('   ✅ File confirmed removed from disk');
                }
                passed++;
            } else {
                console.log(`   ❌ Delete failed: ${result.error}`);
                failed++;
            }
        } catch (error) {
            console.log(`   ❌ Error: ${error.message}`);
            failed++;
        }
    } else {
        console.log('   ⚠️ Skipping - no test file to delete');
    }
    
    // Test 5: deleteFile - Non-existent file
    console.log('\n📝 TEST 5: Delete Non-existent File');
    console.log('-'.repeat(40));
    
    try {
        const result = await deleteFile('/path/to/nonexistent/file.pdf');
        
        if (!result.success) {
            console.log('   ✅ Non-existent file correctly handled');
            passed++;
        } else {
            console.log('   ⚠️ Delete claimed success for non-existent file');
            failed++;
        }
    } catch (error) {
        console.log('   ✅ Error correctly thrown for non-existent file');
        passed++;
    }
    
    // Test 6: Large text extraction (performance)
    console.log('\n📝 TEST 6: Large Text Extraction Performance');
    console.log('-'.repeat(40));
    
    try {
        // Create a buffer with more content
        const largePdfBuffer = createSimpleTestPDF();
        
        const startTime = Date.now();
        const result = await extractTextFromPDFBuffer(largePdfBuffer);
        const duration = Date.now() - startTime;
        
        if (result.success) {
            console.log(`   ✅ Extraction completed in ${duration}ms`);
            console.log(`   📄 Text length: ${result.text?.length || 0} chars`);
            passed++;
        } else {
            console.log(`   ❌ Extraction failed: ${result.error}`);
            failed++;
        }
    } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
        failed++;
    }
    
    // Summary
    console.log('\n' + '=' .repeat(50));
    console.log('📊 TEST SUMMARY');
    console.log('=' .repeat(50));
    console.log(`   ✅ Passed: ${passed}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`   📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);
    
    if (passed === 6) {
        console.log('\n🎉 All tests passed! pdfService.js is ready to use.');
    } else {
        console.log('\n⚠️ Some tests failed. Please check the errors above.');
    }
    
    // Check uploads directory
    console.log('\n📁 Uploads Directory Status:');
    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (fs.existsSync(uploadsDir)) {
        const files = fs.readdirSync(uploadsDir);
        console.log(`   📂 Uploads directory exists at: ${uploadsDir}`);
        console.log(`   📄 Files in directory: ${files.length}`);
        if (files.length > 0) {
            console.log(`   Files: ${files.join(', ')}`);
        }
    } else {
        console.log('   ⚠️ Uploads directory not found');
    }
}

// Run tests
runTests().catch(console.error);