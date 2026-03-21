const express = require('express');
const router = express.Router();
const otpController = require('../controllers/otpController');
const { rateLimit } = require('express-rate-limit');

// Rate limiting for OTP requests
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // limit each IP to 3 requests per windowMs
  message: { error: 'Too many OTP requests. Please try again later.' },
});

// Routes
router.post('/send', otpLimiter, otpController.sendOTP);
router.post('/verify', otpLimiter, otpController.verifyOTP);
router.post('/resend', otpLimiter, otpController.resendOTP);

module.exports = router;