import { generateNotes } from '../services/notesGeneratorService.js';

async function verifyNotes() {
    console.log('🎯 Final Verification Test\n');
    console.log('='.repeat(60));
    
    const testTopic = 'JavaScript Async/Await';
    
    console.log(`\n📚 Generating notes for: ${testTopic}`);
    console.log('-'.repeat(40));
    
    const result = await generateNotes(testTopic, 'beginner', 'detailed');
    
    if (result.success) {
        console.log('\n✅ SUCCESS! Notes generated:\n');
        console.log(`📖 Title: ${result.notes.title}`);
        console.log(`\n📝 Overview: ${result.notes.overview}`);
        console.log(`\n🔑 Key Concepts:`);
        result.notes.key_concepts.forEach((concept, i) => {
            console.log(`   ${i + 1}. ${concept}`);
        });
        
        if (result.notes.code_examples && result.notes.code_examples.length > 0) {
            console.log(`\n💻 Code Examples:`);
            result.notes.code_examples.forEach((example, i) => {
                console.log(`   ${i + 1}. ${example.title}`);
            });
        }
        
        if (result.notes.best_practices && result.notes.best_practices.length > 0) {
            console.log(`\n✅ Best Practices:`);
            result.notes.best_practices.forEach((practice, i) => {
                console.log(`   ${i + 1}. ${practice}`);
            });
        }
        
        console.log('\n' + '='.repeat(60));
        console.log('✅ All tests passed! Notes generation is working perfectly.');
        
    } else {
        console.log('\n❌ FAILED! Using fallback notes');
        console.log(`Error: ${result.error}`);
    }
}

verifyNotes();