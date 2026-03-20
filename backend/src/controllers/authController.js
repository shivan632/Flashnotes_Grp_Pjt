// backend/src/controllers/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sgMail from '@sendgrid/mail';
import { supabase, supabaseAdmin } from '../config/supabase.js';

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Generate OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email using SendGrid
const sendOTPEmail = async (email, otp, name) => {
    try {
        console.log(`📧 Sending OTP email to: ${email} via SendGrid`);
        
        const msg = {
            to: email,
            from: process.env.EMAIL_FROM,
            subject: 'Flashnotes Email Verification',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                    <div style="background-color: #111827; padding: 40px 20px;">
                        <div style="max-width: 600px; margin: 0 auto; background-color: #1F2937; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);">
                            <!-- Header -->
                            <div style="background: linear-gradient(135deg, #3B82F6, #A78BFA); padding: 30px; text-align: center;">
                                <h1 style="color: white; font-size: 32px; margin: 0; font-weight: bold;">Flashnotes</h1>
                                <p style="color: rgba(255,255,255,0.9); font-size: 16px; margin: 10px 0 0 0;">Your AI-Powered Learning Companion</p>
                            </div>
                            
                            <!-- Content -->
                            <div style="padding: 40px 30px;">
                                <h2 style="color: #E5E7EB; font-size: 24px; margin: 0 0 10px 0;">Hello ${name || 'there'}!</h2>
                                <p style="color: #9CA3AF; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                    Thank you for registering with Flashnotes. Please verify your email address using the OTP below:
                                </p>
                                
                                <!-- OTP Box -->
                                <div style="text-align: center; margin: 30px 0;">
                                    <div style="background: linear-gradient(135deg, #3B82F6, #A78BFA); padding: 20px; border-radius: 12px; display: inline-block; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
                                        <span style="font-size: 40px; font-weight: bold; letter-spacing: 8px; color: white; font-family: monospace;">${otp}</span>
                                    </div>
                                </div>
                                
                                <p style="color: #9CA3AF; font-size: 14px; line-height: 1.6; margin: 20px 0;">
                                    This OTP will expire in <strong style="color: #60A5FA;">10 minutes</strong>.
                                </p>
                                
                                <hr style="border: 1px solid #374151; margin: 30px 0;">
                                
                                <p style="color: #6B7280; font-size: 12px; text-align: center; margin: 0;">
                                    If you didn't create an account with Flashnotes, please ignore this email.
                                </p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            `
        };
        
        await sgMail.send(msg);
        console.log(`✅ OTP email sent successfully to ${email}`);
        return true;
        
    } catch (error) {
        console.error('❌ SendGrid error:', error.response?.body || error.message);
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
        
        // Send OTP email
        const emailSent = await sendOTPEmail(email, otp, name);
        
        console.log(`\n🔐 OTP for ${email}: ${otp}`);
        console.log(`📧 Email sent: ${emailSent ? 'YES ✅' : 'NO ❌'}\n`);
        
        res.status(201).json({ 
            success: true,
            message: emailSent 
                ? 'Registration successful! Please check your email for OTP.'
                : 'Registration successful! Check console for OTP.',
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
        
        // Send new OTP email
        const emailSent = await sendOTPEmail(email, newOTP, pendingUser.name);
        
        console.log(`🔄 New OTP for ${email}: ${newOTP}`);
        
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
        
        await sgMail.send({
            to: email,
            from: process.env.EMAIL_FROM,
            subject: 'Flashnotes Password Reset',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #3B82F6;">Reset Your Password</h2>
                    <p>Click the link below to reset your password:</p>
                    <a href="${resetLink}" style="display: inline-block; background: #3B82F6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
                    <p>This link will expire in 1 hour.</p>
                </div>
            `
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
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }
        
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
        
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        await supabaseAdmin
            .from('profiles')
            .update({ 
                password: hashedPassword, 
                updated_at: new Date().toISOString() 
            })
            .eq('email', email);
        
        res.json({ success: true, message: 'Password reset successful' });
        
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to reset password' 
        });
    }
};

// ============= LOGOUT =============
export const logout = async (req, res) => {
    res.json({ success: true, message: 'Logged out successfully' });
};