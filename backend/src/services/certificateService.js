// backend/src/services/certificateService.js
import { supabaseAdmin } from '../config/supabase.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMPLATES_DIR = path.join(__dirname, '../templates');

// Certificate type configurations
const CERTIFICATE_STYLES = {
    quiz_master: {
        icon: '🎯',
        gradient_from: '#8B5CF6',
        gradient_to: '#EC4899',
        title: 'QUIZ MASTER CERTIFICATE'
    },
    perfect_score: {
        icon: '⭐',
        gradient_from: '#F59E0B',
        gradient_to: '#F97316',
        title: 'PERFECT SCORE CERTIFICATE'
    },
    roadmap_completer: {
        icon: '🗺️',
        gradient_from: '#10B981',
        gradient_to: '#14B8A6',
        title: 'ROADMAP MASTER CERTIFICATE'
    },
    points_milestone: {
        icon: '🏆',
        gradient_from: '#FBBF24',
        gradient_to: '#F59E0B',
        title: 'POINTS CHAMPION CERTIFICATE'
    },
    voice_note_master: {
        icon: '🎤',
        gradient_from: '#3B82F6',
        gradient_to: '#06B6D4',
        title: 'VOICE NOTE MASTER CERTIFICATE'
    },
    achievement_hunter: {
        icon: '🏅',
        gradient_from: '#EF4444',
        gradient_to: '#F97316',
        title: 'ACHIEVEMENT HUNTER CERTIFICATE'
    }
};

// Generate certificate HTML from template
export function generateCertificateHTML(certificate, userName) {
    try {
        const templatePath = path.join(TEMPLATES_DIR, 'certificateTemplate.html');
        
        // Check if template exists
        if (!fs.existsSync(templatePath)) {
            console.error('Template not found:', templatePath);
            return `<h1>${certificate.title}</h1><p>Presented to: ${userName}</p><p>Certificate ID: ${certificate.certificate_number}</p>`;
        }
        
        let template = fs.readFileSync(templatePath, 'utf8');
        
        const style = CERTIFICATE_STYLES[certificate.type] || CERTIFICATE_STYLES.quiz_master;
        const earnedDate = new Date(certificate.earned_at).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
        
        let html = template;
        html = html.replace(/{{title}}/g, certificate.title || style.title);
        html = html.replace(/{{description}}/g, certificate.description || '');
        html = html.replace(/{{user_name}}/g, userName);
        html = html.replace(/{{earned_date}}/g, earnedDate);
        html = html.replace(/{{certificate_number}}/g, certificate.certificate_number);
        html = html.replace(/{{icon}}/g, style.icon);
        html = html.replace(/{{gradient_from}}/g, style.gradient_from);
        html = html.replace(/{{gradient_to}}/g, style.gradient_to);
        
        return html;
    } catch (error) {
        console.error('Generate certificate HTML error:', error);
        return `<h1>${certificate.title}</h1><p>Presented to: ${userName}</p><p>Certificate ID: ${certificate.certificate_number}</p>`;
    }
}

// Get all certificates for a user
export async function getUserCertificates(userId) {
    try {
        const { data, error } = await supabaseAdmin
            .from('certificates')
            .select('*')
            .eq('user_id', userId)
            .order('earned_at', { ascending: false });

        if (error) throw error;
        return { success: true, certificates: data || [] };
    } catch (error) {
        console.error('Get user certificates error:', error);
        return { success: false, certificates: [], error: error.message };
    }
}

// Get single certificate by ID
export async function getCertificateById(certificateId, userId) {
    try {
        const { data, error } = await supabaseAdmin
            .from('certificates')
            .select('*')
            .eq('id', certificateId)
            .eq('user_id', userId)
            .single();

        if (error) throw error;
        return { success: true, certificate: data };
    } catch (error) {
        console.error('Get certificate by ID error:', error);
        return { success: false, certificate: null, error: error.message };
    }
}

// Check and award new certificates
export async function checkAndAwardCertificates(userId) {
    try {
        // Get existing certificates
        const { data: existing } = await supabaseAdmin
            .from('certificates')
            .select('type')
            .eq('user_id', userId);
        
        const earnedTypes = new Set(existing?.map(c => c.type) || []);
        const newCertificates = [];
        
        // Get user stats
        const { data: quizAttempts } = await supabaseAdmin
            .from('quiz_attempts')
            .select('percentage')
            .eq('user_id', userId);
        
        const { data: voiceNotes } = await supabaseAdmin
            .from('voice_notes')
            .select('id')
            .eq('user_id', userId);
        
        const { data: achievements } = await supabaseAdmin
            .from('user_achievements')
            .select('id')
            .eq('user_id', userId)
            .not('earned_at', 'is', null);
        
        const { data: userScores } = await supabaseAdmin
            .from('user_scores')
            .select('total_points')
            .eq('user_id', userId)
            .single();
        
        const { data: roadmaps } = await supabaseAdmin
            .from('roadmaps')
            .select('id')
            .eq('user_id', userId);
        
        const quizCount = quizAttempts?.length || 0;
        const perfectScore = quizAttempts?.some(a => a.percentage === 100) || false;
        const voiceCount = voiceNotes?.length || 0;
        const achievementCount = achievements?.length || 0;
        const totalPoints = userScores?.total_points || 0;
        const hasRoadmap = roadmaps?.length > 0 || false;
        
        // Quiz Master (10+ quizzes)
        if (quizCount >= 10 && !earnedTypes.has('quiz_master')) {
            const { data: newCert } = await supabaseAdmin
                .from('certificates')
                .insert({
                    user_id: userId,
                    type: 'quiz_master',
                    title: 'Quiz Master Certificate',
                    description: 'Completed 10+ quizzes on FlashNotes'
                })
                .select()
                .single();
            if (newCert) newCertificates.push(newCert);
        }
        
        // Perfect Score
        if (perfectScore && !earnedTypes.has('perfect_score')) {
            const { data: newCert } = await supabaseAdmin
                .from('certificates')
                .insert({
                    user_id: userId,
                    type: 'perfect_score',
                    title: 'Perfect Score Certificate',
                    description: 'Achieved 100% score on a quiz'
                })
                .select()
                .single();
            if (newCert) newCertificates.push(newCert);
        }
        
        // Points Champion (500+ points)
        if (totalPoints >= 500 && !earnedTypes.has('points_milestone')) {
            const { data: newCert } = await supabaseAdmin
                .from('certificates')
                .insert({
                    user_id: userId,
                    type: 'points_milestone',
                    title: 'Points Champion Certificate',
                    description: 'Earned 500+ total points'
                })
                .select()
                .single();
            if (newCert) newCertificates.push(newCert);
        }
        
        // Voice Note Master (20+ voice notes)
        if (voiceCount >= 20 && !earnedTypes.has('voice_note_master')) {
            const { data: newCert } = await supabaseAdmin
                .from('certificates')
                .insert({
                    user_id: userId,
                    type: 'voice_note_master',
                    title: 'Voice Note Master Certificate',
                    description: 'Created 20+ voice notes'
                })
                .select()
                .single();
            if (newCert) newCertificates.push(newCert);
        }
        
        // Achievement Hunter (10+ achievements)
        if (achievementCount >= 10 && !earnedTypes.has('achievement_hunter')) {
            const { data: newCert } = await supabaseAdmin
                .from('certificates')
                .insert({
                    user_id: userId,
                    type: 'achievement_hunter',
                    title: 'Achievement Hunter Certificate',
                    description: 'Unlocked 10+ achievements'
                })
                .select()
                .single();
            if (newCert) newCertificates.push(newCert);
        }
        
        // Roadmap Completer
        if (hasRoadmap && !earnedTypes.has('roadmap_completer')) {
            const { data: newCert } = await supabaseAdmin
                .from('certificates')
                .insert({
                    user_id: userId,
                    type: 'roadmap_completer',
                    title: 'Roadmap Master Certificate',
                    description: 'Completed a learning roadmap'
                })
                .select()
                .single();
            if (newCert) newCertificates.push(newCert);
        }
        
        return { success: true, newCertificates };
    } catch (error) {
        console.error('Check and award certificates error:', error);
        return { success: false, newCertificates: [], error: error.message };
    }
}

// Increment download count
export async function incrementDownloadCount(certificateId, userId) {
    try {
        const { data: existing, error: fetchError } = await supabaseAdmin
            .from('certificates')
            .select('download_count')
            .eq('id', certificateId)
            .eq('user_id', userId)
            .single();
        
        if (fetchError) throw fetchError;
        
        const currentCount = existing?.download_count || 0;
        const newCount = currentCount + 1;
        
        const { error: updateError } = await supabaseAdmin
            .from('certificates')
            .update({ download_count: newCount })
            .eq('id', certificateId)
            .eq('user_id', userId);
        
        if (updateError) throw updateError;
        
        console.log(`✅ Download count updated: ${currentCount} → ${newCount}`);
        return { success: true };
    } catch (error) {
        console.error('Error updating download count:', error);
        return { success: false, error: error.message };
    }
}

// Increment share count
export async function incrementShareCount(certificateId, userId) {
    try {
        const { data: existing, error: fetchError } = await supabaseAdmin
            .from('certificates')
            .select('share_count')
            .eq('id', certificateId)
            .eq('user_id', userId)
            .single();
        
        if (fetchError) throw fetchError;
        
        const currentCount = existing?.share_count || 0;
        const newCount = currentCount + 1;
        
        const { error: updateError } = await supabaseAdmin
            .from('certificates')
            .update({ share_count: newCount })
            .eq('id', certificateId)
            .eq('user_id', userId);
        
        if (updateError) throw updateError;
        
        console.log(`✅ Share count updated: ${currentCount} → ${newCount}`);
        return { success: true };
    } catch (error) {
        console.error('Error updating share count:', error);
        return { success: false, error: error.message };
    }
}

export default {
    getUserCertificates,
    getCertificateById,
    checkAndAwardCertificates,
    generateCertificateHTML,
    incrementDownloadCount,
    incrementShareCount
};