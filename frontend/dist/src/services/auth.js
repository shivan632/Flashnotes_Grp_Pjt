// Authentication service with Supabase integration

import { supabase, handleSupabaseError, isSupabaseConfigured } from './supabase.js';

// For development without Supabase - will use localStorage
const USE_MOCK = !isSupabaseConfigured();

// Mock user database (for development without Supabase)
let mockUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');

// Generate random OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP via email (mock - will be replaced with actual email service)
async function sendOTPEmail(email, otp) {
    console.log(`[MOCK] Sending OTP ${otp} to ${email}`);
    // In production with Supabase, you'll use a proper email service
    // Supabase Auth can handle email verification automatically
    return true;
}

// Register new user (works with both mock and Supabase)
export async function registerUser(userData) {
    const { name, email, password } = userData;
    
    if (USE_MOCK) {
        // Mock implementation for development
        console.log('Using mock authentication');
        
        // Check if user exists
        const existingUser = mockUsers.find(u => u.email === email);
        if (existingUser) {
            throw new Error('User already exists with this email');
        }
        
        // Generate OTP
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        
        // Create pending user
        const pendingUser = {
            id: Date.now().toString(),
            name,
            email,
            password, // In production, never store plain passwords!
            otp,
            otpExpiry,
            verified: false,
            createdAt: new Date().toISOString()
        };
        
        // Store temporarily
        localStorage.setItem('pendingUser', JSON.stringify(pendingUser));
        
        // Send OTP email
        await sendOTPEmail(email, otp);
        
        return { 
            success: true, 
            message: 'OTP sent to email', 
            email,
            user: { name, email }
        };
        
    } else {
        // Supabase implementation for production
        try {
            // Sign up with Supabase Auth
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name: name,
                        role: 'user'
                    },
                    emailRedirectTo: `${window.location.origin}/verify-otp`
                }
            });
            
            if (error) throw error;
            
            // Store additional user data in profiles table
            if (data.user) {
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert([
                        {
                            id: data.user.id,
                            name: name,
                            email: email,
                            created_at: new Date().toISOString()
                        }
                    ]);
                
                if (profileError) console.error('Profile creation error:', profileError);
            }
            
            return {
                success: true,
                message: 'Registration successful! Please check your email for verification.',
                email,
                user: data.user
            };
            
        } catch (error) {
            throw handleSupabaseError(error);
        }
    }
}

// Verify OTP (works with both mock and Supabase)
export async function verifyOTP(email, otp) {
    if (USE_MOCK) {
        // Mock implementation
        const pendingUser = JSON.parse(localStorage.getItem('pendingUser'));
        
        if (!pendingUser || pendingUser.email !== email) {
            throw new Error('No pending registration found');
        }
        
        if (new Date() > new Date(pendingUser.otpExpiry)) {
            throw new Error('OTP has expired');
        }
        
        if (pendingUser.otp !== otp) {
            throw new Error('Invalid OTP');
        }
        
        // Mark as verified
        pendingUser.verified = true;
        delete pendingUser.otp;
        delete pendingUser.otpExpiry;
        
        // Add to mock users
        mockUsers.push(pendingUser);
        localStorage.setItem('mock_users', JSON.stringify(mockUsers));
        localStorage.removeItem('pendingUser');
        
        // Set session
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userName', pendingUser.name);
        localStorage.setItem('userEmail', pendingUser.email);
        
        return {
            success: true,
            message: 'Email verified successfully',
            user: { name: pendingUser.name, email: pendingUser.email }
        };
        
    } else {
        // Supabase implementation
        try {
            // In Supabase, email verification is handled automatically
            // You can check if the user's email is confirmed
            const { data: { user }, error } = await supabase.auth.getUser();
            
            if (error) throw error;
            
            if (user && user.email_confirmed_at) {
                return {
                    success: true,
                    message: 'Email verified successfully',
                    user
                };
            } else {
                throw new Error('Email not verified yet');
            }
            
        } catch (error) {
            throw handleSupabaseError(error);
        }
    }
}

// Login user
export async function loginUser(email, password) {
    if (USE_MOCK) {
        // Mock implementation
        const user = mockUsers.find(u => u.email === email && u.password === password);
        
        if (!user) {
            throw new Error('Invalid email or password');
        }
        
        if (!user.verified) {
            throw new Error('Please verify your email first');
        }
        
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userName', user.name);
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userId', user.id);
        
        return {
            success: true,
            message: 'Login successful',
            user: { name: user.name, email: user.email, id: user.id }
        };
        
    } else {
        // Supabase implementation
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });
            
            if (error) throw error;
            
            // Get user profile
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', data.user.id)
                .single();
            
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userName', profile?.name || data.user.email);
            localStorage.setItem('userEmail', data.user.email);
            localStorage.setItem('userId', data.user.id);
            
            return {
                success: true,
                message: 'Login successful',
                user: data.user,
                profile
            };
            
        } catch (error) {
            throw handleSupabaseError(error);
        }
    }
}

// Resend OTP
export async function resendOTP(email) {
    if (USE_MOCK) {
        const pendingUser = JSON.parse(localStorage.getItem('pendingUser'));
        
        if (!pendingUser || pendingUser.email !== email) {
            throw new Error('No pending registration found');
        }
        
        const newOTP = generateOTP();
        pendingUser.otp = newOTP;
        pendingUser.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        
        localStorage.setItem('pendingUser', JSON.stringify(pendingUser));
        await sendOTPEmail(email, newOTP);
        
        return { success: true, message: 'OTP resent successfully' };
        
    } else {
        // Supabase can resend verification email
        try {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email: email
            });
            
            if (error) throw error;
            
            return { success: true, message: 'Verification email resent' };
            
        } catch (error) {
            throw handleSupabaseError(error);
        }
    }
}

// Logout user
export async function logoutUser() {
    if (!USE_MOCK) {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
        } catch (error) {
            console.error('Logout error:', error);
        }
    }
    
    // Clear local storage
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    localStorage.removeItem('pendingUser');
    
    return { success: true };
}

// Get current user profile
export async function getCurrentUserProfile() {
    if (USE_MOCK) {
        const userId = localStorage.getItem('userId');
        const user = mockUsers.find(u => u.id === userId);
        
        if (!user) return null;
        
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            created_at: user.createdAt
        };
        
    } else {
        try {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error) throw error;
            
            if (!user) return null;
            
            // Get profile from profiles table
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();
            
            return {
                ...user,
                profile: profile || null
            };
            
        } catch (error) {
            console.error('Error getting user profile:', error);
            return null;
        }
    }
}

// Update user profile
export async function updateUserProfile(updates) {
    if (USE_MOCK) {
        const userId = localStorage.getItem('userId');
        const userIndex = mockUsers.findIndex(u => u.id === userId);
        
        if (userIndex === -1) throw new Error('User not found');
        
        mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates };
        localStorage.setItem('mock_users', JSON.stringify(mockUsers));
        
        if (updates.name) localStorage.setItem('userName', updates.name);
        
        return { success: true, user: mockUsers[userIndex] };
        
    } else {
        try {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error) throw error;
            
            // Update auth metadata if needed
            if (updates.name) {
                const { error: updateError } = await supabase.auth.updateUser({
                    data: { name: updates.name }
                });
                if (updateError) throw updateError;
            }
            
            // Update profiles table
            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    name: updates.name,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id);
            
            if (profileError) throw profileError;
            
            return { success: true };
            
        } catch (error) {
            throw handleSupabaseError(error);
        }
    }
}