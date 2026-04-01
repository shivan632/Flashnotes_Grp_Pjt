import { generateNotes } from '../services/notesGeneratorService.js';

async function finalTest() {
    console.log('🎯 Final Test: Generate Notes with Gemini\n');
    console.log('='.repeat(60));
    
    const testCases = [
        { topic: 'JavaScript Promises', difficulty: 'beginner', style: 'detailed' },
        { topic: 'React Hooks', difficulty: 'beginner', style: 'concise' },
    ];
    
    for (const testCase of testCases) {
        console.log(`\n📚 Testing: ${testCase.topic}`);
        console.log('-'.repeat(40));
        
        const result = await generateNotes(
            testCase.topic,
            testCase.difficulty,
            testCase.style
        );
        
        if (result.success) {
            console.log('✅ SUCCESS!');
            console.log(`   Title: ${result.notes.title}`);
            console.log(`   Overview: ${result.notes.overview.substring(0, 100)}...`);
            console.log(`   Key Concepts: ${result.notes.key_concepts.length}`);
            console.log(`   Code Examples: ${result.notes.code_examples.length}`);
            console.log(`   Best Practices: ${result.notes.best_practices.length}`);
        } else {
            console.log('❌ FAILED! Using fallback');
            console.log(`   Error: ${result.error}`);
        }
        
        // Small delay between tests
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ Test Complete!');
}

finalTest();