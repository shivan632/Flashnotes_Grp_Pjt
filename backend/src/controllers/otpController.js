const otpService = require('../services/otpService');
const { supabase } = require('../config/supabase');
const jwt = require('jsonwebtoken');

// Send OTP to email
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const result = await otpService.sendEmailOTP(email);
    
    res.json({
      success: true,
      message: result.message,
      ...(process.env.NODE_ENV === 'development' && result.otp && { otp: result.otp }),
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ error: 'Failed to send OTP. Please try again.' });
  }
};

// Verify OTP and create/update user
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp, name } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    // Verify OTP
    const verification = otpService.verifyOTP(email, otp);
    
    if (!verification.valid) {
      return res.status(401).json({ error: verification.error });
    }

    // Check if user exists in Supabase
    let { data: existingUser, error: findError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    let user;

    if (!existingUser) {
      // Create new user
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([{
          email: email,
          name: name || email.split('@')[0],
          email_verified: true,
          created_at: new Date().toISOString(),
        }])
        .select()
        .single();

      if (createError) throw createError;
      user = newUser;
    } else {
      // Update existing user
      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update({ 
          email_verified: true,
          updated_at: new Date().toISOString(),
        })
        .eq('email', email)
        .select()
        .single();

      if (updateError) throw updateError;
      user = updatedUser;
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        name: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      message: 'Email verified successfully!',
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ error: 'Verification failed. Please try again.' });
  }
};

// Resend OTP
exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const result = await otpService.sendEmailOTP(email);
    
    res.json({
      success: true,
      message: 'New OTP sent to your email',
      ...(process.env.NODE_ENV === 'development' && result.otp && { otp: result.otp }),
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ error: 'Failed to resend OTP' });
  }
};