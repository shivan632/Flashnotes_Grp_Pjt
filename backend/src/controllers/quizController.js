// backend/src/controllers/quizController.js
import { supabase, supabaseAdmin } from '../config/supabase.js';
import jwt from 'jsonwebtoken';

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

// Start a new quiz attempt - FIXED FOREIGN KEY ERROR
// backend/src/controllers/quizController.js - REPLACE startQuiz function

export const startQuiz = async (req, res) => {
    try {
        const quizId = req.params.id;
        
        // Get user from request (set by auth middleware)
        if (!req.user) {
            console.error('❌ No user in request');
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        const userId = req.user.id;
        const userEmail = req.user.email;
        
        console.log('🎯 Starting quiz attempt:');
        console.log('  - Quiz ID:', quizId);
        console.log('  - User ID:', userId);
        console.log('  - User Email:', userEmail);
        
        // ============= STEP 1: Verify user exists =============
        const { data: userCheck, error: userError } = await supabase
            .from('users')
            .select('id, email, email_verified')
            .eq('id', userId)
            .maybeSingle();
        
        if (userError) {
            console.error('❌ User check error:', userError);
            return res.status(500).json({
                success: false,
                message: 'Database error'
            });
        }
        
        if (!userCheck) {
            console.error('❌ User not found:', userId);
            return res.status(404).json({
                success: false,
                message: 'User not found. Please login again.'
            });
        }
        
        if (!userCheck.email_verified) {
            console.error('❌ Email not verified:', userEmail);
            return res.status(403).json({
                success: false,
                message: 'Please verify your email first.'
            });
        }
        
        console.log('✅ User verified:', userCheck.id);
        
        // ============= STEP 2: Get quiz details =============
        const { data: quiz, error: quizError } = await supabase
            .from('quizzes')
            .select('id, total_questions')
            .eq('id', quizId)
            .single();

        if (quizError) {
            console.error('❌ Quiz fetch error:', quizError);
            return res.status(404).json({
                success: false,
                message: 'Quiz not found'
            });
        }
        
        console.log('✅ Quiz found:', quiz.id);
        
        // ============= STEP 3: Check existing in-progress attempt =============
        const { data: existingAttempt, error: attemptError } = await supabase
            .from('quiz_attempts')
            .select('id, status, started_at')
            .eq('user_id', userId)
            .eq('quiz_id', parseInt(quizId))
            .eq('status', 'in_progress')
            .maybeSingle();
        
        if (existingAttempt) {
            console.log('⚠️ Using existing attempt:', existingAttempt.id);
            return res.json({
                success: true,
                attemptId: existingAttempt.id,
                startedAt: existingAttempt.started_at,
                existing: true
            });
        }
        
        // ============= STEP 4: Create new attempt =============
        const newAttempt = {
            user_id: userId,
            quiz_id: parseInt(quizId),
            total_questions: quiz.total_questions,
            status: 'in_progress',
            started_at: new Date().toISOString(),
            created_at: new Date().toISOString()
        };
        
        console.log('📝 Creating attempt with user_id:', userId);
        
        const { data: attempt, error: insertError } = await supabase
            .from('quiz_attempts')
            .insert([newAttempt])
            .select()
            .single();

        if (insertError) {
            console.error('❌ Insert error:', insertError);
            return res.status(500).json({
                success: false,
                message: 'Failed to start quiz: ' + insertError.message
            });
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

// Submit quiz answers - COMPLETE FIX
export const submitQuiz = async (req, res) => {
    try {
        const quizId = req.params.id;
        const userId = req.user.id;
        const { attemptId, answers, timeTakenSeconds } = req.body;
        
        console.log('📝 Submitting quiz:');
        console.log('  - Quiz ID:', quizId);
        console.log('  - User ID:', userId);
        console.log('  - Attempt ID:', attemptId);
        console.log('  - Answers:', answers);
        console.log('  - Time Taken:', timeTakenSeconds);

        // ============= STEP 1: Verify attempt exists =============
        const { data: attempt, error: attemptError } = await supabase
            .from('quiz_attempts')
            .select('*')
            .eq('id', attemptId)
            .eq('user_id', userId)
            .single();

        if (attemptError || !attempt) {
            console.error('❌ Attempt not found:', attemptError);
            return res.status(404).json({
                success: false,
                message: 'Quiz attempt not found'
            });
        }

        console.log('✅ Attempt found:', attempt.id, 'Status:', attempt.status);

        // ============= STEP 2: Get questions for this quiz =============
        const { data: questions, error: questionsError } = await supabase
            .from('quiz_questions')
            .select('id, correct_option, points')
            .eq('quiz_id', quizId);

        if (questionsError) {
            console.error('❌ Questions fetch error:', questionsError);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch questions'
            });
        }

        console.log('✅ Questions fetched:', questions.length);

        // ============= STEP 3: Calculate score =============
        let correctCount = 0;
        let totalPoints = 0;
        const questionMap = new Map(questions.map(q => [q.id, q]));

        Object.entries(answers).forEach(([questionId, selectedOption]) => {
            const question = questionMap.get(parseInt(questionId));
            if (question && question.correct_option === parseInt(selectedOption)) {
                correctCount++;
                totalPoints += question.points || 10; // Add points if available
                console.log(`  ✅ Question ${questionId}: Correct (+${question.points || 10} points)`);
            } else {
                console.log(`  ❌ Question ${questionId}: Wrong (selected: ${selectedOption}, correct: ${question?.correct_option})`);
            }
        });

        const totalQuestions = questions.length;
        const percentage = (correctCount / totalQuestions) * 100;

        console.log('📊 Score calculation:');
        console.log('  - Correct:', correctCount);
        console.log('  - Total:', totalQuestions);
        console.log('  - Percentage:', percentage);
        console.log('  - Points Earned:', totalPoints);

        // ============= STEP 4: Update attempt =============
        const { data: updatedAttempt, error: updateError } = await supabase
            .from('quiz_attempts')
            .update({
                score: totalPoints, // Store total points
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

        if (updateError) {
            console.error('❌ Update error:', updateError);
            return res.status(500).json({
                success: false,
                message: 'Failed to update attempt: ' + updateError.message
            });
        }

        console.log('✅ Attempt updated:', updatedAttempt.id);

        // ============= STEP 5: Update user scores =============
        try {
            // Call updateUserScores with correct parameters
            await updateUserScores(
                userId,           // user ID
                correctCount,     // correct answers count
                totalQuestions,   // total questions
                percentage,       // percentage score
                totalPoints       // points earned (optional)
            );
            console.log('✅ User scores updated successfully');
        } catch (scoreError) {
            console.error('⚠️ Score update error (non-critical):', scoreError);
            // Don't fail the whole request if score update fails
        }

        res.json({
            success: true,
            result: {
                score: totalPoints,
                correctCount: correctCount,
                totalQuestions: totalQuestions,
                percentage: Math.round(percentage * 100) / 100,
                passed: percentage >= 70
            }
        });

    } catch (error) {
        console.error('❌ Submit quiz error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to submit quiz'
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