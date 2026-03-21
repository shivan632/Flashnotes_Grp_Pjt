// backend/src/middleware/auth.js
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase.js';

export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            console.log('❌ No token provided');
            return res.status(401).json({ error: 'Access denied. No token provided.' });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('🔑 Token decoded:', { id: decoded.id, email: decoded.email, name: decoded.name });
        } catch (jwtError) {
            console.error('❌ JWT verification failed:', jwtError.message);
            return res.status(403).json({ error: 'Invalid or expired token. Please login again.' });
        }

        // Find user in database - TRY BOTH ID AND EMAIL
        let user = null;
        
        // First try by ID
        const { data: userById, error: idError } = await supabase
            .from('users')
            .select('id, name, email, email_verified')
            .eq('id', decoded.id)
            .maybeSingle();
        
        if (userById) {
            user = userById;
            console.log('✅ User found by ID:', user.id);
        } 
        
        // If not found by ID, try by email
        if (!user && decoded.email) {
            console.log('⚠️ User not found by ID, trying by email:', decoded.email);
            const { data: userByEmail, error: emailError } = await supabase
                .from('users')
                .select('id, name, email, email_verified')
                .eq('email', decoded.email)
                .maybeSingle();
            
            if (userByEmail) {
                user = userByEmail;
                console.log('✅ User found by email:', user.id);
            }
        }

        if (!user) {
            console.error('❌ User not found in database');
            return res.status(403).json({ error: 'User not found. Please login again.' });
        }

        // Check if email is verified
        if (!user.email_verified) {
            console.error('❌ Email not verified:', user.email);
            return res.status(403).json({ error: 'Please verify your email before continuing.' });
        }

        req.user = user;
        console.log('✅ User authenticated:', user.email);
        next();
        
    } catch (error) {
        console.error('❌ Auth middleware error:', error.message);
        return res.status(500).json({ error: 'Authentication failed.' });
    }
};