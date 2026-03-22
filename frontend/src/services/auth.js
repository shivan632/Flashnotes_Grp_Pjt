// frontend/src/services/auth.js
import { authAPI as apiAuth } from './api.js';

// ============= AUTH FUNCTIONS =============

// Get current user profile
export async function getCurrentUserProfile() {
    try {
        const token = localStorage.getItem('token');
        if (!token) return null;
        
        const userStr = localStorage.getItem('user');
        if (userStr) {
            return JSON.parse(userStr);
        }
        return null;
    } catch (error) {
        console.error('Error getting user profile:', error);
        return null;
    }
}

// Check if user is authenticated
export function isAuthenticated() {
    const token = localStorage.getItem('token');
    const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    return !!(token && isAuth);
}

// Get auth token
export function getAuthToken() {
    return localStorage.getItem('token');
}

// Set auth data
export function setAuthData(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('isAuthenticated', 'true');
}

// Clear auth data (logout)
export function clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('pendingVerification');
    localStorage.removeItem('devOTP');
}

// Register user
export async function registerUser(userData) {
    try {
        const response = await apiAuth.register(userData);
        
        if (response.success || response.email) {
            localStorage.setItem('pendingVerification', response.email);
            if (response.otp) {
                localStorage.setItem('devOTP', response.otp);
            }
            return { success: true, email: response.email, otp: response.otp };
        }
        
        return { success: false, error: response.error || 'Registration failed' };
    } catch (error) {
        console.error('Registration error:', error);
        return { success: false, error: error.message };
    }
}

// Login user
export async function loginUser(email, password) {
    try {
        const response = await apiAuth.login(email, password);
        
        if (response.success && response.token) {
            setAuthData(response.token, response.user);
            return { success: true, user: response.user };
        }
        
        if (response.requiresVerification) {
            localStorage.setItem('pendingVerification', response.email);
            if (response.otp) {
                localStorage.setItem('devOTP', response.otp);
            }
            return { success: false, requiresVerification: true, email: response.email };
        }
        
        return { success: false, error: response.error || 'Login failed' };
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: error.message };
    }
}

// Verify OTP
export async function verifyOTP(email, otp) {
    try {
        const response = await apiAuth.verifyOTP(email, otp);
        
        if (response.success && response.token) {
            setAuthData(response.token, response.user);
            localStorage.removeItem('pendingVerification');
            localStorage.removeItem('devOTP');
            return { success: true, user: response.user, token: response.token };
        }
        
        return { success: false, error: response.error || 'Verification failed' };
    } catch (error) {
        console.error('OTP verification error:', error);
        return { success: false, error: error.message };
    }
}

// Resend OTP
// In auth.js, update resendOTP function
export async function resendOTP(email) {
    try {
        const response = await apiAuth.resendOTP(email);
        
        if (response.success) {
            if (response.otp) {
                localStorage.setItem('devOTP', response.otp);
            }
            return { success: true, otp: response.otp, message: response.message };
        }
        return { success: false, error: response.error };
    } catch (error) {
        console.error('Resend OTP error:', error);
        return { success: false, error: error.message };
    }
}

// Forgot password
export async function forgotPassword(email) {
    try {
        const response = await apiAuth.forgotPassword(email);
        
        if (response.success) {
            return { success: true, message: response.message };
        }
        
        return { success: false, error: response.error || 'Failed to send reset email' };
    } catch (error) {
        console.error('Forgot password error:', error);
        return { success: false, error: error.message };
    }
}

// Reset password
export async function resetPassword(token, newPassword) {
    try {
        const response = await apiAuth.resetPassword(token, newPassword);
        
        if (response.success) {
            return { success: true, message: response.message };
        }
        
        return { success: false, error: response.error || 'Failed to reset password' };
    } catch (error) {
        console.error('Reset password error:', error);
        return { success: false, error: error.message };
    }
}

// Logout user
export async function logoutUser() {
    try {
        const token = getAuthToken();
        if (token) {
            await apiAuth.logout(token);
        }
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        clearAuthData();
        window.location.hash = '#/login';
    }
}

// ============= EXPORT authAPI (NAMED EXPORT) =============
export const authAPI = {
    register: registerUser,
    login: loginUser,
    verifyOTP: verifyOTP,
    resendOTP: resendOTP,
    forgotPassword: forgotPassword,
    resetPassword: resetPassword,
    logout: logoutUser,
    getCurrentUserProfile,
    isAuthenticated,
    getAuthToken,
    setAuthData,
    clearAuthData
};

// Default export for backward compatibility
export default authAPI;