// backend/test-openrouter.js
import { testOpenRouter, generatePDFSummary, FREE_MODELS } from './src/services/openrouterService.js';
import dotenv from 'dotenv';

dotenv.config();

async function test() {
    console.log('🧪 Testing OpenRouter Integration\n');
    console.log('=' . repeat(50));
    
    // Check API key
    if (!process.env.OPENROUTER_API_KEY) {
        console.log('❌ OPENROUTER_API_KEY not found in .env file');
        console.log('💡 Get your API key from: https://openrouter.ai/keys');
        return;
    }
    
    console.log('🔑 API Key found');
    
    // Test connection
    console.log('\n1. Testing connection with working models...');
    const connection = await testOpenRouter();
    
    if (!connection.success) {
        console.log('❌ OpenRouter connection failed:', connection.error);
        return;
    }
    
    console.log(`✅ OpenRouter connected with model: ${connection.model}`);
    
    // Test PDF summary
    console.log('\n2. Testing PDF summary generation...');
    
    const testText = `
    Artificial Intelligence (AI) is the simulation of human intelligence in machines. 
    Machine Learning is a subset of AI that enables systems to learn from data. 
    Deep Learning uses neural networks with multiple layers.
    Key concepts: supervised learning, unsupervised learning, reinforcement learning.
    `;
    
    const result = await generatePDFSummary(testText, 'AI Fundamentals', FREE_MODELS.NEMOTRON_9B);
    
    if (result.success) {
        console.log('✅ Summary generated successfully!');
        console.log('\n📝 Generated Summary:');
        console.log('=' . repeat(50));
        console.log(result.summary);
        console.log('=' . repeat(50));
        console.log(`\n📊 Model used: ${result.model}`);
    } else {
        console.log('❌ Summary generation failed:', result.error);
    }
    
    // List available models
    console.log('\n3. Available free models:');
    const models = Object.entries(FREE_MODELS);
    models.forEach(([name, id]) => {
        console.log(`   • ${name}: ${id}`);
    });
}

String.prototype.repeat = function(count) {
    return new Array(count + 1).join(this);
};

test();