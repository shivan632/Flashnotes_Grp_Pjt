import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function testConnection() {
    console.log('🔍 Testing Supabase Connection...');
    console.log('URL:', process.env.SUPABASE_URL);
    
    try {
        const tables = ['profiles', 'pending_users', 'saved_notes', 'search_history'];
        
        for (const table of tables) {
            const { data, error } = await supabase
                .from(table)
                .select('count', { count: 'exact', head: true });
            
            if (error) {
                console.log(`❌ ${table}:`, error.message);
            } else {
                console.log(`✅ ${table}: OK`);
            }
        }
        
        console.log('\n🎉 Your database is ready!');
        
    } catch (err) {
        console.log('❌ Error:', err.message);
    }
}

testConnection();
