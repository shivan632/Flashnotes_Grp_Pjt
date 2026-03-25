// frontend/src/components/pdf/PDFUploader.js

export function PDFUploader() {
    return `
        <div class="pdf-uploader-container">
            <div id="pdfUploadZone" class="pdf-upload-zone">
                <div class="upload-icon">
                    <svg class="w-16 h-16 text-[#3B82F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                </div>
                <p class="upload-text">Drag & drop your PDF here</p>
                <p class="upload-subtext">or <span class="browse-link">browse files</span></p>
                <p class="upload-hint">PDF files up to 10MB</p>
                <input type="file" id="pdfFileInput" accept=".pdf" class="hidden" />
            </div>
            
            <div id="uploadProgress" class="upload-progress hidden">
                <div class="progress-bar-container">
                    <div class="progress-bar"></div>
                </div>
                <p class="progress-text">Uploading...</p>
            </div>
            
            <div id="processingStatus" class="processing-status hidden">
                <div class="processing-steps">
                    <div class="step" data-step="extract">
                        <div class="step-icon">📄</div>
                        <span>Extracting text</span>
                        <div class="step-status"></div>
                    </div>
                    <div class="step" data-step="ai">
                        <div class="step-icon">🤖</div>
                        <span>AI Processing</span>
                        <div class="step-status"></div>
                    </div>
                    <div class="step" data-step="notes">
                        <div class="step-icon">✍️</div>
                        <span>Generating notes</span>
                        <div class="step-status"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export function setupPDFUploader(onUploadComplete) {
    const uploadZone = document.getElementById('pdfUploadZone');
    const fileInput = document.getElementById('pdfFileInput');
    const uploadProgress = document.getElementById('uploadProgress');
    const processingStatus = document.getElementById('processingStatus');
    const progressBar = document.querySelector('.progress-bar');
    const progressText = document.querySelector('.progress-text');
    
    if (!uploadZone || !fileInput) return;
    
    // Click to browse
    uploadZone.addEventListener('click', (e) => {
        if (e.target.classList.contains('browse-link') || e.target === uploadZone) {
            fileInput.click();
        }
    });
    
    // File selection
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            validateAndUpload(file, onUploadComplete);
        }
    });
    
    // Drag and drop
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('drag-over');
    });
    
    uploadZone.addEventListener('dragleave', () => {
        uploadZone.classList.remove('drag-over');
    });
    
    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('drag-over');
        const file = e.dataTransfer.files[0];
        if (file && file.type === 'application/pdf') {
            validateAndUpload(file, onUploadComplete);
        } else {
            showError('Please drop a valid PDF file');
        }
    });
    
    function validateAndUpload(file, callback) {
        // Validate file type
        if (file.type !== 'application/pdf') {
            showError('Please upload a PDF file');
            return;
        }
        
        // Validate file size (10MB)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            showError('File size exceeds 10MB limit');
            return;
        }
        
        // Show progress
        uploadZone.classList.add('hidden');
        uploadProgress.classList.remove('hidden');
        
        // Simulate progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            if (progressBar) progressBar.style.width = `${Math.min(progress, 90)}%`;
            if (progress >= 90) clearInterval(interval);
        }, 100);
        
        // Process upload
        import('../../services/pdfService.js').then(({ processPDF }) => {
            processPDF(file).then(result => {
                clearInterval(interval);
                progressBar.style.width = '100%';
                progressText.textContent = 'Upload complete!';
                
                setTimeout(() => {
                    uploadProgress.classList.add('hidden');
                    processingStatus.classList.remove('hidden');
                    
                    // Animate processing steps
                    animateProcessingSteps(result, callback);
                }, 500);
            }).catch(error => {
                clearInterval(interval);
                showError(error.message || 'Failed to process PDF');
                resetUploader();
            });
        });
    }
    
    function animateProcessingSteps(result, callback) {
        const steps = document.querySelectorAll('.step');
        
        // Step 1: Extracting text
        setTimeout(() => {
            updateStep(steps[0], 'complete', '✓');
        }, 500);
        
        // Step 2: AI Processing
        setTimeout(() => {
            updateStep(steps[1], 'processing', '⟳');
            setTimeout(() => {
                updateStep(steps[1], 'complete', '✓');
            }, 1500);
        }, 1000);
        
        // Step 3: Generating notes
        setTimeout(() => {
            updateStep(steps[2], 'processing', '⟳');
            setTimeout(() => {
                updateStep(steps[2], 'complete', '✓');
                
                // Call callback with result
                setTimeout(() => {
                    if (callback) callback(result);
                    resetUploader();
                }, 500);
            }, 1500);
        }, 2500);
    }
    
    function updateStep(step, status, icon) {
        if (!step) return;
        const statusDiv = step.querySelector('.step-status');
        if (statusDiv) {
            statusDiv.textContent = icon;
            statusDiv.className = `step-status ${status}`;
        }
        step.classList.add(status);
    }
    
    function resetUploader() {
        processingStatus.classList.add('hidden');
        uploadZone.classList.remove('hidden');
        fileInput.value = '';
        if (progressBar) progressBar.style.width = '0%';
    }
    
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'fixed bottom-4 right-4 bg-red-500/20 border border-red-500 text-red-400 px-4 py-2 rounded-lg animate-slideInRight z-50';
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        setTimeout(() => errorDiv.remove(), 3000);
    }
}

// Add CSS styles
const pdfUploaderStyles = `
    .pdf-upload-zone {
        border: 2px dashed #374151;
        border-radius: 16px;
        padding: 48px 24px;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s ease;
        background: linear-gradient(135deg, #1F2937, #111827);
    }
    
    .pdf-upload-zone:hover {
        border-color: #3B82F6;
        background: linear-gradient(135deg, #1F2937, #111827);
        transform: translateY(-2px);
    }
    
    .pdf-upload-zone.drag-over {
        border-color: #3B82F6;
        background: rgba(59, 130, 246, 0.1);
        transform: scale(1.02);
    }
    
    .upload-text {
        font-size: 18px;
        font-weight: 500;
        color: #E5E7EB;
        margin-top: 16px;
    }
    
    .upload-subtext {
        font-size: 14px;
        color: #9CA3AF;
        margin-top: 8px;
    }
    
    .browse-link {
        color: #3B82F6;
        cursor: pointer;
        font-weight: 500;
    }
    
    .browse-link:hover {
        text-decoration: underline;
    }
    
    .upload-hint {
        font-size: 12px;
        color: #6B7280;
        margin-top: 12px;
    }
    
    .upload-progress {
        background: linear-gradient(135deg, #1F2937, #111827);
        border-radius: 16px;
        padding: 32px;
        text-align: center;
    }
    
    .progress-bar-container {
        background: #374151;
        border-radius: 8px;
        height: 8px;
        overflow: hidden;
        margin-bottom: 16px;
    }
    
    .progress-bar {
        background: linear-gradient(90deg, #3B82F6, #A78BFA);
        width: 0%;
        height: 100%;
        transition: width 0.3s ease;
        border-radius: 8px;
    }
    
    .progress-text {
        font-size: 14px;
        color: #9CA3AF;
    }
    
    .processing-status {
        background: linear-gradient(135deg, #1F2937, #111827);
        border-radius: 16px;
        padding: 32px;
    }
    
    .processing-steps {
        display: flex;
        justify-content: space-between;
        gap: 16px;
    }
    
    .step {
        flex: 1;
        text-align: center;
        padding: 16px;
        background: #111827;
        border-radius: 12px;
        border: 1px solid #374151;
        transition: all 0.3s ease;
    }
    
    .step.complete {
        border-color: #10B981;
        background: rgba(16, 185, 129, 0.1);
    }
    
    .step.processing {
        border-color: #3B82F6;
        animation: pulse 1s infinite;
    }
    
    .step-icon {
        font-size: 32px;
        margin-bottom: 8px;
    }
    
    .step span {
        display: block;
        font-size: 12px;
        color: #9CA3AF;
        margin-top: 8px;
    }
    
    .step-status {
        margin-top: 8px;
        font-size: 14px;
    }
    
    .step-status.complete {
        color: #10B981;
    }
    
    .step-status.processing {
        color: #3B82F6;
        animation: spin 1s linear infinite;
        display: inline-block;
    }
    
    @keyframes pulse {
        0%, 100% { border-color: #3B82F6; box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
        50% { border-color: #60A5FA; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2); }
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;

if (!document.querySelector('#pdf-uploader-styles')) {
    const style = document.createElement('style');
    style.id = 'pdf-uploader-styles';
    style.textContent = pdfUploaderStyles;
    document.head.appendChild(style);
}