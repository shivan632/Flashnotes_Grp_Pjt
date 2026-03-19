-- ============================================
-- QUIZ & SCORE SYSTEM TABLES
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. QUIZZES TABLE
CREATE TABLE IF NOT EXISTS quizzes (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    topic TEXT NOT NULL,
    icon TEXT,
    difficulty TEXT CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
    total_questions INTEGER NOT NULL DEFAULT 0,
    time_limit_minutes INTEGER,
    passing_score INTEGER DEFAULT 70,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. QUIZ_QUESTIONS TABLE
CREATE TABLE IF NOT EXISTS quiz_questions (
    id BIGSERIAL PRIMARY KEY,
    quiz_id BIGINT REFERENCES quizzes(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_option INTEGER NOT NULL,
    explanation TEXT,
    points INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. QUIZ_ATTEMPTS TABLE
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    quiz_id BIGINT REFERENCES quizzes(id) ON DELETE CASCADE,
    score INTEGER NOT NULL DEFAULT 0,
    percentage DECIMAL(5,2) NOT NULL DEFAULT 0,
    correct_count INTEGER NOT NULL DEFAULT 0,
    total_questions INTEGER NOT NULL,
    time_taken_seconds INTEGER,
    status TEXT CHECK (status IN ('in_progress', 'completed', 'abandoned')) DEFAULT 'in_progress',
    answers JSONB,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. USER_SCORES TABLE
CREATE TABLE IF NOT EXISTS user_scores (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
    total_quizzes_taken INTEGER DEFAULT 0,
    total_questions_answered INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    average_score DECIMAL(5,2) DEFAULT 0,
    perfect_scores INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_quiz_date DATE,
    total_points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. ACHIEVEMENTS TABLE
CREATE TABLE IF NOT EXISTS achievements (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    criteria JSONB,
    points INTEGER DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. USER_ACHIEVEMENTS TABLE
CREATE TABLE IF NOT EXISTS user_achievements (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    achievement_id BIGINT REFERENCES achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- CREATE INDEXES
CREATE INDEX idx_quiz_attempts_user_id ON quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_quiz_id ON quiz_attempts(quiz_id);
CREATE INDEX idx_quiz_questions_quiz_id ON quiz_questions(quiz_id);
CREATE INDEX idx_user_scores_user_id ON user_scores(user_id);

-- ENABLE RLS
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES
CREATE POLICY "Anyone can view active quizzes" ON quizzes
    FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can view quiz questions" ON quiz_questions
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM quizzes WHERE id = quiz_questions.quiz_id AND is_active = true
    ));

CREATE POLICY "Users can view own quiz attempts" ON quiz_attempts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz attempts" ON quiz_attempts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quiz attempts" ON quiz_attempts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own scores" ON user_scores
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own scores" ON user_scores
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view achievements" ON achievements
    FOR SELECT USING (true);

CREATE POLICY "Users can view own achievements" ON user_achievements
    FOR SELECT USING (auth.uid() = user_id);

-- INSERT SAMPLE QUIZZES
INSERT INTO quizzes (title, description, topic, icon, difficulty, total_questions, time_limit_minutes) VALUES
('Operating System Fundamentals', 'Test your knowledge of OS concepts', 'Operating System', '🖥️', 'Intermediate', 10, 15),
('Database Management Basics', 'Learn about RDBMS, SQL, and more', 'Database', '🗄️', 'Beginner', 8, 12),
('Python Programming', 'Advanced Python concepts and best practices', 'Python', '🐍', 'Advanced', 12, 20),
('JavaScript Essentials', 'Core JavaScript concepts', 'JavaScript', '📜', 'Intermediate', 15, 25),
('Machine Learning Intro', 'Basic ML algorithms and concepts', 'Machine Learning', '🤖', 'Advanced', 10, 18);

-- INSERT SAMPLE ACHIEVEMENTS
INSERT INTO achievements (name, description, icon, points) VALUES
('Quick Learner', 'Complete 5 quizzes in a day', '🏆', 50),
('Perfect Score', 'Get 100% on any quiz', '⭐', 100),
('Streak Master', '7 day learning streak', '🔥', 75),
('Quiz Enthusiast', 'Take 10 quizzes total', '🎯', 30),
('Speed Demon', 'Complete a quiz in under 5 minutes', '⚡', 40);

-- CREATE FUNCTION TO UPDATE USER SCORES
CREATE OR REPLACE FUNCTION update_user_scores()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        INSERT INTO user_scores (user_id, total_quizzes_taken, total_questions_answered, 
                                 correct_answers, average_score, perfect_scores, 
                                 last_quiz_date, total_points)
        VALUES (
            NEW.user_id,
            1,
            NEW.total_questions,
            NEW.correct_count,
            NEW.percentage,
            CASE WHEN NEW.percentage = 100 THEN 1 ELSE 0 END,
            CURRENT_DATE,
            NEW.correct_count * 10
        )
        ON CONFLICT (user_id) DO UPDATE
        SET 
            total_quizzes_taken = user_scores.total_quizzes_taken + 1,
            total_questions_answered = user_scores.total_questions_answered + NEW.total_questions,
            correct_answers = user_scores.correct_answers + NEW.correct_count,
            average_score = (user_scores.average_score * user_scores.total_quizzes_taken + NEW.percentage) / (user_scores.total_quizzes_taken + 1),
            perfect_scores = user_scores.perfect_scores + CASE WHEN NEW.percentage = 100 THEN 1 ELSE 0 END,
            last_quiz_date = CURRENT_DATE,
            total_points = user_scores.total_points + (NEW.correct_count * 10),
            updated_at = NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- CREATE TRIGGER
CREATE TRIGGER on_quiz_completed
    AFTER UPDATE ON quiz_attempts
    FOR EACH ROW
    EXECUTE FUNCTION update_user_scores();