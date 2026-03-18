// backend/src/middleware/auth.js
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase.js';

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
        
        // Get user from Supabase
        const { data: user, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', decoded.userId)
            .single();
        
        if (error || !user) {
            return res.status(403).json({ 
                success: false, 
                message: 'User not found' 
            });
        }
        
        // Attach user to request
        req.user = {
            id: user.id,
            email: user.email,
            name: user.name
        };
        
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({ 
                success: false, 
                message: 'Invalid token' 
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(403).json({ 
                success: false, 
                message: 'Token expired' 
            });
        }
        
        console.error('Auth middleware error:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Authentication failed' 
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