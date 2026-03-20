// backend/src/controllers/quizController.js
import { supabase, supabaseAdmin } from '../config/supabase.js';

// Get all available quizzes
export const getAllQuizzes = async (req, res) => {
    try {
        const { data: quizzes, error } = await supabase
            .from('quizzes')
            .select('*')
            .eq('is_active', true)
            .order('id');

        if (error) throw error;

        // Get best scores for each quiz for this user
        const userId = req.user.id;
        const { data: attempts } = await supabase
            .from('quiz_attempts')
            .select('quiz_id, percentage')
            .eq('user_id', userId)
            .eq('status', 'completed');

        // Add best score to each quiz
        const quizzesWithScores = quizzes.map(quiz => {
            const userAttempts = attempts?.filter(a => a.quiz_id === quiz.id) || [];
            const bestScore = userAttempts.length > 0 
                ? Math.max(...userAttempts.map(a => a.percentage))
                : null;
            
            return {
                ...quiz,
                bestScore: bestScore ? Math.round(bestScore) : null
            };
        });

        res.json({
            success: true,
            quizzes: quizzesWithScores
        });

    } catch (error) {
        console.error('Get quizzes error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch quizzes'
        });
    }
};

// Get single quiz by ID
export const getQuizById = async (req, res) => {
    try {
        const quizId = req.params.id;

        const { data: quiz, error } = await supabase
            .from('quizzes')
            .select('*')
            .eq('id', quizId)
            .eq('is_active', true)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return res.status(404).json({
                    success: false,
                    message: 'Quiz not found'
                });
            }
            throw error;
        }

        res.json({
            success: true,
            quiz
        });

    } catch (error) {
        console.error('Get quiz error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch quiz'
        });
    }
};

// Get questions for a specific quiz
export const getQuizQuestions = async (req, res) => {
    try {
        const quizId = req.params.id;

        const { data: questions, error } = await supabase
            .from('quiz_questions')
            .select('id, question, options, points')
            .eq('quiz_id', quizId)
            .order('id');

        if (error) throw error;

        res.json({
            success: true,
            questions
        });

    } catch (error) {
        console.error('Get questions error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch questions'
        });
    }
};

// Start a new quiz attempt
export const startQuiz = async (req, res) => {
    try {
        const quizId = req.params.id;
        const userId = req.user.id;
        
        console.log('🎯 Starting quiz attempt:');
        console.log('  - Quiz ID:', quizId);
        console.log('  - User ID:', userId);
        
        // Get quiz details
        const { data: quiz, error: quizError } = await supabase
            .from('quizzes')
            .select('total_questions')
            .eq('id', quizId)
            .single();

        if (quizError) {
            console.error('❌ Quiz fetch error:', quizError);
            throw quizError;
        }
        
        // Create new attempt using supabaseAdmin (bypasses RLS)
        const { data: attempt, error } = await supabaseAdmin
            .from('quiz_attempts')
            .insert([{
                user_id: userId,
                quiz_id: parseInt(quizId),
                total_questions: quiz.total_questions,
                status: 'in_progress',
                started_at: new Date().toISOString()
            }])
            .select()
            .single();

        if (error) {
            console.error('❌ Insert error details:', error);
            throw error;
        }
        
        console.log('✅ Quiz attempt created:', attempt.id);
        
        res.json({
            success: true,
            attemptId: attempt.id,
            startedAt: attempt.started_at
        });

    } catch (error) {
        console.error('❌ Start quiz error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to start quiz'
        });
    }
};

// Helper function to update user scores
async function updateUserScores(userId, correctCount, totalQuestions, percentage) {
    try {
        // Get existing scores
        const { data: existing } = await supabaseAdmin
            .from('user_scores')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();
        
        if (existing) {
            // Update existing
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
            // Create new
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
        
        console.log('✅ User scores updated for user:', userId);
        
    } catch (error) {
        console.error('❌ Error updating user scores:', error);
    }
}

// Submit quiz answers
export const submitQuiz = async (req, res) => {
    try {
        const quizId = req.params.id;
        const userId = req.user.id;
        const { attemptId, answers, timeTakenSeconds } = req.body;

        // Get the attempt
        const { data: attempt, error: attemptError } = await supabaseAdmin
            .from('quiz_attempts')
            .select('*')
            .eq('id', attemptId)
            .eq('user_id', userId)
            .eq('quiz_id', quizId)
            .single();

        if (attemptError || !attempt) {
            return res.status(404).json({
                success: false,
                message: 'Quiz attempt not found'
            });
        }

        // Get all questions and correct answers
        const { data: questions, error: questionsError } = await supabase
            .from('quiz_questions')
            .select('id, correct_option, points')
            .eq('quiz_id', quizId);

        if (questionsError) throw questionsError;

        // Calculate score
        let correctCount = 0;
        const questionMap = new Map(questions.map(q => [q.id, q]));

        Object.entries(answers).forEach(([questionId, selectedOption]) => {
            const question = questionMap.get(parseInt(questionId));
            if (question && question.correct_option === selectedOption) {
                correctCount++;
            }
        });

        const totalQuestions = questions.length;
        const percentage = (correctCount / totalQuestions) * 100;

        // Update attempt using supabaseAdmin
        const { data: updatedAttempt, error: updateError } = await supabaseAdmin
            .from('quiz_attempts')
            .update({
                score: correctCount,
                percentage: percentage,
                correct_count: correctCount,
                answers: answers,
                time_taken_seconds: timeTakenSeconds,
                status: 'completed',
                completed_at: new Date().toISOString()
            })
            .eq('id', attemptId)
            .select()
            .single();

        if (updateError) throw updateError;

        // Update user_scores
        await updateUserScores(userId, correctCount, totalQuestions, percentage);

        res.json({
            success: true,
            result: {
                score: correctCount,
                totalQuestions: totalQuestions,
                percentage: Math.round(percentage * 100) / 100,
                correctCount,
                passed: percentage >= 70
            }
        });

    } catch (error) {
        console.error('Submit quiz error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit quiz'
        });
    }
};

// Get user's quiz attempts
export const getQuizAttempts = async (req, res) => {
    try {
        const userId = req.user.id;

        const { data: attempts, error } = await supabase
            .from('quiz_attempts')
            .select(`
                *,
                quizzes (
                    title,
                    topic,
                    difficulty
                )
            `)
            .eq('user_id', userId)
            .eq('status', 'completed')
            .order('completed_at', { ascending: false });

        if (error) throw error;

        res.json({
            success: true,
            attempts
        });

    } catch (error) {
        console.error('Get attempts error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch attempts'
        });
    }
};

// Get specific quiz attempt
export const getQuizAttemptById = async (req, res) => {
    try {
        const attemptId = req.params.attemptId;
        const userId = req.user.id;

        const { data: attempt, error } = await supabase
            .from('quiz_attempts')
            .select(`
                *,
                quizzes (
                    title,
                    topic,
                    difficulty,
                    total_questions
                )
            `)
            .eq('id', attemptId)
            .eq('user_id', userId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return res.status(404).json({
                    success: false,
                    message: 'Attempt not found'
                });
            }
            throw error;
        }

        res.json({
            success: true,
            attempt
        });

    } catch (error) {
        console.error('Get attempt error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch attempt'
        });
    }
};