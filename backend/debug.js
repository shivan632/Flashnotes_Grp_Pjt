// backend/debug.js
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load .env file
dotenv.config();

console.log('========== DEBUG INFO ==========');
console.log('Current directory:', process.cwd());
console.log('\n--- Environment Variables ---');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL || '❌ NOT SET');
console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? '✅ Set (length: ' + process.env.SUPABASE_ANON_KEY.length + ')' : '❌ NOT SET');
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ NOT SET');
console.log('PORT:', process.env.PORT || '❌ NOT SET');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ NOT SET');

console.log('\n--- Testing Supabase Connection ---');
if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    try {
        const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
        
        // Test the connection
        const testConnection = async () => {
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('count', { count: 'exact', head: true });
                
                if (error) {
                    console.log('❌ Connection failed:', error.message);
                    console.log('Error details:', error);
                } else {
                    console.log('✅ Connection successful!');
                }
            } catch (err) {
                console.log('❌ Exception:', err.message);
            }
        };
        
        await testConnection();
    } catch (err) {
        console.log('❌ Error creating Supabase client:', err.message);
    }
} else {
    console.log('❌ Cannot test connection - missing credentials');
}

console.log('\n--- Checking .env file location ---');
import fs from 'fs';
try {
    const envContent = fs.readFileSync('.env', 'utf8');
    console.log('✅ .env file found');
    console.log('First line:', envContent.split('\n')[0]);
} catch (err) {
    console.log('❌ .env file not found in current directory');
}

console.log('================================');