import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.NOTES_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

async function listModels() {
    console.log('🔍 Fetching available models...\n');
    
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
        const data = await response.json();
        
        if (data.models && data.models.length > 0) {
            console.log('✅ Available models for your API key:\n');
            console.log('='.repeat(60));
            
            data.models.forEach((model, index) => {
                console.log(`${index + 1}. ${model.name}`);
                console.log(`   Display Name: ${model.displayName || 'N/A'}`);
                console.log(`   Description: ${model.description?.substring(0, 80)}...`);
                console.log(`   Methods: ${model.supportedGenerationMethods?.join(', ') || 'N/A'}`);
                console.log('-'.repeat(60));
            });
            
            // Find best model for notes generation
            console.log('\n💡 Recommended models for notes generation:');
            const recommended = data.models.filter(m => 
                m.name.includes('flash') || 
                m.name.includes('pro') ||
                m.supportedGenerationMethods?.includes('generateContent')
            );
            
            recommended.forEach(m => {
                console.log(`   ✅ ${m.name} - ${m.displayName}`);
            });
            
        } else if (data.error) {
            console.log('❌ API Error:', data.error.message);
        } else {
            console.log('⚠️ No models found');
        }
        
    } catch (error) {
        console.error('❌ Error fetching models:', error.message);
    }
}

listModels();