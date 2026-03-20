// backend/test-email.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend folder
dotenv.config({ path: path.join(__dirname, '.env') });

console.log('📧 Testing Email Configuration...');
console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
console.log('EMAIL_PORT:', process.env.EMAIL_PORT);
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '✓ Set (length: ' + process.env.EMAIL_PASS.length + ')' : '❌ NOT SET');

// Create transporter
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_PORT === '465',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function testEmail() {
    try {
        console.log('\n🔍 Verifying connection...');
        
        // Verify connection
        await transporter.verify();
        console.log('✅ SMTP connection successful!');
        
        // Send test email
        console.log('\n📤 Sending test email...');
        
        const info = await transporter.sendMail({
            from: `"Flashnotes Test" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER, // Send to yourself
            subject: 'Flashnotes Email Test',
            text: 'If you receive this, your email configuration is working!',
            html: '<h1>✅ Email Working!</h1><p>Your Flashnotes email configuration is correct.</p>'
        });
        
        console.log('✅ Email sent! Message ID:', info.messageId);
        console.log(`📧 Check your inbox at: ${process.env.EMAIL_USER}`);
        
    } catch (error) {
        console.error('❌ Email test failed:', error.message);
        console.log('\n🔧 Troubleshooting:');
        
        if (error.message.includes('Invalid login')) {
            console.log('   → Wrong email or password. Use App Password, not regular password.');
            console.log('   → Get App Password: https://myaccount.google.com/apppasswords');
        } else if (error.message.includes('connect')) {
            console.log('   → Cannot connect to SMTP server. Check EMAIL_HOST and EMAIL_PORT.');
        } else if (error.message.includes('timeout')) {
            console.log('   → Connection timeout. Check your internet/firewall.');
        }
    }
}

testEmail();