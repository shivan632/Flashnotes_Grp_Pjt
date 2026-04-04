import dotenv from 'dotenv';
import { testNotesGeminiConnection } from '../config/notesGemini.js';

dotenv.config();

async function quickTest() {
    console.log('🔑 Testing Gemini API...\n');
    
    try {
        const result = await testNotesGeminiConnection();
        
        if (result.success) {
            console.log('✅ SUCCESS! Gemini API is working!');
            console.log('📝 Response:', result.message);
        } else {
            console.log('❌ FAILED!');
            console.log('Error:', result.error);
            
            if (result.error.includes('404') || result.error.includes('not found')) {
                console.log('\n💡 Model not available. Try these fixes:');
                console.log('1. Check available models');
                console.log('2. Use gemini-1.0-pro as fallback');
                console.log('3. Check if API key is valid for your region');
            }
        }
    } catch (error) {
        console.log('❌ Error:', error.message);
    }
}

quickTest();