// build.js - Place in frontend root
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Starting build process...');

// Ensure dist folder exists
const distDir = path.join(process.cwd(), 'dist');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
    console.log('✅ Created dist folder');
}

// Build CSS from src/style.css to dist/style.css
console.log('📝 Building CSS...');
exec('postcss src/style.css -o dist/style.css', (error, stdout, stderr) => {
    if (error) {
        console.error('❌ CSS Build Error:', error.message);
        return;
    }
    if (stderr) {
        console.error('⚠️ CSS Warning:', stderr);
    }
    console.log('✅ CSS built successfully: src/style.css → dist/style.css');
    
    // Copy index.html to dist
    console.log('📝 Copying index.html...');
    fs.copyFileSync('index.html', 'dist/index.html');
    console.log('✅ index.html copied to dist folder');
    
    console.log('🎉 Build complete! Files ready in dist/ folder:');
    console.log('   - dist/style.css (compiled from src/style.css)');
    console.log('   - dist/index.html (copied from root)');
});
