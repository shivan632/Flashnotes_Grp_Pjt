// backend/src/controllers/quizGeneratorController.js
import { generateQuiz } from '../services/ai.service.js';
import { supabaseAdmin } from '../config/supabase.js';

// Generate AI-powered quiz on the fly
export const generateAIQuiz = async (req, res) => {
    try {
        const { topic, count = 10 } = req.query;
        
        if (!topic) {
            return res.status(400).json({
                success: false,
                message: 'Topic is required'
            });
        }
        
        console.log(`🎯 Generating AI quiz for topic: ${topic}`);
        
        const questions = await generateQuiz(topic, parseInt(count));
        
        if (questions.length === 0) {
            return res.status(500).json({
                success: false,
                message: 'Failed to generate quiz. Please try again.'
            });
        }
        
        res.json({
            success: true,
            quiz: {
                id: `ai_${Date.now()}`,
                title: `${topic} Quiz (AI Generated)`,
                topic: topic,
                type: 'ai_generated',
                totalQuestions: questions.length,
                questions: questions
            }
        });
        
    } catch (error) {
        console.error('Generate AI quiz error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to generate quiz'
        });
    }
};

// Submit AI-generated quiz
export const submitAIQuiz = async (req, res) => {
    try {
        const userId = req.user.id;
        const { quizId, topic, questions, answers, score, totalQuestions, timeTaken } = req.body;
        
        const percentage = (score / totalQuestions) * 100;
        
        const { data: attempt, error } = await supabaseAdmin
            .from('quiz_attempts')
            .insert([{
                user_id: userId,
                quiz_id: 0,
                total_questions: totalQuestions,
                score: score,
                correct_count: score,
                percentage: percentage,
                answers: answers,
                time_taken_seconds: timeTaken,
                status: 'completed',
                started_at: new Date(Date.now() - (timeTaken * 1000)).toISOString(),
                completed_at: new Date().toISOString()
            }])
            .select()
            .single();
        
        if (error) throw error;
        
        await updateUserScores(userId, score, totalQuestions, percentage);
        
        res.json({
            success: true,
            result: {
                attemptId: attempt.id,
                score: score,
                totalQuestions: totalQuestions,
                percentage: Math.round(percentage * 100) / 100,
                passed: percentage >= 70
            }
        });
        
    } catch (error) {
        console.error('Submit AI quiz error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to submit quiz'
        });
    }
};

async function updateUserScores(userId, correctCount, totalQuestions, percentage) {
    try {
        const { data: existing } = await supabaseAdmin
            .from('user_scores')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();
        
        if (existing) {
            const newTotalQuizzes = existing.total_quizzes_taken + 1;
            const newTotalQuestions = existing.total_questions_answered + totalQuestions;
            const newCorrectAnswers = existing.correct_answers + correctCount;
            const newAverageScore = ((existing.average_score * existing.total_quizzes_taken) + percentage) / newTotalQuizzes;
            const newPerfectScores = existing.perfect_scores + (percentage === 100 ? 1 : 0);
            
            await supabaseAdmin
                .from('user_scores')
                .update({
                    total_quizzes_taken: newTotalQuizzes,
                    total_questions_answered: newTotalQuestions,
                    correct_answers: newCorrectAnswers,
                    average_score: newAverageScore,
                    perfect_scores: newPerfectScores,
                    last_quiz_date: new Date().toISOString().split('T')[0],
                    updated_at: new Date().toISOString()
                })
                .eq('user_id', userId);
        } else {
            await supabaseAdmin
                .from('user_scores')
                .insert([{
                    user_id: userId,
                    total_quizzes_taken: 1,
                    total_questions_answered: totalQuestions,
                    correct_answers: correctCount,
                    average_score: percentage,
                    perfect_scores: percentage === 100 ? 1 : 0,
                    last_quiz_date: new Date().toISOString().split('T')[0],
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }]);
        }
        
        console.log('✅ User scores updated');
        
    } catch (error) {
        console.error('Error updating user scores:', error);
    }
}