// Validation utility functions

// Validate registration form
export function validateRegistration(data) {
    const errors = {};
    
    // Name validation
    if (!data.name) {
        errors.name = 'Name is required';
    } else if (data.name.length < 2) {
        errors.name = 'Name must be at least 2 characters';
    } else if (data.name.length > 50) {
        errors.name = 'Name must be less than 50 characters';
    }
    
    // Email validation
    if (!data.email) {
        errors.email = 'Email is required';
    } else if (!isValidEmail(data.email)) {
        errors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!data.password) {
        errors.password = 'Password is required';
    } else if (data.password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
    } else if (!hasUpperCase(data.password)) {
        errors.password = 'Password must contain at least one uppercase letter';
    } else if (!hasLowerCase(data.password)) {
        errors.password = 'Password must contain at least one lowercase letter';
    } else if (!hasNumber(data.password)) {
        errors.password = 'Password must contain at least one number';
    }
    
    // Confirm password validation
    if (data.confirmPassword !== undefined) {
        if (!data.confirmPassword) {
            errors.confirmPassword = 'Please confirm your password';
        } else if (data.password !== data.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }
    }
    
    // Terms validation
    if (data.terms !== undefined && !data.terms) {
        errors.terms = 'You must accept the terms and conditions';
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

// Validate login form
export function validateLogin(data) {
    const errors = {};
    
    if (!data.email) {
        errors.email = 'Email is required';
    } else if (!isValidEmail(data.email)) {
        errors.email = 'Please enter a valid email address';
    }
    
    if (!data.password) {
        errors.password = 'Password is required';
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

// Validate OTP
export function validateOTP(otp) {
    const errors = {};
    
    if (!otp) {
        errors.otp = 'OTP is required';
    } else if (otp.length !== 6) {
        errors.otp = 'OTP must be 6 digits';
    } else if (!/^\d+$/.test(otp)) {
        errors.otp = 'OTP must contain only numbers';
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

// Validate topic input
export function validateTopic(topic) {
    const errors = {};
    
    if (!topic) {
        errors.topic = 'Topic is required';
    } else if (topic.length < 2) {
        errors.topic = 'Topic must be at least 2 characters';
    } else if (topic.length > 100) {
        errors.topic = 'Topic must be less than 100 characters';
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

// Validate profile update
export function validateProfileUpdate(data) {
    const errors = {};
    
    if (data.name !== undefined) {
        if (!data.name) {
            errors.name = 'Name is required';
        } else if (data.name.length < 2) {
            errors.name = 'Name must be at least 2 characters';
        } else if (data.name.length > 50) {
            errors.name = 'Name must be less than 50 characters';
        }
    }
    
    if (data.email !== undefined) {
        if (!data.email) {
            errors.email = 'Email is required';
        } else if (!isValidEmail(data.email)) {
            errors.email = 'Please enter a valid email address';
        }
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

// Validate password change
export function validatePasswordChange(data) {
    const errors = {};
    
    if (!data.currentPassword) {
        errors.currentPassword = 'Current password is required';
    }
    
    if (!data.newPassword) {
        errors.newPassword = 'New password is required';
    } else if (data.newPassword.length < 8) {
        errors.newPassword = 'Password must be at least 8 characters';
    } else if (!hasUpperCase(data.newPassword)) {
        errors.newPassword = 'Password must contain at least one uppercase letter';
    } else if (!hasLowerCase(data.newPassword)) {
        errors.newPassword = 'Password must contain at least one lowercase letter';
    } else if (!hasNumber(data.newPassword)) {
        errors.newPassword = 'Password must contain at least one number';
    }
    
    if (!data.confirmPassword) {
        errors.confirmPassword = 'Please confirm your new password';
    } else if (data.newPassword !== data.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

// Helper validation functions
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function hasUpperCase(str) {
    return /[A-Z]/.test(str);
}

function hasLowerCase(str) {
    return /[a-z]/.test(str);
}

function hasNumber(str) {
    return /[0-9]/.test(str);
}