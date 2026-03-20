// backend/src/controllers/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { supabase, supabaseAdmin } from '../config/supabase.js';

// Email configuration
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Generate OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
const sendOTPEmail = async (email, otp, name) => {
    try {
        console.log(`📧 Sending OTP email to: ${email}`);
        
        const mailOptions = {
            from: `"Flashnotes" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Flashnotes Email Verification',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #1F2937; border-radius: 10px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #3B82F6; font-size: 32px; margin: 0;">Flashnotes</h1>
                        <p style="color: #E5E7EB; font-size: 16px;">Your AI-Powered Learning Companion</p>
                    </div>
                    
                    <div style="background-color: #111827; padding: 30px; border-radius: 8px;">
                        <h2 style="color: #E5E7EB; margin-top: 0;">Hello ${name || 'there'}!</h2>
                        <p style="color: #9CA3AF; font-size: 16px; line-height: 1.5;">
                            Thank you for registering with Flashnotes. Please verify your email address using the OTP below:
                        </p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <div style="background: linear-gradient(135deg, #3B82F6, #A78BFA); padding: 20px; border-radius: 8px; display: inline-block;">
                                <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: white;">${otp}</span>
                            </div>
                        </div>
                        
                        <p style="color: #9CA3AF; font-size: 14px; line-height: 1.5;">
                            This OTP will expire in <strong style="color: #60A5FA;">10 minutes</strong>.
                        </p>
                        
                        <hr style="border: 1px solid #374151; margin: 20px 0;">
                        
                        <p style="color: #6B7280; font-size: 12px; text-align: center;">
                            If you didn't create an account with Flashnotes, please ignore this email.
                        </p>
                    </div>
                </div>
            `
        };
        
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ OTP email sent to ${email}. Message ID: ${info.messageId}`);
        return true;
        
    } catch (error) {
        console.error('❌ Failed to send OTP email:', error.message);
        return false;
    }
};

// ============= REGISTER =============
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
        
        // Check if user exists in profiles
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
        
        // Check if user is already pending
        const { data: pendingUser } = await supabase
            .from('pending_users')
            .select('*')
            .eq('email', email)
            .maybeSingle();
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Generate OTP
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        
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
        
        // SEND OTP EMAIL (THIS IS THE KEY FIX)
        console.log(`📧 Attempting to send OTP to ${email}...`);
        const emailSent = await sendOTPEmail(email, otp, name);
        
        if (!emailSent) {
            console.warn('⚠️ Email sending failed, but registration continues. OTP available in logs.');
        }
        
        // Show OTP in console (for debugging)
        console.log(`\n🔐 =====================================`);
        console.log(`   OTP for ${email}: ${otp}`);
        console.log(`   Email sent: ${emailSent ? '✅ YES' : '❌ NO'}`);
        console.log(`=====================================\n`);
        
        res.status(201).json({ 
            success: true,
            message: emailSent 
                ? 'Registration successful! Please check your email for OTP.'
                : 'Registration successful! Check console for OTP (email failed).',
            email,
            otp: otp // For development only
        });
        
    } catch (error) {
        console.error('❌ Registration error:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Registration failed. Please try again.' 
        });
    }
};

// ============= RESEND OTP =============
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
        
        // Send new OTP email
        const emailSent = await sendOTPEmail(email, newOTP, pendingUser.name);
        
        console.log(`🔄 Resent OTP to ${email}: ${newOTP} (Email sent: ${emailSent})`);
        
        res.json({ 
            success: true,
            message: emailSent 
                ? 'OTP resent successfully! Please check your email.'
                : 'OTP resent. Check console for code.',
            otp: newOTP
        });
        
    } catch (error) {
        console.error('❌ Resend OTP error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to resend OTP' 
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
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid OTP' 
            });
        }
        
        // Check expiry
        if (new Date() > new Date(pendingUser.otp_expiry)) {
            return res.status(400).json({ 
                success: false, 
                message: 'OTP has expired. Please request a new one.' 
            });
        }
        
        // Create profile
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
        
        const resetToken = jwt.sign(
            { email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        
        const resetLink = `${process.env.FRONTEND_URL}/#/reset-password?token=${resetToken}&email=${email}`;
        
        await transporter.sendMail({
            from: `"Flashnotes" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Flashnotes Password Reset',
            html: `<h2>Reset Your Password</h2><p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
        });
        
        res.json({ success: true, message: 'Password reset email sent' });
        
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ success: false, message: 'Failed to send reset email' });
    }
};

// ============= RESET PASSWORD =============
export const resetPassword = async (req, res) => {
    try {
        const { email, token, newPassword } = req.body;
        
        if (!email || !token || !newPassword) {
            return res.status(400).json({ success: false, message: 'All fields required' });
        }
        
        try {
            jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return res.status(400).json({ success: false, message: 'Invalid or expired token' });
        }
        
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        await supabaseAdmin
            .from('profiles')
            .update({ password: hashedPassword, updated_at: new Date().toISOString() })
            .eq('email', email);
        
        res.json({ success: true, message: 'Password reset successful' });
        
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ success: false, message: 'Failed to reset password' });
    }
};

// ============= LOGOUT =============
export const logout = async (req, res) => {
    res.json({ success: true, message: 'Logged out successfully' });
};