const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  // Send OTP via Email
  async sendOTP(email, otp) {
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
                <span style="font-size: 32px; font-family: monospace; font-weight: bold; letter-spacing: 8px; color: #60A5FA;">${otp}</span>
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

    try {
      await this.transporter.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      console.error('Email send error:', error);
      throw new Error('Failed to send OTP email');
    }
  }
}

module.exports = new EmailService();