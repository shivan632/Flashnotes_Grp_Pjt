const crypto = require('crypto');
const emailService = require('./emailService');
const { admin } = require('../config/firebase');

// Store OTPs temporarily (in production, use Redis or database)
const otpStore = new Map();

class OTPService {
  // Generate 6-digit OTP
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Send OTP via Email
  async sendEmailOTP(email) {
    try {
      const otp = this.generateOTP();
      
      // Store OTP with expiry (5 minutes)
      otpStore.set(email, {
        otp,
        expiresAt: Date.now() + 5 * 60 * 1000,
        attempts: 0,
      });

      // Send email
      await emailService.sendOTP(email, otp);
      
      // For development, also return OTP (remove in production)
      if (process.env.NODE_ENV === 'development') {
        return { success: true, otp, message: 'OTP sent to email' };
      }
      
      return { success: true, message: 'OTP sent to email' };
    } catch (error) {
      console.error('Send email OTP error:', error);
      throw error;
    }
  }

  // Verify OTP
  verifyOTP(email, otp) {
    const storedData = otpStore.get(email);
    
    if (!storedData) {
      return { valid: false, error: 'No OTP found. Please request a new one.' };
    }
    
    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(email);
      return { valid: false, error: 'OTP has expired. Please request a new one.' };
    }
    
    if (storedData.attempts >= 5) {
      otpStore.delete(email);
      return { valid: false, error: 'Too many attempts. Please request a new OTP.' };
    }
    
    if (storedData.otp !== otp) {
      storedData.attempts++;
      otpStore.set(email, storedData);
      return { valid: false, error: 'Invalid OTP. Please try again.' };
    }
    
    // OTP verified successfully
    otpStore.delete(email);
    return { valid: true };
  }

  // Clear expired OTPs (run cleanup every minute)
  startCleanup() {
    setInterval(() => {
      const now = Date.now();
      for (const [email, data] of otpStore.entries()) {
        if (now > data.expiresAt) {
          otpStore.delete(email);
        }
      }
    }, 60000);
  }

  // Firebase token verification
  async verifyFirebaseToken(idToken) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      return {
        valid: true,
        uid: decodedToken.uid,
        email: decodedToken.email,
        phoneNumber: decodedToken.phone_number,
      };
    } catch (error) {
      console.error('Firebase token verification error:', error);
      return { valid: false, error: error.message };
    }
  }
}

module.exports = new OTPService();