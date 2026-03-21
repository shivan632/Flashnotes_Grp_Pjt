// frontend/src/services/auth.js
// Authentication service - Uses backend API only

import { authAPI as apiAuth } from './api.js';

// Validate email
export function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

// Validate password strength
export function validatePasswordStrength(password) {
    const checks = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    const score = Object.values(checks).filter(Boolean).length;
    let strength = 'weak';
    if (score >= 5) strength = 'strong';
    else if (score >= 3) strength = 'medium';
    
    return {
        isValid: checks.length && checks.uppercase && checks.lowercase && checks.number,
        checks,
        strength,
        score
    };
}

// Register user
export async function registerUser(userData) {
    const { name, email, password } = userData;
    
    if (!name || !email || !password) {
        throw new Error('All fields are required');
    }
    
    if (!validateEmail(email)) {
        throw new Error('Please enter a valid email address');
    }
    
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
        throw new Error('Password must contain at least 8 characters, one uppercase, one lowercase, and one number');
    }
    
    try {
        const result = await apiAuth.register({ name, email, password });
        return result;
    } catch (error) {
        throw error;
    }
}

// Verify OTP
export async function verifyOTP(email, otp) {
    try {
        const result = await apiAuth.verifyOTP(email, otp);
        return result;
    } catch (error) {
        throw error;
    }
}

// Login
export async function loginUser(email, password, rememberMe = false) {
    if (!email || !password) {
        throw new Error('Email and password are required');
    }
    
    try {
        const result = await apiAuth.login({ email, password });
        
        if (rememberMe) {
            localStorage.setItem('rememberedEmail', email);
        } else {
            localStorage.removeItem('rememberedEmail');
        }
        
        return result;
    } catch (error) {
        throw error;
    }
}

// Resend OTP
export async function resendOTP(email) {
    try {
        const result = await authAPI.resendOTP(email);
        // The OTP is returned in the response for development
        return result;
    } catch (error) {
        console.error('Resend OTP error:', error);
        throw error;
    }
}

// Logout
export async function logoutUser() {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    localStorage.removeItem('pendingUser');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('rememberedEmail');
    return { success: true };
}

// Get current user profile
export async function getCurrentUserProfile() {
    try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return user;
    } catch (error) {
        return null;
    }
}

// Update profile
export async function updateUserProfile(updates) {
    try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUser = { ...user, ...updates };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        if (updates.name) localStorage.setItem('userName', updates.name);
        if (updates.email) localStorage.setItem('userEmail', updates.email);
        
        return { success: true, user: updatedUser };
    } catch (error) {
        throw error;
    }
}

// Check if authenticated
export async function isAuthenticated() {
    const token = localStorage.getItem('authToken');
    const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    return !!(token && isAuth);
}

// Get user stats
export async function getUserStats() {
    return {
        totalQuizzes: parseInt(localStorage.getItem('totalQuizzes') || '0'),
        savedNotes: parseInt(localStorage.getItem('savedNotesCount') || '0'),
        perfectScores: parseInt(localStorage.getItem('perfectScores') || '0'),
        currentStreak: parseInt(localStorage.getItem('currentStreak') || '0'),
        longestStreak: parseInt(localStorage.getItem('longestStreak') || '0'),
        totalPoints: parseInt(localStorage.getItem('totalPoints') || '0')
    };
}

// Increment stat
export async function incrementUserStat(statName, increment = 1) {
    const currentValue = parseInt(localStorage.getItem(statName) || '0');
    localStorage.setItem(statName, (currentValue + increment).toString());
    return true;
}

// ============= EXPORT authAPI for compatibility =============
// This is what main.js is trying to import
export const authAPI = {
    register: apiAuth.register,
    login: apiAuth.login,
    verifyOTP: apiAuth.verifyOTP,
    resendOTP: apiAuth.resendOTP,
    logout: apiAuth.logout
};

// Also export the original functions for direct use
export default {
    validateEmail,
    validatePasswordStrength,
    registerUser,
    verifyOTP,
    loginUser,
    resendOTP,
    logoutUser,
    getCurrentUserProfile,
    updateUserProfile,
    isAuthenticated,
    getUserStats,
    incrementUserStat,
    authAPI
};