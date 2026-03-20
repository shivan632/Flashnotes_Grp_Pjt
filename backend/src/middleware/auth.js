// backend/src/middleware/auth.js
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase.js';

// backend/src/middleware/auth.js
export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'Authentication required' 
            });
        }
        
        // Verify JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('🔑 Decoded token:', decoded);
        
        // Get user ID from token (try different possible field names)
        const userId = decoded.userId || decoded.sub || decoded.id;
        console.log('👤 User ID from token:', userId);
        
        // Get user from Supabase
        const { data: user, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
        
        if (error || !user) {
            console.error('❌ User not found:', error);
            return res.status(403).json({ 
                success: false, 
                message: 'User not found' 
            });
        }
        
        req.user = {
            id: user.id,
            email: user.email,
            name: user.name
        };
        
        console.log('✅ User authenticated:', req.user.id);
        next();
        
    } catch (error) {
        console.error('❌ Auth error:', error);
        return res.status(403).json({ 
            success: false, 
            message: 'Invalid token' 
        });
    }
};

// Optional authentication (doesn't require token)
export const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const { data: user } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', decoded.userId)
                .single();
            
            if (user) {
                req.user = {
                    id: user.id,
                    email: user.email,
                    name: user.name
                };
            }
        }
        next();
    } catch (error) {
        // Just continue without user
        next();
    }
};