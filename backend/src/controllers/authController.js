// backend/src/controllers/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase, supabaseAdmin } from '../config/supabase.js';

// Generate OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// ============= REGISTER (with OTP stored in DB) =============
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        console.log('📝 Registration attempt:', { name, email });
        
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
                message: 'User already exists' 
            });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Generate OTP
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        
        // Check if pending user exists
        const { data: pendingUser } = await supabase
            .from('pending_users')
            .select('*')
            .eq('email', email)
            .maybeSingle();
        
        if (pendingUser) {
            // Update existing pending user
            await supabaseAdmin
                .from('pending_users')
                .update({
                    name,
                    password: hashedPassword,
                    otp,
                    otp_expiry: otpExpiry,
                    updated_at: new Date().toISOString()
                })
                .eq('email', email);
        } else {
            // Insert new pending user
            await supabaseAdmin
                .from('pending_users')
                .insert([{
                    name,
                    email,
                    password: hashedPassword,
                    otp,
                    otp_expiry: otpExpiry,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }]);
        }
        
        // Show OTP in Render logs
        console.log('\n🔐 =====================================');
        console.log(`   OTP for ${email}: ${otp}`);
        console.log('   Use this OTP to verify your account');
        console.log('=====================================\n');
        
        // Return OTP in response for testing (so user can see it)
        res.status(201).json({ 
            success: true,
            message: 'Registration successful! Please verify with OTP',
            email,
            otp: otp  // For development only
        });
        
    } catch (error) {
        console.error('❌ Registration error:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Registration failed' 
        });
    }
};

// ============= VERIFY OTP =============
export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        
        console.log('🔐 OTP Verification:', { email, otp });
        
        if (!email || !otp) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email and OTP are required' 
            });
        }
        
        // Get pending user
        const { data: pendingUser, error: fetchError } = await supabase
            .from('pending_users')
            .select('*')
            .eq('email', email)
            .eq('otp', otp)
            .single();
        
        if (fetchError || !pendingUser) {
            console.log('❌ Invalid OTP or user not found');
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid OTP' 
            });
        }
        
        // Check expiry
        if (new Date() > new Date(pendingUser.otp_expiry)) {
            console.log('❌ OTP expired');
            return res.status(400).json({ 
                success: false, 
                message: 'OTP has expired. Please request a new one.' 
            });
        }
        
        // Create profile in profiles table
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .insert([{
                email: pendingUser.email,
                name: pendingUser.name,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }])
            .select()
            .single();
        
        if (profileError) {
            console.error('Profile creation error:', profileError);
            throw profileError;
        }
        
        // Delete pending user
        await supabaseAdmin
            .from('pending_users')
            .delete()
            .eq('email', email);
        
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
        
        console.log('✅ Verification successful for:', email);
        
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
            message: 'Verification failed. Please try again.' 
        });
    }
};

// ============= RESEND OTP =============
export const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        
        console.log('🔄 Resend OTP attempt:', email);
        
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
                message: 'No pending registration found for this email' 
            });
        }
        
        // Generate new OTP
        const newOTP = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        
        // Update OTP
        await supabaseAdmin
            .from('pending_users')
            .update({ 
                otp: newOTP, 
                otp_expiry: otpExpiry,
                updated_at: new Date().toISOString()
            })
            .eq('email', email);
        
        console.log(`🔄 New OTP for ${email}: ${newOTP}`);
        
        res.json({ 
            success: true,
            message: 'OTP resent successfully',
            otp: newOTP  // For development
        });
        
    } catch (error) {
        console.error('❌ Resend OTP error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to resend OTP' 
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
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }
        
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