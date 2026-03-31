// frontend/src/components/pdf/PDFUploader.js

export function PDFUploader() {
    return `
        <div class="pdf-uploader-container animate-fadeInUp">
            <div id="pdfUploadZone" class="pdf-upload-zone group">
                <div class="upload-icon-wrapper">
                    <div class="upload-icon-glow"></div>
                    <svg class="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                </div>
                <p class="upload-text">Drop your PDF here or <span class="browse-link">browse</span></p>
                <p class="upload-subtext">Supports PDF files up to 10MB</p>
                <div class="upload-formats">
                    <span class="format-badge">📄 PDF</span>
                    <span class="format-badge">🔒 Secure</span>
                    <span class="format-badge">⚡ Fast</span>
                </div>
                <input type="file" id="pdfFileInput" accept=".pdf" class="hidden" />
            </div>
            
            <div id="uploadProgress" class="upload-progress hidden">
                <div class="progress-ring">
                    <svg class="progress-circle" viewBox="0 0 100 100">
                        <circle class="progress-bg" cx="50" cy="50" r="45" />
                        <circle class="progress-fill" cx="50" cy="50" r="45" />
                    </svg>
                    <div class="progress-percentage">0%</div>
                </div>
                <p class="progress-text">Uploading your PDF...</p>
                <p class="progress-size"></p>
            </div>
            
            <div id="processingStatus" class="processing-status hidden">
                <div class="processing-steps">
                    <div class="step" data-step="extract">
                        <div class="step-icon">📄</div>
                        <span>Extracting Text</span>
                        <div class="step-status"></div>
                    </div>
                    <div class="step-arrow">→</div>
                    <div class="step" data-step="ai">
                        <div class="step-icon">🤖</div>
                        <span>AI Processing</span>
                        <div class="step-status"></div>
                    </div>
                    <div class="step-arrow">→</div>
                    <div class="step" data-step="notes">
                        <div class="step-icon">✨</div>
                        <span>Generating Notes</span>
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
    const progressFill = document.querySelector('.progress-fill');
    const progressPercentage = document.querySelector('.progress-percentage');
    const progressSize = document.querySelector('.progress-size');
    
    if (!uploadZone || !fileInput) return;
    
    // Click to browse
    uploadZone.addEventListener('click', (e) => {
        if (e.target.classList.contains('browse-link') || e.target === uploadZone || e.target.closest('.browse-link')) {
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
    
    // Drag and drop with enhanced effects
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('drag-over');
        uploadZone.style.transform = 'scale(1.02)';
    });
    
    uploadZone.addEventListener('dragleave', () => {
        uploadZone.classList.remove('drag-over');
        uploadZone.style.transform = 'scale(1)';
    });
    
    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('drag-over');
        uploadZone.style.transform = 'scale(1)';
        const file = e.dataTransfer.files[0];
        if (file && file.type === 'application/pdf') {
            validateAndUpload(file, onUploadComplete);
        } else {
            showError('❌ Please drop a valid PDF file');
        }
    });
    
    function validateAndUpload(file, callback) {
        if (file.type !== 'application/pdf') {
            showError('❌ Please upload a PDF file');
            return;
        }
        
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            showError('📁 File size exceeds 10MB limit');
            return;
        }
        
        uploadZone.classList.add('hidden');
        uploadProgress.classList.remove('hidden');
        
        // Show file size
        const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
        if (progressSize) {
            progressSize.textContent = `📄 ${file.name} (${fileSizeMB} MB)`;
        }
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += 8;
            const percentage = Math.min(progress, 90);
            if (progressFill) {
                const circumference = 2 * Math.PI * 45;
                const offset = circumference - (percentage / 100) * circumference;
                progressFill.style.strokeDashoffset = offset;
            }
            if (progressPercentage) {
                progressPercentage.textContent = `${percentage}%`;
            }
            if (progress >= 90) clearInterval(interval);
        }, 80);
        
        import('../../services/pdfService.js').then(({ processPDF }) => {
            processPDF(file).then(result => {
                clearInterval(interval);
                
                // Complete animation
                if (progressFill) {
                    progressFill.style.strokeDashoffset = 0;
                }
                if (progressPercentage) {
                    progressPercentage.textContent = '100%';
                }
                if (progressSize) {
                    progressSize.innerHTML = '✅ Upload complete! Processing...';
                }
                
                setTimeout(() => {
                    uploadProgress.classList.add('hidden');
                    processingStatus.classList.remove('hidden');
                    animateProcessingSteps(result, callback);
                }, 600);
            }).catch(error => {
                clearInterval(interval);
                showError(error.message || '❌ Failed to process PDF');
                resetUploader();
            });
        });
    }
    
    function animateProcessingSteps(result, callback) {
        const steps = document.querySelectorAll('.step');
        
        // Step 1: Extracting text
        setTimeout(() => {
            updateStep(steps[0], 'complete', '✓');
        }, 400);
        
        // Step 2: AI Processing
        setTimeout(() => {
            updateStep(steps[1], 'processing', '⟳');
            setTimeout(() => {
                updateStep(steps[1], 'complete', '✓');
            }, 1800);
        }, 900);
        
        // Step 3: Generating notes
        setTimeout(() => {
            updateStep(steps[2], 'processing', '⟳');
            setTimeout(() => {
                updateStep(steps[2], 'complete', '✓');
                
                setTimeout(() => {
                    if (callback) callback(result);
                    resetUploader();
                }, 600);
            }, 1800);
        }, 2800);
    }
    
    function updateStep(step, status, icon) {
        if (!step) return;
        const statusDiv = step.querySelector('.step-status');
        if (statusDiv) {
            statusDiv.textContent = icon;
            statusDiv.className = `step-status ${status}`;
        }
        step.classList.add(status);
        if (status === 'complete') {
            step.style.animation = 'stepComplete 0.4s ease-out';
            setTimeout(() => {
                step.style.animation = '';
            }, 400);
        }
    }
    
    function resetUploader() {
        processingStatus.classList.add('hidden');
        uploadZone.classList.remove('hidden');
        fileInput.value = '';
        if (progressFill) {
            progressFill.style.strokeDashoffset = 2 * Math.PI * 45;
        }
        if (progressPercentage) {
            progressPercentage.textContent = '0%';
        }
    }
    
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-toast animate-slideInRight';
        errorDiv.innerHTML = `
            <div class="error-toast-icon">⚠️</div>
            <div class="error-toast-content">
                <strong>Error</strong>
                <p>${message}</p>
            </div>
            <button class="error-toast-close">×</button>
        `;
        document.body.appendChild(errorDiv);
        
        errorDiv.querySelector('.error-toast-close')?.addEventListener('click', () => {
            errorDiv.remove();
        });
        
        setTimeout(() => {
            errorDiv.classList.add('fade-out');
            setTimeout(() => errorDiv.remove(), 300);
        }, 4000);
    }
}

// Enhanced CSS styles
const pdfUploaderStyles = `
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes slideInRight {
        from { opacity: 0; transform: translateX(50px); }
        to { opacity: 1; transform: translateX(0); }
    }
    
    @keyframes pulseGlow {
        0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
        50% { box-shadow: 0 0 0 15px rgba(59, 130, 246, 0); }
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    @keyframes stepComplete {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); background: rgba(16, 185, 129, 0.2); }
        100% { transform: scale(1); }
    }
    
    .animate-fadeInUp {
        animation: fadeInUp 0.5s ease-out forwards;
    }
    
    .animate-slideInRight {
        animation: slideInRight 0.3s ease-out forwards;
    }
    
    .pdf-uploader-container {
        background: linear-gradient(135deg, #1F2937, #111827);
        border-radius: 24px;
        padding: 32px;
        border: 1px solid #374151;
        box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.3);
    }
    
    .pdf-upload-zone {
        border: 2px dashed #374151;
        border-radius: 20px;
        padding: 60px 24px;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        background: linear-gradient(135deg, #1A2436, #0F172A);
        position: relative;
        overflow: hidden;
    }
    
    .pdf-upload-zone::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
        transition: left 0.5s;
    }
    
    .pdf-upload-zone:hover::before {
        left: 100%;
    }
    
    .pdf-upload-zone:hover {
        border-color: #3B82F6;
        transform: translateY(-4px);
        box-shadow: 0 20px 40px -12px rgba(59, 130, 246, 0.2);
    }
    
    .pdf-upload-zone.drag-over {
        border-color: #3B82F6;
        background: linear-gradient(135deg, #1F2937, #1A2436);
        transform: scale(1.02);
        box-shadow: 0 0 0 2px #3B82F6 inset;
    }
    
    .upload-icon-wrapper {
        position: relative;
        width: 80px;
        height: 80px;
        margin: 0 auto;
    }
    
    .upload-icon-glow {
        position: absolute;
        inset: -10px;
        background: radial-gradient(circle, rgba(59, 130, 246, 0.3), transparent);
        border-radius: 50%;
        animation: pulseGlow 2s infinite;
    }
    
    .upload-icon {
        width: 80px;
        height: 80px;
        color: #3B82F6;
        position: relative;
        z-index: 1;
        transition: transform 0.3s;
    }
    
    .pdf-upload-zone:hover .upload-icon {
        transform: scale(1.1);
        color: #60A5FA;
    }
    
    .upload-text {
        font-size: 18px;
        font-weight: 600;
        color: #E5E7EB;
        margin-top: 20px;
    }
    
    .browse-link {
        color: #3B82F6;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s;
        position: relative;
    }
    
    .browse-link:hover {
        color: #60A5FA;
        text-shadow: 0 0 8px rgba(59, 130, 246, 0.5);
    }
    
    .upload-subtext {
        font-size: 13px;
        color: #9CA3AF;
        margin-top: 8px;
    }
    
    .upload-formats {
        display: flex;
        justify-content: center;
        gap: 12px;
        margin-top: 20px;
    }
    
    .format-badge {
        padding: 4px 12px;
        background: #1F2937;
        border-radius: 20px;
        font-size: 11px;
        color: #9CA3AF;
        border: 1px solid #374151;
        transition: all 0.3s;
    }
    
    .format-badge:hover {
        border-color: #3B82F6;
        color: #60A5FA;
        transform: translateY(-2px);
    }
    
    .upload-progress {
        background: linear-gradient(135deg, #1F2937, #111827);
        border-radius: 20px;
        padding: 40px;
        text-align: center;
    }
    
    .progress-ring {
        position: relative;
        width: 120px;
        height: 120px;
        margin: 0 auto;
    }
    
    .progress-circle {
        width: 120px;
        height: 120px;
        transform: rotate(-90deg);
    }
    
    .progress-bg {
        fill: none;
        stroke: #374151;
        stroke-width: 8;
    }
    
    .progress-fill {
        fill: none;
        stroke: url(#progressGradient);
        stroke-width: 8;
        stroke-linecap: round;
        stroke-dasharray: 282.74;
        stroke-dashoffset: 282.74;
        transition: stroke-dashoffset 0.3s ease;
    }
    
    .progress-percentage {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 24px;
        font-weight: bold;
        background: linear-gradient(135deg, #3B82F6, #A78BFA);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
    }
    
    .progress-text {
        font-size: 16px;
        color: #E5E7EB;
        margin-top: 20px;
        font-weight: 500;
    }
    
    .progress-size {
        font-size: 12px;
        color: #6B7280;
        margin-top: 8px;
    }
    
    .processing-status {
        background: linear-gradient(135deg, #1F2937, #111827);
        border-radius: 20px;
        padding: 32px;
    }
    
    .processing-steps {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
    }
    
    .step {
        flex: 1;
        text-align: center;
        padding: 20px 12px;
        background: linear-gradient(135deg, #111827, #0F172A);
        border-radius: 16px;
        border: 1px solid #374151;
        transition: all 0.3s;
        position: relative;
        overflow: hidden;
    }
    
    .step::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
        transition: left 0.5s;
    }
    
    .step:hover::before {
        left: 100%;
    }
    
    .step.complete {
        border-color: #10B981;
        background: linear-gradient(135deg, #10B98110, #0F172A);
        box-shadow: 0 0 20px rgba(16, 185, 129, 0.1);
    }
    
    .step.processing {
        border-color: #3B82F6;
        animation: pulseGlow 1.5s infinite;
        background: linear-gradient(135deg, #3B82F610, #0F172A);
    }
    
    .step-icon {
        font-size: 36px;
        margin-bottom: 12px;
        transition: transform 0.3s;
    }
    
    .step:hover .step-icon {
        transform: scale(1.1);
    }
    
    .step span {
        display: block;
        font-size: 12px;
        font-weight: 500;
        color: #9CA3AF;
        margin-top: 8px;
    }
    
    .step.complete span {
        color: #34D399;
    }
    
    .step.processing span {
        color: #60A5FA;
    }
    
    .step-status {
        margin-top: 12px;
        font-size: 18px;
        font-weight: bold;
    }
    
    .step-status.complete {
        color: #10B981;
    }
    
    .step-status.processing {
        color: #3B82F6;
        animation: spin 1s linear infinite;
        display: inline-block;
    }
    
    .step-arrow {
        font-size: 24px;
        color: #4B5563;
        animation: pulseGlow 1.5s infinite;
    }
    
    .step.complete + .step-arrow {
        color: #10B981;
    }
    
    /* Error Toast */
    .error-toast {
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: linear-gradient(135deg, #1F2937, #111827);
        border-left: 4px solid #EF4444;
        border-radius: 12px;
        padding: 12px 16px;
        display: flex;
        align-items: center;
        gap: 12px;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        max-width: 350px;
        animation: slideInRight 0.3s ease-out;
    }
    
    .error-toast.fade-out {
        animation: fadeOut 0.3s ease-out forwards;
    }
    
    @keyframes fadeOut {
        to { opacity: 0; transform: translateX(50px); }
    }
    
    .error-toast-icon {
        font-size: 20px;
    }
    
    .error-toast-content strong {
        color: #EF4444;
        font-size: 13px;
    }
    
    .error-toast-content p {
        color: #9CA3AF;
        font-size: 12px;
        margin-top: 2px;
    }
    
    .error-toast-close {
        background: none;
        border: none;
        color: #6B7280;
        font-size: 20px;
        cursor: pointer;
        padding: 0 4px;
        transition: color 0.3s;
    }
    
    .error-toast-close:hover {
        color: #EF4444;
    }
    
    .hidden {
        display: none;
    }
`;

// Add SVG gradient definition
const svgGradient = `
    <svg style="position: absolute; width: 0; height: 0;">
        <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#3B82F6" />
                <stop offset="100%" stop-color="#A78BFA" />
            </linearGradient>
        </defs>
    </svg>
`;

if (!document.querySelector('#pdf-uploader-svg-gradient')) {
    const svgContainer = document.createElement('div');
    svgContainer.id = 'pdf-uploader-svg-gradient';
    svgContainer.innerHTML = svgGradient;
    document.body.appendChild(svgContainer);
}

if (!document.querySelector('#pdf-uploader-styles')) {
    const style = document.createElement('style');
    style.id = 'pdf-uploader-styles';
    style.textContent = pdfUploaderStyles;
    document.head.appendChild(style);
}