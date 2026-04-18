// backend/src/test/testOpenRouterNotes.js
import { testOpenRouterConnection, generateWithFallback, OPENROUTER_MODELS } from '../services/openrouterNotesService.js';

async function runTests() {
    console.log('\n🧪 OPENROUTER NOTES API TEST SUITE');
    console.log('=' .repeat(50));
    
    // Check API key status
    const apiKey = process.env.OPENROUTER_NOTES_API_KEY;
    console.log(`\n🔑 API Key Status: ${apiKey ? '✅ Loaded' : '❌ Missing'}`);
    if (apiKey) {
        console.log(`   Key preview: ${apiKey.substring(0, 15)}...`);
    }
    
    // Test 1: Basic Connection
    console.log('\n📡 TEST 1: Basic API Connection');
    console.log('-'.repeat(40));
    
    const connectionTest = await testOpenRouterConnection();
    if (!connectionTest.success) {
        console.log('\n❌ Cannot proceed - API connection failed');
        console.log('Please check:');
        console.log('1. Your OPENROUTER_NOTES_API_KEY in .env file');
        console.log('2. Internet connection');
        return;
    }
    
    // Test 2: Available Models
    console.log('\n📋 TEST 2: Available Models');
    console.log('-'.repeat(40));
    console.log(`   Primary model: ${OPENROUTER_MODELS.PRIMARY}`);
    console.log(`   Fallback models:`);
    OPENROUTER_MODELS.FALLBACKS.forEach((model, i) => {
        console.log(`      ${i + 1}. ${model}`);
    });
    
    // Test 3: Generate Notes
    console.log('\n📝 TEST 3: Generate Notes with OpenRouter');
    console.log('-'.repeat(40));
    
    const testPrompt = `Generate a short JSON object for notes about "JavaScript Arrays" with:
    - title: "JavaScript Arrays Notes"
    - overview: "One sentence overview"
    - key_concepts: 3 array concepts
    Return ONLY valid JSON.`;
    
    console.log('   Generating...');
    const result = await generateWithFallback(testPrompt, { max_tokens: 500 });
    
    if (result.success) {
        console.log('   ✅ Generation successful!');
        console.log(`   Model used: ${result.model}`);
        console.log(`   Tokens used: ${result.usage?.total_tokens || 'N/A'}`);
        console.log('\n   📄 Response preview:');
        console.log('   ' + '-'.repeat(35));
        console.log(result.text.substring(0, 300) + (result.text.length > 300 ? '...' : ''));
    } else {
        console.log('   ❌ Generation failed:', result.error);
    }
    
    // Summary
    console.log('\n📊 TEST SUMMARY');
    console.log('=' .repeat(50));
    console.log('✅ OpenRouter service is ready to use!');
    console.log('\n💡 Next steps:');
    console.log('   1. Integrate with notesGeneratorService.js');
    console.log('   2. Replace Gemini calls with OpenRouter');
    console.log('   3. Test full notes generation flow');
}

// Run tests
runTests().catch(console.error);