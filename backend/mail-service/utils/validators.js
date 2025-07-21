/**
 * Validate email address format
 */
exports.validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate required fields
 */
exports.validateRequired = (obj, requiredFields) => {
    const missing = [];

    for (const field of requiredFields) {
        if (!obj[field] || (typeof obj[field] === 'string' && obj[field].trim() === '')) {
            missing.push(field);
        }
    }

    return {
        isValid: missing.length === 0,
        missing
    };
};

/**
 * Sanitize string input
 */
exports.sanitizeString = (str) => {
    if (!str || typeof str !== 'string') return str;

    return str
        .trim()
        .replace(/[<>]/g, '') // Remove potential HTML tags
        .slice(0, 1000); // Limit length
};