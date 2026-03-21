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
    
    // Copy the entire src folder to dist
    console.log('📝 Copying src folder...');
    const srcDir = path.join(__dirname, 'src');
    const distSrcDir = path.join(distDir, 'src');
    
    // Remove existing src in dist if exists
    if (fs.existsSync(distSrcDir)) {
        fs.rmSync(distSrcDir, { recursive: true });
    }
    
    // Copy entire src folder
    fs.cpSync(srcDir, distSrcDir, { recursive: true });
    console.log('✅ src folder copied to dist/src');
    
    // Copy public folder if it exists
    if (fs.existsSync('public')) {
        console.log('📝 Copying public folder...');
        const distPublicDir = path.join(distDir, 'public');
        if (fs.existsSync(distPublicDir)) {
            fs.rmSync(distPublicDir, { recursive: true });
        }
        fs.cpSync('public', distPublicDir, { recursive: true });
        console.log('✅ public folder copied');
    }
    
    // Copy favicon directly to dist root (IMPORTANT FIX)
    const faviconSrc = path.join(__dirname, 'public', 'favicon.ico');
    const faviconDest = path.join(distDir, 'favicon.ico');

    if (fs.existsSync(faviconSrc)) {
        fs.copyFileSync(faviconSrc, faviconDest);
        console.log('✅ favicon.ico copied to dist root');
    }

    console.log('🎉 Build complete! Files in dist/ folder:');
    console.log('   - dist/style.css');
    console.log('   - dist/index.html');
    console.log('   - dist/src/ (all your source files)');
});