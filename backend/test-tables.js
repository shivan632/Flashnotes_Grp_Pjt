import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function testTables() {
    console.log('Testing table access...');
    
    // Test profiles table
    const { error: profilesError } = await supabase
        .from('profiles')
        .select('count', { count: 'exact', head: true });
    
    console.log('Profiles table:', profilesError ? '❌ ' + profilesError.message : '✅ OK');
    
    // Test pending_users table
    const { error: pendingError } = await supabase
        .from('pending_users')
        .select('count', { count: 'exact', head: true });
    
    console.log('Pending users table:', pendingError ? '❌ ' + pendingError.message : '✅ OK');
    
    // Test saved_notes table
    const { error: notesError } = await supabase
        .from('saved_notes')
        .select('count', { count: 'exact', head: true });
    
    console.log('Saved notes table:', notesError ? '❌ ' + notesError.message : '✅ OK');
    
    // Test search_history table
    const { error: historyError } = await supabase
        .from('search_history')
        .select('count', { count: 'exact', head: true });
    
    console.log('Search history table:', historyError ? '❌ ' + historyError.message : '✅ OK');
}

testTables();