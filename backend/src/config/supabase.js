// backend/src/config/supabase.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing Supabase credentials in .env');
    process.exit(1);
}

// Regular client for public operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client that bypasses RLS
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

// Test connection with admin client to bypass RLS
export async function testConnection() {
    try {
        // Use admin client for testing to bypass RLS
        const adminClient = createClient(supabaseUrl, supabaseServiceRoleKey);
        
        const { error } = await adminClient
            .from('profiles')
            .select('count', { count: 'exact', head: true });
        
        if (error) {
            console.error('❌ Supabase connection failed:', error.message);
            return false;
        }
        
        console.log('✅ Supabase connected successfully');
        return true;
    } catch (error) {
        console.error('❌ Supabase connection failed:', error.message);
        return false;
    }
}

export default supabase;