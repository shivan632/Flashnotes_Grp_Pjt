// frontend/src/services/supabase.js
import { createClient } from '@supabase/supabase-js';

// These will come from your .env file
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase is configured
isSupabaseConfigured 

// Create Supabase client only if configured
export const supabase = isSupabaseConfigured() ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

// Helper function to handle Supabase errors
export function handleSupabaseError(error) {
    console.error('Supabase error:', error);
    return {
        success: false,
        message: error?.message || 'An error occurred with the database',
        details: error?.details || null,
        code: error?.code || null
    };
}

// Get current user session
export async function getCurrentSession() {
    if (!supabase) {
        return { success: false, session: null, error: { message: 'Supabase not configured' } };
    }
    
    try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        return { success: true, session, error: null };
    } catch (error) {
        return { success: false, session: null, error: handleSupabaseError(error) };
    }
}

// Get current user
export async function getCurrentUser() {
    if (!supabase) {
        return { success: false, user: null, error: { message: 'Supabase not configured' } };
    }
    
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        return { success: true, user, error: null };
    } catch (error) {
        return { success: false, user: null, error: handleSupabaseError(error) };
    }
}

// Sign up new user
export async function signUp(email, password, options = {}) {
    if (!supabase) {
        return { success: false, data: null, error: { message: 'Supabase not configured' } };
    }
    
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: options.data || {},
                emailRedirectTo: options.emailRedirectTo || `${window.location.origin}/verify-otp`
            }
        });
        
        if (error) throw error;
        return { success: true, data, error: null };
    } catch (error) {
        return { success: false, data: null, error: handleSupabaseError(error) };
    }
}

// Sign in with email and password
export async function signInWithPassword(email, password) {
    if (!supabase) {
        return { success: false, data: null, error: { message: 'Supabase not configured' } };
    }
    
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        
        if (error) throw error;
        return { success: true, data, error: null };
    } catch (error) {
        return { success: false, data: null, error: handleSupabaseError(error) };
    }
}

// Sign out
export async function signOut() {
    if (!supabase) {
        return { success: false, error: { message: 'Supabase not configured' } };
    }
    
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        return { success: true, error: null };
    } catch (error) {
        return { success: false, error: handleSupabaseError(error) };
    }
}

// Resend verification email
export async function resendVerificationEmail(email) {
    if (!supabase) {
        return { success: false, error: { message: 'Supabase not configured' } };
    }
    
    try {
        const { error } = await supabase.auth.resend({
            type: 'signup',
            email: email
        });
        
        if (error) throw error;
        return { success: true, error: null };
    } catch (error) {
        return { success: false, error: handleSupabaseError(error) };
    }
}

// Send password reset email
export async function sendPasswordResetEmail(email) {
    if (!supabase) {
        return { success: false, error: { message: 'Supabase not configured' } };
    }
    
    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`
        });
        
        if (error) throw error;
        return { success: true, error: null };
    } catch (error) {
        return { success: false, error: handleSupabaseError(error) };
    }
}

// Update user password
export async function updateUserPassword(password) {
    if (!supabase) {
        return { success: false, error: { message: 'Supabase not configured' } };
    }
    
    try {
        const { error } = await supabase.auth.updateUser({
            password: password
        });
        
        if (error) throw error;
        return { success: true, error: null };
    } catch (error) {
        return { success: false, error: handleSupabaseError(error) };
    }
}

// Update user metadata
export async function updateUserMetadata(metadata) {
    if (!supabase) {
        return { success: false, error: { message: 'Supabase not configured' } };
    }
    
    try {
        const { data, error } = await supabase.auth.updateUser({
            data: metadata
        });
        
        if (error) throw error;
        return { success: true, data, error: null };
    } catch (error) {
        return { success: false, data: null, error: handleSupabaseError(error) };
    }
}

// Get user profile from profiles table
export async function getUserProfile(userId) {
    if (!supabase) {
        return { success: false, profile: null, error: { message: 'Supabase not configured' } };
    }
    
    try {
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
        
        if (error) throw error;
        return { success: true, profile, error: null };
    } catch (error) {
        return { success: false, profile: null, error: handleSupabaseError(error) };
    }
}

// Update user profile
export async function updateUserProfile(userId, updates) {
    if (!supabase) {
        return { success: false, error: { message: 'Supabase not configured' } };
    }
    
    try {
        const { data: profile, error } = await supabase
            .from('profiles')
            .update({
                ...updates,
                updated_at: new Date().toISOString()
            })
            .eq('id', userId)
            .select()
            .single();
        
        if (error) throw error;
        return { success: true, profile, error: null };
    } catch (error) {
        return { success: false, profile: null, error: handleSupabaseError(error) };
    }
}

// Insert user profile
export async function insertUserProfile(userId, userData) {
    if (!supabase) {
        return { success: false, error: { message: 'Supabase not configured' } };
    }
    
    try {
        const { data: profile, error } = await supabase
            .from('profiles')
            .insert([{
                id: userId,
                name: userData.name,
                email: userData.email,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }])
            .select()
            .single();
        
        if (error) throw error;
        return { success: true, profile, error: null };
    } catch (error) {
        return { success: false, profile: null, error: handleSupabaseError(error) };
    }
}

// Check if user is authenticated
export async function isAuthenticated() {
    const result = await getCurrentSession();
    return result.success && result.session !== null;
}

// Get user's saved notes
export async function getUserNotes(userId) {
    if (!supabase) {
        return { success: false, notes: [], error: { message: 'Supabase not configured' } };
    }
    
    try {
        const { data: notes, error } = await supabase
            .from('saved_notes')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return { success: true, notes, error: null };
    } catch (error) {
        return { success: false, notes: [], error: handleSupabaseError(error) };
    }
}

// Save a note
export async function saveUserNote(userId, topic, question, answer) {
    if (!supabase) {
        return { success: false, note: null, error: { message: 'Supabase not configured' } };
    }
    
    try {
        const { data: note, error } = await supabase
            .from('saved_notes')
            .insert([{
                user_id: userId,
                topic,
                question,
                answer,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }])
            .select()
            .single();
        
        if (error) throw error;
        return { success: true, note, error: null };
    } catch (error) {
        return { success: false, note: null, error: handleSupabaseError(error) };
    }
}

// Delete a note
export async function deleteUserNote(noteId, userId) {
    if (!supabase) {
        return { success: false, error: { message: 'Supabase not configured' } };
    }
    
    try {
        const { error } = await supabase
            .from('saved_notes')
            .delete()
            .eq('id', noteId)
            .eq('user_id', userId);
        
        if (error) throw error;
        return { success: true, error: null };
    } catch (error) {
        return { success: false, error: handleSupabaseError(error) };
    }
}

// Get user's search history
export async function getUserHistory(userId) {
    if (!supabase) {
        return { success: false, history: [], error: { message: 'Supabase not configured' } };
    }
    
    try {
        const { data: history, error } = await supabase
            .from('search_history')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(50);
        
        if (error) throw error;
        return { success: true, history, error: null };
    } catch (error) {
        return { success: false, history: [], error: handleSupabaseError(error) };
    }
}

// Add to search history
export async function addToUserHistory(userId, topic) {
    if (!supabase) {
        return { success: false, error: { message: 'Supabase not configured' } };
    }
    
    try {
        const { error } = await supabase
            .from('search_history')
            .insert([{
                user_id: userId,
                topic,
                created_at: new Date().toISOString()
            }]);
        
        if (error) throw error;
        return { success: true, error: null };
    } catch (error) {
        return { success: false, error: handleSupabaseError(error) };
    }
}

// Clear user's search history
export async function clearUserHistory(userId) {
    if (!supabase) {
        return { success: false, error: { message: 'Supabase not configured' } };
    }
    
    try {
        const { error } = await supabase
            .from('search_history')
            .delete()
            .eq('user_id', userId);
        
        if (error) throw error;
        return { success: true, error: null };
    } catch (error) {
        return { success: false, error: handleSupabaseError(error) };
    }
}

export default supabase;