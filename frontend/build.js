// frontend/build.js
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting build process...');

// Ensure dist folder exists
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
    console.log('✅ Created dist folder');
}

// Build CSS
console.log('📝 Building CSS...');
exec('tailwindcss -i ./src/style.css -o ./dist/style.css --minify', (error, stdout, stderr) => {
    if (error) {
        console.error('❌ CSS Build Error:', error.message);
        return;
    }
    if (stderr) {
        console.error('⚠️ CSS Warning:', stderr);
    }
    console.log('✅ CSS built: src/style.css → dist/style.css');
    
    // Copy index.html to dist
    console.log('📝 Copying index.html...');
    fs.copyFileSync('index.html', 'dist/index.html');
    console.log('✅ index.html copied to dist folder');
    
    // Also copy public folder if it exists
    if (fs.existsSync('public')) {
        console.log('📝 Copying public folder...');
        fs.cpSync('public', 'dist/public', { recursive: true });
        console.log('✅ Public folder copied');
    }
    
    console.log('🎉 Build complete! Files in dist/ folder:');
    console.log('   - dist/style.css');
    console.log('   - dist/index.html');
});