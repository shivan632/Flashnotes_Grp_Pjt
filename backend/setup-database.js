// backend/setup-database.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const createTables = async () => {
    console.log('🚀 Starting database setup...');
    
    // SQL statements to create tables
    const sql = `
    -- Create profiles table
    CREATE TABLE IF NOT EXISTS public.profiles (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Create pending_users table
    CREATE TABLE IF NOT EXISTS public.pending_users (
        id BIGSERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        otp TEXT NOT NULL,
        otp_expiry TIMESTAMP WITH TIME ZONE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Create saved_notes table
    CREATE TABLE IF NOT EXISTS public.saved_notes (
        id BIGSERIAL PRIMARY KEY,
        user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
        topic TEXT NOT NULL,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Create search_history table
    CREATE TABLE IF NOT EXISTS public.search_history (
        id BIGSERIAL PRIMARY KEY,
        user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
        topic TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Enable RLS
    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.pending_users ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.saved_notes ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;

    -- Create policies
    CREATE POLICY "Enable all for authenticated users" ON public.profiles
        FOR ALL USING (true);

    CREATE POLICY "Enable all for authenticated users" ON public.pending_users
        FOR ALL USING (true);

    CREATE POLICY "Enable all for authenticated users" ON public.saved_notes
        FOR ALL USING (true);

    CREATE POLICY "Enable all for authenticated users" ON public.search_history
        FOR ALL USING (true);
    `;

    try {
        // Execute SQL using Supabase's rpc
        const { error } = await supabase.rpc('exec_sql', { query: sql });
        
        if (error) {
            console.log('❌ Error creating tables:', error.message);
            console.log('Trying alternative method...');
            
            // Alternative: Create tables one by one
            await createTablesOneByOne();
        } else {
            console.log('✅ Tables created successfully!');
        }
    } catch (err) {
        console.log('❌ Exception:', err.message);
        console.log('Trying alternative method...');
        await createTablesOneByOne();
    }
};

const createTablesOneByOne = async () => {
    try {
        // Create profiles table
        const { error: e1 } = await supabase.rpc('exec_sql', {
            query: `
                CREATE TABLE IF NOT EXISTS public.profiles (
                    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                    name TEXT NOT NULL,
                    email TEXT UNIQUE NOT NULL,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                );
            `
        });
        console.log('Profiles table:', e1 ? '❌ ' + e1.message : '✅ Created');

        // Create pending_users table
        const { error: e2 } = await supabase.rpc('exec_sql', {
            query: `
                CREATE TABLE IF NOT EXISTS public.pending_users (
                    id BIGSERIAL PRIMARY KEY,
                    name TEXT NOT NULL,
                    email TEXT UNIQUE NOT NULL,
                    password TEXT NOT NULL,
                    otp TEXT NOT NULL,
                    otp_expiry TIMESTAMP WITH TIME ZONE NOT NULL,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                );
            `
        });
        console.log('Pending users table:', e2 ? '❌ ' + e2.message : '✅ Created');

        // Create saved_notes table
        const { error: e3 } = await supabase.rpc('exec_sql', {
            query: `
                CREATE TABLE IF NOT EXISTS public.saved_notes (
                    id BIGSERIAL PRIMARY KEY,
                    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
                    topic TEXT NOT NULL,
                    question TEXT NOT NULL,
                    answer TEXT NOT NULL,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                );
            `
        });
        console.log('Saved notes table:', e3 ? '❌ ' + e3.message : '✅ Created');

        // Create search_history table
        const { error: e4 } = await supabase.rpc('exec_sql', {
            query: `
                CREATE TABLE IF NOT EXISTS public.search_history (
                    id BIGSERIAL PRIMARY KEY,
                    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
                    topic TEXT NOT NULL,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                );
            `
        });
        console.log('Search history table:', e4 ? '❌ ' + e4.message : '✅ Created');

    } catch (err) {
        console.log('❌ Alternative method failed:', err.message);
        console.log('\n⚠️  Please create tables manually in Supabase SQL Editor');
    }
};

// Run the setup
createTables();