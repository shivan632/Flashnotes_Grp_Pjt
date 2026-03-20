// backend/src/controllers/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase, supabaseAdmin } from '../config/supabase.js';

// Generate OTP (6-digit random number)
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// ============= REGISTER (WITHOUT EMAIL - FAST) =============
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        console.log('📝 Registration attempt:', { name, email });
        
        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }
        
        // Check if user already exists in profiles
        const { data: existingUser } = await supabase
            .from('profiles')
            .select('email')
            .eq('email', email)
            .maybeSingle();
        
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: 'User already exists with this email' 
            });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create profile directly (skip OTP for now)
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .insert([{
                email,
                name,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }])
            .select()
            .single();
        
        if (profileError) {
            console.error('Profile creation error:', profileError);
            throw profileError;
        }
        
        console.log('✅ Profile created:', profile.id);
        
        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: profile.id,
                email: profile.email, 
                name: profile.name 
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );
        
        console.log('✅ Registration successful for:', email);
        
        res.status(201).json({ 
            success: true,
            message: 'Registration successful!',
            token,
            user: {
                id: profile.id,
                name: profile.name,
                email: profile.email
            }
        });
        
    } catch (error) {
        console.error('❌ Registration error:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Registration failed. Please try again.' 
        });
    }
};

// ============= LOGIN =============
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        console.log('🔑 Login attempt:', email);
        
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email and password are required' 
            });
        }
        
        // Get user from profiles
        const { data: user, error: userError } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', email)
            .single();
        
        if (userError || !user) {
            console.log('❌ User not found:', email);
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }
        
        console.log('✅ User found:', user.id);
        
        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: user.id,
                email: user.email, 
                name: user.name 
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );
        
        console.log('✅ Login successful for:', email);
        
        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
        
    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Login failed. Please try again.' 
        });
    }
};

// ============= VERIFY OTP (Placeholder - Not used currently) =============
export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        
        console.log('🔐 OTP Verification:', { email, otp });
        
        // Get pending user
        const { data: pendingUser, error: fetchError } = await supabase
            .from('pending_users')
            .select('*')
            .eq('email', email)
            .eq('otp', otp)
            .single();
        
        if (fetchError || !pendingUser) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid OTP' 
            });
        }
        
        // Check expiry
        if (new Date() > new Date(pendingUser.otp_expiry)) {
            return res.status(400).json({ 
                success: false, 
                message: 'OTP has expired' 
            });
        }
        
        // Create profile
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .insert([{
                email: pendingUser.email,
                name: pendingUser.name,
                created_at: new Date().toISOString()
            }])
            .select()
            .single();
        
        if (profileError) throw profileError;
        
        // Delete pending user
        await supabase
            .from('pending_users')
            .delete()
            .eq('email', email);
        
        // Generate token
        const token = jwt.sign(
            { userId: profile.id, email: profile.email, name: profile.name },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        res.json({
            success: true,
            message: 'Email verified successfully',
            token,
            user: {
                id: profile.id,
                name: profile.name,
                email: profile.email
            }
        });
        
    } catch (error) {
        console.error('❌ Verification error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Verification failed' 
        });
    }
};

// ============= RESEND OTP (Placeholder) =============
export const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email is required' 
            });
        }
        
        // Get pending user
        const { data: pendingUser } = await supabase
            .from('pending_users')
            .select('*')
            .eq('email', email)
            .single();
        
        if (!pendingUser) {
            return res.status(404).json({ 
                success: false, 
                message: 'No pending registration found' 
            });
        }
        
        // Generate new OTP
        const newOTP = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        
        // Update OTP
        await supabase
            .from('pending_users')
            .update({ 
                otp: newOTP, 
                otp_expiry: otpExpiry,
                updated_at: new Date().toISOString()
            })
            .eq('email', email);
        
        console.log(`🔄 OTP resent for ${email}: ${newOTP}`);
        
        res.json({ 
            success: true,
            message: 'OTP resent successfully',
            otp: newOTP // Only for testing
        });
        
    } catch (error) {
        console.error('❌ Resend OTP error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to resend OTP' 
        });
    }
};

// ============= FORGOT PASSWORD =============
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email is required' 
            });
        }
        
        const { data: user } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', email)
            .single();
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }
        
        // Generate reset token
        const resetToken = jwt.sign(
            { email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        
        console.log(`🔑 Password reset token for ${email}: ${resetToken}`);
        
        res.json({ 
            success: true,
            message: 'Password reset token generated',
            resetToken // Only for testing
        });
        
    } catch (error) {
        console.error('❌ Forgot password error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to process request' 
        });
    }
};

// ============= RESET PASSWORD =============
export const resetPassword = async (req, res) => {
    try {
        const { email, token, newPassword } = req.body;
        
        if (!email || !token || !newPassword) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }
        
        // Verify token
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (decoded.email !== email) {
                throw new Error('Invalid token');
            }
        } catch (error) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid or expired token' 
            });
        }
        
        // Get user
        const { data: user } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', email)
            .single();
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }
        
        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Update password (simplified - in production update Supabase Auth)
        
        res.json({ 
            success: true,
            message: 'Password reset successful' 
        });
        
    } catch (error) {
        console.error('❌ Reset password error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to reset password' 
        });
    }
};

// ============= LOGOUT =============
export const logout = async (req, res) => {
    try {
        res.json({ 
            success: true,
            message: 'Logged out successfully' 
        });
    } catch (error) {
        console.error('❌ Logout error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Logout failed' 
        });
    }
};