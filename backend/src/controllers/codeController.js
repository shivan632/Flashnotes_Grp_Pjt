// backend/src/controllers/codeController.js
import { executeCode } from '../services/geminiCodeService.js';
import { supabase } from '../config/supabase.js';

export const runCode = async (req, res) => {
    try {
        const { code, language } = req.body;
        const userId = req.user.id;

        if (!code || !language) {
            return res.status(400).json({
                success: false,
                message: 'Code and language are required'
            });
        }

        console.log(`📝 Code execution request - User: ${userId}, Language: ${language}`);

        const result = await executeCode(code, language);

        // Save to database - handle table not exists gracefully
        try {
            // First check if table exists by trying to insert
            const { error: insertError } = await supabase
                .from('code_executions')
                .insert({
                    user_id: userId,
                    code: code,
                    language: language,
                    output: result.output || '',
                    error: result.error || '',
                    created_at: new Date().toISOString()
                });
            
            if (insertError) {
                // Table might not exist - log but don't fail
                if (insertError.code === '42P01') {
                    console.log('ℹ️ code_executions table not found. Skipping save.');
                } else {
                    console.error('Failed to save execution:', insertError.message);
                }
            }
        } catch (dbError) {
            // Non-critical error, just log
            console.error('Database save error (non-critical):', dbError.message);
        }

        res.json({
            success: result.success,
            output: result.output || '',
            error: result.error || '',
            message: result.success ? 'Code executed successfully' : 'Execution failed'
        });

    } catch (error) {
        console.error('Code execution error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to execute code'
        });
    }
};

export default { runCode };