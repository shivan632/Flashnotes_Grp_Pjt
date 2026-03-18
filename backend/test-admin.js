// backend/test-admin.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 Testing with Admin Client...');
console.log('URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    try {
        // Test profiles table
        const { data, error } = await supabase
            .from('profiles')
            .select('count', { count: 'exact', head: true });
        
        if (error) {
            console.log('❌ Admin test failed:', error.message);
        } else {
            console.log('✅ Admin test passed! Tables are accessible.');
        }
        
        // Try to insert a test record
        const testEmail = `test${Date.now()}@test.com`;
        const { error: insertError } = await supabase
            .from('profiles')
            .insert({ name: 'Test User', email: testEmail });
        
        if (insertError) {
            console.log('❌ Insert test failed:', insertError.message);
        } else {
            console.log('✅ Insert test passed!');
            
            // Clean up
            await supabase
                .from('profiles')
                .delete()
                .eq('email', testEmail);
        }
        
    } catch (err) {
        console.log('❌ Error:', err.message);
    }
}

test();