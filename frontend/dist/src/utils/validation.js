// frontend/src/utils/validation.js
// Validation utility functions - Enhanced version

// ============= EMAIL VALIDATION =============

export function isValidEmail(email) {
    if (!email) return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

// ============= PASSWORD VALIDATION =============

export function hasUpperCase(str) {
    return /[A-Z]/.test(str);
}

export function hasLowerCase(str) {
    return /[a-z]/.test(str);
}

export function hasNumber(str) {
    return /[0-9]/.test(str);
}

export function hasSpecialChar(str) {
    return /[!@#$%^&*(),.?":{}|<>]/.test(str);
}

export function isStrongPassword(password) {
    if (!password) return false;
    return password.length >= 8 && 
           hasUpperCase(password) && 
           hasLowerCase(password) && 
           hasNumber(password) && 
           hasSpecialChar(password);
}

export function getPasswordStrength(password) {
    if (!password) return { score: 0, strength: 'weak', message: 'Password is required' };
    
    let score = 0;
    const checks = {
        length: password.length >= 8,
        uppercase: hasUpperCase(password),
        lowercase: hasLowerCase(password),
        number: hasNumber(password),
        special: hasSpecialChar(password)
    };
    
    if (checks.length) score++;
    if (checks.uppercase) score++;
    if (checks.lowercase) score++;
    if (checks.number) score++;
    if (checks.special) score++;
    
    let strength = 'weak';
    let message = '';
    
    if (score >= 5) {
        strength = 'strong';
        message = 'Strong password';
    } else if (score >= 3) {
        strength = 'medium';
        message = 'Medium strength password';
    } else {
        strength = 'weak';
        message = 'Weak password';
    }
    
    return {
        score,
        strength,
        message,
        checks,
        isValid: score >= 3
    };
}

// ============= REGISTRATION VALIDATION =============

export function validateRegistration(data) {
    const errors = {};
    
    // Name validation
    if (!data.name) {
        errors.name = 'Name is required';
    } else if (data.name.length < 2) {
        errors.name = 'Name must be at least 2 characters';
    } else if (data.name.length > 50) {
        errors.name = 'Name must be less than 50 characters';
    } else if (!/^[a-zA-Z\s'-]+$/.test(data.name)) {
        errors.name = 'Name can only contain letters, spaces, hyphens, and apostrophes';
    }
    
    // Email validation
    if (!data.email) {
        errors.email = 'Email is required';
    } else if (!isValidEmail(data.email)) {
        errors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    const passwordStrength = getPasswordStrength(data.password);
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
    } else if (!hasSpecialChar(data.password)) {
        errors.password = 'Password must contain at least one special character';
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
        errors,
        passwordStrength: data.password ? passwordStrength : null
    };
}

// ============= LOGIN VALIDATION =============

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

// ============= OTP VALIDATION =============

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

// ============= TOPIC VALIDATION =============

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

// ============= PROFILE VALIDATION =============

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
    
    if (data.bio !== undefined && data.bio.length > 500) {
        errors.bio = 'Bio must be less than 500 characters';
    }
    
    if (data.location !== undefined && data.location.length > 100) {
        errors.location = 'Location must be less than 100 characters';
    }
    
    if (data.website !== undefined && data.website) {
        const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
        if (!urlPattern.test(data.website)) {
            errors.website = 'Please enter a valid URL';
        }
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

// ============= PASSWORD CHANGE VALIDATION =============

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
    } else if (!hasSpecialChar(data.newPassword)) {
        errors.newPassword = 'Password must contain at least one special character';
    }
    
    if (!data.confirmPassword) {
        errors.confirmPassword = 'Please confirm your new password';
    } else if (data.newPassword !== data.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
    }
    
    // Check if new password is same as current (optional warning)
    if (data.newPassword && data.currentPassword && data.newPassword === data.currentPassword) {
        errors.newPassword = 'New password must be different from current password';
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

// ============= FORGOT PASSWORD VALIDATION =============

export function validateForgotPassword(email) {
    const errors = {};
    
    if (!email) {
        errors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
        errors.email = 'Please enter a valid email address';
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

// ============= RESET PASSWORD VALIDATION =============

export function validateResetPassword(data) {
    const errors = {};
    
    if (!data.password) {
        errors.password = 'Password is required';
    } else {
        const passwordStrength = getPasswordStrength(data.password);
        if (!passwordStrength.isValid) {
            errors.password = passwordStrength.message;
        }
    }
    
    if (!data.confirmPassword) {
        errors.confirmPassword = 'Please confirm your password';
    } else if (data.password !== data.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

// ============= QUIZ ANSWER VALIDATION =============

export function validateQuizAnswers(answers, totalQuestions) {
    const answeredCount = Object.keys(answers).length;
    const unansweredCount = totalQuestions - answeredCount;
    
    return {
        isValid: unansweredCount === 0,
        answeredCount,
        unansweredCount,
        completed: unansweredCount === 0,
        partial: unansweredCount > 0 && answeredCount > 0,
        empty: answeredCount === 0
    };
}

// ============= NOTE VALIDATION =============

export function validateNote(note) {
    const errors = {};
    
    if (!note.topic) {
        errors.topic = 'Topic is required';
    } else if (note.topic.length < 2) {
        errors.topic = 'Topic must be at least 2 characters';
    } else if (note.topic.length > 100) {
        errors.topic = 'Topic must be less than 100 characters';
    }
    
    if (!note.question) {
        errors.question = 'Question is required';
    } else if (note.question.length < 5) {
        errors.question = 'Question must be at least 5 characters';
    } else if (note.question.length > 500) {
        errors.question = 'Question must be less than 500 characters';
    }
    
    if (!note.answer) {
        errors.answer = 'Answer is required';
    } else if (note.answer.length < 10) {
        errors.answer = 'Answer must be at least 10 characters';
    } else if (note.answer.length > 2000) {
        errors.answer = 'Answer must be less than 2000 characters';
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

// ============= SEARCH VALIDATION =============

export function validateSearch(query) {
    const errors = {};
    
    if (query && query.length > 100) {
        errors.query = 'Search query must be less than 100 characters';
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors,
        sanitizedQuery: query ? query.trim() : ''
    };
}

// ============= URL VALIDATION =============

export function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

// ============= PHONE VALIDATION =============

export function isValidPhone(phone) {
    const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return re.test(phone);
}

// ============= EXPORT =============
export default {
    isValidEmail,
    hasUpperCase,
    hasLowerCase,
    hasNumber,
    hasSpecialChar,
    isStrongPassword,
    getPasswordStrength,
    validateRegistration,
    validateLogin,
    validateOTP,
    validateTopic,
    validateProfileUpdate,
    validatePasswordChange,
    validateForgotPassword,
    validateResetPassword,
    validateQuizAnswers,
    validateNote,
    validateSearch,
    isValidUrl,
    isValidPhone
};