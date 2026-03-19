// backend/test-quiz-api.js
import { supabase } from './src/config/supabase.js';

async function testQuizAPI() {
    console.log('🔍 Testing Quiz API...');
    
    // Test 1: Check if quizzes table exists
    const { data: tables, error: tablesError } = await supabase
        .from('quizzes')
        .select('count', { count: 'exact', head: true });
    
    if (tablesError) {
        console.log('❌ Quizzes table error:', tablesError.message);
    } else {
        console.log('✅ Quizzes table exists');
    }
    
    // Test 2: Get all quizzes
    const { data: quizzes, error: quizzesError } = await supabase
        .from('quizzes')
        .select('*')
        .eq('is_active', true);
    
    if (quizzesError) {
        console.log('❌ Error fetching quizzes:', quizzesError.message);
    } else {
        console.log(`✅ Found ${quizzes.length} quizzes:`);
        quizzes.forEach(quiz => {
            console.log(`   - ${quiz.title} (ID: ${quiz.id})`);
        });
    }
    
    // Test 3: Check if quiz_questions table exists
    const { error: questionsError } = await supabase
        .from('quiz_questions')
        .select('count', { count: 'exact', head: true });
    
    if (questionsError) {
        console.log('❌ Quiz questions table error:', questionsError.message);
    } else {
        console.log('✅ Quiz questions table exists');
    }
}

testQuizAPI();