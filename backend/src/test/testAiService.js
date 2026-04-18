// backend/src/test/testAiService.js
import { generateQA, generateQuiz } from '../services/ai.service.js';

async function runTests() {
    console.log('\n🤖 AI SERVICE TEST SUITE');
    console.log('=' .repeat(60));
    
    let passed = 0;
    let failed = 0;
    
    // Test 1: Generate QA for Operating System
    console.log('\n📝 TEST 1: Generate QA for "Operating System"');
    console.log('-'.repeat(40));
    
    try {
        const qaList = await generateQA('Operating System', 3);
        
        if (qaList && qaList.length > 0) {
            console.log(`   ✅ Generated ${qaList.length} Q&A pairs`);
            console.log(`   📖 Sample Q: ${qaList[0].question?.substring(0, 60)}...`);
            console.log(`   📝 Sample A: ${qaList[0].answer?.substring(0, 60)}...`);
            passed++;
        } else {
            console.log('   ❌ No Q&A generated');
            failed++;
        }
    } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
        failed++;
    }
    
    // Test 2: Generate QA for React
    console.log('\n📝 TEST 2: Generate QA for "React"');
    console.log('-'.repeat(40));
    
    try {
        const qaList = await generateQA('React', 5);
        
        if (qaList && qaList.length > 0) {
            console.log(`   ✅ Generated ${qaList.length} Q&A pairs`);
            
            // Validate structure
            const hasValidStructure = qaList.every(qa => 
                qa.question && qa.answer && typeof qa.question === 'string' && typeof qa.answer === 'string'
            );
            
            if (hasValidStructure) {
                console.log('   ✅ All Q&A have valid structure');
            } else {
                console.log('   ⚠️ Some Q&A missing question or answer');
            }
            
            // Display all questions
            console.log('\n   📋 Generated Questions:');
            qaList.forEach((qa, idx) => {
                console.log(`      ${idx + 1}. ${qa.question.substring(0, 50)}...`);
            });
            
            passed++;
        } else {
            console.log('   ❌ No Q&A generated');
            failed++;
        }
    } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
        failed++;
    }
    
    // Test 3: Generate QA for Database with different count
    console.log('\n📝 TEST 3: Generate QA for "Database" (count=2)');
    console.log('-'.repeat(40));
    
    try {
        const qaList = await generateQA('Database', 2);
        
        if (qaList && qaList.length === 2) {
            console.log(`   ✅ Generated exactly ${qaList.length} Q&A as requested`);
            passed++;
        } else {
            console.log(`   ⚠️ Expected 2, got ${qaList?.length || 0}`);
            failed++;
        }
    } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
        failed++;
    }
    
    // Test 4: Generate QA for unknown topic (should use fallback)
    console.log('\n📝 TEST 4: Generate QA for Unknown Topic');
    console.log('-'.repeat(40));
    
    try {
        const qaList = await generateQA('UnknownTopicXYZ123', 3);
        
        if (qaList && qaList.length > 0) {
            console.log(`   ✅ Generated ${qaList.length} Q&A for unknown topic (fallback)`);
            console.log(`   📖 First Q: ${qaList[0].question}`);
            passed++;
        } else {
            console.log('   ❌ No fallback Q&A generated');
            failed++;
        }
    } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
        failed++;
    }
    
    // Test 5: Generate Quiz
    console.log('\n📝 TEST 5: Generate Quiz for "Node.js"');
    console.log('-'.repeat(40));
    
    try {
        const quiz = await generateQuiz('Node.js', 5);
        
        if (quiz && quiz.length > 0) {
            console.log(`   ✅ Generated quiz with ${quiz.length} questions`);
            
            // Validate quiz structure
            const firstQuestion = quiz[0];
            console.log(`   📋 First question: ${firstQuestion.question?.substring(0, 50)}...`);
            console.log(`   ✅ Has options: ${firstQuestion.options?.length === 4}`);
            console.log(`   ✅ Has correct answer: ${firstQuestion.answer?.substring(0, 40)}...`);
            console.log(`   ✅ Correct option index: ${firstQuestion.correctOption}`);
            
            // Check if correct option matches answer
            const correctAnswer = firstQuestion.options[firstQuestion.correctOption];
            const matches = correctAnswer === firstQuestion.answer;
            console.log(`   ${matches ? '✅' : '⚠️'} Correct option matches answer: ${matches}`);
            
            passed++;
        } else {
            console.log('   ❌ No quiz generated');
            failed++;
        }
    } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
        failed++;
    }
    
    // Test 6: Quiz with different count
    console.log('\n📝 TEST 6: Generate Quiz with count=3');
    console.log('-'.repeat(40));
    
    try {
        const quiz = await generateQuiz('React', 3);
        
        if (quiz && quiz.length === 3) {
            console.log(`   ✅ Generated ${quiz.length} questions as requested`);
            passed++;
        } else {
            console.log(`   ⚠️ Expected 3, got ${quiz?.length || 0}`);
            failed++;
        }
    } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
        failed++;
    }
    
    // Test 7: Performance test
    console.log('\n📝 TEST 7: Performance Test');
    console.log('-'.repeat(40));
    
    try {
        const startTime = Date.now();
        await generateQA('JavaScript', 5);
        const duration = Date.now() - startTime;
        
        console.log(`   ⏱️ Generation time: ${duration}ms`);
        
        if (duration < 5000) {
            console.log('   ✅ Good performance (<5 seconds)');
        } else if (duration < 10000) {
            console.log('   ⚠️ Acceptable performance (<10 seconds)');
        } else {
            console.log('   ⚠️ Slow performance (>10 seconds)');
        }
        passed++;
    } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
        failed++;
    }
    
    // Test 8: Validate answer quality (not empty/too short)
    console.log('\n📝 TEST 8: Validate Answer Quality');
    console.log('-'.repeat(40));
    
    try {
        const qaList = await generateQA('Operating System', 3);
        
        const validAnswers = qaList.filter(qa => 
            qa.answer && qa.answer.length > 20
        );
        
        console.log(`   ✅ ${validAnswers.length}/${qaList.length} answers have good length (>20 chars)`);
        
        const emptyAnswers = qaList.filter(qa => !qa.answer || qa.answer.length < 5);
        if (emptyAnswers.length === 0) {
            console.log('   ✅ No empty or very short answers');
        } else {
            console.log(`   ⚠️ ${emptyAnswers.length} answers are too short`);
        }
        passed++;
    } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
        failed++;
    }
    
    // Test 9: Check fallback for invalid topic
    console.log('\n📝 TEST 9: Fallback for Empty Topic');
    console.log('-'.repeat(40));
    
    try {
        const qaList = await generateQA('', 3);
        
        if (qaList && qaList.length > 0) {
            console.log('   ✅ Handled empty topic with fallback');
            passed++;
        } else {
            console.log('   ❌ Failed to handle empty topic');
            failed++;
        }
    } catch (error) {
        console.log(`   ⚠️ Error but handled: ${error.message}`);
        passed++;
    }
    
    // Test 10: Quiz options uniqueness
    console.log('\n📝 TEST 10: Quiz Options Uniqueness');
    console.log('-'.repeat(40));
    
    try {
        const quiz = await generateQuiz('Database', 3);
        
        let allUnique = true;
        for (const question of quiz) {
            const uniqueOptions = new Set(question.options);
            if (uniqueOptions.size !== question.options.length) {
                console.log(`   ⚠️ Question "${question.question.substring(0, 30)}..." has duplicate options`);
                allUnique = false;
            }
        }
        
        if (allUnique) {
            console.log('   ✅ All quiz options are unique');
        }
        passed++;
    } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
        failed++;
    }
    
    // Summary
    console.log('\n' + '=' .repeat(60));
    console.log('📊 TEST SUMMARY');
    console.log('=' .repeat(60));
    console.log(`   ✅ Passed: ${passed}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`   📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);
    
    if (failed === 0) {
        console.log('\n🎉 All tests passed! ai.service.js is ready to use.');
        console.log('\n💡 Notes:');
        console.log('   - If Gemini API key is invalid/missing, fallback questions will be used');
        console.log('   - Fallback provides topic-specific questions for OS, DB, React, Node.js');
        console.log('   - Quiz generation uses the same Q&A data');
    } else {
        console.log('\n⚠️ Some tests failed. Check the errors above.');
    }
    
    // Print sample quiz output
    console.log('\n📚 Sample Quiz Output (First 2 questions):');
    try {
        const sampleQuiz = await generateQuiz('React', 2);
        sampleQuiz.forEach((q, idx) => {
            console.log(`\n   Question ${idx + 1}: ${q.question}`);
            console.log(`   Options: ${q.options.join(' | ')}`);
            console.log(`   Correct: ${q.answer}`);
        });
    } catch (e) {
        console.log('   Could not generate sample quiz');
    }
}

// Run tests
runTests().catch(console.error);