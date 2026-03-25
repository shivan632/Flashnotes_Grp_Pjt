import gtts from 'google-tts-api';
import fs from 'fs';
import https from 'https';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function testGoogleTTS() {
    console.log('🎤 Testing Google Text-to-Speech (gTTS)...\n');
    
    // Test text
    const text = "Hello! Welcome to Bhang Bhosda website we are plased to welcome bhadwe. Your PDF notes are ready to be read aloud. This is a test of the Google Text to Speech system.";
    
    console.log('📝 Text to convert:', text);
    console.log('📡 Getting audio URL from Google...');
    
    try {
        // Get audio URL
        const url = gtts.getAudioUrl(text, {
            lang: 'en',
            slow: false,
            host: 'https://translate.google.com',
        });
        
        console.log('✅ Audio URL generated');
        console.log('🔗 URL:', url.substring(0, 100) + '...\n');
        
        // Download audio
        console.log('📥 Downloading audio file...');
        
        const outputPath = join(__dirname, 'test-output.mp3');
        
        await new Promise((resolve, reject) => {
            https.get(url, (response) => {
                if (response.statusCode !== 200) {
                    reject(new Error(`HTTP ${response.statusCode}`));
                    return;
                }
                
                const fileStream = fs.createWriteStream(outputPath);
                response.pipe(fileStream);
                
                fileStream.on('finish', () => {
                    resolve();
                });
                
                fileStream.on('error', reject);
            }).on('error', reject);
        });
        
        const stats = fs.statSync(outputPath);
        
        console.log('✅ Audio saved successfully!');
        console.log(`📁 File: test-output.mp3`);
        console.log(`📊 Size: ${(stats.size / 1024).toFixed(2)} KB`);
        console.log(`🎧 Location: ${outputPath}`);
        
        console.log('\n🎉 Google TTS is working! You can play the audio file.');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.log('\n💡 Troubleshooting:');
        console.log('   - Check your internet connection');
        console.log('   - Make sure you can access translate.google.com');
        console.log('   - Try again in a few seconds');
    }
}

testGoogleTTS();