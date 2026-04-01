import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const API_KEY = process.env.OPENROUTER_API_KEY;

if (!API_KEY) {
    console.error('No API key');
    process.exit(1);
}

const client = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: API_KEY,
});

async function listModels() {
    try {
        // OpenRouter doesn't have a models list endpoint via SDK, so use fetch
        const response = await fetch('https://openrouter.ai/api/v1/models', {
            headers: {
                'Authorization': `Bearer ${API_KEY}`
            }
        });
        
        const data = await response.json();
        
        if (data.data && Array.isArray(data.data)) {
            console.log('📋 Available Models:\n');
            
            // Filter free models
            const freeModels = data.data.filter(m => 
                m.id.includes(':free') || 
                (m.pricing && m.pricing.prompt === 0)
            );
            
            console.log(`✅ Found ${freeModels.length} free models:\n`);
            
            freeModels.slice(0, 20).forEach(model => {
                console.log(`   ${model.id}`);
            });
            
            if (freeModels.length > 20) {
                console.log(`   ... and ${freeModels.length - 20} more`);
            }
            
            // Save to file for reference
            const fs = require('fs');
            fs.writeFileSync('./available-models.json', JSON.stringify(freeModels, null, 2));
            console.log('\n📁 Full list saved to available-models.json');
            
        } else {
            console.log('❌ No models found or unexpected response:', data);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

listModels();