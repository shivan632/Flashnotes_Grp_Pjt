// backend/src/controllers/authController.js
import { supabase } from '../config/supabase.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// OTP Storage
const otpStore = new Map();

// Track last resend time per email (prevent double resend)
let lastResendTime = new Map();

// Email transporter with higher timeouts for Render
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true' || false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 60000,
    greetingTimeout: 60000,
    socketTimeout: 60000,
    pool: true,
    maxConnections: 1,
    tls: {
        rejectUnauthorized: false
    }
});

// Generate 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email with retry logic
const sendOTPEmail = async (email, otp, retries = 2) => {
    const mailOptions = {
        from: `"Flashnotes" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Flashnotes - Email Verification Code',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #111827; color: #E5E7EB; border-radius: 12px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <div style="background: linear-gradient(135deg, #3B82F6, #A78BFA); width: 60px; height: 60px; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center;">
                        <svg style="width: 30px; height: 30px; color: white;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                    </div>
                    <h2 style="color: #3B82F6; margin-top: 15px;">Flashnotes Verification</h2>
                </div>
                
                <div style="background: #1F2937; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                    <p style="margin-bottom: 15px;">Hello,</p>
                    <p style="margin-bottom: 15px;">Use the following verification code to complete your registration:</p>
                    <div style="text-align: center; margin: 25px 0;">
                        <div style="background: #111827; padding: 15px; border-radius: 10px; display: inline-block;">
                            <span style="font-size: 36px; font-family: monospace; font-weight: bold; letter-spacing: 8px; color: #60A5FA;">${otp}</span>
                        </div>
                    </div>
                    <p style="margin-bottom: 15px;">This code will expire in <strong style="color: #F59E0B;">5 minutes</strong>.</p>
                    <p style="margin-bottom: 5px;">If you didn't request this code, please ignore this email.</p>
                </div>
                
                <div style="text-align: center; font-size: 12px; color: #6B7280;">
                    <p>© 2026 Flashnotes. All rights reserved.</p>
                </div>
            </div>
        `,
    };

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            console.log(`📧 Email attempt ${attempt} for ${email}...`);
            await transporter.sendMail(mailOptions);
            console.log('✅ OTP email sent to:', email);
            return true;
        } catch (error) {
            console.error(`❌ Email attempt ${attempt} failed:`, error.message);
            if (attempt === retries) {
                console.log('📝 [DEV] OTP for', email, ':', otp);
                return false;
            }
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
    return false;
};

// ============= REGISTER =============
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        console.log('📝 Registration attempt:', { name, email });

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        const { data: existingUser } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .maybeSingle();

        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

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

        const otp = generateOTP();
        console.log('🔐 Generated OTP:', otp);
        
        otpStore.set(email, {
            otp,
            expiresAt: Date.now() + 5 * 60 * 1000,
            attempts: 0,
            userId: newUser.id,
        });
        console.log('📦 OTP stored for:', email);

        const emailSent = await sendOTPEmail(email, otp);
        console.log('📧 Email sent status:', emailSent);

        res.status(201).json({
            success: true,
            message: 'Registration successful! Please verify your email with the OTP sent.',
            email: email,
            requiresVerification: true,
            otp: otp
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

        console.log('🔐 Login attempt:', { email });

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const { data: user } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .maybeSingle();

        if (!user) {
            console.log('❌ User not found:', email);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        console.log('✅ User found:', user.id);

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            console.log('❌ Invalid password for:', email);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if (!user.email_verified) {
            console.log('⚠️ Email not verified:', email);
            
            const otp = generateOTP();
            console.log('🔐 New OTP generated:', otp);
            
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

        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        console.log('✅ Login successful for:', email);

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
        console.error('❌ Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
};

// ============= VERIFY OTP =============
export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        console.log('🔐 OTP Verification attempt for:', email);
        console.log('📝 Received OTP:', otp);

        if (!email || !otp) {
            return res.status(400).json({ error: 'Email and OTP are required' });
        }

        const storedData = otpStore.get(email);
        console.log('📦 Stored OTP data:', storedData ? { 
            otp: storedData.otp, 
            expiresAt: storedData.expiresAt,
            attempts: storedData.attempts 
        } : 'No OTP found');

        if (!storedData) {
            console.log('❌ No OTP found for:', email);
            return res.status(400).json({ error: 'No OTP found. Please request a new one.' });
        }

        if (Date.now() > storedData.expiresAt) {
            console.log('❌ OTP expired for:', email);
            otpStore.delete(email);
            return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
        }

        if (storedData.attempts >= 5) {
            console.log('❌ Too many attempts for:', email);
            otpStore.delete(email);
            return res.status(400).json({ error: 'Too many attempts. Please request a new OTP.' });
        }

        if (storedData.otp !== otp) {
            storedData.attempts++;
            otpStore.set(email, storedData);
            console.log('❌ Invalid OTP for:', email, `(Attempt ${storedData.attempts}/5)`);
            return res.status(400).json({ error: 'Invalid OTP. Please try again.' });
        }

        console.log('✅ OTP verified for:', email);

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
            console.error('❌ Update error:', updateError);
            return res.status(500).json({ error: 'Failed to update user' });
        }

        otpStore.delete(email);
        console.log('🗑️ OTP cleared from store for:', email);

        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        console.log('✅ Verification successful for:', email);

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
        console.error('❌ OTP verification error:', error);
        res.status(500).json({ error: 'Verification failed' });
    }
};

// ============= RESEND OTP =============
export const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        console.log('🔄 Resend OTP requested for:', email);

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // Check if resend was made recently (within 5 seconds)
        const lastTime = lastResendTime.get(email);
        const now = Date.now();
        if (lastTime && (now - lastTime) < 5000) {
            console.log('⚠️ Resend blocked - too soon after previous request');
            return res.status(429).json({ 
                error: 'Please wait a few seconds before requesting again' 
            });
        }
        lastResendTime.set(email, now);

        const { data: user } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .maybeSingle();

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const otp = generateOTP();
        console.log('🔐 New OTP generated:', otp);

        otpStore.set(email, {
            otp,
            expiresAt: Date.now() + 5 * 60 * 1000,
            attempts: 0,
            userId: user.id,
        });

        const emailSent = await sendOTPEmail(email, otp);

        res.json({
            success: true,
            message: 'New OTP sent to your email',
            otp: otp,
            emailSent: emailSent
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
    let deletedCount = 0;
    for (const [email, data] of otpStore.entries()) {
        if (now > data.expiresAt) {
            otpStore.delete(email);
            deletedCount++;
        }
    }
    if (deletedCount > 0) {
        console.log(`🗑️ Cleaned up ${deletedCount} expired OTPs`);
    }
}, 60000);

console.log('✅ Auth controller loaded with email retry logic');