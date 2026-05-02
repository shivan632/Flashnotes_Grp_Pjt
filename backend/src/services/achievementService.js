// backend/src/services/achievementService.js
import { supabaseAdmin } from '../config/supabase.js';

class AchievementService {
    /**
     * Check and award achievements for a user
     */
    async checkAndAwardAchievements(userId, action, data = {}) {
        try {
            console.log(`🏆 Checking achievements for user ${userId} after action: ${action}`);
            
            // Get all achievements
            const { data: achievements, error } = await supabaseAdmin
                .from('achievements')
                .select('*');
            
            if (error) throw error;
            
            // Get user's current stats
            const userStats = await this.getUserStats(userId);
            
            // Get already earned achievements
            const { data: earnedAchievements, error: earnedError } = await supabaseAdmin
                .from('user_achievements')
                .select('achievement_id')
                .eq('user_id', userId);
            
            if (earnedError) throw earnedError;
            
            const earnedIds = new Set(earnedAchievements.map(e => e.achievement_id));
            
            // Check each achievement
            const newlyEarned = [];
            
            for (const achievement of achievements) {
                if (earnedIds.has(achievement.id)) continue;
                
                let isEarned = false;
                let progress = 0;
                const criteria = achievement.criteria || {};
                const reqType = criteria.type;
                const reqValue = criteria.value;
                
                switch (reqType) {
                    case 'quiz_count':
                        isEarned = userStats.quiz_count >= reqValue;
                        progress = Math.min(100, (userStats.quiz_count / reqValue) * 100);
                        break;
                        
                    case 'perfect_score':
                        isEarned = userStats.perfect_scores >= reqValue;
                        progress = Math.min(100, (userStats.perfect_scores / reqValue) * 100);
                        break;
                        
                    case 'streak_days':
                        isEarned = userStats.current_streak >= reqValue;
                        progress = Math.min(100, (userStats.current_streak / reqValue) * 100);
                        break;
                        
                    case 'voice_notes':
                        isEarned = userStats.voice_notes_count >= reqValue;
                        progress = Math.min(100, (userStats.voice_notes_count / reqValue) * 100);
                        break;
                        
                    case 'saved_notes':
                        isEarned = userStats.saved_notes_count >= reqValue;
                        progress = Math.min(100, (userStats.saved_notes_count / reqValue) * 100);
                        break;
                }
                
                // Save progress even if not earned yet
                if (progress > 0) {
                    await this.updateProgress(userId, achievement.id, progress);
                }
                
                if (isEarned) {
                    await this.awardAchievement(userId, achievement);
                    newlyEarned.push(achievement);
                }
            }
            
            // Update user's total points
            if (newlyEarned.length > 0) {
                const totalPoints = newlyEarned.reduce((sum, a) => sum + (a.points || 0), 0);
                await this.updateUserPoints(userId, totalPoints);
            }
            
            return newlyEarned;
            
        } catch (error) {
            console.error('Achievement check error:', error);
            return [];
        }
    }
    
    async getUserStats(userId) {
        // Get quiz stats from quiz_attempts
        const { data: quizAttempts } = await supabaseAdmin
            .from('quiz_attempts')
            .select('score, total_questions, percentage')
            .eq('user_id', userId);
        
        const quizCount = quizAttempts?.length || 0;
        const perfectScores = quizAttempts?.filter(a => a.percentage === 100 || a.score === a.total_questions).length || 0;
        
        // Get streak from user_scores
        const { data: userScore } = await supabaseAdmin
            .from('user_scores')
            .select('current_streak')
            .eq('user_id', userId)
            .maybeSingle();
        
        // Get voice notes count
        const { count: voiceNotesCount } = await supabaseAdmin
            .from('voice_notes')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId);
        
        // Get saved notes count
        const { count: savedNotesCount } = await supabaseAdmin
            .from('saved_notes')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId);
        
        return {
            quiz_count: quizCount,
            perfect_scores: perfectScores,
            current_streak: userScore?.current_streak || 0,
            voice_notes_count: voiceNotesCount || 0,
            saved_notes_count: savedNotesCount || 0
        };
    }
    
    async updateProgress(userId, achievementId, progress) {
        // Check if record exists
        const { data: existing } = await supabaseAdmin
            .from('user_achievements')
            .select('id')
            .eq('user_id', userId)
            .eq('achievement_id', achievementId)
            .maybeSingle();
        
        if (existing) {
            await supabaseAdmin
                .from('user_achievements')
                .update({ progress_current: Math.floor(progress) })
                .eq('user_id', userId)
                .eq('achievement_id', achievementId);
        } else {
            await supabaseAdmin
                .from('user_achievements')
                .insert({
                    user_id: userId,
                    achievement_id: achievementId,
                    progress_current: Math.floor(progress)
                });
        }
    }
    
    async awardAchievement(userId, achievement) {
        // Check if already earned
        const { data: existing } = await supabaseAdmin
            .from('user_achievements')
            .select('id')
            .eq('user_id', userId)
            .eq('achievement_id', achievement.id)
            .eq('earned_at', null)
            .maybeSingle();
        
        if (existing) {
            // Update existing record with earned_at
            const { data, error } = await supabaseAdmin
                .from('user_achievements')
                .update({ 
                    earned_at: new Date().toISOString(),
                    progress_current: 100
                })
                .eq('user_id', userId)
                .eq('achievement_id', achievement.id)
                .select()
                .single();
            
            if (!error) {
                console.log(`🏆 Achievement awarded: ${achievement.name} to user ${userId}`);
                
                // Create notification
                await supabaseAdmin
                    .from('notifications')
                    .insert({
                        user_id: userId,
                        title: '🏆 New Achievement Unlocked!',
                        message: `You earned the "${achievement.name}" achievement! (+${achievement.points || 10} points)`,
                        type: 'achievement',
                        read: false,
                        created_at: new Date().toISOString()
                    });
            }
            
            return data;
        }
        
        return null;
    }
    
    async updateUserPoints(userId, points) {
        const { data: existing } = await supabaseAdmin
            .from('user_scores')
            .select('total_points')
            .eq('user_id', userId)
            .maybeSingle();
        
        if (existing) {
            await supabaseAdmin
                .from('user_scores')
                .update({ total_points: existing.total_points + points })
                .eq('user_id', userId);
        } else {
            await supabaseAdmin
                .from('user_scores')
                .insert({ user_id: userId, total_points: points });
        }
    }
    
    async getUserAchievements(userId) {
        // Get all achievements
        const { data: achievements } = await supabaseAdmin
            .from('achievements')
            .select('*')
            .order('id');
        
        // Get user's achievements
        const { data: userAchievements } = await supabaseAdmin
            .from('user_achievements')
            .select('*')
            .eq('user_id', userId);
        
        const userAchievementMap = new Map();
        userAchievements?.forEach(ua => {
            userAchievementMap.set(ua.achievement_id, ua);
        });
        
        const earnedCount = userAchievements?.filter(ua => ua.earned_at).length || 0;
        const totalPoints = userAchievements
            ?.filter(ua => ua.earned_at)
            .reduce((sum, ua) => {
                const ach = achievements?.find(a => a.id === ua.achievement_id);
                return sum + (ach?.points || 0);
            }, 0) || 0;
        
        return {
            achievements: achievements?.map(achievement => {
                const userProgress = userAchievementMap.get(achievement.id);
                return {
                    id: achievement.id,
                    name: achievement.name,
                    description: achievement.description,
                    icon: achievement.icon,
                    points: achievement.points,
                    earned: !!userProgress?.earned_at,
                    earnedAt: userProgress?.earned_at,
                    progress: userProgress ? {
                        current: userProgress.progress_current || 0,
                        total: 100
                    } : null
                };
            }) || [],
            stats: {
                total: achievements?.length || 0,
                earned: earnedCount,
                percentage: achievements?.length ? (earnedCount / achievements.length) * 100 : 0,
                total_points: totalPoints
            }
        };
    }
}

export default new AchievementService();