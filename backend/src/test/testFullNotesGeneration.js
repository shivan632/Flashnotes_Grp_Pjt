// backend/src/test/testFullNotesGeneration.js
import { generateNotes } from '../services/notesGeneratorService.js';

async function testFullNotesGeneration() {
    console.log('\n📚 TEST: Full Notes Generation with OpenRouter');
    console.log('=' .repeat(50));
    
    const testCases = [
        { topic: 'JavaScript Promises', difficulty: 'beginner', style: 'detailed' },
        { topic: 'React Hooks', difficulty: 'beginner', style: 'concise' },
        { topic: 'Python Lists', difficulty: 'beginner', style: 'detailed' }
    ];
    
    for (const testCase of testCases) {
        console.log(`\n📖 Topic: ${testCase.topic}`);
        console.log(`   Difficulty: ${testCase.difficulty}, Style: ${testCase.style}`);
        console.log('-'.repeat(40));
        
        const startTime = Date.now();
        const result = await generateNotes(testCase.topic, testCase.difficulty, testCase.style);
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        
        if (result.success) {
            console.log(`   ✅ SUCCESS! (${duration}s)`);
            console.log(`   Model: ${result.model_used || 'OpenRouter'}`);
            console.log(`   Title: ${result.notes.title}`);
            console.log(`   Key concepts: ${result.notes.key_concepts.length}`);
            console.log(`   Code examples: ${result.notes.code_examples.length}`);
            console.log(`   Best practices: ${result.notes.best_practices.length}`);
            
            // Show first key concept as sample
            if (result.notes.key_concepts[0]) {
                console.log(`   Sample: ${result.notes.key_concepts[0].substring(0, 60)}...`);
            }
        } else {
            console.log(`   ❌ FAILED: ${result.error || 'Unknown error'}`);
        }
    }
    
    console.log('\n' + '=' .repeat(50));
    console.log('✅ Test completed!');
}

// Run the test
testFullNotesGeneration().catch(console.error);