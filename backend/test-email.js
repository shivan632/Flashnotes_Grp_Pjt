import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

async function testEmail() {
    console.log('📧 Testing Email Configuration...');
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '✓ Set' : '✗ Missing');
    
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT) || 587,
        secure: false, // false for port 587
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    try {
        // Verify connection
        await transporter.verify();
        console.log('✅ SMTP Connection successful!');
        
        // Send test email
        const info = await transporter.sendMail({
            from: `"Flashnotes Test" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER, // Send to yourself
            subject: '✅ Flashnotes Email Test',
            text: 'If you receive this, email configuration is working!',
            html: '<h1>✅ Success!</h1><p>Your Flashnotes email configuration is working correctly.</p>'
        });
        
        console.log('✅ Test email sent!');
        console.log('📨 Message ID:', info.messageId);
        
    } catch (error) {
        console.error('❌ Email Error:', error.message);
        console.error('📌 Full error:', error);
        
        if (error.message.includes('Invalid login')) {
            console.log('\n🔧 Troubleshooting:');
            console.log('1. 2-Step Verification enabled?');
            console.log('2. App password generated correctly?');
            console.log('3. App password copied without spaces?');
            console.log('4. Gmail account accessible?');
        }
    }
}

testEmail();