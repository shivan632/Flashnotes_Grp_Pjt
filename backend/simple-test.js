import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function simpleTest() {
    console.log('Testing basic Supabase connection...');
    
    // Try a very simple query - just get the Supabase version
    try {
        const { data, error } = await supabase
            .from('_dummy')
            .select('*')
            .limit(1);
        
        // Even if this fails, we'll see the error
        console.log('Query attempted');
        
        if (error) {
            console.log('Error code:', error.code);
            console.log('Error message:', error.message);
            console.log('Error details:', error.details);
        }
    } catch (err) {
        console.log('Exception:', err.message);
    }
    
    // Try to get project settings
    try {
        const { data, error } = await supabase.rpc('get_service_status');
        console.log('RPC result:', { data, error });
    } catch (err) {
        console.log('RPC exception:', err.message);
    }
}

simpleTest();