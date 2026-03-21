// backend/src/controllers/authController.js
import { supabase } from '../config/supabase.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// OTP Storage
const otpStore = new Map();

// Email transporter
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Generate 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
const sendOTPEmail = async (email, otp) => {
    const mailOptions = {
        from: `"Flashnotes" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Flashnotes - Email Verification Code',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #111827; color: #E5E7EB;">
                <h2 style="color: #3B82F6;">Flashnotes Verification</h2>
                <p>Your verification code is:</p>
                <div style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #60A5FA; padding: 15px; background: #1F2937; border-radius: 8px; text-align: center;">
                    ${otp}
                </div>
                <p>This code will expire in 5 minutes.</p>
            </div>
        `,
    };
    await transporter.sendMail(mailOptions);
};

// ============= REGISTER =============
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        console.log('📝 Registration attempt:', { name, email });

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        // Check if user exists
        const { data: existingUser, error: findError } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .maybeSingle();

        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user in users table
        const { data: newUser, error: createError } = await supabase
            .from('users')
            .insert({
                name,
                email,
                password: hashedPassword,
                email_verified: false,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .select()
            .single();

        if (createError) {
            console.error('❌ User creation error:', createError);
            return res.status(500).json({ error: 'Failed to create user' });
        }

        console.log('✅ User created:', newUser.id);

        // Create profile in profiles table (if exists)
        try {
            const { error: profileError } = await supabase
                .from('profiles')
                .insert({
                    id: newUser.id,
                    username: name.toLowerCase().replace(/\s/g, ''),
                    full_name: name,
                    email: email,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                });
            
            if (profileError) {
                console.log('⚠️ Profile table not found or error:', profileError.message);
                // Don't fail registration if profiles table doesn't exist
            } else {
                console.log('✅ Profile created for user:', newUser.id);
            }
        } catch (profileErr) {
            console.log('⚠️ Profiles table not set up yet');
        }

        // Generate OTP
        const otp = generateOTP();
        
        // Store OTP
        otpStore.set(email, {
            otp,
            expiresAt: Date.now() + 5 * 60 * 1000,
            attempts: 0,
            userId: newUser.id,
        });

        // Send OTP email
        try {
            await sendOTPEmail(email, otp);
            console.log('📧 OTP email sent to:', email);
        } catch (emailError) {
            console.error('❌ Email error:', emailError);
        }

        res.status(201).json({
            success: true,
            message: 'Registration successful! Please verify your email with the OTP sent.',
            email: email,
            requiresVerification: true,
            ...(process.env.NODE_ENV === 'development' && { otp }),
        });

    } catch (error) {
        console.error('❌ Registration error:', error);
        res.status(500).json({ error: error.message || 'Registration failed' });
    }
};

// ============= LOGIN =============
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .maybeSingle();

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check if email is verified
        if (!user.email_verified) {
            const otp = generateOTP();
            otpStore.set(email, {
                otp,
                expiresAt: Date.now() + 5 * 60 * 1000,
                attempts: 0,
                userId: user.id,
            });
            await sendOTPEmail(email, otp);
            
            return res.status(403).json({
                error: 'Email not verified',
                requiresVerification: true,
                email: email,
                ...(process.env.NODE_ENV === 'development' && { otp }),
            });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
            message: 'Login successful!',
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
};

// ============= VERIFY OTP =============
export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ error: 'Email and OTP are required' });
        }

        const storedData = otpStore.get(email);

        if (!storedData) {
            return res.status(400).json({ error: 'No OTP found. Please request a new one.' });
        }

        if (Date.now() > storedData.expiresAt) {
            otpStore.delete(email);
            return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
        }

        if (storedData.attempts >= 5) {
            otpStore.delete(email);
            return res.status(400).json({ error: 'Too many attempts. Please request a new OTP.' });
        }

        if (storedData.otp !== otp) {
            storedData.attempts++;
            otpStore.set(email, storedData);
            return res.status(400).json({ error: 'Invalid OTP. Please try again.' });
        }

        // Update user email_verified
        const { data: user, error: updateError } = await supabase
            .from('users')
            .update({ 
                email_verified: true,
                updated_at: new Date().toISOString(),
            })
            .eq('email', email)
            .select()
            .single();

        if (updateError) {
            console.error('Update error:', updateError);
            return res.status(500).json({ error: 'Failed to update user' });
        }

        otpStore.delete(email);

        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
            message: 'Email verified successfully!',
        });

    } catch (error) {
        console.error('OTP verification error:', error);
        res.status(500).json({ error: 'Verification failed' });
    }
};

// ============= RESEND OTP =============
export const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const { data: user } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .maybeSingle();

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const otp = generateOTP();

        otpStore.set(email, {
            otp,
            expiresAt: Date.now() + 5 * 60 * 1000,
            attempts: 0,
            userId: user.id,
        });

        await sendOTPEmail(email, otp);

        res.json({
            success: true,
            message: 'New OTP sent to your email',
            ...(process.env.NODE_ENV === 'development' && { otp }),
        });

    } catch (error) {
        console.error('Resend OTP error:', error);
        res.status(500).json({ error: 'Failed to resend OTP' });
    }
};

// ============= FORGOT PASSWORD =============
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const { data: user } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .maybeSingle();

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetExpires = Date.now() + 3600000;

        await supabase
            .from('users')
            .update({
                reset_token: resetToken,
                reset_expires: new Date(resetExpires).toISOString(),
            })
            .eq('email', email);

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        
        const mailOptions = {
            from: `"Flashnotes" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Flashnotes - Password Reset',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Reset Your Password</h2>
                    <p>Click the link below to reset your password:</p>
                    <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background: #3B82F6; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
                    <p>This link will expire in 1 hour.</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        res.json({
            success: true,
            message: 'Password reset email sent',
        });

    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ error: 'Failed to send reset email' });
    }
};

// ============= RESET PASSWORD =============
export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ error: 'Token and new password are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        const { data: user } = await supabase
            .from('users')
            .select('*')
            .eq('reset_token', token)
            .maybeSingle();

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired token' });
        }

        if (new Date(user.reset_expires) < new Date()) {
            return res.status(400).json({ error: 'Token has expired' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await supabase
            .from('users')
            .update({
                password: hashedPassword,
                reset_token: null,
                reset_expires: null,
            })
            .eq('id', user.id);

        res.json({
            success: true,
            message: 'Password reset successful!',
        });

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ error: 'Failed to reset password' });
    }
};

// ============= LOGOUT =============
export const logout = async (req, res) => {
    try {
        res.json({
            success: true,
            message: 'Logged out successfully',
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Logout failed' });
    }
};

// Cleanup expired OTPs every minute
setInterval(() => {
    const now = Date.now();
    for (const [email, data] of otpStore.entries()) {
        if (now > data.expiresAt) {
            otpStore.delete(email);
        }
    }
}, 60000);